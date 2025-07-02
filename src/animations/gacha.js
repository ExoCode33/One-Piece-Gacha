const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    PERFECT SURPRISE ENGINE
// ═══════════════════════════════════════════════════════════════════

const SurpriseEngine = {
    // Lightning-fast rainbow colors
    rainbowColors: [
        '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
        '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
        '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
        '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
        '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033'
    ],

    // PERFECT width system
    PERFECT_WIDTH: 50,
    
    // Create perfectly sized frame
    createPerfectFrame(content, frameStyle = '█') {
        const innerWidth = this.PERFECT_WIDTH - 4;
        let displayContent = content;
        
        if (displayContent.length > innerWidth) {
            displayContent = displayContent.slice(0, innerWidth - 3) + '...';
        }
        
        const padding = innerWidth - displayContent.length;
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        
        const topLine = frameStyle.repeat(this.PERFECT_WIDTH);
        const contentLine = `${frameStyle} ${' '.repeat(leftPad)}${displayContent}${' '.repeat(rightPad)} ${frameStyle}`;
        const bottomLine = frameStyle.repeat(this.PERFECT_WIDTH);
        
        return `\`\`\`\n${topLine}\n${contentLine}\n${bottomLine}\n\`\`\``;
    },
    
    // Perfect separator
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
        const barWidth = 35;
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
    
    // Power level effects with color variety
    createPowerText(text, level, useRed = false) {
        if (useRed) {
            // Red text variations
            if (level <= 2) return `🔴 ${text}`;
            if (level <= 4) return `🔴 *${text}*`;
            if (level <= 6) return `🔴 **${text}**`;
            if (level <= 8) return `🔴 ***${text}***`;
            if (level <= 10) return `🔴 ⚡ **${text}** ⚡`;
            return `🔴 💥 ⚡ ***${text}*** ⚡ 💥`;
        } else {
            // Regular text variations
            if (level <= 2) return text;
            if (level <= 4) return `*${text}*`;
            if (level <= 6) return `**${text}**`;
            if (level <= 8) return `***${text}***`;
            if (level <= 10) return `⚡ **${text}** ⚡`;
            return `💥 ⚡ ***${text}*** ⚡ 💥`;
        }
    },
    
    // Randomized message pools
    getRandomMessage(messagePool) {
        return messagePool[Math.floor(Math.random() * messagePool.length)];
    },
    
    // Randomize fake rarity sequence
    getRandomFakeSequence() {
        const sequences = [
            ['legendary', 'mythical', 'omnipotent'],
            ['mythical', 'legendary', 'omnipotent'],
            ['legendary', 'omnipotent', 'mythical'],
            ['mythical', 'omnipotent', 'legendary'],
            ['omnipotent', 'legendary', 'mythical'],
            ['legendary', 'mythical'] // Sometimes skip omnipotent
        ];
        return sequences[Math.floor(Math.random() * sequences.length)];
    }
};

// ═══════════════════════════════════════════════════════════════════
//                    SURPRISE ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Initial Scan (6 frames)
function createInitialScan(frame) {
    const percentage = Math.floor((frame / 5) * 25);
    
    const messagePool = [
        "🔍 Scanning Devil Fruit energy...",
        "🌊 Detecting mystical signatures...",
        "⚡ Analyzing power patterns...",
        "🔮 Reading energy frequencies...",
        "🌟 Locating Devil Fruit source...",
        "💫 Probing dimensional barriers..."
    ];
    
    const message = SurpriseEngine.getRandomMessage(messagePool);
    const useRed = Math.random() < 0.3; // 30% chance for red text
    const styledMessage = SurpriseEngine.createPowerText(message, frame + 1, useRed);
    
    const effectsPool = ['🔍', '🌊', '⚡', '🔮', '🌟', '💫'];
    const effect = effectsPool[frame % effectsPool.length];
    const effects = effect.repeat(Math.min(frame * 2 + 6, 16));
    
    const separator = SurpriseEngine.createPerfectSeparator('─');
    const chargingBar = SurpriseEngine.createPerfectChargingBar(percentage);
    const effectsBar = SurpriseEngine.createPerfectEffects(effects);
    
    return new EmbedBuilder()
        .setTitle('🔍 DEVIL FRUIT SCANNER ACTIVATED')
        .setDescription(`
${effectsBar}
${separator}
${SurpriseEngine.createPerfectFrame(styledMessage, '═')}
${separator}
🔋 **SCANNING SYSTEM ONLINE** 🔋
${chargingBar}
${separator}
*Probing the mysteries of the Grand Line...*
${effectsBar}
        `)
        .setColor(SurpriseEngine.getUltraColor(frame * 6))
        .setFooter({ text: `🔍 Scan Progress: ${percentage}% | Initializing Systems` });
}

// PHASE 2: Energy Detection (8 frames)
function createEnergyDetection(frame) {
    const percentage = 25 + Math.floor((frame / 7) * 30);
    
    const messagePool = [
        "⚡ Weak energy signature found...",
        "🔥 Energy levels increasing...",
        "⚡ Power readings climbing...",
        "💥 Significant energy detected...",
        "⚡ STRONG power levels found...",
        "🔥 IMPRESSIVE energy readings...",
        "⚡ EXCEPTIONAL power detected...",
        "💥 EXTRAORDINARY energy levels..."
    ];
    
    const message = messagePool[frame] || SurpriseEngine.getRandomMessage(messagePool);
    const useRed = Math.random() < 0.4; // 40% chance for red text
    const styledMessage = SurpriseEngine.createPowerText(message, frame + 2, useRed);
    
    const effectsPool = ['⚡', '🔥', '💥', '⭐', '🌟', '💫'];
    const effect = effectsPool[Math.floor(Math.random() * effectsPool.length)];
    const effects = effect.repeat(Math.min(frame * 2 + 4, 18));
    
    const separator = SurpriseEngine.createPerfectSeparator('═');
    const chargingBar = SurpriseEngine.createPerfectChargingBar(percentage);
    const effectsBar = SurpriseEngine.createPerfectEffects(effects);
    
    return new EmbedBuilder()
        .setTitle('⚡ ENERGY SIGNATURE DETECTED')
        .setDescription(`
${effectsBar}
${separator}
${SurpriseEngine.createPerfectFrame(styledMessage, '▬')}
${separator}
⚡ **POWER LEVELS RISING** ⚡
${chargingBar}
${separator}
*Energy signature strengthening...*
${effectsBar}
        `)
        .setColor(SurpriseEngine.getUltraColor(frame * 8 + 15))
        .setFooter({ text: `⚡ Energy Level: ${percentage}% | Power Detection Active` });
}

// PHASE 3: Fake High Rarity Detection (randomized)
function createFakeHighRarityDetection(frame, fakeRarity) {
    const percentage = 50 + Math.floor((frame / 9) * 30);
    
    const rarityConfigs = {
        legendary: {
            emoji: '🟡',
            color: '#F39C12',
            name: 'LEGENDARY',
            effects: '👑🟡⚡🌟⚡🟡👑',
            messages: [
                "🟡 High-tier signature detected...",
                "👑 Exceptional power confirmed...",
                "🟡 Elite-class energy found...",
                "👑 Superior rarity detected...",
                "🟡 HIGH-GRADE Devil Fruit located...",
                "👑 PREMIUM power signature...",
                "🟡 ELITE-TIER energy confirmed...",
                "👑 Wait... the winds are shifting...",
                "⚠️ The Grand Line is changing course...",
                "🔄 Mysterious currents detected..."
            ]
        },
        mythical: {
            emoji: '🔴',
            color: '#E74C3C',
            name: 'MYTHICAL',
            effects: '🔮🔴✨💎✨🔴🔮',
            messages: [
                "🔴 Ancient power signature...",
                "🔮 Legendary-tier energy found...",
                "🔴 Mythic-class power detected...",
                "🔮 World-class energy confirmed...",
                "🔴 ANCIENT Devil Fruit located...",
                "🔮 MYTHIC power overwhelming...",
                "🔴 WORLD-TIER energy detected...",
                "🔮 Actually... the sea is shifting...",
                "⚠️ Ocean currents are changing...",
                "🔄 The Grand Line stirs again..."
            ]
        },
        omnipotent: {
            emoji: '🌌',
            color: '#9B59B6',
            name: 'OMNIPOTENT',
            effects: '🌌💫⭐🌟💫🌌💫',
            messages: [
                "🌌 Cosmic signature detected...",
                "💫 Reality-tier power found...",
                "🌌 Universal-class energy...",
                "💫 Omnipotent force detected...",
                "🌌 COSMIC Devil Fruit found...",
                "💫 REALITY-BENDING power...",
                "🌌 UNIVERSAL energy confirmed...",
                "💫 Hold on... the seas are restless...",
                "⚠️ Ocean mysteries deepening...",
                "🔄 The Grand Line reveals more..."
            ]
        }
    };
    
    const config = rarityConfigs[fakeRarity];
    const message = config.messages[frame] || SurpriseEngine.getRandomMessage(config.messages);
    const useRed = Math.random() < 0.5; // 50% chance for red text
    const styledMessage = SurpriseEngine.createPowerText(message, frame + 4, useRed);
    
    // Change color and effects in final frames to show "error"
    let color = config.color;
    let effects = config.effects.repeat(2);
    let title = `${config.emoji} ${config.name} DETECTED! ${config.emoji}`;
    
    if (frame >= 7) {
        color = SurpriseEngine.getUltraColor(frame * 15 + 40);
        effects = '🌊🔄🌊🔄🌊🔄🌊🔄🌊🔄🌊🔄🌊';
        title = '🌊 THE SEAS ARE SHIFTING 🌊';
    }
    
    const separator = SurpriseEngine.createPerfectSeparator('█');
    const chargingBar = SurpriseEngine.createPerfectChargingBar(percentage);
    const effectsBar = SurpriseEngine.createPerfectEffects(effects);
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effectsBar}
${separator}
${SurpriseEngine.createPerfectFrame(styledMessage, '█')}
${separator}
${config.emoji} **${frame < 7 ? config.name + ' CONFIRMED' : 'RECALIBRATING SYSTEMS'}** ${config.emoji}
${chargingBar}
${separator}
*${frame < 7 ? 'Incredible power detected!' : 'Sensors require adjustment...'}*
${effectsBar}
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 7 ? config.emoji : '🌊'} Status: ${frame < 7 ? config.name + ' CLASS' : 'SEAS SHIFTING'} | ${percentage}%` });
}

// PHASE 4: Final Calibration (6 frames)
function createFinalCalibration(frame) {
    const percentage = 80 + Math.floor((frame / 5) * 20);
    
    const messagePool = [
        "🌊 The sea reveals its true nature...",
        "📊 Reading the ocean's final secrets...",
        "🎯 The Grand Line shows its hand...",
        "✅ The seas have spoken...",
        "📍 Ocean mysteries unveiled...",
        "🎯 The true treasure emerges..."
    ];
    
    const message = messagePool[frame] || SurpriseEngine.getRandomMessage(messagePool);
    const useRed = Math.random() < 0.3;
    const styledMessage = SurpriseEngine.createPowerText(message, frame + 3, useRed);
    
    const effects = '🌊📊🎯✅📍🎯'.repeat(Math.floor(frame / 2) + 2);
    const separator = SurpriseEngine.createPerfectSeparator('═');
    const chargingBar = SurpriseEngine.createPerfectChargingBar(percentage);
    const effectsBar = SurpriseEngine.createPerfectEffects(effects);
    
    return new EmbedBuilder()
        .setTitle('📍 THE SEAS REVEAL TRUTH')
        .setDescription(`
${effectsBar}
${separator}
${SurpriseEngine.createPerfectFrame(styledMessage, '═')}
${separator}
✅ **THE OCEAN HAS SPOKEN** ✅
${chargingBar}
${separator}
*The Grand Line reveals its secrets...*
${effectsBar}
        `)
        .setColor(SurpriseEngine.getUltraColor(frame * 20 + 60))
        .setFooter({ text: `📍 Ocean Truth: ${percentage}% | The Seas Speak` });
}

// PHASE 5: True Devil Fruit Reveal
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
        
        const useRed = Math.random() < 0.4;
        const styledName = SurpriseEngine.createPowerText(displayName, 10, useRed);
        
        // Info reveal
        const infoLines = [
            `📋 **Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `👤 **User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `⚡ **Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `⭐ **Rarity:** ${frame >= 4 ? config.name : '???'}`,
            `🔥 **Power Level:** ${frame >= 5 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const effects = config.emoji.repeat(Math.min(frame * 3 + 8, 20));
        const separator = SurpriseEngine.createPerfectSeparator('█');
        const effectsBar = SurpriseEngine.createPerfectEffects(effects);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MATERIALIZED ${config.emoji}`)
            .setDescription(`
${effectsBar}
${separator}
${SurpriseEngine.createPerfectFrame(styledName, '█')}
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

// PHASE 6: Epic Finale
function createEpicFinale(devilFruit, rarity, interaction) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const finaleMessages = {
        omnipotent: '🌌 OMNIPOTENT DEVIL FRUIT! 🌌',
        mythical: '🔮 MYTHICAL DEVIL FRUIT! 🔮',
        legendary: '👑 LEGENDARY DEVIL FRUIT! 👑',
        rare: '💎 RARE DEVIL FRUIT! 💎',
        uncommon: '🌟 UNCOMMON DEVIL FRUIT! 🌟',
        common: '⚓ DEVIL FRUIT DISCOVERED! ⚓'
    };
    
    const effects = {
        omnipotent: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
        mythical: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮✨🌟💎',
        legendary: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑⚡🔥🌟',
        rare: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎🌟✨⭐',
        uncommon: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟⭐✨💫',
        common: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐'
    };
    
    const epicName = SurpriseEngine.createPowerText(devilFruit.name, 10);
    const finalEffect = effects[rarity] || effects.common;
    const finalTitle = finaleMessages[rarity] || finaleMessages.common;
    
    // Special message for high rarities without revealing the surprise
    const specialMessage = rarity === 'omnipotent' ? 
        "Incredible! This is genuinely omnipotent-tier! 😲" :
        rarity === 'mythical' ? 
        "Amazing! This is actually mythical-class! 🤯" :
        rarity === 'legendary' ?
        "Fantastic! This is truly legendary-grade! 😍" :
        "Great discovery! Here's your Devil Fruit! 😊";
    
    const perfectEffects = SurpriseEngine.createPerfectEffects(finalEffect);
    const separator = SurpriseEngine.createPerfectSeparator('█');
    
    const description = `
${perfectEffects}
${separator}
${SurpriseEngine.createPerfectFrame(epicName, '█')}
${separator}
**${finalTitle}**

🍈 **${devilFruit.name}**
📋 **Type:** ${devilFruit.type}
👤 **User:** ${devilFruit.user}
⚡ **Power:** ${devilFruit.power}
🔥 **Power Level:** ${devilFruit.powerLevel.toLocaleString()}
⭐ **Rarity:** ${config.name}

${config.stars.repeat(8)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆

😊 *${specialMessage}*

> *"${devilFruit.description}"*

${separator}
${perfectEffects}
    `;

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('🍈 Hunt Again!')
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
                text: `🍈 Devil Fruit Hunt Complete | Discovered by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// ═══════════════════════════════════════════════════════════════════
//                    MASTER SURPRISE SEQUENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        // Randomize fake sequence
        const fakeSequence = SurpriseEngine.getRandomFakeSequence();
        
        console.log(`🎮 SURPRISE SEQUENCE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Initial Scan (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createInitialScan(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 2: Energy Detection (8 frames, 3 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createEnergyDetection(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 375));
        }
        
        // PHASE 3: Randomized Fake High Rarity Detection (10 frames each)
        for (const fakeRarity of fakeSequence) {
            for (let frame = 0; frame < 10; frame++) {
                const embed = createFakeHighRarityDetection(frame, fakeRarity);
                await interaction.editReply({ embeds: [embed] });
                await new Promise(resolve => setTimeout(resolve, 350));
            }
        }
        
        // PHASE 4: Final Calibration (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalCalibration(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 5: True Devil Fruit Reveal (6 frames, 5 seconds)
        await createTrueDevilFruitReveal(interaction, devilFruit, rarity);
        
        // PHASE 6: Epic Finale
        const finale = createEpicFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎊 SURPRISE COMPLETE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Surprise Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Hunt System Error!')
            .setDescription(`
The Devil Fruit hunt encountered an error!

*Please try hunting again!*
            `)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
