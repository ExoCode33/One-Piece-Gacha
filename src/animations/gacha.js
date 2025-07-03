const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');
const { NextGenGachaEngine, setDebugMode, setForcedRarity, DEBUG_CONFIG, getTestRarity } = require('./engine');
const { IndicatorsSystem } = require('./indicators');
const { ParticlesSystem } = require('./particles');

// PHASE 1: Mystical Initialization (8 frames, 2 seconds)
function createMysticalInitialization(frame, user, rarity, devilFruit) {
    const percentage = Math.floor((frame / 7) * 15); // 0-15%
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 3, 1, user?.id?.slice(-2) || 0);
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'scanning', color);
    const particles = ParticlesSystem.createOnePieceParticles(frame + 4, 'ocean', 'common');
    
    const mysticalMessages = [
        `)
        .setFooter({ text: `🎭 Final Revelation | The Grand Line has chosen!` });
}

// PHASE 6: Slow Typewriter Revelation (10 frames, 5 seconds) - COLORS FROZEN
function createSlowTypewriterReveal(frame, devilFruit, rarity, user) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const particles = ParticlesSystem.createOnePieceParticles(12, 'celebration', rarity);
    
    // FREEZE COLOR - use the rarity's specific color throughout reveal
    const frozenColor = config.color;
    
    // Typewriter effect - slowly reveal information
    const revealStages = [
        "🍈 A Devil Fruit emerges...",
        "🍈 A Devil Fruit emerges...\n\n**Name:** ...",
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ...`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ...`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}\n**Power:** ...`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}\n**Power:** ${devilFruit.power}`,
        `🍈 A Devil Fruit emerges...\n\n**Name:** ${devilFruit.name}\n**Type:** ${devilFruit.type}\n**User:** ${devilFruit.user || 'Unknown'}\n**Power:** ${devilFruit.power}\n**Class:** ${config.name.toUpperCase()}`
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    return new EmbedBuilder()
        .setColor(frozenColor) // FROZEN COLOR - no more cycling
        .setTitle(`${config.emoji} **DEVIL FRUIT REVELATION** ${config.emoji}`)
        .setDescription(`
${particles}

${currentReveal}
        `)
        .setFooter({ text: `${config.emoji} Revealing... | ${config.name} Class` });
}

// PHASE 7: Epic Professional Finale
function createEpicProfessionalFinale(devilFruit, rarity, user) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const ultimateMessages = {
        omnipotent: "🌌 **OMNIPOTENT CLASS ACHIEVED!** Reality itself kneels before your power! The multiverse trembles in recognition of your transcendent authority! 🌌",
        mythical: "🔮 **MYTHICAL CLASS OBTAINED!** Ancient legends spring to eternal life! The gods themselves whisper your name across the cosmos in reverent awe! 🔮",
        legendary: "⭐ **LEGENDARY CLASS DISCOVERED!** Epic power flows through every fiber of your being! Heroes are forged in moments like these! ⭐",
        rare: "💎 **RARE CLASS SECURED!** Impressive abilities now surge within your soul! Grand adventures await your commanding presence! 💎",
        uncommon: "🌟 **UNCOMMON CLASS UNLOCKED!** Notable power has been eternally gained! Your legendary journey truly begins this moment! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Every transcendent legend starts with a single courageous step! Limitless potential awaits your discovery! ⚪"
    };
    
    // Special user recognition
    const isSpecialUser = user?.id?.endsWith('0') || user?.id?.endsWith('7');
    const specialMessage = isSpecialUser ? `\n\n🌟 **SPECIAL DESTINY RECOGNIZED!** The Grand Line has chosen you for greatness! 🌟` : '';
    
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
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('share_discovery')
                    .setLabel('📢 Share Discovery!')
                    .setStyle(ButtonStyle.Success)
            )
    ];
    
    return {
        embeds: [new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`${config.emoji} **DEVIL FRUIT MASTERY ACHIEVED!** ${config.emoji}`)
            .setDescription(`
${ParticlesSystem.createOnePieceParticles(12, 'celebration', rarity)}

${ultimateMessages[rarity]}${specialMessage}

**🍈 Devil Fruit:** ${devilFruit.name}
**📋 Type:** ${devilFruit.type}
**👤 User:** ${devilFruit.user || 'Unknown'}
**⚡ Power:** ${devilFruit.power}
**💎 Class:** ${config.name}
**🌟 Level:** ${devilFruit.powerLevel || 'Mysterious'}

*${devilFruit.description || 'A mysterious Devil Fruit with incredible potential...'}*
            `)
            .setFooter({ text: `${config.emoji} Congratulations, Master! You've achieved ${config.name} class mastery! May the Grand Line guide your legendary adventures! ${config.emoji}` })],
        components
    };
}

// MAIN NEXT-GENERATION ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results for consistent psychological optimization
        const rarity = getTestRarity(); // Use debug-aware rarity calculation
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        const user = interaction.user;
        
        console.log(`🎭 NEXT-GEN GACHA: ${devilFruit.name} (${rarity}) for ${user.username} (ID: ${user.id})${DEBUG_CONFIG.enabled ? ' [DEBUG MODE]' : ''}`);
        
        // PHASE 1: Mystical Initialization (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createMysticalInitialization(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra-fast color cycling
        }
        
        // PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEnergyAmplification(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Lightning-fast transitions
        }
        
        // PHASE 3: Advanced Fake-Out Sequence (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createAdvancedFakeOut(frame, rarity, user, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Dramatic tension building
        }
        
        // PHASE 4: Quantum Materialization (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createQuantumMaterialization(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Building to climax
        }
        
        // PHASE 5: Ultimate Revelation (10 frames, 2.5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createUltimateRevelation(frame, user, rarity, devilFruit);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Climactic revelation
        }
        
        // PHASE 6: Slow Typewriter Revelation (10 frames, 5 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createSlowTypewriterReveal(frame, devilFruit, rarity, user);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500)); // Slower for typewriter effect
        }
        
        // PHASE 7: Epic Professional Finale (permanent display)
        const finale = createEpicProfessionalFinale(devilFruit, rarity, user);
        await interaction.editReply(finale);
        
        console.log(`🎊 NEXT-GEN SUCCESS: ${devilFruit.name} (${rarity}) mastered by ${user.username}! Power level: ${devilFruit.powerLevel || 'Transcendent'}`);
        
        return { devilFruit, rarity, user };
        
    } catch (error) {
        console.error('🚨 Next-Gen Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Cosmic Forces Resist!')
            .setDescription('The Devil Fruit\'s transcendent power overwhelmed the dimensional scanning matrix! The multiverse\'s mysteries remain hidden... for now. The Grand Line\'s greatest secrets require patience.')
            .setColor('#FF4500')
            .setFooter({ text: 'Next-Generation Gacha System | Cosmic interference detected - please attempt another transcendent hunt' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience,
    // Export debug functions for /admin command
    setDebugMode,
    setForcedRarity,
    DEBUG_CONFIG
};"🔍 Scanning the Grand Line for Devil Fruits...",
        "🌊 The ocean's power stirs beneath the waves...",
        "⚡ A Devil Fruit's presence grows stronger...",
        "🔮 The sea's will guides us to treasure..."
    ];
    
    const message = mysticalMessages[Math.floor(frame / 2)] || mysticalMessages[0];
    const indicators = IndicatorsSystem.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🔮 **DEVIL FRUIT HUNT BEGINS** 🔮')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `🔮 Phase: Devil Fruit Hunt | Searching the Grand Line...` });
}

// PHASE 2: Energy Amplification (10 frames, 2.5 seconds)
function createEnergyAmplification(frame, user, rarity, devilFruit) {
    const percentage = 15 + Math.floor((frame / 9) * 30); // 15-45%
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 5 + 20, 2, user?.id?.slice(-2) || 0);
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'charging', color);
    const particles = ParticlesSystem.createOnePieceParticles(frame + 10, 'energy', 'uncommon');
    
    const amplificationMessages = [
        "💥 The sea's power is building rapidly!",
        "🔥 Devil Fruit energy growing stronger!",
        "⚡ The Grand Line responds to our call!",
        "✨ Ocean currents swirl with hidden power!",
        "🌟 A Devil Fruit draws near!"
    ];
    
    const message = amplificationMessages[Math.floor(frame / 2)] || amplificationMessages[0];
    const indicators = IndicatorsSystem.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('💥 **DEVIL FRUIT POWER RISING** 💥')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `💥 Phase: Power Rising | Devil Fruit energy building!` });
}

// PHASE 3: Advanced Fake-Out Sequence (8 frames, 2 seconds)
function createAdvancedFakeOut(frame, actualRarity, user, devilFruit) {
    const percentage = 45 + Math.floor((frame / 7) * 25); // 45-70%
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 7 + 40, 3, user?.id?.slice(-2) || 0);
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'critical', color);
    const particles = ParticlesSystem.createOnePieceParticles(frame + 15, 'grandline', 'rare');
    
    const indicators = IndicatorsSystem.getChangingIndicators(frame, actualRarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🌟 **DEVIL FRUIT APPROACHING** 🌟')
        .setDescription(`
${particles}

${energyStatus}

*🎯 A Devil Fruit's spirit awakens from the ocean depths...*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `🌟 Phase: Devil Fruit Approaching | The sea chooses!` });
}

// PHASE 4: Quantum Materialization (8 frames, 2 seconds)
function createQuantumMaterialization(frame, user, rarity, devilFruit) {
    const percentage = 70 + Math.floor((frame / 7) * 25); // 70-95%
    const color = NextGenGachaEngine.getHyperSpectrumColor(frame * 9 + 80, 4, user?.id?.slice(-2) || 0);
    const energyStatus = NextGenGachaEngine.createDynamicEnergyStatus(percentage, frame, 'materializing', color);
    const particles = ParticlesSystem.createOnePieceParticles(frame + 22, 'grandline', 'legendary');
    
    const materializationMessages = [
        "✨ The Devil Fruit begins to take form...",
        "🍈 Ocean currents shape the fruit's power...",
        "💎 The fruit's true nature becomes clear...",
        "🌟 A Devil Fruit emerges from the sea...",
        "⭐ The ocean's gift is almost ready..."
    ];
    
    const message = materializationMessages[Math.floor(frame / 2)] || materializationMessages[0];
    const indicators = IndicatorsSystem.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('✨ **DEVIL FRUIT FORMING** ✨')
        .setDescription(`
${particles}

${energyStatus}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}
        `)
        .setFooter({ text: `✨ Phase: Devil Fruit Forming | The sea's gift takes shape...` });
}

// PHASE 5: Ultimate Revelation (10 frames, 2.5 seconds) - NOW WITH RARITY REVEAL BAR
function createUltimateRevelation(frame, user, rarity, devilFruit) {
    const percentage = 95 + Math.floor((frame / 9) * 5); // 95-100%
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const color = config.color; // Use rarity color
    const particles = ParticlesSystem.createOnePieceParticles(15, 'grandline', 'omnipotent');
    
    // USE RARITY REVEAL BAR instead of regular energy status
    const energyComplete = NextGenGachaEngine.createRarityRevealBar(rarity, frame);
    
    const revelationMessages = [
        "🎭 The Grand Line reveals its secret...",
        "🌊 Ancient ocean power surfaces...",
        "⚡ The Devil Fruit shows its true form...",
        "✨ Behold! Your destiny emerges...",
        "🍈 The ocean's greatest gift appears...",
        "🌟 Witness the birth of power...",
        "💫 The sea itself celebrates...",
        "🌌 The Grand Line acknowledges you...",
        "🎊 **THE DEVIL FRUIT IS REVEALED!**",
        "👑 **YOUR POWER AWAITS!**"
    ];
    
    const message = revelationMessages[frame] || revelationMessages[revelationMessages.length - 1];
    const indicators = IndicatorsSystem.getChangingIndicators(frame, rarity, devilFruit.type);
    
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('🎭 **THE DEVIL FRUIT REVEALS ITSELF** 🎭')
        .setDescription(`
${particles}

${energyComplete}

*${message}*

⚡ **Devil Fruit Aura:** ${indicators.aura}
🔥 **Sea's Blessing:** ${indicators.blessing}
💫 **Type Signature:** ${indicators.type}

🎊 **THE FRUIT IS READY!** 🎊
👑 **PREPARE FOR YOUR REWARD!** 👑
