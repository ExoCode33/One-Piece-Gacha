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

/**
 * Clear command cache and re-register commands
 */
async function clearAndRegisterCommands() {
    try {
        console.log('🧹 Clearing old command cache...');
        
        // Clear all existing commands first
        await client.application.commands.set([]);
        console.log('✅ Cleared command cache');
        
        // Wait a moment for Discord to process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('📝 Re-registering commands...');
        
        // Collect all commands
        const commands = [];
        for (const command of client.commands.values()) {
            commands.push(command.data.toJSON());
        }
        
        // Register commands globally
        await client.application.commands.set(commands);
        console.log('✅ Successfully registered slash commands!');
        console.log(`📝 Commands: ${commands.map(cmd => `/${cmd.name}`).join(' and ')}`);
        
    } catch (error) {
        console.error('❌ Failed to clear/register commands:', error);
        throw error;
    }
}
