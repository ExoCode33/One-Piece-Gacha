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
        `${particles}`,
        "",
        `${rainbowPattern}`
    ].join('\n');
    
    return {
        color: embedColor,
        title: "🏴‍☠️ Devil Fruit Hunt - Scanning Phase",
        description: content,
        footer: { 
            text: `🌊 Scan ${frame + 1}/18 | Grand Line Energy: ${Math.floor(Math.random() * 40 + 60)}%` 
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
        `${particles}`,
        "",
        `${rainbowPattern}`
    ].join('\n');
    
    return {
        color: embedColor,
        title: "⚡ Devil Fruit Hunt - Crystallization Phase",
        description: content,
        footer: { 
            text: `⚡ Crystallization ${actualFrame + 1}/12 | Power Surge: ${Math.floor(Math.random() * 30 + 70)}%` 
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
    
    // Start revealing some actual info in later transition frames
    let statusDisplay;
    if (transitionFrame < 6) {
        statusDisplay = [
            `🌟 **Materialization:** IN PROGRESS`,
            `👑 **Legend Status:** EMERGING`,
            `💎 **Power Class:** MANIFESTING`
        ].join('\n');
    } else {
        statusDisplay = [
            `🍈 **Devil Fruit:** ${targetFruit?.name || 'CLASSIFIED'}`,
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
        `${particles}`,
        "",
        `${transitionBar}`
    ].join('\n');
    
    return {
        color: transitionFrame > 5 ? rewardColor : getEmbedColorSyncedToFirst(frame),
        title: "💎 Devil Fruit Hunt - Manifestation Phase",
        description: content,
        footer: { 
            text: `💎 Manifestation ${transitionFrame + 1}/10 | Reality Anchor: ${Math.floor(Math.random() * 20 + 80)}%` 
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
        title: "🏴‍☠️ Devil Fruit Claimed!",
        description: content,
        footer: { 
            text: "🌊 Your legend grows stronger | Set sail with your new power!" 
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
//                    EXPORT ALL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

module.exports = {
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
