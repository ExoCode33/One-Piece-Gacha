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

// DEVIL FRUIT ELEMENT MAPPING - COMPLETE WITH ALL FRUITS
const DEVIL_FRUIT_ELEMENTS = {
    // LOGIA FRUITS
    'mera_mera_001': ELEMENT_TYPES.FIRE,           // Ace's Fire
    'hie_hie_001': ELEMENT_TYPES.ICE,             // Aokiji's Ice  
    'pika_pika_001': ELEMENT_TYPES.LIGHT,         // Kizaru's Light
    'goro_goro_001': ELEMENT_TYPES.LIGHTNING,     // Enel's Lightning
    'magu_magu_001': ELEMENT_TYPES.MAGMA,         // Akainu's Magma
    'yami_yami_001': ELEMENT_TYPES.DARKNESS,      // Blackbeard's Darkness
    'suna_suna_001': ELEMENT_TYPES.SAND,          // Crocodile's Sand
    'gasu_gasu_001': ELEMENT_TYPES.GAS,           // Caesar's Gas
    
    // SPECIAL PARAMECIA
    'gura_gura_001': ELEMENT_TYPES.VIBRATION,     // Whitebeard's Earthquake
    'ope_ope_001': ELEMENT_TYPES.SPATIAL,         // Law's Room
    'zushi_zushi_001': ELEMENT_TYPES.GRAVITY,     // Fujitora's Gravity
    'soru_soru_001': ELEMENT_TYPES.SOUL,          // Big Mom's Soul
    'doku_doku_001': ELEMENT_TYPES.POISON,        // Magellan's Poison
    'nikyu_nikyu_001': ELEMENT_TYPES.SPATIAL,     // Kuma's Paw (space manipulation)
    
    // RUBBER/NIKA
    'hito_hito_001': ELEMENT_TYPES.RUBBER,        // Luffy's Rubber/Nika
    'gomu_gomu_001': ELEMENT_TYPES.RUBBER,        // Regular Rubber
    
    // ZOAN CATEGORIES
    'hito_hito_002': ELEMENT_TYPES.ZOAN_BEAST,    // Chopper
    'neko_neko_001': ELEMENT_TYPES.ZOAN_BEAST,    // Lucci's Leopard
    'inu_inu_001': ELEMENT_TYPES.ZOAN_BEAST,      // Jabra's Wolf
    'tori_tori_001': ELEMENT_TYPES.ZOAN_BEAST,    // Pell's Falcon
    'ushi_ushi_001': ELEMENT_TYPES.ZOAN_BEAST,    // Dalton's Bison
    
    // ANCIENT ZOANS  
    'ryu_ryu_001': ELEMENT_TYPES.ZOAN_ANCIENT,    // X-Drake's Allosaurus
    'zou_zou_001': ELEMENT_TYPES.ZOAN_ANCIENT,    // Jack's Mammoth
    'ryu_ryu_002': ELEMENT_TYPES.ZOAN_ANCIENT,    // Page One's Spinosaurus
    
    // MYTHICAL ZOANS
    'uo_uo_001': ELEMENT_TYPES.ZOAN_MYTHICAL,     // Kaido's Dragon
    'tori_tori_002': ELEMENT_TYPES.ZOAN_MYTHICAL, // Marco's Phoenix
    'inu_inu_003': ELEMENT_TYPES.ZOAN_MYTHICAL,   // Yamato's Wolf Deity
    
    // PARAMECIA FRUITS - COMPLETE MAPPING
    'kilo_kilo_001': ELEMENT_TYPES.GRAVITY,       // Miss Valentine's Weight (gravity-based)
    'sube_sube_001': ELEMENT_TYPES.RUBBER,        // Alvida's slip (deflection like rubber)
    'bomu_bomu_001': ELEMENT_TYPES.FIRE,          // Mr. 5's explosions (fire-based)
    'hana_hana_001': ELEMENT_TYPES.ZOAN_BEAST,    // Robin's sprouting (biological)
    'bara_bara_001': ELEMENT_TYPES.METAL,         // Buggy's splitting (sharp resistance)
    'doru_doru_001': ELEMENT_TYPES.STONE,         // Mr.3's wax (hardening)
    'buki_buki_001': ELEMENT_TYPES.METAL,         // Baby 5's weapons
    'mero_mero_001': ELEMENT_TYPES.SOUL,          // Hancock's love (affects soul/mind)
    'noro_noro_001': ELEMENT_TYPES.GRAVITY,       // Foxy's slow (time/space)
    'awa_awa_001': ELEMENT_TYPES.POISON,          // Kalifa's soap (chemical)
    'supa_supa_001': ELEMENT_TYPES.METAL,         // Mr. 1's blade body
    'toge_toge_001': ELEMENT_TYPES.METAL,         // Miss Doublefinger's spikes
    'ori_ori_001': ELEMENT_TYPES.METAL,           // Hina's cage/binding
    'door_door_001': ELEMENT_TYPES.SPATIAL,       // Blueno's doors
    'berry_berry_001': ELEMENT_TYPES.RUBBER,      // Very Good's sphere body
    'shari_shari_001': ELEMENT_TYPES.METAL,       // Sharinguru's wheels
    'yomi_yomi_001': ELEMENT_TYPES.SOUL,          // Brook's soul revival
    'kage_kage_001': ELEMENT_TYPES.DARKNESS,      // Moria's shadows
    'horo_horo_001': ELEMENT_TYPES.SOUL,          // Perona's ghosts
    'suke_suke_001': ELEMENT_TYPES.LIGHT,         // Absalom's invisibility
    'memo_memo_001': ELEMENT_TYPES.SOUL,          // Pudding's memory manipulation
    'tama_tama_001': ELEMENT_TYPES.ZOAN_BEAST,    // Tamago's egg body
    'bari_bari_001': ELEMENT_TYPES.SPATIAL,       // Bartolomeo's barriers
    'mochi_mochi_001': ELEMENT_TYPES.RUBBER,      // Katakuri's mochi (flexible like rubber)
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
