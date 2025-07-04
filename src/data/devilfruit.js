// ═══════════════════════════════════════════════════════════════════
//                    ONE PIECE DEVIL FRUIT DATABASE
// ═══════════════════════════════════════════════════════════════════

const RARITY_CONFIG = {
    common: { 
        name: 'Common',
        color: '#8B4513',  // Fixed brown color
        emoji: '🟫',
        stars: '⭐',
        chance: 45.0,
        description: 'Basic Devil Fruits with useful but limited abilities',
        power: 'Foundation',
        baseValue: 100
    },
    uncommon: { 
        name: 'Uncommon',
        color: '#2ECC71',
        emoji: '🟩',
        stars: '⭐⭐',
        chance: 30.0,
        description: 'Notable Devil Fruits with respectable combat potential',
        power: 'Rising',
        baseValue: 250
    },
    rare: { 
        name: 'Rare',
        color: '#3498DB',
        emoji: '🟦',
        stars: '⭐⭐⭐',
        chance: 18.0,
        description: 'Powerful Devil Fruits with significant abilities',
        power: 'Elite',
        baseValue: 500
    },
    legendary: { 
        name: 'Legendary',
        color: '#F39C12',
        emoji: '🟨',
        stars: '⭐⭐⭐⭐',
        chance: 5.5,
        description: 'Exceptional Devil Fruits that define their users as legends',
        power: 'Legendary',
        baseValue: 1000
    },
    mythical: { 
        name: 'Mythical',
        color: '#E74C3C',
        emoji: '🟥',
        stars: '⭐⭐⭐⭐⭐',
        chance: 1.3,
        description: 'World-changing Devil Fruits of immense power',
        power: 'Mythical',
        baseValue: 2500
    },
    omnipotent: { 
        name: 'Divine',  // Updated name
        color: '#9B59B6',
        emoji: '🟪',
        stars: '⭐⭐⭐⭐⭐⭐',
        chance: 0.2,
        description: 'Reality-bending Devil Fruits that transcend normal limits',
        power: 'Divine',
        baseValue: 10000
    }
};

// Import counter system
const { DEVIL_FRUIT_ELEMENTS, CombatSystem } = require('../animations/counter-system');

const DEVILFRUIT_DATABASE = {
    // ═══════════════════════════════════════════════════════════════════
    //                           COMMON TIER
    // Basic Zoan and simple Paramecia fruits
    // ═══════════════════════════════════════════════════════════════════
    common: [
        {
            id: 'hito_hito_001',
            name: 'Hito Hito no Mi',
            type: 'Zoan',
            power: 'Human transformation',
            user: 'Tony Tony Chopper',
            description: 'Allows an animal to become human, granting intelligence and forms',
            awakening: 'Enhanced physical capabilities and multiple transformation points',
            weakness: 'Standard Devil Fruit weaknesses, transformation fatigue',
            powerLevel: 150,
            rarity: 'common',
            element: 'zoan_beast'
        },
        {
            id: 'mogu_mogu_001',
            name: 'Mogu Mogu no Mi',
            type: 'Zoan',
            power: 'Mole transformation',
            user: 'Miss Merry Christmas',
            description: 'Grants the ability to transform into a mole and dig underground',
            awakening: 'Enhanced tunneling speed and earth manipulation',
            weakness: 'Limited surface combat effectiveness',
            powerLevel: 120,
            rarity: 'common',
            element: 'zoan_beast'
        },
        {
            id: 'sube_sube_001',
            name: 'Sube Sube no Mi',
            type: 'Paramecia',
            power: 'Smooths the body, attacks slide off',
            user: 'Alvida',
            description: 'Makes the user\'s body perfectly smooth, deflecting attacks',
            awakening: 'Environmental smoothing and friction manipulation',
            weakness: 'Limited offensive capabilities',
            powerLevel: 140,
            rarity: 'common',
            element: 'rubber'
        },
        {
            id: 'noro_noro_001',
            name: 'Noro Noro no Mi',
            type: 'Paramecia',
            power: 'Emits slow-motion beams',
            user: 'Foxy',
            description: 'Slows down anything hit by its beams for 30 seconds',
            awakening: 'Area-wide time dilation effects',
            weakness: 'Beams can be reflected, limited duration',
            powerLevel: 160,
            rarity: 'common',
            element: 'gravity'
        },
        {
            id: 'awa_awa_001',
            name: 'Awa Awa no Mi',
            type: 'Paramecia',
            power: 'Produces cleansing bubbles',
            user: 'Kalifa',
            description: 'Creates soap bubbles that clean away strength and lubricate surfaces',
            awakening: 'Environmental bubble generation and power draining',
            weakness: 'Water neutralizes soap effects',
            powerLevel: 130,
            rarity: 'common',
            element: 'poison'
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    //                          UNCOMMON TIER
    // Useful combat fruits and basic animal Zoans
    // ═══════════════════════════════════════════════════════════════════
    uncommon: [
        {
            id: 'bara_bara_001',
            name: 'Bara Bara no Mi',
            type: 'Paramecia',
            power: 'Splits body into levitating pieces',
            user: 'Buggy',
            description: 'Allows the user to split their body into pieces and control them',
            awakening: 'Object splitting and environmental fragmentation',
            weakness: 'Feet cannot float, blade immunity only',
            powerLevel: 280,
            rarity: 'uncommon',
            element: 'metal'
        },
        {
            id: 'hana_hana_001',
            name: 'Hana Hana no Mi',
            type: 'Paramecia',
            power: 'Sprouts limbs anywhere',
            user: 'Nico Robin',
            description: 'Allows sprouting of body parts from any surface',
            awakening: 'Gigantic limb creation and environmental body part sprouting',
            weakness: 'Damage to sprouted limbs affects the user',
            powerLevel: 320,
            rarity: 'uncommon',
            element: 'zoan_beast'
        },
        {
            id: 'doru_doru_001',
            name: 'Doru Doru no Mi',
            type: 'Paramecia',
            power: 'Produces and manipulates wax',
            user: 'Mr. 3 (Galdino)',
            description: 'Creates and controls wax that hardens to steel-like strength',
            awakening: 'Environmental wax generation and temperature resistance',
            weakness: 'Fire melts wax constructs',
            powerLevel: 250,
            rarity: 'uncommon',
            element: 'stone'
        },
        {
            id: 'buki_buki_001',
            name: 'Buki Buki no Mi',
            type: 'Paramecia',
            power: 'Turns body parts into weapons',
            user: 'Baby 5',
            description: 'Transforms any part of the body into various weapons',
            awakening: 'Environmental weapon transformation',
            weakness: 'Complex weapons require more concentration',
            powerLevel: 300,
            rarity: 'uncommon',
            element: 'metal'
        },
        {
            id: 'ushi_ushi_001',
            name: 'Ushi Ushi no Mi, Model: Bison',
            type: 'Zoan',
            power: 'Bison form',
            user: 'Dalton',
            description: 'Transformation into a powerful bison with enhanced strength',
            awakening: 'Enhanced herd instincts and territorial dominance',
            weakness: 'Standard Zoan weaknesses',
            powerLevel: 310,
            rarity: 'uncommon',
            element: 'zoan_beast'
        },
        {
            id: 'inu_inu_wolf_001',
            name: 'Inu Inu no Mi, Model: Wolf',
            type: 'Zoan',
            power: 'Wolf form',
            user: 'Jabra',
            description: 'Wolf transformation with enhanced speed and pack tactics',
            awakening: 'Pack coordination and enhanced senses',
            weakness: 'Vulnerable to loud sounds',
            powerLevel: 330,
            rarity: 'uncommon',
            element: 'zoan_beast'
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    //                            RARE TIER
    // Strong Paramecia, powerful Zoans, and basic Logia
    // ═══════════════════════════════════════════════════════════════════
    rare: [
        {
            id: 'doku_doku_001',
            name: 'Doku Doku no Mi',
            type: 'Paramecia',
            power: 'Creates and controls poison',
            user: 'Magellan',
            description: 'Generates various types of deadly poison with different effects',
            awakening: 'Environmental poison generation and immunity granting',
            weakness: 'User may suffer from own poison effects',
            powerLevel: 650,
            rarity: 'rare',
            element: 'poison'
        },
        {
            id: 'mero_mero_001',
            name: 'Mero Mero no Mi',
            type: 'Paramecia',
            power: 'Turns lustful victims to stone',
            user: 'Boa Hancock',
            description: 'Petrifies those who feel attraction to the user',
            awakening: 'Emotion-based petrification and statue animation',
            weakness: 'Ineffective against pure-hearted individuals',
            powerLevel: 680,
            rarity: 'rare',
            element: 'soul'
        },
        {
            id: 'nikyu_nikyu_001',
            name: 'Nikyu Nikyu no Mi',
            type: 'Paramecia',
            power: 'Repels anything, including pain',
            user: 'Bartholomew Kuma',
            description: 'Repels anything touched by paw pads, including abstract concepts',
            awakening: 'Environmental repulsion and dimensional displacement',
            weakness: 'Requires direct contact with paw pads',
            powerLevel: 720,
            rarity: 'rare',
            element: 'spatial'
        },
        {
            id: 'gasu_gasu_001',
            name: 'Gasu Gasu no Mi',
            type: 'Logia',
            power: 'Poisonous/flame gas',
            user: 'Caesar Clown',
            description: 'Become and control various gases including poison',
            awakening: 'Atmospheric control and gas composition manipulation',
            weakness: 'Wind can disperse gas forms',
            powerLevel: 580,
            rarity: 'rare',
            element: 'gas'
        },
        {
            id: 'suna_suna_001',
            name: 'Suna Suna no Mi',
            type: 'Logia',
            power: 'Sand control',
            user: 'Crocodile',
            description: 'Transform into sand and control desert environments',
            awakening: 'Desertification and moisture absorption on massive scales',
            weakness: 'Water nullifies sand powers completely',
            powerLevel: 620,
            rarity: 'rare',
            element: 'sand'
        },
        {
            id: 'neko_neko_001',
            name: 'Neko Neko no Mi, Model: Leopard',
            type: 'Zoan',
            power: 'Leopard form',
            user: 'Rob Lucci',
            description: 'Leopard transformation with enhanced stealth and combat prowess',
            awakening: 'Enhanced predatory instincts and territory control',
            weakness: 'Overconfidence in hunting abilities',
            powerLevel: 700,
            rarity: 'rare',
            element: 'zoan_beast'
        },
        {
            id: 'ryu_ryu_allo_001',
            name: 'Ryu Ryu no Mi, Model: Allosaurus',
            type: 'Ancient Zoan',
            power: 'Allosaurus form',
            user: 'X-Drake',
            description: 'Ancient dinosaur transformation with massive physical power',
            awakening: 'Prehistoric instincts and enhanced recovery',
            weakness: 'Large size makes user a bigger target',
            powerLevel: 750,
            rarity: 'rare',
            element: 'zoan_ancient'
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    //                         LEGENDARY TIER
    // Top-tier Logia, powerful Paramecia, and elite Ancient Zoans
    // ═══════════════════════════════════════════════════════════════════
    legendary: [
        {
            id: 'mera_mera_001',
            name: 'Mera Mera no Mi',
            type: 'Logia',
            power: 'Fire control & transformation',
            user: 'Ace → Sabo',
            description: 'Transform into fire and control flames with devastating power',
            awakening: 'Environmental ignition and temperature manipulation',
            weakness: 'Magma can overpower fire',
            powerLevel: 1200,
            rarity: 'legendary',
            element: 'fire'
        },
        {
            id: 'hie_hie_001',
            name: 'Hie Hie no Mi',
            type: 'Logia',
            power: 'Ice control',
            user: 'Aokiji',
            description: 'Transform into ice and freeze vast areas instantly',
            awakening: 'Climate manipulation and ice age induction',
            weakness: 'Fire and heat can melt ice constructs',
            powerLevel: 1300,
            rarity: 'legendary',
            element: 'ice'
        },
        {
            id: 'pika_pika_001',
            name: 'Pika Pika no Mi',
            type: 'Logia',
            power: 'Light speed & lasers',
            user: 'Kizaru',
            description: 'Transform into light and move at light speed with laser attacks',
            awakening: 'Photon manipulation and blinding environmental effects',
            weakness: 'Mirrors can redirect attacks',
            powerLevel: 1350,
            rarity: 'legendary',
            element: 'light'
        },
        {
            id: 'goro_goro_001',
            name: 'Goro Goro no Mi',
            type: 'Logia',
            power: 'Lightning control',
            user: 'Enel',
            description: 'Transform into lightning with electric attacks and observation',
            awakening: 'Electromagnetic field control and electronic manipulation',
            weakness: 'Rubber insulates against electricity',
            powerLevel: 1250,
            rarity: 'legendary',
            element: 'lightning'
        },
        {
            id: 'magu_magu_001',
            name: 'Magu Magu no Mi',
            type: 'Logia',
            power: 'Magma control',
            user: 'Akainu',
            description: 'Transform into magma with the highest offensive power among Logia',
            awakening: 'Volcanic eruption induction and geological transformation',
            weakness: 'Extreme cold can solidify magma',
            powerLevel: 1400,
            rarity: 'legendary',
            element: 'magma'
        },
        {
            id: 'yami_yami_001',
            name: 'Yami Yami no Mi',
            type: 'Logia',
            power: 'Darkness & gravity',
            user: 'Blackbeard',
            description: 'Control darkness and gravity, nullifying other Devil Fruit powers',
            awakening: 'Black hole creation and power absorption',
            weakness: 'Cannot dodge attacks like other Logia, attracts more damage',
            powerLevel: 1180,
            rarity: 'legendary',
            element: 'darkness'
        },
        {
            id: 'ope_ope_001',
            name: 'Ope Ope no Mi',
            type: 'Paramecia',
            power: 'Surgical spatial \'Room\'',
            user: 'Trafalgar Law',
            description: 'Creates a spherical space where the user can manipulate anything',
            awakening: 'Environmental surgery and object property manipulation',
            weakness: 'Requires significant stamina for large rooms',
            powerLevel: 1150,
            rarity: 'legendary',
            element: 'spatial'
        },
        {
            id: 'zushi_zushi_001',
            name: 'Zushi Zushi no Mi',
            type: 'Paramecia',
            power: 'Gravity manipulation',
            user: 'Fujitora',
            description: 'Controls gravitational forces and can summon meteorites',
            awakening: 'Planetary gravitational influence',
            weakness: 'Requires concentration for precise control',
            powerLevel: 1280,
            rarity: 'legendary',
            element: 'gravity'
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    //                          MYTHICAL TIER
    // World-changing fruits and powerful Mythical Zoans
    // ═══════════════════════════════════════════════════════════════════
    mythical: [
        {
            id: 'gura_gura_001',
            name: 'Gura Gura no Mi',
            type: 'Paramecia',
            power: 'Earthquake shockwaves',
            user: 'Whitebeard → Blackbeard',
            description: 'Creates devastating earthquakes capable of destroying the world',
            awakening: 'Tectonic plate manipulation and dimensional cracking',
            weakness: 'Vibrations can be absorbed by certain materials',
            powerLevel: 2800,
            rarity: 'mythical',
            element: 'vibration'
        },
        {
            id: 'soru_soru_001',
            name: 'Soru Soru no Mi',
            type: 'Paramecia',
            power: 'Soul control & object animation',
            user: 'Big Mom',
            description: 'Manipulates souls and grants life to inanimate objects',
            awakening: 'Mass soul manipulation and homie army creation',
            weakness: 'Fear weakens soul manipulation power',
            powerLevel: 2700,
            rarity: 'mythical',
            element: 'soul'
        },
        {
            id: 'uo_uo_001',
            name: 'Uo Uo no Mi, Model: Seiryu',
            type: 'Mythical Zoan',
            power: 'Azure Dragon form',
            user: 'Kaido',
            description: 'Mythical azure dragon with weather control and incredible durability',
            awakening: 'Elemental mastery and indestructible scales',
            weakness: 'Extreme size in dragon form',
            powerLevel: 2900,
            rarity: 'mythical',
            element: 'zoan_mythical'
        },
        {
            id: 'tori_tori_phoenix_001',
            name: 'Tori Tori no Mi, Model: Phoenix',
            type: 'Mythical Zoan',
            power: 'Blue Phoenix form',
            user: 'Marco',
            description: 'Phoenix transformation with blue flames of regeneration',
            awakening: 'Mass healing and resurrection abilities',
            weakness: 'Regeneration has limits and requires energy',
            powerLevel: 2600,
            rarity: 'mythical',
            element: 'zoan_mythical'
        },
        {
            id: 'hito_hito_daibutsu_001',
            name: 'Hito Hito no Mi, Model: Daibutsu',
            type: 'Mythical Zoan',
            power: 'Golden Buddha form',
            user: 'Sengoku',
            description: 'Golden Buddha transformation with shockwave generation',
            awakening: 'Divine authority and enlightenment powers',
            weakness: 'Requires calm mind for full power',
            powerLevel: 2650,
            rarity: 'mythical',
            element: 'zoan_mythical'
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    //                         OMNIPOTENT/DIVINE TIER
    // Reality-bending ultimate Devil Fruits
    // ═══════════════════════════════════════════════════════════════════
    omnipotent: [
        {
            id: 'hito_hito_nika_001',
            name: 'Hito Hito no Mi, Model: Nika',
            type: 'Mythical Zoan',
            power: 'Rubber body & reality-bending freedom',
            user: 'Monkey D. Luffy',
            description: 'The most ridiculous power - turns imagination into reality through joy',
            awakening: 'Environmental rubber transformation and cartoon physics manipulation',
            weakness: 'Requires joy and freedom of spirit to activate fully',
            powerLevel: 5500,
            rarity: 'omnipotent',
            element: 'rubber'
        },
        {
            id: 'inu_inu_okuchi_001',
            name: 'Inu Inu no Mi, Model: Okuchi no Makami',
            type: 'Mythical Zoan',
            power: 'Mythical wolf deity with ice powers',
            user: 'Yamato',
            description: 'Guardian wolf deity of Wano with divine ice and thunder powers',
            awakening: 'Divine protection and elemental mastery over ice/thunder',
            weakness: 'Bound by duty and protective instincts',
            powerLevel: 4800,
            rarity: 'omnipotent',
            element: 'zoan_mythical'
        }
    ]
};

// Enhanced database functions with counter system
class DevilFruitDatabase {
    static getAllDevilFruits() {
        return DEVILFRUIT_DATABASE;
    }

    static getDevilFruitsByRarity(rarity) {
        return DEVILFRUIT_DATABASE[rarity] || [];
    }

    static getDevilFruitById(id) {
        for (const rarity in DEVILFRUIT_DATABASE) {
            const fruit = DEVILFRUIT_DATABASE[rarity].find(fruit => fruit.id === id);
            if (fruit) return fruit;
        }
        return null;
    }

    static getRandomDevilFruit(rarity) {
        const pool = this.getDevilFruitsByRarity(rarity);
        if (!pool || pool.length === 0) {
            console.warn(`No Devil Fruits found for rarity: ${rarity}`);
            return this.getDevilFruitsByRarity('common')[0];
        }
        return pool[Math.floor(Math.random() * pool.length)];
    }

    static getRarityConfig(rarity) {
        return RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
    }

    static getAllRarities() {
        return RARITY_CONFIG;
    }

    static calculateDropRarity() {
        const roll = Math.random() * 100;
        let cumulative = 0;
        
        for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
            cumulative += config.chance;
            if (roll <= cumulative) {
                return rarity;
            }
        }
        return 'common';
    }

    // NEW: Get fruit with counter information
    static getFruitWithCounters(id) {
        const fruit = this.getDevilFruitById(id);
        if (!fruit) return null;

        const element = DEVIL_FRUIT_ELEMENTS[id];
        const elementName = element ? CombatSystem.getElementName(element) : 'Unknown';

        return {
            ...fruit,
            element: element,
            elementName: elementName,
            counters: this.getFruitCounters(id)
        };
    }

    // NEW: Get what this fruit is strong/weak against
    static getFruitCounters(id) {
        const element = DEVIL_FRUIT_ELEMENTS[id];
        if (!element) return { strongAgainst: [], weakAgainst: [] };

        // Find fruits this one counters
        const strongAgainst = [];
        const weakAgainst = [];

        for (const [fruitId, targetElement] of Object.entries(DEVIL_FRUIT_ELEMENTS)) {
            if (fruitId === id) continue;

            const effectiveness = CombatSystem.calculateEffectiveness(id, fruitId);
            const targetFruit = this.getDevilFruitById(fruitId);

            if (effectiveness.effectiveness > 1.2 && targetFruit) {
                strongAgainst.push(targetFruit.name);
            } else if (effectiveness.effectiveness < 0.8 && targetFruit) {
                weakAgainst.push(targetFruit.name);
            }
        }

        return { strongAgainst, weakAgainst };
    }
}

module.exports = {
    DevilFruitDatabase,
    RARITY_CONFIG,
    DEVILFRUIT_DATABASE
};
