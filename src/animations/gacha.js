const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    PERFECT FAST COLOR SYSTEM - NO TROLLING
// ═══════════════════════════════════════════════════════════════════

const ColorEngine = {
    // SUPER DIVERSE COLOR PALETTE - 120+ completely different colors
    colors: [
        // REDS
        '#FF0000', '#DC143C', '#B22222', '#8B0000', '#CD5C5C', '#F08080', '#FF6347', '#FF4500',
        '#FF1493', '#C71585', '#DB7093', '#FF69B4', '#FF00FF', '#DA70D6', '#BA55D3', '#9370DB',
        
        // ORANGES & YELLOWS  
        '#FFA500', '#FF8C00', '#FF7F50', '#FFD700', '#FFFF00', '#FFFFE0', '#FFFACD', '#F0E68C',
        '#BDB76B', '#DAA520', '#B8860B', '#CD853F', '#D2691E', '#A0522D', '#8B4513', '#DEB887',
        
        // GREENS
        '#00FF00', '#32CD32', '#00FF32', '#7FFF00', '#ADFF2F', '#9AFF9A', '#98FB98', '#90EE90',
        '#00FA9A', '#00FF7F', '#40E0D0', '#48D1CC', '#00CED1', '#5F9EA0', '#4682B4', '#87CEEB',
        
        // BLUES
        '#0000FF', '#0000CD', '#000080', '#191970', '#4169E1', '#6495ED', '#7B68EE', '#8A2BE2',
        '#6A5ACD', '#483D8B', '#4B0082', '#8B008B', '#800080', '#9932CC', '#9400D3', '#7B68EE',
        
        // CYANS & TEALS
        '#00FFFF', '#E0FFFF', '#AFEEEE', '#B0E0E6', '#ADD8E6', '#87CEFA', '#87CEEB', '#00BFFF',
        '#1E90FF', '#6495ED', '#4682B4', '#5F9EA0', '#008B8B', '#20B2AA', '#48D1CC', '#40E0D0',
        
        // PURPLES & MAGENTAS
        '#8B00FF', '#9400D3', '#9932CC', '#8A2BE2', '#7B68EE', '#6A5ACD', '#483D8B', '#4B0082',
        '#800080', '#8B008B', '#FF00FF', '#DA70D6', '#BA55D3', '#9370DB', '#DDA0DD', '#EE82EE',
        
        // PINKS
        '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#C71585', '#FF6347', '#FA8072',
        '#E9967A', '#F4A460', '#FF7F50', '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00',
        
        // SPECIAL EFFECTS
        '#00FF80', '#80FF00', '#FF8000', '#8000FF', '#FF0080', '#0080FF', '#40FF40', '#FF4040',
        '#4040FF', '#FFFF40', '#FF40FF', '#40FFFF', '#808000', '#800000', '#008000', '#000080',
        
        // RAINBOW SPECTRUM
        '#FF007F', '#FF3F00', '#FF7F00', '#FFBF00', '#FFFF00', '#BFFF00', '#7FFF00', '#3FFF00',
        '#00FF00', '#00FF3F', '#00FF7F', '#00FFBF', '#00FFFF', '#00BFFF', '#007FFF', '#003FFF'
    ],

    // Get ultra-diverse color that's completely different from previous
    getUltraDiverseColor(frame) {
        // Use prime number distribution to ensure maximum color diversity
        const colorIndex = (frame * 37 + Math.floor(frame / 3) * 23 + frame * frame * 7) % this.colors.length;
        return this.colors[colorIndex];
    }
};

const ChargingEngine = {
    // RED CHARGING BAR SYSTEM
    createRedChargingBar(percentage) {
        const barLength = 30;
        const filled = Math.floor((percentage / 100) * barLength);
        const empty = barLength - filled;
        
        const filledBar = '█'.repeat(filled);
        const emptyBar = '░'.repeat(empty);
        
        return `🔴 [${filledBar}${emptyBar}] ${percentage}%`;
    },

    // Power effects with super fast color changes
    createPowerEffects(frame) {
        const effects = ['⚡', '💥', '🔥', '✨', '💫', '⭐', '🌟', '💎'];
        const selectedEffect = effects[frame % effects.length];
        return selectedEffect.repeat(8 + (frame % 4));
    }
};

// PHASE 1: Initial Charging (6 frames, 3 seconds)
function createInitialCharging(frame) {
    const percentage = Math.floor((frame / 5) * 30); // 0-30%
    const chargingBar = ChargingEngine.createRedChargingBar(percentage);
    const effects = ChargingEngine.createPowerEffects(frame);
    
    const messages = [
        "🔍 Scanning for Devil Fruit energy...",
        "⚡ Power signatures detected...",
        "🌊 The Grand Line responds..."
    ];
    
    const messageIndex = Math.floor(frame / 2);
    const message = messages[messageIndex] || messages[0];
    
    return new EmbedBuilder()
        .setColor(ColorEngine.getUltraDiverseColor(frame * 3))
        .setTitle('🍈 **DEVIL FRUIT HUNT INITIATED** 🍈')
        .setDescription(`
${effects}
═══════════════════════════════════════════
${chargingBar}
═══════════════════════════════════════════
*${message}*
        `)
        .setFooter({ text: `⚡ Power Level: ${percentage}% | Scanning...` });
}

// PHASE 2: Power Building (8 frames, 4 seconds)
function createPowerBuilding(frame) {
    const percentage = 30 + Math.floor((frame / 7) * 40); // 30-70%
    const chargingBar = ChargingEngine.createRedChargingBar(percentage);
    const effects = ChargingEngine.createPowerEffects(frame + 10);
    
    const messages = [
        "💥 Massive energy surge detected!",
        "🔥 Power levels rising rapidly!",
        "⚡ Devil Fruit energy intensifying!",
        "🌟 Something powerful approaches..."
    ];
    
    const messageIndex = Math.floor(frame / 2);
    const message = messages[messageIndex] || messages[0];
    
    return new EmbedBuilder()
        .setColor(ColorEngine.getUltraDiverseColor(frame * 5 + 20))
        .setTitle('🔥 **POWER SURGE DETECTED** 🔥')
        .setDescription(`
${effects}
═══════════════════════════════════════════
${chargingBar}
═══════════════════════════════════════════
*${message}*
        `)
        .setFooter({ text: `🔥 Power Level: ${percentage}% | Building...` });
}

// PHASE 3: Final Charging (6 frames, 3 seconds)
function createFinalCharging(frame) {
    const percentage = 70 + Math.floor((frame / 5) * 30); // 70-100%
    const chargingBar = ChargingEngine.createRedChargingBar(percentage);
    const effects = ChargingEngine.createPowerEffects(frame + 20);
    
    const messages = [
        "💫 Final energy stabilization...",
        "🎯 Devil Fruit materializing...",
        "✨ Power crystallization complete!"
    ];
    
    const messageIndex = Math.floor(frame / 2);
    const message = messages[messageIndex] || messages[0];
    
    return new EmbedBuilder()
        .setColor(ColorEngine.getUltraDiverseColor(frame * 7 + 40))
        .setTitle('✨ **ENERGY CRYSTALLIZATION** ✨')
        .setDescription(`
${effects}
═══════════════════════════════════════════
${chargingBar}
═══════════════════════════════════════════
*${message}*
        `)
        .setFooter({ text: `✨ Power Level: ${percentage}% | Crystallizing...` });
}

// PHASE 4: Devil Fruit Materialization (8 frames, 4 seconds)
function createMaterialization(frame, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const effects = ChargingEngine.createPowerEffects(frame + 30);
    
    const revealStages = [
        "🍈 A Devil Fruit emerges...",
        `🍈 ${devilFruit.name.substring(0, 10)}...`,
        `🍈 ${devilFruit.name}`,
        `📋 Type: ${devilFruit.type}`,
        `👤 ${devilFruit.user ? `User: ${devilFruit.user}` : 'User: Unknown'}`,
        `⚡ ${devilFruit.power}`,
        `💎 Rarity: ${rarity.toUpperCase()}`,
        `🌟 Power Level: ${devilFruit.powerLevel || 'Unknown'}`
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    return new EmbedBuilder()
        .setColor(ColorEngine.getUltraDiverseColor(frame * 9 + 60))
        .setTitle(`${config.emoji} **DEVIL FRUIT MATERIALIZED** ${config.emoji}`)
        .setDescription(`
${effects}
═══════════════════════════════════════════
🔴 [██████████████████████████████] 100%
═══════════════════════════════════════════
*${currentReveal}*
        `)
        .setFooter({ text: `${config.emoji} Class: ${config.name} | Complete!` });
}

// PHASE 5: Epic Finale
function createEpicFinale(devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const rarityMessages = {
        omnipotent: "🌌 **OMNIPOTENT DEVIL FRUIT ACQUIRED!** Reality bends to your will! 🌌",
        mythical: "🔮 **MYTHICAL DEVIL FRUIT OBTAINED!** Legends speak of this power! 🔮",
        legendary: "⭐ **LEGENDARY DEVIL FRUIT DISCOVERED!** Epic power flows through you! ⭐",
        rare: "💎 **RARE DEVIL FRUIT FOUND!** Impressive abilities unlocked! 💎",
        uncommon: "🌟 **UNCOMMON DEVIL FRUIT SECURED!** Notable power gained! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Every journey begins somewhere! ⚪"
    };
    
    const components = [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hunt_again')
                    .setLabel('🍈 Hunt Again!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];
    
    return {
        embeds: [new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`${config.emoji} **${devilFruit.name}** ${config.emoji}`)
            .setDescription(`
${rarityMessages[rarity]}

**🍈 Fruit:** ${devilFruit.name}
**📋 Type:** ${devilFruit.type}
**👤 Known User:** ${devilFruit.user || 'Unknown'}
**⚡ Power:** ${devilFruit.power}
**💎 Rarity:** ${config.name}
**🌟 Power Level:** ${devilFruit.powerLevel || 'Mysterious'}

*${devilFruit.description || 'A mysterious Devil Fruit with unknown potential...'}*
            `)
            .setFooter({ text: `${config.emoji} Congratulations on your Devil Fruit discovery! | ${config.name} Class` })],
        components
    };
}

// MAIN ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 DEVIL FRUIT HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Initial Charging (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createInitialCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 2: Power Building (8 frames, 4 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createPowerBuilding(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 3: Final Charging (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalCharging(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 4: Materialization (8 frames, 4 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createMaterialization(frame, devilFruit, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 5: Epic Finale (permanent display)
        const finale = createEpicFinale(devilFruit, rarity);
        await interaction.editReply(finale);
        
        console.log(`🎊 HUNT SUCCESS: ${devilFruit.name} (${rarity}) discovered by ${interaction.user.username}!`);
        
        return { devilFruit, rarity };
        
    } catch (error) {
        console.error('🚨 Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Devil Fruit Hunt Failed!')
            .setDescription('The Grand Line\'s power was too chaotic! Please try again.')
            .setColor('#FF0000')
            .setFooter({ text: 'Error in hunt sequence' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience
};
