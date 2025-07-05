module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // Handle slash commands
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                await command.execute(interaction);
            }
            
            // Handle button interactions
            else if (interaction.isButton()) {
                // Button interactions are handled by collectors in the individual commands
                // No need for global button handling here
                console.log(`🔘 ${interaction.user.username} clicked button: ${interaction.customId}`);
            }

        } catch (error) {
            console.error('Interaction error:', error);
            
            const errorMessage = {
                content: 'There was an error while executing this command!',
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
    },
};
