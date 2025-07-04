const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('./counter-system');

// Devil Fruit database with detailed information
const DEVIL_FRUITS = {
    // LOGIA FRUITS (Most Powerful)
    'magu_magu_001': {
        id: 'magu_magu_001',
        name: 'Magu Magu no Mi',
        type: 'Logia',
        rarity: 'mythical',
        power: 'Absolute control over magma and volcanic forces',
        previousUser: 'Admiral Akainu',
        description: 'The ultimate offensive Logia fruit. Grants the user the ability to create, control, and become magma. The magma is so hot it can even burn fire itself, making it superior to most other Logia fruits.',
        awakening: 'Can permanently alter the landscape into volcanic terrain and create massive magma constructs.',
        weakness: 'Standard Devil Fruit weaknesses: sea water and Haki. Extremely vulnerable to cooling attacks.'
    },
    'pika_pika_001': {
        id: 'pika_pika_001',
        name: 'Pika Pika no Mi',
        type: 'Logia',
        rarity: 'mythical',
        power: 'Light manipulation and light-speed movement',
        previousUser: 'Admiral Kizaru',
        description: 'Grants the user the power to create, control, and become light. Allows for light-speed attacks and movement, making the user nearly untouchable.',
        awakening: 'Can bend light to create illusions and manipulate gravity through photons.',
        weakness: 'Reflective surfaces can redirect attacks. Sea water and Haki.'
    },
    'hie_hie_001': {
        id: 'hie_hie_001',
        name: 'Hie Hie no Mi',
        type: 'Logia',
        rarity: 'legendary',
        power: 'Ice creation and manipulation',
        previousUser: 'Former Admiral Aokiji',
        description: 'Allows the user to create, control, and become ice. Can freeze large bodies of water and create massive ice structures.',
        awakening: 'Can permanently change the climate of entire islands to frozen wastelands.',
        weakness: 'Fire and heat-based attacks. Sea water and Haki.'
    },
    'mera_mera_001': {
        id: 'mera_mera_001',
        name: 'Mera Mera no Mi',
        type: 'Logia',
        rarity: 'legendary',
        power: 'Fire creation and manipulation',
        previousUser: 'Portgas D. Ace',
        description: 'Grants the user the ability to create, control, and become fire. One of the most destructive Logia fruits with incredible offensive capabilities.',
        awakening: 'Can create self-sustaining fires and manipulate the temperature of the environment.',
        weakness: 'Magma-based attacks, water, and sea water. Haki can also bypass the fire body.'
    },
    'goro_goro_001': {
        id: 'goro_goro_001',
        name: 'Goro Goro no Mi',
        type: 'Logia',
        rarity: 'legendary',
        power: 'Lightning generation and control',
        previousUser: 'Eneru (Enel)',
        description: 'Allows the user to create, control, and become lightning. Grants incredible speed and destructive electrical attacks.',
        awakening: 'Can manipulate electromagnetic fields and control electronic devices.',
        weakness: 'Rubber completely nullifies electrical attacks. Sea water and Haki.'
    },
    'suna_suna_001': {
        id: 'suna_suna_001',
        name: 'Suna Suna no Mi',
        type: 'Logia',
        rarity: 'epic',
        power: 'Sand manipulation and desiccation',
        previousUser: 'Sir Crocodile',
        description: 'Grants the ability to create, control, and become sand. Can absorb moisture from anything touched.',
        awakening: 'Can turn entire landscapes into desert and control sandstorms on a massive scale.',
        weakness: 'Water negates sand powers temporarily. Sea water and Haki.'
    },
    'yami_yami_001': {
        id: 'yami_yami_001',
        name: 'Yami Yami no Mi',
        type: 'Logia',
        rarity: 'omnipotent',
        power: 'Darkness manipulation and Devil Fruit nullification',
        previousUser: 'Marshall D. Teach (Blackbeard)',
        description: 'The most dangerous Logia fruit. Grants control over darkness and gravity, and can nullify other Devil Fruit powers upon contact.',
        awakening: 'Can create black holes and completely absorb light and matter.',
        weakness: 'User takes increased damage from physical attacks. Cannot become intangible like other Logias.'
    },

    // MYTHICAL ZOAN FRUITS
    'hito_hito_001': {
        id: 'hito_hito_001',
        name: 'Hito Hito no Mi, Model: Nika',
        type: 'Mythical Zoan',
        rarity: 'omnipotent',
        power: 'Rubber body with reality-bending properties',
        previousUser: 'Monkey D. Luffy',
        description: 'The legendary Sun God Nika fruit. Grants a rubber body with the most ridiculous power in the world - the ability to fight with complete freedom and bring joy to others.',
        awakening: 'Can turn the environment into rubber and grant rubber properties to other objects and people.',
        weakness: 'Sharp objects can still cut through rubber. Sea water and Haki.'
    },
    'uo_uo_001': {
        id: 'uo_uo_001',
        name: 'Uo Uo no Mi, Model: Seiryu',
        type: 'Mythical Zoan',
        rarity: 'omnipotent',
        power: 'Azure Dragon transformation',
        previousUser: 'Kaido of the Hundred Beasts',
        description: 'Transforms the user into a massive Azure Dragon. Grants incredible physical strength, the ability to fly, and control over wind and lightning.',
        awakening: 'Can manipulate weather patterns and create devastating natural disasters.',
        weakness: 'Large size makes user an easier target. Sea water and Haki.'
    },
    'tori_tori_002': {
        id: 'tori_tori_002',
        name: 'Tori Tori no Mi, Model: Phoenix',
        type: 'Mythical Zoan',
        rarity: 'mythical',
        power: 'Phoenix transformation with regeneration',
        previousUser: 'Marco the Phoenix',
        description: 'Allows transformation into a phoenix. Grants flight and the ability to heal from any injury with blue flames.',
        awakening: 'Can resurrect from death once per year and heal others with phoenix flames.',
        weakness: 'Regeneration has limits against overwhelming damage. Sea water and Haki.'
    },

    // SPECIAL PARAMECIA FRUITS
    'gura_gura_001': {
        id: 'gura_gura_001',
        name: 'Gura Gura no Mi',
        type: 'Paramecia',
        rarity: 'omnipotent',
        power: 'Earthquake generation',
        previousUser: 'Edward Newgate (Whitebeard)',
        description: 'The strongest Paramecia fruit. Grants the power to create earthquakes and destroy the world itself.',
        awakening: 'Can create permanent tectonic changes and control seismic activity globally.',
        weakness: 'Vibrations can be countered by opposing frequencies. Sea water and Haki.'
    },
    'ope_ope_001': {
        id: 'ope_ope_001',
        name: 'Ope Ope no Mi',
        type: 'Paramecia',
        rarity: 'mythical',
        power: 'Operating room creation and spatial manipulation',
        previousUser: 'Trafalgar D. Water Law',
        description: 'Creates a spherical operating room where the user can manipulate anything within. Can perform impossible surgical procedures.',
        awakening: 'Can extend the Room to cover entire islands and grant eternal life to others.',
        weakness: 'Requires stamina to maintain large Rooms. Sea water and Haki.'
    },

    // Add more common/uncommon fruits for better distribution
    'gomu_gomu_001': {
        id: 'gomu_gomu_001',
        name: 'Gomu Gomu no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Rubber body properties',
        previousUser: 'Unknown Pirate',
        description: 'Grants the user a rubber body, providing immunity to blunt attacks and electrical attacks.',
        awakening: 'Can turn the environment into rubber and affect other people with rubber properties.',
        weakness: 'Sharp objects can cut through rubber. Fire can burn rubber. Sea water and Haki.'
    },
    'sube_sube_001': {
        id: 'sube_sube_001',
        name: 'Sube Sube no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Smooth skin and attack deflection',
        previousUser: 'Alvida',
        description: 'Makes the user\'s skin perfectly smooth, causing attacks to slip off harmlessly.',
        awakening: 'Can make other objects and people smooth, and control friction.',
        weakness: 'Targeted attacks can still hit. Sea water and Haki affect the smoothness.'
    },
    'kilo_kilo_001': {
        id: 'kilo_kilo_001',
        name: 'Kilo Kilo no Mi',
        type: 'Paramecia',
        rarity: 'common',
        power: 'Weight manipulation',
        previousUser: 'Miss Valentine',
        description: 'Allows the user to change their body weight from 1 kilogram to 10,000 kilograms.',
        awakening: 'Can affect the weight of other objects and people.',
        weakness: 'Cannot become lighter than 1kg or heavier than 10,000kg. Sea water and Haki.'
    },
    'bomu_bomu_001': {
        id: 'bomu_bomu_001',
        name: 'Bomu Bomu no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Explosion generation',
        previousUser: 'Mr. 5',
        description: 'Allows the user to make any part of their body explode, including breath and bodily waste.',
        awakening: 'Can create delayed explosions and make other objects explosive.',
        weakness: 'User is not immune to other explosions. Sea water and Haki.'
    },
    'hana_hana_001': {
        id: 'hana_hana_001',
        name: 'Hana Hana no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Body part replication',
        previousUser: 'Nico Robin',
        description: 'Allows the user to sprout copies of their body parts from any surface.',
        awakening: 'Can create full-body clones and sprout body parts of other people.',
        weakness: 'Damage to sprouted parts affects the real body. Sea water and Haki.'
    },

    // ZOAN FRUITS
    'hito_hito_002': {
        id: 'hito_hito_002',
        name: 'Hito Hito no Mi',
        type: 'Zoan',
        rarity: 'uncommon',
        power: 'Human transformation and intelligence',
        previousUser: 'Tony Tony Chopper',
        description: 'Grants human-like intelligence and the ability to walk upright. For animals, provides human transformation.',
        awakening: 'Enhanced learning ability and can understand all languages.',
        weakness: 'Minimal combat enhancement for humans. Sea water and Haki.'
    },
    'inu_inu_001': {
        id: 'inu_inu_001',
        name: 'Inu Inu no Mi, Model: Wolf',
        type: 'Zoan',
        rarity: 'rare',
        power: 'Wolf transformation',
        previousUser: 'Jabra',
        description: 'Allows transformation into a wolf. Grants enhanced speed, agility, and pack hunting instincts.',
        awakening: 'Can communicate with and command other canines.',
        weakness: 'Vulnerable to loud noises. Sea water and Haki.'
    },
    'neko_neko_001': {
        id: 'neko_neko_001',
        name: 'Neko Neko no Mi, Model: Leopard',
        type: 'Zoan',
        rarity: 'rare',
        power: 'Leopard transformation',
        previousUser: 'Rob Lucci',
        description: 'Transforms the user into a leopard. Provides incredible speed, agility, and predatory instincts.',
        awakening: 'Enhanced night vision and the ability to move completely silently.',
        weakness: 'Overconfidence in predatory instincts. Sea water and Haki.'
    }
};

// Rarity probabilities (must add up to 100)
const RARITY_RATES = {
    'common': 35,      // 35%
    'uncommon': 25,    // 25%
    'rare': 20,        // 20%
    'epic': 12,        // 12%
    'legendary': 6,    // 6%
    'mythical': 1.8,   // 1.8%
    'omnipotent': 0.2  // 0.2%
};

// Get fruits by rarity
function getFruitsByRarity(rarity) {
    return Object.values(DEVIL_FRUITS).filter(fruit => fruit.rarity === rarity);
}

// Calculate rarity based on probabilities or use debug override
function calculateDropRarity() {
    // Check if debug mode is forcing a rarity
    try {
        const { getTestRarity } = require('../animations/engine');
        return getTestRarity();
    } catch (error) {
        // Fall back to normal calculation if engine not available
        const roll = Math.random() * 100;
        let cumulativeRate = 0;
        let selectedRarity = 'common';
        
        for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
            cumulativeRate += rate;
            if (roll <= cumulativeRate) {
                selectedRarity = rarity;
                break;
            }
        }
        
        return selectedRarity;
    }
}

// Generate a random Devil Fruit based on rarity rates
function generateRandomDevilFruit() {
    // Determine rarity (this will check debug mode)
    const selectedRarity = calculateDropRarity();
    
    // Get all fruits of the selected rarity
    const availableFruits = getFruitsByRarity(selectedRarity);
    
    if (availableFruits.length === 0) {
        // Fallback to common if no fruits found
        const commonFruits = getFruitsByRarity('common');
        const randomIndex = Math.floor(Math.random() * commonFruits.length);
        return { ...commonFruits[randomIndex] };
    }
    
    // Select random fruit from the rarity tier
    const randomIndex = Math.floor(Math.random() * availableFruits.length);
    const selectedFruit = availableFruits[randomIndex];
    
    // Return a copy to avoid modifying the original
    return { ...selectedFruit };
}

// Get fruit by ID
function getDevilFruitById(id) {
    return DEVIL_FRUITS[id] ? { ...DEVIL_FRUITS[id] } : null;
}

// Get all fruits of a specific type
function getFruitsByType(type) {
    return Object.values(DEVIL_FRUITS).filter(fruit => fruit.type === type);
}

// Get rarity information
function getRarityInfo() {
    return { ...RARITY_RATES };
}

// Get total number of fruits
function getTotalFruits() {
    return Object.keys(DEVIL_FRUITS).length;
}

// Get fruits by element (using counter system)
function getFruitsByElement(element) {
    return Object.values(DEVIL_FRUITS).filter(fruit => {
        const fruitElement = DEVIL_FRUIT_ELEMENTS[fruit.id];
        return fruitElement === element;
    });
}

// Statistics
function getTypeDistribution() {
    const distribution = {};
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        distribution[fruit.type] = (distribution[fruit.type] || 0) + 1;
    });
    return distribution;
}

function getRarityDistribution() {
    const distribution = {};
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        distribution[fruit.rarity] = (distribution[fruit.rarity] || 0) + 1;
    });
    return distribution;
}

// Search functions
function searchFruitsByName(query) {
    const lowercaseQuery = query.toLowerCase();
    return Object.values(DEVIL_FRUITS).filter(fruit =>
        fruit.name.toLowerCase().includes(lowercaseQuery)
    );
}

function searchFruitsByUser(query) {
    const lowercaseQuery = query.toLowerCase();
    return Object.values(DEVIL_FRUITS).filter(fruit =>
        fruit.previousUser.toLowerCase().includes(lowercaseQuery)
    );
}

// Utility functions
function isValidRarity(rarity) {
    return Object.keys(RARITY_RATES).includes(rarity);
}

function getAllTypes() {
    const types = new Set();
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        types.add(fruit.type);
    });
    return Array.from(types);
}

function getAllRarities() {
    return Object.keys(RARITY_RATES);
}

// Export all functions and data
module.exports = {
    // Main data
    DEVIL_FRUITS,
    RARITY_RATES,
    
    // Core functions
    generateRandomDevilFruit,
    calculateDropRarity,
    getDevilFruitById,
    getFruitsByRarity,
    getFruitsByType,
    getFruitsByElement,
    
    // Search functions
    searchFruitsByName,
    searchFruitsByUser,
    
    // Statistics
    getRarityInfo,
    getTotalFruits,
    getTypeDistribution,
    getRarityDistribution,
    
    // Utility functions
    isValidRarity,
    getAllTypes,
    getAllRarities
};
