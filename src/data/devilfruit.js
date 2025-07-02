// ═══════════════════════════════════════════════════════════════════
//                    ONE PIECE DEVIL FRUIT DATABASE
// ═══════════════════════════════════════════════════════════════════

const RARITY_CONFIG = {
    common: { 
        name: 'Common',
        color: '#95A5A6',
        emoji: '⚪',
        stars: '⭐',
        chance: 45.0,
        description: 'Basic Devil Fruits with useful but limited abilities',
        power: 'Foundation',
        baseValue: 100
    },
    uncommon: { 
        name: 'Uncommon',
        color: '#2ECC71',
        emoji: '🟢',
        stars: '⭐⭐',
        chance: 30.0,
        description: 'Notable Devil Fruits with respectable combat potential',
        power: 'Rising',
        baseValue: 250
    },
    rare: { 
        name: 'Rare',
        color: '#3498DB',
        emoji: '🔵',
        stars: '⭐⭐⭐',
        chance: 18.0,
        description: 'Powerful Devil Fruits with significant abilities',
        power: 'Elite',
        baseValue: 500
    },
    legendary: { 
        name: 'Legendary',
        color: '#F39C12',
        emoji: '🟡',
        stars: '⭐⭐⭐⭐',
        chance: 5.5,
        description: 'Exceptional Devil Fruits that define their users as legends',
        power: 'Legendary',
        baseValue: 1000
    },
    mythical: { 
        name: 'Mythical',
        color: '#E74C3C',
        emoji: '🔴',
        stars: '⭐⭐⭐⭐⭐',
        chance: 1.3,
        description: 'World-changing Devil Fruits of immense power',
        power: 'Mythical',
        baseValue: 2500
    },
    omnipotent: { 
        name: 'Omnipotent',
        color: '#9B59B6',
        emoji: '🌌',
        stars: '⭐⭐⭐⭐⭐⭐',
        chance: 0.2,
        description: 'Reality-bending Devil Fruits that transcend normal limits',
        power: 'Divine',
        baseValue: 10000
    }
};

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
            rarity: 'common'
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
            rarity: 'common'
        },
        {
            id: 'kame_kame_001',
            name: 'Kame Kame no Mi',
            type: 'Zoan',
            power: 'Turtle transformation',
            user: 'Unnamed Marine',
            description: 'Allows transformation into a turtle form with enhanced defense',
            awakening: 'Impenetrable shell and enhanced longevity',
            weakness: 'Reduced mobility and speed',
            powerLevel: 110,
            rarity: 'common'
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
            rarity: 'common'
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
            rarity: 'common'
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
            rarity: 'common'
        },
        {
            id: 'sara_sara_001',
            name: 'Sara Sara no Mi, Model: Axolotl',
            type: 'Zoan',
            power: 'Axolotl form',
            user: 'Smiley',
            description: 'Grants axolotl transformation with regenerative abilities',
            awakening: 'Enhanced regeneration and aquatic adaptation',
            weakness: 'Vulnerable to extreme temperatures',
            powerLevel: 125,
            rarity: 'common'
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
            rarity: 'uncommon'
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
            rarity: 'uncommon'
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
            rarity: 'uncommon'
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
            rarity: 'uncommon'
        },
        {
            id: 'guru_guru_001',
            name: 'Guru Guru no Mi',
            type: 'Paramecia',
            power: 'Allows user to rotate limbs like drills',
            user: 'Buffalo',
            description: 'Enables rotation of body parts at high speeds for flight and attacks',
            awakening: 'Environmental rotation and tornado generation',
            weakness: 'Dizziness from excessive rotation',
            powerLevel: 270,
            rarity: 'uncommon'
        },
        {
            id: 'tama_tama_001',
            name: 'Tama Tama no Mi',
            type: 'Paramecia',
            power: 'Produces explosive balls from body',
            user: 'Gladius',
            description: 'Creates and detonates explosive spheres from the body',
            awakening: 'Environmental explosion induction',
            weakness: 'Self-damage from explosions if not careful',
            powerLevel: 290,
            rarity: 'uncommon'
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
            rarity: 'uncommon'
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
            rarity: 'uncommon'
        },
        {
            id: 'tori_tori_001',
            name: 'Tori Tori no Mi, Model: Falcon',
            type: 'Zoan',
            power: 'Falcon form',
            user: 'Pell',
            description: 'Falcon transformation granting flight and enhanced vision',
            awakening: 'Enhanced aerial maneuverability and hunting instincts',
            weakness: 'Vulnerable during molting periods',
            powerLevel: 285,
            rarity: 'uncommon'
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
            rarity: 'rare'
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
            rarity: 'rare'
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
            rarity: 'rare'
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
            rarity: 'rare'
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
            rarity: 'rare'
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
            rarity: 'rare'
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
            rarity: 'rare'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
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
            rarity: 'legendary'
        },
        {
            id: 'ryu_ryu_ptera_001',
            name: 'Ryu Ryu no Mi, Model: Pteranodon',
            type: 'Ancient Zoan',
            power: 'Pteranodon form',
            user: 'King',
            description: 'Ancient flying dinosaur with Lunarian fire abilities',
            awakening: 'Enhanced aerial dominance and flame generation',
            weakness: 'Wing vulnerability during flight',
            powerLevel: 1320,
            rarity: 'legendary'
        },
        {
            id: 'ryu_ryu_brachio_001',
            name: 'Ryu Ryu no Mi, Model: Brachiosaurus',
            type: 'Ancient Zoan',
            power: 'Brachiosaurus form',
            user: 'Queen',
            description: 'Massive ancient dinosaur with mechanical enhancements',
            awakening: 'Colossal size and technological integration',
            weakness: 'Large size limits mobility',
            powerLevel: 1180,
            rarity: 'legendary'
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
            rarity: 'mythical'
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
            rarity: 'mythical'
        },
        {
            id: 'mochi_mochi_001',
            name: 'Mochi Mochi no Mi',
            type: 'Special Paramecia',
            power: 'Creates & controls mochi',
            user: 'Charlotte Katakuri',
            description: 'Special Paramecia that acts like Logia with mochi creation',
            awakening: 'Environmental mochi transformation and future sight enhancement',
            weakness: 'Water makes mochi lose stickiness',
            powerLevel: 2500,
            rarity: 'mythical'
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
            rarity: 'mythical'
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
            rarity: 'mythical'
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
            rarity: 'mythical'
        },
        {
            id: 'hebi_hebi_001',
            name: 'Hebi Hebi no Mi, Model: Yamata no Orochi',
            type: 'Mythical Zoan',
            power: 'Eight-headed serpent form',
            user: 'Orochi',
            description: 'Eight-headed mythical serpent with multiple lives',
            awakening: 'Regeneration through head multiplication',
            weakness: 'All heads must be destroyed simultaneously',
            powerLevel: 2400,
            rarity: 'mythical'
        },
        {
            id: 'inu_inu_kyubi_001',
            name: 'Inu Inu no Mi, Model: Kyubi no Kitsune',
            type: 'Mythical Zoan',
            power: 'Nine-tailed fox transformation',
            user: 'Catarina Devon',
            description: 'Nine-tailed fox with illusion and shapeshifting abilities',
            awakening: 'Reality illusion and perfect mimicry',
            weakness: 'Illusions break under extreme emotional stress',
            powerLevel: 2450,
            rarity: 'mythical'
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    //                         OMNIPOTENT TIER
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
            rarity: 'omnipotent'
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
            rarity: 'omnipotent'
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════
//                        DATABASE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

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

    static searchDevilFruits(query) {
        const results = [];
        const searchQuery = query.toLowerCase();
        
        for (const rarity in DEVILFRUIT_DATABASE) {
            DEVILFRUIT_DATABASE[rarity].forEach(fruit => {
                if (fruit.name.toLowerCase().includes(searchQuery) ||
                    fruit.type.toLowerCase().includes(searchQuery) ||
                    fruit.user.toLowerCase().includes(searchQuery) ||
                    fruit.power.toLowerCase().includes(searchQuery)) {
                    results.push(fruit);
                }
            });
        }
        return results;
    }

    static getDevilFruitsByType(type) {
        const results = [];
        for (const rarity in DEVILFRUIT_DATABASE) {
            DEVILFRUIT_DATABASE[rarity].forEach(fruit => {
                if (fruit.type.toLowerCase().includes(type.toLowerCase())) {
                    results.push(fruit);
                }
            });
        }
        return results;
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

    static getDevilFruitCount() {
        let total = 0;
        for (const rarity in DEVILFRUIT_DATABASE) {
            total += DEVILFRUIT_DATABASE[rarity].length;
        }
        return total;
    }

    static getDevilFruitCountByRarity() {
        const counts = {};
        for (const rarity in DEVILFRUIT_DATABASE) {
            counts[rarity] = DEVILFRUIT_DATABASE[rarity].length;
        }
        return counts;
    }

    static getDevilFruitCountByType() {
        const counts = { Paramecia: 0, Logia: 0, Zoan: 0, 'Ancient Zoan': 0, 'Mythical Zoan': 0, 'Special Paramecia': 0 };
        
        for (const rarity in DEVILFRUIT_DATABASE) {
            DEVILFRUIT_DATABASE[rarity].forEach(fruit => {
                counts[fruit.type] = (counts[fruit.type] || 0) + 1;
            });
        }
        return counts;
    }

    static getAwakenedDevilFruits() {
        const awakened = [];
        for (const rarity in DEVILFRUIT_DATABASE) {
            DEVILFRUIT_DATABASE[rarity].forEach(fruit => {
                if (fruit.awakening && fruit.awakening !== 'Unknown') {
                    awakened.push(fruit);
                }
            });
        }
        return awakened;
    }

    static getDevilFruitsByUser(userName) {
        const results = [];
        for (const rarity in DEVILFRUIT_DATABASE) {
            DEVILFRUIT_DATABASE[rarity].forEach(fruit => {
                if (fruit.user.toLowerCase().includes(userName.toLowerCase())) {
                    results.push(fruit);
                }
            });
        }
        return results;
    }

    static getStrongestDevilFruits(limit = 10) {
        const allFruits = [];
        for (const rarity in DEVILFRUIT_DATABASE) {
            allFruits.push(...DEVILFRUIT_DATABASE[rarity]);
        }
        return allFruits
            .sort((a, b) => b.powerLevel - a.powerLevel)
            .slice(0, limit);
    }

    static getRandomDevilFruitByType(type) {
        const fruitsOfType = this.getDevilFruitsByType(type);
        if (fruitsOfType.length === 0) return null;
        return fruitsOfType[Math.floor(Math.random() * fruitsOfType.length)];
    }

    // Special rarity calculation with type bonuses
    static calculateDropRarityWithTypeBonus(preferredType = null) {
        let rarity = this.calculateDropRarity();
        
        // If a specific type is preferred, slightly boost rare+ chances
        if (preferredType && ['Logia', 'Mythical Zoan'].includes(preferredType)) {
            const boostRoll = Math.random();
            if (boostRoll < 0.1) { // 10% chance to boost rarity
                const rarityLevels = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
                const currentIndex = rarityLevels.indexOf(rarity);
                if (currentIndex < rarityLevels.length - 1) {
                    rarity = rarityLevels[currentIndex + 1];
                }
            }
        }
        
        return rarity;
    }
}

// ═══════════════════════════════════════════════════════════════════
//                         SPECIAL COLLECTIONS
// ═══════════════════════════════════════════════════════════════════

const SPECIAL_COLLECTIONS = {
    LOGIA_TRIO: ['mera_mera_001', 'hie_hie_001', 'pika_pika_001'],
    ADMIRAL_FRUITS: ['magu_magu_001', 'hie_hie_001', 'pika_pika_001', 'zushi_zushi_001'],
    EMPEROR_FRUITS: ['gura_gura_001', 'soru_soru_001', 'uo_uo_001', 'hito_hito_nika_001'],
    ANCIENT_WEAPONS: ['ope_ope_001', 'nikyu_nikyu_001', 'gura_gura_001'],
    MYTHICAL_BEASTS: ['uo_uo_001', 'tori_tori_phoenix_001', 'hito_hito_daibutsu_001', 'hebi_hebi_001', 'inu_inu_kyubi_001', 'inu_inu_okuchi_001'],
    WORLD_DESTROYERS: ['gura_gura_001', 'magu_magu_001', 'yami_yami_001', 'hito_hito_nika_001']
};

// ═══════════════════════════════════════════════════════════════════
//                         RARITY ANALYSIS
// ═══════════════════════════════════════════════════════════════════

const RARITY_ANALYSIS = {
    // My rarity assessment based on One Piece power scaling:
    
    // COMMON (45%): Basic utility fruits, weak Zoans
    // - Hito Hito (Chopper's version), basic animal Zoans
    // - Simple Paramecia with limited combat use
    
    // UNCOMMON (30%): Useful combat fruits, decent Zoans  
    // - Bara Bara, Hana Hana, weapon/tool creation fruits
    // - Standard predator Zoans (leopard, wolf, etc.)
    
    // RARE (18%): Strong combat fruits, Ancient Zoans, basic Logia
    // - Doku Doku, powerful Paramecia, Ancient Zoans
    // - Weaker Logia like Gasu Gasu, Suna Suna
    
    // LEGENDARY (5.5%): Top-tier Logia, elite Paramecia
    // - Admiral fruits (Magu Magu, Hie Hie, Pika Pika)
    // - Goro Goro, Mera Mera, Ope Ope, Yami Yami
    
    // MYTHICAL (1.3%): World-changing power
    // - Gura Gura, Soru Soru, Emperor-level fruits
    // - Most Mythical Zoans (Phoenix, Dragon, Buddha)
    
    // OMNIPOTENT (0.2%): Reality-bending ultimate power
    // - Hito Hito Nika (Luffy's true fruit)
    // - Okuchi no Makami (Yamato's guardian deity fruit)
    
    reasoning: {
        common: "Basic fruits that provide utility but limited combat power",
        uncommon: "Decent fruits used by notable but not top-tier characters", 
        rare: "Strong fruits that make their users formidable fighters",
        legendary: "Fruits that define their users as top-tier powers in the world",
        mythical: "World-changing fruits that can alter the balance of power",
        omnipotent: "Reality-transcending fruits that break normal Devil Fruit rules"
    }
};

module.exports = {
    DevilFruitDatabase,
    RARITY_CONFIG,
    DEVILFRUIT_DATABASE,
    SPECIAL_COLLECTIONS,
    RARITY_ANALYSIS
};
