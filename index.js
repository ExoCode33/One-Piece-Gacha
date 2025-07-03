const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Create a collection for commands
client.commands = new Collection();

// Load commands from commands folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`⚠️ [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
    console.log(`🚀 Ready! Logged in as ${readyClient.user.tag}`);
    console.log(`🎮 Bot is online and ready to serve ${client.guilds.cache.size} guild(s)`);
    
    // Set bot status
    client.user.setPresence({
        activities: [{ name: 'for Devil Fruits | /pull', type: 3 }], // Type 3 = Watching
        status: 'online',
    });
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`❌ No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
                console.log(`✅ Command executed: ${interaction.commandName} by ${interaction.user.username}`);
            } catch (error) {
                console.error(`❌ Error executing command ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: '❌ There was an error while executing this command!',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        } else if (interaction.isButton()) {
            // Handle button interactions
            await handleButtonInteractions(interaction);
        }
    } catch (error) {
        console.error('❌ Interaction error:', error);
    }
});

// Handle button interactions
async function handleButtonInteractions(interaction) {
    try {
        const { customId } = interaction;
        
        // Check if it's a pull command button
        if (['hunt_again', 'view_collection', 'share_discovery', 'debug_info', 'detailed_results'].includes(customId)) {
            const pullCommand = client.commands.get('pull');
            if (pullCommand && pullCommand.handleButtonInteractions) {
                await pullCommand.handleButtonInteractions(interaction);
            } else {
                console.error('❌ Pull command button handler not found');
                await interaction.reply({
                    content: '❌ Button handler not available!',
                    ephemeral: true
                });
            }
        } else if (['debug_test_pull', 'debug_change_rarity', 'debug_disable'].includes(customId)) {
            // Handle admin debug buttons
            await handleAdminButtons(interaction);
        } else {
            console.log(`❓ Unknown button: ${customId}`);
            await interaction.reply({
                content: '❓ Unknown button action!',
                ephemeral: true
            });
        }
    } catch (error) {
        console.error('❌ Button interaction error:', error);
        await interaction.reply({
            content: '❌ Button action failed!',
            ephemeral: true
        });
    }
}

// Handle admin debug buttons
async function handleAdminButtons(interaction) {
    try {
        const { customId } = interaction;
        
        // Get admin command
        const adminCommand = client.commands.get('admin');
        if (!adminCommand) {
            return await interaction.reply({
                content: '❌ Admin command not found!',
                ephemeral: true
            });
        }
        
        // Get debug config
        const debugConfig = adminCommand.getDebugConfig();
        
        switch (customId) {
            case 'debug_test_pull':
                await interaction.reply({
                    content: '🧪 **Test Pull Initiated!** Use `/pull` to test the current debug settings.',
                    ephemeral: true
                });
                break;
                
            case 'debug_change_rarity':
                await interaction.reply({
                    content: '🔄 **Change Rarity:** Use `/admin debug` command to modify the forced rarity setting.',
                    ephemeral: true
                });
                break;
                
            case 'debug_disable':
                // Disable debug mode
                debugConfig.enabled = false;
                debugConfig.forcedRarity = null;
                
                await interaction.reply({
                    content: '❌ **Debug Mode Disabled!** All settings have been reset to normal.',
                    ephemeral: true
                });
                console.log('🔧 Debug mode disabled via button');
                break;
                
            default:
                await interaction.reply({
                    content: '❓ Unknown admin button!',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error('❌ Admin button error:', error);
        await interaction.reply({
            content: '❌ Admin button action failed!',
            ephemeral: true
        });
    }
}

// Error handling
process.on('unhandledRejection', error => {
    console.error('🚨 Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('🚨 Uncaught exception:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT. Gracefully shutting down...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM. Gracefully shutting down...');
    client.destroy();
    process.exit(0);
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN || 'YOUR_BOT_TOKEN_HERE');

// Export client for testing purposes
module.exports = client;
