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
//                    ENHANCED DYNAMIC TEXT SYSTEM
// ═══════════════════════════════════════════════════════════════════

// Much more varied text that changes every 3 frames
const DYNAMIC_ANIMATION_TEXT = [
    // Early frames (0-2)
    [
        "*A mysterious presence stirs in the depths of the Grand Line...*",
        "*Ancient powers awaken from their eternal slumber...*",
        "*The ocean currents whisper of hidden treasures...*",
        "*Legendary energies pulse through the mystical waters...*",
        "*The World Government's secret vaults tremble...*",
        "*Pirates from across the seas sense a disturbance...*",
        "*The sea kings themselves bow to this ancient power...*",
        "*Whispers of destiny echo across the New World...*"
    ],
    // Frames 3-5
    [
        "*The Devil Fruit's presence grows stronger...*",
        "*Reality begins to warp around the manifesting power...*",
        "*The Marines' instruments detect massive energy readings...*",
        "*Ancient seals placed by the Void Century crack...*",
        "*The fruit's consciousness stirs after centuries of sleep...*",
        "*Yonko across the world pause, sensing something awakening...*",
        "*The Red Line itself trembles with anticipation...*",
        "*Log pose needles spin wildly in response...*"
    ],
    // Frames 6-8
    [
        "*The Devil Fruit's aura begins to manifest physically...*",
        "*Space-time distortions ripple through the Grand Line...*",
        "*The World Tree Adam resonates with ancient power...*",
        "*Even the Admirals feel an inexplicable unease...*",
        "*The fruit chooses its moment to reveal itself...*",
        "*Cosmic forces align in perfect synchronization...*",
        "*The ocean's deepest secrets rise to the surface...*",
        "*Reality prepares to welcome a new legend...*"
    ],
    // Frames 9-11
    [
        "*The fruit's true nature begins to crystallize...*",
        "*Dimensional barriers thin as power bleeds through...*",
        "*The Will of D resonates with this awakening force...*",
        "*Ancient prophecies speak of this exact moment...*",
        "*The fruit's legendary essence takes tangible form...*",
        "*Even the Celestial Dragons sense a shift in power...*",
        "*The Grand Line's magnetic fields fluctuate wildly...*",
        "*History itself pauses to witness this birth...*"
    ],
    // Frames 12-14
    [
        "*Your destiny as a Devil Fruit user crystallizes...*",
        "*The fruit's power surges toward its chosen wielder...*",
        "*Reality bends to accommodate this new possibility...*",
        "*The Age of Pirates enters a new chapter...*",
        "*Legends are born in moments like these...*",
        "*The fruit has made its choice - and chosen you...*",
        "*Time itself seems to slow for this revelation...*",
        "*The world will never be the same again...*"
    ],
    // Frames 15-17
    [
        "*The Devil Fruit's power reaches critical mass...*",
        "*Your fate intertwines with forces beyond imagination...*",
        "*The Grand Line's greatest secret prepares to reveal itself...*",
        "*History books will record this moment for eternity...*",
        "*The fruit's consciousness fully awakens...*",
        "*A new era of piracy is about to dawn...*",
        "*Reality finalizes your transformation into legend...*",
        "*The ocean itself acknowledges your ascension...*"
    ]
];

// Function to get dynamic text - changes every 3 frames for much more variety
function getDynamicAnimationText(frame, targetFruit = null, phase = 'main') {
    if (phase === 'progression') {
        const progressionTexts = [
            "*Primordial energies coalesce into physical reality...*",
            "*The fruit's essence breaches dimensional barriers...*",
            "*Ancient powers manifest in the material world...*",
            "*Reality warps to accommodate impossible forces...*",
            "*The fruit's consciousness fully materializes...*",
            "*Cosmic energies stabilize into tangible form...*",
            "*Your destiny solidifies with each passing moment...*",
            "*The fruit's legendary aura overwhelms all else...*",
            "*Time bends around the crystallizing power...*",
            "*The World's balance shifts irreversibly...*",
            "*Your legend begins to write itself...*",
            "*The fruit's final form approaches completion...*"
        ];
        return progressionTexts[Math.floor(Math.random() * progressionTexts.length)];
    }
    
    if (phase === 'transition') {
        const transitionTexts = [
            "*The Devil Fruit's power assumes its ultimate form...*",
            "*Reality stabilizes around your newfound destiny...*",
            "*The fruit's essence permanently bonds to your soul...*",
            "*Your transformation into legend reaches completion...*",
            "*The Grand Line welcomes its newest power holder...*",
            "*This moment will echo through history forever...*",
            "*The fruit has chosen... and you are worthy...*",
            "*A new chapter in the Age of Pirates begins...*",
            "*The ocean itself bows to your ascension...*",
            "*Your destiny as a Devil Fruit user is sealed...*"
        ];
        return transitionTexts[Math.floor(Math.random() * transitionTexts.length)];
    }
    
    // Main animation phase - text changes every 3 frames for maximum variety
    let textArrayIndex;
    if (frame <= 2) textArrayIndex = 0;
    else if (frame <= 5) textArrayIndex = 1;
    else if (frame <= 8) textArrayIndex = 2;
    else if (frame <= 11) textArrayIndex = 3;
    else if (frame <= 14) textArrayIndex = 4;
    else textArrayIndex = 5;
    
    const textArray = DYNAMIC_ANIMATION_TEXT[textArrayIndex];
    
    // Add rarity-specific text in very late frames
    if (frame >= 16 && targetFruit) {
        const rarityTexts = {
            omnipotent: [
                "*THE IMPOSSIBLE HAS BEEN ACHIEVED! REALITY ITSELF KNEELS!*",
                "*OMNIPOTENT POWER COURSES THROUGH YOUR VERY BEING!*",
                "*THE GODS ACKNOWLEDGE YOUR SUPREME TRANSCENDENCE!*"
            ],
            mythical: [
                "*World-shaking power erupts from legend into reality!*",
                "*Even ancient weapons pale before this might!*",
                "*Reality trembles before your godlike ascension!*"
            ],
            legendary: [
                "*Legendary power that reshapes the very world awakens!*",
                "*The World Government's greatest fears are realized!*",
                "*Power that topples empires flows through you!*"
            ]
        };
        
        if (rarityTexts[targetFruit.rarity]) {
            const rarityArray = rarityTexts[targetFruit.rarity];
            return rarityArray[Math.floor(Math.random() * rarityArray.length)];
        }
    }
    
    return textArray[Math.floor(Math.random() * textArray.length)];
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
            
            // Get dynamic animation text (changes every 3 frames)
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
            
            // FIXED: Symmetric expansion from true center
            // For 20 positions (0-19), true center is at 9.5
            // This ensures perfect symmetry
            const positions = [];
            
            for (let i = 0; i < barLength; i++) {
                let useRewardColor = false;
                
                // Calculate distance from true center (9.5)
                const distanceFromCenter = Math.abs(i - 9.5);
                
                // Convert if within radius (this ensures perfect symmetry)
                if (distanceFromCenter <= radius + 0.5) {
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
