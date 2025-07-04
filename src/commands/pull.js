const { SlashCommandBuilder } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { CombatSystem } = require('../data/counter-system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!'),

    async execute(interaction) {
        try {
            console.log(`🎮 ${interaction.user.username} used /pull`);
            
            // Check cooldown
            const userId = interaction.user.id;
            const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');
            
            if (cooldownEnd && Date.now() < cooldownEnd) {
                const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
                return await interaction.reply({
                    content: `⏰ Your crew is still recovering from the last hunt! Wait **${timeLeft}** more seconds before searching for another Devil Fruit.`,
                    ephemeral: true
                });
            }

            await handleSingleHunt(interaction);
            
        } catch (error) {
            console.error(`🚨 Pull Command Error:`, error);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '⚠️ Something went wrong during your Devil Fruit hunt! Please try again.',
                    ephemeral: true
                });
            }
        }
    }
};

async function handleSingleHunt(interaction) {
    try {
        console.log(`🎮 ${interaction.user.username} initiated single Devil Fruit hunt`);
        
        // Set cooldown (5 seconds)
        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        
        // Ensure user exists in database
        await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);
        
        // Get user level for combat power calculation
        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;
        
        // Start the ultimate cinematic experience
        await createUltimateCinematicExperience(interaction, userLevel);
        
        console.log(`🎊 Single hunt success for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Single hunt error:', error);
        throw error;
    }
}

// Handle button interactions
async function handleButtonInteraction(interaction) {
    try {
        const [action] = interaction.customId.split('_');
        
        switch (action) {
            case 'huntAgain':
                await handleHuntAgain(interaction);
                break;
            case 'collection':
                await handleCollection(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown action.',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error(`Button interaction error:`, error);
        await interaction.reply({
            content: '⚠️ Something went wrong with that action.',
            ephemeral: true
        });
    }
}

async function handleHuntAgain(interaction) {
    // Check cooldown
    const userId = interaction.user.id;
    const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');
    
    if (cooldownEnd && Date.now() < cooldownEnd) {
        const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
        await interaction.reply({
            content: `⏰ Your crew is still recovering! Wait **${timeLeft}** more seconds before hunting again.`,
            ephemeral: true
        });
        return;
    }
    
    // Start new hunt
    await interaction.deferReply();
    await handleSingleHunt(interaction);
}

async function handleCollection(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });
        
        const userId = interaction.user.id;
        const username = interaction.user.username;
        
        // Ensure user exists
        await DatabaseManager.ensureUser(userId, username);
        
        // Get comprehensive collection data
        const userData = await DatabaseManager.getUser(userId);
        const userFruits = await DatabaseManager.getUserFruits(userId);
        const rarityStats = await DatabaseManager.getUserRarityStats(userId);
        const typeStats = await DatabaseManager.getUserTypeStats(userId);
        
        // Calculate level-enhanced combat power
        const userLevel = userData ? userData.level : 0;
        const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
        const levelRank = CombatSystem.getLevelRank(userLevel);
        
        // Calculate total combat power with level bonus
        let totalBasePower = 0;
        let totalCombatPower = 0;
        let strongestFruit = null;
        let strongestPower = 0;
        
        // Group fruits for better display
        const fruitsByType = {};
        
        for (const fruit of userFruits) {
            const basePower = CombatSystem.calculateBasePower(fruit.rarity);
            const enhancedPower = Math.floor(basePower * levelMultiplier);
            
            totalBasePower += basePower;
            totalCombatPower += enhancedPower;
            
            if (enhancedPower > strongestPower) {
                strongestPower = enhancedPower;
                strongestFruit = fruit;
            }
            
            // Group by type
            if (!fruitsByType[fruit.type]) {
                fruitsByType[fruit.type] = [];
            }
            fruitsByType[fruit.type].push({
                ...fruit,
                basePower,
                enhancedPower
            });
        }
        
        // Calculate level bonus
        const levelBonus = totalCombatPower - totalBasePower;
        const levelBonusPercentage = levelMultiplier > 1 ? Math.round((levelMultiplier - 1) * 100) : 0;
        
        // Get power rank
        const powerRank = CombatSystem.getPowerRank(totalCombatPower);
        
        // Create collection display
        let collectionContent = '';
        
        // Header with level and power info
        collectionContent += `🏴‍☠️ **${username}'s Devil Fruit Collection** 🏴‍☠️\n\n`;
        
        if (userLevel > 0) {
            collectionContent += `🎖️ **Level:** ${userLevel} (${levelRank})\n`;
            collectionContent += `⚔️ **Total Combat Power:** ${totalCombatPower.toLocaleString()} CP\n`;
            if (levelBonusPercentage > 0) {
                collectionContent += `📈 **Level Bonus:** +${levelBonusPercentage}% Combat Power\n`;
            }
            collectionContent += `🏆 **Power Rank:** ${powerRank}\n`;
            if (strongestFruit) {
                collectionContent += `💪 **Strongest Fruit:** ${strongestFruit.name} (${strongestPower.toLocaleString()} CP)\n`;
            }
            collectionContent += `\n`;
        }
        
        // Basic stats
        const totalFruits = userFruits.length;
        const uniqueFruits = new Set(userFruits.map(f => f.fruit_id)).size;
        const discoveryRate = userData ? Math.round((uniqueFruits / userData.total_hunts) * 100) : 0;
        
        collectionContent += `📊 **Collection Stats:**\n`;
        collectionContent += `🍈 Total Fruits: ${totalFruits}\n`;
        collectionContent += `✨ Unique Fruits: ${uniqueFruits}\n`;
        collectionContent += `🎯 Discovery Rate: ${discoveryRate}%\n`;
        collectionContent += `🏴‍☠️ Total Hunts: ${userData ? userData.total_hunts : 0}\n\n`;
        
        // Power breakdown by rarity (if user has level)
        if (userLevel > 0) {
            collectionContent += `🌟 **Power by Rarity:**\n`;
            const rarityPowerBreakdown = {};
            
            for (const fruit of userFruits) {
                if (!rarityPowerBreakdown[fruit.rarity]) {
                    rarityPowerBreakdown[fruit.rarity] = { count: 0, power: 0 };
                }
                rarityPowerBreakdown[fruit.rarity].count++;
                rarityPowerBreakdown[fruit.rarity].power += Math.floor(CombatSystem.calculateBasePower(fruit.rarity) * levelMultiplier);
            }
            
            const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical', 'omnipotent'];
            const rarityEmojis = {
                common: '🟫',
                uncommon: '🟩', 
                rare: '🟦',
                epic: '🟪',
                legendary: '🟨',
                mythical: '🟥',
                omnipotent: '⬜'
            };
            
            for (const rarity of rarityOrder) {
                if (rarityPowerBreakdown[rarity]) {
                    const { count, power } = rarityPowerBreakdown[rarity];
                    collectionContent += `${rarityEmojis[rarity]} ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}: ${count}x (${power.toLocaleString()} CP)\n`;
                }
            }
            collectionContent += `\n`;
        } else {
            // Just show rarity counts without power
            collectionContent += `🌟 **Fruits by Rarity:**\n`;
            const rarityEmojis = {
                common: '🟫',
                uncommon: '🟩', 
                rare: '🟦',
                epic: '🟪',
                legendary: '🟨',
                mythical: '🟥',
                omnipotent: '⬜'
            };
            
            for (const [rarity, count] of Object.entries(rarityStats)) {
                if (count > 0) {
                    collectionContent += `${rarityEmojis[rarity]} ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}: ${count}x\n`;
                }
            }
            collectionContent += `\n`;
        }
        
        // Power breakdown by type (if user has level)
        if (userLevel > 0) {
            collectionContent += `🔮 **Power by Type:**\n`;
            const typePowerBreakdown = {};
            
            for (const fruit of userFruits) {
                if (!typePowerBreakdown[fruit.type]) {
                    typePowerBreakdown[fruit.type] = { count: 0, power: 0 };
                }
                typePowerBreakdown[fruit.type].count++;
                typePowerBreakdown[fruit.type].power += Math.floor(CombatSystem.calculateBasePower(fruit.rarity) * levelMultiplier);
            }
            
            const typeEmojis = {
                'Paramecia': '🔮',
                'Zoan': '🐺', 
                'Logia': '🌪️',
                'Ancient Zoan': '🦕',
                'Mythical Zoan': '🐉',
                'Special Paramecia': '✨'
            };
            
            for (const [type, { count, power }] of Object.entries(typePowerBreakdown)) {
                collectionContent += `${typeEmojis[type] || '🍈'} ${type}: ${count}x (${power.toLocaleString()} CP)\n`;
            }
            collectionContent += `\n`;
        } else {
            // Just show type counts without power
            collectionContent += `🔮 **Fruits by Type:**\n`;
            const typeEmojis = {
                'Paramecia': '🔮',
                'Zoan': '🐺', 
                'Logia': '🌪️',
                'Ancient Zoan': '🦕',
                'Mythical Zoan': '🐉',
                'Special Paramecia': '✨'
            };
            
            for (const [type, count] of Object.entries(typeStats)) {
                if (count > 0) {
                    collectionContent += `${typeEmojis[type] || '🍈'} ${type}: ${count}x\n`;
                }
            }
            collectionContent += `\n`;
        }
        
        // Detailed fruit list organized by type
        collectionContent += `📜 **Detailed Collection:**\n`;
        
        const typeOrder = ['Logia', 'Mythical Zoan', 'Ancient Zoan', 'Zoan', 'Special Paramecia', 'Paramecia'];
        
        for (const type of typeOrder) {
            if (fruitsByType[type] && fruitsByType[type].length > 0) {
                const typeEmojis = {
                    'Paramecia': '🔮',
                    'Zoan': '🐺', 
                    'Logia': '🌪️',
                    'Ancient Zoan': '🦕',
                    'Mythical Zoan': '🐉',
                    'Special Paramecia': '✨'
                };
                
                collectionContent += `\n${typeEmojis[type]} **${type} Fruits:**\n`;
                
                // Group by rarity within type
                const rarityGroups = {};
                for (const fruit of fruitsByType[type]) {
                    if (!rarityGroups[fruit.rarity]) {
                        rarityGroups[fruit.rarity] = [];
                    }
                    rarityGroups[fruit.rarity].push(fruit);
                }
                
                const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
                const rarityEmojis = {
                    common: '🟫',
                    uncommon: '🟩', 
                    rare: '🟦',
                    epic: '🟪',
                    legendary: '🟨',
                    mythical: '🟥',
                    omnipotent: '⬜'
                };
                
                for (const rarity of rarityOrder) {
                    if (rarityGroups[rarity]) {
                        // Count duplicates
                        const fruitCounts = {};
                        for (const fruit of rarityGroups[rarity]) {
                            fruitCounts[fruit.name] = (fruitCounts[fruit.name] || 0) + 1;
                        }
                        
                        for (const [fruitName, count] of Object.entries(fruitCounts)) {
                            const displayName = count > 1 ? `${fruitName} (x${count})` : fruitName;
                            
                            if (userLevel > 0) {
                                const sampleFruit = rarityGroups[rarity].find(f => f.name === fruitName);
                                collectionContent += `${rarityEmojis[rarity]} ${displayName} - ${sampleFruit.enhancedPower.toLocaleString()} CP\n`;
                            } else {
                                collectionContent += `${rarityEmojis[rarity]} ${displayName}\n`;
                            }
                        }
                    }
                }
            }
        }
        
        // Split into multiple messages if too long
        const maxLength = 4000;
        if (collectionContent.length > maxLength) {
            const parts = [];
            let currentPart = '';
            const lines = collectionContent.split('\n');
            
            for (const line of lines) {
                if (currentPart.length + line.length + 1 > maxLength) {
                    parts.push(currentPart);
                    currentPart = line;
                } else {
                    currentPart += (currentPart ? '\n' : '') + line;
                }
            }
            if (currentPart) parts.push(currentPart);
            
            // Send first part as reply, rest as follow-ups
            await interaction.editReply({
                content: parts[0]
            });
            
            for (let i = 1; i < parts.length; i++) {
                await interaction.followUp({
                    content: parts[i],
                    ephemeral: true
                });
            }
        } else {
            await interaction.editReply({
                content: collectionContent
            });
        }
        
    } catch (error) {
        console.error('Collection error:', error);
        await interaction.editReply({
            content: '⚠️ Error displaying collection. Please try again.'
        });
    }
}

// Export the button handler for the interaction event
module.exports.handleButtonInteraction = handleButtonInteraction;
