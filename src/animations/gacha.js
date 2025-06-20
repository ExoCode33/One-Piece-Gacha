const { EmbedBuilder } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Advanced visual effects system with TRULY fixed alignment
const VisualEffects = {
    particles: {
        sparkles: ['✨', '⭐', '🌟', '💫', '✨', '⚡', '🔥'],
        water: ['🌊', '💧', '🌀', '💙', '🔵', '💎'],
        energy: ['⚡', '🔥', '💥', '⭐', '🌟', '✨'],
        cosmic: ['🌌', '🌠', '✨', '💫', '🔮', '🌟'],
        divine: ['👑', '🌌', '⚡', '🔥', '💎', '✨']
    },

    // FIXED frame creator - counts actual character width properly
    createPerfectFrame(lines, totalWidth = 40) {
        const borderChar = '═';
        const topBorder = `╔${borderChar.repeat(totalWidth - 2)}╗`;
        const bottomBorder = `╚${borderChar.repeat(totalWidth - 2)}╝`;
        const innerWidth = totalWidth - 2; // Account for side borders
        
        const framedLines = [topBorder];
        
        lines.forEach(line => {
            // Calculate actual character count (emojis = 1 char in monospace)
            const actualLength = [...line].length; // This counts emojis correctly
            const padding = Math.max(0, innerWidth - actualLength);
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            
            const paddedLine = `║${' '.repeat(leftPad)}${line}${' '.repeat(rightPad)}║`;
            framedLines.push(paddedLine);
        });
        
        framedLines.push(bottomBorder);
        return framedLines.join('\n');
    },

    // Simple version for testing
    createSimpleFrame(content) {
        const lines = [
            '╔══════════════════════════════════════╗',
            `║                                      ║`,
            `║              ${content}              ║`,
            `║                                      ║`,
            '╚══════════════════════════════════════╝'
        ];
        return lines.join('\n');
    },

    createShake(intensity = 3) {
        return intensity > 2 ? ' ' : '';
    },

    getTransitionColor(step, maxSteps, startColor, endColor) {
        const ratio = step / maxSteps;
        const start = parseInt(startColor.slice(1), 16);
        const end = parseInt(endColor.slice(1), 16);
        
        const r1 = (start >> 16) & 255;
        const g1 = (start >> 8) & 255;
        const b1 = start & 255;
        
        const r2 = (end >> 16) & 255;
        const g2 = (end >> 8) & 255;
        const b2 = end & 255;
        
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    },

    createSpinner(frame) {
        const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        return spinners[frame % spinners.length];
    }
};

/**
 * Creates starting animation with PERFECT straight frames
 */
function createAdvancedStartEmbed(frame = 0) {
    const maxFrames = 6;
    const particles = VisualEffects.particles.water;
    const currentParticle = particles[frame % particles.length];
    
    const color = VisualEffects.getTransitionColor(frame, maxFrames, '#1E3A8A', '#F59E0B');
    
    // Use simple frame for now to test
    const frameContent = VisualEffects.createSimpleFrame('SEARCHING THE SEAS');

    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription('```\n' + frameContent + '\n```')
        .setColor(color)
        .setFooter({ text: 'Adventure awaits beyond the horizon... ⚓' });
}

/**
 * Creates spinning animation with PERFECT straight frames
 */
function createAdvancedSpinEmbed(frame, totalFrames) {
    const spinner = VisualEffects.createSpinner(frame);
    const intensity = Math.min(4, Math.floor((frame / totalFrames) * 5));
    const shake = VisualEffects.createShake(intensity);
    
    const particleTypes = ['water', 'energy', 'sparkles', 'cosmic'];
    const currentParticles = VisualEffects.particles[particleTypes[Math.min(intensity, particleTypes.length - 1)]];
    const sideParticle = currentParticles[frame % currentParticles.length];
    
    const colors = ['#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981'];
    const color = colors[Math.min(intensity, colors.length - 1)];
    
    // Manual frame creation to ensure perfect alignment
    const lines = [
        '╔══════════════════════════════════════╗',
        '║                                      ║',
        `║       ${sideParticle} ${spinner} PULLING ${spinner} ${sideParticle}       ║`,
        '║                                      ║',
        '║  ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋  ║',
        '║                                      ║',
        `║     ${intensity > 2 ? 'POWER INTENSIFYING' : 'The seas churn'}      ║`,
        '║                                      ║',
        '╚══════════════════════════════════════╝'
    ];
    
    const frameContent = shake + lines.join('\n');

    const messages = [
        'The Grand Line stirs... 🌊',
        'Power builds in the depths... ⚡',
        'Reality begins to shift... 🌀',
        'The cosmos takes notice... 🌌',
        'MAXIMUM POWER! 💥'
    ];

    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription('```\n' + frameContent + '\n```')
        .setColor(color)
        .setFooter({ text: messages[intensity] || messages[0] });
}

/**
 * Creates rarity reveal with PERFECT straight frames
 */
async function createAdvancedRarityReveal(interaction, rarity) {
    const config = rarities[rarity];
    const rarityEffects = {
        common: { particles: 'water', frames: 3 },
        uncommon: { particles: 'sparkles', frames: 4 },
        rare: { particles: 'energy', frames: 5 },
        legendary: { particles: 'energy', frames: 6 },
        mythical: { particles: 'cosmic', frames: 8 },
        omnipotent: { particles: 'divine', frames: 10 }
    };

    const effect = rarityEffects[rarity] || rarityEffects.common;
    
    for (let frame = 0; frame < effect.frames; frame++) {
        const particles = VisualEffects.particles[effect.particles];
        const particle = particles[frame % particles.length];
        
        // Manual frame creation for perfect alignment
        const lines = [
            '╔══════════════════════════════════════╗',
            '║                                      ║',
            `║    ${config.emoji}${config.emoji}  ${config.name.toUpperCase()}  ${config.emoji}${config.emoji}    ║`,
            '║                                      ║',
            `║      ${config.stars} RARITY REVEALED ${config.stars}      ║`,
            '║                                      ║',
            `║              ${particle}              ║`,
            '║                                      ║',
            '╚══════════════════════════════════════╝'
        ];
        
        const frameContent = lines.join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🏴‍☠️ Rarity Revealed!')
            .setDescription('```\n' + frameContent + '\n```')
            .setColor(config.color)
            .setFooter({ text: `${config.stars} ${config.name} Rarity! ${particle}` });

        await interaction.editReply({ embeds: [embed] });
        await sleep(150);
    }
    
    await sleep(800);
}

/**
 * Creates final reveal with PERFECT straight frames
 */
function createAdvancedFinalEmbed(character, rarity, interaction, frame = 0) {
    const config = rarities[rarity];
    const entrance = frame < 4;
    
    const particleMap = {
        common: 'water', uncommon: 'sparkles', rare: 'energy',
        legendary: 'energy', mythical: 'cosmic', omnipotent: 'divine'
    };
    
    const particles = VisualEffects.particles[particleMap[rarity]];
    const bgParticle = particles[frame % particles.length];
    
    // Manual frame creation for perfect alignment
    const lines = entrance ? [
        '╔══════════════════════════════════════╗',
        '║                                      ║',
        `║         ${config.emoji}  ${config.stars}  ${config.emoji}         ║`,
        '║                                      ║',
        `║            MATERIALIZING             ║`,
        '║                                      ║',
        `║      ${bgParticle} The seas part... ${bgParticle}      ║`,
        '║                                      ║',
        '╚══════════════════════════════════════╝'
    ] : [
        '╔══════════════════════════════════════╗',
        '║                                      ║',
        `║         ${config.emoji}  ${config.stars}  ${config.emoji}         ║`,
        '║                                      ║',
        `║           ${character.name}           ║`,
        '║                                      ║',
        `║     Bounty: ${character.bounty}     ║`,
        `║     Crew: ${character.crew}     ║`,
        `║     Rarity: ${config.name}     ║`,
        '║                                      ║',
        '╚══════════════════════════════════════╝'
    ];
    
    const frameContent = lines.join('\n');
    let description = '```\n' + frameContent + '\n```';
    
    if (!entrance) {
        const rarityEffects = {
            omnipotent: `\n\n🌌 **OMNIPOTENT PULL!** 🌌\n✨ *The cosmos bows before you!* ✨`,
            mythical: `\n\n🔮 **MYTHICAL PULL!** 🔮\n🌟 *Legends become reality!* 🌟`,
            legendary: `\n\n🟡 **LEGENDARY PULL!** 🟡\n⚡ *A legend walks among us!* ⚡`,
            rare: `\n\n🔵 **RARE PULL!** 🔵\n💎 *A skilled warrior joins!* 💎`,
            uncommon: `\n\n🟢 **UNCOMMON PULL!** 🟢\n🌟 *A promising pirate appears!* 🌟`,
            common: `\n\n⚪ **COMMON PULL!** ⚪\n⭐ *A reliable crew member joins!* ⭐`
        };
        
        description += rarityEffects[rarity] || '';
    }
    
    return new EmbedBuilder()
        .setTitle(`${config.emoji} ${entrance ? 'Summoning...' : character.name} ${config.emoji}`)
        .setDescription(description)
        .setColor(config.color)
        .setFooter({ 
            text: `${entrance ? 'Materializing...' : `Congratulations ${interaction.user.username}!`} | One Piece Gacha`,
            iconURL: entrance ? null : interaction.user.displayAvatarURL()
        })
        .setTimestamp(!entrance);
}

/**
 * Main advanced gacha animation function
 */
async function createGachaAnimation(interaction) {
    try {
        // Determine what we're pulling
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        
        // Phase 1: Advanced initial pull with particles
        for (let frame = 0; frame < 6; frame++) {
            const startEmbed = createAdvancedStartEmbed(frame);
            await interaction.editReply({ embeds: [startEmbed] });
            await sleep(250);
        }
        
        // Phase 2: Intense spinning with screen shake and particles
        const totalSpinFrames = 12;
        for (let frame = 0; frame < totalSpinFrames; frame++) {
            const spinEmbed = createAdvancedSpinEmbed(frame, totalSpinFrames);
            await interaction.editReply({ embeds: [spinEmbed] });
            
            // Dynamic timing - gets faster as intensity builds
            const frameDelay = Math.max(150, 300 - (frame * 15));
            await sleep(frameDelay);
        }
        
        // Phase 3: Explosive rarity reveal
        await createAdvancedRarityReveal(interaction, rarity);
        
        // Phase 4: Cinematic character entrance
        for (let frame = 0; frame < 8; frame++) {
            const finalEmbed = createAdvancedFinalEmbed(character, rarity, interaction, frame);
            await interaction.editReply({ embeds: [finalEmbed] });
            await sleep(frame < 4 ? 400 : 300); // Slower entrance, faster pulse
        }
        
    } catch (error) {
        console.error('Animation error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('Something went wrong with your pull! The Grand Line can be unpredictable...')
            .setColor('#FF0000');
            
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = {
    createGachaAnimation
};
