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

            await handleSingleHunt(interaction);
            
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

async function handleSingleHunt(interaction) {
    try {
        console.log(`🎮 ${interaction.user.username} initiated single Devil Fruit hunt`);
        
        // Set cooldown (5 seconds)
        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        
        // Ensure user exists in database
        await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);
        
        // Get user level for combat power calculation
        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;
        
        // Start the ultimate cinematic experience
        await createUltimateCinematicExperience(interaction, userLevel);
        
        console.log(`🎊 Single hunt success for ${interaction.user.username}`);
        
    } catch (error) {
        console.error('Single hunt error:', error);
        throw error;
    }
}

// You may include your other handlers (collection, fullCollection, button logic, etc) below as needed
// Make sure they are not partially duplicated or incomplete!

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export the button handler for the interaction event, if your event system uses it:
module.exports.handleButtonInteraction = handleButtonInteraction;

// ===== Helper Button Handler Example (keep only ONE definition for each function) =====

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

// ---- You can keep your other button functions below, but only once each! ----
// (If you want me to paste your full collection/animation/duplicate/crown-jewel code in, let me know!)

