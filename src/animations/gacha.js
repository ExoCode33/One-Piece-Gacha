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

        // PHASE 3: Connection quality test
        const connectionStart = Date.now();
        try {
            await huntMessage.edit({ embeds: [initialEmbed] });
            const connectionTime = Date.now() - connectionStart;
            console.log(`📡 Connection quality: ${connectionTime}ms`);
        } catch (error) {
            console.warn('⚠️ Connection quality test failed, using conservative settings');
        }

        // PHASE 4: Animated search sequence
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

        // Performance tracking
        let successfulFrames = 0;
        let totalAttempts = 0;

        // Slower animation with breathing room for Discord API
        const totalFrames = 20;
        const maxRetries = 2;
        const baseDelay = 700; // Increased from 400ms to 700ms
        
        for (let frame = 0; frame < totalFrames; frame++) {
            let success = false;
            let retryCount = 0;
            
            while (!success && retryCount <= maxRetries) {
                try {
                    // Calculate which search frame we're in
                    const searchFrameIndex = Math.floor((frame / totalFrames) * searchFrames.length);
                    const frameData = searchFrames[Math.min(searchFrameIndex, searchFrames.length - 1)];
                    
                    // One-by-one progression - each frame adds exactly one square
                    const progressPercentage = ((frame + 1) / totalFrames) * 100;
                    
                    const indicators = IndicatorsSystem.getChangingIndicators(frame, targetRarity, targetFruit.type);
                    const particles = ParticlesSystem.createOnePieceParticles(frame + 3, 'energy', targetRarity);
                    
                    // Fast color cycling - changes every frame
                    const fastColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#FF00FF', '#E74C3C', '#F39C12', '#9B59B6', '#2ECC71', '#3498DB'];
                    const currentColor = fastColors[frame % fastColors.length];
                    
                    // Create moving rainbow progress bar
                    const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                        progressPercentage,
                        frame,
                        'charging',
                        currentColor
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
                        .setColor(currentColor)
                        .setFooter({ text: `Hunt Progress: ${Math.round(progressPercentage)}%` });

                    // Longer timeout with more breathing room
                    const timeoutDuration = 3500 + (retryCount * 1000); // 3.5s, 4.5s, 5.5s
                    const updatePromise = huntMessage.edit({ embeds: [searchEmbed] });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                    );
                    
                    await Promise.race([updatePromise, timeoutPromise]);
                    success = true;
                    
                    // Longer delay with more breathing room
                    const delay = retryCount > 0 ? baseDelay + (retryCount * 300) : baseDelay;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    
                } catch (error) {
                    retryCount++;
                    console.error(`Animation frame ${frame} attempt ${retryCount} error:`, error.message);
                    
                    if (retryCount <= maxRetries) {
                        // Longer backoff delay
                        const retryDelay = 300 * Math.pow(2, retryCount - 1); // 300ms, 600ms, 1200ms
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                    }
                }
            }
            
            // If all retries failed, continue with animation
            if (!success) {
                console.warn(`Frame ${frame} failed after ${maxRetries} retries, continuing animation`);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
            } else {
                successfulFrames++;
            }
            totalAttempts += retryCount + 1;
        }

        // Performance logging
        const successRate = (successfulFrames / totalFrames) * 100;
        console.log(`📊 Animation Performance: ${successfulFrames}/${totalFrames} frames (${successRate.toFixed(1)}%) - ${totalAttempts} total attempts`);

        // SUSPENSE PHASE: 6 extra frames of rainbow movement at 100%
        console.log('🎭 Starting suspense phase...');
        const suspenseFrames = 6;
        
        for (let suspenseFrame = 0; suspenseFrame < suspenseFrames; suspenseFrame++) {
            try {
                // Use the last search frame data for consistency
                const frameData = searchFrames[searchFrames.length - 1];
                
                // Keep at 100% but continue rainbow movement
                const progressPercentage = 100;
                
                // Continue changing indicators for suspense
                const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + suspenseFrame, targetRarity, targetFruit.type);
                const particles = ParticlesSystem.createOnePieceParticles(totalFrames + suspenseFrame + 3, 'energy', targetRarity);
                
                // Continue fast color cycling for suspense
                const fastColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#FF00FF', '#E74C3C', '#F39C12', '#9B59B6', '#2ECC71', '#3498DB'];
                const currentColor = fastColors[(totalFrames + suspenseFrame) % fastColors.length];
                
                // Create moving rainbow progress bar with suspense effect
                const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                    progressPercentage,
                    totalFrames + suspenseFrame, // Continue frame count for rainbow movement
                    'critical', // Change to critical phase for suspense
                    currentColor
                );

                const suspenseEmbed = new EmbedBuilder()
                    .setTitle('🎆 **MOMENT OF TRUTH** 🎆')
                    .setDescription(`
**The Grand Line bestows its gift...**

**🔮 AURA STATUS:** ${indicators.aura}
**✨ BLESSING LEVEL:** ${indicators.blessing}  
**🌊 POWER TYPE:** ${indicators.type}

${progressBar}

${particles}
                    `)
                    .setColor(currentColor)
                    .setFooter({ text: `Hunt Progress: 100% | Building Suspense...` });

                // Same timeout protection for suspense frames
                const timeoutDuration = 3500;
                const updatePromise = huntMessage.edit({ embeds: [suspenseEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                
                // Slightly faster timing for suspense
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`Suspense frame ${suspenseFrame} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // PHASE 5: Final reveal with full animation
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
