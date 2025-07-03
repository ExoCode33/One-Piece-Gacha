const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const { DevilFruitDatabase } = require('../data/devilfruit');

// User cooldowns and statistics tracking
const userCooldowns = new Map();
const userStats = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Hunt for a Devil Fruit from the Grand Line!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of hunt to perform')
                .setRequired(false)
                .addChoices(
                    { name: 'Single Hunt', value: 'single' },
                    { name: 'Multi Hunt (10x)', value: 'multi' },
                    { name: 'Premium Hunt', value: 'premium' }
                )),

    async execute(interaction) {
        try {
            const huntType = interaction.options.getString('type') || 'single';
            const userId = interaction.user.id;
            const username = interaction.user.username;

            console.log(`🎮 ${username} used /pull with type: ${huntType}`);

            // Initialize user stats if not exists
            if (!userStats.has(userId)) {
                userStats.set(userId, {
                    totalHunts: 0,
                    fruitsObtained: new Set(),
                    rarityCount: {
                        common: 0,
                        uncommon: 0,
                        rare: 0,
                        legendary: 0,
                        mythical: 0,
                        omnipotent: 0
                    },
                    typeCount: {},
                    lastHunt: null,
                    favoriteRarity: 'common'
                });
            }

            // Check cooldowns
            const now = Date.now();
            const cooldownTimes = {
                single: 5000,    // 5 seconds
                multi: 30000,    // 30 seconds
                premium: 60000   // 1 minute
            };

            const cooldownTime = cooldownTimes[huntType];
            const userCooldown = userCooldowns.get(userId);

            if (userCooldown && (now - userCooldown) < cooldownTime) {
                const timeLeft = Math.ceil((cooldownTime - (now - userCooldown)) / 1000);
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('⏰ The Devil Fruit Tree Is Resting...')
                    .setDescription(`
🍈 The Grand Line needs time to grow new Devil Fruits...

**⏱️ Time Remaining:** ${timeLeft} seconds
**🌊 Hunt Type:** ${huntType.charAt(0).toUpperCase() + huntType.slice(1)}

*The ocean's mysteries require patience, Captain!*
                    `)
                    .setColor('#FF6347')
                    .setFooter({ text: '🏴‍☠️ Please wait before hunting again!' });

                return await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            // Set cooldown
            userCooldowns.set(userId, now);

            // Handle different hunt types
            switch (huntType) {
                case 'single':
                    console.log(`🎮 ${username} initiated single Devil Fruit hunt`);
                    await interaction.deferReply();
                    await handleSingleHunt(interaction, userStats.get(userId));
                    break;

                case 'multi':
                    console.log(`🎮 ${username} initiated multi Devil Fruit hunt`);
                    await interaction.deferReply();
                    await handleMultiHunt(interaction, userStats.get(userId));
                    break;

                case 'premium':
                    console.log(`🎮 ${username} initiated premium Devil Fruit hunt`);
                    await interaction.deferReply();
                    await handlePremiumHunt(interaction, userStats.get(userId));
                    break;

                default:
                    await interaction.deferReply();
                    await handleSingleHunt(interaction, userStats.get(userId));
            }

        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ The Devil Fruit Hunt Failed!')
                .setDescription(`
The Devil Fruit tree's power was too chaotic to harvest safely!

**Error:** System malfunction detected
**🍈 Status:** Hunt temporarily unavailable

*Please try again in a moment, brave Captain!*
                `)
                .setColor('#FF0000')
                .setFooter({ text: 'Error Code: CHAOTIC_ENERGY | Contact support if this persists' });

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};

// Handle single hunt with ultimate cinematic experience
async function handleSingleHunt(interaction, userStat) {
    try {
        // Update user stats
        userStat.totalHunts++;
        userStat.lastHunt = new Date().toLocaleString();
        
        // Run the ultimate cinematic animation
        const result = await createUltimateCinematicExperience(interaction);
        
        if (result) {
            // Update statistics
            const { devilFruit, rarity } = result;
            userStat.rarityCount[rarity]++;
            userStat.fruitsObtained.add(devilFruit.name);
            
            // Track fruit types
            if (!userStat.typeCount[devilFruit.type]) {
                userStat.typeCount[devilFruit.type] = 0;
            }
            userStat.typeCount[devilFruit.type]++;
            
            console.log(`✅ Single hunt completed for ${interaction.user.username}`);
        }
        
    } catch (error) {
        console.error('Single hunt error:', error);
        throw error;
    }
}

// Handle multi hunt (10x pulls)
async function handleMultiHunt(interaction, userStat) {
    try {
        userStat.totalHunts += 10;
        userStat.lastHunt = new Date().toLocaleString();
        
        const results = [];
        const rarityCount = { common: 0, uncommon: 0, rare: 0, legendary: 0, mythical: 0, omnipotent: 0 };
        
        // Perform 10 pulls
        for (let i = 0; i < 10; i++) {
            const rarity = DevilFruitDatabase.calculateDropRarity();
            const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
            
            results.push({ devilFruit, rarity });
            rarityCount[rarity]++;
            userStat.rarityCount[rarity]++;
            userStat.fruitsObtained.add(devilFruit.name);
            
            if (!userStat.typeCount[devilFruit.type]) {
                userStat.typeCount[devilFruit.type] = 0;
            }
            userStat.typeCount[devilFruit.type]++;
        }
        
        // Create summary embed
        const summaryEmbed = new EmbedBuilder()
            .setTitle('🏴‍☠️ **MULTI HUNT RESULTS** 🏴‍☠️')
            .setDescription(`
⚓🌊⚓🌊⚓🌊⚓🌊⚓🌊⚓

**🍈 Total Devil Fruits:** 10
**⭐ Best Find:** ${getBestRarity(results)}

**📊 Rarity Breakdown:**
${Object.entries(rarityCount)
    .filter(([_, count]) => count > 0)
    .map(([rarity, count]) => {
        const config = DevilFruitDatabase.getRarityConfig(rarity);
        return `${config.emoji} **${config.name}:** ${count}`;
    }).join('\n')}

**🎊 Notable Discoveries:**
${results.slice(0, 3).map(r => `🍈 ${r.devilFruit.name} (${r.rarity})`).join('\n')}
            `)
            .setColor('#FFD700')
            .setFooter({ text: '🏴‍☠️ Multi Hunt Complete | Great haul, Captain!' });
        
        const components = createMultiHuntComponents();
        await interaction.editReply({ embeds: [summaryEmbed], components });
        
        console.log(`✅ Multi hunt completed for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Multi hunt error:', error);
        throw error;
    }
}

// Handle premium hunt (enhanced rates)
async function handlePremiumHunt(interaction, userStat) {
    try {
        userStat.totalHunts++;
        userStat.lastHunt = new Date().toLocaleString();
        
        // Enhanced rates for premium hunt
        const premiumRarity = DevilFruitDatabase.calculateDropRarity(true); // Assume enhanced rates
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(premiumRarity);
        
        userStat.rarityCount[premiumRarity]++;
        userStat.fruitsObtained.add(devilFruit.name);
        
        if (!userStat.typeCount[devilFruit.type]) {
            userStat.typeCount[devilFruit.type] = 0;
        }
        userStat.typeCount[devilFruit.type]++;
        
        // Run enhanced animation for premium hunt
        await createUltimateCinematicExperience(interaction);
        
        console.log(`✅ Premium hunt completed for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Premium hunt error:', error);
        throw error;
    }
}

// Helper functions
function getBestRarity(results) {
    const rarityOrder = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
    let bestRarity = 'common';
    
    for (const result of results) {
        if (rarityOrder.indexOf(result.rarity) > rarityOrder.indexOf(bestRarity)) {
            bestRarity = result.rarity;
        }
    }
    
    const config = DevilFruitDatabase.getRarityConfig(bestRarity);
    return `${config.emoji} ${config.name}`;
}

function createMultiHuntComponents() {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('view_all_hunts')
                    .setLabel('📋 View All Results')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('hunt_again')
                    .setLabel('🍈 Hunt Again!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];
}
