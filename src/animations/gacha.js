const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');
const { NextGenGachaEngine, getTestRarity } = require('./engine');
const { IndicatorsSystem } = require('./indicators');
const { ParticlesSystem } = require('./particles');

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
        };
        
        const targetRarity = rarityMapping[oldRarity] || oldRarity;
        const targetFruit = DevilFruitDatabase.getRandomDevilFruit(oldRarity);
        
        if (!targetFruit) {
            throw new Error(`No Devil Fruit found for rarity: ${oldRarity}`);
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

        // OPTIMIZED: Better frame management and timing
        const totalFrames = 18; // Slightly more frames for smoother sync
        const maxRetries = 2;   // More retries for stability
        const baseDelay = 750;  // Slower, more stable timing
        
        for (let frame = 0; frame < totalFrames; frame++) {
            let success = false;
            let retryCount = 0;
            
            while (!success && retryCount <= maxRetries) {
                try {
                    const searchFrameIndex = Math.floor((frame / totalFrames) * searchFrames.length);
                    const frameData = searchFrames[Math.min(searchFrameIndex, searchFrames.length - 1)];
                    
                    const indicators = IndicatorsSystem.getChangingIndicators(frame, oldRarity, targetFruit.type);
                    const particles = ParticlesSystem.createOnePieceParticles(frame + 3, 'energy', oldRarity);
                    
                    // SYNC FIX: Match embed color to leftmost rainbow square
                    const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                    const leftmostColorIndex = (-frame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
                    const currentColor = rainbowEmbedColors[leftmostColorIndex];
                    
                    const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                        100,
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
                        .setFooter({ text: `Hunt in Progress...` });

                    const timeoutDuration = 4000 + (retryCount * 1000); // More generous timeout
                    const updatePromise = huntMessage.edit({ embeds: [searchEmbed] });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                    );
                    
                    await Promise.race([updatePromise, timeoutPromise]);
                    success = true;
                    
                    const delay = retryCount > 0 ? baseDelay + (retryCount * 300) : baseDelay;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    
                } catch (error) {
                    retryCount++;
                    console.error(`Animation frame ${frame} attempt ${retryCount} error:`, error.message);
                    
                    if (retryCount <= maxRetries) {
                        const retryDelay = 300 * Math.pow(2, retryCount - 1);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                    }
                }
            }
            
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

        // PROGRESSION PHASE: Improved sync and timing
        console.log('🌊 Starting progression phase...');
        const progressFrames = 10; // Better progression timing
        
        for (let progFrame = 0; progFrame < progressFrames; progFrame++) {
            try {
                const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + progFrame, oldRarity, targetFruit.type);
                const particles = ParticlesSystem.createOnePieceParticles(totalFrames + progFrame + 3, 'energy', oldRarity);
                
                // SYNC FIX: Match embed color to progression
                const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                const progressFrame = totalFrames + progFrame;
                const leftmostColorIndex = (-progressFrame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
                const currentColor = rainbowEmbedColors[leftmostColorIndex];
                
                const progressBar = NextGenGachaEngine.createDynamicEnergyStatus(
                    100,
                    progressFrame, // Use consistent frame reference
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
                    .setFooter({ text: 'Energies converging...' }); // Removed progress counter

                const timeoutDuration = 4000; // More generous timeout
                const updatePromise = huntMessage.edit({ embeds: [progressEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 600)); // Consistent delay
                
            } catch (error) {
                console.error(`Progression frame ${progFrame} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 200)); // Faster error recovery
            }
        }

        // Get the rarity config using old rarity name
        const rarityConfig = DevilFruitDatabase.getRarityConfig(oldRarity);

        // SMOOTH TRANSITION PHASE: Rainbow gradually becomes reward color
        console.log('🎆 Smooth transition: Rainbow to reward color...');
        
        const finalBarColors = {
            'common': '🟫',
            'uncommon': '🟩',
            'rare': '🟦',
            'legendary': '🟨',
            'mythical': '🟥',
            'omnipotent': '🟪'
        };
        
        const finalSquareColor = finalBarColors[oldRarity] || '🟩';
        const transitionFrames = 8;
        
        // Gradual transition from rainbow to solid color
        for (let transFrame = 0; transFrame < transitionFrames; transFrame++) {
            try {
                const transitionPercentage = (transFrame + 1) / transitionFrames;
                
                // Create mixed bar (rainbow becoming solid color from left to right)
                let mixedProgressBar = '**CRYSTALLIZING**\n';
                for (let i = 0; i < 20; i++) {
                    const positionProgress = i / 19; // 0 to 1 across the bar
                    
                    if (positionProgress <= transitionPercentage) {
                        // This position has turned to the reward color
                        mixedProgressBar += finalSquareColor;
                    } else {
                        // Still showing rainbow
                        const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
                        const finalFrame = totalFrames + progressFrames;
                        const colorIndex = (i - finalFrame + rainbowColors.length * 100) % rainbowColors.length;
                        mixedProgressBar += rainbowColors[colorIndex];
                    }
                    if (i < 19) mixedProgressBar += ' ';
                }
                
                const transitionParticles = ParticlesSystem.createOnePieceParticles(5 + transFrame, 'energy', oldRarity);
                
                const transitionEmbed = new EmbedBuilder()
                    .setTitle('🌟 **POWER CRYSTALLIZING** 🌟')
                    .setDescription(`
**The Devil Fruit's true nature emerges...**

${mixedProgressBar}

${transitionParticles}
                    `)
                    .setColor(rarityConfig.color)
                    .setFooter({ text: `${rarityConfig.name} Power Manifesting...` });

                const timeoutDuration = 4000;
                const updatePromise = huntMessage.edit({ embeds: [transitionEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 400));
                
            } catch (error) {
                console.error(`Transition frame ${transFrame} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        // GRADUAL REVEAL PHASE: Show Devil Fruit info piece by piece
        console.log('🎊 Gradual reveal: Devil Fruit information...');
        
        const revealStages = [
            {
                title: '🍈 **DEVIL FRUIT DISCOVERED** 🍈',
                content: `
${rarityDescriptions[oldRarity] || rarityDescriptions.common}

**🍈 Devil Fruit:** ${targetFruit.name}
**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}

*Analyzing power...*
                `
            },
            {
                title: rarityTitles[oldRarity] || rarityTitles.common,
                content: `
${rarityDescriptions[oldRarity] || rarityDescriptions.common}

**🍈 Devil Fruit:** ${targetFruit.name}
**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}
**👤 Previous User:** ${targetFruit.user}
**⚡ Power:** ${targetFruit.power}

*Revealing details...*
                `
            },
            {
                title: rarityTitles[oldRarity] || rarityTitles.common,
                content: `
${rarityDescriptions[oldRarity] || rarityDescriptions.common}

**🍈 Devil Fruit:** ${targetFruit.name}
**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}
**👤 Previous User:** ${targetFruit.user}
**⚡ Power:** ${targetFruit.power}
**💎 Rarity:** ${rarityConfig.stars} ${rarityConfig.name}
**🌟 Power Level:** ${targetFruit.powerLevel.toLocaleString()}

*${targetFruit.description}*

*Awakening potential unlocked...*
                `
            }
        ];

        // Show each reveal stage
        for (let stage = 0; stage < revealStages.length; stage++) {
            try {
                let stageProgressBar = '**REVEALED**\n';
                for (let i = 0; i < 20; i++) {
                    stageProgressBar += finalSquareColor;
                    if (i < 19) stageProgressBar += ' ';
                }
                
                const stageParticles = ParticlesSystem.createOnePieceParticles(8 + stage * 2, 'celebration', oldRarity);
                
                const stageEmbed = new EmbedBuilder()
                    .setTitle(revealStages[stage].title)
                    .setDescription(`
${revealStages[stage].content}

${stageProgressBar}

${stageParticles}
                    `)
                    .setColor(rarityConfig.color)
                    .setFooter({ text: `🏴‍☠️ ${interaction.user.username}'s Devil Fruit Hunt | ${new Date().toLocaleString()}` });

                const timeoutDuration = 4000;
                const updatePromise = huntMessage.edit({ embeds: [stageEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 1200));
                
            } catch (error) {
                console.error(`Reveal stage ${stage} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        // FINAL PHASE: Complete reveal with all information and buttons
        const finalParticles2 = ParticlesSystem.createOnePieceParticles(12, 'celebration', oldRarity);
        let finalProgressBar2 = '**CLAIMED**\n';
        for (let i = 0; i < 20; i++) {
            finalProgressBar2 += finalSquareColor;
            if (i < 19) finalProgressBar2 += ' ';
        }

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

        // UPDATED: Removed share button, only Hunt Again and Collection
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hunt_again')
                    .setLabel('🍈 Hunt Again!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Secondary)
            );

        await huntMessage.edit({ embeds: [finalEmbed], components: [actionRow] });

        return {
            devilFruit: targetFruit,
            rarity: oldRarity,
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

async function handleViewCollection(interaction) {
    const collectionEmbed = new EmbedBuilder()
        .setTitle('📚 **Your Devil Fruit Collection**')
        .setDescription('🚧 Collection system coming soon!\n\nFor now, enjoy hunting for Devil Fruits!')
        .setColor('#3498DB')
        .setFooter({ text: 'Collection feature in development' });

    await interaction.reply({ embeds: [collectionEmbed], ephemeral: true });
}

module.exports = {
    createUltimateCinematicExperience,
    handleViewCollection
    // Removed handleHuntAgain - now handled in pull.js
};
