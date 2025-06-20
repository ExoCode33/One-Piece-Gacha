const { EmbedBuilder } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Advanced visual effects system with fixed alignment
const VisualEffects = {
    // Enhanced particle systems
    particles: {
        sparkles: ['✨', '⭐', '🌟', '💫', '✨', '⚡', '🔥'],
        water: ['🌊', '💧', '🌀', '💙', '🔵', '💎'],
        energy: ['⚡', '🔥', '💥', '⭐', '🌟', '✨'],
        cosmic: ['🌌', '🌠', '✨', '💫', '🔮', '🌟'],
        divine: ['👑', '🌌', '⚡', '🔥', '💎', '✨']
    },

    // Fixed width frame creator
    createFixedFrame(lines, width = 36) {
        const topBorder = `╔${'═'.repeat(width)}╗`;
        const bottomBorder = `╚${'═'.repeat(width)}╝`;
        
        const paddedLines = [topBorder];
        
        lines.forEach(line => {
            // Remove any existing emojis from length calculation for proper alignment
            const cleanLine = line.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, 'X');
            const actualLength = cleanLine.length;
            const padding = Math.max(0, width - actualLength);
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            
            paddedLines.push(`║${' '.repeat(leftPad)}${line}${' '.repeat(rightPad)}║`);
        });
        
        paddedLines.push(bottomBorder);
        return paddedLines.join('\n');
    },

    // Simple center text function
    centerText(text, width = 34) {
        // Calculate actual display width (emojis count as 2, regular chars as 1)
        let displayWidth = 0;
        for (let char of text) {
            if (char.match(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)) {
                displayWidth += 2;
            } else {
                displayWidth += 1;
            }
        }
        
        const padding = Math.max(0, width - displayWidth);
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        
        return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    },

    // Screen shake simulation
    createShake(intensity = 3) {
        const patterns = ['', ' ', '  ', ' ', '', '   ', ' ', ''];
        return patterns[intensity % patterns.length];
    },

    // Color transition effects
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

    // Professional spinning indicators
    createSpinner(frame) {
        const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        return spinners[frame % spinners.length];
    }
};

/**
 * Creates advanced starting animation with fixed layout
 */
function createAdvancedStartEmbed(frame = 0) {
    const maxFrames = 6;
    const particles = VisualEffects.particles.water;
    const currentParticle = particles[frame % particles.length];
    
    // Color transition from deep blue to bright gold
    const color = VisualEffects.getTransitionColor(frame, maxFrames, '#1E3A8A', '#F59E0B');
    
    const lines = [
        '',
        `${currentParticle} SEARCHING THE SEAS ${currentParticle}`,
        '',
        '≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋',
        '',
        'The Grand Line calls...',
        ''
    ];
    
    const frameContent = VisualEffects.createFixedFrame(lines);

    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription('```\n' + frameContent + '\n```')
        .setColor(color)
        .setFooter({ text: 'Adventure awaits beyond the horizon... ⚓' });
}

/**
 * Creates advanced spinning animation with fixed design
 */
function createAdvancedSpinEmbed(frame, totalFrames) {
    // Professional spinner
    const spinner = VisualEffects.createSpinner(frame);
    
    // Intensifying effects
    const intensity = Math.min(4, Math.floor((frame / totalFrames) * 5));
    const shake = VisualEffects.createShake(intensity);
    
    // Dynamic particles
    const particleTypes = ['water', 'energy', 'sparkles', 'cosmic'];
    const currentParticles = VisualEffects.particles[particleTypes[Math.min(intensity, particleTypes.length - 1)]];
    const sideParticle = currentParticles[frame % currentParticles.length];
    
    // Enhanced color progression
    const colors = ['#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981'];
    const color = colors[Math.min(intensity, colors.length - 1)];
    
    const lines = [
        '',
        `${sideParticle} ${spinner} PULLING ${spinner} ${sideParticle}`,
        '',
        '≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋',
        '',
        intensity > 2 ? '⚡ POWER INTENSIFYING ⚡' : 'The seas churn with power',
        ''
    ];
    
    const frameContent = shake + VisualEffects.createFixedFrame(lines);

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
 * Creates rarity reveal with fixed explosion effects
 */
async function createAdvancedRarityReveal(interaction, rarity) {
    const config = rarities[rarity];
    const rarityEffects = {
        common: { particles: 'water', frames: 3, explosion: '∘' },
        uncommon: { particles: 'sparkles', frames: 4, explosion: '◦' },
        rare: { particles: 'energy', frames: 5, explosion: '●' },
        legendary: { particles: 'energy', frames: 6, explosion: '◆' },
        mythical: { particles: 'cosmic', frames: 8, explosion: '❋' },
        omnipotent: { particles: 'divine', frames: 10, explosion: '✦' }
    };

    const effect = rarityEffects[rarity] || rarityEffects.common;
    
    // Multi-frame explosion animation
    for (let frame = 0; frame < effect.frames; frame++) {
        const particles = VisualEffects.particles[effect.particles];
        const particle = particles[frame % particles.length];
        const explosionChar = effect.explosion;
        
        // Create expanding rings
        const outerRing = explosionChar.repeat(Math.min(12, (frame + 1) * 2));
        const innerRing = explosionChar.repeat(Math.max(2, frame + 1));
        
        const lines = [
            outerRing,
            '',
            `${config.emoji}${config.emoji} ${config.name.toUpperCase()} ${config.emoji}${config.emoji}`,
            '',
            innerRing,
            '',
            `${particle} ${config.stars} RARITY REVEALED ${config.stars} ${particle}`,
            ''
        ];
        
        const frameContent = VisualEffects.createFixedFrame(lines);

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
 * Creates final reveal with fixed cinematic layout
 */
function createAdvancedFinalEmbed(character, rarity, interaction, frame = 0) {
    const config = rarities[rarity];
    const maxFrames = 8;
    
    // Cinematic entrance effect
    const entrance = frame < 4;
    const revealProgress = Math.min(1, frame / 4);
    
    // Get character name with reveal effect
    const nameLength = character.name.length;
    const revealedChars = Math.floor(nameLength * revealProgress);
    const hiddenChars = nameLength - revealedChars;
    const displayName = entrance ? 
        character.name.slice(0, revealedChars) + '█'.repeat(hiddenChars) : 
        character.name;
    
    // Dynamic particles based on rarity
    const particleMap = {
        common: 'water',
        uncommon: 'sparkles', 
        rare: 'energy',
        legendary: 'energy',
        mythical: 'cosmic',
        omnipotent: 'divine'
    };
    
    const particles = VisualEffects.particles[particleMap[rarity]];
    const bgParticle = particles[frame % particles.length];
    
    // Professional character card layout with fixed alignment
    const lines = entrance ? [
        '',
        `${config.emoji} ${config.stars} ${config.emoji}`,
        '',
        displayName,
        '',
        '▓▓▓ MATERIALIZING ▓▓▓',
        '',
        `${bgParticle} The seas part to reveal... ${bgParticle}`,
        ''
    ] : [
        '',
        `${config.emoji} ${config.stars} ${config.emoji}`,
        '',
        character.name,
        '',
        `Bounty: ${character.bounty} Berry`,
        `Crew: ${character.crew}`,
        `Rarity: ${config.name}`,
        '',
        `${bgParticle} "The seas have chosen you!" ${bgParticle}`,
        ''
    ];
    
    const frameContent = VisualEffects.createFixedFrame(lines);
    let description = '```\n' + frameContent + '\n```';
    
    // Add rarity-specific effects only after full reveal
    if (!entrance) {
        const rarityEffects = {
            omnipotent: `\n\n🌌 **OMNIPOTENT PULL!** 🌌\n✨ *The cosmos itself bows before you!* ✨\n${bgParticle} *Reality reshapes at your will!* ${bgParticle}`,
            mythical: `\n\n🔮 **MYTHICAL PULL!** 🔮\n🌟 *Legends become reality!* 🌟\n${bgParticle} *The impossible is now possible!* ${bgParticle}`,
            legendary: `\n\n🟡 **LEGENDARY PULL!** 🟡\n⚡ *A legend walks among us!* ⚡\n${bgParticle} *History trembles before this power!* ${bgParticle}`,
            rare: `\n\n🔵 **RARE PULL!** 🔵\n💎 *A skilled warrior joins your crew!* 💎`,
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
            text: `${entrance ? 'Materializing from the seas...' : `Congratulations ${interaction.user.username}!`} | One Piece Gacha ${bgParticle}`,
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
