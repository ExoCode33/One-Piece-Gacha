// index.js - COMPLETE FILE with Enhanced Economy System
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Load environment variables
require('dotenv').config();

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Initialize commands collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`⚠️ Command at ${filePath} is missing "data" or "execute" property.`);
    }
}

// Load events
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
}

// Bot ready event - ENHANCED WITH ECONOMY SYSTEM
client.once('ready', async () => {
    console.log(`🏴‍☠️ ${client.user.tag} is ready to sail!`);
    console.log(`📊 Serving ${client.guilds.cache.size} server(s)`);
    console.log(`👥 Connected to ${client.users.cache.size} user(s)`);
    
    // Initialize database
    const DatabaseManager = require('./src/database/manager');
    try {
        await DatabaseManager.initializeDatabase();
        console.log('🗄️ PostgreSQL database ready for Devil Fruit data!');
        
        // Initialize economy system
        try {
            const BerryEconomySystem = require('./src/systems/economy');
            await BerryEconomySystem.initializeBerryTable();
            await BerryEconomySystem.initializePurchaseTable();
            console.log('💰 Berry Economy System initialized!');
        } catch (economyError) {
            console.error('❌ Economy system failed to initialize:', economyError.message);
        }
        
        // Initialize automatic income system
        try {
            const AutomaticIncomeSystem = require('./src/systems/automatic-income');
            await AutomaticIncomeSystem.initialize(client);
            console.log('⏰ Automatic Income System started!');
        } catch (incomeError) {
            console.warn('⚠️ Automatic income system failed to initialize:', incomeError.message);
            console.warn('💰 Manual income collection will still work via /bank command');
        }
        
        // Initialize logging system
        try {
            const ActivityLogger = require('./src/systems/logger');
            await ActivityLogger.initialize(client);
            console.log('📝 Activity logging system initialized!');
        } catch (logError) {
            console.warn('⚠️ Activity logging system failed to initialize:', logError.message);
            console.warn('📝 Bot will continue without logging features');
        }
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.error('🚨 Bot cannot function without database. Please check your DATABASE_URL.');
        process.exit(1);
    }
    
    // Register slash commands
    try {
        console.log('🔄 Registering slash commands...');
        
        const commands = [];
        for (const command of client.commands.values()) {
            commands.push(command.data.toJSON());
        }
        
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        
        console.log('✅ Successfully registered slash commands!');
        console.log(`📝 Commands: ${commands.map(cmd => `/${cmd.name}`).join(', ')}`);
        
    } catch (error) {
        console.error('❌ Failed to register slash commands:', error);
    }

    // Show startup summary
    console.log('\n🎉 SYSTEM STARTUP COMPLETE! 🎉');
    console.log('===============================');
    console.log('🏴‍☠️ One Piece Devil Fruit Gacha Bot');
    console.log('💰 Economy System: ACTIVE');
    console.log('⏰ Auto Income: Every 10 minutes');
    console.log('🍈 Devil Fruits: 150 available');
    console.log('⚔️ Combat System: Strategic battles');
    console.log('📊 Database: PostgreSQL ready');
    console.log('===============================\n');
});

// Error handling
client.on('error', console.error);

process.on('unhandledRejection', (error) => {
    console.error('🚨 Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught exception:', error);
    
    // Try to gracefully shutdown economy system
    try {
        const AutomaticIncomeSystem = require('./src/systems/automatic-income');
        AutomaticIncomeSystem.emergencyStop('Uncaught exception');
    } catch (shutdownError) {
        console.error('Failed to emergency stop economy system:', shutdownError);
    }
    
    process.exit(1);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Graceful shutdown...');
    
    try {
        // Stop automatic income system
        const AutomaticIncomeSystem = require('./src/systems/automatic-income');
        AutomaticIncomeSystem.stop();
        console.log('⏰ Automatic income system stopped');
        
        // Close database connections
        const DatabaseManager = require('./src/database/manager');
        await DatabaseManager.close();
        console.log('🗄️ Database connections closed');
        
        // Destroy Discord client
        client.destroy();
        console.log('🤖 Discord client destroyed');
        
        console.log('✅ Graceful shutdown complete');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error during graceful shutdown:', error);
        process.exit(1);
    }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Failed to login to Discord:', error);
    process.exit(1);
});
