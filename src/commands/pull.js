const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { performGachaPull, getFruitById, RARITY_CONFIG } = require('../data/devilfruit');

// Simple in-memory cooldown store (resets on bot restart)
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Hunt for a Devil Fruit! 🍈'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            
            // Simple in-memory cooldown check (1 hour)
            const cooldownTime = 3600000; // 1 hour
            const lastPull = cooldowns.get(userId);
            
            if (lastPull && Date.now() - lastPull < cooldownTime) {
                const remainingTime = Math.ceil((cooldownTime - (Date.now() - lastPull)) / 1000 / 60);
                const embed = new EmbedBuilder()
                    .setColor(0xff6b6b)
                    .setTitle('🕐 Devil Fruit Hunt Cooldown')
                    .setDescription(`You need to wait **${remainingTime} minutes** before hunting again!`)
                    .setFooter({ text: 'Come back when your energy has recovered!' });
                
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Set new cooldown
            cooldowns.set(userId, Date.now());

            // Generate the Devil Fruit
            const targetFruit = performGachaPull();
            console.log(`🎯 Pull started: ${targetFruit.name} (${targetFruit.rarity}) for ${interaction.user.username}`);
            
            // Start the cinematic experience
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
                        await this.showCollection(buttonInteraction);
                    }
                } catch (error) {
                    console.log('Button interaction error:', error);
                    await buttonInteraction.reply({ 
                        content: '❌ An error occurred with the button interaction!', 
                        ephemeral: true 
                    });
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
            const userId = interaction.user.id;
            
            // Simple cooldown check
            const cooldownTime = 3600000; // 1 hour
            const lastPull = cooldowns.get(userId);
            
            if (lastPull && Date.now() - lastPull < cooldownTime) {
                const remainingTime = Math.ceil((cooldownTime - (Date.now() - lastPull)) / 1000 / 60);
                
                const cooldownEmbed = new EmbedBuilder()
                    .setColor(0xff6b6b)
                    .setTitle('🕐 Hunt Again Cooldown')
                    .setDescription(`You need to wait **${remainingTime} minutes** before hunting again!\n\nUse this time to:\n🔍 View your collection\n📊 Plan your strategy\n⚔️ Check your combat power`)
                    .setFooter({ text: 'Patience makes the heart grow stronger!' });
                
                return await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            // Set new cooldown
            cooldowns.set(userId, Date.now());

            // Generate new fruit and start animation
            const newFruit = performGachaPull();
            console.log(`🔄 Hunt Again: ${newFruit.name} (${newFruit.rarity}) for ${interaction.user.username}`);
            
            // Start new cinematic experience
            await createUltimateCinematicExperience(interaction, newFruit, false);

        } catch (error) {
            console.log('Hunt Again error:', error);
            await interaction.reply({ 
                content: '❌ Error during hunt again! Please try using `/pull` again.', 
                ephemeral: true 
            });
        }
    },

    async showCollection(interaction) {
        try {
            const userId = interaction.user.id;
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
                
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Process fruits data
            const fruitCounts = {};
            let totalPower = 0;
            
            userFruits.forEach(fruit => {
                const fruitId = fruit.fruit_id;
                if (!fruitCounts[fruitId]) {
                    fruitCounts[fruitId] = {
                        count: 0,
                        rarity: fruit.rarity,
                        name: fruit.name || getFruitById(fruitId)?.name || 'Unknown',
                        combatPower: fruit.combat_power || getFruitById(fruitId)?.combatPower || 100
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

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.log('Collection display error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Error')
                .setDescription('Unable to load your collection. Please try again.');
            
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
