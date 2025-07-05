const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');

// Try to import optional dependencies with fallbacks
let CombatSystem, DEVIL_FRUIT_ELEMENTS, generateRandomDevilFruit, generateParticles, getChangingIndicators;

try {
    const combatModule = require('../data/counter-system');
    CombatSystem = combatModule.CombatSystem;
    DEVIL_FRUIT_ELEMENTS = combatModule.DEVIL_FRUIT_ELEMENTS;
} catch (error) {
    console.log('Counter system not available:', error.message);
    CombatSystem = {
        calculateBasePower: () => 100,
        getLevelMultiplier: () => 1,
        getElementName: () => 'Unknown',
        getLevelRank: () => 'Rookie',
        getPowerRank: () => 'Beginner'
    };
    DEVIL_FRUIT_ELEMENTS = {};
}

try {
    const fruitModule = require('../data/devilfruit');
    generateRandomDevilFruit = fruitModule.generateRandomDevilFruit;
} catch (error) {
    console.log('Devil fruit module not available:', error.message);
    generateRandomDevilFruit = () => ({
        id: 'fruit_001',
        name: 'Test Fruit',
        type: 'Paramecia',
        rarity: 'common',
        power: 'Test power',
        previousUser: 'Test User',
        description: 'A test devil fruit',
        awakening: 'Test awakening',
        weakness: 'Test weakness'
    });
}

try {
    const particlesModule = require('../animations/particles');
    generateParticles = particlesModule.generateParticles;
} catch (error) {
    console.log('Particles module not available:', error.message);
    generateParticles = () => '✨ ⚡ 🌟 ✨ ⚡';
}

try {
    const indicatorsModule = require('../animations/indicators');
    getChangingIndicators = indicatorsModule.getChangingIndicators;
} catch (error) {
    console.log('Indicators module not available:', error.message);
    getChangingIndicators = () => ({
        aura: '🌟 Mysterious',
        blessing: '✨ Unknown',
        typeHint: '🍈 Devil Fruit'
    });
}

// Rainbow colors for animations
const rainbowEmbedColors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8000FF, 0x8B4513];
const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];

// Rarity color mappings
const rarityColors = {
    common: { emoji: '🟫', embed: 0x8B4513 },
    uncommon: { emoji: '🟩', embed: 0x00FF00 },
    rare: { emoji: '🟦', embed: 0x0000FF },
    epic: { emoji: '🟪', embed: 0x8000FF },
    legendary: { emoji: '🟨', embed: 0xFFFF00 },
    mythical: { emoji: '🟥', embed: 0xFF0000 },
    omnipotent: { emoji: '⬜', embed: 0xFFFFFF }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!'),

    async execute(interaction) {
        try {
            console.log(`🎮 ${interaction.user.username} used /pull`);
            
            // Check cooldown
            const userId = interaction.user.id;
            const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');
            
            if (cooldownEnd && Date.now() < cooldownEnd) {
                const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
                return await interaction.reply({
                    content: `⏰ Your crew is still recovering from the last hunt! Wait **${timeLeft}** more seconds before searching for another Devil Fruit.`,
                    ephemeral: true
                });
            }

            // Set cooldown (5 seconds)
            await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
            
            // Ensure user exists in database
            await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);
            
            // Get user level for combat power calculation
            const userData = await DatabaseManager.getUser(interaction.user.id);
            const userLevel = userData ? userData.level : 0;
            
            // Start the ultimate cinematic experience
            await createUltimateCinematicExperience(interaction, userLevel);
            
            console.log(`🎊 Pull success for ${interaction.user.username}`);
            
        } catch (error) {
            console.error(`🚨 Pull Command Error:`, error);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '⚠️ Something went wrong during your Devil Fruit hunt! Please try again.',
                    ephemeral: true
                });
            }
        }
    }
};

// Handle button interactions
async function handleButtonInteraction(interaction) {
    try {
        const customId = interaction.customId;
        
        switch (customId) {
            case 'huntAgain':
                await handleHuntAgain(interaction);
                break;
            case 'collection':
                await handleCollection(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown action.',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error(`Button interaction error:`, error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '⚠️ Something went wrong with that action.',
                ephemeral: true
            });
        }
    }
}

// Enhanced Hunt Again with full rainbow progression
async function handleHuntAgain(interaction) {
    try {
        // Check cooldown first
        const userId = interaction.user.id;
        const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');
        
        if (cooldownEnd && Date.now() < cooldownEnd) {
            const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
            await interaction.reply({
                content: `⏰ Your crew is still recovering! Wait **${timeLeft}** more seconds before hunting again.`,
                ephemeral: true
            });
            return;
        }
        
        // Defer the reply for button interactions
        await interaction.deferReply();
        
        // Set cooldown
        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        
        // Ensure user exists
        await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);
        
        // Get user level
        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;
        
        // Generate target fruit
        const targetFruit = generateRandomDevilFruit();
        console.log(`🎯 Hunt Again: ${targetFruit.name} (${targetFruit.rarity})`);
        
        // Get element information
        const fruitElement = DEVIL_FRUIT_ELEMENTS[targetFruit.id];
        const elementName = fruitElement ? CombatSystem.getElementName(fruitElement) : 'Unknown';
        
        // Start rainbow animation
        await startRainbowAnimation(interaction, targetFruit, elementName, userLevel);
        
        // Save to database
        await DatabaseManager.saveUserFruit(interaction.user.id, targetFruit);
        await DatabaseManager.updateUserStats(interaction.user.id);
        
        console.log(`🎊 Hunt Again success: ${targetFruit.name} for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Hunt again error:', error);
        if (interaction.deferred && !interaction.replied) {
            await interaction.editReply({
                content: '⚠️ Error starting new hunt. Please try again.'
            });
        }
    }
}

// Rainbow animation system
async function startRainbowAnimation(interaction, targetFruit, elementName, userLevel) {
    try {
        // Initial embed
        const initialEmbed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription('🌊 Searching the mysterious waters of the Grand Line...')
            .setColor(rainbowEmbedColors[0])
            .setTimestamp();
            
        await interaction.editReply({ embeds: [initialEmbed] });
        
        // Phase 1: Rainbow animation (10 frames)
        for (let frame = 0; frame < 10; frame++) {
            await updateRainbowFrame(interaction, frame, targetFruit);
            await sleep(1000);
        }
        
        // Phase 2: Crystallization (5 frames)
        for (let crystalFrame = 0; crystalFrame < 5; crystalFrame++) {
            await updateCrystallizationFrame(interaction, crystalFrame, targetFruit);
            await sleep(800);
        }
        
        // Phase 3: Final reveal
        await revealFinalResult(interaction, targetFruit, elementName, userLevel);
        
    } catch (error) {
        console.error('Rainbow animation error:', error);
    }
}

// Rainbow animation frame
async function updateRainbowFrame(interaction, frame, targetFruit) {
    try {
        const barLength = 20;
        const positions = [];
        
        // Create rainbow pattern
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' ');
        
        // Cycling embed color
        const embedColorIndex = (0 - frame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
        const embedColor = rainbowEmbedColors[embedColorIndex];
        
        // Get dynamic content
        const indicators = getChangingIndicators(frame, targetFruit.rarity, targetFruit.type);
        const particles = generateParticles();
        
        const animationTexts = [
            "*A mysterious presence stirs in the depths...*",
            "*Ancient powers awaken from slumber...*",
            "*The Devil Fruit's aura manifests...*"
        ];
        const dynamicText = animationTexts[Math.floor(Math.random() * animationTexts.length)];
        
        const content = `${topBar}\n\n` +
            `🌊 **GRAND LINE EXPLORATION** 🌊\n\n` +
            `⚡ **ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY:** ${indicators.blessing}\n` +
            `🍈 **TYPE:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription(content)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.log(`Rainbow frame ${frame} error:`, error.message);
    }
}

// Crystallization frame
async function updateCrystallizationFrame(interaction, frame, targetFruit) {
    try {
        const barLength = 20;
        const positions = [];
        
        // Create expanding rarity color
        for (let i = 0; i < barLength; i++) {
            const distanceFromCenter = Math.abs(i - 9.5);
            if (distanceFromCenter <= frame + 0.5) {
                positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
            } else {
                const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
        }
        
        const crystallBar = positions.join(' ');
        const embedColor = rarityColors[targetFruit.rarity]?.embed || 0x8B4513;
        
        const content = `${crystallBar}\n\n` +
            `⚡ **CRYSTALLIZING INTO REALITY** ⚡\n\n` +
            `*The Devil Fruit's power takes its final form...*\n\n` +
            `${crystallBar}`;
        
        const embed = new EmbedBuilder()
            .setTitle('⚡ Power Crystallization')
            .setDescription(content)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.log(`Crystallization frame ${frame} error:`, error.message);
    }
}

// Final result reveal
async function revealFinalResult(interaction, targetFruit, elementName, userLevel) {
    try {
        const rewardEmoji = rarityColors[targetFruit.rarity]?.emoji || '🟫';
        const rewardBar = Array(20).fill(rewardEmoji).join(' ');
        
        let combatPowerInfo = '';
        if (userLevel > 0) {
            const basePower = CombatSystem.calculateBasePower(targetFruit.rarity);
            const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
            const totalPower = Math.floor(basePower * levelMultiplier);
            combatPowerInfo = `⚔️ **Combat Power:** ${totalPower.toLocaleString()} CP\n`;
        }
        
        const rarityTitles = {
            common: "Common Discovery",
            uncommon: "Uncommon Find", 
            rare: "Rare Discovery",
            epic: "Epic Revelation",
            legendary: "Legendary Find",
            mythical: "Mythical Discovery",
            omnipotent: "Omnipotent Revelation"
        };
        
        const content = `${rewardBar}\n\n` +
            `🌟 **${rarityTitles[targetFruit.rarity]}**\n\n` +
            `🍈 **${targetFruit.name}**\n` +
            `🔮 **Type:** ${targetFruit.type}\n` +
            `👤 **Previous User:** ${targetFruit.previousUser}\n` +
            `💪 **Power:** ${targetFruit.power}\n` +
            `⭐ **Rarity:** ${targetFruit.rarity.charAt(0).toUpperCase() + targetFruit.rarity.slice(1)}\n` +
            combatPowerInfo +
            `⚔️ **Element:** ${elementName}\n\n` +
            `📖 **Description:** ${targetFruit.description}\n\n` +
            `${rewardBar}`;
        
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('huntAgain')
                    .setLabel('🍈 Hunt Again')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('collection')
                    .setLabel('📚 Collection')
                    .setStyle(ButtonStyle.Secondary)
            );
        
        const embed = new EmbedBuilder()
            .setTitle('🏴‍☠️ Devil Fruit Claimed!')
            .setDescription(content)
            .setColor(rarityColors[targetFruit.rarity]?.embed || 0x8B4513)
            .setTimestamp();
        
        await interaction.editReply({ 
            embeds: [embed], 
            components: [actionRow] 
        });
        
    } catch (error) {
        console.error('Final result error:', error);
    }
}

// Basic collection handler
async function handleCollection(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });
        
        const embed = new EmbedBuilder()
            .setTitle('📚 Your Devil Fruit Collection')
            .setDescription('🍈 Collection system is being enhanced!\n\nFor now, use `/pull` to continue your Devil Fruit hunting adventure!')
            .setColor(0x3498DB)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Collection error:', error);
    }
}

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export button handler
module.exports.handleButtonInteraction = handleButtonInteraction;
