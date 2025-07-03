const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                     DEBUG SYSTEM FOR TESTING
// ═══════════════════════════════════════════════════════════════════
const DEBUG_CONFIG = {
    enabled: false,
    forcedRarity: null, // null, 'common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'
    logMessages: false
};

// Debug functions
function setDebugMode(enabled) {
    DEBUG_CONFIG.enabled = enabled;
    if (!enabled) {
        DEBUG_CONFIG.forcedRarity = null;
    }
    console.log(`🔧 DEBUG MODE: ${enabled ? 'ENABLED' : 'DISABLED'}`);
}

function setForcedRarity(rarity) {
    if (!DEBUG_CONFIG.enabled) {
        console.log(`⚠️ DEBUG MODE is disabled. Enable it first.`);
        return false;
    }
    
    const validRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
    if (rarity && !validRarities.includes(rarity)) {
        console.log(`❌ Invalid rarity: ${rarity}. Valid options: ${validRarities.join(', ')}`);
        return false;
    }
    
    DEBUG_CONFIG.forcedRarity = rarity;
    console.log(`🎯 FORCED RARITY: ${rarity || 'OFF (random)'}`);
    return true;
}

function debugLog(message) {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logMessages) {
        console.log(`🔧 [DEBUG] ${message}`);
    }
}

// Override rarity calculation for testing
function getTestRarity() {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.forcedRarity) {
        debugLog(`Forcing rarity to: ${DEBUG_CONFIG.forcedRarity}`);
        return DEBUG_CONFIG.forcedRarity;
    }
    return DevilFruitDatabase.calculateDropRarity();
}

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

    // DYNAMIC PROGRESSION BARS - Syncs with embed color + rarity reveal
    createDynamicEnergyStatus(percentage, frame, phase = 'charging', currentEmbedColor = '#0099FF', rarity = null) {
        // Phase-specific energy descriptors
        const phaseDescriptors = {
            scanning: ['AWAKENING', 'STIRRING', 'CALLING', 'REACHING', 'SUMMONING'],
            charging: ['RISING', 'BUILDING', 'SURGING', 'SWELLING', 'ROARING'],
            critical: ['LEGENDARY', 'MYTHICAL', 'TRANSCENDENT', 'OVERWHELMING', 'BOUNDLESS'],
            materializing: ['FORMING', 'BLESSING', 'CHOOSING', 'BESTOWING', 'GRANTING']
        };
        
        // Select descriptor based on percentage within phase
        const descriptors = phaseDescriptors[phase] || phaseDescriptors.charging;
        const descriptorIndex = Math.min(Math.floor(percentage / 20), descriptors.length - 1);
        const energyLevel = descriptors[descriptorIndex];
        
        // Create progression bar
        const maxSlots = 16;
        const filledSlots = Math.floor((percentage / 100) * maxSlots);
        const emptySlots = maxSlots - filledSlots;
        
        let progressBar = '';
        let indicatorSquare;
        
        // At 95%+ show rarity colors, otherwise sync with embed
        if (percentage >= 95 && rarity) {
            // RARITY COLOR REVEAL - Matches database rarity colors!
            const rarityColors = {
                common: { square: '⬜', indicator: '⬜' },      // #95A5A6 (gray) → white
                uncommon: { square: '🟩', indicator: '🟩' },   // #2ECC71 (green) → green  
                rare: { square: '🟦', indicator: '🟦' },       // #3498DB (blue) → blue
                legendary: { square: '🟨', indicator: '🟨' },  // #F39C12 (orange/gold) → yellow
                mythical: { square: '🟥', indicator: '🟥' },   // #E74C3C (red) → red
                omnipotent: { square: '🌈', indicator: '🟪' }  // #9B59B6 (purple) → rainbow!
            };
            
            const rarityConfig = rarityColors[rarity] || rarityColors.common;
            indicatorSquare = rarityConfig.indicator;
            
            // Special rainbow effect for omnipotent
            if (rarity === 'omnipotent') {
                const rainbowSquares = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'];
                for (let i = 0; i < filledSlots; i++) {
                    // Create cycling rainbow effect
                    const colorIndex = (i + frame) % rainbowSquares.length;
                    progressBar += rainbowSquares[colorIndex];
                }
            } else {
                // Normal rarity color
                for (let i = 0; i < filledSlots; i++) {
                    progressBar += rarityConfig.square;
                }
            }
        } else {
            // SYNC WITH EMBED COLOR (before 95%)
            // Convert hex embed color to closest square emoji
            const colorMap = {
                // Red spectrum
                '#FF0000': '🟥', '#FF1212': '🟥', '#FF2424': '🟥', '#FF3636': '🟥',
                '#FF4848': '🟥', '#FF5A5A': '🟥', '#E74C3C': '🟥',
                // Orange spectrum  
                '#FF6000': '🟧', '#FF7212': '🟧', '#FF8424': '🟧', '#FF9636': '🟧',
                '#FFA848': '🟧', '#F39C12': '🟧',
                // Yellow spectrum
                '#FFCC00': '🟨', '#FFD700': '🟨', '#FFDE12': '🟨', '#FFE418': '🟨',
                '#FFEA1E': '🟨', '#FFF024': '🟨',
                // Green spectrum
                '#00FF00': '🟩', '#06FF06': '🟩', '#12FF12': '🟩', '#18FF18': '🟩',
                '#2ECC71': '🟩', '#24FF24': '🟩',
                // Blue spectrum  
                '#0080FF': '🟦', '#0686FF': '🟦', '#0C8CFF': '🟦', '#1292FF': '🟦',
                '#3498DB': '🟦', '#24A4FF': '🟦',
                // Cyan spectrum
                '#00FFFF': '🟦', '#06F9FF': '🟦', '#0CF3FF': '🟦', '#12EDFF': '🟦',
                // Purple spectrum
                '#8000FF': '🟪', '#8606FF': '🟪', '#9212FF': '🟪', '#9B59B6': '🟪',
                '#B030FF': '🟪', '#C242FF': '🟪',
                // Pink spectrum
                '#FF00FF': '🟪', '#FF06F9': '🟪', '#FF0080': '🟪', '#FF0686': '🟪'
            };
            
            // Find closest match or default to blue
            const squareColor = colorMap[currentEmbedColor] || '🟦';
            indicatorSquare = squareColor;
            
            // Fill with matched color
            for (let i = 0; i < filledSlots; i++) {
                progressBar += squareColor;
            }
        }
        
        // Add empty squares
        for (let i = 0; i < emptySlots; i++) {
            progressBar += '⬜';
        }
        
        return `${indicatorSquare} **${energyLevel}**\n${progressBar}`;
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
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'scanning', color, rarity);
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 4, 'ocean', 'common');
    
    const mysticalMessages = [
        "🔍 Scanning the Grand Line for Devil Fruits...",
        "🌊 The ocean's power stirs beneath the waves...",
        "⚡ A Devil Fruit's presence grows stronger...",
        "🔮 The sea's will guides us to treasure..."
    ];
    
    const message = mysticalMessages[Math.floor(frame / 2)] || mysticalMessages[0];
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 3, 1, user?.id?.slice(-2) || 0);
    
    // Get changing indicators that gradually lock in
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🔮 **DEVIL FRUIT HUNT BEGINS** 🔮')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `🔮 Phase: Devil Fruit Hunt | Searching the Grand Line...` });
}

// PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
function createEnergyAmplification(frame, user, rarity, devilFruit) {
    const percentage = 15 + Math.floor((frame / 9) * 30); // 15-45%
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'charging', color, rarity);
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 10, 'energy', 'uncommon');
    
    const amplificationMessages = [
        "💥 The sea's power is building rapidly!",
        "🔥 Devil Fruit energy growing stronger!",
        "⚡ The Grand Line responds to our call!",
        "✨ Ocean currents swirl with hidden power!",
        "🌟 A Devil Fruit draws near!"
    ];
    
    const message = amplificationMessages[Math.floor(frame / 2)] || amplificationMessages[0];
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 5 + 20, 2, user?.id?.slice(-2) || 0);
    
    // Get changing indicators that gradually lock in
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('💥 **DEVIL FRUIT POWER RISING** 💥')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `💥 Phase: Power Rising | Devil Fruit energy building!` });
}

// PHASE 3: Advanced Fake-Out Sequence (8 frames, 2 seconds)
function createAdvancedFakeOut(frame, actualRarity, user, devilFruit) {
    const percentage = 45 + Math.floor((frame / 7) * 25); // 45-70%
    const fakeOut = NextGenGachaEngine.generateAdvancedFakeOut(actualRarity, frame, user);
    
    if (!fakeOut) {
        // No fake-out, show critical energy buildup with changing indicators
        const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'critical', color, actualRarity);
        const particles = NextGenGachaEngine.createOnePieceParticles(frame + 15, 'grandline', 'rare');
        const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 7 + 40, 3, user?.id?.slice(-2) || 0);
        
        // Get changing indicators
        const indicators = NextGenGachaEngine.getChangingIndicators(frame, actualRarity, devilFruit.type);
        
        return new EmbedBuilder()
            .setColor(color)
            .setTitle('🌟 **DEVIL FRUIT APPROACHING** 🌟')
            .setDescription(`
${particles}

${energyStatus}

        *🎯 A Devil Fruit's spirit awakens from the ocean depths...*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
            .setFooter({ text: `🌟 Phase: Devil Fruit Approaching | The sea chooses!` });
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

🟥 **REALITY SHIFTING**
🟥🟨🟧🟩🟦🟪🟥🟨🟧🟩🟦🟪🟥🟨🟧🟩

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
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'materializing', color, rarity);
    const particles = NextGenGachaEngine.createOnePieceParticles(frame + 22, 'grandline', 'legendary');
    
    const materializationMessages = [
        "✨ The Devil Fruit begins to take form...",
        "🍈 Ocean currents shape the fruit's power...",
        "💎 The fruit's true nature becomes clear...",
        "🌟 A Devil Fruit emerges from the sea...",
        "⭐ The ocean's gift is almost ready..."
    ];
    
    const message = materializationMessages[Math.floor(frame / 2)] || materializationMessages[0];
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 9 + 80, 4, user?.id?.slice(-2) || 0);
    
    // Get changing indicators
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('✨ **DEVIL FRUIT FORMING** ✨')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `✨ Phase: Devil Fruit Forming | The sea's gift takes shape...` });
}

// PHASE 5: Ultimate Revelation (10 frames, 2.5 seconds)
function createUltimateRevelation(frame, user, rarity, devilFruit) {
    const percentage = 95 + Math.floor((frame / 9) * 5); // 95-100%
    const particles = NextGenGachaEngine.createOnePieceParticles(15, 'grandline', 'omnipotent');
    
    const revelationMessages = [
        "🎭 The Grand Line reveals its secret...",
        "🌊 Ancient ocean power surfaces...",
        "⚡ The Devil Fruit shows its true form...",
        "✨ Behold! Your destiny emerges...",
        "🍈 The ocean's greatest gift appears...",
        "🌟 Witness the birth of power...",
        "💫 The sea itself celebrates...",
        "🌌 The Grand Line acknowledges you...",
        "🎊 **THE DEVIL FRUIT IS REVEALED!**",
        "👑 **YOUR POWER AWAITS!**"
    ];
    
    const message = revelationMessages[frame] || revelationMessages[revelationMessages.length - 1];
    const energyComplete = NextGenGachaEngine.createDynamicEnergyStatus(100, frame, 'critical', color, rarity);
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 13 + 100, 6, user?.id?.slice(-2) || 0);
    
    // Get changing indicators (should be fully locked by now)
    const indicators = NextGenGachaEngine.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🎭 **THE DEVIL FRUIT REVEALS ITSELF** 🎭')
        .setDescription(`
${particles}

${energyComplete}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}

🎊 **THE FRUIT IS READY!** 🎊
👑 **PREPARE FOR YOUR REWARD!** 👑
        `)
        .setFooter({ text: `🎭 Final Revelation | The Grand Line has chosen!` });
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
            .setTitle(`${config.emoji} **DEVIL FRUIT MASTERY ACHIEVED!** ${config.emoji}`)
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
        const rarity = getTestRarity(); // Use debug-aware rarity calculation
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        const user = interaction.user;
        
        console.log(`🎭 NEXT-GEN GACHA: ${devilFruit.name} (${rarity}) for ${user.username} (ID: ${user.id})${DEBUG_CONFIG.enabled ? ' [DEBUG MODE]' : ''}`);
        
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
    createUltimateCinematicExperience,
    // Export debug functions for /testing command
    setDebugMode,
    setForcedRarity,
    DEBUG_CONFIG
};
