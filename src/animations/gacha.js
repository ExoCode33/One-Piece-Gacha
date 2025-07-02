const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    GLORY ANIMATION ENGINE
// ═══════════════════════════════════════════════════════════════════

const GloryEngine = {
    // Fast-changing glory colors for epic effects
    gloryColors: [
        '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',  // Red to Yellow
        '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',  // Yellow to Green
        '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',  // Green to Cyan
        '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',  // Cyan to Blue
        '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033'   // Blue to Magenta
    ],

    // Quick visual effects
    effects: {
        spark: ['⚡', '✨', '🌟', '💫', '⭐'],
        energy: ['💥', '🔥', '⚡', '✨', '🌟'],
        cosmic: ['🌌', '🌠', '💫', '⭐', '✨'],
        divine: ['👑', '💎', '🔮', '✨', '🌟'],
        explosion: ['💥', '💥', '⚡', '⚡', '🌟']
    },

    // Fast color cycling
    getGloryColor(frame) {
        return this.gloryColors[frame % this.gloryColors.length];
    },

    // Create simple but effective particle field
    createParticleField(intensity, effectType = 'spark') {
        const particles = this.effects[effectType] || this.effects.spark;
        const lines = [];
        
        for (let i = 0; i < 3; i++) {
            let line = '';
            for (let j = 0; j < Math.min(intensity + 3, 12); j++) {
                const particle = particles[Math.floor(Math.random() * particles.length)];
                line += particle + ' ';
            }
            lines.push(line.trim());
        }
        
        return lines.join('\n');
    },

    // Epic text styling
    createEpicText(text, intensity = 1) {
        if (intensity <= 2) return text;
        if (intensity <= 4) return `**${text}**`;
        if (intensity <= 6) return `***${text}***`;
        if (intensity <= 8) return `✨ **${text}** ✨`;
        return `🌟 ✨ ***${text}*** ✨ 🌟`;
    },

    // Simple frame with glory effects
    createGloryFrame(content, intensity = 1) {
        const frameChars = {
            1: '═',
            2: '◆',
            3: '✦',
            4: '🌟'
        };
        
        const char = frameChars[Math.min(Math.floor(intensity / 2) + 1, 4)];
        const width = 40;
        const padding = Math.max(0, width - content.length - 4);
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        
        const line = char.repeat(width);
        const contentLine = `${char} ${' '.repeat(leftPad)}${content}${' '.repeat(rightPad)} ${char}`;
        
        return `\`\`\`\n${line}\n${contentLine}\n${line}\n\`\`\``;
    }
};

// ═══════════════════════════════════════════════════════════════════
//                         QUICK ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Mystery Build-up (5 frames, 4 seconds)
function createMysteryPhase(frame) {
    const messages = [
        "The Grand Line stirs...",
        "Ancient powers awaken...",
        "Devil Fruit energy builds...",
        "Something legendary approaches...",
        "The hunt begins..."
    ];
    
    const message = messages[frame] || messages[messages.length - 1];
    const styledMessage = GloryEngine.createEpicText(message, frame + 1);
    const particles = GloryEngine.createParticleField(frame + 1, 'spark');
    const color = GloryEngine.getGloryColor(frame * 3);
    
    return new EmbedBuilder()
        .setTitle('🍈 Devil Fruit Hunt Begins')
        .setDescription(`
🌊 ${GloryEngine.effects.energy[frame % 5].repeat(8)} 🌊

${GloryEngine.createGloryFrame(styledMessage, frame + 1)}

${particles}

*The seas respond to your call...*
        `)
        .setColor(color)
        .setFooter({ text: `🌊 Mystery Phase: ${frame + 1}/5` });
}

// PHASE 2: Energy Surge (6 frames, 4 seconds)
function createEnergySurge(frame) {
    const energyMessages = [
        "⚡ Energy crackles through the air...",
        "🌩️ Storm clouds gather overhead...",
        "💥 Lightning strikes the ocean...",
        "🌪️ Reality begins to shift...",
        "⚡ POWER SURGES THROUGH THE VOID...",
        "🌟 THE GRAND LINE ROARS WITH ENERGY!"
    ];
    
    const message = energyMessages[frame] || energyMessages[energyMessages.length - 1];
    const intensity = frame + 3;
    const styledMessage = GloryEngine.createEpicText(message, intensity);
    const particles = GloryEngine.createParticleField(intensity, 'energy');
    const color = GloryEngine.getGloryColor(frame * 5 + 10);
    
    return new EmbedBuilder()
        .setTitle(`⚡ ${GloryEngine.createEpicText('ENERGY SURGE', intensity)} ⚡`)
        .setDescription(`
⚡ ${GloryEngine.effects.explosion[frame % 5].repeat(12)} ⚡

${GloryEngine.createGloryFrame(styledMessage, intensity)}

${particles}

*The very fabric of reality trembles!*
        `)
        .setColor(color)
        .setFooter({ text: `⚡ Energy Level: ${Math.floor((frame / 6) * 100)}% | POWER RISING!` });
}

// PHASE 3: Cosmic Rift (5 frames, 4 seconds)
function createCosmicRift(frame) {
    const riftMessages = [
        "🌌 A dimensional rift tears open...",
        "💫 Cosmic energy floods through...",
        "🌠 Space and time bend and twist...",
        "⭐ THE VOID ANSWERS YOUR CALL...",
        "🌌 REALITY FRACTURES COMPLETELY!"
    ];
    
    const message = riftMessages[frame] || riftMessages[riftMessages.length - 1];
    const intensity = frame + 5;
    const styledMessage = GloryEngine.createEpicText(message, intensity);
    const particles = GloryEngine.createParticleField(intensity, 'cosmic');
    const color = GloryEngine.getGloryColor(frame * 7 + 20);
    
    return new EmbedBuilder()
        .setTitle(`🌌 ${GloryEngine.createEpicText('COSMIC RIFT', intensity)} 🌌`)
        .setDescription(`
🌌 ${GloryEngine.effects.cosmic[frame % 5].repeat(15)} 🌌

${GloryEngine.createGloryFrame(styledMessage, intensity)}

${particles}

*What incredible Devil Fruit will emerge?*
        `)
        .setColor(color)
        .setFooter({ text: `🌌 Rift Intensity: ${Math.floor((frame / 5) * 100)}%` });
}

// PHASE 4: Rarity Revelation (dynamic frames)
async function createRarityRevelation(interaction, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const frames = {
        common: 3, uncommon: 4, rare: 5, 
        legendary: 6, mythical: 8, omnipotent: 10
    }[rarity] || 3;
    
    for (let frame = 0; frame < frames; frame++) {
        const intensity = frame + 6;
        const progress = frame / frames;
        
        // Progressive reveal
        let displayText;
        if (frame < 2) {
            displayText = '???';
        } else if (frame < frames - 1) {
            const revealed = Math.floor(config.name.length * progress);
            displayText = config.name.slice(0, revealed) + '?'.repeat(config.name.length - revealed);
        } else {
            displayText = config.name.toUpperCase();
        }
        
        const styledText = GloryEngine.createEpicText(displayText, intensity);
        
        // Rarity-specific effects
        let rarityEffect = '';
        if (rarity === 'omnipotent') {
            rarityEffect = '🌌'.repeat(20);
        } else if (rarity === 'mythical') {
            rarityEffect = '🔮'.repeat(15);
        } else if (rarity === 'legendary') {
            rarityEffect = '👑'.repeat(12);
        } else {
            rarityEffect = config.emoji.repeat(Math.min(frame + 5, 10));
        }
        
        // Fast color cycling for glory
        const color = GloryEngine.getGloryColor(frame * 8 + 30);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} RARITY REVEALED! ${config.emoji}`)
            .setDescription(`
${rarityEffect}

${GloryEngine.createGloryFrame(styledText, intensity)}

${config.stars.repeat(Math.min(frame + 1, 6))}

${frame >= frames - 1 ? `*${config.description}*` : '*The truth emerges...*'}
            `)
            .setColor(color)
            .setFooter({ 
                text: frame >= frames - 1 ? 
                    `${config.stars} ${config.name.toUpperCase()} CONFIRMED! ${config.stars}` :
                    `Revelation: ${Math.floor(progress * 100)}%`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 300 + (frame * 50)));
    }
}

// PHASE 5: Devil Fruit Materialization (6 frames, 5 seconds)
async function createDevilFruitMaterialization(interaction, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const frames = 6;
    
    for (let frame = 0; frame < frames; frame++) {
        const intensity = frame + 7;
        const progress = frame / (frames - 1);
        
        // Progressive name reveal
        const nameProgress = Math.floor(devilFruit.name.length * progress);
        const visibleName = devilFruit.name.slice(0, nameProgress);
        const hiddenName = '◇'.repeat(devilFruit.name.length - nameProgress);
        const displayName = frame === frames - 1 ? devilFruit.name : visibleName + hiddenName;
        
        const styledName = GloryEngine.createEpicText(displayName, intensity);
        
        // Progressive info reveal
        const infoLines = [
            `**Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `**User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `**Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `**Power Level:** ${frame >= 4 ? devilFruit.powerLevel.toLocaleString() : '???'}`,
            `**Rarity:** ${frame >= 5 ? config.name : 'Materializing...'}`
        ];
        
        const particles = GloryEngine.createParticleField(intensity, 'divine');
        
        // Super fast color cycling for epic effect
        const color = GloryEngine.getGloryColor(frame * 10 + 40);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MATERIALIZES ${config.emoji}`)
            .setDescription(`
${particles}

${GloryEngine.createGloryFrame(styledName, intensity)}

${infoLines.join('\n')}

${config.stars.repeat(Math.min(frame + 2, 6))}
            `)
            .setColor(color)
            .setFooter({ 
                text: `Materialization: ${Math.floor(progress * 100)}%`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// PHASE 6: Epic Finale
function createEpicFinale(devilFruit, rarity, interaction) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const finaleEffects = {
        omnipotent: {
            title: '🌌 OMNIPOTENT DEVIL FRUIT! 🌌',
            effect: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
            message: 'REALITY ITSELF BOWS TO YOUR POWER!'
        },
        mythical: {
            title: '🔮 MYTHICAL DEVIL FRUIT! 🔮',
            effect: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮',
            message: 'LEGENDARY POWER FLOWS THROUGH YOU!'
        },
        legendary: {
            title: '👑 LEGENDARY DEVIL FRUIT! 👑',
            effect: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑',
            message: 'EPIC GLORY ACHIEVED!'
        },
        rare: {
            title: '💎 RARE DEVIL FRUIT! 💎',
            effect: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎',
            message: 'EXCEPTIONAL POWER OBTAINED!'
        },
        uncommon: {
            title: '🌟 UNCOMMON DEVIL FRUIT! 🌟',
            effect: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟',
            message: 'PROMISING POTENTIAL UNLOCKED!'
        },
        common: {
            title: '⚓ DEVIL FRUIT DISCOVERED! ⚓',
            effect: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓',
            message: 'SOLID FOUNDATION BUILT!'
        }
    };
    
    const finale = finaleEffects[rarity] || finaleEffects.common;
    const epicName = GloryEngine.createEpicText(devilFruit.name, 10);
    
    const description = `
${finale.effect}

${GloryEngine.createGloryFrame(epicName, 10)}

**${finale.title}**
*${finale.message}*

🍈 **${devilFruit.name}**
📋 **Type:** ${devilFruit.type}
👤 **User:** ${devilFruit.user}
⚡ **Power:** ${devilFruit.power}
🔥 **Power Level:** ${devilFruit.powerLevel.toLocaleString()}
⭐ **Rarity:** ${config.name}

${config.stars.repeat(8)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆

*"${devilFruit.description}"*

${finale.effect}
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
//                    MAIN ANIMATION FUNCTION
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 EPIC HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Mystery (5 frames, 4 seconds)
        for (let frame = 0; frame < 5; frame++) {
            const embed = createMysteryPhase(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // PHASE 2: Energy Surge (6 frames, 4 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createEnergySurge(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 650));
        }
        
        // PHASE 3: Cosmic Rift (5 frames, 4 seconds)
        for (let frame = 0; frame < 5; frame++) {
            const embed = createCosmicRift(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // PHASE 4: Rarity Revelation (dynamic)
        await createRarityRevelation(interaction, rarity);
        
        // PHASE 5: Materialization (6 frames, 5 seconds)
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 6: Epic Finale
        const finale = createEpicFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎊 SUCCESS: ${devilFruit.name} (${rarity}) found by ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Hunt Failed!')
            .setDescription(`
The Devil Fruit hunt encountered an error!

*Please try again, brave hunter!*
            `)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
