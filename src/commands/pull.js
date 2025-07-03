const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const { DevilFruitDatabase } = require('../data/devilfruit');

// User cooldowns and statistics
const userCooldowns = new Map();
const userStats = new Map();

// Cooldown times (in milliseconds)
const COOLDOWNS = {
    single: 5000,    // 5 seconds
    multi: 30000,    // 30 seconds
    premium: 60000   // 60 seconds
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Hunt for Devil Fruits in the Grand Line!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose your hunt type')
                .setRequired(false)
                .addChoices(
                    { name: '🍈 Single Hunt (5s cooldown)', value: 'single' },
                    { name: '🍈x10 Multi Hunt (30s cooldown)', value: 'multi' },
                    { name: '💎 Premium Hunt (60s cooldown, better rates)', value: 'premium' }
                )),

    async execute(interaction) {
        try {
            const huntType = interaction.options.getString('type') || 'single';
            const userId = interaction.user.id;
            const userName = interaction.user.username;

            // Check cooldowns
            const now = Date.now();
            const cooldownKey = `${userId}_${huntType}`;
            
            if (userCooldowns.has(cooldownKey)) {
                const cooldownEnd = userCooldowns.get(cooldownKey);
                if (now < cooldownEnd) {
                    const timeLeft = Math.ceil((cooldownEnd - now) / 1000);
                    return await interaction.reply({
                        content: `⏰ **Cooldown Active!** Wait **${timeLeft}s** before your next ${huntType} hunt!`,
                        ephemeral: true
                    });
                }
            }

            // Set cooldown
            userCooldowns.set(cooldownKey, now + COOLDOWNS[huntType]);

            // Initialize user stats if needed
            if (!userStats.has(userId)) {
                userStats.set(userId, {
                    totalHunts: 0,
                    devilFruits: {},
                    rarityCount: { common: 0, uncommon: 0, rare: 0, legendary: 0, mythical: 0, omnipotent: 0 }
                });
            }

            const stats = userStats.get(userId);
            stats.totalHunts++;

            console.log(`🎮 ${userName} initiated ${huntType} Devil Fruit hunt`);

            // Handle different hunt types
            switch (huntType) {
                case 'single':
                    await handleSingleHunt(interaction);
                    break;
                case 'multi':
                    await handleMultiHunt(interaction);
                    break;
                case 'premium':
                    await handlePremiumHunt(interaction);
                    break;
                default:
                    await handleSingleHunt(interaction);
            }

        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ Hunt Failed!')
                .setDescription('The Grand Line\'s mysteries proved too powerful! Try again when the seas calm.')
                .setColor('#FF4500')
                .setFooter({ text: 'Devil Fruit Hunt System | Please try again' });
            
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};

// Single hunt with full cinematic experience
async function handleSingleHunt(interaction) {
    try {
        // Defer reply for long animation
        await interaction.deferReply();

        // Start the ultimate cinematic experience
        const result = await createUltimateCinematicExperience(interaction);

        // Update user statistics
        const userId = interaction.user.id;
        const stats = userStats.get(userId);
        if (stats && result) {
            stats.rarityCount[result.rarity]++;
            if (!stats.devilFruits[result.devilFruit.id]) {
                stats.devilFruits[result.devilFruit.id] = {
                    ...result.devilFruit,
                    obtainedAt: new Date(),
                    timesObtained: 1
                };
            } else {
                stats.devilFruits[result.devilFruit.id].timesObtained++;
            }
        }

        console.log(`🎊 Single hunt success: ${result.devilFruit.name} (${result.rarity}) for ${interaction.user.username}`);

    } catch (error) {
        console.error('Single hunt error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Sea Monsters Interfered!')
            .setDescription('Your Devil Fruit hunt was disrupted by powerful sea creatures! The Grand Line\'s treasures remain hidden for now.')
            .setColor('#FF4500')
            .setFooter({ text: 'Try again when the waters are calmer...' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

// Multi hunt (10x pulls with summary)
async function handleMultiHunt(interaction) {
    try {
        await interaction.deferReply();

        const results = [];
        const rarityCount = { common: 0, uncommon: 0, rare: 0, legendary: 0, mythical: 0, omnipotent: 0 };

        // Show multi-hunt progress
        const progressEmbed = new EmbedBuilder()
            .setTitle('🍈x10 **MULTI DEVIL FRUIT HUNT INITIATED!** 🍈x10')
            .setDescription(`
⚓🌊⚓🌊⚓🌊⚓🌊⚓🌊

🔍 **Scanning 10 locations across the Grand Line...**
🌊 **Searching for multiple Devil Fruit signatures...**
⚡ **Preparing mass summoning ritual...**

*This may take a moment...*
            `)
            .setColor('#3498DB')
            .setFooter({ text: '🍈x10 Multi Hunt | Searching the vast oceans...' });
        
        await interaction.editReply({ embeds: [progressEmbed] });

        // Generate 10 Devil Fruits
        for (let i = 0; i < 10; i++) {
            const rarity = DevilFruitDatabase.calculateDropRarity();
            const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
            results.push({ devilFruit, rarity });
            rarityCount[rarity]++;
        }

        // Update user stats
        const userId = interaction.user.id;
        const stats = userStats.get(userId);
        if (stats) {
            results.forEach(result => {
                stats.rarityCount[result.rarity]++;
                if (!stats.devilFruits[result.devilFruit.id]) {
                    stats.devilFruits[result.devilFruit.id] = {
                        ...result.devilFruit,
                        obtainedAt: new Date(),
                        timesObtained: 1
                    };
                } else {
                    stats.devilFruits[result.devilFruit.id].timesObtained++;
                }
            });
        }

        // Create summary embed
        const bestRarity = Object.keys(rarityCount).reverse().find(rarity => rarityCount[rarity] > 0);
        const bestConfig = DevilFruitDatabase.getRarityConfig(bestRarity);
        
        let resultsText = '';
        Object.keys(rarityCount).reverse().forEach(rarity => {
            if (rarityCount[rarity] > 0) {
                const config = DevilFruitDatabase.getRarityConfig(rarity);
                resultsText += `${config.emoji} **${config.name}:** ${rarityCount[rarity]}x\n`;
            }
        });

        const summaryEmbed = new EmbedBuilder()
            .setTitle(`${bestConfig.emoji} **10x DEVIL FRUIT HUNT COMPLETE!** ${bestConfig.emoji}`)
            .setDescription(`
🌊⚓🌊⚓🌊⚓🌊⚓🌊⚓🌊⚓🌊

🎊 **MULTI-HUNT RESULTS:**

${resultsText}

**🎯 Best Pull:** ${results.find(r => r.rarity === bestRarity).devilFruit.name}
**📊 Total Fruits:** 10
**⭐ Success Rate:** 100%

*View your collection for detailed fruit information!*
            `)
            .setColor(bestConfig.color)
            .setFooter({ text: `${bestConfig.emoji} Multi Hunt Complete | Best result: ${bestConfig.name} class!` });

        const components = [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('hunt_again')
                        .setLabel('🍈 Hunt Again!')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('view_collection')
                        .setLabel('📚 View Collection')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('detailed_results')
                        .setLabel('📋 Detailed Results')
                        .setStyle(ButtonStyle.Success)
                )
        ];

        await interaction.editReply({ embeds: [summaryEmbed], components });

        console.log(`🎊 Multi hunt complete for ${interaction.user.username}: Best = ${bestRarity}`);

    } catch (error) {
        console.error('Multi hunt error:', error);
        throw error;
    }
}

// Premium hunt with enhanced rates
async function handlePremiumHunt(interaction) {
    try {
        await interaction.deferReply();

        // Premium hunt has better rarity chances
        let rarity = DevilFruitDatabase.calculateDropRarity();
        
        // 25% chance to boost rarity by one level
        if (Math.random() < 0.25) {
            const rarityLevels = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
            const currentIndex = rarityLevels.indexOf(rarity);
            if (currentIndex < rarityLevels.length - 1) {
                rarity = rarityLevels[currentIndex + 1];
            }
        }

        // Show premium hunt intro
        const premiumIntro = new EmbedBuilder()
            .setTitle('💎 **PREMIUM DEVIL FRUIT HUNT INITIATED!** 💎')
            .setDescription(`
💎⭐💎⭐💎⭐💎⭐💎⭐

🌌 **Accessing legendary hunting grounds...**
👑 **Enhanced scanning protocols activated...**
✨ **Premium energy matrices online...**
🎯 **Targeting rare Devil Fruit signatures...**

*Premium hunts have enhanced drop rates!*
            `)
            .setColor('#FFD700')
            .setFooter({ text: '💎 Premium Hunt | Enhanced legendary protocols active...' });

        await interaction.editReply({ embeds: [premiumIntro] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Use the cinematic experience but with premium fruit
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        // Override the normal animation result
        const originalMethod = DevilFruitDatabase.calculateDropRarity;
        DevilFruitDatabase.calculateDropRarity = () => rarity;
        
        const result = await createUltimateCinematicExperience(interaction);
        
        // Restore original method
        DevilFruitDatabase.calculateDropRarity = originalMethod;

        // Update stats
        const userId = interaction.user.id;
        const stats = userStats.get(userId);
        if (stats && result) {
            stats.rarityCount[result.rarity]++;
            if (!stats.devilFruits[result.devilFruit.id]) {
                stats.devilFruits[result.devilFruit.id] = {
                    ...result.devilFruit,
                    obtainedAt: new Date(),
                    timesObtained: 1,
                    isPremium: true
                };
            } else {
                stats.devilFruits[result.devilFruit.id].timesObtained++;
            }
        }

        console.log(`🎊 Premium hunt success: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);

    } catch (error) {
        console.error('Premium hunt error:', error);
        throw error;
    }
}

// Button interaction handler
async function handleButtonInteractions(interaction) {
    try {
        const { customId, user } = interaction;

        switch (customId) {
            case 'hunt_again':
                await interaction.deferUpdate();
                // Re-run the pull command
                const pullCommand = require('./pull');
                await pullCommand.execute(interaction);
                break;

            case 'view_collection':
                await showUserCollection(interaction);
                break;

            case 'share_discovery':
                await shareDiscovery(interaction);
                break;

            case 'detailed_results':
                await showDetailedResults(interaction);
                break;

            default:
                await interaction.reply({
                    content: '❓ Unknown button action!',
                    ephemeral: true
                });
        }

    } catch (error) {
        console.error('Button interaction error:', error);
        await interaction.reply({
            content: '❌ Button action failed!',
            ephemeral: true
        });
    }
}

// Show user's Devil Fruit collection
async function showUserCollection(interaction) {
    const userId = interaction.user.id;
    const stats = userStats.get(userId);

    if (!stats || Object.keys(stats.devilFruits).length === 0) {
        const emptyEmbed = new EmbedBuilder()
            .setTitle('📚 **Your Devil Fruit Collection**')
            .setDescription('🍈 Your collection is empty! Start hunting to collect Devil Fruits!')
            .setColor('#95A5A6')
            .setFooter({ text: 'Use /pull to start your Devil Fruit journey!' });

        return await interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
    }

    // Collection summary
    const totalFruits = Object.keys(stats.devilFruits).length;
    const totalHunts = stats.totalHunts;
    
    let rarityBreakdown = '';
    Object.keys(stats.rarityCount).reverse().forEach(rarity => {
        if (stats.rarityCount[rarity] > 0) {
            const config = DevilFruitDatabase.getRarityConfig(rarity);
            rarityBreakdown += `${config.emoji} **${config.name}:** ${stats.rarityCount[rarity]}x\n`;
        }
    });

    const collectionEmbed = new EmbedBuilder()
        .setTitle(`📚 **${interaction.user.username}'s Devil Fruit Collection**`)
        .setDescription(`
🏴‍☠️ **Collection Stats:**
🍈 **Unique Fruits:** ${totalFruits}
🎯 **Total Hunts:** ${totalHunts}
📊 **Success Rate:** ${Math.round((totalFruits / totalHunts) * 100)}%

**🌟 Rarity Breakdown:**
${rarityBreakdown}

*Use the buttons below to explore your collection!*
        `)
        .setColor('#3498DB')
        .setFooter({ text: `Collection last updated: ${new Date().toLocaleDateString()}` });

    const components = [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('show_rare_fruits')
                    .setLabel('💎 Rare+ Fruits')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('show_all_fruits')
                    .setLabel('📋 All Fruits')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('collection_stats')
                    .setLabel('📊 Detailed Stats')
                    .setStyle(ButtonStyle.Success)
            )
    ];

    await interaction.reply({ embeds: [collectionEmbed], components, ephemeral: true });
}

// Share discovery with others
async function shareDiscovery(interaction) {
    const shareEmbed = new EmbedBuilder()
        .setTitle('📢 **Devil Fruit Discovery Shared!**')
        .setDescription(`🎉 ${interaction.user.username} found an incredible Devil Fruit! Check out their amazing discovery above!`)
        .setColor('#E67E22')
        .setFooter({ text: '🍈 Join the hunt with /pull!' });

    await interaction.reply({ embeds: [shareEmbed] });
}

// Show detailed multi-hunt results
async function showDetailedResults(interaction) {
    // This would show individual fruits from the multi-hunt
    const detailsEmbed = new EmbedBuilder()
        .setTitle('📋 **Detailed Multi-Hunt Results**')
        .setDescription('🚧 Detailed results feature coming soon! For now, check your collection to see all acquired fruits.')
        .setColor('#9B59B6')
        .setFooter({ text: 'Feature in development...' });

    await interaction.reply({ embeds: [detailsEmbed], ephemeral: true });
}

module.exports.handleButtonInteractions = handleButtonInteractions;
