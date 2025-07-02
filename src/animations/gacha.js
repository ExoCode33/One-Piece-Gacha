const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    ULTIMATE TROLLING ENGINE
// ═══════════════════════════════════════════════════════════════════

const TrollingEngine = {
    // Lightning-fast rainbow colors
    rainbowColors: [
        '#FF0000', '#FF2200', '#FF4400', '#FF6600', '#FF8800', '#FFAA00',
        '#FFCC00', '#FFEE00', '#EEFF00', '#CCFF00', '#AAFF00', '#88FF00',
        '#66FF00', '#44FF00', '#22FF00', '#00FF00', '#00FF22', '#00FF44',
        '#00FF66', '#00FF88', '#00FFAA', '#00FFCC', '#00FFEE', '#00FFFF',
        '#00EEFF', '#00CCFF', '#00AAFF', '#0088FF', '#0066FF', '#0044FF',
        '#0022FF', '#0000FF', '#2200FF', '#4400FF', '#6600FF', '#8800FF',
        '#AA00FF', '#CC00FF', '#EE00FF', '#FF00FF', '#FF00EE', '#FF00CC',
        '#FF00AA', '#FF0088', '#FF0066', '#FF0044', '#FF0022'
    ],

    // PERFECT width system - everything exactly 52 characters
    PERFECT_WIDTH: 52,
    
    // Create perfectly sized frame
    createPerfectFrame(content, frameStyle = '█') {
        const innerWidth = this.PERFECT_WIDTH - 4; // Account for frame borders
        let displayContent = content;
        
        // Truncate if too long
        if (displayContent.length > innerWidth) {
            displayContent = displayContent.slice(0, innerWidth - 3) + '...';
        }
        
        // Pad to exact width
        const padding = innerWidth - displayContent.length;
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        
        const topLine = frameStyle.repeat(this.PERFECT_WIDTH);
        const contentLine = `${frameStyle} ${' '.repeat(leftPad)}${displayContent}${' '.repeat(rightPad)} ${frameStyle}`;
        const bottomLine = frameStyle.repeat(this.PERFECT_WIDTH);
        
        return `\`\`\`\n${topLine}\n${contentLine}\n${bottomLine}\n\`\`\``;
    },
    
    // Perfect separator line
    createPerfectSeparator(char = '═') {
        return char.repeat(this.PERFECT_WIDTH);
    },
    
    // Perfect effects bar
    createPerfectEffects(effects) {
        let effectsLine = effects;
        
        if (effectsLine.length > this.PERFECT_WIDTH) {
            effectsLine = effectsLine.slice(0, this.PERFECT_WIDTH);
        } else if (effectsLine.length < this.PERFECT_WIDTH) {
            const padding = this.PERFECT_WIDTH - effectsLine.length;
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            effectsLine = ' '.repeat(leftPad) + effectsLine + ' '.repeat(rightPad);
        }
        
        return effectsLine;
    },
    
    // Perfect charging bar
    createPerfectChargingBar(percentage) {
        const barWidth = 40;
        const filled = Math.floor((percentage / 100) * barWidth);
        const empty = barWidth - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        const barText = `[${bar}] ${percentage}%`;
        
        return this.createPerfectEffects(barText);
    },
    
    // Ultra-fast color cycling
    getUltraColor(frame) {
        return this.rainbowColors[frame % this.rainbowColors.length];
    },
    
    // Trolling fake reveals
    createFakeReveal(frame) {
        const fakeRarities = [
            { name: 'LEGENDARY', emoji: '🟡', color: '#F39C12' },
            { name: 'MYTHICAL', emoji: '🔴', color: '#E74C3C' },
            { name: 'OMNIPOTENT', emoji: '🌌', color: '#9B59B6' }
        ];
        
        const fake = fakeRarities[frame % fakeRarities.length];
        return fake;
    },
    
    // Power level effects
    createPowerText(text, level) {
        if (level <= 2) return text;
        if (level <= 4) return `*${text}*`;
        if (level <= 6) return `**${text}**`;
        if (level <= 8) return `***${text}***`;
        if (level <= 10) return `⚡ **${text}** ⚡`;
        return `💥 ⚡ ***${text}*** ⚡ 💥`;
    }
};

// ═══════════════════════════════════════════════════════════════════
//                    TROLLING ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Initial Scan (6 frames)
function createInitialScan(frame) {
    const percentage = Math.floor((frame / 5) * 20); // 0-20%
    
    const messages = [
        "🔍 Scanning the Grand Line...",
        "🌊 Detecting Devil Fruit energy...",
        "⚡ Energy patterns emerging...",
        "🔮 Mystical signature found...",
        "🌟 Something powerful detected...",
        "💫 Analyzing power levels..."
    ];
    
    const message = messages[frame] || messages[messages.length - 1];
    const styledMessage = TrollingEngine.createPowerText(message, frame + 1);
    
    const effects = '🔍'.repeat(Math.min(frame * 3 + 5, 15));
    const separator = TrollingEngine.createPerfectSeparator('─');
    const chargingBar = TrollingEngine.createPerfectChargingBar(percentage);
    const effectsBar = TrollingEngine.createPerfectEffects(effects);
    
    return new EmbedBuilder()
        .setTitle('🔍 DEVIL FRUIT SCANNER ACTIVATED')
        .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledMessage, '═')}
${separator}
🔋 **SCANNING SYSTEM ONLINE** 🔋
${chargingBar}
${separator}
*Probing the mysteries of the sea...*
${effectsBar}
        `)
        .setColor(TrollingEngine.getUltraColor(frame * 6))
        .setFooter({ text: `🔍 Scan Progress: ${percentage}% | Phase 1/7` });
}

// PHASE 2: Energy Build-up (8 frames)
function createEnergyBuildup(frame) {
    const percentage = 20 + Math.floor((frame / 7) * 30); // 20-50%
    
    const energyMessages = [
        "⚡ Low energy detected...",
        "🔥 Energy levels rising...",
        "⚡ Power signature strengthening...",
        "💥 Significant energy spike...",
        "⚡ STRONG POWER DETECTED...",
        "🔥 IMPRESSIVE ENERGY LEVELS...",
        "⚡ EXCEPTIONAL POWER FOUND...",
        "💥 EXTRAORDINARY ENERGY..."
    ];
    
    const message = energyMessages[frame] || energyMessages[energyMessages.length - 1];
    const styledMessage = TrollingEngine.createPowerText(message, frame + 2);
    
    const effects = '⚡'.repeat(Math.min(frame * 2 + 3, 18));
    const separator = TrollingEngine.createPerfectSeparator('═');
    const chargingBar = TrollingEngine.createPerfectChargingBar(percentage);
    const effectsBar = TrollingEngine.createPerfectEffects(effects);
    
    return new EmbedBuilder()
        .setTitle('⚡ ENERGY BUILD-UP DETECTED')
        .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledMessage, '▬')}
${separator}
⚡ **POWER LEVELS RISING** ⚡
${chargingBar}
${separator}
*The energy grows stronger...*
${effectsBar}
        `)
        .setColor(TrollingEngine.getUltraColor(frame * 8 + 10))
        .setFooter({ text: `⚡ Energy Level: ${percentage}% | Phase 2/7` });
}

// PHASE 3: FAKE LEGENDARY ALERT (10 frames) - MAJOR TROLLING
function createFakeLegendaryAlert(frame) {
    const percentage = 50 + Math.floor((frame / 9) * 25); // 50-75%
    
    const trollMessages = [
        "🟡 LEGENDARY signature detected...",
        "👑 LEGENDARY power confirmed...",
        "🟡 LEGENDARY Devil Fruit found...",
        "👑 LEGENDARY rarity verified...",
        "🟡 LEGENDARY energy overwhelming...",
        "👑 LEGENDARY class confirmed...",
        "🟡 LEGENDARY tier validated...",
        "👑 Wait... recalibrating...",
        "⚠️ Energy fluctuation detected...",
        "🔄 Rescanning power levels..."
    ];
    
    const message = trollMessages[frame] || trollMessages[trollMessages.length - 1];
    const styledMessage = TrollingEngine.createPowerText(message, frame + 3);
    
    // Use fake legendary colors for most frames
    let color = '#F39C12'; // Legendary gold
    if (frame >= 7) {
        color = TrollingEngine.getUltraColor(frame * 12 + 30); // Switch to random at the end
    }
    
    const effects = frame < 7 ? '👑🟡⚡🌟⚡🟡👑'.repeat(2) : '⚠️🔄⚠️🔄⚠️🔄⚠️🔄⚠️';
    const separator = TrollingEngine.createPerfectSeparator('█');
    const chargingBar = TrollingEngine.createPerfectChargingBar(percentage);
    const effectsBar = TrollingEngine.createPerfectEffects(effects);
    
    const title = frame < 7 ? '👑 LEGENDARY DETECTION! 👑' : '⚠️ RECALIBRATING SYSTEMS ⚠️';
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledMessage, '█')}
${separator}
👑 **${frame < 7 ? 'LEGENDARY CONFIRMED' : 'SYSTEM RECALIBRATION'}** 👑
${chargingBar}
${separator}
*${frame < 7 ? 'Incredible legendary power detected!' : 'Wait... something changed...'}*
${effectsBar}
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 7 ? '👑' : '⚠️'} Status: ${frame < 7 ? 'LEGENDARY CONFIRMED' : 'RECALIBRATING'} | ${percentage}%` });
}

// PHASE 4: FAKE MYTHICAL ESCALATION (8 frames) - MORE TROLLING
function createFakeMythicalEscalation(frame) {
    const percentage = 75 + Math.floor((frame / 7) * 15); // 75-90%
    
    const mythicalMessages = [
        "🔴 Wait... MYTHICAL energy detected!",
        "🔮 MYTHICAL power signature found!",
        "🔴 MYTHICAL tier Devil Fruit!",
        "🔮 MYTHICAL class confirmed!",
        "🔴 MYTHICAL rarity validated!",
        "🔮 MYTHICAL power overwhelming!",
        "🔴 Actually... detecting errors...",
        "⚠️ System malfunction detected..."
    ];
    
    const message = mythicalMessages[frame] || mythicalMessages[mythicalMessages.length - 1];
    const styledMessage = TrollingEngine.createPowerText(message, frame + 5);
    
    let color = '#E74C3C'; // Mythical red
    if (frame >= 6) {
        color = TrollingEngine.getUltraColor(frame * 15 + 45);
    }
    
    const effects = frame < 6 ? '🔮🔴✨💎✨🔴🔮'.repeat(2) : '⚠️❌⚠️❌⚠️❌⚠️❌⚠️';
    const separator = TrollingEngine.createPerfectSeparator('█');
    const chargingBar = TrollingEngine.createPerfectChargingBar(percentage);
    const effectsBar = TrollingEngine.createPerfectEffects(effects);
    
    const title = frame < 6 ? '🔮 MYTHICAL DETECTION! 🔮' : '⚠️ SYSTEM ERROR DETECTED ⚠️';
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledMessage, '█')}
${separator}
🔮 **${frame < 6 ? 'MYTHICAL CONFIRMED' : 'ERROR CORRECTION'}** 🔮
${chargingBar}
${separator}
*${frame < 6 ? 'Unbelievable mythical power!' : 'Systems detecting anomalies...'}*
${effectsBar}
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 6 ? '🔮' : '⚠️'} Status: ${frame < 6 ? 'MYTHICAL CONFIRMED' : 'ERROR CORRECTION'} | ${percentage}%` });
}

// PHASE 5: ULTIMATE FAKE OMNIPOTENT (6 frames) - MAXIMUM TROLLING
function createFakeOmnipotent(frame) {
    const percentage = 90 + Math.floor((frame / 5) * 10); // 90-100%
    
    const omnipotentMessages = [
        "🌌 OMNIPOTENT energy detected!!!",
        "💫 OMNIPOTENT power confirmed!!!",
        "🌌 OMNIPOTENT Devil Fruit found!!!",
        "💫 OMNIPOTENT class validated!!!",
        "🌌 Just kidding! Final scan...",
        "🔍 Revealing true results..."
    ];
    
    const message = omnipotentMessages[frame] || omnipotentMessages[omnipotentMessages.length - 1];
    const styledMessage = TrollingEngine.createPowerText(message, frame + 8);
    
    let color = '#9B59B6'; // Omnipotent purple
    if (frame >= 4) {
        color = TrollingEngine.getUltraColor(frame * 20 + 60);
    }
    
    const effects = frame < 4 ? '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐' : '😏🎭😏🎭😏🎭😏🎭😏🎭😏🎭😏';
    const separator = TrollingEngine.createPerfectSeparator('█');
    const chargingBar = TrollingEngine.createPerfectChargingBar(percentage);
    const effectsBar = TrollingEngine.createPerfectEffects(effects);
    
    const title = frame < 4 ? '🌌 OMNIPOTENT DETECTION! 🌌' : '😏 TROLLING COMPLETE! 😏';
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledMessage, '█')}
${separator}
🌌 **${frame < 4 ? 'OMNIPOTENT CONFIRMED' : 'GOTCHA! FINAL SCAN'}** 🌌
${chargingBar}
${separator}
*${frame < 4 ? 'REALITY-BENDING POWER!!!' : 'Did we get you excited? Now for real...'}*
${effectsBar}
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 4 ? '🌌' : '😏'} Status: ${frame < 4 ? 'OMNIPOTENT!!!' : 'TROLLING COMPLETE'} | ${percentage}%` });
}

// PHASE 6: Real Result Reveal (5 frames)
async function createRealReveal(interaction, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const frames = 5;
    
    for (let frame = 0; frame < frames; frame++) {
        const realMessages = [
            "📍 Actual scan complete...",
            "🔍 Real results incoming...",
            "📊 True rarity confirmed...",
            "✅ Genuine Devil Fruit found...",
            "🎯 Final result ready..."
        ];
        
        const message = realMessages[frame] || realMessages[realMessages.length - 1];
        const styledMessage = TrollingEngine.createPowerText(message, frame + 3);
        
        const effects = config.emoji.repeat(Math.min(frame * 4 + 8, 20));
        const separator = TrollingEngine.createPerfectSeparator('═');
        const chargingBar = TrollingEngine.createPerfectChargingBar(100);
        const effectsBar = TrollingEngine.createPerfectEffects(effects);
        
        const embed = new EmbedBuilder()
            .setTitle('📍 REAL SCAN RESULTS')
            .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledMessage, '═')}
${separator}
✅ **GENUINE RESULTS INCOMING** ✅
${chargingBar}
${separator}
*Here's what you actually got...*
${effectsBar}
            `)
            .setColor(TrollingEngine.getUltraColor(frame * 25 + 80))
            .setFooter({ text: `📍 Final Scan: ${Math.floor(((frame + 1) / frames) * 100)}% | REAL RESULTS` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 600));
    }
}

// PHASE 7: True Devil Fruit Reveal
async function createTrueDevilFruitReveal(interaction, devilFruit, rarity) {
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
        
        const styledName = TrollingEngine.createPowerText(displayName, 10);
        
        // Info reveal
        const infoLines = [
            `📋 **Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `👤 **User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `⚡ **Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `⭐ **Rarity:** ${frame >= 4 ? config.name : '???'}`,
            `🔥 **Power Level:** ${frame >= 5 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const effects = config.emoji.repeat(Math.min(frame * 3 + 10, 25));
        const separator = TrollingEngine.createPerfectSeparator('█');
        const effectsBar = TrollingEngine.createPerfectEffects(effects);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MATERIALIZED ${config.emoji}`)
            .setDescription(`
${effectsBar}
${separator}
${TrollingEngine.createPerfectFrame(styledName, '█')}
${separator}
${infoLines.join('\n')}
${separator}
${config.stars.repeat(Math.min(frame + 3, 8))}
${effectsBar}
            `)
            .setColor(config.color)
            .setFooter({ text: `🍈 Materialization: ${Math.floor(progress * 100)}% | ${config.name}` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// PHASE 8: Epic Finale
function createEpicFinale(devilFruit, rarity, interaction) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const finaleMessages = {
        omnipotent: '🌌 ACTUALLY OMNIPOTENT! 🌌',
        mythical: '🔮 ACTUALLY MYTHICAL! 🔮',
        legendary: '👑 ACTUALLY LEGENDARY! 👑',
        rare: '💎 RARE DEVIL FRUIT! 💎',
        uncommon: '🌟 UNCOMMON DEVIL FRUIT! 🌟',
        common: '⚓ COMMON DEVIL FRUIT! ⚓'
    };
    
    const effects = {
        omnipotent: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫',
        mythical: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮',
        legendary: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑',
        rare: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎',
        uncommon: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟',
        common: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓'
    };
    
    const epicName = TrollingEngine.createPowerText(devilFruit.name, 10);
    const finalEffect = effects[rarity] || effects.common;
    const finalTitle = finaleMessages[rarity] || finaleMessages.common;
    
    const trollMessage = rarity === 'omnipotent' ? 
        "Wait... this is ACTUALLY omnipotent! We weren't trolling this time! 😱" :
        rarity === 'mythical' ? 
        "Plot twist - it's ACTUALLY mythical! The troll became real! 🤯" :
        rarity === 'legendary' ?
        "Surprise! It's ACTUALLY legendary after all! 😲" :
        "Well, the trolling was fun, but here's your real Devil Fruit! 😄";
    
    const perfectEffects = TrollingEngine.createPerfectEffects(finalEffect);
    const separator = TrollingEngine.createPerfectSeparator('█');
    
    const description = `
${perfectEffects}
${separator}
${TrollingEngine.createPerfectFrame(epicName, '█')}
${separator}
**${finalTitle}**

🍈 **${devilFruit.name}**
📋 **Type:** ${devilFruit.type}
👤 **User:** ${devilFruit.user}
⚡ **Power:** ${devilFruit.power}
🔥 **Power Level:** ${devilFruit.powerLevel.toLocaleString()}
⭐ **Rarity:** ${config.name}

${config.stars.repeat(10)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆

😏 *${trollMessage}*

> *"${devilFruit.description}"*

${separator}
${perfectEffects}
    `;

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('🎭 Get Trolled Again!')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('view_collection')
                .setLabel('📚 Collection')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('fruit_details')
                .setLabel('🔍 Details')
                .setStyle(ButtonStyle.Success)
        );

    return {
        embed: new EmbedBuilder()
            .setTitle(`${config.emoji} ${epicName} ${config.emoji}`)
            .setDescription(description)
            .setColor(config.color)
            .setFooter({ 
                text: `🎭 Trolling Complete | Devil Fruit found by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// ═══════════════════════════════════════════════════════════════════
//                    MASTER TROLLING SEQUENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 TROLLING SEQUENCE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Initial Scan (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createInitialScan(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 2: Energy Build-up (8 frames, 3 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createEnergyBuildup(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 375));
        }
        
        // PHASE 3: FAKE LEGENDARY (10 frames, 4 seconds) - TROLLING BEGINS
        for (let frame = 0; frame < 10; frame++) {
            const embed = createFakeLegendaryAlert(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 400));
        }
        
        // PHASE 4: FAKE MYTHICAL (8 frames, 3 seconds) - MORE TROLLING
        for (let frame = 0; frame < 8; frame++) {
            const embed = createFakeMythicalEscalation(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 375));
        }
        
        // PHASE 5: FAKE OMNIPOTENT (6 frames, 3 seconds) - MAXIMUM TROLL
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFakeOmnipotent(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 6: Real Reveal (5 frames, 3 seconds)
        await createRealReveal(interaction, rarity);
        
        // PHASE 7: True Devil Fruit Reveal (6 frames, 5 seconds)
        await createTrueDevilFruitReveal(interaction, devilFruit, rarity);
        
        // PHASE 8: Epic Finale
        const finale = createEpicFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎭 TROLLING COMPLETE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Trolling Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Trolling System Failed!')
            .setDescription(`
The trolling sequence crashed!

*Even our trolls have bugs sometimes!*
            `)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
