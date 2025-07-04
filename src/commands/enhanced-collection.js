// Enhanced Collection System for pull.js
// Replace the handleCollection function and related functions

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const DatabaseManager = require('../database/manager');
const { CombatSystem } = require('../data/counter-system');
const { getTotalFruits } = require('../data/devilfruit'); // Get total available fruits

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
        const userLevel = userData ? userData.level : 0;
        
        if (userFruits.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setTitle('📚 Your Devil Fruit Collection')
                .setDescription('🍈 **No Devil Fruits Found**\n\nYou haven\'t discovered any Devil Fruits yet! Use `/pull` to start your adventure in the Grand Line.')
                .setColor(0x3498DB)
                .setFooter({ text: 'Start your journey • One Piece Devil Fruit Collection' })
                .setTimestamp();
            
            return await interaction.editReply({ embeds: [emptyEmbed] });
        }
        
        // Enhanced collection analysis
        const collectionAnalysis = await analyzeEnhancedCollection(userFruits, userLevel);
        
        // Create main collection overview embed
        const overviewEmbed = createCollectionOverviewEmbed(username, userData, collectionAnalysis);
        
        // Create rarity distribution embed
        const rarityEmbed = createRarityDistributionEmbed(collectionAnalysis);
        
        // Create power analysis embed
        const powerEmbed = createPowerAnalysisEmbed(collectionAnalysis, userLevel);
        
        // Create crown jewels embed
        const crownJewelsEmbed = createCrownJewelsEmbed(collectionAnalysis);
        
        // Create action buttons (removed detailed view and search)
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('fullCollection')
                    .setLabel('📋 Full Collection')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋'),
                new ButtonBuilder()
                    .setCustomId('huntAgain')
                    .setLabel('🍈 Hunt More')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🍈')
            );
        
        // Send all embeds
        await interaction.editReply({ 
            embeds: [overviewEmbed, rarityEmbed, powerEmbed, crownJewelsEmbed],
            components: [actionRow]
        });
        
    } catch (error) {
        console.error('Collection error:', error);
        await interaction.editReply({
            content: '⚠️ Error displaying collection. Please try again.'
        });
    }
}

// Enhanced collection analysis
async function analyzeEnhancedCollection(userFruits, userLevel = 0) {
    const analysis = {
        totalFruits: userFruits.length,
        uniqueFruits: new Set(userFruits.map(f => f.fruit_id)).size,
        totalAvailableFruits: getTotalFruits(), // Total fruits in the game
        totalHunts: userFruits.length, // Each fruit is a hunt
        rarityDistribution: {},
        duplicateInfo: {},
        topFruits: [],
        totalCombatPower: 0,
        userLevel: userLevel
    };
    
    // Calculate rarity distribution
    userFruits.forEach(fruit => {
        analysis.rarityDistribution[fruit.rarity] = (analysis.rarityDistribution[fruit.rarity] || 0) + 1;
    });
    
    // Calculate duplicate information and combat power
    const fruitGroups = {};
    userFruits.forEach(fruit => {
        if (!fruitGroups[fruit.fruit_id]) {
            fruitGroups[fruit.fruit_id] = {
                ...fruit,
                count: 0,
                duplicates: 0
            };
        }
        fruitGroups[fruit.fruit_id].count++;
        fruitGroups[fruit.fruit_id].duplicates = fruitGroups[fruit.fruit_id].count;
    });
    
    // Calculate combat power with duplicate bonuses
    if (userLevel > 0) {
        const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
        
        Object.values(fruitGroups).forEach(group => {
            const basePower = CombatSystem.calculateBasePower(group.rarity);
            const duplicateBonus = 1 + (group.duplicates - 1) * 0.01; // 1% per duplicate
            const fruitPower = Math.floor(basePower * levelMultiplier * duplicateBonus);
            
            group.combatPower = fruitPower;
            analysis.totalCombatPower += fruitPower * group.count;
        });
        
        // Sort by combat power for crown jewels
        analysis.topFruits = Object.values(fruitGroups)
            .sort((a, b) => b.combatPower - a.combatPower)
            .slice(0, 5);
    } else {
        // Sort by rarity order for crown jewels when no level
        const rarityOrder = { omnipotent: 7, mythical: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        analysis.topFruits = Object.values(fruitGroups)
            .sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0))
            .slice(0, 5);
    }
    
    analysis.duplicateInfo = fruitGroups;
    
    return analysis;
}

// Collection Overview Embed
function createCollectionOverviewEmbed(username, userData, analysis) {
    const embed = new EmbedBuilder()
        .setTitle(`🏴‍☠️ ${username}'s Devil Fruit Collection`)
        .setColor(0x2F3136);
    
    let overview = `📊 **Collection Overview**\n\n`;
    overview += `🍈 **Total Devil Fruits:** ${analysis.totalFruits}\n`;
    overview += `✨ **Unique Devil Fruits:** ${analysis.uniqueFruits}/${analysis.totalAvailableFruits}\n`;
    overview += `🏴‍☠️ **Total Hunts:** ${analysis.totalHunts}\n\n`;
    
    embed.setDescription(overview);
    embed.setTimestamp();
    
    return embed;
}

// Fixed Rarity Distribution Embed
function createRarityDistributionEmbed(analysis) {
    const embed = new EmbedBuilder()
        .setTitle('🌟 Rarity Distribution')
        .setColor(0x9B59B6);
    
    const rarityEmojis = {
        omnipotent: '🟥',
        mythical: '🟧',
        legendary: '🟨',
        epic: '🟪',
        rare: '🟦',
        uncommon: '🟩',
        common: '🟫'
    };
    
    const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
    
    let distributionText = '';
    rarityOrder.forEach(rarity => {
        const count = analysis.rarityDistribution[rarity] || 0;
        if (count > 0) {
            const emoji = rarityEmojis[rarity];
            const rarityName = rarity.charAt(0).toUpperCase() + rarity.slice(1);
            distributionText += `${emoji} **${rarityName}:** ${count}\n`;
        }
    });
    
    if (!distributionText) {
        distributionText = '*No fruits collected yet*';
    }
    
    embed.setDescription(distributionText);
    return embed;
}

// Enhanced Power Analysis Embed
function createPowerAnalysisEmbed(analysis, userLevel) {
    const embed = new EmbedBuilder()
        .setTitle('⚔️ Power Analysis')
        .setColor(0xE74C3C);
    
    if (userLevel <= 0) {
        embed.setDescription('*Reach Level 1 to unlock power analysis and combat rankings*');
        return embed;
    }
    
    const levelRank = CombatSystem.getLevelRank(userLevel);
    const powerRank = CombatSystem.getPowerRank(analysis.totalCombatPower);
    
    let powerText = `🎖️ **Your Level:** ${userLevel}\n`;
    powerText += `👑 **Level Rank:** ${levelRank}\n`;
    powerText += `💪 **Total Collection Power:** ${analysis.totalCombatPower.toLocaleString()} CP\n`;
    powerText += `🏆 **Power Rank:** ${powerRank}\n\n`;
    
    powerText += `📈 **Duplicate Bonuses Explained:**\n`;
    powerText += `*Each duplicate of the same Devil Fruit grants +1% CP bonus to that fruit's power. This bonus stacks with your level multiplier.*\n\n`;
    
    // Show example calculation if user has duplicates
    const duplicateExample = Object.values(analysis.duplicateInfo).find(fruit => fruit.duplicates > 1);
    if (duplicateExample) {
        const basePower = CombatSystem.calculateBasePower(duplicateExample.rarity);
        const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
        const duplicateBonus = duplicateExample.duplicates - 1;
        
        powerText += `📊 **Example: ${duplicateExample.name}**\n`;
        powerText += `Base Power: ${basePower} CP\n`;
        powerText += `Level Bonus: +${Math.round((levelMultiplier - 1) * 100)}% (x${levelMultiplier})\n`;
        powerText += `Duplicate Bonus: +${duplicateBonus}% (${duplicateExample.duplicates} copies)\n`;
        powerText += `Final Power: ${duplicateExample.combatPower.toLocaleString()} CP\n`;
    }
    
    embed.setDescription(powerText);
    return embed;
}

// Crown Jewels Embed
function createCrownJewelsEmbed(analysis) {
    const embed = new EmbedBuilder()
        .setTitle('👑 Crown Jewels')
        .setColor(0xF39C12);
    
    if (analysis.topFruits.length === 0) {
        embed.setDescription('*No treasures to display*');
        return embed;
    }
    
    const rarityEmojis = {
        omnipotent: '🟥',
        mythical: '🟧', 
        legendary: '🟨',
        epic: '🟪',
        rare: '🟦',
        uncommon: '🟩',
        common: '🟫'
    };
    
    let treasuresText = `🏆 **Top 5 Most Powerful Fruits**\n\n`;
    
    for (let i = 0; i < Math.min(5, analysis.topFruits.length); i++) {
        const fruit = analysis.topFruits[i];
        const rank = ['👑', '🥈', '🥉', '4️⃣', '5️⃣'][i];
        const rarityEmoji = rarityEmojis[fruit.rarity] || '🍈';
        
        treasuresText += `${rank} **${fruit.name}**\n`;
        treasuresText += `${rarityEmoji} ${fruit.type}`;
        
        if (fruit.duplicates > 1) {
            treasuresText += ` (${fruit.duplicates} copies)`;
        }
        
        if (analysis.userLevel > 0 && fruit.combatPower) {
            treasuresText += `\n⚔️ ${fruit.combatPower.toLocaleString()} CP`;
        }
        
        treasuresText += `\n\n`;
    }
    
    embed.setDescription(treasuresText);
    return embed;
}

// Full Collection Display
async function handleFullCollection(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });
        
        const userId = interaction.user.id;
        const userFruits = await DatabaseManager.getUserFruits(userId);
        
        if (userFruits.length === 0) {
            await interaction.editReply({
                content: '📋 **Full Collection**\n\n*No Devil Fruits in your collection yet. Use `/pull` to start hunting!*'
            });
            return;
        }
        
        // Group fruits by ID to show duplicates
        const fruitGroups = {};
        userFruits.forEach(fruit => {
            if (!fruitGroups[fruit.fruit_id]) {
                fruitGroups[fruit.fruit_id] = {
                    ...fruit,
                    count: 0
                };
            }
            fruitGroups[fruit.fruit_id].count++;
        });
        
        // Sort by rarity and name
        const rarityOrder = { omnipotent: 7, mythical: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        const sortedFruits = Object.values(fruitGroups)
            .sort((a, b) => {
                const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
                if (rarityDiff !== 0) return rarityDiff;
                return a.name.localeCompare(b.name);
            });
        
        const rarityEmojis = {
            omnipotent: '🟥',
            mythical: '🟧',
            legendary: '🟨', 
            epic: '🟪',
            rare: '🟦',
            uncommon: '🟩',
            common: '🟫'
        };
        
        // Create pages for large collections
        const itemsPerPage = 15;
        const totalPages = Math.ceil(sortedFruits.length / itemsPerPage);
        const currentPage = 1;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, sortedFruits.length);
        const pageItems = sortedFruits.slice(startIndex, endIndex);
        
        let listText = `📋 **Full Collection** (Page ${currentPage}/${totalPages})\n\n`;
        
        pageItems.forEach((fruit, index) => {
            const rarityEmoji = rarityEmojis[fruit.rarity] || '🍈';
            const duplicateText = fruit.count > 1 ? ` (${fruit.count})` : '';
            
            listText += `${rarityEmoji} **${fruit.name}**${duplicateText}\n`;
            listText += `└ ${fruit.type} • ${fruit.rarity}\n\n`;
        });
        
        // Add navigation buttons if multiple pages
        let components = [];
        if (totalPages > 1) {
            const navRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('collection_prev')
                        .setLabel('◀️ Previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(currentPage === 1),
                    new ButtonBuilder()
                        .setCustomId('collection_next')
                        .setLabel('Next ▶️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(currentPage === totalPages)
                );
            components.push(navRow);
        }
        
        // Back button
        const backRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('collection')
                    .setLabel('🔙 Back to Overview')
                    .setStyle(ButtonStyle.Primary)
            );
        components.push(backRow);
        
        await interaction.editReply({
            content: listText,
            components: components
        });
        
    } catch (error) {
        console.error('Full collection error:', error);
        await interaction.editReply({
            content: '⚠️ Error displaying full collection. Please try again.'
        });
    }
}

// Export functions to be used in pull.js
module.exports = {
    handleCollection,
    handleFullCollection,
    analyzeEnhancedCollection,
    createCollectionOverviewEmbed,
    createRarityDistributionEmbed,
    createPowerAnalysisEmbed,
    createCrownJewelsEmbed
};
