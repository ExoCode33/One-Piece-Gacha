const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    ULTIMATE CHARGING ENGINE
// ═══════════════════════════════════════════════════════════════════

const ChargingEngine = {
    // Ultra-fast color cycling (changes every 100ms)
    rainbowColors: [
        '#FF0000', '#FF1100', '#FF2200', '#FF3300', '#FF4400', '#FF5500',
        '#FF6600', '#FF7700', '#FF8800', '#FF9900', '#FFAA00', '#FFBB00',
        '#FFCC00', '#FFDD00', '#FFEE00', '#FFFF00', '#EEFF00', '#DDFF00',
        '#CCFF00', '#BBFF00', '#AAFF00', '#99FF00', '#88FF00', '#77FF00',
        '#66FF00', '#55FF00', '#44FF00', '#33FF00', '#22FF00', '#11FF00',
        '#00FF00', '#00FF11', '#00FF22', '#00FF33', '#00FF44', '#00FF55',
        '#00FF66', '#00FF77', '#00FF88', '#00FF99', '#00FFAA', '#00FFBB',
        '#00FFCC', '#00FFDD', '#00FFEE', '#00FFFF', '#00EEFF', '#00DDFF',
        '#00CCFF', '#00BBFF', '#00AAFF', '#0099FF', '#0088FF', '#0077FF',
        '#0066FF', '#0055FF', '#0044FF', '#0033FF', '#0022FF', '#0011FF',
        '#0000FF', '#1100FF', '#2200FF', '#3300FF', '#4400FF', '#5500FF',
        '#6600FF', '#7700FF', '#8800FF', '#9900FF', '#AA00FF', '#BB00FF',
        '#CC00FF', '#DD00FF', '#EE00FF', '#FF00FF', '#FF00EE', '#FF00DD',
        '#FF00CC', '#FF00BB', '#FF00AA', '#FF0099', '#FF0088', '#FF0077',
        '#FF0066', '#FF0055', '#FF0044', '#FF0033', '#FF0022', '#FF0011'
    ],

    // Charging bar system
    createChargingBar(percentage, width = 20) {
        const filled = Math.floor((percentage / 100) * width);
        const empty = width - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        return `[${bar}] ${percentage}%`;
    },

    // Energy pulse system
    createEnergyPulse(intensity, maxIntensity = 10) {
        const pulseLevel = Math.floor((intensity / maxIntensity) * 5);
        const effects = [
            '◯',           // Level 0
            '◉',           // Level 1  
            '⚡',           // Level 2
            '💥',          // Level 3
            '🌟',          // Level 4
            '💫'           // Level 5
        ];
        return effects[Math.min(pulseLevel, effects.length - 1)];
    },

    // Lightning effects
    createLightning(frame) {
        const patterns = [
            '    ⚡    ',
            '  ⚡ ⚡ ⚡  ',
            ' ⚡⚡⚡⚡⚡ ',
            '⚡⚡⚡⚡⚡⚡⚡',
            '💥⚡⚡⚡⚡⚡💥',
            '💥💥⚡⚡⚡💥💥',
            '💥💥💥⚡💥💥💥'
        ];
        return patterns[Math.min(frame, patterns.length - 1)];
    },

    // Charging aura
    createChargingAura(intensity) {
        const auras = [
            '.',
            '◦',
            '○',
            '◯',
            '◉',
            '⦿',
            '⚡',
            '💥',
            '🌟',
            '💫'
        ];
        const aura = auras[Math.min(intensity, auras.length - 1)];
        const count = Math.min(intensity + 3, 15);
        return aura.repeat(count);
    },

    // Power surge text
    createPowerText(text, powerLevel) {
        if (powerLevel <= 1) return text;
        if (powerLevel <= 3) return `*${text}*`;
        if (powerLevel <= 5) return `**${text}**`;
        if (powerLevel <= 7) return `***${text}***`;
        if (powerLevel <= 9) return `⚡ **${text}** ⚡`;
        return `💥 ⚡ ***${text}*** ⚡ 💥`;
    },

    // Ultra-fast color
    getUltraColor(frame) {
        return this.rainbowColors[frame % this.rainbowColors.length];
    },

    // Charging frame with consistent width
    createChargingFrame(content, chargeLevel = 1) {
        const frames = ['─', '═', '▬', '█'];
        const frameChar = frames[Math.min(Math.floor(chargeLevel / 3), frames.length - 1)];
        const width = 50; // Increased width for consistency
        const line = frameChar.repeat(width);
        
        // Force consistent content width
        const maxContentLength = 42; // Reserve space for frame chars
        let displayContent = content;
        if (content.length > maxContentLength) {
            displayContent = content.slice(0, maxContentLength - 3) + '...';
        }
        
        const padding = maxContentLength - displayContent.length;
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        const contentLine = `${frameChar} ${' '.repeat(leftPad)}${displayContent}${' '.repeat(rightPad)} ${frameChar}`;
        
        return `\`\`\`\n${line}\n${contentLine}\n${line}\n\`\`\``;
    },

    // Consistent visual separator
    createVisualSeparator(intensity = 1) {
        const chars = ['─', '═', '▬', '█'];
        const char = chars[Math.min(Math.floor(intensity / 3), chars.length - 1)];
        return char.repeat(50);
    },

    // Consistent effects bar
    createEffectsBar(effects, minWidth = 50) {
        let effectsLine = effects;
        if (effectsLine.length < minWidth) {
            const padding = minWidth - effectsLine.length;
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            effectsLine = ' '.repeat(leftPad) + effectsLine + ' '.repeat(rightPad);
        } else if (effectsLine.length > minWidth) {
            effectsLine = effectsLine.slice(0, minWidth);
        }
        return effectsLine;
    }
};

// ═══════════════════════════════════════════════════════════════════
//                    EPIC CHARGING PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Initial Charging (8 frames, fast)
function createInitialCharging(frame) {
    const percentage = Math.floor((frame / 7) * 25); // 0-25%
    const chargingBar = ChargingEngine.createChargingBar(percentage, 30); // Wider bar
    const pulse = ChargingEngine.createEnergyPulse(frame, 7);
    const aura = ChargingEngine.createChargingAura(frame);
    
    const messages = [
        "Initiating Devil Fruit scan...",
        "Detecting mystical energy...",
        "Synchronizing with the Grand Line...",
        "Energy patterns emerging...",
        "Power signature detected...",
        "Mystical frequency locked...",
        "Charging sequence activated...",
        "POWER BUILDING..."
    ];
    
    const message = messages[frame] || messages[messages.length - 1];
    const styledMessage = ChargingEngine.createPowerText(message, frame);
    
    // Consistent visual layout
    const separator = ChargingEngine.createVisualSeparator(frame);
    const effectsBar = ChargingEngine.createEffectsBar(aura);
    
    return new EmbedBuilder()
        .setTitle('🔋 DEVIL FRUIT SCANNER ONLINE')
        .setDescription(`
${effectsBar}

${separator}

${ChargingEngine.createChargingFrame(styledMessage, frame)}

${separator}

${pulse} **CHARGING SYSTEM** ${pulse}
${chargingBar}

${separator}

*Scanning the depths of the Grand Line...*

${effectsBar}
        `)
        .setColor(ChargingEngine.getUltraColor(frame * 8))
        .setFooter({ text: `🔋 System Status: INITIALIZING | Power: ${percentage}%` });
}

// PHASE 2: Power Surge (10 frames, intense)
function createPowerSurge(frame) {
    const percentage = 25 + Math.floor((frame / 9) * 40); // 25-65%
    const chargingBar = ChargingEngine.createChargingBar(percentage, 30);
    const lightning = ChargingEngine.createLightning(frame);
    const pulse = ChargingEngine.createEnergyPulse(frame + 3, 10);
    const aura = ChargingEngine.createChargingAura(frame + 5);
    
    const surgeMessages = [
        "⚡ Energy surge detected...",
        "💥 Power levels rising rapidly...",
        "⚡ Lightning crackling through space...",
        "💥 Reality fluctuations increasing...",
        "⚡ MASSIVE ENERGY SPIKE...",
        "💥 POWER OVERLOAD WARNING...",
        "⚡ SYSTEMS AT CRITICAL LEVELS...",
        "💥 ENERGY STORM APPROACHING...",
        "⚡ POWER BEYOND MEASUREMENT...",
        "💥 CRITICAL SURGE IMMINENT..."
    ];
    
    const message = surgeMessages[frame] || surgeMessages[surgeMessages.length - 1];
    const styledMessage = ChargingEngine.createPowerText(message, frame + 3);
    
    // Consistent layout
    const separator = ChargingEngine.createVisualSeparator(frame + 3);
    const effectsBar = ChargingEngine.createEffectsBar(aura);
    const lightningBar = ChargingEngine.createEffectsBar(lightning);
    
    return new EmbedBuilder()
        .setTitle(`⚡ POWER SURGE ${pulse} DETECTED`)
        .setDescription(`
${effectsBar}

${separator}

${lightningBar}

${ChargingEngine.createChargingFrame(styledMessage, frame + 3)}

${separator}

${pulse} **ENERGY OVERLOAD** ${pulse}
${chargingBar}

${separator}

*The Grand Line responds with incredible force!*

${effectsBar}
        `)
        .setColor(ChargingEngine.getUltraColor(frame * 12 + 20))
        .setFooter({ text: `⚡ Status: SURGE MODE | Power: ${percentage}%` });
}

// PHASE 3: Critical Overload (12 frames, explosive)
function createCriticalOverload(frame) {
    const percentage = 65 + Math.floor((frame / 11) * 25); // 65-90%
    const chargingBar = ChargingEngine.createChargingBar(percentage, 30);
    const pulse = ChargingEngine.createEnergyPulse(frame + 5, 12);
    const aura = ChargingEngine.createChargingAura(frame + 8);
    
    const overloadMessages = [
        "🌟 Critical energy threshold reached...",
        "💫 Space-time distortions detected...",
        "🌟 Reality barriers weakening...",
        "💫 Dimensional rifts opening...",
        "🌟 COSMIC FORCES AWAKENING...",
        "💫 REALITY MATRIX DESTABILIZING...",
        "🌟 UNIVERSAL POWERS CONVERGING...",
        "💫 DIMENSIONAL BARRIERS FAILING...",
        "🌟 OMNIPOTENT ENERGY DETECTED...",
        "💫 MULTIVERSE RESONANCE ACTIVE...",
        "🌟 CRITICAL OVERLOAD IMMINENT...",
        "💫 MAXIMUM POWER ACHIEVED..."
    ];
    
    const message = overloadMessages[frame] || overloadMessages[overloadMessages.length - 1];
    const styledMessage = ChargingEngine.createPowerText(message, frame + 5);
    
    // Extra lightning effects for overload - but keep consistent width
    const megaLightning1 = ChargingEngine.createEffectsBar(ChargingEngine.createLightning(Math.floor(frame / 2)));
    const megaLightning2 = ChargingEngine.createEffectsBar(ChargingEngine.createLightning(Math.floor(frame / 2) + 3));
    const separator = ChargingEngine.createVisualSeparator(frame + 5);
    const effectsBar = ChargingEngine.createEffectsBar(aura);
    
    return new EmbedBuilder()
        .setTitle(`💥 CRITICAL OVERLOAD ${pulse} WARNING`)
        .setDescription(`
${effectsBar}

${separator}

${megaLightning1}
${megaLightning2}

${ChargingEngine.createChargingFrame(styledMessage, frame + 5)}

${separator}

${pulse} **SYSTEM OVERLOAD** ${pulse}
${chargingBar}

${separator}

*DANGER: POWER LEVELS BEYOND SAFE PARAMETERS!*

${effectsBar}
        `)
        .setColor(ChargingEngine.getUltraColor(frame * 15 + 40))
        .setFooter({ text: `💥 Status: CRITICAL OVERLOAD | Power: ${percentage}%` });
}

// PHASE 4: Final Charging (8 frames, maximum intensity)
function createFinalCharging(frame) {
    const percentage = 90 + Math.floor((frame / 7) * 10); // 90-100%
    const chargingBar = ChargingEngine.createChargingBar(percentage);
    const pulse = ChargingEngine.createEnergyPulse(10, 10); // Max pulse
    const aura = ChargingEngine.createChargingAura(15); // Max aura
    
    const finalMessages = [
        "🌌 FINAL SEQUENCE INITIATED...",
        "🌠 MAXIMUM POWER ACHIEVED...",
        "🌌 REALITY NEXUS OPENING...",
        "🌠 COSMIC VAULT UNLOCKING...",
        "🌌 DEVIL FRUIT MATERIALIZING...",
        "🌠 LEGENDARY POWER EMERGING...",
        "🌌 SCANNING COMPLETE...",
        "🌠 REVELATION IMMINENT..."
    ];
    
    const message = finalMessages[frame] || finalMessages[finalMessages.length - 1];
    const styledMessage = ChargingEngine.createPowerText(message, 10);
    
    // Maximum lightning show
    const ultimateLightning = '💥⚡💥⚡💥⚡💥⚡💥\n⚡💥⚡💥⚡💥⚡💥⚡\n💥⚡💥⚡💥⚡💥⚡💥';
    
    return new EmbedBuilder()
        .setTitle(`🌌 FINAL SEQUENCE ${pulse} ACTIVE`)
        .setDescription(`
${aura}

${ultimateLightning}

${ChargingEngine.createChargingFrame(styledMessage, 10)}

${pulse} **MAXIMUM POWER** ${pulse}
${chargingBar}

*THE MOMENT OF TRUTH APPROACHES...*
        `)
        .setColor(ChargingEngine.getUltraColor(frame * 20 + 60))
        .setFooter({ text: `🌌 Status: FINAL SEQUENCE | Power: ${percentage}%` });
}

// PHASE 5: THE BIG REVEAL (no rarity spoilers!)
async function createBigReveal(interaction, rarity) {
    // Generic reveal without spoiling rarity
    const revealFrames = 8;
    
    for (let frame = 0; frame < revealFrames; frame++) {
        const intensity = frame + 8;
        const pulse = ChargingEngine.createEnergyPulse(10, 10);
        const aura = ChargingEngine.createChargingAura(20);
        
        const revealMessages = [
            "🌟 SCAN COMPLETE...",
            "💫 ANALYZING RESULTS...",
            "🌟 DEVIL FRUIT IDENTIFIED...",
            "💫 POWER SIGNATURE CONFIRMED...",
            "🌟 MATERIALIZING...",
            "💫 TAKING FORM...",
            "🌟 REVELATION READY...",
            "💫 BEHOLD YOUR DISCOVERY..."
        ];
        
        const message = revealMessages[frame] || revealMessages[revealMessages.length - 1];
        const styledMessage = ChargingEngine.createPowerText(message, intensity);
        
        // Progressive mystery buildup
        const mysteryBar = ChargingEngine.createChargingBar(100);
        const ultimateEffects = '🌌💫⚡🌟💥⚡💫🌌💫⚡🌟💥⚡💫🌌';
        
        const embed = new EmbedBuilder()
            .setTitle(`💫 THE MOMENT OF TRUTH ${pulse}`)
            .setDescription(`
${aura}

${ultimateEffects}

${ChargingEngine.createChargingFrame(styledMessage, 10)}

${pulse} **REVELATION IMMINENT** ${pulse}
${mysteryBar}

*What incredible Devil Fruit have you discovered?*
            `)
            .setColor(ChargingEngine.getUltraColor(frame * 25 + 80))
            .setFooter({ text: `💫 Status: REVELATION SEQUENCE | Final Phase: ${frame + 1}/8` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 400));
    }
}

// PHASE 6: Devil Fruit Materialization (6 frames)
async function createDevilFruitMaterialization(interaction, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const frames = 6;
    
    for (let frame = 0; frame < frames; frame++) {
        const progress = frame / (frames - 1);
        
        // Progressive name reveal
        const nameLength = devilFruit.name.length;
        const revealedChars = Math.floor(nameLength * progress);
        const visibleName = devilFruit.name.slice(0, revealedChars);
        const hiddenName = '◆'.repeat(nameLength - revealedChars);
        const displayName = frame === frames - 1 ? devilFruit.name : visibleName + hiddenName;
        
        const styledName = ChargingEngine.createPowerText(displayName, 10);
        
        // Info reveal
        const infoLines = [
            `**Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `**User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `**Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `**Rarity:** ${frame >= 4 ? config.name : '???'}`,
            `**Power Level:** ${frame >= 5 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const pulse = ChargingEngine.createEnergyPulse(10, 10);
        const ultimateEffects = config.emoji.repeat(Math.min(frame * 3 + 5, 20));
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MATERIALIZED ${config.emoji}`)
            .setDescription(`
${ultimateEffects}

${ChargingEngine.createChargingFrame(styledName, 10)}

${infoLines.join('\n')}

${config.stars.repeat(Math.min(frame + 3, 8))}
            `)
            .setColor(ChargingEngine.getUltraColor(frame * 30 + 100))
            .setFooter({ text: `🍈 Materialization: ${Math.floor(progress * 100)}%` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 700));
    }
}

// PHASE 7: Epic Finale with full reveal
function createUltimateFinale(devilFruit, rarity, interaction) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const finaleMessages = {
        omnipotent: '🌌 OMNIPOTENT DEVIL FRUIT OBTAINED! 🌌',
        mythical: '🔮 MYTHICAL DEVIL FRUIT DISCOVERED! 🔮',
        legendary: '👑 LEGENDARY DEVIL FRUIT FOUND! 👑',
        rare: '💎 RARE DEVIL FRUIT ACQUIRED! 💎',
        uncommon: '🌟 UNCOMMON DEVIL FRUIT GAINED! 🌟',
        common: '⚓ DEVIL FRUIT COLLECTED! ⚓'
    };
    
    const effects = {
        omnipotent: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
        mythical: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮',
        legendary: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑',
        rare: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎',
        uncommon: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟',
        common: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓'
    };
    
    const epicName = ChargingEngine.createPowerText(devilFruit.name, 10);
    const finalEffect = effects[rarity] || effects.common;
    const finalTitle = finaleMessages[rarity] || finaleMessages.common;
    
    const description = `
${finalEffect}

${ChargingEngine.createChargingFrame(epicName, 10)}

**${finalTitle}**

🍈 **${devilFruit.name}**
📋 **Type:** ${devilFruit.type}
👤 **User:** ${devilFruit.user}
⚡ **Power:** ${devilFruit.power}
🔥 **Power Level:** ${devilFruit.powerLevel.toLocaleString()}
⭐ **Rarity:** ${config.name}

${config.stars.repeat(10)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆

*"${devilFruit.description}"*

${finalEffect}
    `;

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('🔋 Charge Again!')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('view_collection')
                .setLabel('📚 Collection')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('fruit_details')
                .setLabel('🔍 Analysis')
                .setStyle(ButtonStyle.Success)
        );

    return {
        embed: new EmbedBuilder()
            .setTitle(`${config.emoji} ${epicName} ${config.emoji}`)
            .setDescription(description)
            .setColor(config.color)
            .setFooter({ 
                text: `🍈 Devil Fruit Hunt Complete | Discovered by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// ═══════════════════════════════════════════════════════════════════
//                    MASTER CHARGING SEQUENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results but keep them secret!
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🔋 CHARGING SEQUENCE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Initial Charging (8 frames, 3 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createInitialCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 375));
        }
        
        // PHASE 2: Power Surge (10 frames, 3 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createPowerSurge(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // PHASE 3: Critical Overload (12 frames, 3 seconds)
        for (let frame = 0; frame < 12; frame++) {
            const embed = createCriticalOverload(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250));
        }
        
        // PHASE 4: Final Charging (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createFinalCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250));
        }
        
        // PHASE 5: The Big Reveal (no spoilers!)
        await createBigReveal(interaction, rarity);
        
        // PHASE 6: Devil Fruit Materialization
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 7: Ultimate Finale with full reveal
        const finale = createUltimateFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎊 CHARGING COMPLETE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Charging Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Charging Sequence Failed!')
            .setDescription(`
The charging system encountered an overload!

*Please retry the Devil Fruit hunt!*
            `)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
