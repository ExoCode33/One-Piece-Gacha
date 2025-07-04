// ═══════════════════════════════════════════════════════════════════
//                    ONE PIECE DEVIL FRUIT COUNTER SYSTEM
//                         Based on Canon Lore Analysis
// ═══════════════════════════════════════════════════════════════════

const ELEMENT_TYPES = {
    // PRIMARY ELEMENTS (Logia-based)
    FIRE: 'fire',
    ICE: 'ice', 
    LIGHTNING: 'lightning',
    LIGHT: 'light',
    DARKNESS: 'darkness',
    MAGMA: 'magma',
    SAND: 'sand',
    GAS: 'gas',
    SMOKE: 'smoke',
    
    // PHYSICAL TYPES
    RUBBER: 'rubber',
    METAL: 'metal',
    STONE: 'stone',
    
    // SPECIAL FORCES
    GRAVITY: 'gravity',
    VIBRATION: 'vibration',
    SPATIAL: 'spatial',
    SOUL: 'soul',
    
    // BIOLOGICAL
    POISON: 'poison',
    HEALING: 'healing',
    
    // TRANSFORMATION
    ZOAN_BEAST: 'zoan_beast',
    ZOAN_ANCIENT: 'zoan_ancient', 
    ZOAN_MYTHICAL: 'zoan_mythical'
};

// CANON COUNTER RELATIONSHIPS based on One Piece lore
const COUNTER_MATRIX = {
    // FIRE COUNTERS (Mera Mera no Mi)
    [ELEMENT_TYPES.FIRE]: {
        strongAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.GAS, ELEMENT_TYPES.SMOKE],
        weakAgainst: [ELEMENT_TYPES.MAGMA, ELEMENT_TYPES.SAND], // Magma > Fire (Ace vs Akainu), Sand absorbs fire
        neutralAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT, ELEMENT_TYPES.RUBBER]
    },
    
    // ICE COUNTERS (Hie Hie no Mi)
    [ELEMENT_TYPES.ICE]: {
        strongAgainst: [ELEMENT_TYPES.GAS, ELEMENT_TYPES.POISON],
        weakAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.MAGMA], // Heat melts ice
        neutralAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT]
    },
    
    // LIGHTNING COUNTERS (Goro Goro no Mi)
    [ELEMENT_TYPES.LIGHTNING]: {
        strongAgainst: [ELEMENT_TYPES.METAL, ELEMENT_TYPES.GAS],
        weakAgainst: [ELEMENT_TYPES.RUBBER], // Rubber insulates (Luffy vs Enel)
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.LIGHT]
    },
    
    // LIGHT COUNTERS (Pika Pika no Mi)
    [ELEMENT_TYPES.LIGHT]: {
        strongAgainst: [ELEMENT_TYPES.DARKNESS, ELEMENT_TYPES.ICE],
        weakAgainst: [ELEMENT_TYPES.RUBBER], // Rubber can reflect light
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    // DARKNESS COUNTERS (Yami Yami no Mi)
    [ELEMENT_TYPES.DARKNESS]: {
        strongAgainst: [ELEMENT_TYPES.LIGHT, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.FIRE], // Absorbs energy
        weakAgainst: [ELEMENT_TYPES.VIBRATION], // Physical attacks bypass darkness
        neutralAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.MAGMA]
    },
    
    // MAGMA COUNTERS (Magu Magu no Mi)  
    [ELEMENT_TYPES.MAGMA]: {
        strongAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.METAL], // Superior heat
        weakAgainst: [ELEMENT_TYPES.VIBRATION], // Vibrations can disrupt magma
        neutralAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.DARKNESS]
    },
    
    // SAND COUNTERS (Suna Suna no Mi)
    [ELEMENT_TYPES.SAND]: {
        strongAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.POISON], // Absorbs fire, filters poison
        weakAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.VIBRATION], // Glass formation, disruption
        neutralAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.GAS]
    },
    
    // RUBBER COUNTERS (Gomu Gomu no Mi / Nika)
    [ELEMENT_TYPES.RUBBER]: {
        strongAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT], // Insulation, reflection
        weakAgainst: [ELEMENT_TYPES.METAL, ELEMENT_TYPES.POISON], // Sharp objects, toxins
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE]
    },
    
    // VIBRATION COUNTERS (Gura Gura no Mi)
    [ELEMENT_TYPES.VIBRATION]: {
        strongAgainst: [ELEMENT_TYPES.STONE, ELEMENT_TYPES.METAL, ELEMENT_TYPES.MAGMA], // Shatters solid matter
        weakAgainst: [ELEMENT_TYPES.RUBBER, ELEMENT_TYPES.GAS], // Flexible materials absorb vibration
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    // GRAVITY COUNTERS (Zushi Zushi no Mi)
    [ELEMENT_TYPES.GRAVITY]: {
        strongAgainst: [ELEMENT_TYPES.LIGHT, ELEMENT_TYPES.GAS, ELEMENT_TYPES.SMOKE], // Controls matter
        weakAgainst: [ELEMENT_TYPES.SPATIAL], // Space manipulation counters gravity
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    // SPATIAL COUNTERS (Ope Ope no Mi)
    [ELEMENT_TYPES.SPATIAL]: {
        strongAgainst: [ELEMENT_TYPES.GRAVITY, ELEMENT_TYPES.METAL, ELEMENT_TYPES.STONE], // Cuts through anything
        weakAgainst: [ELEMENT_TYPES.SOUL], // Soul manipulation transcends physical space
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT]
    },
    
    // POISON COUNTERS (Doku Doku no Mi)
    [ELEMENT_TYPES.POISON]: {
        strongAgainst: [ELEMENT_TYPES.HEALING, ELEMENT_TYPES.ZOAN_BEAST], // Toxins overcome healing, affect biology
        weakAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.SAND], // Heat burns toxins, cold slows, sand filters
        neutralAgainst: [ELEMENT_TYPES.METAL, ELEMENT_TYPES.STONE]
    },
    
    // SOUL COUNTERS (Soru Soru no Mi)
    [ELEMENT_TYPES.SOUL]: {
        strongAgainst: [ELEMENT_TYPES.SPATIAL, ELEMENT_TYPES.ZOAN_BEAST, ELEMENT_TYPES.ZOAN_ANCIENT], // Soul > Matter
        weakAgainst: [ELEMENT_TYPES.ZOAN_MYTHICAL], // Mythical creatures have spiritual resistance
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    // ZOAN COUNTERS
    [ELEMENT_TYPES.ZOAN_BEAST]: {
        strongAgainst: [ELEMENT_TYPES.GAS, ELEMENT_TYPES.SMOKE], // Animal instincts, enhanced senses
        weakAgainst: [ELEMENT_TYPES.POISON, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.FIRE], // Biological vulnerability
        neutralAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.METAL]
    },
    
    [ELEMENT_TYPES.ZOAN_ANCIENT]: {
        strongAgainst: [ELEMENT_TYPES.ZOAN_BEAST, ELEMENT_TYPES.STONE], // Superior physicality
        weakAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.SPATIAL], // Modern powers vs ancient
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE]
    },
    
    [ELEMENT_TYPES.ZOAN_MYTHICAL]: {
        strongAgainst: [ELEMENT_TYPES.SOUL, ELEMENT_TYPES.DARKNESS, ELEMENT_TYPES.POISON], // Divine/legendary resistance
        weakAgainst: [ELEMENT_TYPES.VIBRATION], // Physical force affects even legends
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT]
    }
};

// DEVIL FRUIT ELEMENT MAPPING - Updated for your 150-fruit database
const DEVIL_FRUIT_ELEMENTS = {
    // LOGIA FRUITS
    'fruit_002': ELEMENT_TYPES.FIRE,           // Mera Mera no Mi
    'fruit_021': ELEMENT_TYPES.ICE,            // Hie Hie no Mi  
    'fruit_004': ELEMENT_TYPES.LIGHT,          // Pika Pika no Mi
    'fruit_020': ELEMENT_TYPES.LIGHTNING,      // Goro Goro no Mi
    'fruit_003': ELEMENT_TYPES.MAGMA,          // Magu Magu no Mi
    'fruit_005': ELEMENT_TYPES.DARKNESS,       // Yami Yami no Mi
    'fruit_019': ELEMENT_TYPES.SAND,           // Suna Suna no Mi
    'fruit_057': ELEMENT_TYPES.GAS,            // Gasu Gasu no Mi
    'fruit_058': ELEMENT_TYPES.GAS,            // Numa Numa no Mi (swamp)
    'fruit_059': ELEMENT_TYPES.ICE,            // Yuki Yuki no Mi (snow)
    
    // SPECIAL PARAMECIA
    'fruit_006': ELEMENT_TYPES.VIBRATION,      // Gura Gura no Mi
    'fruit_007': ELEMENT_TYPES.SPATIAL,        // Ope Ope no Mi
    'fruit_027': ELEMENT_TYPES.SOUL,           // Soru Soru no Mi
    'fruit_010': ELEMENT_TYPES.POISON,         // Doku Doku no Mi
    'fruit_076': ELEMENT_TYPES.SPATIAL,        // Nikyu Nikyu no Mi (paw)
    
    // RUBBER/NIKA
    'fruit_001': ELEMENT_TYPES.RUBBER,         // Gomu Gomu no Mi
    'fruit_026': ELEMENT_TYPES.RUBBER,         // Hito Hito no Mi Model: Nika
    
    // ZOAN CATEGORIES
    'fruit_054': ELEMENT_TYPES.ZOAN_BEAST,     // Hito Hito no Mi (Chopper)
    'fruit_045': ELEMENT_TYPES.ZOAN_BEAST,     // Neko Neko no Mi, Model: Leopard
    'fruit_044': ELEMENT_TYPES.ZOAN_BEAST,     // Inu Inu no Mi, Model: Wolf
    'fruit_047': ELEMENT_TYPES.ZOAN_BEAST,     // Tori Tori no Mi, Model: Falcon
    'fruit_046': ELEMENT_TYPES.ZOAN_BEAST,     // Ushi Ushi no Mi, Model: Bison
    'fruit_050': ELEMENT_TYPES.ZOAN_BEAST,     // Zou Zou no Mi
    'fruit_051': ELEMENT_TYPES.ZOAN_BEAST,     // Uma Uma no Mi
    'fruit_055': ELEMENT_TYPES.ZOAN_BEAST,     // Inu Inu no Mi, Model: Dachshund
    'fruit_056': ELEMENT_TYPES.ZOAN_BEAST,     // Ushi Ushi no Mi, Model: Giraffe
    'fruit_048': ELEMENT_TYPES.ZOAN_BEAST,     // Hebi Hebi no Mi, Model: Anaconda
    'fruit_049': ELEMENT_TYPES.ZOAN_BEAST,     // Hebi Hebi no Mi, Model: King Cobra
    'fruit_052': ELEMENT_TYPES.ZOAN_BEAST,     // Sara Sara no Mi, Model: Axolotl
    'fruit_053': ELEMENT_TYPES.ZOAN_BEAST,     // Kumo Kumo no Mi
    
    // MYTHICAL ZOANS
    'fruit_025': ELEMENT_TYPES.ZOAN_MYTHICAL,  // Uo Uo no Mi, Model: Seiryu (Kaido)
    'fruit_024': ELEMENT_TYPES.ZOAN_MYTHICAL,  // Tori Tori no Mi, Model: Phoenix
    'fruit_061': ELEMENT_TYPES.ZOAN_MYTHICAL,  // Inu Inu no Mi, Model: Okuchi no Makami
    'fruit_062': ELEMENT_TYPES.ZOAN_MYTHICAL,  // Hebi Hebi no Mi, Model: Yamata no Orochi
    'fruit_060': ELEMENT_TYPES.ZOAN_MYTHICAL,  // Hito Hito no Mi, Model: Daibutsu
    
    // PARAMECIA FRUITS - MAJOR ONES
    'fruit_015': ELEMENT_TYPES.GRAVITY,        // Kilo Kilo no Mi (weight)
    'fruit_014': ELEMENT_TYPES.RUBBER,         // Sube Sube no Mi (slip)
    'fruit_012': ELEMENT_TYPES.FIRE,           // Bomu Bomu no Mi (explosions)
    'fruit_016': ELEMENT_TYPES.ZOAN_BEAST,     // Hana Hana no Mi (biological)
    'fruit_013': ELEMENT_TYPES.METAL,          // Bara Bara no Mi (splitting)
    'fruit_017': ELEMENT_TYPES.STONE,          // Doru Doru no Mi (wax)
    'fruit_075': ELEMENT_TYPES.SOUL,           // Mero Mero no Mi (love)
    'fruit_008': ELEMENT_TYPES.METAL,          // Ito Ito no Mi (string)
    'fruit_009': ELEMENT_TYPES.SOUL,           // Yomi Yomi no Mi (soul)
    'fruit_011': ELEMENT_TYPES.SPATIAL,        // Bari Bari no Mi (barriers)
    'fruit_022': ELEMENT_TYPES.POISON,         // Horu Horu no Mi (hormones)
    'fruit_023': ELEMENT_TYPES.RUBBER,         // Mochi Mochi no Mi (flexible)
    'fruit_028': ELEMENT_TYPES.POISON,         // Awa Awa no Mi (soap)
    'fruit_030': ELEMENT_TYPES.SOUL,           // Memo Memo no Mi (memory)
    'fruit_031': ELEMENT_TYPES.SOUL,           // Hobi Hobi no Mi (toy transformation)
    'fruit_032': ELEMENT_TYPES.SOUL,           // Wara Wara no Mi (voodoo)
    'fruit_034': ELEMENT_TYPES.GRAVITY,        // Ton Ton no Mi (weight)
    'fruit_035': ELEMENT_TYPES.STONE,          // Ishi Ishi no Mi (stone)
    'fruit_063': ELEMENT_TYPES.SPATIAL,        // Nagi Nagi no Mi (sound/silence)
    'fruit_064': ELEMENT_TYPES.SPATIAL,        // Mato Mato no Mi (target)
    'fruit_067': ELEMENT_TYPES.SPATIAL,        // Shiro Shiro no Mi (castle)
    'fruit_068': ELEMENT_TYPES.METAL,          // Ori Ori no Mi (cage)
    'fruit_072': ELEMENT_TYPES.GRAVITY,        // Fuwa Fuwa no Mi (float)
    'fruit_074': ELEMENT_TYPES.LIGHT,          // Suke Suke no Mi (invisibility)
    'fruit_078': ELEMENT_TYPES.DARKNESS,       // Kage Kage no Mi (shadows)
    'fruit_080': ELEMENT_TYPES.METAL,          // Buki Buki no Mi (weapons)
    'fruit_018': ELEMENT_TYPES.METAL,          // Baku Baku no Mi (eating/metal)
    'fruit_029': ELEMENT_TYPES.POISON,         // Beta Beta no Mi (sticky)
    'fruit_033': ELEMENT_TYPES.VIBRATION,      // Goe Goe no Mi (voice/sound waves)
    'fruit_036': ELEMENT_TYPES.SPATIAL,        // Sui Sui no Mi (swimming through solids)
    'fruit_037': ELEMENT_TYPES.GRAVITY,        // Guru Guru no Mi (spinning)
    'fruit_038': ELEMENT_TYPES.SOUL,           // Ato Ato no Mi (art/transformation)
    'fruit_039': ELEMENT_TYPES.SPATIAL,        // Buku Buku no Mi (book world)
    'fruit_040': ELEMENT_TYPES.POISON,         // Kuku Kuku no Mi (cooking/food)
    'fruit_041': ELEMENT_TYPES.METAL,          // Nui Nui no Mi (sewing/binding)
    'fruit_042': ELEMENT_TYPES.RUBBER,         // Jake Jake no Mi (jacket/flexibility)
    'fruit_043': ELEMENT_TYPES.METAL,          // Kama Kama no Mi (sickle/cutting)
    'fruit_065': ELEMENT_TYPES.RUBBER,         // Beri Beri no Mi (sphere/round)
    'fruit_066': ELEMENT_TYPES.GRAVITY,        // Mini Mini no Mi (size manipulation)
    'fruit_069': ELEMENT_TYPES.SPATIAL,        // Ami Ami no Mi (net/capture)
    'fruit_070': ELEMENT_TYPES.SOUL,           // Yomi Yomi no Mi (soul revival)
    'fruit_071': ELEMENT_TYPES.METAL,          // Gasha Gasha no Mi (combining/mechanical)
    'fruit_073': ELEMENT_TYPES.METAL,          // Kama Kama no Mi (duplicate - cutting)
    'fruit_077': ELEMENT_TYPES.SOUL,           // Hiso Hiso no Mi (whisper/communication)
    'fruit_079': ELEMENT_TYPES.SOUL,           // Yomi Yomi no Mi (duplicate - soul)
    'fruit_081': ELEMENT_TYPES.POISON,         // Iro Iro no Mi (color/paint)
    'fruit_082': ELEMENT_TYPES.SPATIAL,        // Nuke Nuke no Mi (passing through)
    'fruit_083': ELEMENT_TYPES.RUBBER,         // Lika Lika no Mi (licking/flexible)
    'fruit_084': ELEMENT_TYPES.POISON,         // Woshu Woshu no Mi (washing/cleaning)
    'fruit_085': ELEMENT_TYPES.VIBRATION,      // Goe Goe no Mi (duplicate - voice)
    'fruit_086': ELEMENT_TYPES.SOUL,           // Horo Horo no Mi (ghosts/negative spirits)
    'fruit_087': ELEMENT_TYPES.SOUL,           // Tama Tama no Mi (egg/rebirth)
    
    // SMILE FRUITS (all as basic zoan)
    'fruit_088': ELEMENT_TYPES.ZOAN_BEAST,     // Sheep SMILE
    'fruit_089': ELEMENT_TYPES.ZOAN_BEAST,     // Horse SMILE
    'fruit_090': ELEMENT_TYPES.ZOAN_BEAST,     // Lion SMILE
    'fruit_091': ELEMENT_TYPES.ZOAN_BEAST,     // Bat SMILE
    'fruit_092': ELEMENT_TYPES.ZOAN_BEAST,     // Gazelle SMILE
    'fruit_093': ELEMENT_TYPES.ZOAN_BEAST,     // Elephant SMILE
    'fruit_094': ELEMENT_TYPES.ZOAN_BEAST,     // Scorpion SMILE
    'fruit_095': ELEMENT_TYPES.ZOAN_BEAST,     // Giraffe SMILE
    'fruit_096': ELEMENT_TYPES.ZOAN_BEAST,     // Alpaca SMILE
    'fruit_097': ELEMENT_TYPES.ZOAN_BEAST,     // Hedgehog SMILE
    'fruit_098': ELEMENT_TYPES.ZOAN_BEAST,     // Hippo SMILE
    'fruit_099': ELEMENT_TYPES.ZOAN_BEAST,     // Snake SMILE
    'fruit_100': ELEMENT_TYPES.ZOAN_BEAST,     // Gorilla SMILE
    'fruit_101': ELEMENT_TYPES.ZOAN_BEAST,     // Mouse SMILE
    'fruit_102': ELEMENT_TYPES.ZOAN_BEAST,     // Elephant Trunk SMILE
    
    // Generic SMILE fruits (103-137) - all ZOAN_BEAST
    'fruit_103': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_104': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_105': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_106': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_107': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_108': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_109': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_110': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_111': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_112': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_113': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_114': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_115': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_116': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_117': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_118': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_119': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_120': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_121': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_122': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_123': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_124': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_125': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_126': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_127': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_128': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_129': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_130': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_131': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_132': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_133': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_134': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_135': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_136': ELEMENT_TYPES.ZOAN_BEAST,
    'fruit_137': ELEMENT_TYPES.ZOAN_BEAST,
    
    // Special anime/movie fruits
    'fruit_138': ELEMENT_TYPES.FIRE,           // Atsu Atsu no Mi (heat)
    'fruit_139': ELEMENT_TYPES.SPATIAL,        // Ami Ami no Mi (net)
    'fruit_140': ELEMENT_TYPES.STONE,          // Kachi Kachi no Mi (hardness)
    'fruit_141': ELEMENT_TYPES.VIBRATION,      // Goe Goe no Mi (voice)
    'fruit_142': ELEMENT_TYPES.SOUL,           // Hiso Hiso no Mi (whisper)
    'fruit_143': ELEMENT_TYPES.POISON,         // Mitsu Mitsu no Mi (honey)
    'fruit_144': ELEMENT_TYPES.SOUL,           // Nemu Nemu no Mi (sleep)
    'fruit_145': ELEMENT_TYPES.SPATIAL,        // Sui Sui no Mi (swim)
    'fruit_146': ELEMENT_TYPES.GRAVITY,        // Fuwa Fuwa no Mi (float)
    'fruit_147': ELEMENT_TYPES.METAL,          // Gasha Gasha no Mi (combine)
    'fruit_148': ELEMENT_TYPES.RUBBER,         // Mochi Mochi no Mi (special)
    'fruit_149': ELEMENT_TYPES.SPATIAL,        // Kama Kama no Mi (sickle)
    'fruit_150': ELEMENT_TYPES.RUBBER,         // Toro Toro no Mi (liquid)
};

// COMBAT EFFECTIVENESS CALCULATOR
class CombatSystem {
    static calculateEffectiveness(attackerFruitId, defenderFruitId) {
        const attackerElement = DEVIL_FRUIT_ELEMENTS[attackerFruitId];
        const defenderElement = DEVIL_FRUIT_ELEMENTS[defenderFruitId];
        
        if (!attackerElement || !defenderElement) {
            return { effectiveness: 1.0, description: 'Neutral matchup' };
        }
        
        const attackerCounters = COUNTER_MATRIX[attackerElement];
        if (!attackerCounters) {
            return { effectiveness: 1.0, description: 'Neutral matchup' };
        }
        
        // Strong advantage
        if (attackerCounters.strongAgainst.includes(defenderElement)) {
            return { 
                effectiveness: 1.5, 
                description: `${this.getElementName(attackerElement)} dominates ${this.getElementName(defenderElement)}!` 
            };
        }
        
        // Weak disadvantage  
        if (attackerCounters.weakAgainst.includes(defenderElement)) {
            return { 
                effectiveness: 0.6, 
                description: `${this.getElementName(defenderElement)} resists ${this.getElementName(attackerElement)}!` 
            };
        }
        
        // Neutral
        return { 
            effectiveness: 1.0, 
            description: 'Evenly matched powers' 
        };
    }
    
    static getElementName(element) {
        const names = {
            [ELEMENT_TYPES.FIRE]: 'Fire',
            [ELEMENT_TYPES.ICE]: 'Ice',
            [ELEMENT_TYPES.LIGHTNING]: 'Lightning',
            [ELEMENT_TYPES.LIGHT]: 'Light',
            [ELEMENT_TYPES.DARKNESS]: 'Darkness',
            [ELEMENT_TYPES.MAGMA]: 'Magma',
            [ELEMENT_TYPES.SAND]: 'Sand',
            [ELEMENT_TYPES.GAS]: 'Gas',
            [ELEMENT_TYPES.SMOKE]: 'Smoke',
            [ELEMENT_TYPES.RUBBER]: 'Rubber',
            [ELEMENT_TYPES.VIBRATION]: 'Vibration',
            [ELEMENT_TYPES.SPATIAL]: 'Space',
            [ELEMENT_TYPES.GRAVITY]: 'Gravity',
            [ELEMENT_TYPES.SOUL]: 'Soul',
            [ELEMENT_TYPES.POISON]: 'Poison',
            [ELEMENT_TYPES.HEALING]: 'Healing',
            [ELEMENT_TYPES.ZOAN_BEAST]: 'Beast',
            [ELEMENT_TYPES.ZOAN_ANCIENT]: 'Ancient Beast',
            [ELEMENT_TYPES.ZOAN_MYTHICAL]: 'Mythical Creature',
            [ELEMENT_TYPES.METAL]: 'Metal',
            [ELEMENT_TYPES.STONE]: 'Stone'
        };
        return names[element] || 'Unknown';
    }

    // Calculate base combat power from rarity
    static calculateBasePower(rarity) {
        const basePowers = {
            'common': 100,
            'uncommon': 250,
            'rare': 500,
            'epic': 1000,
            'legendary': 2500,
            'mythical': 5000,
            'omnipotent': 10000
        };
        return basePowers[rarity] || 100;
    }

    // Get level multiplier for combat power
    static getLevelMultiplier(level) {
        if (level <= 0) return 1.0;
        return 1.0 + (level * 0.1); // 10% increase per level
    }

    // Get level rank description
    static getLevelRank(level) {
        if (level >= 50) return 'Yonko';
        if (level >= 40) return 'Admiral';
        if (level >= 30) return 'Vice Admiral';
        if (level >= 20) return 'Rear Admiral';
        if (level >= 15) return 'Commodore';
        if (level >= 10) return 'Captain';
        if (level >= 5) return 'Lieutenant';
        if (level >= 1) return 'Ensign';
        return 'Recruit';
    }

    // Get power rank based on total combat power
    static getPowerRank(totalPower) {
        if (totalPower >= 100000) return 'World Destroyer';
        if (totalPower >= 50000) return 'Yonko Level';
        if (totalPower >= 25000) return 'Admiral Level';
        if (totalPower >= 10000) return 'Vice Admiral Level';
        if (totalPower >= 5000) return 'Elite Captain';
        if (totalPower >= 2500) return 'Captain Level';
        if (totalPower >= 1000) return 'Officer Level';
        if (totalPower >= 500) return 'Soldier Level';
        if (totalPower >= 100) return 'Rookie Level';
        return 'Beginner';
    }

    // Calculate combat advantage in battles
    static calculateBattleAdvantage(attackerFruitId, defenderFruitId) {
        const result = this.calculateEffectiveness(attackerFruitId, defenderFruitId);
        return {
            multiplier: result.effectiveness,
            description: result.description,
            advantage: result.effectiveness > 1.2 ? 'strong' : 
                      result.effectiveness < 0.8 ? 'weak' : 'neutral'
        };
    }

    // Get element weaknesses for strategy
    static getElementWeaknesses(element) {
        const counters = COUNTER_MATRIX[element];
        if (!counters) return [];
        
        return counters.weakAgainst.map(weakness => this.getElementName(weakness));
    }

    // Get element strengths for strategy
    static getElementStrengths(element) {
        const counters = COUNTER_MATRIX[element];
        if (!counters) return [];
        
        return counters.strongAgainst.map(strength => this.getElementName(strength));
    }
}

module.exports = {
    ELEMENT_TYPES,
    COUNTER_MATRIX,
    DEVIL_FRUIT_ELEMENTS,
    CombatSystem
};
