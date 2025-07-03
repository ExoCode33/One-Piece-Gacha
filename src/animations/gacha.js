const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                 NEXT-GENERATION PROFESSIONAL GACHA SYSTEM
// ═══════════════════════════════════════════════════════════════════

const NextGenGachaEngine = {
    // 300+ ULTRA-DIVERSE COLORS with mathematical perfection
    hyperSpectrumColors: [
        // ELECTRIC REDS (High-energy dopamine triggers)
        '#FF0000', '#FF0606', '#FF0C0C', '#FF1212', '#FF1818', '#FF1E1E', '#FF2424', '#FF2A2A',
        '#FF3030', '#FF3636', '#FF3C3C', '#FF4242', '#FF4848', '#FF4E4E', '#FF5454', '#FF5A5A',
        // BLAZING ORANGES (Excitement amplifiers)
        '#FF6000', '#FF6606', '#FF6C0C', '#FF7212', '#FF7818', '#FF7E1E', '#FF8424', '#FF8A2A',
        '#FF9030', '#FF9636', '#FF9C3C', '#FFA242', '#FFA848', '#FFAE4E', '#FFB454', '#FFBA5A',
        // GOLDEN YELLOWS (Reward associations)
        '#FFCC00', '#FFD206', '#FFD80C', '#FFDE12', '#FFE418', '#FFEA1E', '#FFF024', '#FFF62A',
        '#FFFC30', '#FFFF36', '#F9FF3C', '#F3FF42', '#EDFF48', '#E7FF4E', '#E1FF54', '#DBFF5A',
        // ELECTRIC GREENS (Success confirmation)
        '#00FF00', '#06FF06', '#0CFF0C', '#12FF12', '#18FF18', '#1EFF1E', '#24FF24', '#2AFF2A',
        '#30FF30', '#36FF36', '#3CFF3C', '#42FF42', '#48FF48', '#4EFF4E', '#54FF54', '#5AFF5A',
        // CYBER CYANS (Future/tech aesthetic)
        '#00FFFF', '#06F9FF', '#0CF3FF', '#12EDFF', '#18E7FF', '#1EE1FF', '#24DBFF', '#2AD5FF',
        '#30CFFF', '#36C9FF', '#3CC3FF', '#42BDFF', '#48B7FF', '#4EB1FF', '#54ABFF', '#5AA5FF',
        // NEON BLUES (Trust and stability)
        '#0080FF', '#0686FF', '#0C8CFF', '#1292FF', '#1898FF', '#1E9EFF', '#24A4FF', '#2AAAFF',
        '#30B0FF', '#36B6FF', '#3CBCFF', '#42C2FF', '#48C8FF', '#4ECEFF', '#54D4FF', '#5ADAFF',
        // COSMIC PURPLES (Mystery and rarity)
        '#8000FF', '#8606FF', '#8C0CFF', '#9212FF', '#9818FF', '#9E1EFF', '#A424FF', '#AA2AFF',
        '#B030FF', '#B636FF', '#BC3CFF', '#C242FF', '#C848FF', '#CE4EFF', '#D454FF', '#DA5AFF',
        // MYSTIC MAGENTAS (Premium feel)
        '#FF00FF', '#FF06F9', '#FF0CF3', '#FF12ED', '#FF18E7', '#FF1EE1', '#FF24DB', '#FF2AD5',
        '#FF30CF', '#FF36C9', '#FF3CC3', '#FF42BD', '#FF48B7', '#FF4EB1', '#FF54AB', '#FF5AA5',
        // PLASMA PINKS (Excitement peaks)
        '#FF0080', '#FF0686', '#FF0C8C', '#FF1292', '#FF1898', '#FF1E9E', '#FF24A4', '#FF2AAA',
        '#FF30B0', '#FF36B6', '#FF3CBC', '#FF42C2', '#FF48C8', '#FF4ECE', '#FF54D4', '#FF5ADA',
        // LEGENDARY GOLDS (Ultimate rewards)
        '#FFD700', '#FFDB06', '#FFDF0C', '#FFE312', '#FFE718', '#FFEB1E', '#FFEF24', '#FFF32A',
        '#FFF730', '#FFFB36', '#FFFF3C', '#FBFF42', '#F7FF48', '#F3FF4E', '#EFFF54', '#EBFF5A'
    ],

    // MATHEMATICAL COLOR CYCLING for perfect distribution
    getHyperSpectrumColor(frame, intensity = 1, variance = 0) {
        // Multiple prime number streams for maximum diversity
        const stream1 = (frame * 17 + intensity * 23 + variance * 7) % this.hyperSpectrumColors.length;
        const stream2 = (frame * 31 + intensity * 41 + variance * 13) % this.hyperSpectrumColors.length;
        const stream3 = (frame * 43 + intensity * 47 + variance * 19) % this.hyperSpectrumColors.length;
        
        // Combine streams with golden ratio distribution
        const goldenRatio = 1.618033988749;
        const combinedIndex = Math.floor((stream1 + stream2 * goldenRatio + stream3 * (goldenRatio * goldenRatio)) % this.hyperSpectrumColors.length);
        return this.hyperSpectrumColors[combinedIndex];
    },

    // PROGRESSIVE RARITY HINTS without spoiling
    getAuraLevel(rarity) {
        const auraLevels = {
            common: 'STIRRING',
            uncommon: 'BUILDING', 
            rare: 'INTENSIFYING',
            legendary: 'BLAZING',
            mythical: 'TRANSCENDENT',
            omnipotent: 'REALITY-BREAKING'
        };
        return auraLevels[rarity] || 'STIRRING';
    },

    getBlessingLevel(rarity) {
        const blessingLevels = {
            common: 'GENTLE',
            uncommon: 'NOTABLE',
            rare: 'POWERFUL', 
            legendary: 'DIVINE',
            mythical: 'WORLD-SHAKING',
            omnipotent: 'UNIVERSE-ALTERING'
        };
        return blessingLevels[rarity] || 'GENTLE';
    },

    getResonanceLevel(rarity) {
        const resonanceLevels = {
            common: 'STABLE',
            uncommon: 'STRONG',
            rare: 'OVERWHELMING',
            legendary: 'LEGENDARY',
            mythical: 'MYTHICAL',
            omnipotent: 'OMNIPOTENT'
        };
        return resonanceLevels[rarity] || 'STABLE';
    },

    getTypeHint(type) {
        const typeHints = {
            'Paramecia': 'BODY MANIPULATION',
            'Zoan': 'BEAST TRANSFORMATION', 
            'Logia': 'ELEMENTAL FORCE',
            'Ancient Zoan': 'PREHISTORIC POWER',
            'Mythical Zoan': 'LEGENDARY CREATURE',
            'Special Paramecia': 'UNIQUE MANIFESTATION'
        };
        return typeHints[type] || 'MYSTERIOUS POWER';
    },

    // RAPID CHANGING INDICATORS that gradually lock in (EXACTLY 3 LINES)
    getChangingIndicators(frame, finalRarity, finalType) {
        const allRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
        const allTypes = ['Paramecia', 'Zoan', 'Logia', 'Ancient Zoan', 'Mythical Zoan'];
        
        // Lock frames: indicators lock in one by one
        const lockFrames = {
            aura: frame >= 6,     // Locks after 6 frames
            blessing: frame >= 7, // Locks after 7 frames  
            type: frame >= 8      // Type locks last
        };
        
        return {
            aura: lockFrames.aura ? 
                this.getAuraLevel(finalRarity) : 
                this.getAuraLevel(allRarities[frame % allRarities.length]),
            
            blessing: lockFrames.blessing ? 
                this.getBlessingLevel(finalRarity) : 
                this.getBlessingLevel(allRarities[(frame + 2) % allRarities.length]),
            
            type: lockFrames.type ? 
                this.getTypeHint(finalType) : 
                this.getTypeHint(allTypes[frame % allTypes.length])
        };
    },

    // ONE PIECE THEMED PARTICLE SYSTEMS
    createOnePieceParticles(intensity, type = 'energy', rarity = 'common') {
        const onePieceParticleSystems = {
            energy: {
                common: ['⚓', '🌊', '💨'],
                uncommon: ['⚓', '🌊', '💨', '⚡'],
                rare: ['⚓', '🌊', '💨', '⚡', '🔥'],
                legendary: ['⚓', '🌊', '💨', '⚡', '🔥', '⭐', '💎'],
                mythical: ['⚓', '🌊', '💨', '⚡', '🔥', '⭐', '💎', '👑'],
                omnipotent: ['⚓', '🌊', '💨', '⚡', '🔥', '⭐', '💎', '👑', '🏴‍☠️']
            },
            ocean: {
                common: ['🌊', '💧', '🌀'],
                uncommon: ['🌊', '💧', '🌀', '⚓'],
                rare: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️'],
                legendary: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️', '⭐'],
                mythical: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️', '⭐', '👑'],
                omnipotent: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️', '⭐', '👑', '💎', '🔥']
            },
            grandline: {
                common: ['🏴‍☠️', '⚓'],
                uncommon: ['🏴‍☠️', '⚓', '🌊'],
                rare: ['🏴‍☠️', '⚓', '🌊', '💎'],
                legendary: ['🏴‍☠️', '⚓', '🌊', '💎', '👑', '⭐'],
                mythical: ['🏴‍☠️', '⚓', '🌊', '💎', '👑', '⭐', '🔥'],
                omnipotent: ['🏴‍☠️', '⚓', '🌊', '💎', '👑', '⭐', '🔥', '⚡', '🌀']
            },
            celebration: {
                common: ['🎉', '⚓'],
                uncommon: ['🎉', '⚓', '🌊'],
                rare: ['🎉', '⚓', '🌊', '🏴‍☠️'],
                legendary: ['🎉', '⚓', '🌊', '🏴‍☠️', '💎', '👑'],
                mythical: ['🎉', '⚓', '🌊', '🏴‍☠️', '💎', '👑', '⭐'],
                omnipotent: ['🎉', '⚓', '🌊', '🏴‍☠️', '💎', '👑', '⭐', '🔥', '⚡']
            }
        };
        
        const particles = onePieceParticleSystems[type]?.[rarity] || onePieceParticleSystems.energy.common;
        
        // CONTROLLED LENGTH - max 15 emojis to prevent line wrapping
        const maxCount = 15;
        const rarityMultipliers = { common: 0.6, uncommon: 0.7, rare: 0.8, legendary: 0.9, mythical: 1.0, omnipotent: 1.0 };
        const baseCount = Math.min(intensity + 6, maxCount);
        const count = Math.floor(baseCount * (rarityMultipliers[rarity] || 0.6));
        
        // Create controlled One Piece particle pattern
        let particleString = '';
        for (let i = 0; i < Math.min(count, maxCount); i++) {
            particleString += particles[i % particles.length];
        }
        
        return particleString;
    },

    // DYNAMIC ENERGY INDICATORS with psychological optimization
    createDynamicEnergyStatus(percentage, frame, phase = 'charging') {
        // Phase-specific energy descriptors
        const phaseDescriptors = {
            scanning: ['INITIALIZING', 'SEARCHING', 'DETECTING', 'LOCATING', 'ANALYZING'],
            charging: ['CHARGING', 'BUILDING', 'RISING', 'SURGING', 'AMPLIFYING'],
            critical: ['CRITICAL', 'MAXIMUM', 'OVERLOAD', 'EXPLOSIVE', 'TRANSCENDENT'],
            materializing: ['FORMING', 'STABILIZING', 'CRYSTALLIZING', 'MANIFESTING', 'COMPLETE']
        };
        
        // Dynamic sparkle selection based on percentage and phase
        let sparkle = '🔋';
        if (percentage > 95) sparkle = '🌟';
        else if (percentage > 85) sparkle = '✨';
        else if (percentage > 70) sparkle = '⚡';
        else if (percentage > 50) sparkle = '💫';
        else if (percentage > 25) sparkle = '🔥';
        
        // Select descriptor based on percentage within phase
        const descriptors = phaseDescriptors[phase] || phaseDescriptors.charging;
        const descriptorIndex = Math.min(Math.floor(percentage / 20), descriptors.length - 1);
        const energyLevel = descriptors[descriptorIndex];
        
        return `${sparkle} Sea's Power: **${energyLevel}** (${percentage}%)`;
    },

    // ADVANCED FAKE-OUT SYSTEM with near-miss psychology
    generateAdvancedFakeOut(actualRarity, frame, user) {
        // Don't fake out common/uncommon - focus on high-impact scenarios
        if (['common', 'uncommon'].includes(actualRarity)) {
            return null;
        }
        
        // Advanced fake-out scenarios with psychological optimization
        const advancedScenarios = [
            {
                type: 'escalating_tease',
                sequence: ['rare', 'legendary', 'mythical', 'omnipotent'],
                messages: [
                    '🔍 Rare energy signature detected...',
                    '⚡ Wait... LEGENDARY power levels!',
                    '🔥 This energy... it\'s MYTHICAL!',
                    '🌌 IMPOSSIBLE! OMNIPOTENT-CLASS!'
                ],
                colors: ['#4169E1', '#FFD700', '#FF4500', '#8B00FF']
            },
            {
                type: 'legendary_bait',
                sequence: ['legendary', 'mythical'],
                messages: [
                    '⭐ LEGENDARY signature confirmed!',
                    '🔮 Actually... MYTHICAL class!'
                ],
                colors: ['#FFD700', '#FF4500']
            },
            {
                type: 'mythical_surge',
                sequence: ['mythical', 'omnipotent'],
                messages: [
                    '🔥 MYTHICAL energy detected!',
                    '🌌 Energy spiking to OMNIPOTENT!'
                ],
                colors: ['#FF4500', '#8B00FF']
            },
            {
                type: 'omnipotent_tease',
                sequence: ['omnipotent'],
                messages: [
                    '🌌 OMNIPOTENT! Reality-breaking power!'
                ],
                colors: ['#8B00FF']
            },
            {
                type: 'double_fake',
                sequence: ['legendary', 'omnipotent', 'mythical'],
                messages: [
                    '⭐ LEGENDARY class locked!',
                    '🌌 NO... OMNIPOTENT LEVEL!',
                    '🔥 Readings stabilizing... MYTHICAL!'
                ],
                colors: ['#FFD700', '#8B00FF', '#FF4500']
            }
        ];
        
        // Weighted selection favoring more dramatic scenarios for special users
        const isSpecialUser = user && (user.id.endsWith('0') || user.id.endsWith('7')); // 20% of users
        let scenario;
        
        if (isSpecialUser && Math.random() < 0.6) {
            // Higher chance of dramatic scenarios for special users
            scenario = advancedScenarios[Math.random() < 0.5 ? 0 : 4]; // escalating_tease or double_fake
        } else {
            scenario = advancedScenarios[Math.floor(Math.random() * advancedScenarios.length)];
        }
        
        const stageIndex = Math.min(frame, scenario.sequence.length - 1);
        const fakeRarity = scenario.sequence[stageIndex];
        const fakeColor = scenario.colors[stageIndex];
        
        // Don't fake the actual rarity they're getting at the end
        if (fakeRarity === actualRarity && stageIndex === scenario.sequence.length - 1) {
            return null;
        }
        
        const fakeConfig = DevilFruitDatabase.getRarityConfig(fakeRarity);
        
        return {
            color: fakeColor || fakeConfig.color,
            emoji: fakeConfig.emoji,
            message: scenario.messages[stageIndex] || `${fakeRarity.toUpperCase()} power detected!`,
            rarity: fakeRarity,
            isBuilding: stageIndex < scenario.sequence.length - 1,
            scenario: scenario.type
        };
    }
};

// PHASE 1: Mystical Initialization (8 frames, 2 seconds)
function createMysticalInitialization(frame, user, rarity, devilFruit) {
    const percentage = Math.floor((frame / 7) * 15); // 0-15%
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'scanning');
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 4, 'ocean', 'common');
    
    const mysticalMessages = [
        "🔍 Initiating mystical scan of the Grand Line...",
        "🌊 Ancient energies stir beneath the ocean's surface...",
        "⚡ Devil Fruit resonance detected in the ethereal realm...",
        "🔮 Cosmic forces align for manifestation..."
    ];
    
    const message = mysticalMessages[Math.floor(frame / 2)] || mysticalMessages[0];
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 3, 1, user?.id?.slice(-2) || 0);
    
    // Get changing indicators that gradually lock in
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🔮 **MYSTICAL DEVIL FRUIT SCAN INITIATED** 🔮')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `🔮 Phase: Mystical Initialization | Scanning ancient powers...` });
}

// PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
function createEnergyAmplification(frame, user, rarity, devilFruit) {
    const percentage = 15 + Math.floor((frame / 9) * 30); // 15-45%
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'charging');
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 10, 'energy', 'uncommon');
    
    const amplificationMessages = [
        "💥 MASSIVE ENERGY SURGE ERUPTING!",
        "🔥 Power matrices climbing exponentially!",
        "⚡ Devil Fruit resonance intensifying rapidly!",
        "✨ Extraordinary energy signatures converging!",
        "🌟 Cosmic power levels reaching critical mass!"
    ];
    
    const message = amplificationMessages[Math.floor(frame / 2)] || amplificationMessages[0];
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 5 + 20, 2, user?.id?.slice(-2) || 0);
    
    // Get changing indicators that gradually lock in
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('💥 **ENERGY AMPLIFICATION PROTOCOL** 💥')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `💥 Phase: Energy Amplification | Power surge detected!` });
}

// PHASE 3: Advanced Fake-Out Sequence (8 frames, 2 seconds)
function createAdvancedFakeOut(frame, actualRarity, user) {
    const percentage = 45 + Math.floor((frame / 7) * 25); // 45-70%
    const fakeOut = NextGenGachaEngine.generateAdvancedFakeOut(actualRarity, frame, user);
    
    if (!fakeOut) {
        // No fake-out, show critical energy buildup
        const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'critical');
        const particles = NextGenGachaEngine.createOnePieceParticles(frame + 15, 'grandline', 'rare');
        const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 7 + 40, 3, user?.id?.slice(-2) || 0);
        
        return new EmbedBuilder()
            .setColor(color)
            .setTitle('🌟 **CRITICAL ENERGY THRESHOLD** 🌟')
            .setDescription(`
${particles}

${energyStatus}

*🎯 Devil Fruit spirit awakening from the depths...*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
            .setFooter({ text: `🌟 Phase: Critical Threshold | Energy critical!` });
    }
    
    // Show advanced fake-out sequence
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'critical');
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 18, 'grandline', fakeOut.rarity);
    
    if (fakeOut.isBuilding || frame < 6) {
        // Show convincing fake confirmation
        return new EmbedBuilder()
            .setColor(fakeOut.color)
            .setTitle(`${fakeOut.emoji} **${fakeOut.rarity.toUpperCase()} CLASS DETECTED** ${fakeOut.emoji}`)
            .setDescription(`
${particles}

${energyStatus}

*${fakeOut.message}*

${fakeOut.emoji} **Classification:** ${fakeOut.rarity.toUpperCase()}
⚡ **Confidence Level:** MAXIMUM
🎯 **Lock Status:** CONFIRMED
🔥 **Power Signature:** AUTHENTICATED
        `)
        .setFooter({ text: `${fakeOut.emoji} ${fakeOut.rarity.toUpperCase()} CLASS | Lock confirmed!` });
    } else {
        // Show dramatic reality shift
        const shiftMessages = [
            '🌊 The Grand Line\'s ancient mysteries interfere!',
            '⚡ Reality itself bends under immense power!',
            '🌀 Cosmic forces beyond comprehension emerge!',
            '💫 The ocean\'s deepest secrets surface!',
            '🔮 Dimensional barriers fluctuate wildly!',
            '🌌 Universal constants are shifting!'
        ];
        
        const shiftMessage = shiftMessages[Math.floor(Math.random() * shiftMessages.length)];
        const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 11 + 60, 4, user?.id?.slice(-2) || 0);
        
        return new EmbedBuilder()
            .setColor(color)
            .setTitle('🌊 **REALITY DISTORTION DETECTED!** 🌊')
            .setDescription(`
🌀💫🌌✨🌠💥🔮⚡🌀💫🌌✨

⚠️ Sea's Power: **REALITY SHIFTING** (${percentage}%)

*${shiftMessage}*
*🔮 Recalibrating dimensional frequencies...*
*⚡ The truth transcends initial readings...*

🌀 **Status:** MULTIVERSAL INTERFERENCE
        `)
        .setFooter({ text: `🌊 Reality Anomaly | Dimensional recalibration in progress...` });
    }
}

// PHASE 4: Quantum Materialization (8 frames, 2 seconds)
function createQuantumMaterialization(frame, user, rarity, devilFruit) {
    const percentage = 70 + Math.floor((frame / 7) * 25); // 70-95%
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'materializing');
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 22, 'grandline', 'legendary');
    
    const materializationMessages = [
        "✨ Quantum materialization sequence initiating...",
        "🍈 Devil Fruit matrix stabilizing across dimensions...",
        "💎 Molecular structure crystallizing into reality...",
        "🌟 Physical manifestation protocols engaging...",
        "⭐ Final quantum coherence achieved..."
    ];
    
    const message = materializationMessages[Math.floor(frame / 2)] || materializationMessages[0];
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 9 + 80, 4, user?.id?.slice(-2) || 0);
    
    // Get changing indicators
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('✨ **QUANTUM MATERIALIZATION SEQUENCE** ✨')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `✨ Phase: Quantum Materialization | Reality crystallizing...` });
}

// PHASE 5: Ultimate Revelation (10 frames, 2.5 seconds)
function createUltimateRevelation(frame, user, rarity, devilFruit) {
    const percentage = 95 + Math.floor((frame / 9) * 5); // 95-100%
    const particles = NextGenGachaEngine.createOnePieceParticles(15, 'grandline', 'omnipotent');
    
    const revelationMessages = [
        "🎭 The Grand Line reveals its ultimate secret...",
        "🌊 Ancient powers beyond imagination emerge...",
        "⚡ The Devil Fruit manifests in glorious splendor...",
        "✨ Behold! Your destiny unfolds across reality...",
        "🍈 The ocean's greatest gift materializes...",
        "🌟 Witness the birth of legendary power...",
        "💫 Reality itself celebrates this moment...",
        "🌌 Universal forces acknowledge your worthiness...",
        "🎊 **ULTIMATE REVELATION ACHIEVED!**",
        "👑 **THE DEVIL FRUIT IS YOURS!**"
    ];
    
    const message = revelationMessages[frame] || revelationMessages[revelationMessages.length - 1];
    const energyComplete = `🌟 Sea's Power: **TRANSCENDENT** (${percentage}%)`;
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 13 + 100, 6, user?.id?.slice(-2) || 0);
    
    // Get changing indicators (should be fully locked by now)
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🎭 **ULTIMATE REVELATION SEQUENCE** 🎭')
        .setDescription(`
${particles}

${energyComplete}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}

🎊 **MATERIALIZATION COMPLETE!** 🎊
👑 **PREPARE FOR THE REVEAL!** 👑
        `)
        .setFooter({ text: `🎭 Ultimate Revelation | Status: TRANSCENDENT!` });
}

// PHASE 6: Slow Typewriter Revelation (10 frames, 5 seconds) - COLORS FROZEN
function createSlowTypewriterReveal(frame, devilFruit, rarity, user) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const particles = NextGenGachaEngine.createOnePieceParticles(12, 'celebration', rarity);
    
    // FREEZE COLOR - use the rarity's specific color throughout reveal
    const frozenColor = config.color;
    
    // Typewriter effect - slowly reveal information
    const revealStages = [
        "🍈 A Devil Fruit emerges...",
        "🍈 A Devil Fruit emerges...\n\n**Name:** ...",
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ...`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ...`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}\n**Power:** ...`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}\n**Power:** ${devilFruit.power}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}\n**Power:** ${devilFruit.power}\n**Class:** ${config.name.toUpperCase()}`
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    return new EmbedBuilder()
        .setColor(frozenColor) // FROZEN COLOR - no more cycling
        .setTitle(`${config.emoji} **DEVIL FRUIT REVELATION** ${config.emoji}`)
        .setDescription(`
${particles}

${currentReveal}
        `)
        .setFooter({ text: `${config.emoji} Revealing... | ${config.name} Class` });
}

// PHASE 7: Epic Professional Finale
function createEpicProfessionalFinale(devilFruit, rarity, user) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const ultimateMessages = {
        omnipotent: "🌌 **OMNIPOTENT CLASS ACHIEVED!** Reality itself kneels before your power! The multiverse trembles in recognition of your transcendent authority! 🌌",
        mythical: "🔮 **MYTHICAL CLASS OBTAINED!** Ancient legends spring to eternal life! The gods themselves whisper your name across the cosmos in reverent awe! 🔮",
        legendary: "⭐ **LEGENDARY CLASS DISCOVERED!** Epic power flows through every fiber of your being! Heroes are forged in moments like these! ⭐",
        rare: "💎 **RARE CLASS SECURED!** Impressive abilities now surge within your soul! Grand adventures await your commanding presence! 💎",
        uncommon: "🌟 **UNCOMMON CLASS UNLOCKED!** Notable power has been eternally gained! Your legendary journey truly begins this moment! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Every transcendent legend starts with a single courageous step! Limitless potential awaits your discovery! ⚪"
    };
    
    // Special user recognition
    const isSpecialUser = user?.id?.endsWith('0') || user?.id?.endsWith('7');
    const specialMessage = isSpecialUser ? `\n\n🌟 **SPECIAL DESTINY RECOGNIZED!** The Grand Line has chosen you for greatness! 🌟` : '';
    
    const components = [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hunt_again')
                    .setLabel('🍈 Hunt Again!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('share_discovery')
                    .setLabel('📢 Share Discovery!')
                    .setStyle(ButtonStyle.Success)
            )
    ];
    
    return {
        embeds: [new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`${config.emoji} **ULTIMATE DEVIL FRUIT MASTERY ACHIEVED!** ${config.emoji}`)
            .setDescription(`
${NextGenGachaEngine.createOnePieceParticles(12, 'celebration', rarity)}

${ultimateMessages[rarity]}${specialMessage}

**🍈 Devil Fruit:** ${devilFruit.name}
**📋 Type:** ${devilFruit.type}
**👤 User:** ${devilFruit.user || 'Unknown'}
**⚡ Power:** ${devilFruit.power}
**💎 Class:** ${config.name}
**🌟 Level:** ${devilFruit.powerLevel || 'Mysterious'}

*${devilFruit.description || 'A mysterious Devil Fruit with incredible potential...'}*
            `)
            .setFooter({ text: `${config.emoji} Congratulations, Master! You've achieved ${config.name} class mastery! May the Grand Line guide your legendary adventures! ${config.emoji}` })],
        components
    };
}

// MAIN NEXT-GENERATION ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results for consistent psychological optimization
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        const user = interaction.user;
        
        console.log(`🎭 NEXT-GEN GACHA: ${devilFruit.name} (${rarity}) for ${user.username} (ID: ${user.id})`);
        
        // PHASE 1: Mystical Initialization (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createMysticalInitialization(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra-fast color cycling
        }
        
        // PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEnergyAmplification(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Lightning-fast transitions
        }
        
        // PHASE 3: Advanced Fake-Out Sequence (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createAdvancedFakeOut(frame, rarity, user, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Dramatic tension building
        }
        
        // PHASE 4: Quantum Materialization (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createQuantumMaterialization(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Building to climax
        }
        
        // PHASE 5: Ultimate Revelation (10 frames, 2.5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createUltimateRevelation(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Climactic revelation
        }
        
        // PHASE 6: Slow Typewriter Revelation (10 frames, 5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createSlowTypewriterReveal(frame, devilFruit, rarity, user);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500)); // Slower for typewriter effect
        }
        
        // PHASE 7: Epic Professional Finale (permanent display)
        const finale = createEpicProfessionalFinale(devilFruit, rarity, user);
        await interaction.editReply(finale);
        
        console.log(`🎊 NEXT-GEN SUCCESS: ${devilFruit.name} (${rarity}) mastered by ${user.username}! Power level: ${devilFruit.powerLevel || 'Transcendent'}`);
        
        return { devilFruit, rarity, user };
        
    } catch (error) {
        console.error('🚨 Next-Gen Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Cosmic Forces Resist!')
            .setDescription('The Devil Fruit\'s transcendent power overwhelmed the dimensional scanning matrix! The multiverse\'s mysteries remain hidden... for now. The Grand Line\'s greatest secrets require patience.')
            .setColor('#FF4500')
            .setFooter({ text: 'Next-Generation Gacha System | Cosmic interference detected - please attempt another transcendent hunt' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience
};
