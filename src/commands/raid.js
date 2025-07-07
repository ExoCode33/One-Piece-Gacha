const { SlashCommandBuilder } = require('discord.js');
const CombatSystem = require('../systems/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('🏴‍☠️ Challenge an NPC or another pirate to epic combat!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Challenge another pirate (leave empty for NPC)')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('target');
            const userId = interaction.user.id;
            const username = interaction.user.username;

            await interaction.deferReply();

            if (targetUser) {
                // PvP Combat
                if (targetUser.bot) {
                    return interaction.editReply({
                        content: '❌ You cannot challenge bots to combat!'
                    });
                }

                if (targetUser.id === userId) {
                    return interaction.editReply({
                        content: '❌ You cannot challenge yourself!'
                    });
                }

                console.log(`⚔️ ${username} is challenging ${targetUser.username} to PvP combat`);

                const result = await CombatSystem.startPvPCombatWithAnimation(
                    userId,
                    targetUser.id,
                    username,
                    targetUser.username,
                    interaction
                );

                if (!result.success) {
                    return interaction.editReply({
                        content: result.message || '❌ PvP combat failed to start.'
                    });
                }

            } else {
                // NPC Combat
                console.log(`🤖 ${username} is fighting the test NPC with animations`);

                const result = await CombatSystem.startNPCCombatWithAnimation(
                    userId,
                    username,
                    interaction
                );

                if (!result.success) {
                    return interaction.editReply({
                        content: result.message || '❌ NPC combat failed to start.'
                    });
                }
            }

        } catch (error) {
            console.error('Raid command error:', error);
            
            try {
                await interaction.editReply({
                    content: '❌ An error occurred during combat. Please try again.'
                });
            } catch (replyError) {
                console.error('Failed to send error reply:', replyError);
            }
        }
    },
};
