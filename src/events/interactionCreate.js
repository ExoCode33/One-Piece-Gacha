// src/events/interactionCreate.js - Enhanced for Strategic Combat
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

                console.log(`🔤 ${interaction.user.username} used /${interaction.commandName}`);
                await command.execute(interaction);
            }
            
            // Handle button interactions
            else if (interaction.isButton()) {
                console.log(`🔘 ${interaction.user.username} clicked button: ${interaction.customId}`);
                
                // Let individual commands handle their own button interactions
                // This is handled by message component collectors in each command
            }

            // Handle select menu interactions (NEW for strategic combat)
            else if (interaction.isStringSelectMenu()) {
                console.log(`📋 ${interaction.user.username} used select menu: ${interaction.customId}`);
                console.log(`📋 Selected values: ${interaction.values.join(', ')}`);
                
                // Handle fruit selection menus for strategic combat
                if (interaction.customId.startsWith('fruit_select_')) {
                    const CombatSystem = require('../config/combat');
                    
                    // Parse the custom ID to get battle info
                    const idParts = interaction.customId.split('_');
                    const battleType = idParts.slice(2, -1).join('_');
                    const battleId = idParts[idParts.length - 1];
                    
                    console.log(`⚔️ Processing fruit selection for ${battleType} battle: ${battleId}`);
                    
                    try {
                        await CombatSystem.processFruitSelection(
                            interaction, 
                            interaction.values, 
                            battleType, 
                            battleId
                        );
                    } catch (error) {
                        console.error('Combat system fruit selection error:', error);
                        
                        if (!interaction.replied && !interaction.deferred) {
                            await interaction.reply({
                                content: '❌ Error processing fruit selection! Please try again.',
                                ephemeral: true
                            });
                        }
                    }
                }
                
                // Handle other select menus here if needed in the future
                else {
                    console.log(`❓ Unhandled select menu: ${interaction.customId}`);
                }
            }

            // Handle modal submissions (if added in the future)
            else if (interaction.isModalSubmit()) {
                console.log(`📝 ${interaction.user.username} submitted modal: ${interaction.customId}`);
                // Handle modal submissions here
            }

            // Handle autocomplete interactions (if added in the future)
            else if (interaction.isAutocomplete()) {
                console.log(`🔍 ${interaction.user.username} autocomplete: ${interaction.commandName}`);
                // Handle autocomplete here
            }

        } catch (error) {
            console.error('Interaction error:', error);
            
            const errorMessage = {
                content: 'There was an error while executing this interaction!',
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
