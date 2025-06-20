const { EmbedBuilder } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Clean, simple visual effects
const VisualEffects = {
    particles: {
        water: ['🌊', '💧', '🌀'],
        energy: ['⚡', '🔥', '💥'],
        cosmic: ['🌌', '🌟', '✨'],
        divine: ['👑', '💎', '✨']
    },

    spinners: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'],
    
    getSpinner(frame) {
        return this.spinners[frame % this.spinners.length];
    },

    getParticle(type, frame) {
        const particles = this.particles[type] || this.particles.water;
        return particles[frame % particles.length];
    }
};

/**
 * Creates a clean starting embed - no complex frames
 */
function createStartEmbed(frame = 0) {
    const particle = VisualEffects.getParticle('water', frame);
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(`
**${particle} SEARCHING THE SEAS ${particle}**

\`\`\`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\`\`\`

*The Grand Line calls to you...*
        `)
        .setColor('#0099FF')
        .setFooter({ text: 'Adventure awaits! ⚓' });
}

/**
 * Creates a clean spinning embed
 */
function createSpinEmbed(frame) {
    const spinner = VisualEffects.getSpinner(frame);
    const intensity = Math.floor(frame / 3);
    const particle = VisualEffects.getParticle('energy', frame);
    
    const colors = ['#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
    const color = colors[Math.min(intensity, colors.length - 1)];
    
    const messages = [
        'The seas stir...',
        'Power builds...',
        'Energy rising...',
        'MAXIMUM POWER!'
    ];
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(`
**${particle} ${spinner} PULLING ${spinner} ${particle}**

\`\`\`
≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
\`\`\`

*${messages[Math.min(intensity, messages.length - 1)]}*
        `)
        .setColor(color)
        .setFooter({ text: `${particle} Power Level: ${intensity + 1}/4` });
}

/**
 * Creates a clean rarity reveal
 */
function createRarityEmbed(rarity) {
    const config = rarities[rarity];
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ Rarity Revealed!')
        .setDescription(`
${config.emoji.repeat(5)}

**${config.name.toUpperCase()} RARITY**

${config.stars}

\`\`\`
${config.emoji.repeat(15)}
${config.emoji.repeat(15)}
${config.emoji.repeat(15)}
\`\`\`

*A ${config.name.toLowerCase()} pull appears!*
        `)
        .setColor(config.color)
        .setFooter({ text: `${config.stars} ${config.name} Rarity!` });
}

/**
 * Creates a clean final character reveal
 */
function createFinalEmbed(character, rarity, interaction, isEntrance = false) {
    const config = rarities[rarity];
    const particle = VisualEffects.getParticle(
        rarity === 'omnipotent' ? 'divine' : 
        rarity === 'mythical' ? 'cosmic' : 'energy', 
        0
    );
    
    if (isEntrance) {
        return new EmbedBuilder()
            .setTitle(`${config.emoji} Summoning... ${config.emoji}`)
            .setDescription(`
**${config.stars}**

\`\`\`
████████████████████████
████ MATERIALIZING ████
████████████████████████
\`\`\`

*${particle} The seas part to reveal a warrior... ${particle}*
            `)
            .setColor(config.color)
            .setFooter({ text: 'A legend approaches...' });
    }
    
    let description = `
**${config.stars}**

**${character.name}**

**Bounty:** ${character.bounty} Berry
**Crew:** ${character.crew}
**Rarity:** ${config.name}

*"The seas have chosen you!"*
    `;
    
    // Add rarity-specific effects
    const effects = {
        omnipotent: `\n\n🌌 **OMNIPOTENT PULL!** 🌌\n✨ *Reality bends to your will!* ✨`,
        mythical: `\n\n🔮 **MYTHICAL PULL!** 🔮\n🌟 *Legends become reality!* 🌟`,
        legendary: `\n\n🟡 **LEGENDARY PULL!** 🟡\n⚡ *A legend walks among us!* ⚡`,
        rare: `\n\n🔵 **RARE PULL!** 🔵\n💎 *A skilled warrior joins!* 💎`,
        uncommon: `\n\n🟢 **UNCOMMON PULL!** 🟢\n🌟 *A promising pirate!* 🌟`,
        common: `\n\n⚪ **COMMON PULL!** ⚪\n⭐ *A reliable crew member!* ⭐`
    };
    
    description += effects[rarity] || '';
    
    return new EmbedBuilder()
        .setTitle(`${config.emoji} ${character.name} ${config.emoji}`)
        .setDescription(description)
        .setColor(config.color)
        .setFooter({ 
            text: `Congratulations ${interaction.user.username}! | One Piece Gacha`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
}

/**
 * Main gacha animation - clean and simple
 */
async function createGachaAnimation(interaction) {
    try {
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        
        // Phase 1: Start animation (3 frames)
        for (let frame = 0; frame < 3; frame++) {
            const embed = createStartEmbed(frame);
            await interaction.editReply({ embeds: [embed] });
            await sleep(500);
        }
        
        // Phase 2: Spinning animation (12 frames)
        for (let frame = 0; frame < 12; frame++) {
            const embed = createSpinEmbed(frame);
            await interaction.editReply({ embeds: [embed] });
            await sleep(250);
        }
        
        // Phase 3: Rarity reveal
        const rarityEmbed = createRarityEmbed(rarity);
        await interaction.editReply({ embeds: [rarityEmbed] });
        await sleep(2000);
        
        // Phase 4: Character entrance
        const entranceEmbed = createFinalEmbed(character, rarity, interaction, true);
        await interaction.editReply({ embeds: [entranceEmbed] });
        await sleep(1500);
        
        // Phase 5: Final reveal
        const finalEmbed = createFinalEmbed(character, rarity, interaction, false);
        await interaction.editReply({ embeds: [finalEmbed] });
        
    } catch (error) {
        console.error('Animation error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('Something went wrong! The Grand Line can be unpredictable...')
            .setColor('#FF0000');
            
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = {
    createGachaAnimation
};
