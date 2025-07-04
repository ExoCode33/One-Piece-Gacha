// Progressive indicators that stay mysterious until the very end

// Generic mysterious indicators for ALL fruits until final reveal
const MYSTERIOUS_INDICATORS = {
    aura: [
        'Faint spiritual pressure...',
        'Weak energy detected...',
        'Modest power emerging...',
        'Energy readings rising...',
        'Power signature strengthening...',
        'Spiritual force building...',
        'Mysterious energy intensifying...',
        'Unknown power crystallizing...',
        'Energy reaching critical mass...'
    ],
    blessing: [
        'Unknown blessing approaching...',
        'Mysterious force detected...',
        'Strange power manifesting...',
        'Unidentified energy building...',
        'Mystical presence growing...',
        'Divine force awakening...',
        'Sacred power emerging...',
        'Legendary essence stirring...',
        'Ultimate blessing descending...'
    ],
    typeHint: [
        'Strange energy signature...',
        'Unknown power type...',
        'Mysterious fruit classification...',
        'Unidentified Devil Fruit...',
        'Power category unclear...',
        'Fruit type manifesting...',
        'Classification emerging...',
        'True nature revealing...',
        'Final form approaching...'
    ]
};

// Only reveal actual fruit info in the VERY final frames
const REVEAL_INDICATORS = {
    // Rarity-specific reveals (only used in final 2 frames)
    aura: {
        common: 'Simple energy confirmed.',
        uncommon: 'Decent energy confirmed.',
        rare: 'Strong energy confirmed.',
        epic: 'Epic energy confirmed.',
        legendary: 'Legendary energy confirmed.',
        mythical: 'Mythical energy confirmed.',
        omnipotent: 'OMNIPOTENT ENERGY CONFIRMED!'
    },
    
    // Type-specific reveals (only used in final 2 frames)
    blessing: {
        'Paramecia': 'Paramecia blessing confirmed.',
        'Zoan': 'Zoan blessing confirmed.',
        'Logia': 'Logia blessing confirmed.',
        'Ancient Zoan': 'Ancient Zoan blessing confirmed.',
        'Mythical Zoan': 'Mythical Zoan blessing confirmed.',
        'Special Paramecia': 'Special Paramecia blessing confirmed.'
    },
    
    // Type hints (only used in final 2 frames)
    typeHint: {
        'Paramecia': 'Body-altering power confirmed!',
        'Zoan': 'Animal transformation confirmed!',
        'Logia': 'Elemental mastery confirmed!',
        'Ancient Zoan': 'Ancient beast power confirmed!',
        'Mythical Zoan': 'Mythical creature power confirmed!',
        'Special Paramecia': 'Special alteration confirmed!'
    }
};

/**
 * Get progressive indicators that stay mysterious until the very end
 * @param {number} frame - Current animation frame (0-17+)
 * @param {string} targetRarity - The rarity that will be revealed
 * @param {string} targetType - The type that will be revealed
 * @returns {Object} Contains aura, blessing, and typeHint text
 */
function getChangingIndicators(frame, targetRarity, targetType) {
    // Keep everything mysterious until the very final frames
    const maxFrames = 18;
    
    // Only reveal actual info in the last 2 frames of main animation (frames 16-17)
    if (frame >= 16) {
        return {
            aura: REVEAL_INDICATORS.aura[targetRarity] || 'Energy confirmed.',
            blessing: REVEAL_INDICATORS.blessing[targetType] || 'Blessing confirmed.',
            typeHint: REVEAL_INDICATORS.typeHint[targetType] || 'Power confirmed!'
        };
    }
    
    // For all other frames (0-15), use generic mysterious text
    const progression = Math.min(frame / maxFrames, 0.9); // Cap at 90% to stay mysterious
    
    // Calculate which mysterious text to use (gets more intense over time)
    const auraIndex = Math.min(Math.floor(progression * MYSTERIOUS_INDICATORS.aura.length), MYSTERIOUS_INDICATORS.aura.length - 1);
    const blessingIndex = Math.min(Math.floor(progression * MYSTERIOUS_INDICATORS.blessing.length), MYSTERIOUS_INDICATORS.blessing.length - 1);
    const hintIndex = Math.min(Math.floor(progression * MYSTERIOUS_INDICATORS.typeHint.length), MYSTERIOUS_INDICATORS.typeHint.length - 1);
    
    return {
        aura: MYSTERIOUS_INDICATORS.aura[auraIndex],
        blessing: MYSTERIOUS_INDICATORS.blessing[blessingIndex],
        typeHint: MYSTERIOUS_INDICATORS.typeHint[hintIndex]
    };
}

/**
 * Get indicators for progression phase (frames 18-29) - still mysterious but more intense
 * @param {number} progFrame - Progression frame (0-11)
 * @param {string} targetRarity - The rarity that will be revealed
 * @param {string} targetType - The type that will be revealed
 * @returns {Object} Contains more intense but still mysterious indicators
 */
function getProgressionIndicators(progFrame, targetRarity, targetType) {
    // Even in progression phase, keep it mysterious but more intense
    const intenseMysteriousIndicators = {
        aura: [
            'Massive energy building...',
            'Incredible power rising...',
            'Overwhelming force emerging...',
            'Legendary energy approaching...',
            'World-shaking power manifesting...',
            'Reality-bending energy confirmed!'
        ],
        blessing: [
            'Divine blessing intensifying...',
            'Sacred power overwhelming...',
            'Legendary blessing descending...',
            'Ultimate force manifesting...',
            'Transcendent power confirmed...',
            'Supreme blessing acknowledged!'
        ],
        typeHint: [
            'Incredible power type emerging...',
            'Legendary classification appearing...',
            'Ultimate fruit category manifesting...',
            'Supreme power type confirmed...',
            'World-changing ability acknowledged...',
            'Legendary power classification sealed!'
        ]
    };
    
    // Use intense mysterious text based on progression frame
    const index = Math.min(Math.floor(progFrame / 2), intenseMysteriousIndicators.aura.length - 1);
    
    return {
        aura: intenseMysteriousIndicators.aura[index],
        blessing: intenseMysteriousIndicators.blessing[index],
        typeHint: intenseMysteriousIndicators.typeHint[index]
    };
}

/**
 * Get final reveal indicators (used only after transition completes)
 * @param {string} targetRarity - The rarity that will be revealed
 * @param {string} targetType - The type that will be revealed
 * @returns {Object} Contains final confirmed indicator text
 */
function getFinalIndicators(targetRarity, targetType) {
    return {
        aura: REVEAL_INDICATORS.aura[targetRarity] || 'Energy confirmed.',
        blessing: REVEAL_INDICATORS.blessing[targetType] || 'Blessing confirmed.',
        typeHint: REVEAL_INDICATORS.typeHint[targetType] || 'Power confirmed!'
    };
}

/**
 * Get completely generic indicators (for when target is unknown)
 * @param {number} frame - Current frame
 * @returns {Object} Contains completely generic indicators
 */
function getGenericIndicators(frame) {
    const index = Math.min(Math.floor(frame / 3), MYSTERIOUS_INDICATORS.aura.length - 1);
    
    return {
        aura: MYSTERIOUS_INDICATORS.aura[index],
        blessing: MYSTERIOUS_INDICATORS.blessing[index],
        typeHint: MYSTERIOUS_INDICATORS.typeHint[index]
    };
}

/**
 * Get special omnipotent indicators with extra emphasis (only for final reveal)
 * @param {number} frame - Current frame
 * @returns {Object} Contains dramatic omnipotent-specific text
 */
function getOmnipotentIndicators(frame) {
    // Only use these for omnipotent fruits in the final reveal
    return {
        aura: 'OMNIPOTENT ENERGY CONFIRMED!!!',
        blessing: 'ULTIMATE BLESSING ACKNOWLEDGED!!!',
        typeHint: 'REALITY-SHAPING POWER SEALED!!!'
    };
}

module.exports = {
    getChangingIndicators,
    getProgressionIndicators,
    getFinalIndicators,
    getGenericIndicators,
    getOmnipotentIndicators,
    MYSTERIOUS_INDICATORS,
    REVEAL_INDICATORS
};
