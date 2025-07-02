const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    PROFESSIONAL CINEMATIC ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

const ProfessionalEngine = {
    // 150+ ULTRA-DIVERSE COLORS for lightning-fast cycling
    hyperColors: [
        // ELECTRIC SPECTRUM
        '#FF0000', '#FF1100', '#FF2200', '#FF3300', '#FF4400', '#FF5500', '#FF6600', '#FF7700',
        '#FF8800', '#FF9900', '#FFAA00', '#FFBB00', '#FFCC00', '#FFDD00', '#FFEE00', '#FFFF00',
        '#EEFF00', '#DDFF00', '#CCFF00', '#BBFF00', '#AAFF00', '#99FF00', '#88FF00', '#77FF00',
        '#66FF00', '#55FF00', '#44FF00', '#33FF00', '#22FF00', '#11FF00', '#00FF00', '#00FF11',
        '#00FF22', '#00FF33', '#00FF44', '#00FF55', '#00FF66', '#00FF77', '#00FF88', '#00FF99',
        '#00FFAA', '#00FFBB', '#00FFCC', '#00FFDD', '#00FFEE', '#00FFFF', '#00EEFF', '#00DDFF',
        '#00CCFF', '#00BBFF', '#00AAFF', '#0099FF', '#0088FF', '#0077FF', '#0066FF', '#0055FF',
        '#0044FF', '#0033FF', '#0022FF', '#0011FF', '#0000FF', '#1100FF', '#2200FF', '#3300FF',
        '#4400FF', '#5500FF', '#6600FF', '#7700FF', '#8800FF', '#9900FF', '#AA00FF', '#BB00FF',
        '#CC00FF', '#DD00FF', '#EE00FF', '#FF00FF', '#FF00EE', '#FF00DD', '#FF00CC', '#FF00BB',
        '#FF00AA', '#FF0099', '#FF0088', '#FF0077', '#FF0066', '#FF0055', '#FF0044', '#FF0033',
        '#FF0022', '#FF0011', '#8B0000', '#DC143C', '#B22222', '#CD5C5C', '#F08080', '#FA8072',
        '#E9967A', '#FFA07A', '#FF7F50', '#FF6347', '#FF4500', '#FFD700', '#FFFF00', '#ADFF2F',
        '#7FFF00', '#32CD32', '#00FF7F', '#00FA9A', '#40E0D0', '#00CED1', '#5F9EA0', '#4682B4',
        '#6495ED', '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#0000FF', '#0000CD', '#4169E1',
        '#8A2BE2', '#9400D3', '#9932CC', '#8B008B', '#800080', '#FF1493', '#FF69B4', '#FFB6C1',
        '#FFC0CB', '#FFEFD5', '#FFEBCD', '#F5DEB3', '#DEB887', '#D2691E', '#A0522D', '#8B4513',
        '#2F4F4F', '#708090', '#778899', '#B0C4DE', '#E6E6FA', '#F0F8FF'
    ],

    // ULTRA-FAST color cycling with mathematical distribution
    getHyperColor(frame, intensity = 1) {
        // Multiple color streams for maximum diversity
        const stream1 = (frame * 17 + intensity * 23) % this.hyperColors.length;
        const stream2 = (frame * 31 + intensity * 41) % this.hyperColors.length;
        const stream3 = (frame * 7 + intensity * 13) % this.hyperColors.length;
        
        // Combine streams for ultra-diversity
        const combinedIndex = (stream1 + stream2 + stream3) % this.hyperColors.length;
        return this.hyperColors[combinedIndex];
    },

    // Professional particle systems
    createParticleField(intensity, type = 'energy') {
        const particles = {
            energy: ['⚡', '💥', '✨', '💫', '🔥', '⭐', '💎', '🌟'],
            cosmic: ['🌌', '✨', '💫', '⭐', '🌟', '💎', '🔮', '💥'],
            lightning: ['⚡', '💥', '🔥', '💫', '✨', '⭐', '🌟', '💎'],
            divine: ['🌟', '✨', '💎', '💫', '⭐', '🔮', '🌌', '💥']
        };
        
        const particleSet = particles[type] || particles.energy;
        const count = Math.min(intensity + 8, 20);
        const selected = [];
        
        for (let i = 0; i < count; i++) {
            selected.push(particleSet[i % particleSet.length]);
        }
        
        return selected.join('');
    },

    // Advanced charging bar with effects
    createAdvancedChargingBar(percentage, frame) {
        const barLength = 25;
        const filled = Math.floor((percentage / 100) * barLength);
        const empty = barLength - filled;
        
        // Dynamic charging characters based on intensity
        const chargeChars = ['░', '▒', '▓', '█'];
        const pulseChar = chargeChars[frame % chargeChars.length];
        
        let filledBar = '';
        for (let i = 0; i < filled; i++) {
            if (i === filled - 1 && percentage < 100) {
                filledBar += pulseChar; // Pulsing edge
            } else {
                filledBar += '█';
            }
        }
        
        const emptyBar = '░'.repeat(empty);
        const sparkles = percentage > 80 ? '✨' : percentage > 50 ? '⚡' : '🔋';
        
        return `${sparkles} [${filledBar}${emptyBar}] ${percentage}% ${sparkles}`;
    },

    // Professional frame with dynamic borders
    createProfessionalFrame(content, frameType = 'energy', intensity = 1) {
        const frames = {
            energy: { top: '⚡', side: '│', bottom: '⚡', corner: '┼' },
            cosmic: { top: '✨', side: '║', bottom: '✨', corner: '╬' },
            divine: { top: '🌟', side: '┃', bottom: '🌟', corner: '╋' },
            lightning: { top: '💥', side: '│', bottom: '💥', corner: '┼' }
        };
        
        const frame = frames[frameType] || frames.energy;
        const width = 45;
        
        const topLine = frame.corner + frame.top.repeat(Math.floor(width/2)) + frame.corner;
        const bottomLine = frame.corner + frame.bottom.repeat(Math.floor(width/2)) + frame.corner;
        
        return `${topLine}\n${frame.side} ${content.padEnd(width-4)} ${frame.side}\n${bottomLine}`;
    }
};

// PHASE 1: Mystical Awakening (8 frames, 2 seconds - ULTRA FAST)
function createMysticalAwakening(frame) {
    const percentage = Math.floor((frame / 7) * 15); // 0-15%
    const chargingBar = ProfessionalEngine.createAdvancedChargingBar(percentage, frame);
    const particles = ProfessionalEngine.createParticleField(frame + 3, 'energy');
    
    const awakeningMessages = [
        "🌊 The Grand Line stirs with ancient power...",
        "🔮 Mystical energies begin to converge...",
        "⚡ Devil Fruit aura detected in the void...",
        "🌌 Reality trembles as power awakens..."
    ];
    
    const message = awakeningMessages[Math.floor(frame / 2)] || awakeningMessages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalEngine.getHyperColor(frame * 3, 1))
        .setTitle('🔮 **MYSTICAL AWAKENING INITIATED** 🔮')
        .setDescription(`
${particles}
╔══════════════════════════════════════════════╗
║              DEVIL FRUIT SCANNER              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ${chargingBar}  ║
║                                              ║
║  🌊 ${message.padEnd(35)} ║
║                                              ║
╚══════════════════════════════════════════════╝
        `)
        .setFooter({ text: `🔮 Phase: Mystical Awakening | Power: ${percentage}% | Status: Scanning...` });
}

// PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
function createEnergyAmplification(frame) {
    const percentage = 15 + Math.floor((frame / 9) * 30); // 15-45%
    const chargingBar = ProfessionalEngine.createAdvancedChargingBar(percentage, frame);
    const particles = ProfessionalEngine.createParticleField(frame + 8, 'lightning');
    
    const amplificationMessages = [
        "⚡ MASSIVE ENERGY SURGE DETECTED!",
        "💥 Power levels climbing exponentially!",
        "🔥 Devil Fruit signature intensifying!",
        "✨ Energy resonance reaching critical mass!",
        "⭐ Extraordinary power source confirmed!"
    ];
    
    const message = amplificationMessages[Math.floor(frame / 2)] || amplificationMessages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalEngine.getHyperColor(frame * 5 + 15, 2))
        .setTitle('⚡ **ENERGY AMPLIFICATION PROTOCOL** ⚡')
        .setDescription(`
${particles}
╔══════════════════════════════════════════════╗
║             POWER AMPLIFICATION               ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ${chargingBar}  ║
║                                              ║
║  ⚡ ${message.padEnd(35)} ║
║                                              ║
║  🌊 Energy Matrix: [█████████░░░░░░░] RISING ║
║  🔥 Resonance: [███████░░░░░░░░░░] BUILDING  ║
║                                              ║
╚══════════════════════════════════════════════╝
        `)
        .setFooter({ text: `⚡ Phase: Energy Amplification | Power: ${percentage}% | Status: Amplifying...` });
}

// PHASE 3: Dimensional Convergence (8 frames, 2 seconds)
function createDimensionalConvergence(frame) {
    const percentage = 45 + Math.floor((frame / 7) * 25); // 45-70%
    const chargingBar = ProfessionalEngine.createAdvancedChargingBar(percentage, frame);
    const particles = ProfessionalEngine.createParticleField(frame + 15, 'cosmic');
    
    const convergenceMessages = [
        "🌌 Dimensional barriers are weakening...",
        "💫 Reality distortion field expanding...",
        "✨ Cosmic forces align for manifestation...",
        "🔮 Space-time fabric resonating with power..."
    ];
    
    const message = convergenceMessages[Math.floor(frame / 2)] || convergenceMessages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalEngine.getHyperColor(frame * 7 + 30, 3))
        .setTitle('🌌 **DIMENSIONAL CONVERGENCE SEQUENCE** 🌌')
        .setDescription(`
${particles}
╔══════════════════════════════════════════════╗
║            DIMENSIONAL CONVERGENCE            ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ${chargingBar}  ║
║                                              ║
║  🌌 ${message.padEnd(35)} ║
║                                              ║
║  💫 Dimension A: [████████████░░░] MERGING   ║
║  ✨ Dimension B: [██████████░░░░░] ALIGNING  ║
║  🔮 Nexus Point: [███████████████] LOCKED    ║
║                                              ║
╚══════════════════════════════════════════════╝
        `)
        .setFooter({ text: `🌌 Phase: Dimensional Convergence | Power: ${percentage}% | Status: Converging...` });
}

// PHASE 4: Critical Saturation (6 frames, 1.5 seconds)
function createCriticalSaturation(frame) {
    const percentage = 70 + Math.floor((frame / 5) * 25); // 70-95%
    const chargingBar = ProfessionalEngine.createAdvancedChargingBar(percentage, frame);
    const particles = ProfessionalEngine.createParticleField(frame + 20, 'divine');
    
    const saturationMessages = [
        "💥 CRITICAL SATURATION ACHIEVED!",
        "🌟 POWER THRESHOLD EXCEEDED!",
        "⭐ MAXIMUM ENERGY DENSITY REACHED!"
    ];
    
    const message = saturationMessages[Math.floor(frame / 2)] || saturationMessages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalEngine.getHyperColor(frame * 11 + 50, 4))
        .setTitle('💥 **CRITICAL SATURATION PROTOCOL** 💥')
        .setDescription(`
${particles}
╔══════════════════════════════════════════════╗
║             CRITICAL SATURATION               ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ${chargingBar}  ║
║                                              ║
║  💥 ${message.padEnd(35)} ║
║                                              ║
║  ⚠️  WARNING: ENERGY OVERFLOW IMMINENT  ⚠️   ║
║  🔥 Core Temp: [████████████████] CRITICAL   ║
║  ⚡ Stability: [████████░░░░░░░░] UNSTABLE    ║
║                                              ║
╚══════════════════════════════════════════════╝
        `)
        .setFooter({ text: `💥 Phase: Critical Saturation | Power: ${percentage}% | Status: CRITICAL!` });
}

// PHASE 5: Final Materialization (8 frames, 2 seconds)
function createFinalMaterialization(frame) {
    const percentage = 95 + Math.floor((frame / 7) * 5); // 95-100%
    const chargingBar = ProfessionalEngine.createAdvancedChargingBar(percentage, frame);
    const particles = ProfessionalEngine.createParticleField(25, 'divine');
    
    const materializationMessages = [
        "✨ Initiating materialization protocol...",
        "🍈 Devil Fruit matrix stabilizing...",
        "💎 Physical form crystallizing...",
        "🌟 Manifestation sequence complete!"
    ];
    
    const message = materializationMessages[Math.floor(frame / 2)] || materializationMessages[0];
    
    return new EmbedBuilder()
        .setColor(ProfessionalEngine.getHyperColor(frame * 13 + 70, 5))
        .setTitle('✨ **FINAL MATERIALIZATION SEQUENCE** ✨')
        .setDescription(`
${particles}
╔══════════════════════════════════════════════╗
║            FINAL MATERIALIZATION              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ${chargingBar}  ║
║                                              ║
║  ✨ ${message.padEnd(35)} ║
║                                              ║
║  🍈 Form: [██████████████████████] STABLE    ║
║  💎 Structure: [████████████████] COMPLETE   ║
║  🌟 Essence: [█████████████████████] PURE    ║
║                                              ║
╚══════════════════════════════════════════════╝
        `)
        .setFooter({ text: `✨ Phase: Final Materialization | Power: ${percentage}% | Status: Materializing...` });
}

// PHASE 6: Devil Fruit Revelation (10 frames, 5 seconds)
function createDevilFruitRevelation(frame, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const particles = ProfessionalEngine.createParticleField(30, 'divine');
    
    const revealStages = [
        "🍈 A Devil Fruit emerges from the void...",
        `🍈 ${devilFruit.name.substring(0, 15)}...`,
        `🍈 **${devilFruit.name}**`,
        `📋 Type: **${devilFruit.type}**`,
        `👤 Known User: **${devilFruit.user || 'Unknown'}**`,
        `⚡ Power: **${devilFruit.power}**`,
        `💎 Classification: **${rarity.toUpperCase()}**`,
        `🌟 Power Level: **${devilFruit.powerLevel || 'Mysterious'}**`,
        `🔮 Rarity: **${config.name} Class**`,
        `✨ **REVELATION COMPLETE!**`
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    return new EmbedBuilder()
        .setColor(ProfessionalEngine.getHyperColor(frame * 15 + 90, 6))
        .setTitle(`${config.emoji} **DEVIL FRUIT REVELATION** ${config.emoji}`)
        .setDescription(`
${particles}
╔══════════════════════════════════════════════╗
║             DEVIL FRUIT REVEALED              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  🔋 [█████████████████████████] 100% ⚡     ║
║                                              ║
║  ${currentReveal.padEnd(44)} ║
║                                              ║
║  ${config.emoji}═══════════════════════════════════════${config.emoji}  ║
║                                              ║
╚══════════════════════════════════════════════╝
        `)
        .setFooter({ text: `${config.emoji} Classification: ${config.name} | Revelation Complete!` });
}

// PHASE 7: Epic Finale
function createEpicFinale(devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const rarityMessages = {
        omnipotent: "🌌 **OMNIPOTENT CLASS ACQUIRED!** Reality itself bows to your will! The multiverse trembles! 🌌",
        mythical: "🔮 **MYTHICAL CLASS OBTAINED!** Ancient legends come to life! Gods whisper your name! 🔮",
        legendary: "⭐ **LEGENDARY CLASS DISCOVERED!** Epic power courses through your being! Heroes are born! ⭐",
        rare: "💎 **RARE CLASS SECURED!** Impressive abilities flow within you! Adventure awaits! 💎",
        uncommon: "🌟 **UNCOMMON CLASS UNLOCKED!** Notable power gained! Your journey begins! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Every legend starts with a single step! Potential awaits! ⚪"
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
                    .setStyle(ButtonStyle.Secondary)
            )
    ];
    
    return {
        embeds: [new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`${config.emoji} **${devilFruit.name}** ${config.emoji}`)
            .setDescription(`
${ProfessionalEngine.createParticleField(35, 'divine')}

${rarityMessages[rarity]}

╔══════════════════════════════════════════════╗
║                DEVIL FRUIT DATA               ║
╠══════════════════════════════════════════════╣
║                                              ║
║  🍈 **Name:** ${devilFruit.name.padEnd(25)}    ║
║  📋 **Type:** ${devilFruit.type.padEnd(25)}    ║
║  👤 **User:** ${(devilFruit.user || 'Unknown').padEnd(25)}    ║
║  ⚡ **Power:** ${devilFruit.power.substring(0,24).padEnd(25)} ║
║  💎 **Class:** ${config.name.padEnd(25)}    ║
║  🌟 **Level:** ${(devilFruit.powerLevel || 'Mysterious').toString().padEnd(25)} ║
║                                              ║
╚══════════════════════════════════════════════╝

*${devilFruit.description || 'A mysterious Devil Fruit with incredible potential awaiting discovery...'}*

${config.emoji}═══════════════════════════════════════════════════════════════${config.emoji}
            `)
            .setFooter({ text: `${config.emoji} Congratulations, Captain! You've discovered a ${config.name} class Devil Fruit! ${config.emoji}` })],
        components
    };
}

// MAIN PROFESSIONAL ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 PROFESSIONAL HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Mystical Awakening (8 frames, 2 seconds - ULTRA FAST)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createMysticalAwakening(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra fast!
        }
        
        // PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEnergyAmplification(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Lightning fast!
        }
        
        // PHASE 3: Dimensional Convergence (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createDimensionalConvergence(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Hyper fast!
        }
        
        // PHASE 4: Critical Saturation (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createCriticalSaturation(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Mega fast!
        }
        
        // PHASE 5: Final Materialization (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createFinalMaterialization(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra fast!
        }
        
        // PHASE 6: Devil Fruit Revelation (10 frames, 5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createDevilFruitRevelation(frame, devilFruit, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500)); // Slower for dramatic reveal
        }
        
        // PHASE 7: Epic Finale (permanent display)
        const finale = createEpicFinale(devilFruit, rarity);
        await interaction.editReply(finale);
        
        console.log(`🎊 PROFESSIONAL SUCCESS: ${devilFruit.name} (${rarity}) discovered by ${interaction.user.username}!`);
        
        return { devilFruit, rarity };
        
    } catch (error) {
        console.error('🚨 Professional Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Critical System Failure!')
            .setDescription('The Devil Fruit summoning matrix experienced a catastrophic overload! The Grand Line\'s power was too intense!')
            .setColor('#FF0000')
            .setFooter({ text: 'Professional System Error | Please try again' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience
};
