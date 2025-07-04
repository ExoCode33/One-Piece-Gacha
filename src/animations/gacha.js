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

// ═══════════════════════════════════════════════════════════════════
//                    DYNAMIC ANIMATION TEXT SYSTEM
// ═══════════════════════════════════════════════════════════════════

// Dynamic middle text that changes throughout animation
const DYNAMIC_ANIMATION_TEXT = [
    // Early frames (0-5)
    [
        "*A mysterious presence stirs in the depths of the Grand Line...*",
        "*Ancient powers awaken from their eternal slumber...*",
        "*The ocean currents whisper of hidden treasures...*",
        "*Legendary energies pulse through the mystical waters...*",
        "*The World Government's secret vaults tremble...*",
        "*Pirates from across the seas sense a disturbance...*"
    ],
    // Mid frames (6-11)
    [
        "*The Devil Fruit's aura begins to manifest...*",
        "*Reality bends as the fruit's true nature emerges...*",
        "*The sea itself holds its breath in anticipation...*",
        "*Ancient prophecies speak of this very moment...*",
        "*The fruit chooses its next worthy wielder...*",
        "*Cosmic forces align to reveal destiny itself...*"
    ],
    // Late frames (12-17)
    [
        "*The Devil Fruit's power crystallizes into reality...*",
        "*Your fate as a Devil Fruit user is being decided...*",
        "*The Grand Line's greatest secret reveals itself...*",
        "*History is about to be rewritten by this discovery...*",
        "*The fruit's legendary power surges toward you...*",
        "*A new chapter in the Age of Pirates begins...*"
    ]
];

// Phase-specific text for progression and transition
const PHASE_TEXTS = {
    progression: [
        "*The Devil Fruit's essence takes physical form...*",
        "*Primordial energies coalesce into something tangible...*",
        "*The fruit's consciousness awakens after centuries...*",
        "*Reality warps as the fruit breaches dimensional barriers...*",
        "*The ocean's deepest mysteries rise to the surface...*",
        "*Time itself seems to slow as power manifests...*",
        "*The fruit's legendary aura overwhelms all other energies...*",
        "*Destiny itself guides the fruit toward its new master...*",
        "*The World's balance shifts with this discovery...*",
        "*Ancient seals break as the fruit chooses you...*",
        "*The fruit's true form begins to solidify...*",
        "*Your pirate legend is about to be born...*"
    ],
    
    transition: [
        "*The Devil Fruit's power takes its final form...*",
        "*Reality stabilizes around your newfound destiny...*",
        "*The fruit's legendary essence binds to your soul...*",
        "*Your journey as a Devil Fruit user begins now...*",
        "*The Grand Line welcomes its newest power holder...*",
        "*History will remember this moment forever...*",
        "*The fruit has chosen... and you are worthy...*",
        "*A new legend is born in the Age of Pirates...*",
        "*The ocean itself acknowledges your new power...*",
        "*Your destiny as a Devil Fruit user is sealed...*"
    ]
};

// Rarity-specific dramatic text
const RARITY_SPECIFIC_TEXT = {
    common: [
        "*A humble power stirs, but every journey begins with a single step...*",
        "*Not all treasures shine bright, but all have their purpose...*",
        "*The fruit may be common, but your potential is limitless...*"
    ],
    uncommon: [
        "*An intriguing power emerges from the depths...*",
        "*This fruit holds more promise than meets the eye...*",
        "*Uncommon powers often surprise even the greatest pirates...*"
    ],
    rare: [
        "*A significant force awakens in the Grand Line...*",
        "*This power has changed the course of many battles...*",
        "*The Marines would pay handsomely for this discovery...*"
    ],
    epic: [
        "*An extraordinary power breaks free from legend...*",
        "*Even the Yonko would covet this incredible force...*",
        "*This fruit's power has toppled kingdoms before...*"
    ],
    legendary: [
        "*A world-shaking power emerges from the abyss...*",
        "*Legends speak of this fruit in hushed, reverent tones...*",
        "*The World Government's greatest fear has been realized...*"
    ],
    mythical: [
        "*Reality itself trembles before this godlike power...*",
        "*A force that could reshape the very world awakens...*",
        "*Even the ancient weapons pale before this might...*"
    ],
    omnipotent: [
        "*THE IMPOSSIBLE HAS HAPPENED! REALITY BENDS TO YOUR WILL!*",
        "*THE GODS THEMSELVES ACKNOWLEDGE YOUR SUPREME DESTINY!*",
        "*THE VERY FABRIC OF EXISTENCE REWRITES ITSELF FOR YOU!*"
    ]
};

// Function to get dynamic text based on frame and fruit info
function getDynamicAnimationText(frame, targetFruit = null, phase = 'main') {
    if (phase === 'progression') {
        const randomIndex = Math.floor(Math.random() * PHASE_TEXTS.progression.length);
        return PHASE_TEXTS.progression[randomIndex];
    }
    
    if (phase === 'transition') {
        const randomIndex = Math.floor(Math.random() * PHASE_TEXTS.transition.length);
        return PHASE_TEXTS.transition[randomIndex];
    }
    
    // Main animation phase
    let textArray;
    if (frame <= 5) {
        textArray = DYNAMIC_ANIMATION_TEXT[0];
    } else if (frame <= 11) {
        textArray = DYNAMIC_ANIMATION_TEXT[1];
    } else {
        textArray = DYNAMIC_ANIMATION_TEXT[2];
    }
    
    // Add rarity-specific text in later frames if we know the target
    if (frame >= 15 && targetFruit && RARITY_SPECIFIC_TEXT[targetFruit.rarity]) {
        const rarityTexts = RARITY_SPECIFIC_TEXT[targetFruit.rarity];
        const randomRarityText = rarityTexts[Math.floor(Math.random() * rarityTexts.length)];
        return randomRarityText;
    }
    
    const randomIndex = Math.floor(Math.random() * textArray.length);
    return textArray[randomIndex];
}

// ═══════════════════════════════════════════════════════════════════
//                    MAIN ANIMATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

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
            
            // Get dynamic animation text
            const dynamicText = getDynamicAnimationText(frame, targetFruit, 'main');
            
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
            
            // Get dynamic progression text
            const dynamicText = getDynamicAnimationText(progFrame, targetFruit, 'progression');
            
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
            
            // FIXED: Proper center positions for 20-wide bar (0-19 indexing)
            // For a 20-wide bar, positions 9 and 10 are the center
            // We'll convert both simultaneously in the first frame
            const positions = [];
            
            for (let i = 0; i < barLength; i++) {
                let useRewardColor = false;
                
                // Calculate distance from center (treating positions 9 and 10 as center)
                const distanceFromCenter9 = Math.abs(i - 9);
                const distanceFromCenter10 = Math.abs(i - 10);
                const minDistanceFromCenter = Math.min(distanceFromCenter9, distanceFromCenter10);
                
                // If this position should be converted (within radius from either center point)
                if (minDistanceFromCenter <= radius) {
                    useRewardColor = true;
                }
                
                if (useRewardColor) {
                    positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
                } else {
                    // Still rainbow
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
            
            // Get dynamic transition text
            const dynamicText = getDynamicAnimationText(transFrame, targetFruit, 'transition');
            
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
