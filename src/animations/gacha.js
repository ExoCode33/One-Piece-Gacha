// Enhanced Devil Fruit Gacha Animation System - Professional Grade
// Keeps rainbow sync + outward transition, but with premium presentation

const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
const rainbowEmbedColors = [0xFF0000, 0xFF8000, 0xFFFF00, 0x00FF00, 0x0080FF, 0x8000FF, 0x654321];

// ═══════════════════════════════════════════════════════════════════
//                    PROFESSIONAL TEXT SYSTEMS
// ═══════════════════════════════════════════════════════════════════

// Main descriptive text that progresses through the hunt
const HUNT_DESCRIPTIONS = {
    // Phase 1: Mystery Building (Frames 0-5)
    mystery: [
        "The Grand Line's mysterious energies swirl through the depths...",
        "Ancient Devil Fruit essence stirs in the ocean's heart...",
        "Whispers of legendary power echo across the waves...",
        "The sea itself trembles with anticipation...",
        "Reality begins to bend around an emerging force...",
        "Destiny threads weave together in the cosmic tapestry..."
    ],
    
    // Phase 2: Power Rising (Frames 6-11)
    rising: [
        "Tremendous energy cascades through dimensional barriers...",
        "The fruit's true nature fights to break through...",
        "Waves of power ripple across space and time...",
        "The ocean's blessing intensifies beyond mortal comprehension...",
        "Reality crystallizes around a world-changing force...",
        "The Devil Fruit's legend begins to take physical form..."
    ],
    
    // Phase 3: Manifestation (Frames 12-17)
    manifestation: [
        "The legendary power reaches critical manifestation threshold...",
        "Cosmic forces align to birth a new chapter in history...",
        "The Grand Line itself acknowledges this moment of destiny...",
        "Your legend as a Devil Fruit user begins to unfold...",
        "The sea grants you a power beyond imagination...",
        "A force that will reshape your very existence emerges..."
    ]
};

// Professional status indicators (replaces the red diff blocks)
const STATUS_INDICATORS = {
    // Scanning phase - builds mystery without revealing anything
    scanning: [
        { energy: "FAINT", aura: "UNKNOWN", potential: "STIRRING" },
        { energy: "WEAK", aura: "MYSTERIOUS", potential: "BUILDING" },
        { energy: "MODEST", aura: "ENIGMATIC", potential: "RISING" },
        { energy: "GROWING", aura: "POWERFUL", potential: "SURGING" },
        { energy: "STRONG", aura: "LEGENDARY", potential: "CRITICAL" },
        { energy: "INTENSE", aura: "MYTHICAL", potential: "TRANSCENDENT" }
    ],
    
    // Crystallization phase - more dramatic but still mysterious
    crystallizing: [
        { energy: "OVERWHELMING", aura: "DIVINE", potential: "REALITY-BENDING" },
        { energy: "WORLD-SHAKING", aura: "OMNIPOTENT", potential: "UNIVERSE-ALTERING" },
        { energy: "TRANSCENDENT", aura: "ABSOLUTE", potential: "LEGEND-FORGING" }
    ],
    
    // Final reveal phase - actual information starts showing
    revealing: [
        { energy: "CONFIRMED", aura: "ANALYZED", potential: "MANIFESTATION COMPLETE" }
    ]
};

// Elegant particle effects for different phases
const PHASE_PARTICLES = {
    mystery: ['✨', '🌟', '💫', '⭐', '🌌', '💎', '🔮', '⚡'],
    rising: ['🌊', '⚡', '🔥', '❄️', '🌪️', '💥', '✨', '🌟'],
    manifestation: ['👑', '💎', '🏆', '⚡', '🌟', '💫', '🔥', '⭐'],
    transition: ['🎆', '🎇', '✨', '💫', '🌟', '👑', '💎', '🏆']
};

// ═══════════════════════════════════════════════════════════════════
//                    ENHANCED ANIMATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function getSyncedRainbowPattern(frame, barLength = 20) {
    const positions = [];
    for (let i = 0; i < barLength; i++) {
        const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
        positions.push(rainbowColors[colorIndex]);
    }
    return positions.join(' ');
}

function getEmbedColorSyncedToFirst(frame) {
    const firstSquareColorIndex = (0 - frame + rainbowColors.length * 100) % rainbowColors.length;
    return rainbowEmbedColors[firstSquareColorIndex];
}

// Professional status display (replaces the ugly red diff blocks)
function createProfessionalStatusDisplay(frame, phase = 'scanning') {
    let statusSet;
    
    if (phase === 'scanning' && frame < 18) {
        const index = Math.min(Math.floor(frame / 3), STATUS_INDICATORS.scanning.length - 1);
        statusSet = STATUS_INDICATORS.scanning[index];
    } else if (phase === 'crystallizing') {
        const index = Math.min(Math.floor(frame / 4), STATUS_INDICATORS.crystallizing.length - 1);
        statusSet = STATUS_INDICATORS.crystallizing[index];
    } else {
        statusSet = STATUS_INDICATORS.revealing[0];
    }
    
    // Clean, professional layout using Discord's embed field system
    return {
        energy: statusSet.energy,
        aura: statusSet.aura,
        potential: statusSet.potential
    };
}

// Dynamic description based on hunt phase
function getHuntDescription(frame) {
    let phase, descriptions;
    
    if (frame < 6) {
        phase = 'mystery';
        descriptions = HUNT_DESCRIPTIONS.mystery;
    } else if (frame < 12) {
        phase = 'rising';
        descriptions = HUNT_DESCRIPTIONS.rising;
    } else {
        phase = 'manifestation';
        descriptions = HUNT_DESCRIPTIONS.manifestation;
    }
    
    const index = Math.min(frame % descriptions.length, descriptions.length - 1);
    return descriptions[index];
}

// Elegant particle generation
function getPhaseParticles(frame, intensity = 'normal') {
    let particleSet;
    
    if (frame < 6) {
        particleSet = PHASE_PARTICLES.mystery;
    } else if (frame < 12) {
        particleSet = PHASE_PARTICLES.rising;
    } else if (frame < 18) {
        particleSet = PHASE_PARTICLES.manifestation;
    } else {
        particleSet = PHASE_PARTICLES.transition;
    }
    
    const count = intensity === 'high' ? 8 : intensity === 'low' ? 4 : 6;
    const particles = [];
    
    for (let i = 0; i < count; i++) {
        particles.push(particleSet[Math.floor(Math.random() * particleSet.length)]);
    }
    
    return particles.join(' ');
}

// ═══════════════════════════════════════════════════════════════════
//                    MAIN ANIMATION FRAME FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function updateAnimationFrame(frame, targetFruit = null, targetType = 'Paramecia') {
    // Get synced rainbow pattern and embed color
    const rainbowPattern = getSyncedRainbowPattern(frame);
    const embedColor = getEmbedColorSyncedToFirst(frame);
    
    // Get professional status indicators
    const status = createProfessionalStatusDisplay(frame, 'scanning');
    
    // Get dynamic description and particles
    const description = getHuntDescription(frame);
    const particles = getPhaseParticles(frame);
    
    // Create clean, professional embed content
    const content = [
        `${rainbowPattern}`,
        "",
        `🌊 **GRAND LINE EXPEDITION STATUS** 🌊`,
        "",
        `⚡ **Energy Reading:** ${status.energy}`,
        `🔮 **Aura Analysis:** ${status.aura}`,  
        `🍈 **Power Potential:** ${status.potential}`,
        "",
        `*${description}*`,
        "",
        `${rainbowPattern}`
    ].join('\n');
    
    return {
        color: embedColor,
        title: "🏴‍☠️ Devil Fruit Hunt - Scanning Phase",
        description: content,
        footer: { 
            text: "🌊 Hunting in progress..." 
        },
        timestamp: new Date()
    };
}

function updateProgressionFrame(frame, targetFruit = null, targetType = 'Paramecia') {
    const actualFrame = frame - 18;
    const rainbowPattern = getSyncedRainbowPattern(frame);
    const embedColor = getEmbedColorSyncedToFirst(frame);
    
    // More intense status for progression phase
    const status = createProfessionalStatusDisplay(actualFrame, 'crystallizing');
    
    // Dramatic progression descriptions
    const progressionTexts = [
        "The Devil Fruit's essence breaks through dimensional barriers...",
        "Reality warps as legendary power takes physical form...",
        "The ocean itself bows to the emerging force...",
        "Your destiny as a legend crystallizes before your eyes..."
    ];
    
    const description = progressionTexts[Math.min(actualFrame % progressionTexts.length, progressionTexts.length - 1)];
    const particles = getPhaseParticles(frame, 'high');
    
    const content = [
        `${rainbowPattern}`,
        "",
        `⚡ **POWER CRYSTALLIZATION PROTOCOL** ⚡`,
        "",
        `🌟 **Energy State:** ${status.energy}`,
        `👑 **Divine Aura:** ${status.aura}`,
        `💎 **Reality Impact:** ${status.potential}`,
        "",
        `*${description}*`,
        "",
        `${rainbowPattern}`
    ].join('\n');
    
    return {
        color: embedColor,
        title: "⚡ Devil Fruit Hunt - Crystallization Phase",
        description: content,
        footer: { 
            text: "⚡ Power crystallizing..." 
        },
        timestamp: new Date()
    };
}

function updateTransitionFrame(frame, targetFruit = null, rewardColor = 0x00FF00, targetType = 'Paramecia') {
    const transitionFrame = frame - 30;
    const radius = transitionFrame;
    const barLength = 20;
    
    // Create the beautiful outward transition (keeping your original logic)
    const positions = [];
    for (let i = 0; i < barLength; i++) {
        const distanceFromCenter9 = Math.abs(i - 9);
        const distanceFromCenter10 = Math.abs(i - 10);
        const minDistanceFromCenter = Math.min(distanceFromCenter9, distanceFromCenter10);
        
        if (minDistanceFromCenter <= radius) {
            const rewardEmoji = getRarityEmoji(targetFruit?.rarity || 'common');
            positions.push(rewardEmoji);
        } else {
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
    }
    
    const transitionBar = positions.join(' ');
    
    // Transition phase text
    const transitionTexts = [
        "The Devil Fruit's power materializes into reality...",
        "Your legend as a Devil Fruit user begins this moment...",
        "The Grand Line grants you a power beyond imagination...",
        "Destiny itself reshapes around your newfound strength..."
    ];
    
    const description = transitionTexts[Math.min(transitionFrame % transitionTexts.length, transitionTexts.length - 1)];
    const particles = getPhaseParticles(frame, 'high');
    
    // Keep everything mysterious until the very end
    let statusDisplay;
    if (transitionFrame < 9) {
        // Stay mysterious for almost the entire transition
        const mysteriousStatus = [
            { phase: "MATERIALIZATION", status: "IN PROGRESS", essence: "MANIFESTING" },
            { phase: "CONVERGENCE", status: "CRITICAL", essence: "STABILIZING" },
            { phase: "CRYSTALLIZATION", status: "ACTIVE", essence: "BINDING" },
            { phase: "REALITY ANCHOR", status: "ENGAGED", essence: "SOLIDIFYING" },
            { phase: "DIMENSIONAL LOCK", status: "SECURED", essence: "COMPLETING" },
            { phase: "LEGEND BIRTH", status: "IMMINENT", essence: "FINALIZING" },
            { phase: "DESTINY SEAL", status: "ACTIVATING", essence: "TRANSCENDING" },
            { phase: "POWER BIRTH", status: "ULTIMATE", essence: "ASCENDING" },
            { phase: "FINAL PHASE", status: "LEGENDARY", essence: "MYTHICAL" }
        ];
        
        const currentStatus = mysteriousStatus[Math.min(transitionFrame, mysteriousStatus.length - 1)];
        statusDisplay = [
            `🌟 **${currentStatus.phase}:** ${currentStatus.status}`,
            `👑 **Legend Status:** ${currentStatus.essence}`,
            `💎 **Power Class:** TRANSCENDENT`
        ].join('\n');
    } else {
        // Only reveal in the very final frame (frame 9)
        statusDisplay = [
            `🍈 **Devil Fruit:** ${targetFruit?.name || 'LEGENDARY POWER'}`,
            `⭐ **Rarity Level:** ${(targetFruit?.rarity || 'unknown').toUpperCase()}`,
            `🌟 **Fruit Type:** ${targetType.toUpperCase()}`
        ].join('\n');
    }
    
    const content = [
        `${transitionBar}`,
        "",
        `💎 **LEGENDARY MANIFESTATION SEQUENCE** 💎`,
        "",
        statusDisplay,
        "",
        `*${description}*`,
        "",
        `${transitionBar}`
    ].join('\n');
    
    return {
        color: transitionFrame > 5 ? rewardColor : getEmbedColorSyncedToFirst(frame),
        title: "💎 Devil Fruit Hunt - Manifestation Phase",
        description: content,
        footer: { 
            text: "💎 Manifestation in progress..." 
        },
        timestamp: new Date()
    };
}

// Helper function for rarity emojis
function getRarityEmoji(rarity) {
    const rarityEmojis = {
        'common': '🟫',
        'uncommon': '🟩', 
        'rare': '🟦',
        'epic': '🟪',
        'legendary': '🟨',
        'mythical': '🟧',
        'omnipotent': '🟥'
    };
    return rarityEmojis[rarity] || '🟫';
}

// ═══════════════════════════════════════════════════════════════════
//                    FINAL REVEAL SYSTEM
// ═══════════════════════════════════════════════════════════════════

function createFinalRevealEmbed(fruit, userStats) {
    const rewardEmoji = getRarityEmoji(fruit.rarity);
    const rewardBar = Array(20).fill(rewardEmoji).join(' ');
    
    const rarityTitles = {
        common: "Common Discovery",
        uncommon: "Uncommon Treasure",
        rare: "Rare Artifact", 
        epic: "Epic Legend",
        legendary: "Legendary Relic",
        mythical: "Mythical Wonder",
        omnipotent: "Omnipotent Force"
    };
    
    const typeEmojis = {
        'Paramecia': '🔮',
        'Zoan': '🐺', 
        'Logia': '🌪️',
        'Ancient Zoan': '🦕',
        'Mythical Zoan': '🐉',
        'Special Paramecia': '✨'
    };
    
    // Handle duplicate display
    let duplicateInfo = '';
    let powerInfo = '';
    
    if (userStats?.duplicateCount > 0) {
        const duplicateBonus = userStats.duplicateCount * 1; // 1% per duplicate
        duplicateInfo = `🔄 **Duplicate #${userStats.duplicateCount + 1}** (+${duplicateBonus}% CP Bonus!)\n`;
        
        if (userStats.currentFruitPower) {
            powerInfo = `⚔️ **Combat Power:** ${userStats.currentFruitPower.toLocaleString()} CP\n`;
        }
    } else {
        duplicateInfo = `✨ **New Discovery!** First time obtaining this fruit!\n`;
        
        if (userStats?.currentFruitPower) {
            powerInfo = `⚔️ **Combat Power:** ${userStats.currentFruitPower.toLocaleString()} CP\n`;
        }
    }
    
    const content = [
        `${rewardBar}`,
        "",
        `🎉 **${rarityTitles[fruit.rarity] || 'Mysterious Discovery'}**`,
        "",
        `🍈 **${fruit.name}**`,
        `${typeEmojis[fruit.type] || '🍈'} **Type:** ${fruit.type}`,
        `👤 **Previous User:** ${fruit.previousUser}`,
        `⭐ **Rarity:** ${fruit.rarity.charAt(0).toUpperCase() + fruit.rarity.slice(1)}`,
        "",
        duplicateInfo,
        powerInfo,
        `📖 **Power Description:**`,
        `*${fruit.description}*`,
        "",
        `🔥 **Awakening:** ${fruit.awakening}`,
        `💧 **Weakness:** ${fruit.weakness}`,
        "",
        `📊 **Collection Progress:**`,
        `🏆 **Total Fruits:** ${userStats?.totalFruits || 1}`,
        `⚡ **Total Power:** ${(userStats?.totalPower || 0).toLocaleString()} CP`,
        "",
        `${rewardBar}`
    ].join('\n');
    
    return {
        color: getRarityColor(fruit.rarity),
        title: userStats?.isNewFruit ? "🏴‍☠️ New Devil Fruit Discovered!" : "🏴‍☠️ Devil Fruit Enhanced!",
        description: content,
        footer: { 
            text: userStats?.duplicateCount > 0 ? 
                "🌊 Duplicate mastery increases your power! | Set sail stronger than before!" :
                "🌊 Your legend grows stronger | Set sail with your new power!" 
        },
        timestamp: new Date()
    };
}

function getRarityColor(rarity) {
    const colors = {
        'common': 0x8B4513,     // Brown
        'uncommon': 0x00FF00,   // Green  
        'rare': 0x0080FF,       // Blue
        'epic': 0x8000FF,       // Purple
        'legendary': 0xFFD700,  // Gold
        'mythical': 0xFF8000,   // Orange
        'omnipotent': 0xFF0000  // Red
    };
    return colors[rarity] || 0x8B4513;
}

// ═══════════════════════════════════════════════════════════════════
//                    BUTTON VERSIONS (FOR HUNT AGAIN)
// ═══════════════════════════════════════════════════════════════════

function updateAnimationFrameButton(frame, targetFruit = null, targetType = 'Paramecia') {
    return updateAnimationFrame(frame, targetFruit, targetType);
}

function updateProgressionFrameButton(frame, targetFruit = null, targetType = 'Paramecia') {
    return updateProgressionFrame(frame, targetFruit, targetType);
}

function updateTransitionFrameButton(frame, targetFruit = null, rewardColor = 0x00FF00, targetType = 'Paramecia') {
    return updateTransitionFrame(frame, targetFruit, rewardColor, targetType);
}

// ═══════════════════════════════════════════════════════════════════
//                    MAIN CINEMATIC EXPERIENCE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction, userLevel, isInitialReply = true) {
    const frameDelay = 1000; // 1 second per frame
    let frame = 0;
    let currentMessage;
    let attempts = 0;
    const maxAttempts = 50;
    
    try {
        // Import required modules
        const { generateRandomDevilFruit } = require('../data/devilfruit');
        const DatabaseManager = require('../database/manager');
        const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        // Generate target fruit
        const targetFruit = generateRandomDevilFruit();
        console.log(`🎯 Animation Starting: ${targetFruit.name} (${targetFruit.rarity})`);
        
        // Get element information
        const fruitElement = DEVIL_FRUIT_ELEMENTS[targetFruit.id];
        const elementName = fruitElement ? CombatSystem.getElementName(fruitElement) : 'Unknown';
        
        const rewardColor = getRarityColor(targetFruit.rarity);
        const connectionStart = Date.now();
        
        // Phase 1: Main Animation (18 frames)
        for (frame = 0; frame < 18; frame++) {
            attempts++;
            if (attempts > maxAttempts) {
                console.log(`🚨 Max attempts reached, skipping to reveal`);
                break;
            }
            
            const embed = updateAnimationFrame(frame, targetFruit, targetFruit.type);
            
            if (frame === 0) {
                if (isInitialReply) {
                    currentMessage = await interaction.reply({
                        embeds: [embed],
                        fetchReply: true
                    });
                } else {
                    currentMessage = await interaction.editReply({
                        embeds: [embed],
                        components: []
                    });
                }
            } else {
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, frameDelay));
        }
        
        const animationFrames = frame;
        console.log(`📊 Animation Performance: ${animationFrames}/18 frames (${(animationFrames/18*100).toFixed(1)}%) - ${attempts} total attempts`);
        
        // Phase 2: Progression (12 frames)
        if (attempts <= maxAttempts) {
            console.log(`🌊 Starting progression phase...`);
            
            for (let progFrame = 0; progFrame < 12; progFrame++) {
                attempts++;
                if (attempts > maxAttempts) break;
                
                const embed = updateProgressionFrame(frame, targetFruit, targetFruit.type);
                
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                });
                
                frame++;
                await new Promise(resolve => setTimeout(resolve, frameDelay));
            }
        }
        
        // Phase 3: Transition (10 frames)
        if (attempts <= maxAttempts) {
            console.log(`🎆 Smooth transition: Rainbow to reward color...`);
            
            for (let transFrame = 0; transFrame < 10; transFrame++) {
                attempts++;
                if (attempts > maxAttempts) break;
                
                const embed = updateTransitionFrame(frame, targetFruit, rewardColor, targetFruit.type);
                
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                });
                
                frame++;
                await new Promise(resolve => setTimeout(resolve, frameDelay));
            }
        }
        
        // Calculate user stats for final reveal
        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userFruits = await DatabaseManager.getUserFruits(interaction.user.id);
        
        // Check for duplicates of this specific fruit
        const existingFruit = userFruits.find(fruit => fruit.fruit_id === targetFruit.id);
        const duplicateCount = userFruits.filter(fruit => fruit.fruit_id === targetFruit.id).length;
        const isNewFruit = !existingFruit;
        
        let userStats = {
            totalFruits: userFruits.length + 1, // +1 for the fruit we're about to add
            totalPower: 0,
            duplicateCount: duplicateCount,
            isNewFruit: isNewFruit
        };
        
        // Calculate total power with duplicate bonuses
        if (userLevel > 0) {
            const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
            
            // Calculate power for existing fruits with their duplicate bonuses
            const fruitPowerMap = {};
            userFruits.forEach(fruit => {
                if (!fruitPowerMap[fruit.fruit_id]) {
                    fruitPowerMap[fruit.fruit_id] = { count: 0, rarity: fruit.rarity };
                }
                fruitPowerMap[fruit.fruit_id].count++;
            });
            
            // Calculate total power including duplicate bonuses
            Object.values(fruitPowerMap).forEach(fruitData => {
                const basePower = CombatSystem.calculateBasePower(fruitData.rarity);
                const duplicateBonus = 1 + (fruitData.count - 1) * 0.01; // 1% per duplicate
                const totalFruitPower = Math.floor(basePower * levelMultiplier * duplicateBonus);
                userStats.totalPower += totalFruitPower * fruitData.count;
            });
            
            // Add current fruit power (with its duplicate bonus)
            const currentFruitBasePower = CombatSystem.calculateBasePower(targetFruit.rarity);
            const currentDuplicateBonus = 1 + duplicateCount * 0.01; // Include the new duplicate
            const currentFruitPower = Math.floor(currentFruitBasePower * levelMultiplier * currentDuplicateBonus);
            userStats.totalPower += currentFruitPower;
            userStats.currentFruitPower = currentFruitPower;
        }
        
        // Final reveal with enhanced embed
        console.log(`🎊 Gradual reveal: Devil Fruit information...`);
        
        const finalEmbed = createFinalRevealEmbed(targetFruit, userStats);
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
        
        await interaction.editReply({
            embeds: [finalEmbed],
            components: [actionRow]
        });
        
        // Save to database
        await DatabaseManager.saveUserFruit(interaction.user.id, targetFruit);
        await DatabaseManager.updateUserStats(interaction.user.id);
        
        const connectionTime = Date.now() - connectionStart;
        console.log(`📡 Connection quality: ${Math.round(connectionTime/attempts)}ms`);
        console.log(`🎊 Single hunt success: ${targetFruit.name} (${targetFruit.rarity}) for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('🚨 Animation Error:', error);
        
        // Fallback error handling
        const { generateRandomDevilFruit } = require('../data/devilfruit');
        const targetFruit = generateRandomDevilFruit();
        
        const errorEmbed = {
            color: 0xFF0000,
            title: "🚨 Animation Error",
            description: "Something went wrong with the animation. Here's your fruit anyway!",
            fields: [
                { name: "🍎 Devil Fruit", value: targetFruit.name || 'Unknown Fruit', inline: true },
                { name: "⭐ Rarity", value: targetFruit.rarity || 'unknown', inline: true },
                { name: "🌟 Type", value: targetFruit.type || 'unknown', inline: true }
            ]
        };
        
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
        
        await interaction.editReply({
            embeds: [errorEmbed],
            components: [actionRow]
        });
        
        // Still save the fruit to database
        try {
            const DatabaseManager = require('../database/manager');
            await DatabaseManager.saveUserFruit(interaction.user.id, targetFruit);
            await DatabaseManager.updateUserStats(interaction.user.id);
        } catch (dbError) {
            console.error('Failed to save fruit after animation error:', dbError);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
//                    EXPORT ALL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

module.exports = {
    // Main cinematic experience
    createUltimateCinematicExperience,
    
    // Main animation functions
    updateAnimationFrame,
    updateProgressionFrame, 
    updateTransitionFrame,
    
    // Button versions
    updateAnimationFrameButton,
    updateProgressionFrameButton,
    updateTransitionFrameButton,
    
    // Final reveal
    createFinalRevealEmbed,
    
    // Utility functions
    getSyncedRainbowPattern,
    getEmbedColorSyncedToFirst,
    getRarityColor,
    getRarityEmoji,
    
    // Professional systems
    createProfessionalStatusDisplay,
    getHuntDescription,
    getPhaseParticles,
    
    // Data exports
    HUNT_DESCRIPTIONS,
    STATUS_INDICATORS,
    PHASE_PARTICLES
};
