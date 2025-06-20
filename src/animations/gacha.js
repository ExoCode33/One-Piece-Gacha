const { EmbedBuilder } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Advanced visual effects system
const VisualEffects = {
    // Particle systems using Unicode
    particles: {
        sparkles: ['✨', '⭐', '🌟', '💫', '✨', '⚡', '🔥'],
        water: ['🌊', '💧', '🌀', '💙', '🔵', '💎'],
        energy: ['⚡', '🔥', '💥', '⭐', '🌟', '✨'],
        cosmic: ['🌌', '🌠', '✨', '💫', '🔮', '🌟'],
        divine: ['👑', '🌌', '⚡', '🔥', '💎', '✨']
    },

    // Screen shake simulation
    createShake(intensity = 3) {
        const shakes = [];
        for (let i = 0; i < intensity; i++) {
            const spaces = ' '.repeat(Math.floor(Math.random() * 3));
            shakes.push(spaces);
        }
        return shakes;
    },

    // Color transition effects
    getTransitionColor(step, maxSteps, startColor, endColor) {
        const ratio = step / maxSteps;
        // Simple color interpolation for hex colors
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

    // Pulsing effect with intensity
    createPulse(frame, maxFrames, baseIntensity = 1) {
        const pulseRatio = Math.sin((frame / maxFrames) * Math.PI * 2);
        return baseIntensity + (pulseRatio * 0.5);
    },

    // Particle explosion effect
    createExplosion(centerChar, particles, radius = 3) {
        const explosion = [];
        const particleSet = this.particles[particles] || this.particles.sparkles;
        
        for (let i = 0; i < radius; i++) {
            const ring = [];
            const circumference = Math.max(1, Math.floor(2 * Math.PI * i));
            
            for (let j = 0; j < circumference; j++) {
                ring.push(particleSet[Math.floor(Math.random() * particleSet.length)]);
            }
            explosion.push(ring);
        }
        
        return explosion;
    }
};

/**
 * Creates advanced starting animation with particle effects
 */
function createAdvancedStartEmbed(frame = 0) {
    const maxFrames = 6;
    const particles = VisualEffects.particles.water;
    const currentParticle = particles[frame % particles.length];
    
    // Animated wave pattern
    const wavePattern = frame % 4;
    const waves = ['🌊', '🌀', '💧', '🌊'][wavePattern];
    
    // Color transition from blue to gold
    const color = VisualEffects.getTransitionColor(frame, maxFrames, '#0099FF', '#FFD700');
    
    const description = `\`\`\`
${waves.repeat(12)}
${waves}  ${currentParticle} Searching the seas... ${currentParticle}  ${waves}
${waves}     The Grand Line calls...     ${waves}
${waves.repeat(12)}
\`\`\``;

    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: 'Adventure awaits beyond the horizon...' });
}

/**
 * Creates advanced spinning animation with screen shake and particles
 */
function createAdvancedSpinEmbed(frame, totalFrames) {
    const spinChars = ['◐', '◓', '◑', '◒', '◐', '◓', '◑', '◒'];
    const currentSpin = spinChars[frame % spinChars.length];
    
    // Intensifying effects as we approach the end
    const intensity = Math.min(3, Math.floor((frame / totalFrames) * 4));
    const shake = VisualEffects.createShake(intensity);
    
    // Particle effects that intensify
    const particleTypes = ['water', 'energy', 'sparkles'];
    const currentParticles = VisualEffects.particles[particleTypes[Math.floor(frame / 3) % particleTypes.length]];
    const leftParticle = currentParticles[frame % currentParticles.length];
    const rightParticle = currentParticles[(frame + 1) % currentParticles.length];
    
    // Color gets more intense
    const baseColors = ['#FFD700', '#FF8C00', '#FF4500', '#FF0000'];
    const color = baseColors[Math.min(intensity, baseColors.length - 1)];
    
    // Dynamic spacing for shake effect
    const spacing = shake[0] || '';
    
    const description = `\`\`\`
${spacing}🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊
${spacing}🌊  ${leftParticle} ${currentSpin} PULLING ${currentSpin} ${rightParticle}  🌊
${spacing}🌊    ${intensity > 1 ? '⚡ INTENSIFYING ⚡' : 'The seas churn...'}    🌊
${spacing}🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊
\`\`\``;

    const messages = [
        'The Grand Line stirs...',
        'Power builds in the depths...',
        'Reality begins to shift...',
        'The cosmos takes notice...'
    ];

    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: messages[intensity] || messages[0] });
}

/**
 * Creates rarity reveal with explosive particle effects
 */
async function createAdvancedRarityReveal(interaction, rarity) {
    const config = rarities[rarity];
    const rarityEffects = {
        common: { particles: 'water', frames: 3, colors: ['#808080', '#A0A0A0'] },
        uncommon: { particles: 'sparkles', frames: 4, colors: ['#00FF00', '#32CD32'] },
        rare: { particles: 'energy', frames: 5, colors: ['#0099FF', '#00BFFF'] },
        legendary: { particles: 'energy', frames: 6, colors: ['#FFD700', '#FFA500'] },
        mythical: { particles: 'cosmic', frames: 8, colors: ['#FF1493', '#FF69B4', '#DA70D6'] },
        omnipotent: { particles: 'divine', frames: 10, colors: ['#9400D3', '#8A2BE2', '#4B0082'] }
    };

    const effect = rarityEffects[rarity] || rarityEffects.common;
    
    // Multi-frame explosion animation
    for (let frame = 0; frame < effect.frames; frame++) {
        const currentColor = effect.colors[frame % effect.colors.length];
        const particles = VisualEffects.particles[effect.particles];
        const explosionRadius = Math.min(5, frame + 1);
        
        // Create expanding particle field
        const particleField = [];
        for (let i = 0; i < explosionRadius; i++) {
            const particleCount = Math.max(5, 15 - (i * 2));
            const ring = particles[Math.floor(Math.random() * particles.length)].repeat(particleCount);
            particleField.push(ring);
        }
        
        const description = `\`\`\`
${particleField[0] || ''}
${config.emoji.repeat(12)}
${config.emoji}  ${config.name.toUpperCase()}  ${config.emoji}
${config.emoji.repeat(12)}
${particleField[1] || ''}
\`\`\``;

        const embed = new EmbedBuilder()
            .setTitle('🏴‍☠️ Rarity Revealed!')
            .setDescription(description)
            .setColor(currentColor)
            .setFooter({ text: `${config.stars} ${config.name} Rarity! ${particles[frame % particles.length]}` });

        await interaction.editReply({ embeds: [embed] });
        await sleep(200); // Fast explosion frames
    }
    
    await sleep(1000); // Pause to admire the explosion
}

/**
 * Creates final reveal with cinematic effects
 */
function createAdvancedFinalEmbed(character, rarity, interaction, frame = 0) {
    const config = rarities[rarity];
    const maxFrames = 8;
    
    // Cinematic entrance effect
    const entrance = frame < 4;
    const pulseIntensity = VisualEffects.createPulse(frame, maxFrames, 1);
    
    // Dynamic particle background based on rarity
    const particleMap = {
        common: 'water',
        uncommon: 'sparkles', 
        rare: 'energy',
        legendary: 'energy',
        mythical: 'cosmic',
        omnipotent: 'divine'
    };
    
    const particles = VisualEffects.particles[particleMap[rarity]] || VisualEffects.particles.water;
    const bgParticle = particles[frame % particles.length];
    
    let description = `${bgParticle.repeat(3)} **${config.stars}** ${bgParticle.repeat(3)}
        
**${character.name}**
${entrance ? '`Emerging from the mists...`' : `**Bounty:** ${character.bounty} Berry`}
${entrance ? '' : `**Crew:** ${character.crew}`}
${entrance ? '' : `**Rarity:** ${config.name}`}
        
${entrance ? '*The seas part to reveal...*' : '*"The seas have chosen you!"*'}`;
    
    // Add rarity-specific effects
    const rarityEffects = {
        omnipotent: `\n\n🌌 **OMNIPOTENT PULL!** 🌌\n✨ *The cosmos itself bows before you!* ✨\n${bgParticle} *Reality reshapes at your will!* ${bgParticle}`,
        mythical: `\n\n🔮 **MYTHICAL PULL!** 🔮\n🌟 *Legends become reality!* 🌟\n${bgParticle} *The impossible is now possible!* ${bgParticle}`,
        legendary: `\n\n🟡 **LEGENDARY PULL!** 🟡\n⚡ *A legend walks among us!* ⚡\n${bgParticle} *History trembles before this power!* ${bgParticle}`,
        rare: `\n\n🔵 **RARE PULL!** 🔵\n💎 *A skilled warrior joins!* 💎`,
        uncommon: `\n\n🟢 **UNCOMMON PULL!** 🟢\n🌟 *A promising pirate appears!* 🌟`,
        common: `\n\n⚪ **COMMON PULL!** ⚪\n⭐ *A reliable crew member joins!* ⭐`
    };
    
    if (!entrance) {
        description += rarityEffects[rarity] || '';
    }
    
    // Dynamic color with pulse effect
    const baseColor = parseInt(config.color.slice(1), 16);
    const brightness = Math.floor(pulseIntensity * 0.3 * 255);
    const enhancedColor = Math.min(0xFFFFFF, baseColor + brightness).toString(16).padStart(6, '0');
    
    return new EmbedBuilder()
        .setTitle(`${config.emoji} ${entrance ? '???' : character.name} ${config.emoji}`)
        .setDescription(description)
        .setColor(`#${enhancedColor}`)
        .setFooter({ 
            text: `${entrance ? 'Materializing...' : `Congratulations ${interaction.user.username}!`} | One Piece Gacha ${bgParticle}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
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
