// MAIN DEVIL FRUIT DATABASE
// Combines both parts for complete 150 fruit collection

const { DEVIL_FRUITS_PART1 } = require('./devilfruit-part1');
const { DEVIL_FRUITS_PART2 } = require('./devilfruit-part2');

// Combine both parts into one complete database
const DEVIL_FRUITS = {
    ...DEVIL_FRUITS_PART1,
    ...DEVIL_FRUITS_PART2
};

// Rarity distribution and pull rates
const RARITY_CONFIG = {
    common: { 
        rate: 0.35, // 35%
        color: '#95a5a6',
        emoji: '⚪'
    },
    uncommon: { 
        rate: 0.25, // 25%
        color: '#2ecc71',
        emoji: '🟢'
    },
    rare: { 
        rate: 0.20, // 20%
        color: '#3498db',
        emoji: '🔵'
    },
    epic: { 
        rate: 0.12, // 12%
        color: '#9b59b6',
        emoji: '🟣'
    },
    legendary: { 
        rate: 0.06, // 6%
        color: '#f39c12',
        emoji: '🟡'
    },
    mythical: { 
        rate: 0.018, // 1.8%
        color: '#e74c3c',
        emoji: '🔴'
    },
    omnipotent: { 
        rate: 0.002, // 0.2%
        color: '#ffffff',
        emoji: '⭐'
    }
};

// Utility functions
function getAllFruits() {
    return Object.values(DEVIL_FRUITS);
}

function getFruitById(id) {
    return DEVIL_FRUITS[id];
}

function getFruitsByRarity(rarity) {
    return Object.values(DEVIL_FRUITS).filter(fruit => fruit.rarity === rarity);
}

function getFruitsByType(type) {
    return Object.values(DEVIL_FRUITS).filter(fruit => fruit.type === type);
}

function getRandomFruit() {
    const fruits = Object.values(DEVIL_FRUITS);
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function searchFruits(query) {
    const lowercaseQuery = query.toLowerCase();
    return Object.values(DEVIL_FRUITS).filter(fruit => 
        fruit.name.toLowerCase().includes(lowercaseQuery) ||
        fruit.power.toLowerCase().includes(lowercaseQuery) ||
        (fruit.previousUser && fruit.previousUser.toLowerCase().includes(lowercaseQuery))
    );
}

// Gacha pull logic
function performGachaPull() {
    const random = Math.random();
    let cumulativeRate = 0;
    
    // Check rarities from lowest rate to highest
    for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
        cumulativeRate += config.rate;
        if (random <= cumulativeRate) {
            const fruitsOfRarity = getFruitsByRarity(rarity);
            const randomFruit = fruitsOfRarity[Math.floor(Math.random() * fruitsOfRarity.length)];
            return randomFruit;
        }
    }
    
    // Fallback to common if something goes wrong
    const commonFruits = getFruitsByRarity('common');
    return commonFruits[Math.floor(Math.random() * commonFruits.length)];
}

// Statistics
function getDatabaseStats() {
    const stats = {
        total: Object.keys(DEVIL_FRUITS).length,
        byRarity: {},
        byType: {},
        averageCombatPower: 0
    };
    
    const fruits = Object.values(DEVIL_FRUITS);
    let totalCP = 0;
    
    fruits.forEach(fruit => {
        // Count by rarity
        stats.byRarity[fruit.rarity] = (stats.byRarity[fruit.rarity] || 0) + 1;
        
        // Count by type
        stats.byType[fruit.type] = (stats.byType[fruit.type] || 0) + 1;
        
        // Calculate average combat power
        totalCP += fruit.combatPower;
    });
    
    stats.averageCombatPower = Math.round(totalCP / fruits.length);
    
    return stats;
}

// Validation
function validateDatabase() {
    const issues = [];
    
    // Check if we have exactly 150 fruits
    if (Object.keys(DEVIL_FRUITS).length !== 150) {
        issues.push(`Expected 150 fruits, found ${Object.keys(DEVIL_FRUITS).length}`);
    }
    
    // Check for duplicate IDs
    const ids = Object.keys(DEVIL_FRUITS);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
        issues.push('Duplicate fruit IDs found');
    }
    
    // Check for missing required fields
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        if (!fruit.id || !fruit.name || !fruit.type || !fruit.rarity || !fruit.power || !fruit.combatPower) {
            issues.push(`Fruit ${fruit.id || 'unknown'} is missing required fields`);
        }
    });
    
    return issues;
}

module.exports = {
    DEVIL_FRUITS,
    RARITY_CONFIG,
    getAllFruits,
    getFruitById,
    getFruitsByRarity,
    getFruitsByType,
    getRandomFruit,
    searchFruits,
    performGachaPull,
    getDatabaseStats,
    validateDatabase
};
