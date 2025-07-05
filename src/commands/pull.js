const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const { performGachaPull } = require('../data/devilfruit');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Hunt for a Devil Fruit! 🍈'),

    async execute(interaction) {
        try {
            // Generate the Devil Fruit immediately - no cooldown
            const targetFruit = performGachaPull();
            console.log(`🎯 Pull started: ${targetFruit.name} (${targetFruit.rarity}) for ${interaction.user.username}`);
            
            // Start the cinematic experience immediately
            await createUltimateCinematicExperience(interaction, targetFruit, true);

            // Set up button interaction handler
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'huntAgain') {
                        await this.handleHuntAgain(buttonInteraction);
                    } else if (buttonInteraction.customId === 'collection') {
                        await this.showBasicCollection(buttonInteraction);
                    }
                } catch (error) {
                    console.log('Button interaction error:', error);
                    try {
                        if (buttonInteraction.isRepliable()) {
                            await buttonInteraction.followUp({ 
                                content: '❌ An error occurred with the button interaction!', 
                                ephemeral: true 
                            });
                        }
                    } catch (followUpError) {
                        console.log('Failed to send follow-up:', followUpError);
                    }
                }
            });

            collector.on('end', () => {
                // Disable buttons after timeout
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.log('🚨 Pull Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Error')
                .setDescription('Something went wrong with the Devil Fruit hunt! Please try again.')
                .addFields(
                    { name: 'Error Details', value: error.message || 'Unknown error', inline: false }
                )
                .setFooter({ text: 'If this persists, contact an admin.' });
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], components: [] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    async handleHuntAgain(interaction) {
        try {
            // Generate new fruit and start animation immediately - no cooldown
            const newFruit = performGachaPull();
            console.log(`🔄 Hunt Again: ${newFruit.name} (${newFruit.rarity}) for ${interaction.user.username}`);
            
            // Start new cinematic experience
            await createUltimateCinematicExperience(interaction, newFruit, false);

        } catch (error) {
            console.log('Hunt Again error:', error);
            try {
                if (interaction.isRepliable()) {
                    await interaction.followUp({ 
                        content: '❌ Error during hunt again! Please try using `/pull` again.', 
                        ephemeral: true 
                    });
                }
            } catch (followUpError) {
                console.log('Failed to send follow-up:', followUpError);
            }
        }
    },

    async showBasicCollection(interaction) {
        try {
            // Check if interaction is still valid
            if (!interaction.isRepliable()) {
                console.log('Interaction no longer repliable');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📚 Your Devil Fruit Collection')
                .setDescription('Collection system temporarily disabled for testing.\n\nFocus on testing the amazing animations! 🌈\n\nUse `/pull` to see the rainbow progression!')
                .addFields(
                    { name: '🎯 Current Focus', value: 'Testing Animation System', inline: true },
                    { name: '🏆 Goal', value: 'Perfect Rainbow Animations', inline: true },
                    { name: '⚔️ Status', value: 'Animation Testing Mode', inline: true }
                )
                .setFooter({ text: 'Enjoy the cinematic Devil Fruit experience!' });
            
            // Use update instead of reply since this is a button interaction
            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.update({ embeds: [embed], components: [] });
            }

        } catch (error) {
            console.log('Collection display error:', error);
            
            try {
                if (interaction.isRepliable()) {
                    await interaction.followUp({ 
                        content: '❌ Collection temporarily unavailable during testing.', 
                        ephemeral: true 
                    });
                }
            } catch (followUpError) {
                console.log('Failed to send follow-up:', followUpError);
            }
        }
    }
};
