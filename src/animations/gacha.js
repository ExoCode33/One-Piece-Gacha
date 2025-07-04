// Enhanced Devil Fruit Gacha Animation System
// Fixed: Perfect sync + Dynamic text + Hidden bottom transition + NO updateIndicators

const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];
const rainbowEmbedColors = [0xFF0000, 0xFF8000, 0xFFFF00, 0x00FF00, 0x0080FF, 0x8000FF, 0x654321];

// Dynamic animation text pools (48 total texts)
const DYNAMIC_ANIMATION_TEXT = {
    pool1: [
        "🌊 The Grand Line's energy stirs...",
        "⚡ Devil Fruit powers awakening...",
        "🌪️ Mysterious forces gathering...",
        "🔮 Ancient energies converging...",
        "🌟 Legendary power approaching...",
        "⚔️ The sea trembles with anticipation...",
        "🏴‍☠️ Pirate destiny manifesting...",
        "💫 Cosmic forces aligning..."
    ],
    pool2: [
        "🌀 Power spirals intensifying...",
        "⚡ Energy readings off the charts...",
        "🔥 Flames of destiny igniting...",
        "🌊 Oceanic forces building...",
        "💎 Crystalline power forming...",
        "🌟 Starlight energy gathering...",
        "⚔️ Battle aura expanding...",
        "🏴‍☠️ Pirate legend emerging..."
    ],
    pool3: [
        "🌪️ Manifestation accelerating...",
        "⚡ Lightning crackling with power...",
        "🔮 Mystic energies coalescing...",
        "🌊 Tidal forces converging...",
        "🔥 Infernal power rising...",
        "💫 Celestial alignment perfect...",
        "⚔️ Warrior spirit awakening...",
        "🏴‍☠️ Legendary crew assembling..."
    ],
    pool4: [
        "💎 Crystallization process active...",
        "⚡ Electrical storms brewing...",
        "🌀 Vortex energy stabilizing...",
        "🌟 Stellar power concentrating...",
        "🔥 Phoenix flames ascending...",
        "🌊 Tsunami of power building...",
        "⚔️ Ancient weapons resonating...",
        "🏴‍☠️ Yonko-level energy detected..."
    ],
    pool5: [
        "🌪️ Destiny threads weaving...",
        "💫 Cosmic destiny approaching...",
        "⚡ Thunder god's blessing...",
        "🔮 Prophecy fulfillment imminent...",
        "🌊 Ocean's chosen one...",
        "🔥 Dragon's breath awakening...",
        "💎 Diamond will manifesting...",
        "⚔️ Supreme blade choosing..."
    ],
    pool6: [
        "🌟 Final convergence beginning...",
        "⚡ Ultimate power crystallizing...",
        "🌪️ Destiny storm reaching peak...",
        "🔥 Phoenix rebirth commencing...",
        "🌊 Leviathan's gift bestowing...",
        "💫 Stellar coronation starting...",
        "⚔️ Legend's birth witnessed...",
        "🏴‍☠️ Pirate King's blessing..."
    ]
};

// Progression text pool (12 texts)
const PROGRESSION_TEXTS = [
    "🌊 Power crystallization accelerating...",
    "⚡ Energy matrices aligning perfectly...",
    "🔥 Destiny flames burning brighter...",
    "🌪️ Legendary aura intensifying...",
    "💫 Cosmic forces reaching crescendo...",
    "⚔️ Ancient power awakening fully...",
    "🌟 Divine blessing manifesting...",
    "🏴‍☠️ Pirate legend being born...",
    "🔮 Mystical transformation completing...",
    "💎 Ultimate power taking shape...",
    "🌊 Ocean's will being revealed...",
    "⚡ Thunder god's final judgment..."
];

// Transition text pool (10 texts)
const TRANSITION_TEXTS = [
    "🌊 Reality crystallizing into form...",
    "⚡ Power taking physical shape...",
    "🔥 Legendary essence materializing...",
    "🌪️ Destiny vortex stabilizing...",
    "💫 Cosmic energy solidifying...",
    "⚔️ Ancient force awakening...",
    "🌟 Divine power manifesting...",
    "🏴‍☠️ Pirate legend crystallizing...",
    "🔮 Mystical transformation completing...",
    "💎 Ultimate ability forming..."
];

// Function to get synced rainbow pattern
function getSyncedRainbowPattern(frame, barLength = 20) {
    const positions = [];
    for (let i = 0; i < barLength; i++) {
        const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
        positions.push(rainbowColors[colorIndex]);
    }
    return positions.join(' ');
}

// Function to get embed color synced to first square
function getEmbedColorSyncedToFirst(frame) {
    const firstSquareColorIndex = (0 - frame + rainbowColors.length * 100) % rainbowColors.length;
    return rainbowEmbedColors[firstSquareColorIndex];
}

// Function to create grey box with red text and cycling effects synced to rainbow
function createGreyBoxIndicators(frame, phase, rarity, fruitType) {
    let rarityText = "";
    let typeText = "";
    
    if (phase === 'animation' || phase === 'progression') {
        // Sync rarity cycling with the rainbow colors (leftmost square)
        const allTypes = ['Paramecia', 'Logia', 'Zoan'];
        
        // Get the color index of the leftmost square (position 0)
        const leftmostColorIndex = (0 - frame + rainbowColors.length * 100) % rainbowColors.length;
        
        // Map rainbow colors to rarities (using your getRarityEmoji mapping)
        const colorToRarity = {
            0: 'omnipotent',  // 🟥 Red
            1: 'mythical',    // 🟧 Orange  
            2: 'legendary',   // 🟨 Yellow
            3: 'uncommon',    // 🟩 Green
            4: 'rare',        // 🟦 Blue
            5: 'epic',        // 🟪 Purple
            6: 'common'       // 🟫 Brown
        };
        
        const syncedRarity = colorToRarity[leftmostColorIndex];
        const cycleType = allTypes[frame % allTypes.length];
        
        rarityText = `- RARITY: ${syncedRarity.toUpperCase()} -`;
        typeText = `- TYPE: ${cycleType.toUpperCase()} -`;
        
    } else if (phase === 'transition') {
        // Transition phase - start revealing actual information in later frames
        if (frame < 5) {
            // Still cycling but slower
            const allTypes = ['Paramecia', 'Logia', 'Zoan'];
            
            // Sync with leftmost square during transition too
            const leftmostColorIndex = (0 - (frame + 30) + rainbowColors.length * 100) % rainbowColors.length;
            const colorToRarity = {
                0: 'omnipotent', 1: 'mythical', 2: 'legendary', 3: 'uncommon', 
                4: 'rare', 5: 'epic', 6: 'common'
            };
            
            const syncedRarity = colorToRarity[leftmostColorIndex];
            const cycleType = allTypes[Math.floor(frame / 2) % allTypes.length];
            
            rarityText = `- RARITY: ${syncedRarity.toUpperCase()} -`;
            typeText = `- TYPE: ${cycleType.toUpperCase()} -`;
        } else {
            // Final frames - reveal actual information
            rarityText = `- RARITY: ${rarity.toUpperCase()} CONFIRMED -`;
            typeText = `- TYPE: ${fruitType.toUpperCase()} CONFIRMED -`;
        }
    }
    
    // Create grey box format with red text
    return `\`\`\`diff
${rarityText}
${typeText}
\`\`\``;
}

// Enhanced dynamic text function with 6 text pools
function getDynamicAnimationText(frame, rarity = 'common') {
    const poolIndex = Math.floor(frame / 3) % 6 + 1;
    const pool = DYNAMIC_ANIMATION_TEXT[`pool${poolIndex}`];
    
    // Special dramatic text for high rarity fruits in later frames
    if (frame >= 15 && (rarity === 'omnipotent' || rarity === 'legendary')) {
        const dramaticTexts = [
            "🌟 OMNIPOTENT ENERGY DETECTED!",
            "⚡ REALITY-BENDING POWER!",
            "🔥 WORLD-SHAKING FORCE!",
            "🌊 OCEAN-SPLITTING MIGHT!",
            "💫 COSMIC-LEVEL ENERGY!",
            "⚔️ GOD-TIER POWER EMERGING!"
        ];
        return dramaticTexts[Math.floor(Math.random() * dramaticTexts.length)];
    }
    
    return pool[Math.floor(Math.random() * pool.length)];
}

// Main animation frame update function
function updateAnimationFrame(frame, rarity = 'common', fruitType = 'Paramecia') {
    // Get synced rainbow pattern for both lines
    const rainbowPattern = getSyncedRainbowPattern(frame);
    const embedColor = getEmbedColorSyncedToFirst(frame);
    const dynamicText = getDynamicAnimationText(frame, rarity);
    
    // Get grey box indicators with cycling rarity/type
    const indicators = createGreyBoxIndicators(frame, 'animation', rarity, fruitType);
    
    return {
        color: embedColor,
        title: "🏴‍☠️ Devil Fruit Hunt",
        description: `${rainbowPattern}\n\n${dynamicText}\n\n${indicators}\n\n${rainbowPattern}`,
        footer: { text: `🌊 Frame ${frame + 1}/18 | Grand Line Energy Flowing` }
    };
}

// Progression frame update function
function updateProgressionFrame(frame, rarity = 'common', fruitType = 'Paramecia') {
    const actualFrame = frame - 18; // Adjust for progression phase
    const rainbowPattern = getSyncedRainbowPattern(frame);
    const embedColor = getEmbedColorSyncedToFirst(frame);
    
    const progressionText = PROGRESSION_TEXTS[Math.floor(Math.random() * PROGRESSION_TEXTS.length)];
    
    // Get grey box indicators for progression phase
    const indicators = createGreyBoxIndicators(actualFrame, 'progression', rarity, fruitType);
    
    return {
        color: embedColor,
        title: "🏴‍☠️ Devil Fruit Hunt - Power Surge",
        description: `${rainbowPattern}\n\n${progressionText}\n\n${indicators}\n\n${rainbowPattern}`,
        footer: { text: `🌊 Progression ${actualFrame + 1}/12 | Energy Crystallizing` }
    };
}

// Transition frame update function with perfect symmetry on BOTH lines
function updateTransitionFrame(frame, rarity = 'common', rewardColor = 0x00FF00, fruitType = 'Paramecia') {
    const transitionFrame = frame - 30; // Adjust for transition phase
    const radius = transitionFrame;
    const barLength = 20;
    
    // Create the transition pattern (same for both top and bottom)
    const positions = [];
    for (let i = 0; i < barLength; i++) {
        // Calculate distance from both center positions (9 and 10)
        const distanceFromCenter9 = Math.abs(i - 9);
        const distanceFromCenter10 = Math.abs(i - 10);
        const minDistanceFromCenter = Math.min(distanceFromCenter9, distanceFromCenter10);
        
        if (minDistanceFromCenter <= radius) {
            // Use reward color emojis based on rarity
            const rewardEmoji = getRarityEmoji(rarity);
            positions.push(rewardEmoji);
        } else {
            // Use rainbow colors (synced pattern)
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
    }
    
    // BOTH lines show the exact same transition pattern
    const transitionBar = positions.join(' ');
    
    const transitionText = TRANSITION_TEXTS[Math.floor(Math.random() * TRANSITION_TEXTS.length)];
    
    // Get grey box indicators for transition phase
    const indicators = createGreyBoxIndicators(transitionFrame, 'transition', rarity, fruitType);
    
    return {
        color: rewardColor,
        title: "🏴‍☠️ Devil Fruit Hunt - Manifestation",
        description: `${transitionBar}\n\n${transitionText}\n\n${indicators}\n\n${transitionBar}`,
        footer: { text: `🌊 Transition ${transitionFrame + 1}/10 | Power Materializing` }
    };
}

// Helper function to get rarity emoji
function getRarityEmoji(rarity) {
    const rarityEmojis = {
        'common': '🟫',
        'uncommon': '🟩',
        'rare': '🟦',
        'epic': '🟪',
        'legendary': '🟨',
        'mythical': '🟧',
        'omnipotent': '🟥'
    };
    return rarityEmojis[rarity] || '🟫';
}

// Button version functions (identical logic)
function updateAnimationFrameButton(frame, rarity = 'common', fruitType = 'Paramecia') {
    // Get synced rainbow pattern for both lines
    const rainbowPattern = getSyncedRainbowPattern(frame);
    const embedColor = getEmbedColorSyncedToFirst(frame);
    const dynamicText = getDynamicAnimationText(frame, rarity);
    
    // Get grey box indicators with cycling rarity/type
    const indicators = createGreyBoxIndicators(frame, 'animation', rarity, fruitType);
    
    return {
        color: embedColor,
        title: "🏴‍☠️ Devil Fruit Hunt",
        description: `${rainbowPattern}\n\n${dynamicText}\n\n${indicators}\n\n${rainbowPattern}`,
        footer: { text: `🌊 Frame ${frame + 1}/18 | Grand Line Energy Flowing` }
    };
}

function updateProgressionFrameButton(frame, rarity = 'common', fruitType = 'Paramecia') {
    const actualFrame = frame - 18;
    const rainbowPattern = getSyncedRainbowPattern(frame);
    const embedColor = getEmbedColorSyncedToFirst(frame);
    
    const progressionText = PROGRESSION_TEXTS[Math.floor(Math.random() * PROGRESSION_TEXTS.length)];
    
    // Get grey box indicators for progression phase
    const indicators = createGreyBoxIndicators(actualFrame, 'progression', rarity, fruitType);
    
    return {
        color: embedColor,
        title: "🏴‍☠️ Devil Fruit Hunt - Power Surge",
        description: `${rainbowPattern}\n\n${progressionText}\n\n${indicators}\n\n${rainbowPattern}`,
        footer: { text: `🌊 Progression ${actualFrame + 1}/12 | Energy Crystallizing` }
    };
}

function updateTransitionFrameButton(frame, rarity = 'common', rewardColor = 0x00FF00, fruitType = 'Paramecia') {
    const transitionFrame = frame - 30;
    const radius = transitionFrame;
    const barLength = 20;
    
    // Create the transition pattern (same for both top and bottom)
    const positions = [];
    for (let i = 0; i < barLength; i++) {
        // Calculate distance from both center positions (9 and 10)
        const distanceFromCenter9 = Math.abs(i - 9);
        const distanceFromCenter10 = Math.abs(i - 10);
        const minDistanceFromCenter = Math.min(distanceFromCenter9, distanceFromCenter10);
        
        if (minDistanceFromCenter <= radius) {
            // Use reward color emojis based on rarity
            const rewardEmoji = getRarityEmoji(rarity);
            positions.push(rewardEmoji);
        } else {
            // Use rainbow colors (synced pattern)
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
    }
    
    // BOTH lines show the exact same transition pattern
    const transitionBar = positions.join(' ');
    
    const transitionText = TRANSITION_TEXTS[Math.floor(Math.random() * TRANSITION_TEXTS.length)];
    
    // Get grey box indicators for transition phase
    const indicators = createGreyBoxIndicators(transitionFrame, 'transition', rarity, fruitType);
    
    return {
        color: rewardColor,
        title: "🏴‍☠️ Devil Fruit Hunt - Manifestation",
        description: `${transitionBar}\n\n${transitionText}\n\n${indicators}\n\n${transitionBar}`,
        footer: { text: `🌊 Transition ${transitionFrame + 1}/10 | Power Materializing` }
    };
}

// Main animation creation function
async function createUltimateCinematicExperience(interaction, fruit, userStats, isInitialReply = true) {
    const frameDelay = 1000; // 1 second per frame
    const rewardColor = getRarityColor(fruit.rarity);
    let frame = 0;
    let currentMessage;
    let attempts = 0;
    const maxAttempts = 50;
    
    try {
        console.log(`🎯 Animation Starting: ${fruit.name} (${fruit.rarity})`);
        const connectionStart = Date.now();
        
        // Phase 1: Main Animation (18 frames)
        for (frame = 0; frame < 18; frame++) {
            attempts++;
            if (attempts > maxAttempts) {
                console.log(`🚨 Max attempts reached, skipping to reveal`);
                break;
            }
            
            const embed = updateAnimationFrame(frame, fruit.rarity, fruit.type);
            
            if (frame === 0) {
                if (isInitialReply) {
                    currentMessage = await interaction.reply({
                        embeds: [embed],
                        fetchReply: true
                    });
                } else {
                    currentMessage = await interaction.editReply({
                        embeds: [embed],
                        components: []
                    });
                }
            } else {
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, frameDelay));
        }
        
        const animationFrames = frame;
        console.log(`📊 Animation Performance: ${animationFrames}/18 frames (${(animationFrames/18*100).toFixed(1)}%) - ${attempts} total attempts`);
        
        // Phase 2: Progression (12 frames)
        if (attempts <= maxAttempts) {
            console.log(`🌊 Starting progression phase...`);
            
            for (let progFrame = 0; progFrame < 12; progFrame++) {
                attempts++;
                if (attempts > maxAttempts) break;
                
                const embed = updateProgressionFrame(frame, fruit.rarity, fruit.type);
                
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                });
                
                frame++;
                await new Promise(resolve => setTimeout(resolve, frameDelay));
            }
        }
        
        // Phase 3: Transition (10 frames)
        if (attempts <= maxAttempts) {
            console.log(`🎆 Smooth transition: Rainbow to reward color...`);
            
            for (let transFrame = 0; transFrame < 10; transFrame++) {
                attempts++;
                if (attempts > maxAttempts) break;
                
                const embed = updateTransitionFrame(frame, fruit.rarity, rewardColor, fruit.type);
                
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                });
                
                frame++;
                await new Promise(resolve => setTimeout(resolve, frameDelay));
            }
        }
        
        // Final reveal
        console.log(`🎊 Gradual reveal: Devil Fruit information...`);
        
        const finalEmbed = createFinalRevealEmbed(fruit, userStats);
        const actionRow = createActionButtons();
        
        await interaction.editReply({
            embeds: [finalEmbed],
            components: [actionRow]
        });
        
        const connectionTime = Date.now() - connectionStart;
        console.log(`📡 Connection quality: ${Math.round(connectionTime/attempts)}ms`);
        console.log(`🎊 Single hunt success: ${fruit.name} (${fruit.rarity}) for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('🚨 Animation Error:', error);
        
        const errorEmbed = {
            color: 0xFF0000,
            title: "🚨 Animation Error",
            description: "Something went wrong with the animation. Here's your fruit anyway!",
            fields: [
                { name: "🍎 Devil Fruit", value: fruit.name || 'Unknown Fruit', inline: true },
                { name: "⭐ Rarity", value: fruit.rarity || 'unknown', inline: true },
                { name: "💪 Combat Power", value: (fruit.combatPower || 0).toLocaleString(), inline: true }
            ]
        };
        
        const actionRow = createActionButtons();
        
        await interaction.editReply({
            embeds: [errorEmbed],
            components: [actionRow]
        });
    }
}

// Helper functions
function getRarityColor(rarity) {
    const colors = {
        'common': 0x8B4513,
        'uncommon': 0x00FF00,
        'rare': 0x0080FF,
        'epic': 0x8000FF,
        'legendary': 0xFFD700,
        'mythical': 0xFF8000,
        'omnipotent': 0xFF0000
    };
    return colors[rarity] || 0x8B4513;
}

function createFinalRevealEmbed(fruit, userStats) {
    return {
        color: getRarityColor(fruit.rarity),
        title: `🏴‍☠️ Devil Fruit Obtained!`,
        description: `🎉 **${fruit.name}** has been added to your collection!`,
        fields: [
            { name: "🍎 Devil Fruit", value: fruit.name, inline: true },
            { name: "⭐ Rarity", value: fruit.rarity, inline: true },
            { name: "🌟 Type", value: fruit.type, inline: true },
            { name: "💪 Combat Power", value: fruit.combatPower.toLocaleString(), inline: true },
            { name: "🏆 Total Fruits", value: userStats.totalFruits.toString(), inline: true },
            { name: "⚡ Total Power", value: userStats.totalPower.toLocaleString(), inline: true }
        ],
        footer: { text: `🌊 Set sail and master your new power!` }
    };
}

function createActionButtons() {
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
    
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('huntAgain')
                .setLabel('🍈 Hunt Again')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('viewCollection')
                .setLabel('📚 My Collection')
                .setStyle(ButtonStyle.Secondary)
        );
}

module.exports = {
    createUltimateCinematicExperience,
    updateAnimationFrame,
    updateProgressionFrame,
    updateTransitionFrame,
    updateAnimationFrameButton,
    updateProgressionFrameButton,
    updateTransitionFrameButton,
    getDynamicAnimationText,
    getSyncedRainbowPattern,
    getEmbedColorSyncedToFirst,
    getRarityColor,
    createFinalRevealEmbed,
    createActionButtons
};
