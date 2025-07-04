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

        // ACCELERATED: Reduced frames and faster timing
        const totalFrames = 12; // Reduced from 20
        const maxRetries = 1;   // Reduced retries
        const baseDelay = 400;  // Much faster delay
        
        for (let frame = 0; frame < totalFrames; frame++) {
            let success = false;
            let retryCount = 0;
            
            while (!success && retryCount <= maxRetries) {
                try {
                    const searchFrameIndex = Math.floor((frame / totalFrames) * searchFrames.length);
                    const frameData = searchFrames[Math.min(searchFrameIndex, searchFrames.length - 1)];
                    
                    const indicators = IndicatorsSystem.getChangingIndicators(frame, oldRarity, targetFruit.type);
                    const particles = ParticlesSystem.createOnePieceParticles(frame + 3, 'energy', oldRarity);
                    
                    const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                    const currentColor = rainbowEmbedColors[frame % rainbowEmbedColors.length];
                    
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

                    const timeoutDuration = 2000 + (retryCount * 500); // Reduced timeout
                    const updatePromise = huntMessage.edit({ embeds: [searchEmbed] });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                    );
                    
                    await Promise.race([updatePromise, timeoutPromise]);
                    success = true;
                    
                    const delay = retryCount > 0 ? baseDelay + (retryCount * 200) : baseDelay; // Faster retry delay
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

        // PROGRESSION PHASE: Reduced to 6 frames for speed
        console.log('🌊 Starting progression phase...');
        const progressFrames = 6; // Reduced from 12
        
        for (let progFrame = 0; progFrame < progressFrames; progFrame++) {
            try {
                const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + progFrame, oldRarity, targetFruit.type);
                const particles = ParticlesSystem.createOnePieceParticles(totalFrames + progFrame + 3, 'energy', oldRarity);
                
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
                    .setFooter({ text: 'Energies converging...' }); // Removed progress counter

                const timeoutDuration = 2000; // Faster timeout
                const updatePromise = huntMessage.edit({ embeds: [progressEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 300)); // Much faster delay
                
            } catch (error) {
                console.error(`Progression frame ${progFrame} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 200)); // Faster error recovery
            }
        }

        // Get the rarity config using old rarity name
        const rarityConfig = DevilFruitDatabase.getRarityConfig(oldRarity);

        // FINAL PHASE: Whole bar becomes reward color
        console.log('🎆 Final phase: Bar becoming reward color...');
        
        const finalBarColors = {
            'common': '🟫',
            'uncommon': '🟩',
            'rare': '🟦',
            'legendary': '🟨',
            'mythical': '🟥',
            'omnipotent': '🟪'
        };
        
        const finalSquareColor = finalBarColors[oldRarity] || '🟩';
        
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

            const timeoutDuration = 2000; // Faster timeout
            const updatePromise = huntMessage.edit({ embeds: [finalColorEmbed] });
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
            );
            
            await Promise.race([updatePromise, timeoutPromise]);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Faster delay
            
        } catch (error) {
            console.error(`Final color phase error:`, error.message);
            await new Promise(resolve => setTimeout(resolve, 500)); // Faster error recovery
        }

        // PHASE 5: Final reveal
        const finalParticles2 = ParticlesSystem.createOnePieceParticles(10, 'celebration', oldRarity);
        const finalProgressBar2 = NextGenGachaEngine.createRarityRevealBar(oldRarity, 0);

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
