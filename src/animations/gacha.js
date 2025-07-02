const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Professional Animation Framework
const GachaTheater = {
    // Sophisticated timing system
    timing: {
        intro: 800,
        mystery: 1200,
        suspense: 2000,
        climax: 3000,
        revelation: 1500,
        finale: 2500
    },

    // Cinematic color palettes
    palettes: {
        ocean: ['#001122', '#003366', '#004488', '#0066BB', '#0088DD', '#00AAFF'],
        storm: ['#2C1810', '#442818', '#5C3820', '#744828', '#8C5830', '#A46838'],
        treasure: ['#1A0F00', '#331E00', '#4D2D00', '#663C00', '#804B00', '#995A00'],
        divine: ['#0A0015', '#14002A', '#1E003F', '#280054', '#320069', '#3C007E'],
        legendary: ['#150A00', '#2A1400', '#3F1E00', '#542800', '#693200', '#7E3C00'],
        mythical: ['#1A001A', '#330033', '#4D004D', '#660066', '#800080', '#990099']
    },

    // Dynamic visual effects
    effects: {
        waves: ['〰️', '🌊', '〰️', '🌊', '〰️'],
        lightning: ['⚡', '🌩️', '⚡', '🌩️', '⚡'],
        treasure: ['💎', '✨', '💰', '⭐', '💎'],
        cosmos: ['🌌', '⭐', '🌟', '💫', '🌠'],
        fire: ['🔥', '💥', '⚡', '🌟', '🔥'],
        divine: ['🌌', '✨', '🔮', '💫', '⚡']
    },

    // Professional text animations
    createTypingEffect(text, frame, maxFrames) {
        const progress = Math.min(frame / maxFrames, 1);
        const visibleChars = Math.floor(text.length * progress);
        const visible = text.slice(0, visibleChars);
        const cursor = frame % 20 < 10 ? '|' : '';
        return visible + cursor;
    },

    // Sophisticated pulsing system
    createPulse(text, intensity) {
        const levels = [
            text,
            `*${text}*`,
            `**${text}**`,
            `***${text}***`,
            `✨ **${text}** ✨`,
            `🌟 ***${text}*** 🌟`,
            `⭐ 🌟 **${text}** 🌟 ⭐`,
            `💫 ⭐ 🌟 ***${text}*** 🌟 ⭐ 💫`
        ];
        return levels[Math.min(intensity, levels.length - 1)];
    },

    // Dynamic color transitions
    getTransitionColor(frame, palette) {
        const colors = this.palettes[palette] || this.palettes.ocean;
        return colors[frame % colors.length];
    },

    // Professional visual frames
    createFrame(content, style = 'simple', intensity = 1) {
        const styles = {
            simple: {
                top: '═'.repeat(40),
                side: '║',
                corner: '╔╗╚╝'
            },
            ornate: {
                top: '♦'.repeat(20),
                side: '◆',
                corner: '◊◊◊◊'
            },
            mystical: {
                top: '✦'.repeat(18),
                side: '✧',
                corner: '✨✨✨✨'
            },
            divine: {
                top: '⭐'.repeat(15),
                side: '🌟',
                corner: '💫💫💫💫'
            }
        };

        const frame = styles[style] || styles.simple;
        const padding = ' '.repeat(Math.max(0, 38 - content.length));
        
        return `\`\`\`
${frame.top}
${frame.side} ${content}${padding} ${frame.side}
${frame.top}
\`\`\``;
    },

    // Epic effect combinations
    createEpicEffect(frame, rarity) {
        const effects = this.effects[rarity] || this.effects.waves;
        const effect = effects[frame % effects.length];
        const count = Math.floor(frame / 3) + 1;
        return effect.repeat(Math.min(count, 8));
    }
};

/**
 * PHASE 1: Mysterious Beginning - Sets the atmosphere
 */
function createMysteriousIntro(frame) {
    const messages = [
        "The Grand Line stirs...",
        "Ancient powers awaken...",
        "The sea calls to you...",
        "Destiny approaches...",
        "Something legendary stirs..."
    ];
    
    const typewriterText = GachaTheater.createTypingEffect(
        messages[Math.min(frame, messages.length - 1)], 
        frame * 3, 
        20
    );
    
    const color = GachaTheater.getTransitionColor(frame, 'ocean');
    const waves = GachaTheater.createEpicEffect(frame, 'waves');
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Treasure Summon')
        .setDescription(`
🌊 ${waves} 🌊

${GachaTheater.createFrame(typewriterText, 'simple')}

*The winds of adventure begin to blow...*
        `)
        .setColor(color)
        .setFooter({ text: 'Preparing for the greatest adventure...' });
}

/**
 * PHASE 2: Building Suspense - Creates anticipation
 */
function createSuspensePhase(frame) {
    const suspenseMessages = [
        "⚡ Storm clouds gather...",
        "🌊 The seas grow restless...",
        "⚡ Lightning strikes the horizon...",
        "🌪️ A whirlpool forms...",
        "⚡ The very air crackles with power...",
        "🌊 Massive waves crash around you...",
        "⚡ Thunder echoes across the ocean...",
        "🌩️ THE STORM REACHES ITS PEAK!"
    ];
    
    const intensity = Math.floor(frame / 2);
    const message = suspenseMessages[Math.min(frame, suspenseMessages.length - 1)];
    const pulsingMessage = GachaTheater.createPulse(message, intensity);
    
    const stormColor = GachaTheater.getTransitionColor(frame, 'storm');
    const lightning = GachaTheater.createEpicEffect(frame, 'lightning');
    
    // Progressive visual intensity
    const visualIntensity = Math.min(frame, 8);
    const stormEffect = '🌩️'.repeat(visualIntensity) + '⚡'.repeat(Math.floor(visualIntensity / 2));
    
    return new EmbedBuilder()
        .setTitle(`⚡ ${GachaTheater.createPulse('STORM APPROACHING', intensity)} ⚡`)
        .setDescription(`
${stormEffect}

${GachaTheater.createFrame(pulsingMessage, 'ornate', intensity)}

${lightning}

*The power builds... something extraordinary approaches!*
        `)
        .setColor(stormColor)
        .setFooter({ 
            text: `Storm Intensity: ${Math.floor((frame / 8) * 100)}% | Brace yourself!`
        });
}

/**
 * PHASE 3: The Revelation Tease - Hints at rarity without revealing
 */
function createRevelationTease(frame, actualRarity) {
    // Create false suspense - don't reveal the actual rarity yet
    const mysteryHints = [
        "Something stirs in the depths...",
        "A presence makes itself known...",
        "The treasure chest begins to glow...",
        "Ancient seals start to break...",
        "Power beyond measure awakens...",
        "The very fabric of reality trembles...",
        "SOMETHING LEGENDARY EMERGES!"
    ];
    
    const hint = mysteryHints[Math.min(frame, mysteryHints.length - 1)];
    const pulsingHint = GachaTheater.createPulse(hint, frame);
    
    // Use colors that don't give away the rarity
    const mysteryColor = GachaTheater.getTransitionColor(frame, 'treasure');
    const treasureEffect = GachaTheater.createEpicEffect(frame, 'treasure');
    
    // Progressive mystery reveal without spoiling
    const mysterySymbols = ['◇', '◈', '◆', '♦', '💎'];
    const symbol = mysterySymbols[Math.min(frame, mysterySymbols.length - 1)];
    const symbolPattern = symbol.repeat(Math.min(frame + 1, 12));
    
    return new EmbedBuilder()
        .setTitle(`💎 TREASURE AWAKENING 💎`)
        .setDescription(`
${treasureEffect}

${GachaTheater.createFrame('THE CHEST OPENS...', 'mystical')}

${symbolPattern}
${pulsingHint}
${symbolPattern}

*What incredible power will emerge?*
        `)
        .setColor(mysteryColor)
        .setFooter({ text: 'The moment of truth approaches...' });
}

/**
 * PHASE 4: Epic Rarity Reveal - The big moment
 */
async function createEpicRarityReveal(interaction, rarity) {
    const config = rarities[rarity];
    const revealFrames = {
        common: 3,
        uncommon: 4, 
        rare: 5,
        legendary: 7,
        mythical: 10,
        omnipotent: 15
    }[rarity] || 3;
    
    // Build up the reveal with increasing intensity
    for (let frame = 0; frame < revealFrames; frame++) {
        const intensity = Math.min(frame, 7);
        const progress = frame / revealFrames;
        
        // Color revelation
        const revealColor = frame < 3 ? '#2C2C2C' : config.color;
        
        // Progressive text reveal
        const rarityName = config.name.toUpperCase();
        const revealedText = frame < 2 ? 
            '???'.repeat(rarityName.length) :
            GachaTheater.createTypingEffect(rarityName, frame * 2, 10);
        
        const pulsingText = GachaTheater.createPulse(revealedText, intensity);
        
        // Epic visual effects based on rarity
        let epicEffects = '';
        if (rarity === 'omnipotent') {
            epicEffects = '🌌'.repeat(15) + '\n' + '💫'.repeat(12) + '\n' + '⭐'.repeat(10);
        } else if (rarity === 'mythical') {
            epicEffects = '🔮'.repeat(12) + '\n' + '✨'.repeat(10) + '\n' + '🌟'.repeat(8);
        } else if (rarity === 'legendary') {
            epicEffects = '👑'.repeat(10) + '\n' + '⚡'.repeat(8) + '\n' + '🔥'.repeat(6);
        } else {
            epicEffects = config.emoji.repeat(Math.min(frame + 3, 8));
        }
        
        const description = `
${epicEffects}

${GachaTheater.createFrame(pulsingText, 'divine')}

${config.stars.repeat(Math.min(frame + 1, 5))}

${frame >= 2 ? `*${config.name} power courses through the air!*` : '*The power reveals itself...*'}
        `;

        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} RARITY REVEALED! ${config.emoji}`)
            .setDescription(description)
            .setColor(revealColor)
            .setFooter({ 
                text: frame >= 2 ? 
                    `${config.stars} ${config.name.toUpperCase()} CONFIRMED! ${config.stars}` :
                    'The truth emerges...'
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 200 + (frame * 50)));
    }
    
    // Pause for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * PHASE 5: Character Materialization - The grand finale
 */
async function createCharacterMaterialization(interaction, character, rarity) {
    const config = rarities[rarity];
    const materializationFrames = 6;
    
    // Build up the character appearance
    for (let frame = 0; frame < materializationFrames; frame++) {
        const progress = frame / materializationFrames;
        const intensity = Math.min(frame + 2, 7);
        
        // Progressive character name reveal
        const nameReveal = GachaTheater.createTypingEffect(
            character.name, 
            frame * 3, 
            15
        );
        
        const pulsingName = GachaTheater.createPulse(nameReveal, intensity);
        
        // Materialization effects
        const materializationStages = [
            'A shadow forms...',
            'Features begin to emerge...',
            'The silhouette takes shape...',
            'Power radiates from the figure...',
            'The legend stands before you...',
            'MATERIALIZATION COMPLETE!'
        ];
        
        const stage = materializationStages[frame] || materializationStages[materializationStages.length - 1];
        const stageText = GachaTheater.createPulse(stage, intensity);
        
        // Dynamic color transitions
        const materializationColor = frame < 2 ? '#1a1a1a' : 
                                   frame < 4 ? GachaTheater.getTransitionColor(frame, 'divine') :
                                   config.color;
        
        // Progressive visual effects
        const characterEffects = GachaTheater.createEpicEffect(frame, 
            ['divine', 'cosmos', 'fire'][Math.floor(frame / 2)] || 'divine'
        );
        
        const description = `
${characterEffects}

${GachaTheater.createFrame(pulsingName, 'divine')}

**${stageText}**

${frame >= 3 ? `**Crew:** ${character.crew}` : '**Crew:** ???'}
${frame >= 4 ? `**Bounty:** ${character.bounty} Berry` : '**Bounty:** ???'}
${frame >= 5 ? `**Rarity:** ${config.name}` : '**Rarity:** Materializing...'}

${config.stars.repeat(Math.min(frame + 1, 6))}
        `;

        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} LEGENDARY SUMMON ${config.emoji}`)
            .setDescription(description)
            .setColor(materializationColor)
            .setFooter({ 
                text: `Materialization: ${Math.floor(progress * 100)}%`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

/**
 * PHASE 6: Epic Finale - The ultimate reveal
 */
function createEpicFinale(character, rarity, interaction) {
    const config = rarities[rarity];
    
    // Rarity-specific finale messages
    const finaleMessages = {
        omnipotent: {
            title: '🌌 OMNIPOTENT BEING SUMMONED! 🌌',
            subtitle: '✨ Reality bends to your will! ✨',
            effect: '🌌💫⭐🌟💫🌌'
        },
        mythical: {
            title: '🔮 MYTHICAL LEGEND AWAKENED! 🔮',
            subtitle: '⚡ Ancient powers flow through time! ⚡',
            effect: '🔮✨🌟💎🌟✨🔮'
        },
        legendary: {
            title: '👑 LEGENDARY HERO RISES! 👑',
            subtitle: '🔥 History remembers this moment! 🔥',
            effect: '👑⚡🔥🌟🔥⚡👑'
        },
        rare: {
            title: '💎 RARE WARRIOR APPEARS! 💎',
            subtitle: '✨ Exceptional power joins your crew! ✨',
            effect: '💎🌟✨⭐✨🌟💎'
        },
        uncommon: {
            title: '🌟 SKILLED PIRATE EMERGES! 🌟',
            subtitle: '⭐ Promising potential awaits! ⭐',
            effect: '🌟⭐✨💫✨⭐🌟'
        },
        common: {
            title: '⚓ RELIABLE CREW MEMBER! ⚓',
            subtitle: '⭐ Every legend needs a foundation! ⭐',
            effect: '⚓⭐🌊⭐🌊⭐⚓'
        }
    };
    
    const finale = finaleMessages[rarity] || finaleMessages.common;
    
    const description = `
${finale.effect}

${GachaTheater.createFrame(
    GachaTheater.createPulse(character.name, 7), 
    'divine'
)}

**${finale.title}**
*${finale.subtitle}*

╔══════════════════════╗
║ **CREW:** ${character.crew.padEnd(15)} ║
║ **BOUNTY:** ${character.bounty.padEnd(12)} Berry ║  
║ **RARITY:** ${config.name.padEnd(15)} ║
╚══════════════════════╝

${config.stars.repeat(6)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆
*The seas have blessed you with incredible power!*

${finale.effect}
    `;

    // Create action row with interaction button
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('⚓ Set Sail Again!')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🏴‍☠️'),
            new ButtonBuilder()
                .setCustomId('view_crew')
                .setLabel('👥 View Crew')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⚓')
        );

    return {
        embed: new EmbedBuilder()
            .setTitle(`${config.emoji} ${GachaTheater.createPulse(character.name, 7)} ${config.emoji}`)
            .setDescription(description)
            .setColor(config.color)
            .setFooter({ 
                text: `🌊 One Piece Gacha | Summoned by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

/**
 * MASTER ANIMATION ORCHESTRATOR
 */
async function createProfessionalGachaAnimation(interaction) {
    try {
        // Pre-determine results for consistent animation timing
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        
        console.log(`🎲 Gacha Roll: ${character.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Mysterious Intro (5 frames)
        for (let frame = 0; frame < 5; frame++) {
            const embed = createMysteriousIntro(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, GachaTheater.timing.intro));
        }
        
        // PHASE 2: Building Suspense (8 frames)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createSuspensePhase(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, GachaTheater.timing.mystery - (frame * 50)));
        }
        
        // PHASE 3: Revelation Tease (7 frames)
        for (let frame = 0; frame < 7; frame++) {
            const embed = createRevelationTease(frame, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, GachaTheater.timing.suspense - (frame * 100)));
        }
        
        // PHASE 4: Epic Rarity Reveal
        await createEpicRarityReveal(interaction, rarity);
        
        // PHASE 5: Character Materialization
        await createCharacterMaterialization(interaction, character, rarity);
        
        // PHASE 6: Epic Finale
        const finale = createEpicFinale(character, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
    } catch (error) {
        console.error('🚨 Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Seas Are Too Rough!')
            .setDescription(`
The Grand Line's power was too intense for this summon!

\`\`\`
Error: ${error.message}
\`\`\`

*Please try your luck again, brave pirate!*
            `)
            .setColor('#FF6B6B')
            .setFooter({ text: 'The adventure continues...' });
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createGachaAnimation: createProfessionalGachaAnimation,
    GachaTheater
};
