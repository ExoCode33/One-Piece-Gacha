// Example data for testing - replace with your actual gacha system later

const rarities = {
    common: { 
        name: 'Common', 
        color: '#808080', 
        emoji: '⚪', 
        stars: '⭐',
        chance: 45 
    },
    uncommon: { 
        name: 'Uncommon', 
        color: '#00FF00', 
        emoji: '🟢', 
        stars: '⭐⭐',
        chance: 30 
    },
    rare: { 
        name: 'Rare', 
        color: '#0099FF', 
        emoji: '🔵', 
        stars: '⭐⭐⭐',
        chance: 18 
    },
    legendary: { 
        name: 'Legendary', 
        color: '#FFD700', 
        emoji: '🟡', 
        stars: '⭐⭐⭐⭐',
        chance: 5 
    },
    mythical: { 
        name: 'Mythical', 
        color: '#FF1493', 
        emoji: '🔮', 
        stars: '⭐⭐⭐⭐⭐',
        chance: 1.8 
    },
    omnipotent: { 
        name: 'Omnipotent', 
        color: '#9400D3', 
        emoji: '🌌', 
        stars: '⭐⭐⭐⭐⭐⭐',
        chance: 0.2 
    }
};

const characters = {
    common: [
        { name: 'Usopp', crew: 'Straw Hat Pirates', bounty: '200,000,000' },
        { name: 'Chopper', crew: 'Straw Hat Pirates', bounty: '1,000' }
    ],
    uncommon: [
        { name: 'Nami', crew: 'Straw Hat Pirates', bounty: '366,000,000' },
        { name: 'Brook', crew: 'Straw Hat Pirates', bounty: '383,000,000' }
    ],
    rare: [
        { name: 'Sanji', crew: 'Straw Hat Pirates', bounty: '1,032,000,000' },
        { name: 'Robin', crew: 'Straw Hat Pirates', bounty: '930,000,000' }
    ],
    legendary: [
        { name: 'Zoro', crew: 'Straw Hat Pirates', bounty: '1,111,000,000' },
        { name: 'Luffy', crew: 'Straw Hat Pirates', bounty: '3,000,000,000' }
    ],
    mythical: [
        { name: 'Whitebeard', crew: 'Whitebeard Pirates', bounty: '5,046,000,000' },
        { name: 'Kaido', crew: 'Beast Pirates', bounty: '4,611,100,000' }
    ],
    omnipotent: [
        { name: 'Gol D. Roger', crew: 'Roger Pirates', bounty: '5,564,800,000' },
        { name: 'Joy Boy', crew: 'Ancient Kingdom', bounty: 'Unknown' }
    ]
};

// Utility functions
function getRarity() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, config] of Object.entries(rarities)) {
        cumulative += config.chance;
        if (roll <= cumulative) {
            return rarity;
        }
    }
    return 'common';
}

function getRandomCharacter(rarity) {
    const pool = characters[rarity] || characters.common;
    return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = {
    rarities,
    characters,
    getRarity,
    getRandomCharacter
};
