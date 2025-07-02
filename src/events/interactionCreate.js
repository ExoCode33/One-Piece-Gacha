module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                console.log(`🎮 ${interaction.user.username} used /${interaction.commandName}`);
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`);
                console.error(error);
                
                const errorMessage = {
                    content: '❌ There was an error while executing this command!',
                    ephemeral: true
                };
                
                try {
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp(errorMessage);
                    } else {
                        await interaction.reply(errorMessage);
                    }
                } catch (replyError) {
                    console.error('Failed to send error message:', replyError);
                }
            }
        }
        
        // Handle button interactions
        if (interaction.isButton()) {
            try {
                console.log(`🔘 ${interaction.user.username} clicked button: ${interaction.customId}`);
                
                // Import button handler from pull command
                const { handleButtonInteractions } = require('../commands/pull');
                await handleButtonInteractions(interaction);
                
            } catch (error) {
                console.error('Button interaction error:', error);
                try {
                    await interaction.reply({ 
                        content: '❌ Something went wrong with that button!', 
                        ephemeral: true 
                    });
                } catch (replyError) {
                    console.error('Failed to send button error message:', replyError);
                }
            }
        }
    },
};
