// COMPLETE DEVIL FRUIT ELEMENT MAPPING - All 150 Fruits
// Add this to your src/data/counter-system.js

const DEVIL_FRUIT_ELEMENTS = {
    // COMMON FRUITS (1-50)
    'fruit_001': 'fire',           // Bomu Bomu no Mi (explosions = fire)
    'fruit_002': 'metal',          // Bara Bara no Mi (cutting/splitting)
    'fruit_003': 'rubber',         // Sube Sube no Mi (slippery)
    'fruit_004': 'gravity',        // Kilo Kilo no Mi (weight)
    'fruit_005': 'stone',          // Doru Doru no Mi (wax hardens)
    'fruit_006': 'metal',          // Baku Baku no Mi (eating/incorporating)
    'fruit_007': 'metal',          // Ori Ori no Mi (iron bonds)
    'fruit_008': 'rubber',         // Bane Bane no Mi (springs)
    'fruit_009': 'spatial',        // Noro Noro no Mi (slowing)
    'fruit_010': 'spatial',        // Doa Doa no Mi (doors)
    'fruit_011': 'poison',         // Awa Awa no Mi (soap/cleaning)
    'fruit_012': 'rubber',         // Beri Beri no Mi (orbs)
    'fruit_013': 'metal',          // Sabi Sabi no Mi (rust)
    'fruit_014': 'metal',          // Shari Shari no Mi (wheels)
    'fruit_015': 'soul',           // Yomi Yomi no Mi (soul)
    'fruit_016': 'darkness',       // Kage Kage no Mi (shadows)
    'fruit_017': 'soul',           // Horo Horo no Mi (ghosts)
    'fruit_018': 'light',          // Suke Suke no Mi (invisibility)
    'fruit_019': 'metal',          // Choki Choki no Mi (scissors)
    'fruit_020': 'poison',         // Woshu Woshu no Mi (washing)
    'fruit_021': 'gravity',        // Fuwa Fuwa no Mi (float)
    'fruit_022': 'spatial',        // Mato Mato no Mi (marking)
    'fruit_023': 'metal',          // Buki Buki no Mi (weapons)
    'fruit_024': 'vibration',      // Guru Guru no Mi (spinning)
    'fruit_025': 'poison',         // Beta Beta no Mi (sticky)
    'fruit_026': 'rubber',         // Hira Hira no Mi (flags)
    'fruit_027': 'stone',          // Ishi Ishi no Mi (stone)
    'fruit_028': 'metal',          // Nui Nui no Mi (stitching)
    'fruit_029': 'soul',           // Giro Giro no Mi (sight/mind)
    'fruit_030': 'soul',           // Ato Ato no Mi (art transformation)
    'fruit_031': 'rubber',         // Jake Jake no Mi (jacket)
    'fruit_032': 'spatial',        // Mira Mira no Mi (mirrors)
    'fruit_033': 'stone',          // Bisu Bisu no Mi (hard biscuits)
    'fruit_034': 'poison',         // Pero Pero no Mi (candy)
    'fruit_035': 'poison',         // Bata Bata no Mi (butter)
    'fruit_036': 'poison',         // Shibo Shibo no Mi (moisture)
    'fruit_037': 'soul',           // Memo Memo no Mi (memory)
    'fruit_038': 'spatial',        // Buku Buku no Mi (books)
    'fruit_039': 'poison',         // Kuri Kuri no Mi (cream)
    'fruit_040': 'zoan_beast',     // Tama Tama no Mi (egg evolution)
    'fruit_041': 'zoan_beast',     // Kame Kame no Mi (turtle)
    'fruit_042': 'zoan_beast',     // Mushi Mushi no Mi, Model: Kabutomushi
    'fruit_043': 'zoan_beast',     // Mushi Mushi no Mi, Model: Suzumebachi
    'fruit_044': 'spatial',        // Poke Poke no Mi (pockets)
    'fruit_045': 'poison',         // Kuku Kuku no Mi (cooking)
    'fruit_046': 'metal',          // Gocha Gocha no Mi (merging)
    'fruit_047': 'soul',           // Hiso Hiso no Mi (animal communication)
    'fruit_048': 'gravity',        // Mini Mini no Mi (shrinking)
    'fruit_049': 'gravity',        // Ton Ton no Mi (weight)
    'fruit_050': 'soul',           // Mero Mero no Mi (love/stone)

    // UNCOMMON FRUITS (51-75)
    'fruit_051': 'rubber',         // Gomu Gomu no Mi
    'fruit_052': 'zoan_beast',     // Hana Hana no Mi (body parts = biological)
    'fruit_053': 'spatial',        // Bari Bari no Mi (barriers)
    'fruit_054': 'spatial',        // Nagi Nagi no Mi (sound barriers)
    'fruit_055': 'soul',           // Hobi Hobi no Mi (toy transformation)
    'fruit_056': 'spatial',        // Sui Sui no Mi (swimming through solids)
    'fruit_057': 'zoan_beast',     // Zou Zou no Mi (elephant)
    'fruit_058': 'zoan_beast',     // Inu Inu no Mi, Model: Wolf
    'fruit_059': 'zoan_beast',     // Neko Neko no Mi, Model: Leopard
    'fruit_060': 'zoan_beast',     // Ushi Ushi no Mi, Model: Bison
    'fruit_061': 'zoan_beast',     // Ushi Ushi no Mi, Model: Giraffe
    'fruit_062': 'zoan_beast',     // Inu Inu no Mi, Model: Jackal
    'fruit_063': 'zoan_beast',     // Tori Tori no Mi, Model: Falcon
    'fruit_064': 'zoan_beast',     // Mogu Mogu no Mi (mole)
    'fruit_065': 'zoan_beast',     // Inu Inu no Mi, Model: Dachshund
    'fruit_066': 'zoan_beast',     // Sara Sara no Mi, Model: Axolotl
    'fruit_067': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Allosaurus
    'fruit_068': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Spinosaurus
    'fruit_069': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Pteranodon
    'fruit_070': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Brachiosaurus
    'fruit_071': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Mammoth
    'fruit_072': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Triceratops
    'fruit_073': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Pachycephalosaurus
    'fruit_074': 'zoan_ancient',   // Ryu Ryu no Mi, Model: Saber-tooth Tiger
    'fruit_075': 'zoan_ancient',   // Kumo Kumo no Mi, Model: Rosamygale Grauvogeli

    // RARE FRUITS (76-91) - Logia and strong Paramecia
    'fruit_076': 'gas',            // Moku Moku no Mi (smoke)
    'fruit_077': 'fire',           // Mera Mera no Mi
    'fruit_078': 'sand',           // Suna Suna no Mi
    'fruit_079': 'lightning',      // Goro Goro no Mi
    'fruit_080': 'ice',            // Hie Hie no Mi
    'fruit_081': 'darkness',       // Yami Yami no Mi
    'fruit_082': 'light',          // Pika Pika no Mi
    'fruit_083': 'magma',          // Magu Magu no Mi
    'fruit_084': 'poison',         // Numa Numa no Mi (swamp)
    'fruit_085': 'gas',            // Gasu Gasu no Mi
    'fruit_086': 'ice',            // Yuki Yuki no Mi (snow)
    'fruit_087': 'zoan_beast',     // Mori Mori no Mi (forest/plants)
    'fruit_088': 'soul',           // Soru Soru no Mi
    'fruit_089': 'rubber',         // Mochi Mochi no Mi (special paramecia)
    'fruit_090': 'spatial',        // Ope Ope no Mi
    'fruit_091': 'vibration',      // Gura Gura no Mi

    // EPIC FRUITS (92-100)
    'fruit_092': 'zoan_mythical',  // Hito Hito no Mi, Model: Daibutsu
    'fruit_093': 'gravity',        // Zushi Zushi no Mi
    'fruit_094': 'spatial',        // Nikyu Nikyu no Mi (repel)
    'fruit_095': 'poison',         // Doku Doku no Mi
    'fruit_096': 'soul',           // Horm Horm no Mi (hormones)
    'fruit_097': 'soul',           // Chyu Chyu no Mi (healing)
    'fruit_098': 'spatial',        // Toki Toki no Mi (time)
    'fruit_099': 'soul',           // Kibi Kibi no Mi (animal control)
    'fruit_100': 'spatial',        // Juku Juku no Mi (aging)

    // LEGENDARY FRUITS (101-109)
    'fruit_101': 'zoan_mythical',  // Uo Uo no Mi, Model: Seiryu
    'fruit_102': 'zoan_mythical',  // Inu Inu no Mi, Model: Okuchi no Makami
    'fruit_103': 'zoan_mythical',  // Hebi Hebi no Mi, Model: Yamata-no-Orochi
    'fruit_104': 'zoan_mythical',  // Tori Tori no Mi, Model: Phoenix
    'fruit_105': 'zoan_mythical',  // Hito Hito no Mi, Model: Onyudo
    'fruit_106': 'zoan_mythical',  // Inu Inu no Mi, Model: Nine-Tailed Fox
    'fruit_107': 'zoan_mythical',  // Uma Uma no Mi, Model: Pegasus
    'fruit_108': 'zoan_mythical',  // Batto Batto no Mi, Model: Vampire
    'fruit_109': 'ice',            // Mizu Mizu no Mi (theoretical water logia)

    // MYTHICAL FRUITS (110-112)
    'fruit_110': 'zoan_mythical',  // Hito Hito no Mi, Model: Nika
    'fruit_111': 'zoan_mythical',  // Hito Hito no Mi, Model: Raijin
    'fruit_112': 'zoan_mythical',  // Hito Hito no Mi, Model: Susanoo

    // OMNIPOTENT FRUITS (113-114)
    'fruit_113': 'soul',           // Yume Yume no Mi (dreams/reality)
    'fruit_114': 'zoan_mythical',  // Kami Kami no Mi (deity)

    // THEORETICAL/ADDITIONAL FRUITS (115-150)
    'fruit_115': 'gas',            // Kaze Kaze no Mi (wind)
    'fruit_116': 'lightning',      // Denki Denki no Mi (electricity)
    'fruit_117': 'metal',          // Tetsu Tetsu no Mi (steel)
    'fruit_118': 'metal',          // Kin Kin no Mi (gold)
    'fruit_119': 'vibration',      // Basu Basu no Mi (sound/vibration)
    'fruit_120': 'ice',            // Rei Rei no Mi (temperature)
    'fruit_121': 'gas',            // Kuki Kuki no Mi (air)
    'fruit_122': 'stone',          // Tsuchi Tsuchi no Mi (earth)
    'fruit_123': 'metal',          // Kori Kori no Mi (crystal)
    'fruit_124': 'soul',           // Shi Shi no Mi (life/death)
    'fruit_125': 'spatial',        // Jikan Jikan no Mi (time)
    'fruit_126': 'spatial',        // Kuukan Kuukan no Mi (space)
    'fruit_127': 'poison',         // Chi Chi no Mi (blood)
    'fruit_128': 'soul',           // Sei Sei no Mi (life force)
    'fruit_129': 'soul',           // Kokoro Kokoro no Mi (emotions)
    'fruit_130': 'soul',           // Gensou Gensou no Mi (illusions)
    'fruit_131': 'vibration',      // Rasen Rasen no Mi (spirals)
    'fruit_132': 'spatial',        // Henka Henka no Mi (transformation)
    'fruit_133': 'metal',          // Bunretsu Bunretsu no Mi (splitting)
    'fruit_134': 'spatial',        // Yuugou Yuugou no Mi (fusion)
    'fruit_135': 'vibration',      // Zouryoku Zouryoku no Mi (amplify)
    'fruit_136': 'fire',           // Nenshou Nenshou no Mi (ignition)
    'fruit_137': 'spatial',        // Touka Touka no Mi (phase)
    'fruit_138': 'darkness',       // Kuro Kuro no Mi (void)
    'fruit_139': 'light',          // Shiro Shiro no Mi (pure light)
    'fruit_140': 'spatial',        // Mugen Mugen no Mi (infinite)
    'fruit_141': 'spatial',        // Zero Zero no Mi (zero)
    'fruit_142': 'zoan_mythical',  // Kami Kami no Mi, Model: Amaterasu
    'fruit_143': 'zoan_mythical',  // Kami Kami no Mi, Model: Tsukuyomi
    'fruit_144': 'zoan_mythical',  // Akuma Akuma no Mi (demon)
    'fruit_145': 'zoan_mythical',  // Tenshi Tenshi no Mi (angel)
    'fruit_146': 'zoan_mythical',  // Ryuu Ryuu no Mi, Model: Eastern Dragon
    'fruit_147': 'zoan_mythical',  // Tora Tora no Mi, Model: White Tiger
    'fruit_148': 'zoan_mythical',  // Kitsune Kitsune no Mi, Model: Kyubi
    'fruit_149': 'zoan_mythical',  // Shinigami Shinigami no Mi (death god)
    'fruit_150': 'spatial'         // Sekai Sekai no Mi (world control)
};

// ENHANCED ELEMENT MAPPING
const ELEMENT_TYPES = {
    // Physical Elements
    FIRE: 'fire',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    LIGHT: 'light',
    DARKNESS: 'darkness',
    MAGMA: 'magma',
    SAND: 'sand',
    GAS: 'gas',
    
    // Material Types
    RUBBER: 'rubber',
    METAL: 'metal',
    STONE: 'stone',
    
    // Force Types
    GRAVITY: 'gravity',
    VIBRATION: 'vibration',
    SPATIAL: 'spatial',
    
    // Mystical Types
    SOUL: 'soul',
    POISON: 'poison',
    
    // Biological Types
    ZOAN_BEAST: 'zoan_beast',
    ZOAN_ANCIENT: 'zoan_ancient',
    ZOAN_MYTHICAL: 'zoan_mythical'
};

// ENHANCED COUNTER MATRIX
const COUNTER_MATRIX = {
    [ELEMENT_TYPES.FIRE]: {
        strongAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.GAS, ELEMENT_TYPES.ZOAN_BEAST],
        weakAgainst: [ELEMENT_TYPES.MAGMA, ELEMENT_TYPES.SAND],
        neutralAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT, ELEMENT_TYPES.RUBBER]
    },
    
    [ELEMENT_TYPES.ICE]: {
        strongAgainst: [ELEMENT_TYPES.GAS, ELEMENT_TYPES.POISON, ELEMENT_TYPES.ZOAN_BEAST],
        weakAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.MAGMA],
        neutralAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT]
    },
    
    [ELEMENT_TYPES.LIGHTNING]: {
        strongAgainst: [ELEMENT_TYPES.METAL, ELEMENT_TYPES.GAS],
        weakAgainst: [ELEMENT_TYPES.RUBBER],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.LIGHT]
    },
    
    [ELEMENT_TYPES.LIGHT]: {
        strongAgainst: [ELEMENT_TYPES.DARKNESS, ELEMENT_TYPES.ICE],
        weakAgainst: [ELEMENT_TYPES.RUBBER],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    [ELEMENT_TYPES.DARKNESS]: {
        strongAgainst: [ELEMENT_TYPES.LIGHT, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.FIRE],
        weakAgainst: [ELEMENT_TYPES.VIBRATION],
        neutralAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.MAGMA]
    },
    
    [ELEMENT_TYPES.MAGMA]: {
        strongAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.METAL],
        weakAgainst: [ELEMENT_TYPES.VIBRATION],
        neutralAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.DARKNESS]
    },
    
    [ELEMENT_TYPES.SAND]: {
        strongAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.POISON],
        weakAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.VIBRATION],
        neutralAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.GAS]
    },
    
    [ELEMENT_TYPES.RUBBER]: {
        strongAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT],
        weakAgainst: [ELEMENT_TYPES.METAL, ELEMENT_TYPES.POISON],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE]
    },
    
    [ELEMENT_TYPES.VIBRATION]: {
        strongAgainst: [ELEMENT_TYPES.STONE, ELEMENT_TYPES.METAL, ELEMENT_TYPES.MAGMA],
        weakAgainst: [ELEMENT_TYPES.RUBBER, ELEMENT_TYPES.GAS],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    [ELEMENT_TYPES.GRAVITY]: {
        strongAgainst: [ELEMENT_TYPES.LIGHT, ELEMENT_TYPES.GAS],
        weakAgainst: [ELEMENT_TYPES.SPATIAL],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    [ELEMENT_TYPES.SPATIAL]: {
        strongAgainst: [ELEMENT_TYPES.GRAVITY, ELEMENT_TYPES.METAL, ELEMENT_TYPES.STONE],
        weakAgainst: [ELEMENT_TYPES.SOUL],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT]
    },
    
    [ELEMENT_TYPES.POISON]: {
        strongAgainst: [ELEMENT_TYPES.ZOAN_BEAST],
        weakAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.SAND],
        neutralAgainst: [ELEMENT_TYPES.METAL, ELEMENT_TYPES.STONE]
    },
    
    [ELEMENT_TYPES.SOUL]: {
        strongAgainst: [ELEMENT_TYPES.SPATIAL, ELEMENT_TYPES.ZOAN_BEAST, ELEMENT_TYPES.ZOAN_ANCIENT],
        weakAgainst: [ELEMENT_TYPES.ZOAN_MYTHICAL],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING]
    },
    
    [ELEMENT_TYPES.ZOAN_BEAST]: {
        strongAgainst: [ELEMENT_TYPES.GAS],
        weakAgainst: [ELEMENT_TYPES.POISON, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.FIRE],
        neutralAgainst: [ELEMENT_TYPES.ICE, ELEMENT_TYPES.METAL]
    },
    
    [ELEMENT_TYPES.ZOAN_ANCIENT]: {
        strongAgainst: [ELEMENT_TYPES.ZOAN_BEAST, ELEMENT_TYPES.STONE],
        weakAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.SPATIAL],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE]
    },
    
    [ELEMENT_TYPES.ZOAN_MYTHICAL]: {
        strongAgainst: [ELEMENT_TYPES.SOUL, ELEMENT_TYPES.DARKNESS, ELEMENT_TYPES.POISON],
        weakAgainst: [ELEMENT_TYPES.VIBRATION],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.LIGHT]
    },
    
    [ELEMENT_TYPES.METAL]: {
        strongAgainst: [ELEMENT_TYPES.STONE],
        weakAgainst: [ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.MAGMA, ELEMENT_TYPES.VIBRATION],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE]
    },
    
    [ELEMENT_TYPES.STONE]: {
        strongAgainst: [ELEMENT_TYPES.GAS],
        weakAgainst: [ELEMENT_TYPES.VIBRATION, ELEMENT_TYPES.SPATIAL, ELEMENT_TYPES.METAL],
        neutralAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE]
    },
    
    [ELEMENT_TYPES.GAS]: {
        strongAgainst: [],
        weakAgainst: [ELEMENT_TYPES.FIRE, ELEMENT_TYPES.ICE, ELEMENT_TYPES.LIGHTNING, ELEMENT_TYPES.ZOAN_BEAST, ELEMENT_TYPES.STONE],
        neutralAgainst: [ELEMENT_TYPES.RUBBER, ELEMENT_TYPES.POISON]
    }
};

module.exports = {
    ELEMENT_TYPES,
    COUNTER_MATRIX,
    DEVIL_FRUIT_ELEMENTS,
    CombatSystem: {
        calculateEffectiveness: (attackerFruitId, defenderFruitId) => {
            const attackerElement = DEVIL_FRUIT_ELEMENTS[attackerFruitId];
            const defenderElement = DEVIL_FRUIT_ELEMENTS[defenderFruitId];
            
            if (!attackerElement || !defenderElement) {
                return { effectiveness: 1.0, description: 'Normal effectiveness' };
            }
            
            const attackerCounters = COUNTER_MATRIX[attackerElement];
            if (!attackerCounters) {
                return { effectiveness: 1.0, description: 'Normal effectiveness' };
            }
            
            if (attackerCounters.strongAgainst.includes(defenderElement)) {
                return { 
                    effectiveness: 1.5, 
                    description: 'SUPER EFFECTIVE!'
                };
            }
            
            if (attackerCounters.weakAgainst.includes(defenderElement)) {
                return { 
                    effectiveness: 0.6, 
                    description: 'NOT VERY EFFECTIVE'
                };
            }
            
            return { 
                effectiveness: 1.0, 
                description: 'Normal effectiveness'
            };
        }
    }
};
