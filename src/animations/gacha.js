const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');
const { NextGenGachaEngine, getTestRarity } = require('./engine');
const { IndicatorsSystem } = require('./indicators');
const { ParticlesSystem } = require('./particles');

async function createUltimateCinematicExperience(interaction) {
    try {
        // PHASE 1: Determine rarity (respects debug mode)
        const oldRarity = getTestRarity();
        
        // Map to new rarity tiers
        const rarityMapping = {
            'common': 'standard',
            'uncommon': 'notable', 
            'rare': 'powerful',
            'legendary': 'legendary',
            'mythical': 'mythical',
            'omnipotent': 'divine'
        };
        
        const newRarity = rarityMapping[oldRarity] || oldRarity;
        const targetFruit = DevilFruitDatabase.getRandomDevilFruit(oldRarity);
        
        if (!targetFruit) {
            throw new Error(`No Devil Fruit found for rarity: ${oldRarity}`);
        }

        console.log(`🎯 Animation Starting: ${targetFruit.name} (${oldRarity})`);

        // Get counter information for this fruit
        const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
        const fruitElement = DEVIL_FRUIT_ELEMENTS[targetFruit.id];
        const elementName = fruitElement ? CombatSystem.getElementName(fruitElement) : 'Unknown';

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

        // ULTRA-STABLE: Much longer timeouts and slower timing
        const totalFrames = 18; 
        const maxRetries = 3;   // More retries for ultra-stability
        const baseDelay = 1000;  // Much slower timing to prevent overload
        
        for (let frame = 0; frame < totalFrames; frame++) {
            let success = false;
            let retryCount = 0;
            
            while (!success && retryCount <= maxRetries) {
                try {
                    const searchFrameIndex = Math.floor((frame / totalFrames) * searchFrames.length);
                    const frameData = searchFrames[Math.min(searchFrameIndex, searchFrames.length - 1)];
                    
                    const indicators = IndicatorsSystem.getChangingIndicators(frame, oldRarity, targetFruit.type);
                    const particles = ParticlesSystem.createOnePieceParticles(frame + 3, 'energy', oldRarity);
                    
                    // FIXED: Keep rainbow colors much longer, only hint at rarity very late
                    const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                    const finalBarColors = {
                        'common': '#8B4513',      // Brown (FIXED)
                        'uncommon': '#2ECC71',    // Green
                        'rare': '#3498DB',        // Blue
                        'legendary': '#F1C40F',   // Yellow
                        'mythical': '#E74C3C',    // Red
                        'omnipotent': '#9B59B6'   // Purple
                    };
                    
                    // Keep rainbow colors much longer - only switch to rarity color at frame 17 (very end)
                    let currentColor;
                    if (frame >= 17) { // Very late hint at rarity
                        currentColor = finalBarColors[oldRarity] || '#8B4513';
                    } else {
                        const leftmostColorIndex = (-frame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
                        currentColor = rainbowEmbedColors[leftmostColorIndex];
                    }
                    
                    // CREATE CLEAN BOX without vertical sides
                    const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
                    let topRainbow = '';
                    let bottomRainbow = '';
                    
                    for (let i = 0; i < 20; i++) {
                        const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
                        topRainbow += rainbowColors[colorIndex];
                        bottomRainbow += rainbowColors[colorIndex];
                        if (i < 19) {
                            topRainbow += ' ';
                            bottomRainbow += ' ';
                        }
                    }

                    const searchEmbed = new EmbedBuilder()
                        .setTitle(frameData.title)
                        .setDescription(`
${topRainbow}

**${frameData.desc}**

**⚡ FRUIT ENERGY:** ${indicators.energy}
**🔮 RARITY SENSE:** ${indicators.rarity}  
**🍈 DEVIL FRUIT:** ${indicators.fruit}

${bottomRainbow}

${particles}
                        `)
                        .setColor(currentColor)
                        .setFooter({ text: `Hunt in Progress...` });

                    const timeoutDuration = 6000 + (retryCount * 2000); // Ultra-generous timeout
                    const updatePromise = huntMessage.edit({ embeds: [searchEmbed] });
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                    );
                    
                    await Promise.race([updatePromise, timeoutPromise]);
                    success = true;
                    
                    const delay = retryCount > 0 ? baseDelay + (retryCount * 500) : baseDelay;
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

        // PROGRESSION PHASE: Improved sync and timing with dual rainbows
        console.log('🌊 Starting progression phase...');
        const progressFrames = 12; // Better progression timing
        
        for (let progFrame = 0; progFrame < progressFrames; progFrame++) {
            try {
                const indicators = IndicatorsSystem.getChangingIndicators(totalFrames + progFrame, oldRarity, targetFruit.type);
                const particles = ParticlesSystem.createOnePieceParticles(totalFrames + progFrame + 3, 'energy', oldRarity);
                
                // FIXED: Keep rainbow colors throughout progression - no early rarity hints
                const finalBarColors = {
                    'common': '#8B4513',      // Brown (FIXED)
                    'uncommon': '#2ECC71',    // Green
                    'rare': '#3498DB',        // Blue
                    'legendary': '#F1C40F',   // Yellow
                    'mythical': '#E74C3C',    // Red
                    'omnipotent': '#9B59B6'   // Purple
                };
                
                // Keep rainbow colors throughout progression phase
                const rainbowEmbedColors = ['#FF0000', '#FF6000', '#FFCC00', '#00FF00', '#0080FF', '#8000FF', '#8B4513'];
                const progressFrame = totalFrames + progFrame;
                const leftmostColorIndex = (-progressFrame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
                const currentColor = rainbowEmbedColors[leftmostColorIndex];
                
                // CREATE CLEAN BOX without vertical sides
                const progressFrame = totalFrames + progFrame;
                const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
                let topRainbow = '';
                let bottomRainbow = '';
                
                for (let i = 0; i < 20; i++) {
                    const colorIndex = (i - progressFrame + rainbowColors.length * 100) % rainbowColors.length;
                    topRainbow += rainbowColors[colorIndex];
                    bottomRainbow += rainbowColors[colorIndex];
                    if (i < 19) {
                        topRainbow += ' ';
                        bottomRainbow += ' ';
                    }
                }

                const progressEmbed = new EmbedBuilder()
                    .setTitle('🎆 **ENERGIES CONVERGING** 🎆')
                    .setDescription(`
${topRainbow}

**The rainbow flows toward destiny...**

**⚡ FRUIT ENERGY:** ${indicators.energy}
**🔮 RARITY SENSE:** ${indicators.rarity}  
**🍈 DEVIL FRUIT:** ${indicators.fruit}

${bottomRainbow}

${particles}
                    `)
                    .setColor(currentColor)
                    .setFooter({ text: 'Energies converging...' }); // Removed progress counter

                const timeoutDuration = 6000; // Ultra-generous timeout
                const updatePromise = huntMessage.edit({ embeds: [progressEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 800)); // Slower, more stable delay
                
            } catch (error) {
                console.error(`Progression frame ${progFrame} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 500)); // Better error recovery
            }
        }

        // Get the rarity config and prepare display data
        const rarityConfig = DevilFruitDatabase.getRarityConfig(oldRarity);

        const rarityTitles = {
            common: '🍈 **DEVIL FRUIT DISCOVERED** 🍈',
            uncommon: '🍈 **NOTABLE POWER AWAKENED** 🍈',
            rare: '🍈 **POWERFUL TREASURE CLAIMED** 🍈',
            legendary: '🍈 **LEGENDARY MIGHT UNLEASHED** 🍈',
            mythical: '🍈 **MYTHICAL FORCE MANIFESTED** 🍈',
            omnipotent: '🍈 **DIVINE REALITY TRANSCENDED** 🍈'
        };

        const rarityDescriptions = {
            common: '⚓ A Devil Fruit has chosen you!',
            uncommon: '🌊 The seas have blessed you with power!',
            rare: '⚡ Powerful energies flow through this fruit!',
            legendary: '🔥 **LEGENDARY CLASS ACHIEVED!** The Grand Line acknowledges your worth!',
            mythical: '👑 **MYTHICAL POWER BESTOWED!** The world trembles before this might!',
            omnipotent: '🌌 **DIVINE TRANSCENDENCE!** Reality itself bends to your will!'
        };

        const typeEmojis = {
            'Paramecia': '🔮',
            'Zoan': '🐺',
            'Logia': '🌪️',
            'Ancient Zoan': '🦕',
            'Mythical Zoan': '🐉',
            'Special Paramecia': '✨'
        };

        // CENTER-OUTWARD TRANSITION: Rainbow becomes reward color from center outward
        console.log('🎆 Center-outward transition: Rainbow to reward color...');
        
        const finalBarColors = {
            'common': '🟫',
            'uncommon': '🟩',
            'rare': '🟦',
            'legendary': '🟨',
            'mythical': '🟥',
            'omnipotent': '🟪'
        };
        
        const finalSquareColor = finalBarColors[oldRarity] || '🟩';
        const transitionFrames = 10; // Center positions 9-10, expand outward
        
        // Center-outward transition from rainbow to solid color
        for (let transFrame = 0; transFrame < transitionFrames; transFrame++) {
            try {
                // Create rainbow frame reference for consistent sync
                const finalFrame = totalFrames + progressFrames;
                const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
                
                // Calculate which positions should be converted (center outward)
                const convertRadius = transFrame; // 0 = center only, 1 = center ±1, etc.
                
                // Create both rainbow bars with center-outward conversion and vertical sides
                let topBar = '';
                let bottomBar = '';
                
                for (let i = 0; i < 20; i++) {
                    // Check if this position should be converted
                    const centerPos1 = 9;  // Center position 1
                    const centerPos2 = 10; // Center position 2
                    const distanceFromCenter = Math.min(
                        Math.abs(i - centerPos1),
                        Math.abs(i - centerPos2)
                    );
                    
                    if (distanceFromCenter <= convertRadius) {
                        // This position has been converted to reward color
                        topBar += finalSquareColor;
                        bottomBar += finalSquareColor;
                    } else {
                        // Still showing rainbow
                        const colorIndex = (i - finalFrame + rainbowColors.length * 100) % rainbowColors.length;
                        topBar += rainbowColors[colorIndex];
                        bottomBar += rainbowColors[colorIndex];
                    }
                    
                    if (i < 19) {
                        topBar += ' ';
                        bottomBar += ' ';
                    }
                }
                
                // Get FIXED POSITION vertical bar color - follows rainbow but position 0
                const leftSideColorIndex = (0 - finalFrame + rainbowColors.length * 100) % rainbowColors.length;
                let verticalBar;
                
                // During transition, check if position 0 has been converted
                if (convertRadius >= 9) { // Position 0 is 9 away from center, so convert when radius >= 9
                    verticalBar = finalSquareColor;
                } else {
                    verticalBar = rainbowColors[leftSideColorIndex];
                }
                
                const transitionParticles = ParticlesSystem.createOnePieceParticles(5 + transFrame, 'energy', oldRarity);
                
                const transitionEmbed = new EmbedBuilder()
                    .setTitle('🌟 **POWER CRYSTALLIZING** 🌟')
                    .setDescription(`
${topBar}

**The Devil Fruit's essence crystallizes from within...**

${bottomBar}

${transitionParticles}
                    `)
                    .setColor(rarityConfig.color)
                    .setFooter({ text: `${rarityConfig.name} Power Manifesting...` });

                const timeoutDuration = 7000; // Ultra-generous timeout for transition
                const updatePromise = huntMessage.edit({ embeds: [transitionEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 900)); // Very slow timing for stability
                
            } catch (error) {
                console.error(`Transition frame ${transFrame} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 600));
            }
        }

        // LINE-BY-LINE REVEAL PHASE: Show Devil Fruit info one line at a time
        console.log('🎊 Line-by-line reveal: Devil Fruit information...');
        
        // All possible reveal lines in order
        const revealLines = [
            `**${rarityDescriptions[oldRarity] || rarityDescriptions.common}**`,
            '',
            `**🍈 Devil Fruit:** ${targetFruit.name}`,
            `**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}`,
            `**👤 Previous User:** ${targetFruit.user}`,
            `**⚡ Power:** ${targetFruit.power}`,
            `**💎 Rarity:** ${rarityConfig.stars} ${rarityConfig.name}`,
            `**🌟 Power Level:** ${targetFruit.powerLevel.toLocaleString()}`,
            '',
            `*${targetFruit.description}*`,
            '',
            `**🔥 Awakening:** ${targetFruit.awakening}`,
            `**⚠️ Weakness:** ${targetFruit.weakness}`
        ];

        // Show each line one by one
        for (let lineIndex = 0; lineIndex <= revealLines.length; lineIndex++) {
            try {
                // Create solid color bars
                let topBar = '';
                let bottomBar = '';
                for (let i = 0; i < 20; i++) {
                    topBar += finalSquareColor;
                    bottomBar += finalSquareColor;
                    if (i < 19) {
                        topBar += ' ';
                        bottomBar += ' ';
                    }
                }
                
                // Build content up to current line - CLEAN format
                let revealContent = '';
                
                for (let i = 0; i < lineIndex; i++) {
                    if (revealLines[i] === '') {
                        revealContent += `\n`;
                    } else {
                        revealContent += `${revealLines[i]}\n`;
                    }
                }
                
                // Add spacing for consistent height
                const minLines = 8;
                const currentLines = lineIndex;
                for (let i = currentLines; i < minLines; i++) {
                    revealContent += `\n`;
                }
                
                const stageParticles = ParticlesSystem.createOnePieceParticles(8 + lineIndex, 'celebration', oldRarity);
                
                const stageEmbed = new EmbedBuilder()
                    .setTitle(rarityTitles[oldRarity] || rarityTitles.common)
                    .setDescription(`
${topBar}
${revealContent}
${bottomBar}

${stageParticles}
                    `)
                    .setColor(rarityConfig.color)
                    .setFooter({ text: `🏴‍☠️ ${interaction.user.username}'s Devil Fruit Hunt | ${new Date().toLocaleString()}` });

                const timeoutDuration = 7000; // Ultra-generous timeout
                const updatePromise = huntMessage.edit({ embeds: [stageEmbed] });
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Discord API timeout')), timeoutDuration)
                );
                
                await Promise.race([updatePromise, timeoutPromise]);
                await new Promise(resolve => setTimeout(resolve, 800)); // Line-by-line timing
                
            } catch (error) {
                console.error(`Reveal line ${lineIndex} error:`, error.message);
                await new Promise(resolve => setTimeout(resolve, 600));
            }
        }

        // FINAL PHASE: Complete reveal with buttons (keep box formatting)
        const finalParticles2 = ParticlesSystem.createOnePieceParticles(12, 'celebration', oldRarity);
        
        // Create final solid color bars
        let topFinalBar = '';
        let bottomFinalBar = '';
        for (let i = 0; i < 20; i++) {
            topFinalBar += finalSquareColor;
            bottomFinalBar += finalSquareColor;
            if (i < 19) {
                topFinalBar += ' ';
                bottomFinalBar += ' ';
            }
        }

        // Create final formatted content with counter information
        const finalContent = `
**${rarityDescriptions[oldRarity] || rarityDescriptions.common}**

**🍈 Devil Fruit:** ${targetFruit.name}
**📋 Type:** ${typeEmojis[targetFruit.type] || '🔮'} ${targetFruit.type}
**⚔️ Element:** ${elementName}
**👤 Previous User:** ${targetFruit.user}
**⚡ Power:** ${targetFruit.power}
**💎 Rarity:** ${rarityConfig.stars} ${rarityConfig.name}
**🌟 Power Level:** ${targetFruit.powerLevel.toLocaleString()}

*${targetFruit.description}*

**🔥 Awakening:** ${targetFruit.awakening}
**⚠️ Weakness:** ${targetFruit.weakness}
**🎯 Battle Info:** Strong vs ${elementName} counters, weak to ${elementName} weaknesses
`;

        const finalEmbed = new EmbedBuilder()
            .setTitle(rarityTitles[oldRarity] || rarityTitles.common)
            .setDescription(`
${topFinalBar}
${finalContent}
${bottomFinalBar}

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
