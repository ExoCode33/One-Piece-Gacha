const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');
const { NextGenGachaEngine, getTestRarity } = require('./engine');
const { IndicatorsSystem } = require('./indicators');
const { ParticlesSystem } = require('./particles');

// ═══════════════════════════════════════════════════════════════════
//                    ULTIMATE CINEMATIC EXPERIENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        // PHASE 1: Determine rarity (respects debug mode)
        const targetRarity = getTestRarity();
        const targetFruit = DevilFruitDatabase.getRandomDevilFruit(targetRarity);
        
        if (!targetFruit) {
            throw new Error(`No Devil Fruit found for rarity: ${targetRarity}`);
        }

        console.log(`🎯 Animation Starting: ${targetFruit.name} (${targetRarity})`);

        // PHASE 2: Initial hunt message
        const initialEmbed = new EmbedBuilder()
            .setTitle('🌊 **THE GRAND LINE BECKONS** 🌊')
            .setDescription(`
🏴‍☠️ **${interaction.user.username}** sets sail into the unknown...

**⚓ DEVIL FRUIT HUNT INITIATED**
The seas whisper of legendary treasures...
            `)
            .setColor('#0099FF')
            .setFooter({ text: 'The hunt begins...' });

        const huntMessage = await interaction.editReply({ embeds: [initialEmbed] });

        // PHASE 3: Animated search sequence (8 frames)
        const searchFrames = [
            { title: '🌊 **SCANNING THE HORIZON** 🌊', desc: 'The wind carries whispers of power...', color: '#3498DB' },
            { title: '⚡ **ENERGY DETECTED** ⚡', desc: 'Something stirs beneath the waves...', color: '#E74C3C' },
            { title: '🌀 **FORCES CONVERGING** 🌀', desc: 'The sea begins to churn ominously...', color: '#F39C12' },
            { title: '💫 **POWER AWAKENING** 💫', desc: 'Ancient energies rise from the depths...', color: '#9B59B6' },
            { title: '🔥 **MANIFESTATION BEGINS** 🔥', desc: 'Reality bends to legendary will...', color: '#E67E22' },
            { title: '⭐ **DESTINY CALLING** ⭐', desc: 'The chosen fruit reveals itself...', color: '#F1C40F' },
            { title: '🌟 **POWER CRYSTALLIZING** 🌟', desc: 'Infinite possibilities converge...', color: '#8E44AD' },
            { title: '🎆 **MOMENT OF TRUTH** 🎆', desc: 'The Grand Line bestows its gift...', color: '#2ECC71' }
        ];

        // Consistent fast animation - no slowdown at the end
        const totalFrames = 18; // Reduced frames for faster animation
        
        for (let frame = 0; frame < totalFrames; frame++) {
            // Calculate which search frame we're in
            const searchFrameIndex = Math.floor((frame / totalFrames) * searchFrames.length);
            const frameData = searchFrames[Math.min(searchFrameIndex, searchFrames.length - 1)];
            
            // Linear progression - no slowdown
            const progressPercentage = ((frame + 1) / totalFrames) * 100;
            
            const indicators = IndicatorsSystem.getChangingIndicators(frame, targetRarity, targetFruit.type);
            const particles = ParticlesSystem.createOnePieceParticles(frame + 3, 'energy', targetRarity);
            
            // More dramatic color switching based on progression
            let currentColor = frameData.color;
            if (progressPercentage > 70) {
                // Final stages - rapid color switching
                const finalColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF'];
                currentColor = finalColors[frame % finalColors.length];
            } else if (progressPercentage > 40) {
                // Building tension - moderate color switching
                const tensionColors = ['#E74C3C', '#F39C12', '#F1C40F', '#9B59B6'];
                currentColor = tensionColors[Math.floor(frame / 2) % tensionColors.length];
            }
            
            // Create progress bar with the SAME color as the embed
            const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                progressPercentage,
                frame,
                'charging',
                currentColor // Pass the exact same color used for embed
            );

            const searchEmbed = new EmbedBuilder()
                .setTitle(frameData.title)
                .setDescription(`
**${frameData.desc}**

**🔮 AURA STATUS:** ${indicators.aura}
**✨ BLESSING LEVEL:** ${indicators.blessing}  
**🌊 POWER TYPE:** ${indicators.type}

${progressBar}

${particles}
                `)
                .setColor(currentColor) // Embed uses this color
                .setFooter({ text: `Hunt Progress: ${Math.round(progressPercentage)}%` });

            await huntMessage.edit({ embeds: [searchEmbed] });
            
            // Consistent fast timing - no slowdown
            await new Promise(resolve => setTimeout(resolve, 500)); // Consistent 500ms per frame
        }

        // PHASE 4: Final reveal with full animation
        const rarityConfig = DevilFruitDatabase.getRarityConfig(targetRarity);
        const finalParticles = ParticlesSystem.createOnePieceParticles(10, 'celebration', targetRarity);
        const finalProgressBar = NextGenGachaEngine.createRarityRevealBar(targetRarity, 0);

        // Determine rarity-specific reveal
        const rarityTitles = {
            common: '🍈 **DEVIL FRUIT DISCOVERED** 🍈',
            uncommon: '🍈 **NOTABLE POWER AWAKENED** 🍈',
            rare: '🍈 **RARE TREASURE CLAIMED** 🍈',
            legendary: '🍈 **LEGENDARY MIGHT UNLEASHED** 🍈',
            mythical: '🍈 **MYTHICAL FORCE MANIFESTED** 🍈',
            omnipotent: '🍈 **OMNIPOTENT REALITY TRANSCENDED** 🍈'
        };

        const rarityDescriptions = {
            common: '⚓ A Devil Fruit has chosen you!',
            uncommon: '🌊 The seas have blessed you with power!',
            rare: '⚡ Rare energies flow through this fruit!',
            legendary: '🔥 **LEGENDARY CLASS ACHIEVED!** The Grand Line acknowledges your worth!',
            mythical: '👑 **MYTHICAL POWER BESTOWED!** The world trembles before this might!',
            omnipotent: '🌌 **OMNIPOTENT TRANSCENDENCE!** Reality itself bends to your will!'
        };

        const typeEmojis = {
            'Paramecia': '🔮',
            'Zoan': '🐺',
            'Logia': '🌪️',
            'Ancient Zoan': '🦕',
            'Mythical Zoan': '🐉',
            'Special Paramecia': '✨'
        };

        const finalEmbed = new EmbedBuilder()
            .setTitle(rarityTitles[targetRarity] || rarityTitles.common)
            .setDescription(`
${rarityDescriptions[targetRarity] || rarityDescriptions.common}

**🍈 Devil Fruit:** ${targetFruit.name}
**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}
**👤 Previous User:** ${targetFruit.user}
**⚡ Power:** ${targetFruit.power}
**💎 Rarity:** ${rarityConfig.stars} ${rarityConfig.name}
**🌟 Power Level:** ${targetFruit.powerLevel.toLocaleString()}

*${targetFruit.description}*

**🔥 Awakening:** ${targetFruit.awakening}
**⚠️ Weakness:** ${targetFruit.weakness}

${finalProgressBar}

${finalParticles}
            `)
            .setColor(rarityConfig.color)
            .setFooter({ text: `🏴‍☠️ ${interaction.user.username}'s Devil Fruit Hunt | ${new Date().toLocaleString()}` });

        // Create action buttons
        const actionRow = new ActionRowBuilder()
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
                    .setLabel('📢 Share Discovery')
                    .setStyle(ButtonStyle.Success)
            );

        await huntMessage.edit({ embeds: [finalEmbed], components: [actionRow] });

        // Return result for statistics tracking
        return {
            devilFruit: targetFruit,
            rarity: targetRarity,
            user: interaction.user,
            timestamp: new Date()
        };

    } catch (error) {
        console.error('🚨 Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ **THE GRAND LINE REJECTED YOU** ⚠️')
            .setDescription(`
🌊 The seas have turned turbulent! 

**Error:** ${error.message}

*The Devil Fruits have retreated to the depths... try again when the waters calm.*
            `)
            .setColor('#E74C3C')
            .setFooter({ text: 'Hunt failed - please try again' });

        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════
//                        BUTTON INTERACTIONS
// ═══════════════════════════════════════════════════════════════════

async function handleHuntAgain(interaction) {
    try {
        await interaction.deferUpdate();
        
        // Clear the old message and start new hunt
        await createUltimateCinematicExperience(interaction);
        
    } catch (error) {
        console.error('Hunt again error:', error);
        await interaction.followUp({
            content: '❌ Unable to start new hunt! Please use `/pull` command.',
            ephemeral: true
        });
    }
}

async function handleViewCollection(interaction) {
    // Collection view (to be implemented)
    const collectionEmbed = new EmbedBuilder()
        .setTitle('📚 **Your Devil Fruit Collection**')
        .setDescription('🚧 Collection system coming soon!\n\nFor now, enjoy hunting for Devil Fruits!')
        .setColor('#3498DB')
        .setFooter({ text: 'Collection feature in development' });

    await interaction.reply({ embeds: [collectionEmbed], ephemeral: true });
}

async function handleShareDiscovery(interaction) {
    const shareEmbed = new EmbedBuilder()
        .setTitle('📢 **Amazing Devil Fruit Discovery!**')
        .setDescription(`🎉 **${interaction.user.username}** just discovered an incredible Devil Fruit!\n\nCheck out their legendary find above! 🏴‍☠️`)
        .setColor('#E67E22')
        .setFooter({ text: '🍈 Join the hunt with /pull!' });

    await interaction.reply({ embeds: [shareEmbed] });
}

module.exports = {
    createUltimateCinematicExperience,
    handleHuntAgain,
    handleViewCollection,
    handleShareDiscovery
};
