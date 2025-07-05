const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Create commands collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error.message);
    }
}

// Load events
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.name}`);
    } catch (error) {
        console.error(`❌ Error loading event ${file}:`, error.message);
    }
}

// Bot ready event
client.once('ready', async () => {
    console.log(`🏴‍☠️ ${client.user.tag} is ready to sail!`);
    console.log(`📊 Serving ${client.guilds.cache.size} server(s)`);
    console.log(`👥 Connected to ${client.users.cache.size} user(s)`);
    
    // Initialize database using the persistent DatabaseManager method
    try {
        const DatabaseManager = require('./src/database/manager');
        await DatabaseManager.initializeDatabase();
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('⚠️ Bot will continue but data will not persist!');
    }

    // Initialize activity logging system
    try {
        const ActivityLogger = require('./src/systems/logger');
        await ActivityLogger.initialize(client);
    } catch (error) {
        console.error('❌ Activity logger initialization failed:', error.message);
        console.log('⚠️ Bot will continue but activity logging may not work!');
    }

    // Validate economy configuration
    try {
        const EconomyConfig = require('./src/config/economy');
        const configIssues = EconomyConfig.validate();
        if (configIssues.length > 0) {
            console.warn('⚠️ Economy configuration issues:');
            configIssues.forEach(issue => console.warn(`  - ${issue}`));
        } else {
            console.log('✅ Economy configuration validated');
        }
    } catch (error) {
        console.error('❌ Economy configuration validation failed:', error.message);
    } Database initialization failed:', error.message);
        console.log('⚠️ Bot will continue but data will not persist!');
    }
    
    // Register slash commands
    try {
        console.log('🔄 Registering slash commands...');
        
        const commands = [];
        for (const command of client.commands.values()) {
            commands.push(command.data.toJSON());
        }
        
        // Register commands globally
        await client.application.commands.set(commands);
        console.log('✅ Successfully registered slash commands!');
        console.log(`📝 Commands: ${commands.map(cmd => `/${cmd.name}`).join(', ')}`);
        
    } catch (error) {
        console.error('❌ Failed to register slash commands:', error);
    }
});

// Handle process termination
process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    
    try {
        const DatabaseManager = require('./src/database/manager');
        await DatabaseManager.cleanup();
        await DatabaseManager.close();
        console.log('✅ Database connections closed');
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
    }
    
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    
    try {
        const DatabaseManager = require('./src/database/manager');
        await DatabaseManager.cleanup();
        await DatabaseManager.close();
        console.log('✅ Database connections closed');
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
    }
    
    client.destroy();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
