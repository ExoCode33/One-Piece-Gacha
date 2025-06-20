const { EmbedBuilder } = require('discord.js');
const { timings } = require('../../config/bot');
const { rarities, getRarity, getRandomCharacter } = require('../data/examples');

// Helper function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Creates the starting animation embed
 */
function createStartEmbed() {
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription('```\n🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊\n🌊  Searching the seas...  🌊\n🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊\n```')
        .setColor('#0099FF')
        .setFooter({ text: 'A new adventure awaits!' });
}

/**
 * Creates spinning animation embed
 */
function createSpinEmbed(spinChar) {
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Gacha Pull')
        .setDescription(`\`\`\`\n🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊\n🌊     ${spinChar} PULLING ${spinChar}     🌊\n🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊\n\`\`\``)
        .setColor('#FFD700')
        .setFooter({ text: 'The Grand Line reveals its secrets...' });
}

/**
 * Creates rarity reveal embed
 */
function createRarityEmbed(rarity) {
    const config = rarities[rarity];
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ Rarity Revealed!')
        .setDescription(`\`\`\`\n${config.emoji.repeat(10)}\n${config.emoji}  ${config.name.toUpperCase()}  ${config.emoji}\n${config.emoji.repeat(10)}\n\`\`\``)
        .setColor(config.color)
        .setFooter({ text: `${config.stars} ${config.name} Rarity!` });
}

/**
 * Creates final character reveal embed
 */
function createFinalEmbed(character, rarity, interaction) {
    const config = rarities[rarity];
    
    let description = `
        **${config.stars}**
        
        **Bounty:** ${character.bounty} Berry
        **Crew:** ${character.crew}
        **Rarity:** ${config.name}
        
        *"The seas have chosen you!"*
    `;
    
    // Add special effects based on rarity
    if (rarity === 'omnipotent') {
        description += '\n\n🌌 **OMNIPOTENT PULL!** 🌌\n✨ *The cosmos itself bows before you!* ✨';
    } else if (rarity === 'mythical') {
        description += '\n\n🔮 **MYTHICAL PULL!** 🔮\n🌟 *Reality shifts to your will!* 🌟';
    } else if (rarity === 'legendary') {
        description += '\n\n🟡 **LEGENDARY PULL!** 🟡\n⚡ *A legend walks among us!* ⚡';
    } else if (rarity === 'rare') {
        description += '\n\n🔵 **RARE PULL!** 🔵\n💎 *A skilled warrior joins!* 💎';
    }
    
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
 * Main gacha animation function
 */
async function createGachaAnimation(interaction) {
    try {
        // Determine what we're pulling
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        
        // Phase 1: Initial pull
        const startEmbed = createStartEmbed();
        await interaction.editReply({ embeds: [startEmbed] });
        await sleep(timings.initialPull);
        
        // Phase 2: Spinning animation
        const spinFrames = ['◐', '◓', '◑', '◒'];
        for (let i = 0; i < timings.spinFrames; i++) {
            const spinEmbed = createSpinEmbed(spinFrames[i % 4]);
            await interaction.editReply({ embeds: [spinEmbed] });
            await sleep(timings.spinFrame);
        }
        
        // Phase 3: Rarity reveal
        const rarityEmbed = createRarityEmbed(rarity);
        await interaction.editReply({ embeds: [rarityEmbed] });
        await sleep(timings.rarityReveal);
        
        // Phase 4: Character reveal
        const finalEmbed = createFinalEmbed(character, rarity, interaction);
        await interaction.editReply({ embeds: [finalEmbed] });
        
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
