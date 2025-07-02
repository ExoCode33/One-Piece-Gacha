const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    FAST BLINKING CHARGING ENGINE
// ═══════════════════════════════════════════════════════════════════

const ChargingEngine = {
    // SUPER FAST color blinking - changes every frame
    blinkColors: [
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

    // Create charging bar
    createChargingBar(percentage, width = 30) {
        const filled = Math.floor((percentage / 100) * width);
        const empty = width - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        return `[${bar}] ${percentage}%`;
    },

    // Super fast color blinking
    getFastBlinkColor(frame) {
        return this.blinkColors[frame % this.blinkColors.length];
    },

    // Text that stays same for multiple frames
    getStableText(messages, frame, framesPerMessage = 3) {
        const messageIndex = Math.floor(frame / framesPerMessage);
        return messages[messageIndex] || messages[messages.length - 1];
    }
};

// ═══════════════════════════════════════════════════════════════════
//                    FAST BLINKING ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Initial Charging (12 frames - text changes every 3 frames)
function createInitialCharging(frame) {
    const percentage = Math.floor((frame / 11) * 30);
    
    const messages = [
        "🔍 Starting Devil Fruit hunt...",
        "🌊 Searching the Grand Line...", 
        "⚡ Detecting energy signatures...",
        "🔮 Something powerful nearby..."
    ];
    
    const message = ChargingEngine.getStableText(messages, frame, 3);
    const chargingBar = ChargingEngine.createChargingBar(percentage);
    const effects = '🔍🌊⚡🔮'.repeat(6);
    
    return new EmbedBuilder()
        .setTitle('🔋 DEVIL FRUIT SCANNER')
        .setDescription(`
${effects}

**${message}**

${chargingBar}

*Charging power systems...*
        `)
        .setColor(ChargingEngine.getFastBlinkColor(frame))
        .setFooter({ text: `🔋 Charging: ${percentage}%` });
}

// PHASE 2: Power Building (15 frames - text changes every 3 frames)
function createPowerBuilding(frame) {
    const percentage = 30 + Math.floor((frame / 14) * 30);
    
    const messages = [
        "⚡ Weak power detected...",
        "🔥 Energy levels rising...",
        "⚡ Power signature strengthening...",
        "💥 Significant energy found...",
        "⚡ Strong power confirmed..."
    ];
    
    const message = ChargingEngine.getStableText(messages, frame, 3);
    const chargingBar = ChargingEngine.createChargingBar(percentage);
    const effects = '⚡🔥💥🌟💫✨'.repeat(5);
    
    return new EmbedBuilder()
        .setTitle('⚡ POWER BUILDING')
        .setDescription(`
${effects}

**${message}**

${chargingBar}

*Energy systems charging...*
        `)
        .setColor(ChargingEngine.getFastBlinkColor(frame * 2))
        .setFooter({ text: `⚡ Power: ${percentage}%` });
}

// PHASE 3: Rarity Lock-On (18 frames - text changes every 2 frames, ONE rarity)
function createRarityLockOn(frame, lockedRarity) {
    const percentage = 60 + Math.floor((frame / 17) * 25);
    
    const rarityConfigs = {
        legendary: {
            emoji: '🟡',
            color: '#F39C12',
            name: 'LEGENDARY',
            messages: [
                "🟡 LEGENDARY signature detected...",
                "👑 LEGENDARY power confirmed...",
                "🟡 LEGENDARY Devil Fruit found...",
                "👑 LEGENDARY class verified...",
                "🟡 LEGENDARY energy building...",
                "👑 LEGENDARY power at peak...",
                "🟡 LEGENDARY confirmed...",
                "👑 Wait... energy shifting...",
                "🌊 Power pattern changing..."
            ]
        },
        mythical: {
            emoji: '🔴',
            color: '#E74C3C', 
            name: 'MYTHICAL',
            messages: [
                "🔴 MYTHICAL signature detected...",
                "🔮 MYTHICAL power confirmed...",
                "🔴 MYTHICAL Devil Fruit found...",
                "🔮 MYTHICAL class verified...",
                "🔴 MYTHICAL energy building...",
                "🔮 MYTHICAL power at peak...",
                "🔴 MYTHICAL confirmed...",
                "🔮 Actually... readings changing...",
                "🌊 Different energy found..."
            ]
        },
        omnipotent: {
            emoji: '🌌',
            color: '#9B59B6',
            name: 'OMNIPOTENT', 
            messages: [
                "🌌 OMNIPOTENT signature detected...",
                "💫 OMNIPOTENT power confirmed...",
                "🌌 OMNIPOTENT Devil Fruit found...",
                "💫 OMNIPOTENT class verified...",
                "🌌 OMNIPOTENT energy building...",
                "💫 OMNIPOTENT power at peak...",
                "🌌 OMNIPOTENT confirmed...",
                "💫 Hold on... something different...",
                "🌊 Energy completely changing..."
            ]
        }
    };
    
    const config = rarityConfigs[lockedRarity];
    const message = ChargingEngine.getStableText(config.messages, frame, 2);
    const chargingBar = ChargingEngine.createChargingBar(percentage);
    
    // Use locked rarity color for most frames, then fast blink in final frames
    let color = config.color;
    let effects = config.emoji.repeat(15);
    let title = `${config.emoji} ${config.name} DETECTED! ${config.emoji}`;
    
    // In final frames, show change with fast blinking
    if (frame >= 14) {
        color = ChargingEngine.getFastBlinkColor(frame * 3);
        effects = '🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊';
        title = '🌊 ENERGY CHANGING 🌊';
    }
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effects}

**${message}**

${chargingBar}

*${frame < 14 ? config.name + ' power charging...' : 'Power signature shifting...'}*
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 14 ? config.emoji : '🌊'} Charge: ${percentage}%` });
}

// PHASE 4: Final Charging (12 frames - text changes every 2 frames)
function createFinalCharging(frame) {
    const percentage = 85 + Math.floor((frame / 11) * 15);
    
    const messages = [
        "🎯 Final charging sequence...",
        "🔋 Power at maximum...",
        "🎯 Systems fully charged...",
        "🔋 Ready for revelation...",
        "🎯 Charging complete...",
        "🔋 Devil Fruit incoming..."
    ];
    
    const message = ChargingEngine.getStableText(messages, frame, 2);
    const chargingBar = ChargingEngine.createChargingBar(percentage);
    const effects = '🎯🔋⚡💫🌟✨'.repeat(5);
    
    return new EmbedBuilder()
        .setTitle('🔋 FINAL CHARGING')
        .setDescription(`
${effects}

**${message}**

${chargingBar}

*Maximum power achieved...*
        `)
        .setColor(ChargingEngine.getFastBlinkColor(frame * 4))
        .setFooter({ text: `🔋 Final Charge: ${percentage}%` });
}

// PHASE 5: Devil Fruit Materialization
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
        
        // Info reveal
        const infoLines = [
            `📋 **Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `👤 **User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `⚡ **Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `⭐ **Rarity:** ${frame >= 4 ? config.name : '???'}`,
            `🔥 **Power Level:** ${frame >= 5 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const effects = config.emoji.repeat(20);
        const chargingBar = ChargingEngine.createChargingBar(100);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MATERIALIZED! ${config.emoji}`)
            .setDescription(`
${effects}

**${displayName}**

${infoLines.join('\n')}

${chargingBar}

${config.stars.repeat(Math.min(frame + 3, 8))}
            `)
            .setColor(config.color)
            .setFooter({ text: `🍈 Materialization: ${Math.floor(progress * 100)}% | ${config.name}` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// PHASE 6: Final Result
function createFinalResult(devilFruit, rarity, interaction) {
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
    
    const finalEffect = effects[rarity] || effects.common;
    const finalTitle = finaleMessages[rarity] || finaleMessages.common;
    const chargingBar = ChargingEngine.createChargingBar(100);
    
    const description = `
${finalEffect}

**${finalTitle}**

🍈 **${devilFruit.name}**
📋 **Type:** ${devilFruit.type}
👤 **User:** ${devilFruit.user}
⚡ **Power:** ${devilFruit.power}
🔥 **Power Level:** ${devilFruit.powerLevel.toLocaleString()}
⭐ **Rarity:** ${config.name}

${chargingBar}

${config.stars.repeat(8)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆

> *"${devilFruit.description}"*

${finalEffect}
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
            .setTitle(`${config.emoji} ${devilFruit.name} ${config.emoji}`)
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
//                    MASTER FAST BLINKING SEQUENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        // Pick fake high rarity for low rarities
        const fakeRarities = ['legendary', 'mythical', 'omnipotent'];
        const lockedRarity = rarity === 'common' || rarity === 'uncommon' || rarity === 'rare' ? 
            fakeRarities[Math.floor(Math.random() * fakeRarities.length)] : 
            rarity;
        
        console.log(`🔋 FAST BLINK: ${devilFruit.name} (${rarity}) for ${interaction.user.username} | Fake: ${lockedRarity}`);
        
        // PHASE 1: Initial Charging (12 frames, 3 seconds) - text changes every 3 frames
        for (let frame = 0; frame < 12; frame++) {
            const embed = createInitialCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250));
        }
        
        // PHASE 2: Power Building (15 frames, 3 seconds) - text changes every 3 frames  
        for (let frame = 0; frame < 15; frame++) {
            const embed = createPowerBuilding(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // PHASE 3: Rarity Lock-On (18 frames, 3.5 seconds) - text changes every 2 frames
        for (let frame = 0; frame < 18; frame++) {
            const embed = createRarityLockOn(frame, lockedRarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 195));
        }
        
        // PHASE 4: Final Charging (12 frames, 2.5 seconds) - text changes every 2 frames
        for (let frame = 0; frame < 12; frame++) {
            const embed = createFinalCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 210));
        }
        
        // PHASE 5: Devil Fruit Materialization (6 frames, 5 seconds)
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 6: Final Result
        const finale = createFinalResult(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎊 FAST BLINK COMPLETE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Fast Blink Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Charging Error!')
            .setDescription(`Charging system failed! Please try again!`)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
