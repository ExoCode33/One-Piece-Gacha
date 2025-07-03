// ═══════════════════════════════════════════════════════════════════
//                 PROGRESSIVE INDICATORS SYSTEM
// ═══════════════════════════════════════════════════════════════════

const IndicatorsSystem = {
    // PROGRESSIVE RARITY HINTS without spoiling
    getAuraLevel(rarity) {
        const auraLevels = {
            common: 'STIRRING',
            uncommon: 'BUILDING', 
            rare: 'INTENSIFYING',
            legendary: 'BLAZING',
            mythical: 'TRANSCENDENT',
            omnipotent: 'REALITY-BREAKING'
        };
        return auraLevels[rarity] || 'STIRRING';
    },

    getBlessingLevel(rarity) {
        const blessingLevels = {
            common: 'GENTLE',
            uncommon: 'NOTABLE',
            rare: 'POWERFUL', 
            legendary: 'DIVINE',
            mythical: 'WORLD-SHAKING',
            omnipotent: 'UNIVERSE-ALTERING'
        };
        return blessingLevels[rarity] || 'GENTLE';
    },

    getTypeHint(type) {
        const typeHints = {
            'Paramecia': 'BODY MANIPULATION',
            'Zoan': 'BEAST TRANSFORMATION', 
            'Logia': 'ELEMENTAL FORCE',
            'Ancient Zoan': 'PREHISTORIC POWER',
            'Mythical Zoan': 'LEGENDARY CREATURE',
            'Special Paramecia': 'UNIQUE MANIFESTATION'
        };
        return typeHints[type] || 'MYSTERIOUS POWER';
    },

    // RAPID CHANGING INDICATORS that gradually lock in (EXACTLY 3 LINES)
    getChangingIndicators(frame, finalRarity, finalType) {
        const allRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
        const allTypes = ['Paramecia', 'Zoan', 'Logia', 'Ancient Zoan', 'Mythical Zoan'];
        
        // Lock frames: indicators lock in one by one
        const lockFrames = {
            aura: frame >= 6,     // Locks after 6 frames
            blessing: frame >= 7, // Locks after 7 frames  
            type: frame >= 8      // Type locks last
        };
        
        return {
            aura: lockFrames.aura ? 
                this.getAuraLevel(finalRarity) : 
                this.getAuraLevel(allRarities[frame % allRarities.length]),
            
            blessing: lockFrames.blessing ? 
                this.getBlessingLevel(finalRarity) : 
                this.getBlessingLevel(allRarities[(frame + 2) % allRarities.length]),
            
            type: lockFrames.type ? 
                this.getTypeHint(finalType) : 
                this.getTypeHint(allTypes[frame % allTypes.length])
        };
    }
};

module.exports = { IndicatorsSystem };
