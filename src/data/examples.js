// Enhanced One Piece Gacha System with Professional Data Structure

const rarities = {
    common: { 
        name: 'Common',
        color: '#95A5A6',
        emoji: '⚪',
        stars: '⭐',
        chance: 40.0,
        description: 'Reliable crew members who form the backbone of any pirate crew'
    },
    uncommon: { 
        name: 'Uncommon',
        color: '#2ECC71',
        emoji: '🟢',
        stars: '⭐⭐',
        chance: 35.0,
        description: 'Skilled pirates with notable abilities and potential'
    },
    rare: { 
        name: 'Rare',
        color: '#3498DB',
        emoji: '🔵',
        stars: '⭐⭐⭐',
        chance: 18.0,
        description: 'Exceptional warriors with remarkable powers'
    },
    legendary: { 
        name: 'Legendary',
        color: '#F39C12',
        emoji: '🟡',
        stars: '⭐⭐⭐⭐',
        chance: 5.5,
        description: 'Heroes and villains whose names echo through history'
    },
    mythical: { 
        name: 'Mythical',
        color: '#E74C3C',
        emoji: '🔴',
        stars: '⭐⭐⭐⭐⭐',
        chance: 1.3,
        description: 'Legendary figures whose power shapes the world itself'
    },
    omnipotent: { 
        name: 'Omnipotent',
        color: '#9B59B6',
        emoji: '🌌',
        stars: '⭐⭐⭐⭐⭐⭐',
        chance: 0.2,
        description: 'Transcendent beings whose influence spans across eras'
    }
};

const characters = {
    common: [
        { 
            name: 'Tony Tony Chopper', 
            crew: 'Straw Hat Pirates', 
            bounty: '1,000',
            title: 'Cotton Candy Lover',
            ability: 'Human-Human Fruit',
            description: 'The adorable doctor of the Straw Hat crew with incredible medical skills'
        },
        { 
            name: 'Usopp', 
            crew: 'Straw Hat Pirates', 
            bounty: '500,000,000',
            title: 'God Usopp',
            ability: 'Sniper King',
            description: 'The brave sniper whose lies have a way of becoming truth'
        },
        { 
            name: 'Nami', 
            crew: 'Straw Hat Pirates', 
            bounty: '366,000,000',
            title: 'Cat Burglar',
            ability: 'Weather Navigation',
            description: 'The navigator who can read the seas like no other'
        },
        { 
            name: 'Brook', 
            crew: 'Straw Hat Pirates', 
            bounty: '383,000,000',
            title: 'Soul King',
            ability: 'Revive-Revive Fruit',
            description: 'The skeleton musician who brings joy even in death'
        },
        { 
            name: 'Franky', 
            crew: 'Straw Hat Pirates', 
            bounty: '394,000,000',
            title: 'Cyborg',
            ability: 'Shipwright Genius',
            description: 'The super shipwright with an unbreakable spirit'
        }
    ],
    
    uncommon: [
        { 
            name: 'Nico Robin', 
            crew: 'Straw Hat Pirates', 
            bounty: '930,000,000',
            title: 'Devil Child',
            ability: 'Flower-Flower Fruit',
            description: 'The archaeologist seeking the true history of the world'
        },
        { 
            name: 'Jinbe', 
            crew: 'Straw Hat Pirates', 
            bounty: '1,100,000,000',
            title: 'First Son of the Sea',
            ability: 'Fish-Man Karate',
            description: 'The honorable fish-man and former Warlord'
        },
        { 
            name: 'Portgas D. Ace', 
            crew: 'Whitebeard Pirates', 
            bounty: '550,000,000',
            title: 'Fire Fist',
            ability: 'Flame-Flame Fruit',
            description: 'The fiery brother whose legacy burns eternal'
        },
        { 
            name: 'Trafalgar D. Water Law', 
            crew: 'Heart Pirates', 
            bounty: '3,000,000,000',
            title: 'Surgeon of Death',
            ability: 'Op-Op Fruit',
            description: 'The calculating surgeon with the ultimate Devil Fruit'
        },
        { 
            name: 'Eustass Kid', 
            crew: 'Kid Pirates', 
            bounty: '3,000,000,000',
            title: 'Captain Kid',
            ability: 'Magnet-Magnet Fruit',
            description: 'The magnetic force of the Worst Generation'
        }
    ],
    
    rare: [
        { 
            name: 'Roronoa Zoro', 
            crew: 'Straw Hat Pirates', 
            bounty: '1,111,000,000',
            title: 'Pirate Hunter',
            ability: 'Three Sword Style',
            description: 'The greatest swordsman in training, with unshakeable loyalty'
        },
        { 
            name: 'Sanji', 
            crew: 'Straw Hat Pirates', 
            bounty: '1,032,000,000',
            title: 'Black Leg',
            ability: 'Diable Jambe',
            description: 'The cook whose kicks burn with passion and power'
        },
        { 
            name: 'Yamato', 
            crew: 'Straw Hat Allies', 
            bounty: 'Unknown',
            title: 'Oni Princess',
            ability: 'Dog-Dog Fruit: Okuchi-no-Makami',
            description: 'The guardian deity who carries Oden\'s will'
        },
        { 
            name: 'Marco', 
            crew: 'Whitebeard Pirates', 
            bounty: '1,374,000,000',
            title: 'The Phoenix',
            ability: 'Bird-Bird Fruit: Phoenix',
            description: 'The first commander who rises from any defeat'
        },
        { 
            name: 'King', 
            crew: 'Beast Pirates', 
            bounty: '1,390,000,000',
            title: 'The Wildfire',
            ability: 'Dragon-Dragon Fruit: Pteranodon',
            description: 'The last surviving Lunarian with flames of destruction'
        }
    ],
    
    legendary: [
        { 
            name: 'Monkey D. Luffy', 
            crew: 'Straw Hat Pirates', 
            bounty: '3,000,000,000',
            title: 'Straw Hat',
            ability: 'Gum-Gum Fruit (Awakened)',
            description: 'The rubber man destined to become the Pirate King'
        },
        { 
            name: 'Dracule Mihawk', 
            crew: 'Cross Guild', 
            bounty: '3,590,000,000',
            title: 'Hawk Eyes',
            ability: 'World\'s Strongest Swordsman',
            description: 'The lone eagle whose blade can cut through anything'
        },
        { 
            name: 'Shanks', 
            crew: 'Red Hair Pirates', 
            bounty: '4,048,900,000',
            title: 'Red Hair',
            ability: 'Conqueror\'s Haki Master',
            description: 'The emperor who inspires both fear and respect across the seas'
        },
        { 
            name: 'Charlotte Katakuri', 
            crew: 'Big Mom Pirates', 
            bounty: '1,057,000,000',
            title: 'Perfect Man',
            ability: 'Mochi-Mochi Fruit',
            description: 'The undefeated commander who sees the future'
        },
        { 
            name: 'Silvers Rayleigh', 
            crew: 'Roger Pirates', 
            bounty: 'Unknown',
            title: 'Dark King',
            ability: 'Supreme Haki Mastery',
            description: 'The right hand of the Pirate King, still legendary in retirement'
        },
        { 
            name: 'Monkey D. Dragon', 
            crew: 'Revolutionary Army', 
            bounty: 'Unknown',
            title: 'World\'s Most Wanted Man',
            ability: 'Weather Manipulation',
            description: 'The revolutionary leader who challenges the World Government itself'
        }
    ],
    
    mythical: [
        { 
            name: 'Edward Newgate "Whitebeard"', 
            crew: 'Whitebeard Pirates', 
            bounty: '5,046,000,000',
            title: 'Strongest Man in the World',
            ability: 'Tremor-Tremor Fruit',
            description: 'The emperor who could destroy the world with his power'
        },
        { 
            name: 'Kaido', 
            crew: 'Beast Pirates', 
            bounty: '4,611,100,000',
            title: 'King of the Beasts',
            ability: 'Dragon-Dragon Fruit: Azure Dragon',
            description: 'The "strongest creature" who seeks the ultimate battle'
        },
        { 
            name: 'Charlotte Linlin "Big Mom"', 
            crew: 'Big Mom Pirates', 
            bounty: '4,388,000,000',
            title: 'Big Mom',
            ability: 'Soul-Soul Fruit',
            description: 'The iron balloon who rules through fear and hunger'
        },
        { 
            name: 'Marshall D. Teach "Blackbeard"', 
            crew: 'Blackbeard Pirates', 
            bounty: '3,996,000,000',
            title: 'Blackbeard',
            ability: 'Dark-Dark & Tremor-Tremor Fruits',
            description: 'The ambitious emperor who wields the power of darkness'
        },
        { 
            name: 'Rocks D. Xebec', 
            crew: 'Rocks Pirates', 
            bounty: 'Unknown',
            title: 'Captain of Rocks',
            ability: 'Unknown Ancient Power',
            description: 'The legendary captain who nearly conquered the world'
        }
    ],
    
    omnipotent: [
        { 
            name: 'Gol D. Roger', 
            crew: 'Roger Pirates', 
            bounty: '5,564,800,000',
            title: 'Pirate King',
            ability: 'Voice of All Things',
            description: 'The only man to conquer the Grand Line and reach Laugh Tale'
        },
        { 
            name: 'Joy Boy', 
            crew: 'Ancient Kingdom', 
            bounty: 'Beyond Measure',
            title: 'The First Pirate',
            ability: 'Ancient Will Incarnate',
            description: 'The legendary figure whose promise spans across centuries'
        },
        { 
            name: 'Im', 
            crew: 'World Government', 
            bounty: 'Unknown',
            title: 'Ruler of the World',
            ability: 'Absolute Authority',
            description: 'The shadow sovereign who controls the fate of nations'
        },
        { 
            name: 'Monkey D. Luffy (Gear 5)', 
            crew: 'Straw Hat Pirates', 
            bounty: '3,000,000,000',
            title: 'Sun God Nika',
            ability: 'Human-Human Fruit: Nika',
            description: 'The awakened liberator whose laughter brings freedom to all'
        }
    ]
};

// Enhanced gacha mechanics
const GachaMechanics = {
    // Pity system - increases chances after bad luck
    pitySystem: {
        enabled: true,
        legendaryPity: 50,  // Guaranteed legendary after 50 pulls without one
        mythicalPity: 200,  // Guaranteed mythical after 200 pulls without one
        currentStreak: 0
    },

    // Special events that modify rates
    events: {
        current: null,
        types: {
            'legendaryBoost': { multiplier: 2.0, affects: ['legendary'] },
            'newbieBoost': { multiplier: 1.5, affects: ['rare', 'legendary'] },
            'fullMoon': { multiplier: 1.2, affects: ['mythical', 'omnipotent'] }
        }
    },

    // Streak bonuses
    streakBonuses: {
        5: { description: 'Lucky Streak!', bonus: 0.1 },
        10: { description: 'Hot Streak!', bonus: 0.2 },
        25: { description: 'Legendary Luck!', bonus: 0.5 },
        50: { description: 'Divine Fortune!', bonus: 1.0 }
    }
};

// Utility functions with enhanced mechanics
function getRarity(userStreak = 0, eventModifier = null) {
    let roll = Math.random() * 100;
    let cumulative = 0;
    
    // Apply streak bonuses
    if (userStreak >= 5) {
        const bonus = GachaMechanics.streakBonuses[userStreak] || 
                     GachaMechanics.streakBonuses[Math.max(...Object.keys(GachaMechanics.streakBonuses).map(Number))];
        // Shift probability toward higher rarities
        roll = roll * (1 - bonus.bonus);
    }
    
    // Apply event modifiers
    const modifiedRarities = { ...rarities };
    if (eventModifier && GachaMechanics.events.types[eventModifier]) {
        const event = GachaMechanics.events.types[eventModifier];
        event.affects.forEach(rarity => {
            if (modifiedRarities[rarity]) {
                modifiedRarities[rarity] = {
                    ...modifiedRarities[rarity],
                    chance: modifiedRarities[rarity].chance * event.multiplier
                };
            }
        });
    }
    
    // Calculate rarity based on modified chances
    for (const [rarity, config] of Object.entries(modifiedRarities)) {
        cumulative += config.chance;
        if (roll <= cumulative) {
            return rarity;
        }
    }
    
    return 'common';
}

function getRandomCharacter(rarity) {
    const pool = characters[rarity] || characters.common;
    if (!pool || pool.length === 0) {
        console.warn(`No characters found for rarity: ${rarity}`);
        return characters.common[0];
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

// Advanced character information
function getCharacterDetails(character, rarity) {
    const config = rarities[rarity];
    
    return {
        ...character,
        rarity: {
            name: config.name,
            color: config.color,
            emoji: config.emoji,
            stars: config.stars,
            description: config.description
        },
        powerLevel: calculatePowerLevel(rarity),
        collectionValue: calculateCollectionValue(rarity, character.name),
        isNew: checkIfNewCharacter(character.name), // You'd implement this based on user data
        duplicateCount: getDuplicateCount(character.name) // You'd implement this based on user data
    };
}

function calculatePowerLevel(rarity) {
    const basePower = {
        common: 100,
        uncommon: 250,
        rare: 500,
        legendary: 1000,
        mythical: 2500,
        omnipotent: 5000
    };
    
    const variance = 0.2; // 20% variance
    const base = basePower[rarity] || basePower.common;
    const modifier = 1 + (Math.random() - 0.5) * variance;
    
    return Math.floor(base * modifier);
}

function calculateCollectionValue(rarity, characterName) {
    const baseValues = {
        common: 10,
        uncommon: 25,
        rare: 100,
        legendary: 500,
        mythical: 2000,
        omnipotent: 10000
    };
    
    // Special characters get bonus value
    const specialCharacters = [
        'Gol D. Roger', 'Joy Boy', 'Monkey D. Luffy (Gear 5)',
        'Edward Newgate "Whitebeard"', 'Kaido'
    ];
    
    let value = baseValues[rarity] || baseValues.common;
    if (specialCharacters.includes(characterName)) {
        value *= 1.5;
    }
    
    return Math.floor(value);
}

// Placeholder functions - implement based on your user data system
function checkIfNewCharacter(characterName) {
    // Return true if this is the first time the user gets this character
    return Math.random() > 0.3; // 70% chance of being new for demo
}

function getDuplicateCount(characterName) {
    // Return how many times the user has gotten this character
    return Math.floor(Math.random() * 5); // Random 0-4 for demo
}

// Export all the enhanced functionality
module.exports = {
    rarities,
    characters,
    GachaMechanics,
    getRarity,
    getRandomCharacter,
    getCharacterDetails,
    calculatePowerLevel,
    calculateCollectionValue
};
