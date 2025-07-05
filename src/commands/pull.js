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

            const userId = interaction.user.id;
            const DatabaseManager = require('../database/manager');
            const { getFruitById } = require('../data/devilfruit');

            const userFruits = await DatabaseManager.getUserFruits(userId);
            
            if (userFruits.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0x95a5a6)
                    .setTitle('📚 Your Devil Fruit Collection')
                    .setDescription('Your collection is empty! Use `/pull` to hunt for Devil Fruits.')
                    .addFields(
                        { name: '🎯 Goal', value: 'Collect all 150 Devil Fruits!', inline: true },
                        { name: '🏆 Progress', value: '0/150 (0%)', inline: true },
                        { name: '⚔️ Total Power', value: '0 CP', inline: true }
                    )
                    .setFooter({ text: 'Start your journey to become the Pirate King!' });
                
                await interaction.followUp({ embeds: [embed], ephemeral: true });
                return;
            }

            // Process fruits data
            const fruitCounts = {};
            let totalPower = 0;
            
            userFruits.forEach(fruit => {
                const fruitId = fruit.fruit_id;
                if (!fruitCounts[fruitId]) {
                    const fruitData = getFruitById(fruitId);
                    fruitCounts[fruitId] = {
                        count: 0,
                        rarity: fruit.rarity || fruitData?.rarity || 'unknown',
                        name: fruit.name || fruitData?.name || 'Unknown',
                        combatPower: fruit.combat_power || fruitData?.combatPower || 100
                    };
                }
                fruitCounts[fruitId].count++;
                
                // Calculate power with duplicate bonus
                const duplicateBonus = 1 + (fruitCounts[fruitId].count - 1) * 0.01;
                totalPower += Math.floor(fruitCounts[fruitId].combatPower * duplicateBonus);
            });

            const uniqueFruits = Object.keys(fruitCounts).length;
            const totalFruits = userFruits.length;
            const completionPercent = Math.round((uniqueFruits / 150) * 100);

            // Sort fruits by rarity and count
            const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
            const sortedFruits = Object.entries(fruitCounts)
                .sort(([, a], [, b]) => {
                    const rarityDiff = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
                    if (rarityDiff !== 0) return rarityDiff;
                    return b.count - a.count; // Then by count
                });

            // Create display list
            const rarityEmojis = {
                common: '⚪',
                uncommon: '🟢', 
                rare: '🔵',
                epic: '🟣',
                legendary: '🟡',
                mythical: '🔴',
                omnipotent: '⭐'
            };

            // Show top fruits (up to 15)
            const displayFruits = sortedFruits
                .slice(0, 15)
                .map(([fruitId, data]) => {
                    const emoji = rarityEmojis[data.rarity] || '❓';
                    const countText = data.count > 1 ? ` x${data.count}` : '';
                    const duplicateBonus = data.count > 1 ? ` (+${(data.count - 1)}% CP)` : '';
                    return `${emoji} ${data.name}${countText}${duplicateBonus}`;
                })
                .join('\n');

            // Count by rarity
            const rarityBreakdown = {};
            Object.values(fruitCounts).forEach(fruit => {
                rarityBreakdown[fruit.rarity] = (rarityBreakdown[fruit.rarity] || 0) + 1;
            });

            const rarityDisplay = Object.entries(rarityBreakdown)
                .sort(([a], [b]) => rarityOrder.indexOf(a) - rarityOrder.indexOf(b))
                .filter(([, count]) => count > 0)
                .map(([rarity, count]) => `${rarityEmojis[rarity]} ${rarity}: ${count}`)
                .join(' • ');

            // Create main embed
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📚 Your Devil Fruit Collection')
                .setDescription(`🏆 **Collection Progress: ${uniqueFruits}/150 (${completionPercent}%)**\n📊 **Total Fruits:** ${totalFruits}\n⚔️ **Total Combat Power:** ${totalPower.toLocaleString()} CP`)
                .addFields(
                    { 
                        name: '🌟 Your Top Fruits', 
                        value: displayFruits || 'No fruits yet!', 
                        inline: false 
                    },
                    { 
                        name: '📈 Rarity Breakdown', 
                        value: rarityDisplay || 'No fruits collected', 
                        inline: false 
                    }
                )
                .setFooter({ 
                    text: sortedFruits.length > 15 ? 
                        `Showing top 15 fruits • ${sortedFruits.length - 15} more in your collection` :
                        'Your complete collection is shown above' 
                })
                .setTimestamp();

            // Add progress bar
            const progressBarLength = 20;
            const filledBars = Math.floor((uniqueFruits / 150) * progressBarLength);
            const emptyBars = progressBarLength - filledBars;
            const progressBar = '🟩'.repeat(filledBars) + '⬜'.repeat(emptyBars);
            
            embed.addFields({ 
                name: '📊 Collection Progress', 
                value: `${progressBar}\n${uniqueFruits}/150 unique fruits`, 
                inline: false 
            });

            // Use followUp instead of update/editReply since this is a button interaction
            await interaction.followUp({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.log('Collection display error:', error);
            
            try {
                if (interaction.isRepliable()) {
                    await interaction.followUp({ 
                        content: '❌ Error loading collection. Please try again!', 
                        ephemeral: true 
                    });
                }
            } catch (followUpError) {
                console.log('Failed to send follow-up:', followUpError);
            }
        }
    }
};
