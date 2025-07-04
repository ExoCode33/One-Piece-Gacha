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

// DEVIL FRUIT ELEMENT MAPPING
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
    'hito_hito_nika_001': ELEMENT_TYPES.RUBBER,   // Luffy's Rubber/Nika
    
    // ZOAN CATEGORIES
    'hito_hito_001': ELEMENT_TYPES.ZOAN_BEAST,              // Chopper
    'neko_neko_001': ELEMENT_TYPES.ZOAN_BEAST,              // Lucci's Leopard
    'inu_inu_wolf_001': ELEMENT_TYPES.ZOAN_BEAST,           // Jabra's Wolf
    'tori_tori_001': ELEMENT_TYPES.ZOAN_BEAST,              // Pell's Falcon
    'ushi_ushi_001': ELEMENT_TYPES.ZOAN_BEAST,              // Dalton's Bison
    
    // ANCIENT ZOANS  
    'ryu_ryu_allo_001': ELEMENT_TYPES.ZOAN_ANCIENT,         // X-Drake's Allosaurus
    'ryu_ryu_ptera_001': ELEMENT_TYPES.ZOAN_ANCIENT,        // King's Pteranodon
    'ryu_ryu_brachio_001': ELEMENT_TYPES.ZOAN_ANCIENT,      // Queen's Brachiosaurus
    
    // MYTHICAL ZOANS
    'uo_uo_001': ELEMENT_TYPES.ZOAN_MYTHICAL,               // Kaido's Dragon
    'tori_tori_phoenix_001': ELEMENT_TYPES.ZOAN_MYTHICAL,   // Marco's Phoenix
    'hito_hito_daibutsu_001': ELEMENT_TYPES.ZOAN_MYTHICAL,  // Sengoku's Buddha
    'hebi_hebi_001': ELEMENT_TYPES.ZOAN_MYTHICAL,           // Orochi's Yamata
    'inu_inu_kyubi_001': ELEMENT_TYPES.ZOAN_MYTHICAL,       // Devon's Nine-Tails
    'inu_inu_okuchi_001': ELEMENT_TYPES.ZOAN_MYTHICAL,      // Yamato's Wolf Deity
    
    // OTHER PARAMECIA (default to neutral or specific elements)
    'bara_bara_001': ELEMENT_TYPES.METAL,         // Buggy's splitting (sharp resistance)
    'hana_hana_001': ELEMENT_TYPES.ZOAN_BEAST,    // Robin's sprouting (biological)
    'doru_doru_001': ELEMENT_TYPES.STONE,         // Mr.3's wax (hardening)
    'buki_buki_001': ELEMENT_TYPES.METAL,         // Baby 5's weapons
    'mero_mero_001': ELEMENT_TYPES.SOUL,          // Hancock's love (affects soul/mind)
    
    // WEAK FRUITS (mostly neutral)
    'sube_sube_001': ELEMENT_TYPES.RUBBER,        // Alvida's slip (deflection)
    'noro_noro_001': ELEMENT_TYPES.GRAVITY,       // Foxy's slow (time/space)
    'awa_awa_001': ELEMENT_TYPES.POISON,          // Kalifa's soap (chemical)
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
            [ELEMENT_TYPES.RUBBER]: 'Rubber',
            [ELEMENT_TYPES.VIBRATION]: 'Vibration',
            [ELEMENT_TYPES.SPATIAL]: 'Space',
            [ELEMENT_TYPES.GRAVITY]: 'Gravity',
            [ELEMENT_TYPES.SOUL]: 'Soul',
            [ELEMENT_TYPES.POISON]: 'Poison',
            [ELEMENT_TYPES.ZOAN_BEAST]: 'Beast',
            [ELEMENT_TYPES.ZOAN_ANCIENT]: 'Ancient Beast',
            [ELEMENT_TYPES.ZOAN_MYTHICAL]: 'Mythical Creature',
            [ELEMENT_TYPES.METAL]: 'Metal',
            [ELEMENT_TYPES.STONE]: 'Stone'
        };
        return names[element] || 'Unknown';
    }
    
    // Calculate battle outcome based on multiple factors
    static calculateBattleResult(attacker, defender) {
        const basePowerRatio = attacker.totalCombatPower / defender.totalCombatPower;
        
        // Get type effectiveness for each fruit matchup
        let totalEffectiveness = 1.0;
        let effectivenessSamples = 0;
        
        // Compare strongest fruits
        const attackerFruits = Object.values(attacker.devilFruits)
            .sort((a, b) => b.powerLevel - a.powerLevel)
            .slice(0, 3); // Top 3 fruits
            
        const defenderFruits = Object.values(defender.devilFruits)
            .sort((a, b) => b.powerLevel - a.powerLevel)
            .slice(0, 3); // Top 3 fruits
        
        attackerFruits.forEach(aFruit => {
            defenderFruits.forEach(dFruit => {
                const matchup = this.calculateEffectiveness(aFruit.id, dFruit.id);
                totalEffectiveness += matchup.effectiveness;
                effectivenessSamples++;
            });
        });
        
        const avgEffectiveness = effectivenessSamples > 0 ? totalEffectiveness / effectivenessSamples : 1.0;
        const finalMultiplier = basePowerRatio * avgEffectiveness;
        
        // Add some randomness (±20%)
        const randomFactor = 0.8 + (Math.random() * 0.4);
        const finalScore = finalMultiplier * randomFactor;
        
        return {
            victory: finalScore > 1.0,
            score: finalScore,
            powerRatio: basePowerRatio,
            typeAdvantage: avgEffectiveness,
            confidence: Math.min(Math.abs(finalScore - 1.0) * 100, 95)
        };
    }
}

module.exports = {
    ELEMENT_TYPES,
    COUNTER_MATRIX,
    DEVIL_FRUIT_ELEMENTS,
    CombatSystem
};
