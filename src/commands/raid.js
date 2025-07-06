const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Fight the test NPC!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Leave empty to fight test NPC')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.user;
        const target = interaction.options.getUser('target');

        try {
            if (target) {
                return await interaction.reply({
                    content: '⚔️ **PvP Coming Soon!**\nFor now, use `/raid` without a target to fight the test NPC!',
                    ephemeral: true
                });
            }

            // Try to use the real combat system, fallback to simple if not available
            let combatResult;
            try {
                const CombatSystem = require('../systems/combat');
                combatResult = await CombatSystem.startNPCCombat(user.id, user.username);
            } catch (error) {
                console.warn('Combat system not available, using fallback');
                // Simple fallback combat
                const victory = Math.random() > 0.5;
                combatResult = {
                    success: true,
                    result: victory ? 'victory' : 'defeat',
                    attackerHP: victory ? Math.floor(Math.random() * 50) + 25 : 0,
                    defenderHP: victory ? 0 : Math.floor(Math.random() * 50) + 25,
                    combatLog: [
                        `⚔️ **${user.username}** vs **Test NPC**`,
                        `🎲 Battle outcome: ${victory ? 'Victory!' : 'Defeat!'}`
                    ],
                    rewards: victory ? { berries: Math.floor(Math.random() * 1000) + 500, fruits: [] } : null
                };
            }

            if (!combatResult.success) {
                return await interaction.reply({
                    content: `❌ **Combat Error**\n${combatResult.error}`,
                    ephemeral: true
                });
            }

            // Create result embed
            const embed = new EmbedBuilder()
                .setTitle('⚔️ NPC Battle Complete!')
                .setDescription(`**${user.username}** vs **Test NPC**`)
                .addFields(
                    { name: '🏆 Result', value: combatResult.result === 'victory' ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                    { name: '💖 Your HP', value: `${combatResult.attackerHP}/100`, inline: true },
                    { name: '💖 NPC HP', value: `${combatResult.defenderHP}/100`, inline: true }
                )
                .setColor(combatResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                .setTimestamp();

            // Add combat log if available
            if (combatResult.combatLog && combatResult.combatLog.length > 0) {
                const logText = combatResult.combatLog.join('\n');
                if (logText.length <= 1024) {
                    embed.addFields({ name: '⚔️ Battle Log', value: logText, inline: false });
                }
            }

            // Add rewards if victory
            if (combatResult.result === 'victory' && combatResult.rewards) {
                let rewardText = '';
                if (combatResult.rewards.berries > 0) {
                    rewardText += `🫐 **+${combatResult.rewards.berries.toLocaleString()} berries**`;
                }
                if (combatResult.rewards.fruits && combatResult.rewards.fruits.length > 0) {
                    rewardText += `\n🍈 **+${combatResult.rewards.fruits.length} fruit(s)**`;
                }
                if (rewardText) {
                    embed.addFields({ name: '🎁 Rewards', value: rewardText, inline: false });
                }
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Raid command error:', error);
            await interaction.reply({
                content: '❌ **System Error**\nSomething went wrong. Please try again!',
                ephemeral: true
            });
        }
    }
};
