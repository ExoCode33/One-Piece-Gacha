const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
const { generateRandomDevilFruit } = require('../data/devilfruit');
const { generateParticles } = require('../animations/particles');
const { getChangingIndicators } = require('../animations/indicators');

// Rainbow colors for button animations
const rainbowEmbedColors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8000FF, 0x8B4513];
const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];

// Rarity color mappings
const rarityColors = {
    common: { emoji: '🟫', embed: 0x8B4513 },
    uncommon: { emoji: '🟩', embed: 0x00FF00 },
    rare: { emoji: '🟦', embed: 0x0000FF },
    epic: { emoji: '🟪', embed: 0x8000FF },
    legendary: { emoji: '🟨', embed: 0xFFFF00 },
    mythical: { emoji: '🟧', embed: 0xFF7F00 },
    omnipotent: { emoji: '🟥', embed: 0xFF0000 }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- BUTTON INTERACTION HANDLER ---
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
            case 'fullCollection':
                await handleFullCollection(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown action.',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error(`Button interaction error:`, error);
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '⚠️ Something went wrong with that action.',
                    ephemeral: true
                });
            }
        } catch (replyError) {
            console.error('Failed to send error message:', replyError);
        }
    }
}

// --- BUTTON: HUNT AGAIN ---
async function handleHuntAgain(interaction) {
    try {
        // Check cooldown
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

        await interaction.deferReply();
        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);

        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;
        const targetFruit = generateRandomDevilFruit();
        const fruitElement = DEVIL_FRUIT_ELEMENTS[targetFruit.id];
        const elementName = fruitElement ? CombatSystem.getElementName(fruitElement) : 'Unknown';

        const performanceMetrics = {
            startTime: Date.now(),
            frameAttempts: 0,
            frameSuccesses: 0,
            connectionQuality: interaction.client.ws.ping
        };

        const initialEmbed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription('🌊 Searching the mysterious waters of the Grand Line...')
            .setColor(rainbowEmbedColors[0])
            .setTimestamp();

        await interaction.editReply({ embeds: [initialEmbed] });

        // Import animation functions
        const { updateAnimationFrame, updateProgressionFrame, updateTransitionFrame, revealInformationGradually } = require('../animations/gacha');

        // Main animation phase (18 frames)
        for (let frame = 0; frame < 18; frame++) {
            await updateAnimationFrameButton(interaction, frame, targetFruit, performanceMetrics);
            await sleep(1000);
        }

        // Progression phase (12 frames)  
        for (let progFrame = 0; progFrame < 12; progFrame++) {
            await updateProgressionFrameButton(interaction, progFrame, targetFruit, performanceMetrics);
            await sleep(800);
        }

        // Transition phase (10 frames)
        for (let transFrame = 0; transFrame < 10; transFrame++) {
            await updateTransitionFrameButton(interaction, transFrame, targetFruit, performanceMetrics);
            await sleep(900);
        }

        // Reveal information
        await revealInformationGraduallyButton(interaction, targetFruit, elementName, userLevel);

        // Save to database
        await DatabaseManager.saveUserFruit(interaction.user.id, targetFruit);
        await DatabaseManager.updateUserStats(interaction.user.id);

        console.log(`🎊 Hunt Again success: ${targetFruit.name} (${targetFruit.rarity}) for ${interaction.user.username}`);

    } catch (error) {
        console.error('Hunt again error:', error);

        try {
            if (interaction.deferred && !interaction.replied) {
                await interaction.editReply({
                    content: '⚠️ Error starting new hunt. Please try again.'
                });
            }
        } catch (replyError) {
            console.error('Failed to send hunt again error:', replyError);
        }
    }
}

// --- BUTTON: COLLECTION ---
async function handleCollection(interaction) {
    await interaction.reply({ content: "Your collection overview here!", ephemeral: true });
    // You can expand this function as needed for your bot!
}

// --- BUTTON: FULL COLLECTION ---
async function handleFullCollection(interaction) {
    await interaction.reply({ content: "Your full collection list here!", ephemeral: true });
    // You can expand this function as needed for your bot!
}

// --- ANIMATION FUNCTIONS ---
async function updateAnimationFrameButton(interaction, frame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;

        // Calculate rainbow positions and colors for 20-square bars
        const barLength = 20;
        const positions = [];
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' ');

        // Calculate embed color (rainbow for most of animation)
        let embedColor;
        if (frame < 16) {
            const embedColorIndex = (0 - frame + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
            embedColor = rainbowEmbedColors[embedColorIndex];
        } else {
            embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
        }

        // Get changing indicators
        const indicators = getChangingIndicators(frame, targetFruit.rarity, targetFruit.type);
        const particles = generateParticles();

        // Get dynamic animation text
        const dynamicTexts = [
            "*A mysterious presence stirs in the depths of the Grand Line...*",
            "*Ancient powers awaken from their eternal slumber...*",
            "*The Devil Fruit's aura begins to manifest...*",
            "*Reality bends as the fruit's true nature emerges...*",
            "*Your destiny as a Devil Fruit user crystallizes...*",
            "*The fruit's power reaches critical mass...*"
        ];
        const textIndex = Math.min(Math.floor(frame / 3), dynamicTexts.length - 1);
        const dynamicText = dynamicTexts[textIndex];

        // Create animation content with dynamic text
        const animationContent = `${topBar}\n\n` +
            `🌊 **GRAND LINE EXPLORATION** 🌊\n\n` +
            `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
            `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;

        const embed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription(animationContent)
            .setColor(embedColor)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;

    } catch (error) {
        console.log(`Animation frame ${frame} error:`, error.message);
    }
}

async function updateProgressionFrameButton(interaction, progFrame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;

        const barLength = 20;
        const positions = [];
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' ');

        const embedColorIndex = (0 - (18 + progFrame) + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length;
        const embedColor = rainbowEmbedColors[embedColorIndex];

        const indicators = getChangingIndicators(18 + progFrame, targetFruit.rarity, targetFruit.type);
        const particles = generateParticles('intense');

        const progressionTexts = [
            "*The fruit's essence takes physical form...*",
            "*Reality warps as the fruit breaches dimensional barriers...*",
            "*Your legend begins to write itself...*"
        ];
        const dynamicText = progressionTexts[Math.floor(Math.random() * progressionTexts.length)];

        const progressContent = `${topBar}\n\n` +
            `🌊 **POWER CRYSTALLIZING** 🌊\n\n` +
            `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
            `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;

        const embed = new EmbedBuilder()
            .setTitle('🔮 Power Crystallization Phase')
            .setDescription(progressContent)
            .setColor(embedColor)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;

    } catch (error) {
        console.log(`Progression frame ${progFrame} error:`, error.message);
    }
}

async function updateTransitionFrameButton(interaction, transFrame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;

        const barLength = 20;
        const radius = transFrame;
        const positions = [];
        for (let i = 0; i < barLength; i++) {
            const distanceFromCenter = Math.abs(i - 9.5);
            if (distanceFromCenter <= radius + 0.5) {
                positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
            } else {
                const colorIndex = (i - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
        }
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' ');

        const embedColor = transFrame > 5 ?
            (rarityColors[targetFruit.rarity]?.embed || 0x8B4513) :
            rainbowEmbedColors[(0 - (30 + transFrame) + rainbowEmbedColors.length * 100) % rainbowEmbedColors.length];

        const particles = generateParticles('crystallizing');

        const transitionTexts = [
            "*The Devil Fruit's power takes its final form...*",
            "*Your journey as a Devil Fruit user begins now...*",
            "*The ocean itself acknowledges your new power...*"
        ];
        const dynamicText = transitionTexts[Math.floor(Math.random() * transitionTexts.length)];

        const transitionContent = `${topBar}\n\n` +
            `⚡ **CRYSTALLIZING INTO REALITY** ⚡\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;

        const embed = new EmbedBuilder()
            .setTitle('⚡ Final Crystallization')
            .setDescription(transitionContent)
            .setColor(embedColor)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;

    } catch (error) {
        console.log(`Transition frame ${transFrame} error:`, error.message);
    }
}

async function revealInformationGraduallyButton(interaction, targetFruit, elementName, userLevel) {
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

    const typeEmojis = {
        'Paramecia': '🔮',
        'Zoan': '🐺',
        'Logia': '🌪️',
        'Ancient Zoan': '🦕',
        'Mythical Zoan': '🐉',
        'Special Paramecia': '✨'
    };

    const revealLines = [
        `🌟 **${rarityTitles[targetFruit.rarity]}**`,
        '',
        `🍈 **${targetFruit.name}**`,
        `${typeEmojis[targetFruit.type] || '🍈'} **Type:** ${targetFruit.type}`,
        `👤 **Previous User:** ${targetFruit.previousUser}`,
        `💪 **Power:** ${targetFruit.power}`,
        `⭐ **Rarity:** ${targetFruit.rarity.charAt(0).toUpperCase() + targetFruit.rarity.slice(1)}`,
        combatPowerInfo,
        `⚔️ **Element:** ${elementName}`,
        '',
        `📖 **Description:**`,
        targetFruit.description,
        '',
        `🔥 **Awakening:** ${targetFruit.awakening}`,
        `💧 **Weakness:** ${targetFruit.weakness}`
    ];

    let currentContent = `${rewardBar}\n\n`;

    for (let i = 0; i < revealLines.length; i++) {
        if (revealLines[i]) {
            currentContent += revealLines[i] + '\n';
        } else {
            currentContent += '\n';
        }

        const embed = new EmbedBuilder()
            .setTitle('🏴‍☠️ Devil Fruit Discovered!')
            .setDescription(currentContent + `\n${rewardBar}`)
            .setColor(rarityColors[targetFruit.rarity]?.embed || 0x8B4513)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        await sleep(800);
    }

    const finalContent = currentContent + `\n${rewardBar}`;

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('huntAgain')
                .setLabel('🍈 Hunt Again')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('collection')
                .setLabel('📚 My Collection')
                .setStyle(ButtonStyle.Secondary)
        );

    const finalEmbed = new EmbedBuilder()
        .setTitle('🏴‍☠️ Devil Fruit Claimed!')
        .setDescription(finalContent)
        .setColor(rarityColors[targetFruit.rarity]?.embed || 0x8B4513)
        .setTimestamp();

    await interaction.editReply({
        embeds: [finalEmbed],
        components: [actionRow]
    });
}

// --- MODULE EXPORTS ---
module.exports.handleButtonInteraction = handleButtonInteraction;
