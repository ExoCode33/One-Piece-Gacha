// ═══════════════════════════════════════════════════════════════════
//                 ONE PIECE THEMED INDICATORS SYSTEM
// ═══════════════════════════════════════════════════════════════════

const IndicatorsSystem = {
    // HAKI INTENSITY based on rarity (One Piece power levels)
    getHakiLevel(rarity) {
        const hakiLevels = {
            common: 'WEAK HAKI',
            uncommon: 'ARMAMENT HAKI', 
            rare: 'OBSERVATION HAKI',
            legendary: 'CONQUEROR\'S HAKI',
            mythical: 'ADVANCED CONQUEROR\'S',
            omnipotent: 'VOICE OF ALL THINGS'
        };
        return hakiLevels[rarity] || 'WEAK HAKI';
    },

    // BOUNTY LEVEL based on rarity (One Piece bounty system)
    getBountyLevel(rarity) {
        const bountyLevels = {
            common: '1,000 BERRIES',
            uncommon: '50,000 BERRIES',
            rare: '10 MILLION BERRIES', 
            legendary: '100 MILLION BERRIES',
            mythical: '1 BILLION BERRIES',
            omnipotent: '5 BILLION BERRIES'
        };
        return bountyLevels[rarity] || '1,000 BERRIES';
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
    // ONE PIECE THEMED - Shows Haki, Bounty, and Devil Fruit Class
    getChangingIndicators(frame, finalRarity, finalType) {
        const allRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
        const allTypes = ['Paramecia', 'Zoan', 'Logia', 'Ancient Zoan', 'Mythical Zoan'];
        
        // Lock frames: indicators lock in one by one (adjusted for 18-frame animation)
        const lockFrames = {
            haki: frame >= 5,     // Haki locks after 5 frames
            bounty: frame >= 7,   // Bounty locks after 7 frames  
            fruit: frame >= 9     // Devil Fruit class locks last
        };
        
        return {
            haki: lockFrames.haki ? 
                this.getHakiLevel(finalRarity) : 
                this.getHakiLevel(allRarities[frame % allRarities.length]),
            
            bounty: lockFrames.bounty ? 
                this.getBountyLevel(finalRarity) : 
                this.getBountyLevel(allRarities[(frame + 2) % allRarities.length]),
            
            fruit: lockFrames.fruit ? 
                this.getDevilFruitClass(finalType) : 
                this.getDevilFruitClass(allTypes[frame % allTypes.length])
        };
    }
};

module.exports = { IndicatorsSystem };
