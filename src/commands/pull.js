const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const { DevilFruitDatabase } = require('../data/devilfruit');
const { CombatSystem, LevelSystem } = require('../data/counter-system');

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
                        content: `⏰ **Cooldown Active!** Wait **${timeLeft}s** before your next ${huntType} hunt!\n\n*The Grand Line's mysteries need time to regenerate...*`,
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
                    rarityCount: { common: 0, uncommon: 0, rare: 0, legendary: 0, mythical: 0, omnipotent: 0 },
                    typeCount: { 'Paramecia': 0, 'Zoan': 0, 'Logia': 0, 'Ancient Zoan': 0, 'Mythical Zoan': 0, 'Special Paramecia': 0 }
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
                .setDescription(`
🌊 **The Grand Line rejected your hunt!**

**Error:** ${error.message}

*The seas are too turbulent right now. Try again when the waters calm...*
                `)
                .setColor('#E74C3C')
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
    }
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
            stats.typeCount[result.devilFruit.type] = (stats.typeCount[result.devilFruit.type] || 0) + 1;
            
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
            .setDescription(`
🌊 **Your Devil Fruit hunt was disrupted!**

Powerful sea creatures have interfered with your hunt. The Grand Line's treasures remain hidden for now.

*Try again when the waters are calmer...*
            `)
            .setColor('#E74C3C')
            .setFooter({ text: 'Hunt disrupted by sea monsters' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

// Multi hunt (10x pulls with summary)
async function handleMultiHunt(interaction) {
    try {
        await interaction.deferReply();

        const mockEmbed = new EmbedBuilder()
            .setTitle('🍈x10 **MULTI HUNT SYSTEM** 🍈x10')
            .setDescription(`
🚧 **Multi Hunt is currently being implemented!**

The **10x Multi Hunt** system will allow you to:
• Pull 10 Devil Fruits in one command
• See a summary of all your results
• Get guaranteed rare+ fruits in each multi
• Animated reveal of your best pulls

*For now, use single hunts to collect Devil Fruits!*
            `)
            .setColor('#3498DB')
            .setFooter({ text: 'Multi Hunt System | Coming Soon!' });

        await interaction.editReply({ embeds: [mockEmbed] });
        console.log(`🎊 Multi hunt placeholder for ${interaction.user.username}`);

    } catch (error) {
        console.error('Multi hunt error:', error);
        throw error;
    }
}

// Premium hunt (better rates, longer cooldown)
async function handlePremiumHunt(interaction) {
    try {
        await interaction.deferReply();

        const mockEmbed = new EmbedBuilder()
            .setTitle('💎 **PREMIUM HUNT SYSTEM** 💎')
            .setDescription(`
🚧 **Premium Hunt is currently being implemented!**

The **Premium Hunt** system will offer:
• Higher chances for rare+ Devil Fruits
• Exclusive access to special animations
• Premium-only Devil Fruit variants
• Enhanced collection bonuses

*For now, use single hunts to collect Devil Fruits!*
            `)
            .setColor('#9B59B6')
            .setFooter({ text: 'Premium Hunt System | Coming Soon!' });

        await interaction.editReply({ embeds: [mockEmbed] });
        console.log(`🎊 Premium hunt placeholder for ${interaction.user.username}`);

    } catch (error) {
        console.error('Premium hunt error:', error);
        throw error;
    }
}

// Button interaction handler
async function handleButtonInteractions(interaction) {
    try {
        const { customId } = interaction;

        switch (customId) {
            case 'hunt_again':
                await handleHuntAgain(interaction);
                break;

            case 'view_collection':
                await showUserCollection(interaction);
                break;

            // Removed 'share_discovery' case since we removed the button

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
            content: '❌ Button action failed! Please try using the /pull command instead.',
            ephemeral: true
        });
    }
}

// UPDATED: Hunt again executes a new pull automatically
async function handleHuntAgain(interaction) {
    try {
        // Check cooldown first
        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownKey = `${userId}_single`;
        
        if (userCooldowns.has(cooldownKey)) {
            const cooldownEnd = userCooldowns.get(cooldownKey);
            if (now < cooldownEnd) {
                const timeLeft = Math.ceil((cooldownEnd - now) / 1000);
                return await interaction.reply({
                    content: `⏰ **Cooldown Active!** Wait **${timeLeft}s** before hunting again!`,
                    ephemeral: true
                });
            }
        }

        // Set new cooldown
        userCooldowns.set(cooldownKey, now + COOLDOWNS.single);
        
        // Update stats
        const stats = userStats.get(userId);
        if (stats) {
            stats.totalHunts++;
        }

        // Send a new message and start the hunt animation
        const newInteraction = await interaction.reply({
            content: '🍈 **Starting new hunt...**',
            fetchReply: true
        });

        // Create a mock interaction object for the animation system
        const mockInteraction = {
            user: interaction.user,
            editReply: async (options) => {
                return await interaction.editReply(options);
            },
            replied: false,
            deferred: false
        };

        // Defer the new interaction
        mockInteraction.deferred = true;

        // Start the hunt animation
        const result = await createUltimateCinematicExperience(mockInteraction);
        
        // Update user statistics
        if (stats && result) {
            stats.rarityCount[result.rarity]++;
            stats.typeCount[result.devilFruit.type] = (stats.typeCount[result.devilFruit.type] || 0) + 1;
            
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

        console.log(`🎊 Hunt again success: ${result.devilFruit.name} (${result.rarity}) for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Hunt again error:', error);
        await interaction.reply({
            content: '❌ Unable to start new hunt! Please use `/pull` command.',
            ephemeral: true
        });
    }
}

// ENHANCED: Show professional collection with level-boosted combat power
async function showUserCollection(interaction) {
    const userId = interaction.user.id;
    const stats = userStats.get(userId);

    if (!stats || Object.keys(stats.devilFruits).length === 0) {
        const emptyEmbed = new EmbedBuilder()
            .setTitle('📚 **Your Devil Fruit Collection**')
            .setDescription(`
🍈 **Your collection is empty!**

Start your journey on the Grand Line by hunting for Devil Fruits!

*Use \`/pull\` to begin your Devil Fruit adventure!*
            `)
            .setColor('#95A5A6')
            .setFooter({ text: 'Start hunting to build your collection!' });

        return await interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
    }

    // Get user's battle profile with level integration
    const battleProfile = LevelSystem.getUserBattleProfile(stats, interaction.member);
    
    const totalFruits = Object.keys(stats.devilFruits).length;
    const totalHunts = stats.totalHunts;
    const discoveryRate = Math.round((totalFruits / totalHunts) * 100);

    // Find strongest fruit
    let strongestFruit = null;
    let strongestPower = 0;
    
    Object.values(stats.devilFruits).forEach(fruit => {
        if (fruit.powerLevel > strongestPower) {
            strongestPower = fruit.powerLevel;
            strongestFruit = fruit;
        }
    });

    // Combat power ranking with level consideration
    let powerRank = 'Rookie';
    const totalCP = battleProfile.totalCombatPower;
    if (totalCP >= 100000) powerRank = 'Yonko';
    else if (totalCP >= 50000) powerRank = 'Admiral';
    else if (totalCP >= 25000) powerRank = 'Warlord';
    else if (totalCP >= 12000) powerRank = 'Supernova';
    else if (totalCP >= 6000) powerRank = 'Captain';
    else if (totalCP >= 3000) powerRank = 'Elite Pirate';
    else if (totalCP >= 1500) powerRank = 'Bounty Hunter';

    // Type breakdown with combat analysis
    let typeBreakdown = '';
    const typeEmojis = {
        'Paramecia': '🔮',
        'Zoan': '🐺', 
        'Logia': '🌪️',
        'Ancient Zoan': '🦕',
        'Mythical Zoan': '🐉',
        'Special Paramecia': '✨'
    };
    
    // Rarity multipliers for combat power calculation
    const rarityMultipliers = {
        common: 1.0,
        uncommon: 1.2,
        rare: 1.5,
        legendary: 2.0,
        mythical: 3.0,
        omnipotent: 5.0
    };
    
    for (const [type, count] of Object.entries(stats.typeCount)) {
        if (count > 0) {
            // Calculate type-specific power
            let typePower = 0;
            Object.values(stats.devilFruits).forEach(fruit => {
                if (fruit.type === type) {
                    const multiplier = rarityMultipliers[fruit.rarity] || 1.0;
                    typePower += fruit.powerLevel * multiplier * fruit.timesObtained;
                }
            });
            
            // Apply level multiplier to type power
            const levelBoostedTypePower = Math.round(typePower * battleProfile.levelMultiplier);
            
            const emoji = typeEmojis[type] || '🔮';
            typeBreakdown += `${emoji} **${type}:** ${count}x (${levelBoostedTypePower.toLocaleString()} CP)\n`;
        }
    }
    
    // Rarity breakdown with level-boosted combat power
    let rarityBreakdown = '';
    const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'rare', 'uncommon', 'common'];
    const rarityEmojis = {
        omnipotent: { emoji: '🌈', name: 'Divine' },
        mythical: { emoji: '🟥', name: 'Mythical' },
        legendary: { emoji: '🟨', name: 'Legendary' },
        rare: { emoji: '🟦', name: 'Rare' },
        uncommon: { emoji: '🟩', name: 'Uncommon' },
        common: { emoji: '🟫', name: 'Common' }
    };
    
    rarityOrder.forEach(rarity => {
        if (stats.rarityCount[rarity] > 0) {
            // Calculate rarity-specific power with level boost
            let rarityPower = 0;
            Object.values(stats.devilFruits).forEach(fruit => {
                if (fruit.rarity === rarity) {
                    const multiplier = rarityMultipliers[rarity] || 1.0;
                    rarityPower += fruit.powerLevel * multiplier * fruit.timesObtained;
                }
            });
            
            const levelBoostedRarityPower = Math.round(rarityPower * battleProfile.levelMultiplier);
            
            const config = rarityEmojis[rarity];
            rarityBreakdown += `${config.emoji} **${config.name}:** ${stats.rarityCount[rarity]}x (${levelBoostedRarityPower.toLocaleString()} CP)\n`;
        }
    });

    // Create professional collection embed with level integration
    const collectionEmbed = new EmbedBuilder()
        .setTitle(`⚔️ **${interaction.user.username}'s Devil Fruit Arsenal**`)
        .setDescription(`
🏴‍☠️ **Pirate Profile:**
**🎖️ Level:** ${battleProfile.level} (${battleProfile.rank})
**⚔️ Total Combat Power:** ${battleProfile.totalCombatPower.toLocaleString()} CP
**📈 Level Bonus:** ${battleProfile.experienceBonus}
**🏆 Power Rank:** ${powerRank}
**🍈 Collection:** ${totalFruits} unique fruits (${totalHunts} hunts)
**📊 Success Rate:** ${discoveryRate}%
**💪 Strongest Fruit:** ${strongestFruit?.name || 'None'} (${strongestPower.toLocaleString()} base CP)

**💡 Combat Power Breakdown:**
**Base Power:** ${battleProfile.baseCombatPower.toLocaleString()} CP
**Level Multiplier:** x${battleProfile.levelMultiplier}
**Level Bonus:** +${battleProfile.levelBonus.toLocaleString()} CP

**🌟 Power by Rarity:**
${rarityBreakdown || 'No fruits collected yet!'}

**🔮 Power by Type:**
${typeBreakdown || 'No fruits collected yet!'}

**⚔️ Battle Analysis:**
*Your level ${battleProfile.level} ${battleProfile.rank} status grants ${battleProfile.experienceBonus} to all Devil Fruit combat power!*
*Total Battle Strength: ${battleProfile.totalCombatPower.toLocaleString()} CP*

*Ready for battle! Your experience amplifies your Devil Fruit mastery!*
        `)
        .setColor(getPowerRankColor(powerRank))
        .setFooter({ text: `Level ${battleProfile.level} ${battleProfile.rank} | Combat system ready!` });

    // Add combat readiness button
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('view_detailed_stats')
                .setLabel('📊 Detailed Stats')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('combat_preview')
                .setLabel('⚔️ Combat Preview')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true) // Coming soon
        );

    await interaction.reply({ embeds: [collectionEmbed], components: [actionRow], ephemeral: true });
}

**🔮 Power by Type:**
${typeBreakdown || 'No fruits collected yet!'}

**⚔️ Combat Analysis:**
*Your level ${battleProfile.level} ${battleProfile.rank} status grants ${battleProfile.experienceBonus} to all Devil Fruit combat power!*
*Total Battle Strength: ${battleProfile.totalCombatPower.toLocaleString()} CP*

*Ready for battle! Your experience amplifies your Devil Fruit mastery!*
        `)
        .setColor(getPowerRankColor(powerRank))
        .setFooter({ text: `Level ${battleProfile.level} ${battleProfile.rank} | Combat system ready!` });

    // Add combat readiness button
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('view_detailed_stats')
                .setLabel('📊 Detailed Stats')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('combat_preview')
                .setLabel('⚔️ Combat Preview')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true) // Coming soon
        );

    await interaction.reply({ embeds: [collectionEmbed], components: [actionRow], ephemeral: true });
}

// Helper functions for combat power system
function getPowerDescription(rank) {
    const descriptions = {
        'Rookie': 'New to the Grand Line',
        'Bounty Hunter': 'Building reputation',
        'Elite Pirate': 'Skilled warrior',
        'Captain': 'Crew leader material',
        'Supernova': 'Rising star of the seas',
        'Warlord': 'Government-recognized threat',
        'Admiral': 'Marine-level power',
        'Yonko': 'Emperor of the seas'
    };
    return descriptions[rank] || 'Unknown power level';
}

function getPowerRankColor(rank) {
    const colors = {
        'Rookie': '#95A5A6',
        'Bounty Hunter': '#3498DB',
        'Elite Pirate': '#2ECC71',
        'Captain': '#F39C12',
        'Supernova': '#E67E22',
        'Warlord': '#9B59B6',
        'Admiral': '#E74C3C',
        'Yonko': '#F1C40F'
    };
    return colors[rank] || '#95A5A6';
}

// Show detailed results (for multi hunts)
async function showDetailedResults(interaction) {
    const detailsEmbed = new EmbedBuilder()
        .setTitle('📋 **Detailed Hunt Results**')
        .setDescription(`
🚧 **Detailed results feature coming soon!**

This will show:
• Individual Devil Fruit details
• Awakening information
• Power level comparisons
• Collection progress

*For now, check your collection to see all acquired fruits!*
        `)
        .setColor('#9B59B6')
        .setFooter({ text: 'Feature in development...' });

    await interaction.reply({ embeds: [detailsEmbed], ephemeral: true });
}

// Export the button handler
module.exports.handleButtonInteractions = handleButtonInteractions;
