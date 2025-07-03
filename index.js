require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Auto-register commands on startup
async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('pull')
            .setDescription('Pull a One Piece character from the gacha!')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('admin')
            .setDescription('Admin commands for bot management')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('debug')
                    .setDescription('Debug mode and rarity testing controls')
                    .addStringOption(option =>
                        option.setName('mode')
                            .setDescription('Debug mode setting')
                            .setRequired(true)
                            .addChoices(
                                { name: 'Enable Debug Mode', value: 'on' },
                                { name: 'Disable Debug Mode', value: 'off' },
                                { name: 'Status', value: 'status' }
                            ))
                    .addStringOption(option =>
                        option.setName('rarity')
                            .setDescription('Force specific rarity (requires debug mode enabled)')
                            .setRequired(false)
                            .addChoices(
                                { name: '⬜ Common', value: 'common' },
                                { name: '🟩 Uncommon', value: 'uncommon' },
                                { name: '🟦 Rare', value: 'rare' },
                                { name: '🟨 Legendary', value: 'legendary' },
                                { name: '🟥 Mythical', value: 'mythical' },
                                { name: '🌈 Omnipotent', value: 'omnipotent' },
                                { name: '🎲 Random (Off)', value: 'off' }
                            )))
            .toJSON()
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Successfully registered slash commands!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

// Create Discord client
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// Create commands collection
client.commands = new Collection();

// Load commands with better error handling
const commandsPath = path.join(__dirname, 'src', 'commands');

try {
    if (fs.existsSync(commandsPath)) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            try {
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(`✅ Loaded command: ${command.data.name}`);
                } else {
                    console.warn(`⚠️ Command ${file} is missing data or execute property`);
                }
            } catch (error) {
                console.error(`❌ Error loading command ${file}:`, error.message);
            }
        }
    } else {
        console.error(`❌ Commands directory not found: ${commandsPath}`);
    }
} catch (error) {
    console.error('❌ Error loading commands:', error);
}

// Load events with better error handling
const eventsPath = path.join(__dirname, 'src', 'events');

try {
    if (fs.existsSync(eventsPath)) {
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            try {
                const event = require(filePath);
                
                if ('name' in event && 'execute' in event) {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args));
                    }
                    console.log(`✅ Loaded event: ${event.name}`);
                } else {
                    console.warn(`⚠️ Event ${file} is missing name or execute property`);
                }
            } catch (error) {
                console.error(`❌ Error loading event ${file}:`, error.message);
            }
        }
    } else {
        console.error(`❌ Events directory not found: ${eventsPath}`);
    }
} catch (error) {
    console.error('❌ Error loading events:', error);
}

// Bot ready
client.once('ready', async () => {
    console.log(`🏴‍☠️ ${client.user.tag} is ready to sail!`);
    console.log(`📊 Serving ${client.guilds.cache.size} server(s)`);
    console.log(`👥 Connected to ${client.users.cache.size} user(s)`);
    
    // Auto-register commands when bot starts
    await registerCommands();
    
    // Set bot status
    client.user.setActivity('🏴‍☠️ One Piece Gacha', { type: 'PLAYING' });
});

// Enhanced error handling
client.on('error', (error) => {
    console.error('❌ Discord client error:', error);
});

client.on('warn', (warning) => {
    console.warn('⚠️ Discord client warning:', warning);
});

// Handle process termination gracefully
process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
    process.exit(1);
});

// Login with better error handling
async function startBot() {
    try {
        if (!process.env.DISCORD_TOKEN) {
            throw new Error('DISCORD_TOKEN is not set in environment variables');
        }
        
        if (!process.env.CLIENT_ID) {
            throw new Error('CLIENT_ID is not set in environment variables');
        }
        
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('❌ Failed to start bot:', error.message);
        console.error('💡 Make sure your .env file has DISCORD_TOKEN and CLIENT_ID set correctly');
        process.exit(1);
    }
}

startBot();
