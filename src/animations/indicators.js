// Center-outward conversion for 20-square bars
            const barLength = 20;
            const radius = transFrame;
            const centerPositions = [10, 11]; // Visual center positions for 20-wide bar
            const positions = [];
            
            for (let i = 0; i < barLength; i++) {
                let useRewardColor = false;
                
          const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { generateRandomDevilFruit } = require('../data/devilfruit');
const { generateParticles } = require('./particles');
const { getChangingIndicators } = require('./indicators');
const DatabaseManager = require('../database/manager');
const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');

// Color constants
const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
const rainbowEmbedColors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8000FF, 0x8B4513];

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

async function createUltimateCinematicExperience(interaction, userLevel = 0) {
    try {
        // Generate target fruit
        const targetFruit = generateRandomDevilFruit();
        const oldRarity = targetFruit.rarity;
        
        console.log(`🎯 Animation Starting: ${targetFruit.name} (${oldRarity})`);
        
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
        
        console.log(`📡 Connection quality: ${performanceMetrics.connectionQuality}ms`);
        
        // Initial response
        const initialEmbed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription('🌊 Searching the mysterious waters of the Grand Line...')
            .setColor(rainbowEmbedColors[0])
            .setTimestamp();
            
        await interaction.reply({ embeds: [initialEmbed] });
        
        // Main animation phase (18 frames)
        for (let frame = 0; frame < 18; frame++) {
            const success = await updateAnimationFrame(interaction, frame, targetFruit, performanceMetrics);
            if (!success) {
                console.log(`Frame ${frame} failed after retries, continuing animation`);
            }
            await sleep(1000); // 1 second per frame
        }
        
        console.log(`📊 Animation Performance: ${performanceMetrics.frameSuccesses}/${performanceMetrics.frameAttempts} frames (${(performanceMetrics.frameSuccesses/performanceMetrics.frameAttempts*100).toFixed(1)}%) - ${performanceMetrics.frameAttempts} total attempts`);
        
        // Progression phase (12 frames)
        console.log('🌊 Starting progression phase...');
        for (let progFrame = 0; progFrame < 12; progFrame++) {
            const success = await updateProgressionFrame(interaction, progFrame, targetFruit, performanceMetrics);
            if (!success) {
                console.log(`Progression frame ${progFrame} error: Discord API timeout`);
            }
            await sleep(800); // Slightly faster for progression
        }
        
        // Center-outward transition phase (10 frames)
        console.log('🎆 Smooth transition: Rainbow to reward color...');
        for (let transFrame = 0; transFrame < 10; transFrame++) {
            const success = await updateTransitionFrame(interaction, transFrame, targetFruit, performanceMetrics);
            if (!success) {
                console.log(`Transition frame ${transFrame} error: Discord API timeout`);
            }
            await sleep(900); // Moderate pace for transition
        }
        
        // Gradual information reveal
        console.log('🎊 Gradual reveal: Devil Fruit information...');
        await revealInformationGradually(interaction, targetFruit, elementName, userLevel);
        
        // Save to database
        await DatabaseManager.saveUserFruit(interaction.user.id, targetFruit);
        await DatabaseManager.updateUserStats(interaction.user.id);
        
        console.log(`🎊 Single hunt success: ${targetFruit.name} (${targetFruit.rarity}) for ${interaction.user.username}`);
        
    } catch (error) {
        console.error(`🚨 Animation Error:`, error);
        throw error;
    }
}

async function updateAnimationFrame(interaction, frame, targetFruit, metrics) {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
            
            // Calculate embed color (rainbow for most of animation)
            let embedColor;
            if (frame < 16) {
                // Rainbow embed color
                const embedColorIndex = (0 - frame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
                embedColor = rainbowEmbedColors[embedColorIndex];
            } else if (frame < 17) {
                // Brief hint at rarity
                embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
            } else {
                // Final reveal
                embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
            }
            
            // Get changing indicators
            const indicators = getChangingIndicators(frame, targetFruit.rarity, targetFruit.type);
            
            // Get particles
            const particles = generateParticles();
            
            // Create animation content
            const animationContent = `${topBar}\n\n` +
                `🌊 **GRAND LINE EXPLORATION** 🌊\n\n` +
                `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
                `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
                `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
                `*The mystical energies swirl around you...*\n\n` +
                `${bottomBar}\n\n` +
                `${particles}`;
            
            const embed = new EmbedBuilder()
                .setTitle('🍈 Devil Fruit Hunt in Progress...')
                .setDescription(animationContent)
                .setColor(embedColor)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
            metrics.frameSuccesses++;
            return true;
            
        } catch (error) {
            console.log(`Animation frame ${frame} attempt ${attempt} error: ${error.message.includes('timeout') ? 'Discord API timeout' : error.message}`);
            
            if (attempt === maxRetries) {
                return false;
            }
            
            await sleep(200 * attempt); // Exponential backoff
        }
    }
    return false;
}

async function updateProgressionFrame(interaction, progFrame, targetFruit, metrics) {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            metrics.frameAttempts++;
            
            // Calculate rainbow positions for 20-square bars
            const barLength = 20;
            const positions = [];
            
            for (let i = 0; i < barLength; i++) {
                const colorIndex = (i - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
            
            const topBar = positions.join(' ');
            const bottomBar = positions.join(' ');
            
            // Rainbow embed color
            const embedColorIndex = (0 - (18 + progFrame) + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
            const embedColor = rainbowEmbedColors[embedColorIndex];
            
            // Get indicators (more locked as progression continues)
            const indicators = getChangingIndicators(18 + progFrame, targetFruit.rarity, targetFruit.type);
            
            const particles = generateParticles('intense');
            
            const progressContent = `${topBar}\n\n` +
                `🌊 **POWER CRYSTALLIZING** 🌊\n\n` +
                `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
                `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
                `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
                `*The Devil Fruit's true nature begins to emerge...*\n\n` +
                `${bottomBar}\n\n` +
                `${particles}`;
            
            const embed = new EmbedBuilder()
                .setTitle('🔮 Power Crystallization Phase')
                .setDescription(progressContent)
                .setColor(embedColor)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
            metrics.frameSuccesses++;
            return true;
            
        } catch (error) {
            if (attempt === maxRetries) {
                return false;
            }
            await sleep(300 * attempt);
        }
    }
    return false;
}

async function updateTransitionFrame(interaction, transFrame, targetFruit, metrics) {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            metrics.frameAttempts++;
            
            // Center-outward conversion for 20-square bars
            const barLength = 20;
            const radius = transFrame;
            const centerPositions = [9, 10]; // True center positions for 20-wide bar (0-19 indexing)
            const positions = [];
            
            for (let i = 0; i < barLength; i++) {
                let useRewardColor = false;
                
                // Check if this position should be converted
                for (const center of centerPositions) {
                    if (Math.abs(i - center) <= radius) {
                        useRewardColor = true;
                        break;
                    }
                }
                
                if (useRewardColor) {
                    positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
                } else {
                    const colorIndex = (i - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
                    positions.push(rainbowColors[colorIndex]);
                }
            }
            
            const topBar = positions.join(' ');
            const bottomBar = positions.join(' ');
            
            // Transition embed color
            const embedColor = transFrame > 5 ? 
                (rarityColors[targetFruit.rarity]?.embed || 0x8B4513) :
                rainbowEmbedColors[(0 - (30 + transFrame) + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length];
            
            const particles = generateParticles('crystallizing');
            
            const transitionContent = `${topBar}\n\n` +
                `⚡ **CRYSTALLIZING INTO REALITY** ⚡\n\n` +
                `*The Devil Fruit's power takes its final form...*\n\n` +
                `${bottomBar}\n\n` +
                `${particles}`;
            
            const embed = new EmbedBuilder()
                .setTitle('⚡ Final Crystallization')
                .setDescription(transitionContent)
                .setColor(embedColor)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
            metrics.frameSuccesses++;
            return true;
            
        } catch (error) {
            if (attempt === maxRetries) {
                return false;
            }
            await sleep(400 * attempt);
        }
    }
    return false;
}

async function revealInformationGradually(interaction, targetFruit, elementName, userLevel) {
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
    
    // Prepare all information lines
    const rarityTitles = {
        common: "Common Discovery",
        uncommon: "Uncommon Find", 
        rare: "Rare Discovery",
        epic: "Epic Revelation",
        legendary: "Legendary Find",
        mythical: "Mythical Discovery",
        omnipotent: "Omnipotent Revelation"
    };
    
    const rarityDescriptions = {
        common: "A Devil Fruit with basic powers, but still formidable in the right hands.",
        uncommon: "An intriguing Devil Fruit with notable abilities.",
        rare: "A Devil Fruit with impressive powers that few possess.",
        epic: "A remarkable Devil Fruit with extraordinary capabilities.",
        legendary: "A Devil Fruit of immense power, known throughout the Grand Line.",
        mythical: "A Devil Fruit of legendary status, wielding reality-bending powers.",
        omnipotent: "A Devil Fruit of ultimate power, capable of reshaping the very fabric of existence."
    };
    
    const typeEmojis = {
        'Paramecia': '🔮',
        'Zoan': '🐺',
        'Logia': '🌪️',
        'Ancient Zoan': '🦕',
        'Mythical Zoan': '🐉',
        'Special Paramecia': '✨'
    };
    
    // Lines to reveal gradually
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
    
    // Reveal line by line
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
        await sleep(800); // 800ms between line reveals
    }
    
    // Final complete display with buttons
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

module.exports = { createUltimateCinematicExperience };
