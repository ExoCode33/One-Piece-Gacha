const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { performGachaPull, getFruitById, RARITY_CONFIG } = require('../data/devilfruit');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Hunt for a Devil Fruit! 🍈'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            
            // Check cooldown (1 hour = 3600000 ms)
            const cooldownKey = `pull_${userId}`;
            const lastPull = await DatabaseManager.getCooldown(cooldownKey);
            const cooldownTime = 3600000; // 1 hour
            
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
            await DatabaseManager.setCooldown(cooldownKey, Date.now());

            // Generate the Devil Fruit
            const targetFruit = performGachaPull();
            
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
            
            // Check cooldown for hunt again
            const cooldownKey = `pull_${userId}`;
            const lastPull = await DatabaseManager.getCooldown(cooldownKey);
            const cooldownTime = 3600000; // 1 hour
            
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
            await DatabaseManager.setCooldown(cooldownKey, Date.now());

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
                        name: fruit.name || 'Unknown',
                        combatPower: fruit.combat_power || 100
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

            // Create buttons for more actions
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('fullCollection')
                        .setLabel('📋 Full Collection')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('rarityStats')
                        .setLabel('📈 Rarity Stats')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('powerAnalysis')
                        .setLabel('⚔️ Power Analysis')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });

            // Handle sub-collection buttons
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 120000 // 2 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'fullCollection') {
                        await this.showFullCollection(buttonInteraction, fruitCounts);
                    } else if (buttonInteraction.customId === 'rarityStats') {
                        await this.showRarityStats(buttonInteraction, fruitCounts);
                    } else if (buttonInteraction.customId === 'powerAnalysis') {
                        await this.showPowerAnalysis(buttonInteraction, fruitCounts, totalPower);
                    }
                } catch (error) {
                    console.log('Collection button error:', error);
                    await buttonInteraction.reply({ 
                        content: '❌ Error loading that information!', 
                        ephemeral: true 
                    });
                }
            });

        } catch (error) {
            console.log('Collection display error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Error')
                .setDescription('Unable to load your collection. Please try again.');
            
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    async showFullCollection(interaction, fruitCounts) {
        // Sort all fruits
        const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
        const sortedFruits = Object.entries(fruitCounts)
            .sort(([, a], [, b]) => {
                const rarityDiff = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
                if (rarityDiff !== 0) return rarityDiff;
                return b.count - a.count;
            });

        const rarityEmojis = {
            common: '⚪', uncommon: '🟢', rare: '🔵',
            epic: '🟣', legendary: '🟡', mythical: '🔴', omnipotent: '⭐'
        };

        // Create pages for full collection
        const itemsPerPage = 25;
        const totalPages = Math.ceil(sortedFruits.length / itemsPerPage);
        let currentPage = 0;

        const generatePage = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const pageFruits = sortedFruits.slice(start, end);

            const fruitList = pageFruits
                .map(([fruitId, data]) => {
                    const emoji = rarityEmojis[data.rarity] || '❓';
                    const countText = data.count > 1 ? ` x${data.count}` : '';
                    return `${emoji} ${data.name}${countText}`;
                })
                .join('\n');

            return new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📋 Complete Devil Fruit Collection')
                .setDescription(fruitList || 'No fruits on this page')
                .setFooter({ 
                    text: `Page ${page + 1} of ${totalPages} • ${sortedFruits.length} unique fruits total` 
                });
        };

        const embed = generatePage(currentPage);
        
        // Add navigation buttons if multiple pages
        let components = [];
        if (totalPages > 1) {
            const navRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prevPage')
                        .setLabel('◀️ Previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('nextPage')
                        .setLabel('Next ▶️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(currentPage === totalPages - 1)
                );
            components = [navRow];
        }

        await interaction.reply({ embeds: [embed], components, ephemeral: true });
    },

    async showRarityStats(interaction, fruitCounts) {
        const rarityStats = {};
        const rarityEmojis = {
            common: '⚪', uncommon: '🟢', rare: '🔵',
            epic: '🟣', legendary: '🟡', mythical: '🔴', omnipotent: '⭐'
        };

        // Count fruits by rarity
        Object.values(fruitCounts).forEach(fruit => {
            if (!rarityStats[fruit.rarity]) {
                rarityStats[fruit.rarity] = { unique: 0, total: 0 };
            }
            rarityStats[fruit.rarity].unique++;
            rarityStats[fruit.rarity].total += fruit.count;
        });

        // Expected distribution from RARITY_CONFIG
        const expectedDistribution = {
            common: 50, uncommon: 37, rare: 16, epic: 13,
            legendary: 9, mythical: 3, omnipotent: 2
        };

        const statsText = Object.entries(expectedDistribution)
            .map(([rarity, expected]) => {
                const stats = rarityStats[rarity] || { unique: 0, total: 0 };
                const completion = Math.round((stats.unique / expected) * 100);
                const emoji = rarityEmojis[rarity];
                return `${emoji} **${rarity.toUpperCase()}**: ${stats.unique}/${expected} (${completion}%) - ${stats.total} total`;
            })
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('📈 Collection Rarity Statistics')
            .setDescription(statsText)
            .setFooter({ text: 'Complete all rarities to become the ultimate collector!' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    async showPowerAnalysis(interaction, fruitCounts, totalPower) {
        // Analyze power distribution
        const powerByRarity = {};
        Object.values(fruitCounts).forEach(fruit => {
            if (!powerByRarity[fruit.rarity]) {
                powerByRarity[fruit.rarity] = 0;
            }
            const duplicateBonus = 1 + (fruit.count - 1) * 0.01;
            powerByRarity[fruit.rarity] += Math.floor(fruit.combatPower * duplicateBonus * fruit.count);
        });

        const rarityEmojis = {
            common: '⚪', uncommon: '🟢', rare: '🔵',
            epic: '🟣', legendary: '🟡', mythical: '🔴', omnipotent: '⭐'
        };

        const powerBreakdown = Object.entries(powerByRarity)
            .sort(([, a], [, b]) => b - a)
            .map(([rarity, power]) => {
                const percentage = Math.round((power / totalPower) * 100);
                return `${rarityEmojis[rarity]} **${rarity.toUpperCase()}**: ${power.toLocaleString()} CP (${percentage}%)`;
            })
            .join('\n');

        // Calculate potential with full collection
        const avgPowerByRarity = {
            common: 250, uncommon: 435, rare: 750, epic: 1070,
            legendary: 1350, mythical: 1520, omnipotent: 1590
        };

        const potentialPower = Object.entries(avgPowerByRarity).reduce((sum, [rarity, avgPower]) => {
            const expected = { common: 50, uncommon: 37, rare: 16, epic: 13, legendary: 9, mythical: 3, omnipotent: 2 }[rarity];
            return sum + (avgPower * expected);
        }, 0);

        const embed = new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle('⚔️ Combat Power Analysis')
            .setDescription(`**Total Combat Power**: ${totalPower.toLocaleString()} CP\n**Potential at 100%**: ${potentialPower.toLocaleString()} CP\n**Current Progress**: ${Math.round((totalPower / potentialPower) * 100)}%`)
            .addFields(
                { name: '🔥 Power by Rarity', value: powerBreakdown || 'No power yet!', inline: false },
                { name: '💡 Tip', value: 'Collect duplicates for +1% CP bonus per duplicate!', inline: false }
            )
            .setFooter({ text: 'Grow stronger with every Devil Fruit!' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
