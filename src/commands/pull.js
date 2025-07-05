const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');

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
