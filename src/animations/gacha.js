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
        const oldRarity = getTestRarity();
        
        // Map old rarity names to new names
        const rarityMapping = {
            'common': 'cursed',
            'uncommon': 'manifested', 
            'rare': 'potent',
            'legendary': 'ancient',
            'mythical': 'mythical',
            'omnipotent': 'godlike'
        // FINAL PHASE: Whole bar becomes reward color
        console.log('🎆 Final phase: Bar becoming reward color...');
        
        // Get the reward rarity config using old rarity name
        const rarityConfig = DevilFruitDatabase.getRarityConfig(oldRarity);
        
        // Map old rarities to new progress bar colors
        const finalBarColors = {
            'common': '🟫',     // Brown for common
            'uncommon': '🟩',   // Green 
            'rare': '🟦',       // Blue
            'legendary': '🟨',  // Yellow
            'mythical': '🟥',   // Red
            'omnipotent': '🟪'  // Purple
        };
        
        const finalSquareColor = finalBarColors[oldRarity] || '🟩';
        
        // Create final solid color bar
        let finalProgressBar = '**TRANSCENDENT**\n';
        for (let i = 0; i < 20; i++) {
            finalProgressBar += finalSquareColor;
            if (i < 19) finalProgressBar += ' ';
        }
        
        try {
            const finalParticles = ParticlesSystem.createOnePieceParticles(10, 'celebration', oldRarity);
            
            const finalColorEmbed = new EmbedBuilder()
                .setTitle('🌟 **POWER CRYSTALLIZED** 🌟')
                .setDescription(`
**The Devil Fruit's true nature is revealed!**

${finalProgressBar}

${finalParticles}
                `)
                .setColor(rarityConfig.color)
                .setFooter({ text: `${rarityConfig.name} Power Manifested` });

            const timeoutDuration = 3500;
            const updatePromise = huntMessage.edit({ embeds: [finalColorEmbed] });
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
            );
            
            await Promise.race([updatePromise, timeoutPromise]);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Pause before final reveal
            
        } catch (error) {
            console.error(`Final color phase error:`, error.message);
            await new Promise(resolve => setTimeout(resolve, 1000));
        };
        
        const targetRarity = rarityMapping[oldRarity] || oldRarity;
        const targetFruit = DevilFruitDatabase.getRandomDevilFruit(oldRarity); // Use old name for database
        
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

        // Slower animation to prevent freezing
        const totalFrames = 20;
        const maxRetries = 2;
        const baseDelay = 900;
        
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
                    
                    // RAINBOW EMBED COLORS - Matches the newest square color (7 colors with brown)
                    const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                    const currentColor = rainbowEmbedColors[frame % rainbowEmbedColors.length];
                    
                    // Create full rainbow progress bar (always full)
                    const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                        100, // Always 100% - full rainbow
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
                        .setFooter({ text: `Hunt Progress: 100%` });

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

        // PROGRESSION PHASE: 12 frames of rightward movement (unless common)
        console.log('🌊 Starting progression phase...');
        const progressFrames = NextGenGachaEngine.getProgressFrames(targetRarity);
        
        if (targetRarity === 'cursed') {
            // CURSED: Immediate brown-out from center
            console.log('🟫 Cursed rarity: Starting brown-out effect...');
            
            for (let whiteFrame = 0; whiteFrame <= 10; whiteFrame++) {
                try {
                    const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + whiteFrame, targetRarity, targetFruit.type);
                    const particles = ParticlesSystem.createOnePieceParticles(totalFrames + whiteFrame + 3, 'energy', targetRarity);
                    
                    const currentColor = '#8B4513'; // Brown for cursed
                    
                    const progressBar = NextGenGachaEngine.createCommonWhiteOut(
                        totalFrames - 1, // Stopped rainbow frame
                        whiteFrame
                    );

                    const brownOutEmbed = new EmbedBuilder()
                        .setTitle('🟫 **DEVIL\'S CURSE WEAKENING** 🟫')
                        .setDescription(`
**The cursed power fades to mundane...**

**🔮 AURA STATUS:** ${indicators.aura}
**✨ BLESSING LEVEL:** ${indicators.blessing}  
**🌊 POWER TYPE:** ${indicators.type}

${progressBar}

${particles}
                        `)
                        .setColor(currentColor)
                        .setFooter({ text: `Cursed Rarity | Brown-out Progress: ${Math.round((whiteFrame / 10) * 100)}%` });

                    const timeoutDuration = 3500;
                    const updatePromise = huntMessage.edit({ embeds: [brownOutEmbed] });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                    );
                    
                    await Promise.race([updatePromise, timeoutPromise]);
                    await new Promise(resolve => setTimeout(resolve, 400));
                    
                } catch (error) {
                    console.error(`Brown-out frame ${whiteFrame} error:`, error.message);
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
        } else {
            // NON-COMMON: 12 frames progression then blinking
            console.log(`🌈 ${targetRarity} rarity: Progressing ${progressFrames} frames to reach target color...`);
            
            for (let progFrame = 0; progFrame < progressFrames; progFrame++) {
                try {
                    const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + progFrame, targetRarity, targetFruit.type);
                    const particles = ParticlesSystem.createOnePieceParticles(totalFrames + progFrame + 3, 'energy', targetRarity);
                    
                    // Continue rainbow embed colors for suspense (7 colors with brown)
                    const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                    const currentColor = rainbowEmbedColors[(totalFrames + progFrame) % rainbowEmbedColors.length];
                    
                    const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                        100,
                        totalFrames + progFrame,
                        'critical',
                        currentColor
                    );

                    const progressEmbed = new EmbedBuilder()
                        .setTitle('🎆 **ENERGIES CONVERGING** 🎆')
                        .setDescription(`
**The rainbow flows toward destiny...**

**🔮 AURA STATUS:** ${indicators.aura}
**✨ BLESSING LEVEL:** ${indicators.blessing}  
**🌊 POWER TYPE:** ${indicators.type}

${progressBar}

${particles}
                        `)
                        .setColor(currentColor)
                        .setFooter({ text: `Progression Phase: ${progFrame + 1}/${progressFrames}` });

                    const timeoutDuration = 3500;
                    const updatePromise = huntMessage.edit({ embeds: [progressEmbed] });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                    );
                    
                    await Promise.race([updatePromise, timeoutPromise]);
                    await new Promise(resolve => setTimeout(resolve, 600));
                    
                } catch (error) {
                    console.error(`Progression frame ${progFrame} error:`, error.message);
                    await new Promise(resolve => setTimeout(resolve, 400));
                }
            }
            
            // SPECIAL GODLIKE HANDLING
            if (targetRarity === 'godlike') {
                console.log('🌈 Starting GODLIKE grid sequence...');
                
                for (let gridFrame = 0; gridFrame < 8; gridFrame++) {
                    try {
                        const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + progressFrames + gridFrame, targetRarity, targetFruit.type);
                        const particles = ParticlesSystem.createOnePieceParticles(totalFrames + progressFrames + gridFrame + 3, 'energy', targetRarity);
                        
                        const currentColor = '#FF6000'; // Orange for godlike
                        
                        const progressBar = NextGenGachaEngine.createBlinkingRarityBar(
                            targetRarity,
                            totalFrames + progressFrames + gridFrame,
                            false // Always show the grid pattern
                        );

                        const godlikeEmbed = new EmbedBuilder()
                            .setTitle('🌈 **GODLIKE TRANSCENDENCE** 🌈')
                            .setDescription(`
**Reality itself bends to your will...**

**🔮 AURA STATUS:** ${indicators.aura}
**✨ BLESSING LEVEL:** ${indicators.blessing}  
**🌊 POWER TYPE:** ${indicators.type}

${progressBar}

${particles}
                            `)
                            .setColor(currentColor)
                            .setFooter({ text: `GODLIKE manifestation... ${gridFrame + 1}/8` });

                        const timeoutDuration = 3500;
                        const updatePromise = huntMessage.edit({ embeds: [godlikeEmbed] });
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                        );
                        
                        await Promise.race([updatePromise, timeoutPromise]);
                        await new Promise(resolve => setTimeout(resolve, 700));
                        
                    } catch (error) {
                        console.error(`Godlike grid frame ${gridFrame} error:`, error.message);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            } else {
                // REGULAR BLINKING for other rarities
                console.log('✨ Starting blinking phase...');
                const finalStopFrame = NextGenGachaEngine.calculateFinalFrame(totalFrames - 1, targetRarity);
            
                for (let blink = 0; blink < 6; blink++) { // 6 phases = 3 full blinks
                    try {
                        const isBlinkOn = blink % 2 === 0; // Even = solid color, Odd = rainbow
                        const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + progressFrames + blink, targetRarity, targetFruit.type);
                        const particles = ParticlesSystem.createOnePieceParticles(totalFrames + progressFrames + blink + 3, 'energy', targetRarity);
                        
                        // Get rarity color for embed
                        const rarityEmbedColors = {
                            manifested: '#00FF00',    // Green
                            potent: '#0080FF',       // Blue
                            ancient: '#FFCC00',     // Yellow
                            mythical: '#FF0000',    // Red
                            transcendent: '#8000FF' // Purple
                        };
                        const currentColor = rarityEmbedColors[targetRarity] || '#0080FF';
                        
                        const progressBar = NextGenGachaEngine.createBlinkingRarityBar(
                            targetRarity,
                            finalStopFrame,
                            isBlinkOn
                        );

                        const blinkEmbed = new EmbedBuilder()
                            .setTitle('⚡ **POWER CRYSTALLIZING** ⚡')
                            .setDescription(`
**The rarity manifests itself...**

**🔮 AURA STATUS:** ${indicators.aura}
**✨ BLESSING LEVEL:** ${indicators.blessing}  
**🌊 POWER TYPE:** ${indicators.type}

${progressBar}

${particles}
                            `)
                            .setColor(currentColor)
                            .setFooter({ text: `Crystallizing ${targetRarity.toUpperCase()} power... ${Math.floor((blink + 1) / 2)}/3` });

                        const timeoutDuration = 3500;
                        const updatePromise = huntMessage.edit({ embeds: [blinkEmbed] });
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                        );
                        
                        await Promise.race([updatePromise, timeoutPromise]);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                    } catch (error) {
                        console.error(`Blink frame ${blink} error:`, error.message);
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }
            }
        }

        // PHASE 5: Final reveal with full animation
        const finalParticles = ParticlesSystem.createOnePieceParticles(10, 'celebration', oldRarity);
        
        // Use old rarity name for final reveal since database uses old names
        const finalProgressBar = NextGenGachaEngine.createRarityRevealBar(oldRarity, 0);

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
            .setTitle(rarityTitles[oldRarity] || rarityTitles.common)
            .setDescription(`
${rarityDescriptions[oldRarity] || rarityDescriptions.common}

**🍈 Devil Fruit:** ${targetFruit.name}
**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}
**👤 Previous User:** ${targetFruit.user}
**⚡ Power:** ${targetFruit.power}
**💎 Rarity:** ${rarityConfig.stars} ${rarityConfig.name}
**🌟 Power Level:** ${targetFruit.powerLevel.toLocaleString()}

*${targetFruit.description}*

**🔥 Awakening:** ${targetFruit.awakening}
**⚠️ Weakness:** ${targetFruit.weakness}

${finalProgressBar2}

${finalParticles2}
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
