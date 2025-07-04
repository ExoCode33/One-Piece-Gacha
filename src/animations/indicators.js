// Progressive indicators that change during the animation to hint at the final result

// Rarity-based aura descriptions
const RARITY_AURAS = {
    common: [
        'Faint spiritual pressure...',
        'Weak energy detected...',
        'Modest power emerging...',
        'Basic aura stabilizing...',
        'Simple energy confirmed.'
    ],
    uncommon: [
        'Notable energy building...',
        'Decent power detected...',
        'Solid aura forming...',
        'Respectable force emerging...',
        'Good energy confirmed.'
    ],
    rare: [
        'Strong energy surging...',
        'Impressive power detected...',
        'Powerful aura manifesting...',
        'Significant force building...',
        'Strong energy confirmed.'
    ],
    epic: [
        'Intense energy blazing...',
        'Remarkable power detected...',
        'Epic aura radiating...',
        'Exceptional force emerging...',
        'Epic energy confirmed.'
    ],
    legendary: [
        'Legendary energy roaring...',
        'Incredible power detected...',
        'Legendary aura overwhelming...',
        'Mythic force awakening...',
        'Legendary energy confirmed.'
    ],
    mythical: [
        'Reality-bending energy...',
        'World-shaking power...',
        'Mythical aura transcending...',
        'Godlike force manifesting...',
        'Mythical energy confirmed.'
    ],
    omnipotent: [
        'OMNIPOTENT ENERGY...',
        'REALITY ITSELF TREMBLES...',
        'DIVINE AURA ASCENDING...',
        'ABSOLUTE POWER...',
        'OMNIPOTENT CONFIRMED.'
    ]
};

// Type-based blessing descriptions  
const TYPE_BLESSINGS = {
    'Paramecia': [
        'Body transformation sensed...',
        'Physical alteration detected...',
        'Bodily powers manifesting...',
        'Paramecia blessing emerging...',
        'Paramecia power confirmed.'
    ],
    'Zoan': [
        'Animal instincts stirring...',
        'Beast transformation detected...',
        'Primal powers awakening...',
        'Zoan blessing manifesting...',
        'Zoan power confirmed.'
    ],
    'Logia': [
        'Elemental forces gathering...',
        'Natural power detected...',
        'Elemental mastery awakening...',
        'Logia blessing descending...',
        'Logia power confirmed.'
    ],
    'Ancient Zoan': [
        'Ancient instincts awakening...',
        'Prehistoric power detected...',
        'Primordial forces stirring...',
        'Ancient blessing manifesting...',
        'Ancient Zoan confirmed.'
    ],
    'Mythical Zoan': [
        'Legendary creature stirring...',
        'Mythical power detected...',
        'Divine beast awakening...',
        'Mythical blessing descending...',
        'Mythical Zoan confirmed.'
    ],
    'Special Paramecia': [
        'Unique transformation sensed...',
        'Special power detected...',
        'Extraordinary ability awakening...',
        'Special blessing manifesting...',
        'Special Paramecia confirmed.'
    ]
};

// Generic type hints that gradually become more specific
const TYPE_HINTS = {
    'Paramecia': [
        'Strange energy signature...',
        'Bodily enhancement detected...',
        'Physical alteration incoming...',
        'Paramecia type emerging...',
        'Body-altering power!'
    ],
    'Zoan': [
        'Wild energy signature...',
        'Animalistic power detected...',
        'Beast transformation incoming...',
        'Zoan type emerging...',
        'Animal transformation power!'
    ],
    'Logia': [
        'Elemental energy signature...',
        'Natural force detected...',
        'Elemental mastery incoming...',
        'Logia type emerging...',
        'Elemental transformation power!'
    ],
    'Ancient Zoan': [
        'Prehistoric energy signature...',
        'Ancient power detected...',
        'Primordial transformation...',
        'Ancient Zoan emerging...',
        'Ancient beast power!'
    ],
    'Mythical Zoan': [
        'Legendary energy signature...',
        'Mythical power detected...',
        'Divine transformation incoming...',
        'Mythical Zoan emerging...',
        'Legendary creature power!'
    ],
    'Special Paramecia': [
        'Unique energy signature...',
        'Special power detected...',
        'Extraordinary transformation...',
        'Special Paramecia emerging...',
        'Unique alteration power!'
    ]
};

/**
 * Get progressive indicators that change throughout the animation
 * @param {number} frame - Current animation frame (0-17+)
 * @param {string} targetRarity - The rarity that will be revealed
 * @param {string} targetType - The type that will be revealed
 * @returns {Object} Contains aura, blessing, and typeHint text
 */
function getChangingIndicators(frame, targetRarity, targetType) {
    // Calculate progression through animation (0.0 to 1.0)
    const maxFrames = 18; // Main animation has 18 frames
    const progression = Math.min(frame / maxFrames, 1.0);
    
    // Get arrays for target rarity and type
    const auraArray = RARITY_AURAS[targetRarity] || RARITY_AURAS.common;
    const blessingArray = TYPE_BLESSINGS[targetType] || TYPE_BLESSINGS['Paramecia'];
    const hintArray = TYPE_HINTS[targetType] || TYPE_HINTS['Paramecia'];
    
    // Calculate which index to use based on progression
    const auraIndex = Math.min(Math.floor(progression * auraArray.length), auraArray.length - 1);
    const blessingIndex = Math.min(Math.floor(progression * blessingArray.length), blessingArray.length - 1);
    const hintIndex = Math.min(Math.floor(progression * hintArray.length), hintArray.length - 1);
    
    return {
        aura: auraArray[auraIndex],
        blessing: blessingArray[blessingIndex],
        typeHint: hintArray[hintIndex]
    };
}

/**
 * Get indicators for progression phase (frames 18-29)
 * @param {number} progFrame - Progression frame (0-11)
 * @param {string} targetRarity - The rarity that will be revealed
 * @param {string} targetType - The type that will be revealed
 * @returns {Object} Contains more locked-in indicator text
 */
function getProgressionIndicators(progFrame, targetRarity, targetType) {
    // During progression, indicators become more locked
    const auraArray = RARITY_AURAS[targetRarity] || RARITY_AURAS.common;
    const blessingArray = TYPE_BLESSINGS[targetType] || TYPE_BLESSINGS['Paramecia'];
    const hintArray = TYPE_HINTS[targetType] || TYPE_HINTS['Paramecia'];
    
    // Use later indices to show more certainty
    const baseIndex = Math.max(0, auraArray.length - 3);
    const progIndex = Math.min(baseIndex + Math.floor(progFrame / 4), auraArray.length - 1);
    
    return {
        aura: auraArray[progIndex],
        blessing: blessingArray[progIndex],
        typeHint: hintArray[progIndex]
    };
}

/**
 * Get final reveal indicators
 * @param {string} targetRarity - The rarity that will be revealed
 * @param {string} targetType - The type that will be revealed
 * @returns {Object} Contains final confirmed indicator text
 */
function getFinalIndicators(targetRarity, targetType) {
    const auraArray = RARITY_AURAS[targetRarity] || RARITY_AURAS.common;
    const blessingArray = TYPE_BLESSINGS[targetType] || TYPE_BLESSINGS['Paramecia'];
    const hintArray = TYPE_HINTS[targetType] || TYPE_HINTS['Paramecia'];
    
    // Use the final index for confirmed text
    return {
        aura: auraArray[auraArray.length - 1],
        blessing: blessingArray[blessingArray.length - 1],
        typeHint: hintArray[hintArray.length - 1]
    };
}

/**
 * Get random early indicators (for when target is unknown)
 * @param {number} frame - Current frame
 * @returns {Object} Contains generic early-stage indicators
 */
function getGenericIndicators(frame) {
    const genericAuras = [
        'Mysterious energy building...',
        'Unknown power stirring...',
        'Strange forces gathering...',
        'Mystical energy detected...',
        'Power signature emerging...'
    ];
    
    const genericBlessings = [
        'Divine blessing approaching...',
        'Spiritual force manifesting...',
        'Mystical blessing descending...',
        'Sacred power awakening...',
        'Heavenly energy gathering...'
    ];
    
    const genericHints = [
        'Unknown fruit type...',
        'Power classification unclear...',
        'Devil Fruit category unknown...',
        'Fruit type manifesting...',
        'Classification emerging...'
    ];
    
    const index = Math.min(Math.floor(frame / 4), 4);
    
    return {
        aura: genericAuras[index],
        blessing: genericBlessings[index],
        typeHint: genericHints[index]
    };
}

/**
 * Get special omnipotent indicators with extra emphasis
 * @param {number} frame - Current frame
 * @returns {Object} Contains dramatic omnipotent-specific text
 */
function getOmnipotentIndicators(frame) {
    const omnipotentSequence = [
        {
            aura: 'REALITY BENDS...',
            blessing: 'THE WORLD TREMBLES...',
            typeHint: 'IMPOSSIBLE POWER...'
        },
        {
            aura: 'TIME ITSELF STOPS...',
            blessing: 'GODS TAKE NOTICE...',
            typeHint: 'LEGENDARY FORCE...'
        },
        {
            aura: 'SPACE WARPS...',
            blessing: 'HEAVEN SHAKES...',
            typeHint: 'DIVINE ARTIFACT...'
        },
        {
            aura: 'EXISTENCE QUIVERS...',
            blessing: 'CREATION ITSELF BOWS...',
            typeHint: 'OMNIPOTENT RELIC...'
        },
        {
            aura: 'OMNIPOTENT ENERGY!!!',
            blessing: 'ULTIMATE BLESSING!!!',
            typeHint: 'REALITY-SHAPING POWER!!!'
        }
    ];
    
    const index = Math.min(Math.floor(frame / 4), omnipotentSequence.length - 1);
    return omnipotentSequence[index];
}

module.exports = {
    getChangingIndicators,
    getProgressionIndicators,
    getFinalIndicators,
    getGenericIndicators,
    getOmnipotentIndicators,
    RARITY_AURAS,
    TYPE_BLESSINGS,
    TYPE_HINTS
};
