const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    PROFESSIONAL GACHA ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

const ProfessionalGachaEngine = {
    // 200+ ULTRA-DIVERSE COLORS for professional rainbow effects
    rainbowSpectrum: [
        // ELECTRIC REDS
        '#FF0000', '#FF1100', '#FF2200', '#FF3300', '#FF4400', '#FF5500', '#FF6600', '#FF7700',
        '#FF8800', '#FF9900', '#FFAA00', '#FFBB00', '#FFCC00', '#FFDD00', '#FFEE00', '#FFFF00',
        // BLAZING ORANGES
        '#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFA500', '#FFB347', '#FFC649', '#FFD700',
        // GOLDEN YELLOWS
        '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC', '#FFFACD', '#FFF8DC', '#F0E68C',
        // ELECTRIC GREENS
        '#ADFF2F', '#7FFF00', '#32CD32', '#00FF32', '#00FF7F', '#00FA9A', '#00FF00', '#39FF14',
        // CYBER CYANS
        '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#33FFFF', '#66FFFF', '#99FFFF',
        // NEON BLUES
        '#0099FF', '#0066FF', '#0033FF', '#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF',
        // COSMIC PURPLES
        '#8000FF', '#9900FF', '#AA00FF', '#BB00FF', '#CC00FF', '#DD00FF', '#EE00FF', '#FF00FF',
        // MYSTIC MAGENTAS
        '#FF00EE', '#FF00DD', '#FF00CC', '#FF00BB', '#FF00AA', '#FF0099', '#FF0088', '#FF0077',
        // PLASMA PINKS
        '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFCCCB', '#FFE4E1', '#FFF0F5', '#FFFAFA',
        // LEGENDARY GOLDS
        '#FFD700', '#FFDF00', '#FFEF00', '#FFF700', '#FFFF00', '#F7FF00', '#EFFF00', '#E7FF00',
        // MYTHICAL VIOLETS
        '#9400D3', '#8B00FF', '#7B68EE', '#6A5ACD', '#483D8B', '#4B0082', '#8A2BE2', '#9932CC',
        // OMNIPOTENT COSMICS
        '#4B0082', '#8B00FF', '#9400D3', '#9932CC', '#8A2BE2', '#7B68EE', '#6A5ACD', '#483D8B'
    ],

    // Professional rainbow color cycling with mathematical precision
    getRainbowColor(frame, intensity = 1) {
        const baseIndex = (frame * 7 + intensity * 11) % this.rainbowSpectrum.length;
        const offsetIndex = (frame * 13 + intensity * 17) % this.rainbowSpectrum.length;
        const finalIndex = (baseIndex + offsetIndex) % this.rainbowSpectrum.length;
        return this.rainbowSpectrum[finalIndex];
    },

    // Epic particle effects with professional intensity scaling
    createEpicParticles(intensity, type = 'energy') {
        const particleSets = {
            energy: ['⚡', '💥', '✨', '💫', '🔥', '⭐', '🌟', '💎'],
            rainbow: ['🌈', '✨', '💫', '⭐', '🌟', '💎', '🔮', '💥'],
            cosmic: ['🌌', '✨', '💫', '⭐', '🌟', '💎', '🔮', '💥'],
            legendary: ['⭐', '🌟', '💎', '✨', '💫', '🔮', '👑', '💥'],
            mythical: ['🔮', '🌟', '💎', '✨', '💫', '⭐', '🔥', '💥'],
            omnipotent: ['🌌', '💎', '✨', '🌟', '💫', '⭐', '🔮', '💥']
        };
        
        const particles = particleSets[type] || particleSets.energy;
        const count = Math.min(intensity + 6, 15);
        return particles.slice(0, count).join('');
    },

    // Clean energy indicator without ugly bars
    createEnergyIndicator(percentage, frame) {
        // Dynamic sparkles based on percentage
        let sparkle = '🔋';
        if (percentage > 90) sparkle = '✨';
        else if (percentage > 70) sparkle = '⚡';
        else if (percentage > 50) sparkle = '💫';
        
        // Energy level descriptors
        let energyLevel = 'LOW';
        if (percentage > 80) energyLevel = 'MAXIMUM';
        else if (percentage > 60) energyLevel = 'HIGH';
        else if (percentage > 40) energyLevel = 'RISING';
        else if (percentage > 20) energyLevel = 'BUILDING';
        
        return `${sparkle} Energy Level: **${energyLevel}** (${percentage}%)`;
    },

    // Randomized fake-out system with multiple scenarios
    generateFakeOut(targetRarity, frame) {
        // Don't fake out common/uncommon - not exciting enough
        if (['common', 'uncommon'].includes(targetRarity)) {
            return null;
        }
        
        // Multiple fake-out scenarios
        const fakeOutScenarios = [
            {
                type: 'rarity_escalation',
                sequence: ['rare', 'legendary', 'mythical'],
                messages: [
                    'Rare class signature detected!',
                    'Wait... this is LEGENDARY level!',
                    'Actually... MYTHICAL power confirmed!'
                ]
            },
            {
                type: 'power_surge',
                sequence: ['legendary', 'omnipotent'],
                messages: [
                    'LEGENDARY class energy locked!',
                    'INCREDIBLE! OMNIPOTENT power detected!'
                ]
            },
            {
                type: 'triple_fake',
                sequence: ['mythical', 'legendary', 'omnipotent'],
                messages: [
                    'MYTHICAL signature confirmed!',
                    'No wait... LEGENDARY class!',
                    'ULTIMATE! OMNIPOTENT level detected!'
                ]
            },
            {
                type: 'reverse_fake',
                sequence: ['omnipotent', 'mythical'],
                messages: [
                    'OMNIPOTENT! Reality-breaking power!',
                    'Recalibrating... MYTHICAL class!'
                ]
            },
            {
                type: 'build_up',
                sequence: ['rare', 'legendary'],
                messages: [
                    'Rare class detected...',
                    'EXPLOSION! LEGENDARY power surge!'
                ]
            }
        ];
        
        // Random scenario selection
        const scenario = fakeOutScenarios[Math.floor(Math.random() * fakeOutScenarios.length)];
        const stageIndex = Math.min(frame, scenario.sequence.length - 1);
        const fakeRarity = scenario.sequence[stageIndex];
        
        // Don't fake the actual rarity they're getting
        if (fakeRarity === targetRarity && frame === scenario.sequence.length - 1) {
            return null;
        }
        
        const fakeConfig = DevilFruitDatabase.getRarityConfig(fakeRarity);
        
        return {
            color: fakeConfig.color,
            emoji: fakeConfig.emoji,
            message: scenario.messages[stageIndex] || `${fakeRarity.toUpperCase()} class confirmed!`,
            rarity: fakeRarity,
            isBuilding: stageIndex < scenario.sequence.length - 1
        };
    }
};

// PHASE 1: Energy Detection (6 frames, 1.5 seconds) - Building anticipation
function createEnergyDetection(frame) {
    const percentage = Math.floor((frame / 5) * 20); // 0-20%
    const energyIndicator = ProfessionalGachaEngine.createEnergyIndicator(percentage, frame);
    const particles = ProfessionalGachaEngine.createEpicParticles(frame + 3, 'energy');
    
    const messages = [
        "🔍 Scanning the vast ocean for Devil Fruit energy...",
        "📡 Mysterious signatures detected in the Grand Line...",
        "⚡ Ancient power stirring beneath the waves..."
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalGachaEngine.getRainbowColor(frame * 2, 1))
        .setTitle('🔍 **DEVIL FRUIT ENERGY DETECTION** 🔍')
        .setDescription(`
${particles}

${energyIndicator}

*${message}*

🌊 Signal Strength: **BUILDING**
📊 Resonance: **STABILIZING**
        `)
        .setFooter({ text: `🔋 Scanning Phase | Detection: ACTIVE` });
}

// PHASE 2: Power Surge (8 frames, 2 seconds) - Ramping excitement
function createPowerSurge(frame) {
    const percentage = 20 + Math.floor((frame / 7) * 35); // 20-55%
    const energyIndicator = ProfessionalGachaEngine.createEnergyIndicator(percentage, frame);
    const particles = ProfessionalGachaEngine.createEpicParticles(frame + 8, 'rainbow');
    
    const messages = [
        "💥 MASSIVE ENERGY SURGE DETECTED!",
        "🔥 Power levels climbing exponentially!",
        "⚡ Devil Fruit resonance intensifying rapidly!",
        "✨ Extraordinary energy signatures confirmed!"
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalGachaEngine.getRainbowColor(frame * 4 + 10, 2))
        .setTitle('💥 **POWER SURGE DETECTED** 💥')
        .setDescription(`
${particles}

${energyIndicator}

*${message}*

⚡ Energy Matrix: **AMPLIFYING**
🌟 Power Core: **CHARGING**
🔥 Resonance Field: **EXPANDING**
        `)
        .setFooter({ text: `⚡ Power Surge | Status: AMPLIFYING!` });
}

// PHASE 3: Randomized Fake-Out Phase (6 frames, 1.5 seconds) - Dynamic suspense
function createFakeOutPhase(frame, actualRarity) {
    const percentage = 55 + Math.floor((frame / 5) * 20); // 55-75%
    const fakeOut = ProfessionalGachaEngine.generateFakeOut(actualRarity, frame);
    
    if (!fakeOut) {
        // No fake-out, show generic messages
        const energyIndicator = ProfessionalGachaEngine.createEnergyIndicator(percentage, frame);
        const particles = ProfessionalGachaEngine.createEpicParticles(frame + 12, 'cosmic');
        
        return new EmbedBuilder()
            .setColor(ProfessionalGachaEngine.getRainbowColor(frame * 6 + 20, 3))
            .setTitle('🌟 **CRITICAL THRESHOLD REACHED** 🌟')
            .setDescription(`
${particles}

${energyIndicator}

*🎯 Devil Fruit signature crystallizing...*

💫 Quantum State: **STABILIZING**
🌌 Reality Matrix: **ALIGNING**
        `)
            .setFooter({ text: `🌟 Critical Phase | Status: CRITICAL!` });
    }
    
    // Show randomized fake-out sequence
    const energyIndicator = ProfessionalGachaEngine.createEnergyIndicator(percentage, frame);
    const particles = ProfessionalGachaEngine.createEpicParticles(frame + 15, fakeOut.rarity);
    
    if (fakeOut.isBuilding || frame < 4) {
        // Show fake confirmation
        return new EmbedBuilder()
            .setColor(fakeOut.color)
            .setTitle(`${fakeOut.emoji} **${fakeOut.rarity.toUpperCase()} DETECTED** ${fakeOut.emoji}`)
            .setDescription(`
${particles}

${energyIndicator}

*${fakeOut.message}*

${fakeOut.emoji} Classification: **${fakeOut.rarity.toUpperCase()}**
⚡ Confidence: **EXTREMELY HIGH**
🎯 Lock Status: **CONFIRMED**
            `)
            .setFooter({ text: `${fakeOut.emoji} ${fakeOut.rarity.toUpperCase()} CLASS | LOCKED!` });
    } else {
        // Show the fake-out twist with random messages
        const twistMessages = [
            '🌊 The Grand Line\'s currents shift unexpectedly!',
            '⚡ Wait... energy readings are fluctuating!',
            '🌀 Reality itself seems to be bending!',
            '💫 The ocean\'s mysteries run deeper...',
            '🔮 Ancient forces interfere with the readings!'
        ];
        
        const twistMessage = twistMessages[Math.floor(Math.random() * twistMessages.length)];
        
        return new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle('🌊 **UNEXPECTED PHENOMENON!** 🌊')
            .setDescription(`
🌀💫🌀💫🌀💫🌀💫🌀💫🌀💫

⚠️ Energy Level: **FLUCTUATING** (${percentage}%)

*${twistMessage}*
*🔮 Recalibrating all sensors...*
*⚡ The truth lies deeper than expected...*

🌀 Status: **REALITY SHIFTING**
        `)
        .setFooter({ text: `🌊 Reality Anomaly | RECALIBRATING...` });
    }
}

// PHASE 4: Final Charging (6 frames, 1.5 seconds) - Ultimate buildup
function createFinalCharging(frame) {
    const percentage = 75 + Math.floor((frame / 5) * 20); // 75-95%
    const energyIndicator = ProfessionalGachaEngine.createEnergyIndicator(percentage, frame);
    const particles = ProfessionalGachaEngine.createEpicParticles(frame + 18, 'legendary');
    
    const messages = [
        "✨ Final energy stabilization sequence...",
        "🍈 Devil Fruit matrix crystallizing...",
        "💎 Physical manifestation imminent...",
        "🌟 Materialization protocols engaging..."
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalGachaEngine.getRainbowColor(frame * 8 + 40, 4))
        .setTitle('✨ **FINAL MATERIALIZATION SEQUENCE** ✨')
        .setDescription(`
${particles}

${energyIndicator}

*${message}*

💎 Crystallization: **ACTIVE**
🌟 Form Stability: **OPTIMAL**
✨ Manifestation: **IMMINENT**
        `)
        .setFooter({ text: `✨ Final Phase | Status: MATERIALIZING...` });
}

// PHASE 5: The Great Reveal (6 frames, 1.5 seconds) - Climactic moment
function createGreatReveal(frame) {
    const percentage = 95 + Math.floor((frame / 5) * 5); // 95-100%
    const particles = ProfessionalGachaEngine.createEpicParticles(25, 'omnipotent');
    
    const revealMessages = [
        "🎭 The Grand Line reveals its secret...",
        "🌊 Ancient powers emerge from the depths...",
        "⚡ The Devil Fruit materializes before you...",
        "✨ Behold! Your destiny unfolds...",
        "🍈 The ocean's gift is revealed...",
        "🌟 **DEVIL FRUIT MATERIALIZATION COMPLETE!**"
    ];
    
    const message = revealMessages[frame] || revealMessages[revealMessages.length - 1];
    
    // Clean energy completion indicator
    const energyComplete = `✨ Energy Level: **COMPLETE** (${percentage}%)`;
    
    return new EmbedBuilder()
        .setColor(ProfessionalGachaEngine.getRainbowColor(frame * 12 + 60, 6))
        .setTitle('🎭 **THE GREAT REVELATION** 🎭')
        .setDescription(`
${particles}

${energyComplete}

*${message}*

🎊 **MATERIALIZATION COMPLETE!** 🎊
        `)
        .setFooter({ text: `🎭 Great Revelation | Status: REVEALED!` });
}

// PHASE 6: Devil Fruit Revelation (8 frames, 4 seconds) - Progressive disclosure
function createDevilFruitRevelation(frame, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const particles = ProfessionalGachaEngine.createEpicParticles(30, rarity);
    
    const revealStages = [
        "🍈 A Devil Fruit emerges from the mystical aura...",
        `🌀 The fruit's essence begins to take shape...`,
        `✨ ${devilFruit.name.substring(0, 20)}... appears!`,
        `🍈 **${devilFruit.name}** - A legendary discovery!`,
        `📋 **Type Classification:** ${devilFruit.type}`,
        `👤 **Known Wielder:** ${devilFruit.user || 'Unknown Master'}`,
        `⚡ **Mystical Power:** ${devilFruit.power}`,
        `${config.emoji} **Final Classification: ${config.name.toUpperCase()} CLASS!** ${config.emoji}`
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    // Clean completion indicator
    const completionStatus = `🌟 Revelation: **STAGE ${frame + 1}/8** (COMPLETE)`;
    
    return new EmbedBuilder()
        .setColor(ProfessionalGachaEngine.getRainbowColor(frame * 15 + 80, 7))
        .setTitle(`${config.emoji} **DEVIL FRUIT REVELATION** ${config.emoji}`)
        .setDescription(`
${particles}

${completionStatus}

*${currentReveal}*

${frame >= 7 ? `\n${config.emoji}═══════════════════════════════════════${config.emoji}` : ''}
        `)
        .setFooter({ text: `${config.emoji} Progressive Revelation | Stage ${frame + 1}/8 | ${config.name} Class` });
}

// PHASE 7: Epic Finale with Professional Celebration
function createEpicFinale(devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const rarityMessages = {
        omnipotent: "🌌 **OMNIPOTENT CLASS ACQUIRED!** Reality itself bends to your will! The multiverse trembles at your presence! 🌌",
        mythical: "🔮 **MYTHICAL CLASS OBTAINED!** Ancient legends spring to life! The gods themselves whisper your name in reverence! 🔮",
        legendary: "⭐ **LEGENDARY CLASS DISCOVERED!** Epic power flows through your very being! Heroes are born from such moments! ⭐",
        rare: "💎 **RARE CLASS SECURED!** Impressive abilities now flow within you! Grand adventures await your command! 💎",
        uncommon: "🌟 **UNCOMMON CLASS UNLOCKED!** Notable power has been gained! Your legendary journey truly begins now! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Every great legend starts with a single step! Limitless potential awaits discovery! ⚪"
    };
    
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
            .setTitle(`${config.emoji} **LEGENDARY DISCOVERY COMPLETE!** ${config.emoji}`)
            .setDescription(`
${ProfessionalGachaEngine.createEpicParticles(35, rarity)}

${rarityMessages[rarity]}

╔══════════════════════════════════════════════╗
║               🍈 DEVIL FRUIT DATA 🍈              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  **🍈 Name:** ${devilFruit.name.padEnd(25)}    ║
║  **📋 Type:** ${devilFruit.type.padEnd(25)}    ║
║  **👤 User:** ${(devilFruit.user || 'Unknown').padEnd(25)}    ║
║  **⚡ Power:** ${devilFruit.power.substring(0,22).padEnd(25)} ║
║  **💎 Class:** ${config.name.padEnd(25)}    ║
║  **🌟 Level:** ${(devilFruit.powerLevel || 'Mysterious').toString().padEnd(25)} ║
║                                              ║
╚══════════════════════════════════════════════╝

*${devilFruit.description || 'A mysterious Devil Fruit harboring incredible potential, waiting to unlock its true power through your journey across the Grand Line...'}*

${config.emoji}═══════════════════════════════════════════════════════════════${config.emoji}
            `)
            .setFooter({ text: `${config.emoji} Congratulations, Captain! You've discovered a ${config.name} class Devil Fruit! May the Grand Line guide your adventures! ${config.emoji}` })],
        components
    };
}

// MAIN PROFESSIONAL ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results for consistent fake-out system
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 PROFESSIONAL GACHA: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Energy Detection (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createEnergyDetection(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Lightning fast!
        }
        
        // PHASE 2: Power Surge (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createPowerSurge(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra responsive!
        }
        
        // PHASE 3: Randomized Fake-Out (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFakeOutPhase(frame, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Dramatic tension!
        }
        
        // PHASE 4: Final Charging (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Building climax!
        }
        
        // PHASE 5: The Great Reveal (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createGreatReveal(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Climactic moment!
        }
        
        // PHASE 6: Devil Fruit Revelation (8 frames, 4 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createDevilFruitRevelation(frame, devilFruit, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500)); // Savoring the reveal!
        }
        
        // PHASE 7: Epic Professional Finale (permanent display)
        const finale = createEpicFinale(devilFruit, rarity);
        await interaction.editReply(finale);
        
        console.log(`🎊 EPIC SUCCESS: ${devilFruit.name} (${rarity}) discovered by ${interaction.user.username}!`);
        
        return { devilFruit, rarity };
        
    } catch (error) {
        console.error('🚨 Professional Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Grand Line Resists!')
            .setDescription('The Devil Fruit\'s power was too chaotic for the scanning matrix! The ocean\'s mysteries remain hidden... for now.')
            .setColor('#FF4500')
            .setFooter({ text: 'Professional Gacha System | Please attempt another hunt' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience
};
