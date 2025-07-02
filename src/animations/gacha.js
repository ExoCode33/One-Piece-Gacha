const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    EPIC IMPROVED ENGINE
// ═══════════════════════════════════════════════════════════════════

const EpicEngine = {
    // Ultra-fast rainbow colors
    rainbowColors: [
        '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
        '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
        '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
        '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
        '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033'
    ],

    // Perfect width system
    PERFECT_WIDTH: 45,
    
    // Create simple clean text display - NO WHITE BARS
    createCleanDisplay(content) {
        const width = this.PERFECT_WIDTH;
        let cleanContent = content.replace(/\*+/g, '').trim();
        
        if (cleanContent.length > width) {
            cleanContent = cleanContent.slice(0, width - 3) + '...';
        }
        
        const padding = width - cleanContent.length;
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        
        return ' '.repeat(leftPad) + cleanContent + ' '.repeat(rightPad);
    },

    // Simple separator line
    createSeparator(char = '═') {
        return char.repeat(this.PERFECT_WIDTH);
    },

    // Simple effects line
    createEffectsLine(effects) {
        return this.createCleanDisplay(effects);
    },

    // Simple progress display - NO BARS
    createProgressDisplay(percentage) {
        return this.createCleanDisplay(`Power Level: ${percentage}%`);
    },

    // Ultra-fast color
    getUltraColor(frame) {
        return this.rainbowColors[frame % this.rainbowColors.length];
    },

    // Simple text styling
    createStyledText(text, useRed = false) {
        return useRed ? `🔴 ${text}` : text;
    },

    // Get random message
    getRandomMessage(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }
};

// ═══════════════════════════════════════════════════════════════════
//                    IMPROVED ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Scanning (6 frames)
function createScanning(frame) {
    const percentage = Math.floor((frame / 5) * 30);
    
    const messages = [
        "🔍 Searching the Grand Line depths...",
        "🌊 Sensing Devil Fruit energy...",
        "⚡ Detecting mysterious power...",
        "🔮 Something valuable approaching...",
        "🌟 Incredible energy building...",
        "💫 Massive power signature found..."
    ];
    
    const message = messages[frame] || EpicEngine.getRandomMessage(messages);
    const useRed = Math.random() < 0.3;
    const styledMessage = EpicEngine.createStyledText(message, useRed);
    
    const effects = '🔍🌊⚡🔮🌟💫'.repeat(3);
    const separator = EpicEngine.createSeparator('─');
    const progress = EpicEngine.createProgressDisplay(percentage);
    const effectsLine = EpicEngine.createEffectsLine(effects);
    
    return new EmbedBuilder()
        .setTitle('🔍 DEVIL FRUIT HUNT ACTIVE')
        .setDescription(`
${effectsLine}

${separator}

**${styledMessage}**

${progress}

${separator}

*The Grand Line holds many secrets...*
        `)
        .setColor(EpicEngine.getUltraColor(frame * 8))
        .setFooter({ text: `🔍 Scanning: ${percentage}% | Searching the seas...` });
}

// PHASE 2: Power Buildup (8 frames)
function createPowerBuildup(frame) {
    const percentage = 30 + Math.floor((frame / 7) * 40);
    
    const messages = [
        "⚡ Weak power detected...",
        "🔥 Energy levels rising...",
        "⚡ Growing stronger...",
        "💥 Significant power found...",
        "⚡ STRONG energy detected...",
        "🔥 IMPRESSIVE power levels...",
        "⚡ AMAZING energy signature...",
        "💥 INCREDIBLE power building..."
    ];
    
    const message = messages[frame] || EpicEngine.getRandomMessage(messages);
    const useRed = Math.random() < 0.4;
    const styledMessage = EpicEngine.createStyledText(message, useRed);
    
    const effects = '⚡🔥💥🌟💫✨'.repeat(3);
    const separator = EpicEngine.createSeparator('═');
    const progress = EpicEngine.createProgressDisplay(percentage);
    const effectsLine = EpicEngine.createEffectsLine(effects);
    
    return new EmbedBuilder()
        .setTitle('⚡ POWERFUL ENERGY RISING')
        .setDescription(`
${effectsLine}

${separator}

**${styledMessage}**

${progress}

${separator}

*Something special is emerging...*
        `)
        .setColor(EpicEngine.getUltraColor(frame * 10 + 20))
        .setFooter({ text: `⚡ Power: ${percentage}% | Energy building...` });
}

// PHASE 3: CONVINCING Fake Legendary (12 frames) - MUCH BETTER TROLLING
function createConvincingFakeLegendary(frame) {
    const percentage = 70 + Math.floor((frame / 11) * 25);
    
    const messages = [
        "🟡 LEGENDARY signature emerging...",
        "👑 LEGENDARY-class power confirmed...",
        "🟡 This is definitely LEGENDARY...",
        "👑 LEGENDARY Devil Fruit located...",
        "🟡 100% LEGENDARY confirmation...",
        "👑 LEGENDARY power overwhelming...",
        "🟡 LEGENDARY rarity locked in...",
        "👑 LEGENDARY energy at maximum...",
        "🟡 Wait... the seas are changing...",
        "🌊 Ocean currents shifting...",
        "🌊 The Grand Line speaks differently...",
        "🌊 New revelations emerging..."
    ];
    
    const message = messages[frame] || EpicEngine.getRandomMessage(messages);
    const useRed = frame >= 8 ? true : Math.random() < 0.2;
    const styledMessage = EpicEngine.createStyledText(message, useRed);
    
    // Use real legendary colors for most frames to be convincing
    let color = '#F39C12'; // Legendary gold
    let effects = '👑🟡⚡🌟⚡🟡👑'.repeat(2);
    let title = '👑 LEGENDARY DEVIL FRUIT! 👑';
    
    // Only in final frames show the "shift"
    if (frame >= 8) {
        color = EpicEngine.getUltraColor(frame * 15 + 60);
        effects = '🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊';
        title = '🌊 THE GRAND LINE SHIFTS 🌊';
    }
    
    const separator = EpicEngine.createSeparator('█');
    const progress = EpicEngine.createProgressDisplay(percentage);
    const effectsLine = EpicEngine.createEffectsLine(effects);
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effectsLine}

${separator}

**${styledMessage}**

${progress}

${separator}

*${frame < 8 ? 'LEGENDARY power confirmed!' : 'The ocean reveals new truths...'}*
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 8 ? '👑' : '🌊'} Status: ${frame < 8 ? 'LEGENDARY CONFIRMED' : 'SEAS SHIFTING'} | ${percentage}%` });
}

// PHASE 4: CONVINCING Fake Mythical (10 frames) - EVEN BETTER TROLLING
function createConvincingFakeMythical(frame) {
    const percentage = 85 + Math.floor((frame / 9) * 15);
    
    const messages = [
        "🔴 Actually... MYTHICAL detected!",
        "🔮 MYTHICAL-tier power confirmed!",
        "🔴 This is genuinely MYTHICAL!",
        "🔮 MYTHICAL Devil Fruit verified!",
        "🔴 MYTHICAL class absolutely certain!",
        "🔮 MYTHICAL energy beyond doubt!",
        "🔴 MYTHICAL power at peak levels!",
        "🔮 But wait... something deeper stirs...",
        "🌊 The ocean depths call out...",
        "🌊 Ancient secrets awakening..."
    ];
    
    const message = messages[frame] || EpicEngine.getRandomMessage(messages);
    const useRed = frame >= 7 ? true : Math.random() < 0.3;
    const styledMessage = EpicEngine.createStyledText(message, useRed);
    
    // Use real mythical colors to be super convincing
    let color = '#E74C3C'; // Mythical red
    let effects = '🔮🔴✨💎✨🔴🔮'.repeat(2);
    let title = '🔮 MYTHICAL DEVIL FRUIT! 🔮';
    
    if (frame >= 7) {
        color = EpicEngine.getUltraColor(frame * 18 + 80);
        effects = '🌊🔥🌊🔥🌊🔥🌊🔥🌊🔥🌊🔥🌊';
        title = '🌊 DEEPER MYSTERIES EMERGE 🌊';
    }
    
    const separator = EpicEngine.createSeparator('█');
    const progress = EpicEngine.createProgressDisplay(percentage);
    const effectsLine = EpicEngine.createEffectsLine(effects);
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effectsLine}

${separator}

**${styledMessage}**

${progress}

${separator}

*${frame < 7 ? 'MYTHICAL power overwhelming!' : 'Ancient ocean secrets stirring...'}*
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 7 ? '🔮' : '🌊'} Status: ${frame < 7 ? 'MYTHICAL CONFIRMED' : 'ANCIENT STIRRING'} | ${percentage}%` });
}

// PHASE 5: Final Truth (6 frames)
function createFinalTruth(frame) {
    const percentage = 95 + Math.floor((frame / 5) * 5);
    
    const messages = [
        "🎯 The ocean reveals its true gift...",
        "🌊 The Grand Line shows its hand...",
        "✅ True power level emerging...",
        "📍 Genuine Devil Fruit materializing...",
        "🎯 The seas have spoken clearly...",
        "✅ Your real treasure appears..."
    ];
    
    const message = messages[frame] || EpicEngine.getRandomMessage(messages);
    const useRed = Math.random() < 0.3;
    const styledMessage = EpicEngine.createStyledText(message, useRed);
    
    const effects = '🎯🌊✅📍🎯🌊'.repeat(3);
    const separator = EpicEngine.createSeparator('═');
    const progress = EpicEngine.createProgressDisplay(percentage);
    const effectsLine = EpicEngine.createEffectsLine(effects);
    
    return new EmbedBuilder()
        .setTitle('🎯 THE OCEAN SPEAKS TRUTH')
        .setDescription(`
${effectsLine}

${separator}

**${styledMessage}**

${progress}

${separator}

*The Grand Line reveals your destiny...*
        `)
        .setColor(EpicEngine.getUltraColor(frame * 25 + 100))
        .setFooter({ text: `🎯 Truth: ${percentage}% | The seas reveal all` });
}

// PHASE 6: Devil Fruit Materialization
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
        
        const styledName = EpicEngine.createStyledText(displayName, Math.random() < 0.4);
        
        // Info reveal
        const infoLines = [
            `📋 **Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `👤 **User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `⚡ **Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `⭐ **Rarity:** ${frame >= 4 ? config.name : '???'}`,
            `🔥 **Power Level:** ${frame >= 5 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const effects = config.emoji.repeat(15);
        const separator = EpicEngine.createSeparator('█');
        const effectsLine = EpicEngine.createEffectsLine(effects);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MANIFESTS ${config.emoji}`)
            .setDescription(`
${effectsLine}

${separator}

**${styledName}**

${infoLines.join('\n')}

${config.stars.repeat(Math.min(frame + 3, 8))}

${separator}
            `)
            .setColor(config.color)
            .setFooter({ text: `🍈 Manifestation: ${Math.floor(progress * 100)}% | ${config.name}` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// PHASE 7: Epic Finale
function createEpicFinale(devilFruit, rarity, interaction) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const finaleMessages = {
        omnipotent: '🌌 ACTUALLY OMNIPOTENT! INCREDIBLE! 🌌',
        mythical: '🔮 WAIT... THIS IS ACTUALLY MYTHICAL! 🔮',
        legendary: '👑 SURPRISE! ACTUALLY LEGENDARY! 👑',
        rare: '💎 RARE DEVIL FRUIT DISCOVERED! 💎',
        uncommon: '🌟 UNCOMMON DEVIL FRUIT FOUND! 🌟',
        common: '⚓ DEVIL FRUIT COLLECTED! ⚓'
    };
    
    const effects = {
        omnipotent: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
        mythical: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮✨🌟💎',
        legendary: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑⚡🔥🌟',
        rare: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎🌟✨⭐',
        uncommon: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟⭐✨💫',
        common: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐'
    };
    
    const epicName = EpicEngine.createStyledText(devilFruit.name);
    const finalEffect = effects[rarity] || effects.common;
    const finalTitle = finaleMessages[rarity] || finaleMessages.common;
    
    // Surprise messages for high rarities
    const surpriseMessage = rarity === 'omnipotent' ? 
        "WHOA! The fake readings were wrong - this is ACTUALLY omnipotent! 😱" :
        rarity === 'mythical' ? 
        "AMAZING! Plot twist - this really IS mythical after all! 🤯" :
        rarity === 'legendary' ?
        "INCREDIBLE! The legendary reading was actually correct! 😍" :
        "The Grand Line has blessed you with this Devil Fruit! 😊";
    
    const perfectEffects = EpicEngine.createEffectsLine(finalEffect);
    const separator = EpicEngine.createSeparator('█');
    
    const description = `
${perfectEffects}

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

😄 *${surpriseMessage}*

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
                text: `🍈 Devil Fruit Hunt Complete | Found by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// ═══════════════════════════════════════════════════════════════════
//                    MASTER IMPROVED SEQUENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎮 IMPROVED HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Scanning (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createScanning(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 2: Power Buildup (8 frames, 3 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createPowerBuildup(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 375));
        }
        
        // PHASE 3: Convincing Fake Legendary (12 frames, 4 seconds)
        for (let frame = 0; frame < 12; frame++) {
            const embed = createConvincingFakeLegendary(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 330));
        }
        
        // PHASE 4: Convincing Fake Mythical (10 frames, 3.5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createConvincingFakeMythical(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 350));
        }
        
        // PHASE 5: Final Truth (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalTruth(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 6: Devil Fruit Materialization (6 frames, 5 seconds)
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 7: Epic Finale
        const finale = createEpicFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎊 IMPROVED COMPLETE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Improved Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Hunt System Error!')
            .setDescription(`
The Devil Fruit hunt encountered an issue!

*Please try hunting again!*
            `)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
