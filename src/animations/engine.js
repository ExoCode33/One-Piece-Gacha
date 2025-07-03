const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                     DEBUG SYSTEM FOR TESTING
// ═══════════════════════════════════════════════════════════════════
const DEBUG_CONFIG = {
    enabled: false,
    forcedRarity: null,
    logMessages: true
};

function setDebugMode(enabled) {
    DEBUG_CONFIG.enabled = enabled;
    if (!enabled) {
        DEBUG_CONFIG.forcedRarity = null;
    }
    if (DEBUG_CONFIG.logMessages) {
        console.log(`🔧 DEBUG MODE: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }
    return DEBUG_CONFIG.enabled;
}

function setForcedRarity(rarity) {
    if (!DEBUG_CONFIG.enabled) {
        if (DEBUG_CONFIG.logMessages) {
            console.log(`⚠️ DEBUG MODE is disabled. Enable it first.`);
        }
        return false;
    }
    
    const validRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent', null];
    if (rarity && !validRarities.includes(rarity)) {
        if (DEBUG_CONFIG.logMessages) {
            console.log(`❌ Invalid rarity: ${rarity}. Valid options: ${validRarities.filter(r => r !== null).join(', ')}`);
        }
        return false;
    }
    
    DEBUG_CONFIG.forcedRarity = rarity;
    if (DEBUG_CONFIG.logMessages) {
        console.log(`🎯 FORCED RARITY: ${rarity || 'OFF (random)'}`);
    }
    return true;
}

function getTestRarity() {
    // If debug mode is enabled and a rarity is forced, use it
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.forcedRarity) {
        if (DEBUG_CONFIG.logMessages) {
            console.log(`🎯 Debug Mode: Using forced rarity: ${DEBUG_CONFIG.forcedRarity}`);
        }
        return DEBUG_CONFIG.forcedRarity;
    }
    
    // Otherwise use normal rarity calculation
    const rarity = DevilFruitDatabase.calculateDropRarity();
    if (DEBUG_CONFIG.logMessages && DEBUG_CONFIG.enabled) {
        console.log(`🎲 Debug Mode: Random rarity rolled: ${rarity}`);
    }
    return rarity;
}

function getDebugStatus() {
    return {
        enabled: DEBUG_CONFIG.enabled,
        forcedRarity: DEBUG_CONFIG.forcedRarity,
        logMessages: DEBUG_CONFIG.logMessages
    };
}

// ═══════════════════════════════════════════════════════════════════
//                 NEXT-GENERATION GACHA ENGINE
// ═══════════════════════════════════════════════════════════════════

const NextGenGachaEngine = {
    // ULTRA-DIVERSE COLORS
    hyperSpectrumColors: [
        '#FF0000', '#FF0606', '#FF0C0C', '#FF1212', '#FF1818', '#FF1E1E', '#FF2424', '#FF2A2A',
        '#FF3030', '#FF3636', '#FF3C3C', '#FF4242', '#FF4848', '#FF4E4E', '#FF5454', '#FF5A5A',
        '#FF6000', '#FF6606', '#FF6C0C', '#FF7212', '#FF7818', '#FF7E1E', '#FF8424', '#FF8A2A',
        '#FF9030', '#FF9636', '#FF9C3C', '#FFA242', '#FFA848', '#FFAE4E', '#FFB454', '#FFBA5A',
        '#FFCC00', '#FFD206', '#FFD80C', '#FFDE12', '#FFE418', '#FFEA1E', '#FFF024', '#FFF62A',
        '#FFFC30', '#FFFF36', '#F9FF3C', '#F3FF42', '#EDFF48', '#E7FF4E', '#E1FF54', '#DBFF5A',
        '#00FF00', '#06FF06', '#0CFF0C', '#12FF12', '#18FF18', '#1EFF1E', '#24FF24', '#2AFF2A',
        '#30FF30', '#36FF36', '#3CFF3C', '#42FF42', '#48FF48', '#4EFF4E', '#54FF54', '#5AFF5A',
        '#00FFFF', '#06F9FF', '#0CF3FF', '#12EDFF', '#18E7FF', '#1EE1FF', '#24DBFF', '#2AD5FF',
        '#30CFFF', '#36C9FF', '#3CC3FF', '#42BDFF', '#48B7FF', '#4EB1FF', '#54ABFF', '#5AA5FF',
        '#0080FF', '#0686FF', '#0C8CFF', '#1292FF', '#1898FF', '#1E9EFF', '#24A4FF', '#2AAAFF',
        '#30B0FF', '#36B6FF', '#3CBCFF', '#42C2FF', '#48C8FF', '#4ECEFF', '#54D4FF', '#5ADAFF',
        '#8000FF', '#8606FF', '#8C0CFF', '#9212FF', '#9818FF', '#9E1EFF', '#A424FF', '#AA2AFF',
        '#B030FF', '#B636FF', '#BC3CFF', '#C242FF', '#C848FF', '#CE4EFF', '#D454FF', '#DA5AFF',
        '#FF00FF', '#FF06F9', '#FF0CF3', '#FF12ED', '#FF18E7', '#FF1EE1', '#FF24DB', '#FF2AD5',
        '#FF30CF', '#FF36C9', '#FF3CC3', '#FF42BD', '#FF48B7', '#FF4EB1', '#FF54AB', '#FF5AA5',
        '#FF0080', '#FF0686', '#FF0C8C', '#FF1292', '#FF1898', '#FF1E9E', '#FF24A4', '#FF2AAA',
        '#FF30B0', '#FF36B6', '#FF3CBC', '#FF42C2', '#FF48C8', '#FF4ECE', '#FF54D4', '#FF5ADA',
        '#FFD700', '#FFDB06', '#FFDF0C', '#FFE312', '#FFE718', '#FFEB1E', '#FFEF24', '#FFF32A',
        '#FFF730', '#FFFB36', '#FFFF3C', '#FBFF42', '#F7FF48', '#F3FF4E', '#EFFF54', '#EBFF5A'
    ],

    getHyperSpectrumColor(frame, intensity = 1, variance = 0) {
        const stream1 = (frame * 17 + intensity * 23 + variance * 7) % this.hyperSpectrumColors.length;
        const stream2 = (frame * 31 + intensity * 41 + variance * 13) % this.hyperSpectrumColors.length;
        const stream3 = (frame * 43 + intensity * 47 + variance * 19) % this.hyperSpectrumColors.length;
        
        const goldenRatio = 1.618033988749;
        const combinedIndex = Math.floor((stream1 + stream2 * goldenRatio + stream3 * (goldenRatio * goldenRatio)) % this.hyperSpectrumColors.length);
        return this.hyperSpectrumColors[combinedIndex];
    },

    // PROGRESSION BAR SYSTEM - Moving rainbow effect that actually moves
    createDynamicEnergyStatus(percentage, frame, phase = 'charging', currentEmbedColor = '#0099FF') {
        const phaseDescriptors = {
            scanning: ['AWAKENING', 'STIRRING', 'CALLING', 'REACHING', 'SUMMONING'],
            charging: ['RISING', 'BUILDING', 'SURGING', 'SWELLING', 'ROARING', 'BLAZING', 'TRANSCENDING'],
            critical: ['LEGENDARY', 'MYTHICAL', 'TRANSCENDENT', 'OVERWHELMING', 'BOUNDLESS'],
            materializing: ['FORMING', 'BLESSING', 'CHOOSING', 'BESTOWING', 'GRANTING']
        };
        
        const descriptors = phaseDescriptors[phase] || phaseDescriptors.charging;
        const descriptorIndex = Math.floor(percentage / 15);
        const energyLevel = descriptors[Math.min(descriptorIndex, descriptors.length - 1)];
        
        // CONSISTENT WIDTH - Always 20 squares
        const maxSlots = 20;
        const filledSlots = Math.floor((percentage / 100) * maxSlots);
        
        // Rainbow colors that cycle through
        const colors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'];
        
        // Build progress bar with moving rainbow
        let progressBar = '';
        
        // Filled squares with rainbow that shifts every frame
        for (let i = 0; i < filledSlots; i++) {
            // Rainbow shifts: frame 0 starts with red, frame 1 starts with orange, etc.
            const colorIndex = (i + frame) % colors.length;
            progressBar += colors[colorIndex];
            if (i < filledSlots - 1) progressBar += ' ';
        }
        
        // Empty squares
        const emptySlots = maxSlots - filledSlots;
        if (emptySlots > 0) {
            if (filledSlots > 0) progressBar += ' ';
            for (let i = 0; i < emptySlots; i++) {
                progressBar += '⬜';
                if (i < emptySlots - 1) progressBar += ' ';
            }
        }
        
        return `**${energyLevel}**\n${progressBar}`;
    },

    // Create rarity reveal bar for final phase
    createRarityRevealBar(rarity, frame) {
        const rarityColors = {
            common: '⬜',
            uncommon: '🟩',
            rare: '🟦',
            legendary: '🟨',
            mythical: '🟥',
            omnipotent: '🌈'
        };
        
        const squareColor = rarityColors[rarity] || '⬜';
        let progressBar = '';
        
        if (rarity === 'omnipotent') {
            // Special rainbow effect
            const rainbowSquares = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'];
            for (let i = 0; i < 20; i++) {
                const colorIndex = (i + frame) % rainbowSquares.length;
                progressBar += rainbowSquares[colorIndex];
                if (i < 19) progressBar += ' ';
            }
        } else {
            // Normal rarity color - full bar
            for (let i = 0; i < 20; i++) {
                progressBar += squareColor;
                if (i < 19) progressBar += ' ';
            }
        }
        
        return `**TRANSCENDENT**\n${progressBar}`;
    }
};

module.exports = {
    NextGenGachaEngine,
    setDebugMode,
    setForcedRarity,
    getTestRarity,
    getDebugStatus,
    DEBUG_CONFIG
};
