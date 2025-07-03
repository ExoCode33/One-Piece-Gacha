const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    CLEAN PROFESSIONAL ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

const CleanEngine = {
    // 120+ ULTRA-DIVERSE COLORS for lightning-fast cycling
    hyperColors: [
        '#FF0000', '#FF1100', '#FF2200', '#FF3300', '#FF4400', '#FF5500', '#FF6600', '#FF7700',
        '#FF8800', '#FF9900', '#FFAA00', '#FFBB00', '#FFCC00', '#FFDD00', '#FFEE00', '#FFFF00',
        '#EEFF00', '#DDFF00', '#CCFF00', '#BBFF00', '#AAFF00', '#99FF00', '#88FF00', '#77FF00',
        '#66FF00', '#55FF00', '#44FF00', '#33FF00', '#22FF00', '#11FF00', '#00FF00', '#00FF11',
        '#00FF22', '#00FF33', '#00FF44', '#00FF55', '#00FF66', '#00FF77', '#00FF88', '#00FF99',
        '#00FFAA', '#00FFBB', '#00FFCC', '#00FFDD', '#00FFEE', '#00FFFF', '#00EEFF', '#00DDFF',
        '#00CCFF', '#00BBFF', '#00AAFF', '#0099FF', '#0088FF', '#0077FF', '#0066FF', '#0055FF',
        '#0044FF', '#0033FF', '#0022FF', '#0011FF', '#0000FF', '#1100FF', '#2200FF', '#3300FF',
        '#4400FF', '#5500FF', '#6600FF', '#7700FF', '#8800FF', '#9900FF', '#AA00FF', '#BB00FF',
        '#CC00FF', '#DD00FF', '#EE00FF', '#FF00FF', '#FF00EE', '#FF00DD', '#FF00CC', '#FF00BB',
        '#FF00AA', '#FF0099', '#FF0088', '#FF0077', '#FF0066', '#FF0055', '#FF0044', '#FF0033',
        '#FF0022', '#FF0011', '#8B0000', '#DC143C', '#B22222', '#CD5C5C', '#F08080', '#FA8072',
        '#E9967A', '#FFA07A', '#FF7F50', '#FF6347', '#FF4500', '#FFD700', '#FFFF00', '#ADFF2F',
        '#7FFF00', '#32CD32', '#00FF7F', '#00FA9A', '#40E0D0', '#00CED1', '#5F9EA0', '#4682B4',
        '#6495ED', '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#0000FF', '#0000CD', '#4169E1'
    ],

    // ULTRA-FAST color cycling
    getHyperColor(frame, intensity = 1) {
        const stream1 = (frame * 17 + intensity * 23) % this.hyperColors.length;
        const stream2 = (frame * 31 + intensity * 41) % this.hyperColors.length;
        const combinedIndex = (stream1 + stream2) % this.hyperColors.length;
        return this.hyperColors[combinedIndex];
    },

    // Clean particle effects - no overload
    createCleanParticles(intensity) {
        const particles = ['⚡', '✨', '💫', '🔥', '💥', '⭐'];
        const count = Math.min(intensity + 4, 8);
        return particles.slice(0, count).join('');
    },

    // Single clean charging bar
    createSingleChargingBar(percentage, frame) {
        const barLength = 20;
        const filled = Math.floor((percentage / 100) * barLength);
        const empty = barLength - filled;
        
        const filledBar = '█'.repeat(filled);
        const emptyBar = '░'.repeat(empty);
        
        // Pulsing effect on the edge
        const sparkle = percentage > 80 ? '✨' : percentage > 50 ? '⚡' : '🔋';
        
        return `${sparkle} [${filledBar}${emptyBar}] ${percentage}%`;
    }
};

// PHASE 1: Energy Detection (6 frames, 1.5 seconds)
function createEnergyDetection(frame) {
    const percentage = Math.floor((frame / 5) * 25); // 0-25%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 2);
    
    const messages = [
        "🔍 Scanning the Grand Line for Devil Fruit energy...",
        "⚡ Mysterious power signature detected...",
        "🌊 Ancient energy stirring in the depths..."
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 3, 1))
        .setTitle('🔍 **DEVIL FRUIT ENERGY DETECTION** 🔍')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `🔋 Scanning... | ${percentage}% Complete` });
}

// PHASE 2: Power Surge (8 frames, 2 seconds)
function createPowerSurge(frame) {
    const percentage = 25 + Math.floor((frame / 7) * 40); // 25-65%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 6);
    
    const messages = [
        "💥 MASSIVE ENERGY SURGE DETECTED!",
        "🔥 Power levels climbing rapidly!",
        "⚡ Devil Fruit signature intensifying!",
        "✨ Extraordinary energy resonance confirmed!"
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 5 + 15, 2))
        .setTitle('💥 **POWER SURGE DETECTED** 💥')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `⚡ Power Surge | ${percentage}% Complete` });
}

// PHASE 3: Critical Phase (6 frames, 1.5 seconds)
function createCriticalPhase(frame) {
    const percentage = 65 + Math.floor((frame / 5) * 25); // 65-90%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 10);
    
    const messages = [
        "🌟 CRITICAL ENERGY THRESHOLD REACHED!",
        "💫 Power crystallization initiating...",
        "⭐ Devil Fruit formation beginning..."
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 7 + 30, 3))
        .setTitle('🌟 **CRITICAL PHASE ACTIVATED** 🌟')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `🌟 Critical Phase | ${percentage}% Complete` });
}

// PHASE 4: Final Materialization (6 frames, 1.5 seconds)
function createFinalMaterialization(frame) {
    const percentage = 90 + Math.floor((frame / 5) * 10); // 90-100%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 12);
    
    const messages = [
        "✨ Final materialization sequence...",
        "🍈 Devil Fruit taking physical form...",
        "💎 Manifestation complete!"
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 9 + 50, 4))
        .setTitle('✨ **FINAL MATERIALIZATION** ✨')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `✨ Materializing | ${percentage}% Complete` });
}

// PHASE 5: Devil Fruit Revelation (8 frames, 4 seconds)
function createDevilFruitRevelation(frame, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const particles = CleanEngine.createCleanParticles(15);
    
    const revealStages = [
        "🍈 A Devil Fruit emerges...",
        `🍈 ${devilFruit.name.substring(0, 20)}...`,
        `🍈 **${devilFruit.name}**`,
        `📋 **Type:** ${devilFruit.type}`,
        `👤 **User:** ${devilFruit.user || 'Unknown'}`,
        `⚡ **Power:** ${devilFruit.power}`,
        `💎 **Rarity:** ${rarity.toUpperCase()}`,
        `✨ **REVELATION COMPLETE!**`
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 11 + 70, 5))
        .setTitle(`${config.emoji} **DEVIL FRUIT REVEALED** ${config.emoji}`)
        .setDescription(`
${particles}

🔋 [████████████████████] 100% ✨

*${currentReveal}*
        `)
        .setFooter({ text: `${config.emoji} ${config.name} Class Devil Fruit | Revelation Complete!` });
}

// PHASE 6: Epic Finale
function createEpicFinale(devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const rarityMessages = {
        omnipotent: "🌌 **OMNIPOTENT CLASS!** Reality bends to your will! 🌌",
        mythical: "🔮 **MYTHICAL CLASS!** Ancient legends come alive! 🔮",
        legendary: "⭐ **LEGENDARY CLASS!** Epic power flows through you! ⭐",
        rare: "💎 **RARE CLASS!** Impressive abilities unlocked! 💎",
        uncommon: "🌟 **UNCOMMON CLASS!** Notable power gained! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Your journey begins! ⚪"
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
${CleanEngine.createCleanParticles(20)}

${rarityMessages[rarity]}

**🍈 Name:** ${devilFruit.name}
**📋 Type:** ${devilFruit.type}
**👤 User:** ${devilFruit.user || 'Unknown'}
**⚡ Power:** ${devilFruit.power}
**💎 Class:** ${config.name}
**🌟 Level:** ${devilFruit.powerLevel || 'Mysterious'}

*${devilFruit.description || 'A mysterious Devil Fruit with incredible potential...'}*
            `)
            .setFooter({ text: `${config.emoji} Congratulations! You discovered a ${config.name} class Devil Fruit! ${config.emoji}` })],
        components
    };
}

// MAIN CLEAN ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 CLEAN HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Energy Detection (6 frames, 1.5 seconds - ULTRA FAST)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createEnergyDetection(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra fast!
        }
        
        // PHASE 2: Power Surge (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createPowerSurge(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Lightning fast!
        }
        
        // PHASE 3: Critical Phase (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createCriticalPhase(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Hyper fast!
        }
        
        // PHASE 4: Final Materialization (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalMaterialization(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Mega fast!
        }
        
        // PHASE 5: Devil Fruit Revelation (8 frames, 4 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createDevilFruitRevelation(frame, devilFruit, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500)); // Slower for dramatic reveal
        }
        
        // PHASE 6: Epic Finale (permanent display)
        const finale = createEpicFinale(devilFruit, rarity);
        await interaction.editReply(finale);
        
        console.log(`🎊 CLEAN SUCCESS: ${devilFruit.name} (${rarity}) discovered by ${interaction.user.username}!`);
        
        return { devilFruit, rarity };
        
    } catch (error) {
        console.error('🚨 Clean Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Hunt Failed!')
            .setDescription('The Devil Fruit energy was too chaotic! Please try again.')
            .setColor('#FF0000')
            .setFooter({ text: 'System Error | Please retry hunt' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience
};
