// DEVIL FRUIT COMPATIBILITY BRIDGE
// This file provides backward compatibility for existing animation system

const { performGachaPull, DEVIL_FRUITS, getFruitById, RARITY_CONFIG } = require('./devilfruit');

// Legacy function name for compatibility
function generateRandomDevilFruit() {
    return performGachaPull();
}

// Export all the functions your animation system might need
module.exports = {
    // Main database
    DEVIL_FRUITS,
    RARITY_CONFIG,
    
    // Legacy compatibility functions
    generateRandomDevilFruit,
    
    // New functions
    performGachaPull,
    getFruitById,
    
    // Additional utility functions that might be needed
    getAllFruits: () => Object.values(DEVIL_FRUITS),
    getFruitsByRarity: (rarity) => Object.values(DEVIL_FRUITS).filter(fruit => fruit.rarity === rarity),
    
    // Rarity information for animations
    getRarityConfig: () => RARITY_CONFIG,
    
    // Combat power ranges for rarity tiers
    getCombatPowerRanges: () => ({
        common: { min: 138, max: 355 },
        uncommon: { min: 375, max: 495 },
        rare: { min: 600, max: 900 },
        epic: { min: 950, max: 1190 },
        legendary: { min: 1220, max: 1480 },
        mythical: { min: 1490, max: 1550 },
        omnipotent: { min: 1580, max: 1620 }
    }),
    
    // Rarity colors for animations
    getRarityColors: () => ({
        common: { 
            hex: '#95a5a6',
            embed: 0x95a5a6,
            emoji: '⚪'
        },
        uncommon: { 
            hex: '#2ecc71',
            embed: 0x2ecc71,
            emoji: '🟢'
        },
        rare: { 
            hex: '#3498db',
            embed: 0x3498db,
            emoji: '🔵'
        },
        epic: { 
            hex: '#9b59b6',
            embed: 0x9b59b6,
            emoji: '🟣'
        },
        legendary: { 
            hex: '#f39c12',
            embed: 0xf39c12,
            emoji: '🟡'
        },
        mythical: { 
            hex: '#e74c3c',
            embed: 0xe74c3c,
            emoji: '🔴'
        },
        omnipotent: { 
            hex: '#ffffff',
            embed: 0xffffff,
            emoji: '⭐'
        }
    }),
    
    // Animation-friendly fruit data formatter
    formatFruitForAnimation: (fruit) => ({
        id: fruit.id,
        name: fruit.name,
        type: fruit.type,
        rarity: fruit.rarity,
        power: fruit.power,
        previousUser: fruit.previousUser || 'Unknown',
        description: fruit.description || fruit.power,
        combatPower: fruit.combatPower,
        source: fruit.source || 'canon',
        
        // Additional fields for animations
        emoji: RARITY_CONFIG[fruit.rarity]?.emoji || '❓',
        color: RARITY_CONFIG[fruit.rarity]?.color || '#95a5a6',
        embedColor: RARITY_CONFIG[fruit.rarity]?.color?.replace('#', '0x') || 0x95a5a6
    })
};
