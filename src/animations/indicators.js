// One Piece themed indicators system for Devil Fruit animation

// Fruit Energy Levels (replaces aura - shows the Devil Fruit's power emanating)
const FRUIT_ENERGY_LEVELS = {
    'common': ['FAINT AURA', 'WEAK GLOW', 'SOFT SHIMMER'],
    'uncommon': ['GENTLE PULSE', 'STEADY GLOW', 'WARM RADIANCE'],
    'rare': ['BRIGHT ENERGY', 'STRONG PULSE', 'VIBRANT AURA'],
    'epic': ['CRACKLING POWER', 'INTENSE ENERGY', 'PULSING FORCE'],
    'legendary': ['BLAZING POWER', 'ROARING ENERGY', 'OVERWHELMING FORCE'],
    'mythical': ['REALITY DISTORTION', 'COSMIC ENERGY', 'WORLD-SHAKING AURA'],
    'omnipotent': ['GODLIKE PRESENCE', 'UNIVERSE-BENDING POWER', 'ABSOLUTE AUTHORITY']
};

// Rarity Sense Levels (hints at the fruit's classification level)
const RARITY_SENSE_LEVELS = {
    'common': ['STANDARD FRUIT', 'ORDINARY POWER', 'BASIC ABILITY'],
    'uncommon': ['DECENT FRUIT', 'NOTABLE POWER', 'SOLID ABILITY'],
    'rare': ['IMPRESSIVE FRUIT', 'STRONG POWER', 'REMARKABLE ABILITY'],
    'epic': ['POWERFUL FRUIT', 'GREAT POWER', 'EXTRAORDINARY ABILITY'],
    'legendary': ['RENOWNED FRUIT', 'IMMENSE POWER', 'LEGENDARY ABILITY'],
    'mythical': ['MYTHICAL FRUIT', 'DIVINE POWER', 'REALITY-ALTERING ABILITY'],
    'omnipotent': ['ULTIMATE FRUIT', 'SUPREME POWER', 'WORLD-CHANGING ABILITY']
};

// Devil Fruit Type Classifications
const DEVIL_FRUIT_CLASSIFICATIONS = {
    'Paramecia': ['SUPERHUMAN BODY', 'REALITY MANIPULATION', 'SPECIAL ABILITY'],
    'Zoan': ['ANIMAL TRANSFORMATION', 'BEAST POWER', 'PRIMAL INSTINCT'],
    'Logia': ['NATURE\'S FORCE', 'ELEMENTAL POWER', 'NATURAL PHENOMENON'],
    'Ancient Zoan': ['PREHISTORIC BEAST', 'ANCIENT POWER', 'EXTINCT CREATURE'],
    'Mythical Zoan': ['LEGENDARY CREATURE', 'DIVINE BEAST', 'MYTHICAL BEING'],
    'Special Paramecia': ['UNIQUE AWAKENING', 'SPECIAL NATURE', 'EXTRAORDINARY TYPE']
};

// Random cycling options for early animation frames
const RANDOM_ENERGY_OPTIONS = [
    'SENSING POWER...', 'ANALYZING ENERGY...', 'DETECTING AURA...', 'FEELING PRESENCE...',
    'MYSTERIOUS FORCE', 'UNKNOWN ENERGY', 'HIDDEN POWER', 'VEILED STRENGTH',
    'STIRRING ENERGY', 'BUILDING FORCE', 'GROWING POWER', 'RISING AURA'
];

const RANDOM_RARITY_OPTIONS = [
    'UNKNOWN GRADE', 'MYSTERIOUS RANK', 'HIDDEN CLASS', 'VEILED TIER',
    'ANALYZING...', 'SCANNING...', 'DETECTING...', 'EVALUATING...',
    'STANDARD?', 'SPECIAL?', 'RARE?', 'LEGENDARY?'
];

const RANDOM_TYPE_OPTIONS = [
    'UNKNOWN TYPE', 'MYSTERIOUS FRUIT', 'HIDDEN NATURE', 'VEILED ABILITY',
    'BODY CHANGE?', 'ANIMAL FORM?', 'ELEMENTAL?', 'SPECIAL POWER?',
    'PARAMECIA?', 'ZOAN?', 'LOGIA?', 'MYTHICAL?'
];

/**
 * Get the appropriate energy level for a rarity
 * @param {string} rarity - The Devil Fruit rarity
 * @returns {string} Energy level description
 */
function getFruitEnergyLevel(rarity) {
    const levels = FRUIT_ENERGY_LEVELS[rarity];
    if (!levels) return 'UNKNOWN ENERGY';
    
    // Return random level from the rarity tier
    return levels[Math.floor(Math.random() * levels.length)];
}

/**
 * Get the appropriate rarity sense for a rarity
 * @param {string} rarity - The Devil Fruit rarity
 * @returns {string} Rarity sense description
 */
function getRaritySense(rarity) {
    const senses = RARITY_SENSE_LEVELS[rarity];
    if (!senses) return 'UNKNOWN FRUIT';
    
    // Return random sense from the rarity tier
    return senses[Math.floor(Math.random() * senses.length)];
}

/**
 * Get the appropriate type classification for a Devil Fruit type
 * @param {string} type - The Devil Fruit type
 * @returns {string} Type classification description
 */
function getTypeClassification(type) {
    const classifications = DEVIL_FRUIT_CLASSIFICATIONS[type];
    if (!classifications) return 'UNKNOWN TYPE';
    
    // Return random classification from the type
    return classifications[Math.floor(Math.random() * classifications.length)];
}

/**
 * Get random cycling indicator
 * @param {Array} options - Array of random options
 * @returns {string} Random option
 */
function getRandomIndicator(options) {
    return options[Math.floor(Math.random() * options.length)];
}

/**
 * Main function to get changing indicators based on animation frame
 * @param {number} frame - Current animation frame
 * @param {string} finalRarity - The final rarity of the Devil Fruit
 * @param {string} finalType - The final type of the Devil Fruit
 * @returns {Object} Object containing current indicators
 */
function getChangingIndicators(frame, finalRarity, finalType) {
    let energy, rarity, type;
    
    // Progressive lock system based on frame number
    // Early frames (0-4): Everything random
    if (frame < 5) {
        energy = getRandomIndicator(RANDOM_ENERGY_OPTIONS);
        rarity = getRandomIndicator(RANDOM_RARITY_OPTIONS);
        type = getRandomIndicator(RANDOM_TYPE_OPTIONS);
    }
    // Mid frames (5-8): Energy locks to correct value
    else if (frame < 9) {
        energy = getFruitEnergyLevel(finalRarity);
        rarity = getRandomIndicator(RANDOM_RARITY_OPTIONS);
        type = getRandomIndicator(RANDOM_TYPE_OPTIONS);
    }
    // Later frames (9-12): Energy + Rarity lock
    else if (frame < 13) {
        energy = getFruitEnergyLevel(finalRarity);
        rarity = getRaritySense(finalRarity);
        type = getRandomIndicator(RANDOM_TYPE_OPTIONS);
    }
    // Final frames (13+): All indicators locked
    else {
        energy = getFruitEnergyLevel(finalRarity);
        rarity = getRaritySense(finalRarity);
        type = getTypeClassification(finalType);
    }
    
    return {
        aura: energy,        // For backward compatibility
        blessing: rarity,    // For backward compatibility
        typeHint: type,
        fruitEnergy: energy,
        raritySense: rarity,
        typeClassification: type
    };
}

/**
 * Get indicators for a specific lock phase
 * @param {string} phase - 'random', 'energy', 'rarity', 'complete'
 * @param {string} finalRarity - The final rarity
 * @param {string} finalType - The final type
 * @returns {Object} Indicators for the phase
 */
function getIndicatorsForPhase(phase, finalRarity, finalType) {
    switch (phase) {
        case 'random':
            return {
                aura: getRandomIndicator(RANDOM_ENERGY_OPTIONS),
                blessing: getRandomIndicator(RANDOM_RARITY_OPTIONS),
                typeHint: getRandomIndicator(RANDOM_TYPE_OPTIONS)
            };
        case 'energy':
            return {
                aura: getFruitEnergyLevel(finalRarity),
                blessing: getRandomIndicator(RANDOM_RARITY_OPTIONS),
                typeHint: getRandomIndicator(RANDOM_TYPE_OPTIONS)
            };
        case 'rarity':
            return {
                aura: getFruitEnergyLevel(finalRarity),
                blessing: getRaritySense(finalRarity),
                typeHint: getRandomIndicator(RANDOM_TYPE_OPTIONS)
            };
        case 'complete':
            return {
                aura: getFruitEnergyLevel(finalRarity),
                blessing: getRaritySense(finalRarity),
                typeHint: getTypeClassification(finalType)
            };
        default:
            return getIndicatorsForPhase('random', finalRarity, finalType);
    }
}

/**
 * Get preview of what indicators will show for a given rarity/type
 * @param {string} rarity - Devil Fruit rarity
 * @param {string} type - Devil Fruit type
 * @returns {Object} Preview of final indicators
 */
function getIndicatorPreview(rarity, type) {
    return {
        energy: getFruitEnergyLevel(rarity),
        rarity: getRaritySense(rarity),
        type: getTypeClassification(type)
    };
}

/**
 * Get all possible indicators for a rarity (for admin/debug purposes)
 * @param {string} rarity - Devil Fruit rarity
 * @returns {Object} All possible indicators for the rarity
 */
function getAllIndicatorsForRarity(rarity) {
    return {
        energy: FRUIT_ENERGY_LEVELS[rarity] || ['UNKNOWN'],
        rarity: RARITY_SENSE_LEVELS[rarity] || ['UNKNOWN'],
        types: Object.keys(DEVIL_FRUIT_CLASSIFICATIONS)
    };
}

/**
 * Validate rarity and type
 * @param {string} rarity - Rarity to validate
 * @param {string} type - Type to validate
 * @returns {Object} Validation result
 */
function validateIndicatorInputs(rarity, type) {
    const validRarity = FRUIT_ENERGY_LEVELS.hasOwnProperty(rarity);
    const validType = DEVIL_FRUIT_CLASSIFICATIONS.hasOwnProperty(type);
    
    return {
        valid: validRarity && validType,
        validRarity,
        validType,
        availableRarities: Object.keys(FRUIT_ENERGY_LEVELS),
        availableTypes: Object.keys(DEVIL_FRUIT_CLASSIFICATIONS)
    };
}

// Export all functions and data
module.exports = {
    // Main function
    getChangingIndicators,
    
    // Helper functions
    getFruitEnergyLevel,
    getRaritySense,
    getTypeClassification,
    getRandomIndicator,
    getIndicatorsForPhase,
    getIndicatorPreview,
    getAllIndicatorsForRarity,
    validateIndicatorInputs,
    
    // Data constants
    FRUIT_ENERGY_LEVELS,
    RARITY_SENSE_LEVELS,
    DEVIL_FRUIT_CLASSIFICATIONS,
    RANDOM_ENERGY_OPTIONS,
    RANDOM_RARITY_OPTIONS,
    RANDOM_TYPE_OPTIONS
};
