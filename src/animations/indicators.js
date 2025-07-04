// ═══════════════════════════════════════════════════════════════════
//                 ONE PIECE THEMED INDICATORS SYSTEM
// ═══════════════════════════════════════════════════════════════════

const IndicatorsSystem = {
    // DEVIL FRUIT ENERGY based on rarity (actual fruit power)
    getFruitEnergy(rarity) {
        const energyLevels = {
            common: 'FAINT AURA',
            uncommon: 'PULSING ENERGY', 
            rare: 'CRACKLING POWER',
            legendary: 'OVERWHELMING FORCE',
            mythical: 'REALITY DISTORTION',
            omnipotent: 'GODLIKE PRESENCE'
        };
        return energyLevels[rarity] || 'FAINT AURA';
    },

    // DEVIL FRUIT RARITY HINTS based on rarity (fruit classification)
    getFruitRarity(rarity) {
        const rarityHints = {
            common: 'STANDARD FRUIT',
            uncommon: 'NOTABLE FRUIT',
            rare: 'POWERFUL FRUIT', 
            legendary: 'LEGENDARY FRUIT',
            mythical: 'MYTHICAL FRUIT',
            omnipotent: 'DIVINE FRUIT'
        };
        return rarityHints[rarity] || 'STANDARD FRUIT';
    },

    // DEVIL FRUIT CLASSIFICATION based on type (One Piece lore)
    getDevilFruitClass(type) {
        const typeClasses = {
            'Paramecia': 'SUPERHUMAN BODY',
            'Zoan': 'ANIMAL TRANSFORMATION', 
            'Logia': 'NATURE\'S FORCE',
            'Ancient Zoan': 'PREHISTORIC BEAST',
            'Mythical Zoan': 'LEGENDARY CREATURE',
            'Special Paramecia': 'UNIQUE AWAKENING'
        };
        return typeClasses[type] || 'UNKNOWN POWER';
    },

    // RAPID CHANGING INDICATORS that gradually lock in (EXACTLY 3 LINES)
    // DEVIL FRUIT THEMED - Shows Energy, Rarity Hint, and Classification
    getChangingIndicators(frame, finalRarity, finalType) {
        const allRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
        const allTypes = ['Paramecia', 'Zoan', 'Logia', 'Ancient Zoan', 'Mythical Zoan'];
        
        // Lock frames: indicators lock in one by one (adjusted for 18-frame animation)
        const lockFrames = {
            energy: frame >= 5,   // Energy locks after 5 frames
            rarity: frame >= 7,   // Rarity hint locks after 7 frames  
            fruit: frame >= 9     // Devil Fruit class locks last
        };
        
        return {
            energy: lockFrames.energy ? 
                this.getFruitEnergy(finalRarity) : 
                this.getFruitEnergy(allRarities[frame % allRarities.length]),
            
            rarity: lockFrames.rarity ? 
                this.getFruitRarity(finalRarity) : 
                this.getFruitRarity(allRarities[(frame + 2) % allRarities.length]),
            
            fruit: lockFrames.fruit ? 
                this.getDevilFruitClass(finalType) : 
                this.getDevilFruitClass(allTypes[frame % allTypes.length])
        };
    }
};

module.exports = { IndicatorsSystem };
