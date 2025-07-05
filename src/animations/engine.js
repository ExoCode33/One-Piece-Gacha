// Animation engine for Devil Fruit gacha system
let debugMode = false;
let forcedRarity = null;

// Devil Fruit database
const devilFruits = {
    'Common': [
        {
            name: 'Chop-Chop Fruit',
            type: 'Paramecia',
            power: 'Allows the user to split their body into pieces',
            description: 'The user can separate their body parts and control them remotely.',
            previousUser: 'Buggy the Clown',
            weakness: 'Still vulnerable to sea water and seastone'
        },
        {
            name: 'Slip-Slip Fruit',
            type: 'Paramecia',
            power: 'Makes the user\'s body slippery',
            description: 'Everything slides off the user\'s smooth skin.',
            previousUser: 'Alvida',
            weakness: 'Standard Devil Fruit weaknesses'
        },
        {
            name: 'Spike-Spike Fruit',
            type: 'Paramecia',
            power: 'Allows the user to grow spikes from their body',
            description: 'The user can produce sharp spikes from any part of their body.',
            previousUser: 'Miss Double Finger',
            weakness: 'Spikes can be broken with enough force'
        },
        {
            name: 'Kilo-Kilo Fruit',
            type: 'Paramecia',
            power: 'Allows the user to change their weight',
            description: 'The user can alter their body weight from 1 to 10,000 kilograms.',
            previousUser: 'Miss Valentine',
            weakness: 'Cannot exceed maximum weight limit'
        },
        {
            name: 'Wax-Wax Fruit',
            type: 'Paramecia',
            power: 'Allows the user to create and manipulate wax',
            description: 'The user can produce wax that hardens to steel-like durability.',
            previousUser: 'Mr. 3',
            weakness: 'Wax melts under intense heat'
        }
    ],
    'Uncommon': [
        {
            name: 'Smoke-Smoke Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control smoke',
            description: 'The user can transform into smoke and create smoke-based attacks.',
            previousUser: 'Smoker',
            weakness: 'Wind can disperse smoke form'
        },
        {
            name: 'Flame-Flame Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control fire',
            description: 'The user can transform into fire and create powerful flame attacks.',
            previousUser: 'Portgas D. Ace',
            weakness: 'Can be extinguished by water or superior fire'
        },
        {
            name: 'Sand-Sand Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control sand',
            description: 'The user can transform into sand and create devastating sandstorms.',
            previousUser: 'Crocodile',
            weakness: 'Water makes sand clump together'
        },
        {
            name: 'Rubber-Rubber Fruit',
            type: 'Paramecia',
            power: 'Makes the user\'s body rubber',
            description: 'The user\'s body becomes elastic and immune to blunt attacks.',
            previousUser: 'Monkey D. Luffy',
            weakness: 'Sharp objects can still cut rubber'
        },
        {
            name: 'Barrier-Barrier Fruit',
            type: 'Paramecia',
            power: 'Allows the user to create invisible barriers',
            description: 'The user can create unbreakable transparent barriers.',
            previousUser: 'Bartolomeo',
            weakness: 'Limited barrier size and duration'
        }
    ],
    'Rare': [
        {
            name: 'Ice-Ice Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control ice',
            description: 'The user can transform into ice and freeze their surroundings.',
            previousUser: 'Aokiji',
            weakness: 'Extreme heat can melt ice form'
        },
        {
            name: 'Magma-Magma Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control magma',
            description: 'The user can transform into magma, superior to fire.',
            previousUser: 'Akainu',
            weakness: 'Can be cooled by extreme cold'
        },
        {
            name: 'Lightning-Lightning Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control lightning',
            description: 'The user can transform into lightning and move at light speed.',
            previousUser: 'Enel',
            weakness: 'Rubber is immune to electricity'
        },
        {
            name: 'Gravity-Gravity Fruit',
            type: 'Paramecia',
            power: 'Allows the user to manipulate gravity',
            description: 'The user can control gravitational forces in their vicinity.',
            previousUser: 'Fujitora',
            weakness: 'Requires concentration to maintain'
        },
        {
            name: 'String-String Fruit',
            type: 'Paramecia',
            power: 'Allows the user to create and control strings',
            description: 'The user can create razor-sharp strings and control people like puppets.',
            previousUser: 'Doflamingo',
            weakness: 'Strings can be cut by sharp objects'
        }
    ],
    'Epic': [
        {
            name: 'Light-Light Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control light',
            description: 'The user can transform into light and travel at light speed.',
            previousUser: 'Kizaru',
            weakness: 'Mirrors can reflect light attacks'
        },
        {
            name: 'Tremor-Tremor Fruit',
            type: 'Paramecia',
            power: 'Allows the user to create earthquakes',
            description: 'The user can generate devastating tremors and quakes.',
            previousUser: 'Whitebeard',
            weakness: 'Can harm allies if not controlled'
        },
        {
            name: 'Soul-Soul Fruit',
            type: 'Paramecia',
            power: 'Allows the user to manipulate souls',
            description: 'The user can extract and manipulate the souls of others.',
            previousUser: 'Big Mom',
            weakness: 'Requires fear to extract souls'
        },
        {
            name: 'Paw-Paw Fruit',
            type: 'Paramecia',
            power: 'Allows the user to repel anything',
            description: 'The user can repel pain, attacks, and even air itself.',
            previousUser: 'Bartholomew Kuma',
            weakness: 'Requires direct contact with paws'
        },
        {
            name: 'Darkness-Darkness Fruit',
            type: 'Logia',
            power: 'Allows the user to create and control darkness',
            description: 'The user can absorb attacks and nullify other Devil Fruit powers.',
            previousUser: 'Marshall D. Teach',
            weakness: 'User takes double damage from attacks'
        }
    ],
    'Legendary': [
        {
            name: 'Phoenix-Phoenix Fruit',
            type: 'Mythical Zoan',
            power: 'Allows the user to transform into a phoenix',
            description: 'The user can transform into a phoenix with regenerative flames.',
            previousUser: 'Marco',
            weakness: 'Regeneration has limits',
            awakening: 'Can share regenerative flames with others'
        },
        {
            name: 'Dragon-Dragon Fruit (Ancient)',
            type: 'Ancient Zoan',
            power: 'Allows the user to transform into a dragon',
            description: 'The user can transform into a massive ancient dragon.',
            previousUser: 'Kaido',
            weakness: 'Large size makes user a bigger target',
            awakening: 'Can control weather and create flame clouds'
        },
        {
            name: 'Time-Time Fruit',
            type: 'Paramecia',
            power: 'Allows the user to manipulate time',
            description: 'The user can slow down or speed up time in small areas.',
            previousUser: 'Unknown',
            weakness: 'Extreme mental exhaustion from overuse'
        },
        {
            name: 'Space-Space Fruit',
            type: 'Paramecia',
            power: 'Allows the user to manipulate space',
            description: 'The user can create portals and bend space itself.',
            previousUser: 'Unknown',
            weakness: 'Requires precise calculations'
        }
    ],
    'Mythical': [
        {
            name: 'Gum-Gum Fruit (Awakened)',
            type: 'Mythical Zoan',
            power: 'True power of the Sun God Nika',
            description: 'The legendary fruit that brings joy and freedom to all.',
            previousUser: 'Joy Boy',
            weakness: 'Massive energy consumption',
            awakening: 'Can turn imagination into reality and affect the environment'
        },
        {
            name: 'Void-Void Fruit',
            type: 'Logia',
            power: 'Allows the user to control the void',
            description: 'The user can erase anything from existence temporarily.',
            previousUser: 'Unknown',
            weakness: 'Using the power erases part of the user\'s memories',
            awakening: 'Can create permanent voids in reality'
        },
        {
            name: 'Creation-Creation Fruit',
            type: 'Paramecia',
            power: 'Allows the user to create anything',
            description: 'The user can create matter from nothing using their life force.',
            previousUser: 'Unknown',
            weakness: 'Creating complex things shortens lifespan',
            awakening: 'Can create living beings'
        }
    ]
};

// Rarity chances
const rarityChances = {
    'Common': 40,      // 40%
    'Uncommon': 30,    // 30%
    'Rare': 20,        // 20%
    'Epic': 8,         // 8%
    'Legendary': 1.8,  // 1.8%
    'Mythical': 0.2    // 0.2%
};

// Animation sequences
const animationSequences = [
    {
        title: '🌊 Sailing the Grand Line...',
        description: 'Your ship cuts through the mysterious waters of the Grand Line...',
        color: '#3498DB',
        footer: 'The adventure begins...'
    },
    {
        title: '🏝️ Mysterious Island Discovered!',
        description: 'You spot a strange island shrouded in mist. Something powerful awaits...',
        color: '#27AE60',
        footer: 'What secrets does this island hold?'
    },
    {
        title: '🍎 Devil Fruit Found!',
        description: 'In the depths of the island, you discover a Devil Fruit pulsing with mysterious energy!',
        color: '#E74C3C',
        footer: 'The fruit\'s power is awakening...'
    }
];

/**
 * Set debug mode on/off
 * @param {boolean} enabled - Whether to enable debug mode
 */
function setDebugMode(enabled) {
    debugMode = enabled;
    console.log(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Check if debug mode is enabled
 * @returns {boolean} - Current debug mode status
 */
function isDebugMode() {
    return debugMode;
}

/**
 * Force a specific rarity for testing
 * @param {string|null} rarity - Rarity to force, or null to disable
 */
function forceRarity(rarity) {
    forcedRarity = rarity;
    console.log(`🎯 Force rarity ${rarity ? 'set to ' + rarity : 'disabled'}`);
}

/**
 * Get the current forced rarity
 * @returns {string|null} - Current forced rarity
 */
function getForcedRarity() {
    return forcedRarity;
}

/**
 * Select a random rarity based on chances
 * @returns {string} - Selected rarity
 */
function selectRarity() {
    // If rarity is forced, return it
    if (forcedRarity) {
        return forcedRarity;
    }
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, chance] of Object.entries(rarityChances)) {
        cumulative += chance;
        if (random <= cumulative) {
            return rarity;
        }
    }
    
    return 'Common'; // Fallback
}

/**
 * Select a random fruit from a rarity tier
 * @param {string} rarity - Rarity tier
 * @returns {Object} - Selected fruit
 */
function selectFruit(rarity) {
    const fruits = devilFruits[rarity];
    if (!fruits || fruits.length === 0) {
        return devilFruits['Common'][0]; // Fallback
    }
    
    const randomIndex = Math.floor(Math.random() * fruits.length);
    return { ...fruits[randomIndex], rarity };
}

/**
 * Perform a pull and return the result
 * @returns {Object} - Pull result
 */
function performPull() {
    const rarity = selectRarity();
    const fruit = selectFruit(rarity);
    
    if (debugMode) {
        console.log(`🎲 Pull result: ${fruit.name} (${rarity})`);
    }
    
    return fruit;
}

/**
 * Get the animation sequence for pulls
 * @returns {Array} - Array of animation frames
 */
function getAnimationSequence() {
    return animationSequences;
}

/**
 * Get all available rarities
 * @returns {Array} - Array of rarity names
 */
function getRarities() {
    return Object.keys(rarityChances);
}

/**
 * Get all fruits of a specific rarity
 * @param {string} rarity - Rarity to get fruits for
 * @returns {Array} - Array of fruits
 */
function getFruitsByRarity(rarity) {
    return devilFruits[rarity] || [];
}

/**
 * Get all fruits in the database
 * @returns {Object} - All fruits organized by rarity
 */
function getAllFruits() {
    return devilFruits;
}

/**
 * Get rarity chances for display
 * @returns {Object} - Rarity chances
 */
function getRarityChances() {
    return rarityChances;
}

/**
 * Calculate rarity color for embeds
 * @param {string} rarity - Rarity name
 * @returns {string} - Hex color code
 */
function getRarityColor(rarity) {
    const colors = {
        'Common': '#95A5A6',
        'Uncommon': '#3498DB',
        'Rare': '#9B59B6',
        'Epic': '#E74C3C',
        'Legendary': '#F39C12',
        'Mythical': '#E91E63'
    };
    return colors[rarity] || '#95A5A6';
}

/**
 * Get rarity emoji
 * @param {string} rarity - Rarity name
 * @returns {string} - Emoji
 */
function getRarityEmoji(rarity) {
    const emojis = {
        'Common': '⚪',
        'Uncommon': '🔵',
        'Rare': '🟣',
        'Epic': '🔴',
        'Legendary': '🟡',
        'Mythical': '🌟'
    };
    return emojis[rarity] || '❓';
}

module.exports = {
    setDebugMode,
    isDebugMode,
    forceRarity,
    getForcedRarity,
    performPull,
    getAnimationSequence,
    getRarities,
    getFruitsByRarity,
    getAllFruits,
    getRarityChances,
    getRarityColor,
    getRarityEmoji,
    selectRarity,
    selectFruit
};
