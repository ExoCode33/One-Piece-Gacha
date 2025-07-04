const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
const { generateRandomDevilFruit } = require('../data/devilfruit');
const { generateParticles } = require('../animations/particles');
const { getChangingIndicators } = require('../animations/indicators');

// Rainbow colors for button animations
const rainbowEmbedColors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8000FF, 0x8B4513];
const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];

// Rarity color mappings
const rarityColors = {
    common: { emoji: '🟫', embed: 0x8B4513 },
    uncommon: { emoji: '🟩', embed: 0x00FF00 },
    rare: { emoji: '🟦', embed: 0x0000FF },
    epic: { emoji: '🟪', embed: 0x8000FF },
    legendary: { emoji: '🟨', embed: 0xFFFF00 },
    mythical: { emoji: '🟥', embed: 0xFF0000 },
    omnipotent: { emoji: '⬜', embed: 0xFFFFFF }
};

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

// Enhanced Collection System Integration
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
        totalAvailableFruits: 150, // Updated to match your 150 fruits database
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
            treasuresText += ` (${fruit.duplicates})`;
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
        
        // Back button
        const backRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('collection')
                    .setLabel('🔙 Back to Overview')
                    .setStyle(ButtonStyle.Primary)
            );
        
        await interaction.editReply({
            content: listText,
            components: [backRow]
        });
        
    } catch (error) {
        console.error('Full collection error:', error);
        await interaction.editReply({
            content: '⚠️ Error displaying full collection. Please try again.'
        });
    }
}

// Handle button interactions
async function handleButtonInteraction(interaction) {
    try {
        const customId = interaction.customId;
        
        switch (customId) {
            case 'huntAgain':
                await handleHuntAgain(interaction);
                break;
            case 'collection':
                await handleCollection(interaction);
                break;
            case 'fullCollection':
                await handleFullCollection(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown action.',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error(`Button interaction error:`, error);
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '⚠️ Something went wrong with that action.',
                    ephemeral: true
                });
            }
        } catch (replyError) {
            console.error('Failed to send error message:', replyError);
        }
    }
}

// FIXED: Hunt Again function that works with button interactions
async function handleHuntAgain(interaction) {
    try {
        // Check cooldown first
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
        
        // FIXED: Defer the reply first for button interactions
        await interaction.deferReply();
        
        // Set cooldown (5 seconds)
        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        
        // Ensure user exists in database
        await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);
        
        // Get user level for combat power calculation
        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;
        
        // Generate target fruit
        const targetFruit = generateRandomDevilFruit();
        console.log(`🎯 Animation Starting: ${targetFruit.name} (${targetFruit.rarity})`);
        
        // Get element information
        const fruitElement = DEVIL_FRUIT_ELEMENTS[targetFruit.id];
        const elementName = fruitElement ? CombatSystem.getElementName(fruitElement) : 'Unknown';
        
        // Performance tracking
        const performanceMetrics = {
            startTime: Date.now(),
            frameAttempts: 0,
            frameSuccesses: 0,
            connectionQuality: interaction.client.ws.ping
        };
        
        // FIXED: Use editReply instead of reply since we deferred
        const initialEmbed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription('🌊 Searching the mysterious waters of the Grand Line...')
            .setColor(rainbowEmbedColors[0])
            .setTimestamp();
            
        await interaction.editReply({ embeds: [initialEmbed] });
        
        // Import animation functions
        const { updateAnimationFrame, updateProgressionFrame, updateTransitionFrame, revealInformationGradually } = require('../animations/gacha');
        
        // Run the same animation loop as normal pull
        // Main animation phase (18 frames)
        for (let frame = 0; frame < 18; frame++) {
            await updateAnimationFrameButton(interaction, frame, targetFruit, performanceMetrics);
            await sleep(1000);
        }
        
        // Progression phase (12 frames)  
        for (let progFrame = 0; progFrame < 12; progFrame++) {
            await updateProgressionFrameButton(interaction, progFrame, targetFruit, performanceMetrics);
            await sleep(800);
        }
        
        // Transition phase (10 frames)
        for (let transFrame = 0; transFrame < 10; transFrame++) {
            await updateTransitionFrameButton(interaction, transFrame, targetFruit, performanceMetrics);
            await sleep(900);
        }
        
        // Reveal information
        await revealInformationGraduallyButton(interaction, targetFruit, elementName, userLevel);
        
        // Save to database
        await DatabaseManager.saveUserFruit(interaction.user.id, targetFruit);
        await DatabaseManager.updateUserStats(interaction.user.id);
        
        console.log(`🎊 Hunt Again success: ${targetFruit.name} (${targetFruit.rarity}) for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Hunt again error:', error);
        
        try {
            if (interaction.deferred && !interaction.replied) {
                await interaction.editReply({
                    content: '⚠️ Error starting new hunt. Please try again.'
                });
            }
        } catch (replyError) {
            console.error('Failed to send hunt again error:', replyError);
        }
    }
}

// Button-specific animation functions (use editReply instead of reply)
async function updateAnimationFrameButton(interaction, frame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;
        
        // Calculate rainbow positions and colors for 20-square bars
        const barLength = 20;
        const positions = [];
        
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        
        // Create dual rainbow bars
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' ');
        
        const embedColor = transFrame > 5 ? 
            (rarityColors[targetFruit.rarity]?.embed || 0x8B4513) :
            rainbowEmbedColors[(0 - (30 + transFrame) + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length];
        
        const particles = generateParticles('crystallizing');
        
        const transitionTexts = [
            "*The Devil Fruit's power takes its final form...*",
            "*Your journey as a Devil Fruit user begins now...*",
            "*The ocean itself acknowledges your new power...*"
        ];
        const dynamicText = transitionTexts[Math.floor(Math.random() * transitionTexts.length)];
        
        const transitionContent = `${topBar}\n\n` +
            `⚡ **CRYSTALLIZING INTO REALITY** ⚡\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('⚡ Final Crystallization')
            .setDescription(transitionContent)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;
        
    } catch (error) {
        console.log(`Transition frame ${transFrame} error:`, error.message);
    }
}

async function revealInformationGraduallyButton(interaction, targetFruit, elementName, userLevel) {
    // Create reward color bar
    const rewardEmoji = rarityColors[targetFruit.rarity]?.emoji || '🟫';
    const rewardBar = Array(20).fill(rewardEmoji).join(' ');
    
    // Calculate combat power if user has level
    let combatPowerInfo = '';
    if (userLevel > 0) {
        const basePower = CombatSystem.calculateBasePower(targetFruit.rarity);
        const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
        const totalPower = Math.floor(basePower * levelMultiplier);
        combatPowerInfo = `⚔️ **Combat Power:** ${totalPower.toLocaleString()} CP\n`;
    }
    
    const rarityTitles = {
        common: "Common Discovery",
        uncommon: "Uncommon Find", 
        rare: "Rare Discovery",
        epic: "Epic Revelation",
        legendary: "Legendary Find",
        mythical: "Mythical Discovery",
        omnipotent: "Omnipotent Revelation"
    };
    
    const typeEmojis = {
        'Paramecia': '🔮',
        'Zoan': '🐺',
        'Logia': '🌪️',
        'Ancient Zoan': '🦕',
        'Mythical Zoan': '🐉',
        'Special Paramecia': '✨'
    };
    
    const revealLines = [
        `🌟 **${rarityTitles[targetFruit.rarity]}**`,
        '',
        `🍈 **${targetFruit.name}**`,
        `${typeEmojis[targetFruit.type] || '🍈'} **Type:** ${targetFruit.type}`,
        `👤 **Previous User:** ${targetFruit.previousUser}`,
        `💪 **Power:** ${targetFruit.power}`,
        `⭐ **Rarity:** ${targetFruit.rarity.charAt(0).toUpperCase() + targetFruit.rarity.slice(1)}`,
        combatPowerInfo,
        `⚔️ **Element:** ${elementName}`,
        '',
        `📖 **Description:**`,
        targetFruit.description,
        '',
        `🔥 **Awakening:** ${targetFruit.awakening}`,
        `💧 **Weakness:** ${targetFruit.weakness}`
    ];
    
    let currentContent = `${rewardBar}\n\n`;
    
    for (let i = 0; i < revealLines.length; i++) {
        if (revealLines[i]) {
            currentContent += revealLines[i] + '\n';
        } else {
            currentContent += '\n';
        }
        
        const embed = new EmbedBuilder()
            .setTitle('🏴‍☠️ Devil Fruit Discovered!')
            .setDescription(currentContent + `\n${rewardBar}`)
            .setColor(rarityColors[targetFruit.rarity]?.embed || 0x8B4513)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        await sleep(800);
    }
    
    const finalContent = currentContent + `\n${rewardBar}`;
    
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('huntAgain')
                .setLabel('🍈 Hunt Again')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('collection')
                .setLabel('📚 My Collection')
                .setStyle(ButtonStyle.Secondary)
        );
    
    const finalEmbed = new EmbedBuilder()
        .setTitle('🏴‍☠️ Devil Fruit Claimed!')
        .setDescription(finalContent)
        .setColor(rarityColors[targetFruit.rarity]?.embed || 0x8B4513)
        .setTimestamp();
    
    await interaction.editReply({ 
        embeds: [finalEmbed], 
        components: [actionRow] 
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export the button handler for the interaction event
module.exports.handleButtonInteraction = handleButtonInteraction;
        const bottomBar = positions.join(' ');
        
        // Calculate embed color (rainbow for most of animation)
        let embedColor;
        if (frame < 16) {
            const embedColorIndex = (0 - frame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
            embedColor = rainbowEmbedColors[embedColorIndex];
        } else if (frame < 17) {
            embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
        } else {
            embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
        }
        
        // Get changing indicators
        const indicators = getChangingIndicators(frame, targetFruit.rarity, targetFruit.type);
        
        // Get particles
        const particles = generateParticles();
        
        // Get dynamic animation text
        const dynamicTexts = [
            "*A mysterious presence stirs in the depths of the Grand Line...*",
            "*Ancient powers awaken from their eternal slumber...*",
            "*The Devil Fruit's aura begins to manifest...*",
            "*Reality bends as the fruit's true nature emerges...*",
            "*Your destiny as a Devil Fruit user crystallizes...*",
            "*The fruit's power reaches critical mass...*"
        ];
        const textIndex = Math.min(Math.floor(frame / 3), dynamicTexts.length - 1);
        const dynamicText = dynamicTexts[textIndex];
        
        // Create animation content with dynamic text
        const animationContent = `${topBar}\n\n` +
            `🌊 **GRAND LINE EXPLORATION** 🌊\n\n` +
            `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
            `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription(animationContent)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;
        
    } catch (error) {
        console.log(`Animation frame ${frame} error:`, error.message);
    }
}

async function updateProgressionFrameButton(interaction, progFrame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;
        
        const barLength = 20;
        const positions = [];
        
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' ');
        
        const embedColorIndex = (0 - (18 + progFrame) + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
        const embedColor = rainbowEmbedColors[embedColorIndex];
        
        const indicators = getChangingIndicators(18 + progFrame, targetFruit.rarity, targetFruit.type);
        const particles = generateParticles('intense');
        
        const progressionTexts = [
            "*The fruit's essence takes physical form...*",
            "*Reality warps as the fruit breaches dimensional barriers...*",
            "*Your legend begins to write itself...*"
        ];
        const dynamicText = progressionTexts[Math.floor(Math.random() * progressionTexts.length)];
        
        const progressContent = `${topBar}\n\n` +
            `🌊 **POWER CRYSTALLIZING** 🌊\n\n` +
            `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
            `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('🔮 Power Crystallization Phase')
            .setDescription(progressContent)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;
        
    } catch (error) {
        console.log(`Progression frame ${progFrame} error:`, error.message);
    }
}

async function updateTransitionFrameButton(interaction, transFrame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;
        
        const barLength = 20;
        const radius = transFrame;
        const positions = [];
        
        for (let i = 0; i < barLength; i++) {
            const distanceFromCenter = Math.abs(i - 9.5);
            
            if (distanceFromCenter <= radius + 0.5) {
                positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
            } else {
                const colorIndex = (i - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
        }
        
        const topBar = positions.join(' ');
