const { EmbedBuilder } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms);

// GLORY VISUAL EFFECTS SYSTEM
const GloryEffects = {
    // Light patterns for glorious reveals
    lightPatterns: {
        glow: ['◯', '◉', '⦿', '●', '⦿', '◉'],
        sparkle: ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰'],
        divine: ['◊', '◈', '◇', '♦', '◊', '◈'],
        energy: ['◐', '◓', '◑', '◒', '◐', '◓'],
        cosmic: ['✦', '※', '⁂', '✱', '✲', '✳', '✴', '✵', '✶', '✷']
    },

    // Color cascades for rainbow effects
    rainbowColors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    
    // Glory light box creator
    createLightBox(content, intensity = 1, pattern = 'glow') {
        const lights = this.lightPatterns[pattern];
        const lightFrame = lights[intensity % lights.length];
        
        const topGlow = lightFrame.repeat(20);
        const sideGlow = lightFrame.repeat(3);
        
        return `
${topGlow}
${sideGlow}                    ${sideGlow}
${sideGlow}      ${content}      ${sideGlow}
${sideGlow}                    ${sideGlow}
${topGlow}
        `.trim();
    },

    // Pulsing text effect
    createPulsingText(text, intensity = 1) {
        const effects = [
            text,
            `**${text}**`,
            `***${text}***`,
            `**✨ ${text} ✨**`,
            `***⭐ ${text} ⭐***`,
            `**🌟 ✨ ${text} ✨ 🌟**`,
            `***💫 ⭐ ✨ ${text} ✨ ⭐ 💫***`
        ];
        return effects[Math.min(intensity, effects.length - 1)];
    },

    // Color transition for glory effects
    getGloryColor(frame, type = 'normal') {
        if (type === 'rainbow') {
            return this.rainbowColors[frame % this.rainbowColors.length];
        }
        
        const colorSets = {
            normal: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'],
            fire: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
            divine: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'],
            cosmic: ['#DB2777', '#EC4899', '#F472B6', '#F9A8D4'],
            legendary: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D']
        };
        
        const colors = colorSets[type] || colorSets.normal;
        return colors[frame % colors.length];
    },

    // Flash effect simulation
    createFlash(intensity = 5) {
        const flashChars = ['▓', '▒', '░', ' '];
        const char = flashChars[Math.min(intensity, flashChars.length - 1)];
        return char.repeat(30);
    },

    // Cascading light effect
    createCascade(frame, height = 5) {
        const cascade = [];
        for (let i = 0; i < height; i++) {
            const position = (frame + i) % 15;
            const line = ' '.repeat(position) + '✦' + ' '.repeat(15 - position);
            cascade.push(line);
        }
        return cascade.join('\n');
    }
};

/**
 * Creates a GLORIOUS starting animation with light effects
 */
function createGloriousStartEmbed(frame = 0) {
    const lightIntensity = Math.floor(frame / 2);
    const pulsingTitle = GloryEffects.createPulsingText('SUMMONING BEGINS', lightIntensity);
    const color = GloryEffects.getGloryColor(frame, 'normal');
    
    const lightBox = GloryEffects.createLightBox('THE SEAS AWAKEN', frame, 'glow');
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(`
${pulsingTitle}

\`\`\`
${lightBox}
\`\`\`

*✨ The Grand Line responds to your call... ✨*
        `)
        .setColor(color)
        .setFooter({ text: `✦ Power gathering... ${lightIntensity + 1}/6 ✦` });
}

/**
 * Creates SPECTACULAR spinning with cascading lights
 */
function createSpectacularSpinEmbed(frame) {
    const intensity = Math.floor(frame / 3);
    const maxIntensity = 4;
    
    // Build up to maximum glory
    const pulsingText = GloryEffects.createPulsingText('PULLING', intensity + 2);
    const colorType = ['normal', 'fire', 'divine', 'cosmic'][Math.min(intensity, 3)];
    const color = GloryEffects.getGloryColor(frame, colorType);
    
    // Create cascading light show
    const cascade = GloryEffects.createCascade(frame, 5);
    const lightPattern = intensity >= 3 ? 'cosmic' : intensity >= 2 ? 'divine' : 'sparkle';
    const lightBox = GloryEffects.createLightBox(pulsingText, frame, lightPattern);
    
    // Flash effects for maximum intensity
    const flash = intensity >= 3 ? GloryEffects.createFlash(frame % 4) : '';
    
    const messages = [
        '✨ Energy gathering...',
        '⚡ Power building...',
        '🔥 Reality shifting...',
        '🌌 COSMIC FORCES UNLEASHED!'
    ];
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(`
${flash}

\`\`\`
${lightBox}
\`\`\`

\`\`\`
${cascade}
\`\`\`

${flash}
        `)
        .setColor(color)
        .setFooter({ text: messages[Math.min(intensity, messages.length - 1)] });
}

/**
 * Creates EXPLOSIVE rarity reveal with light bursts
 */
async function createExplosiveRarityReveal(interaction, rarity) {
    const config = rarities[rarity];
    const frames = {
        common: 3, uncommon: 4, rare: 5, 
        legendary: 7, mythical: 10, omnipotent: 15
    }[rarity] || 3;
    
    // Build up explosion
    for (let frame = 0; frame < frames; frame++) {
        const explosionIntensity = Math.min(6, frame);
        const isRainbow = rarity === 'omnipotent' || rarity === 'mythical';
        const color = isRainbow ? 
            GloryEffects.getGloryColor(frame, 'rainbow') : 
            config.color;
        
        // Create expanding light burst
        const burstSize = frame + 1;
        const lightBurst = '✦'.repeat(Math.min(20, burstSize * 3));
        const innerGlow = '◉'.repeat(Math.min(15, burstSize * 2));
        
        const rarityText = GloryEffects.createPulsingText(config.name.toUpperCase(), explosionIntensity);
        const flash = frame > 2 ? GloryEffects.createFlash(frame % 3) : '';
        
        const description = `
${flash}

\`\`\`
${lightBurst}
${innerGlow}
     ${config.emoji} ${rarityText} ${config.emoji}
${innerGlow}
${lightBurst}
\`\`\`

${config.stars.repeat(3)}

${flash}
        `;

        const embed = new EmbedBuilder()
            .setTitle('🏴‍☠️ RARITY REVEALED!')
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: `${config.stars} BEHOLD THE ${config.name.toUpperCase()}! ${config.stars}` });

        await interaction.editReply({ embeds: [embed] });
        await sleep(100 + (frame * 20)); // Accelerating reveals
    }
    
    await sleep(1000);
}

/**
 * Creates DIVINE character materialization
 */
function createDivineMaterialization(character, rarity, interaction, frame = 0) {
    const config = rarities[rarity];
    const isEntrance = frame < 5;
    
    if (isEntrance) {
        const materializationStage = frame;
        const glowIntensity = materializationStage + 1;
        const pulsingName = GloryEffects.createPulsingText('MATERIALIZING', glowIntensity);
        
        // Character name reveal effect
        const nameLength = character.name.length;
        const revealedChars = Math.floor((nameLength * frame) / 4);
        const hiddenName = '◆'.repeat(Math.max(0, nameLength - revealedChars));
        const partialName = character.name.slice(0, revealedChars) + hiddenName;
        
        const lightBox = GloryEffects.createLightBox(pulsingName, frame, 'divine');
        const cascade = GloryEffects.createCascade(frame * 2, 4);
        
        const isHighRarity = ['mythical', 'omnipotent'].includes(rarity);
        const color = isHighRarity ? 
            GloryEffects.getGloryColor(frame, 'rainbow') : 
            config.color;
        
        return new EmbedBuilder()
            .setTitle(`${config.emoji} SUMMONING... ${config.emoji}`)
            .setDescription(`
**${config.stars}**

\`\`\`
${lightBox}
\`\`\`

**${partialName}**

\`\`\`
${cascade}
\`\`\`

*✨ A legendary presence emerges from the void... ✨*
            `)
            .setColor(color)
            .setFooter({ text: `Materialization: ${Math.floor((frame / 4) * 100)}%` });
    }
    
    // Final glorious reveal
    const finalGlowText = GloryEffects.createPulsingText(character.name, 6);
    const isUltimate = ['mythical', 'omnipotent'].includes(rarity);
    const finalColor = isUltimate ? 
        GloryEffects.getGloryColor(frame, 'rainbow') : 
        config.color;
    
    const gloriousBox = GloryEffects.createLightBox(finalGlowText, 6, 'cosmic');
    
    let description = `
**${config.stars}**

\`\`\`
${gloriousBox}
\`\`\`

**Bounty:** ${character.bounty} Berry
**Crew:** ${character.crew}
**Rarity:** ${config.name}

*"The seas have chosen their champion!"*
    `;
    
    // Add rarity-specific glory effects
    const gloryEffects = {
        omnipotent: `\n\n🌌 ***OMNIPOTENT BEING SUMMONED!*** 🌌\n✨ *Reality itself kneels before your power!* ✨\n💫 *The multiverse trembles!* 💫`,
        mythical: `\n\n🔮 ***MYTHICAL LEGEND AWAKENED!*** 🔮\n🌟 *Ancient powers flow through time!* 🌟\n⚡ *Destiny reshapes itself!* ⚡`,
        legendary: `\n\n🟡 ***LEGENDARY HERO RISES!*** 🟡\n⭐ *History remembers this moment!* ⭐\n🔥 *Epic glory achieved!* 🔥`,
        rare: `\n\n🔵 **RARE WARRIOR APPEARS!** 🔵\n💎 *Skilled power joins your cause!* 💎`,
        uncommon: `\n\n🟢 **PROMISING SOUL EMERGES!** 🟢\n🌟 *Potential awaits unleashing!* 🌟`,
        common: `\n\n⚪ **RELIABLE ALLY JOINS!** ⚪\n⭐ *Every legend needs a foundation!* ⭐`
    };
    
    description += gloryEffects[rarity] || '';
    
    return new EmbedBuilder()
        .setTitle(`${config.emoji} ${finalGlowText} ${config.emoji}`)
        .setDescription(description)
        .setColor(finalColor)
        .setFooter({ 
            text: `🏆 GLORIOUS VICTORY ${interaction.user.username}! 🏆 | One Piece Gacha`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
}

/**
 * Main GLORIOUS animation function
 */
async function createGachaAnimation(interaction) {
    try {
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        
        // Phase 1: Glorious awakening (6 frames)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createGloriousStartEmbed(frame);
            await interaction.editReply({ embeds: [embed] });
            await sleep(400);
        }
        
        // Phase 2: Spectacular spinning light show (16 frames)
        for (let frame = 0; frame < 16; frame++) {
            const embed = createSpectacularSpinEmbed(frame);
            await interaction.editReply({ embeds: [embed] });
            await sleep(200 - (frame * 5)); // Accelerating intensity
        }
        
        // Phase 3: Explosive rarity reveal
        await createExplosiveRarityReveal(interaction, rarity);
        
        // Phase 4: Divine materialization entrance (5 frames)
        for (let frame = 0; frame < 5; frame++) {
            const embed = createDivineMaterialization(character, rarity, interaction, frame);
            await interaction.editReply({ embeds: [embed] });
            await sleep(600);
        }
        
        // Phase 5: Final glorious reveal
        const finalEmbed = createDivineMaterialization(character, rarity, interaction, 10);
        await interaction.editReply({ embeds: [finalEmbed] });
        
    } catch (error) {
        console.error('Animation error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('The glory was too intense! Please try again...')
            .setColor('#FF0000');
            
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = {
    createGachaAnimation
};
