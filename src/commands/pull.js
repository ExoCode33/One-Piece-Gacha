**🍈 Type Collection:**
${userStat ? Object.entries(userStat.typeCount || {})
    .map(([type, count]) => `📋 **${type}:** ${count}`)
    .join('\n') : 'No Devil Fruits yet!'}

**⚡ Total Power Level:** ${userStat ? 
    Object.entries(userStat.rarityCount)
        .reduce((total, [rarity, count]) => {
            const config = DevilFruitDatabase.getRarityConfig(rarity);
            return total + (config.baseValue * count);
        }, 0).toLocaleString() : 0}

🚀 *Your Devil Fruit collection system is evolving! Soon you'll see detailed fruit cards and awakening management!*
                    `)
                    .setColor('#3498DB')
                    .setFooter({ text: 'Every great pirate needs legendary Devil Fruits!' });
                
                await interaction.reply({ embeds: [collectionEmbed], ephemeral: true });
                break;
                
            case 'fruit_details':
            case 'character_details':
                await interaction.reply({ 
                    content: '📊 Detailed Devil Fruit analysis system coming soon! This will show complete awakening info, power breakdowns, and type advantages!', 
                    ephemeral: true 
                });
                break;
                
            case 'view_all_hunts':
            case 'view_all_pulls':
                await interaction.reply({ 
                    content: '📋 Detailed hunt history and Devil Fruit analytics dashboard coming soon!', 
                    ephemeral: true 
                });
                break;
        }
    } catch (error) {
        console.error('Button interaction error:', error);
        try {
            await interaction.reply({ 
                content: '❌ Something went wrong with that action! The Devil Fruit tree is unstable!', 
                ephemeral: true 
            });
        } catch (replyError) {
            console.error('Failed to send button error message:', replyError);
        }
    }
}

// Export button handler
module.exports.handleButtonInteractions = handleButtonInteractions;const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const { DevilFruitDatabase } = require('../data/devilfruit');

// User session management (simple in-memory for now)
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
                    { name: '🍈 Single Hunt', value: 'single' },
                    { name: '🌊 Multi Hunt (10x)', value: 'multi' },
                    { name: '🌟 Legendary Hunt', value: 'premium' }
                )),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const pullType = interaction.options.getString('type') || 'single';
        
        try {
            // Initialize user stats if needed
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
                    typeCount: {
                        'Paramecia': 0,
                        'Logia': 0,
                        'Zoan': 0,
                        'Ancient Zoan': 0,
                        'Mythical Zoan': 0,
                        'Special Paramecia': 0
                    },
                    lastHunt: null,
                    joinedDate: new Date().toISOString()
                });
            }

            // Check cooldown
            if (userCooldowns.has(userId)) {
                const cooldownEnd = userCooldowns.get(userId);
                const now = Date.now();
                
                if (now < cooldownEnd) {
                    const timeLeft = Math.ceil((cooldownEnd - now) / 1000);
                    
                    const cooldownEmbed = new EmbedBuilder()
                        .setTitle('⏰ The Devil Fruit Tree Is Resting...')
                        .setDescription(`
🍈 The Grand Line needs time to grow new Devil Fruits...

**⏱️ Time Remaining:** ${timeLeft} seconds

🔮 *Use this moment to prepare your spirit for the next legendary hunt!*

**📊 Your Devil Fruit Statistics:**
• **Total Hunts:** ${userStats.get(userId).totalHunts}
• **Fruits Found:** ${userStats.get(userId).fruitsObtained.size}
• **Last Hunt:** ${userStats.get(userId).lastHunt || 'Never'}

**🍈 Rarity Collection:**
${Object.entries(userStats.get(userId).rarityCount || {})
    .map(([rarity, count]) => {
        const config = DevilFruitDatabase.getRarityConfig(rarity);
        return `${config.emoji} **${config.name}:** ${count}`;
    }).join('\n')}
                        `)
                        .setColor('#3498DB')
                        .setFooter({ text: 'Patience brings the greatest Devil Fruits from the sea!' });
                    
                    return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                }
            }

            // Set cooldown based on hunt type
            const cooldownTimes = {
                single: 45000,   // 45 seconds for single hunt
                multi: 180000,   // 3 minutes for multi hunt  
                premium: 300000  // 5 minutes for legendary hunt
            };
            
            userCooldowns.set(userId, Date.now() + cooldownTimes[pullType]);

            // CRITICAL: Defer reply immediately to prevent timeout
            await interaction.deferReply();
            
            console.log(`🎮 ${interaction.user.username} initiated ${pullType} Devil Fruit hunt`);
            
            if (pullType === 'multi') {
                await handleMultiHunt(interaction, userStats.get(userId));
            } else if (pullType === 'premium') {
                await handleLegendaryHunt(interaction, userStats.get(userId));
            } else {
                await handleSingleHunt(interaction, userStats.get(userId));
            }
            
        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ The Devil Fruit Hunt Failed!')
                .setDescription(`
The Devil Fruit tree's power was too chaotic to harvest safely!

**Error Code:** \`${error.message}\`

🍈 *The Grand Line's mystical energy sometimes overwhelms even the strongest hunters...*

🏴‍☠️ *Please try again, brave treasure hunter! The adventure never truly ends!*
                `)
                .setColor('#E74C3C')
                .setFooter({ text: 'Even the Pirate King faced setbacks on his Devil Fruit journey!' });
            
            try {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else if (!interaction.replied) {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};

// Handle single hunt with ultimate cinematic experience
async function handleSingleHunt(interaction, userStats) {
    try {
        // Update user stats
        userStats.totalHunts++;
        userStats.lastHunt = new Date().toLocaleString();
        
        // Run the ultimate cinematic animation
        await createUltimateCinematicExperience(interaction);
        
        console.log(`✅ Single hunt completed for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Single hunt error:', error);
        throw error;
    }
}

// Handle multi hunt (10 Devil Fruits at once)
async function handleMultiHunt(interaction, userStats) {
    try {
        console.log(`🎲 Multi-hunt initiated for ${interaction.user.username}`);
        
        // Generate 10 hunts
        const results = [];
        for (let i = 0; i < 10; i++) {
            const rarity = DevilFruitDatabase.calculateDropRarity();
            const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
            results.push({ devilFruit, rarity });
            
            // Update user stats
            userStats.fruitsObtained.add(devilFruit.id);
            userStats.rarityCount[rarity]++;
            userStats.typeCount[devilFruit.type]++;
        }
        
        userStats.totalHunts += 10;
        userStats.lastHunt = new Date().toLocaleString();
        
        // Analyze results
        const rarityCount = {};
        const typeCount = {};
        let bestFind = null;
        let totalPowerLevel = 0;
        
        results.forEach(result => {
            const rarity = result.rarity;
            const type = result.devilFruit.type;
            rarityCount[rarity] = (rarityCount[rarity] || 0) + 1;
            typeCount[type] = (typeCount[type] || 0) + 1;
            totalPowerLevel += result.devilFruit.powerLevel;
            
            if (!bestFind || getRarityValue(rarity) > getRarityValue(bestFind.rarity)) {
                bestFind = result;
            }
        });
        
        const averagePower = Math.floor(totalPowerLevel / 10);
        
        // Create summary display
        const rarityDisplay = Object.entries(rarityCount)
            .map(([rarity, count]) => {
                const config = DevilFruitDatabase.getRarityConfig(rarity);
                return `${config.emoji} **${config.name}:** ${count}`;
            })
            .join('\n');
            
        const typeDisplay = Object.entries(typeCount)
            .map(([type, count]) => `📋 **${type}:** ${count}`)
            .join('\n');
        
        const bestConfig = DevilFruitDatabase.getRarityConfig(bestFind.rarity);
        
        const multiEmbed = new EmbedBuilder()
            .setTitle('🍈 LEGENDARY DEVIL FRUIT HARVEST! 🍈')
            .setDescription(`
🌟 **${interaction.user.username}'s Epic Multi-Hunt Results!** 🌟

╔══════════════════════════════════════════╗
║ 🏆 **BEST FIND:** ${bestFind.devilFruit.name.padEnd(20)} ║
║ ⭐ **Rarity:** ${bestConfig.name.padEnd(25)} ║
║ 📋 **Type:** ${bestFind.devilFruit.type.padEnd(27)} ║
║ 🔥 **Power:** ${bestFind.devilFruit.powerLevel.toLocaleString().padEnd(26)} ║
╚══════════════════════════════════════════╝

**📊 Harvest Summary:**
${rarityDisplay}

**🍈 Type Breakdown:**
${typeDisplay}

**⚡ Total Power Level:** ${totalPowerLevel.toLocaleString()}
**📈 Average Power:** ${averagePower.toLocaleString()}
**🎯 Unique Fruits:** ${new Set(results.map(r => r.devilFruit.id)).size}/10

${bestConfig.stars.repeat(5)}

*Your Devil Fruit collection grows stronger with these legendary additions!*
            `)
            .setColor(bestConfig.color)
            .setFooter({ 
                text: `🍈 10 new Devil Fruits discovered! | Total hunts: ${userStats.totalHunts}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();
        
        const components = createMultiHuntComponents();
        await interaction.editReply({ 
            embeds: [multiEmbed], 
            components: components 
        });
        
        console.log(`✅ Multi-hunt completed for ${interaction.user.username}: Best = ${bestFind.devilFruit.name} (${bestFind.rarity})`);
        
    } catch (error) {
        console.error('Multi hunt error:', error);
        throw error;
    }
}

// Handle legendary hunt (enhanced rates)
async function handleLegendaryHunt(interaction, userStats) {
    try {
        const legendaryEmbed = new EmbedBuilder()
            .setTitle('🌟 Legendary Devil Fruit Hunt 🌟')
            .setDescription(`
🍈 **Legendary hunts are being prepared in the depths of the Grand Line!**

🔮 **Coming Soon - Legendary Features:**
• 🎯 **Guaranteed Rare or Higher**
• 🌌 **Exclusive Legendary Devil Fruits**
• ✨ **Enhanced Mystical Animations**
• 🎁 **Bonus Awakening Insights**
• 🏆 **Legendary-Only Achievements**

🏴‍☠️ *The greatest Devil Fruits require the most legendary preparation!*

**Your Current Collection:**
• **Total Hunts:** ${userStats.totalHunts}
• **Collection Size:** ${userStats.fruitsObtained.size}
• **Legendary+ Count:** ${userStats.rarityCount.legendary + userStats.rarityCount.mythical + userStats.rarityCount.omnipotent}

**🍈 Your Devil Fruit Types:**
${Object.entries(userStats.typeCount || {})
    .map(([type, count]) => `📋 **${type}:** ${count}`)
    .join('\n')}
            `)
            .setColor('#9B59B6')
            .setFooter({ text: 'The most legendary Devil Fruits await in the mythical realm...' });
        
        await interaction.editReply({ embeds: [legendaryEmbed] });
        
        console.log(`ℹ️ Legendary hunt preview shown to ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Legendary hunt error:', error);
        throw error;
    }
}

// Helper functions
function createMultiHuntComponents() {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('view_all_hunts')
                    .setLabel('📋 Detailed Results')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📊'),
                new ButtonBuilder()
                    .setCustomId('pull_again')
                    .setLabel('🔄 Hunt Again')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🍈'),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🍈')
            )
    ];
}

function getRarityValue(rarity) {
    const values = {
        common: 1,
        uncommon: 2,
        rare: 3,
        legendary: 4,
        mythical: 5,
        omnipotent: 6
    };
    return values[rarity] || 0;
}

// Enhanced button interaction handler
async function handleButtonInteractions(interaction) {
    if (!interaction.isButton()) return;
    
    const userId = interaction.user.id;
    const userStat = userStats.get(userId);
    
    try {
        switch (interaction.customId) {
            case 'pull_again':
                // Check cooldown
                if (userCooldowns.has(userId)) {
                    const cooldownEnd = userCooldowns.get(userId);
                    if (Date.now() < cooldownEnd) {
                        const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
                        await interaction.reply({ 
                            content: `⏰ The cosmic forces need ${timeLeft} more seconds to recharge!`, 
                            ephemeral: true 
                        });
                        return;
                    }
                }
                
                // Set new cooldown and run single hunt
                userCooldowns.set(userId, Date.now() + 45000);
                await interaction.deferReply();
                await handleSingleHunt(interaction, userStat || {
                    totalHunts: 0,
                    fruitsObtained: new Set(),
                    rarityCount: { common: 0, uncommon: 0, rare: 0, legendary: 0, mythical: 0, omnipotent: 0 },
                    typeCount: { 'Paramecia': 0, 'Logia': 0, 'Zoan': 0, 'Ancient Zoan': 0, 'Mythical Zoan': 0, 'Special Paramecia': 0 },
                    lastHunt: null
                });
                break;
                
            case 'view_collection':
            case 'view_crew':
                const collectionEmbed = new EmbedBuilder()
                    .setTitle('📚 Your Legendary Pirate Fleet')
                    .setDescription(`
🏴‍☠️ **Admiral ${interaction.user.username}'s Command Center**

**📊 Fleet Statistics:**
• **Total Summons:** ${userStat?.totalPulls || 0}
• **Unique Characters:** ${userStat?.charactersObtained?.size || 0}
• **Collection Rate:** ${userStat ? Math.floor((userStat.charactersObtained.size / CharacterDatabase.getCharacterCount()) * 100) : 0}%

**🌟 Rarity Breakdown:**
${userStat ? Object.entries(userStat.rarityCount)
    .map(([rarity, count]) => {
        const config = CharacterDatabase.getRarityConfig(rarity);
        return `${config.emoji} **${config.name}:** ${count}`;
    }).join('\n') : 'No pulls yet!'}

**⚡ Total Power Level:** ${userStat ? 
    Object.entries(userStat.rarityCount)
        .reduce((total, [rarity, count]) => {
            const config = CharacterDatabase.getRarityConfig(rarity);
            return total + (config.baseValue * count);
        }, 0).toLocaleString() : 0}

🚀 *Your collection system is evolving! Soon you'll see detailed character cards and crew management!*
                    `)
                    .setColor('#3498DB')
                    .setFooter({ text: 'Every great admiral needs a legendary fleet!' });
                
                await interaction.reply({ embeds: [collectionEmbed], ephemeral: true });
                break;
                
            case 'character_details':
                await interaction.reply({ 
                    content: '📊 Detailed character analysis system coming soon! This will show complete stats, abilities, and power breakdowns!', 
                    ephemeral: true 
                });
                break;
                
            case 'view_all_pulls':
                await interaction.reply({ 
                    content: '📋 Detailed pull history and analytics dashboard coming soon!', 
                    ephemeral: true 
                });
                break;
        }
    } catch (error) {
        console.error('Button interaction error:', error);
        try {
            await interaction.reply({ 
                content: '❌ Something went wrong with that action! The cosmic forces are unstable!', 
                ephemeral: true 
            });
        } catch (replyError) {
            console.error('Failed to send button error message:', replyError);
        }
    }
}

// Export button handler
module.exports.handleButtonInteractions = handleButtonInteractions;
