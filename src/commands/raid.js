const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CombatSystem = require('../systems/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Fight the test NPC to earn rewards!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Leave empty to fight test NPC')
                .setRequired(false)
        ),

    async execute(interaction) {
        const attacker = interaction.user;
        const target = interaction.options.getUser('target');

        try {
            if (target) {
                // PvP not implemented yet
                return await interaction.reply({
                    content: '⚔️ **PvP Raids Coming Soon!**\nFor now, use `/raid` without a target to fight the test NPC!',
                    ephemeral: true
                });
            }

            // Fight NPC
            console.log(`🤖 ${attacker.username} is fighting the test NPC`);
            
            const combatResult = await CombatSystem.startNPCCombat(attacker.id, attacker.username);
            
            if (!combatResult.success) {
                return await interaction.reply({
                    content: `❌ **Combat Error**\n${combatResult.error}`,
                    ephemeral: true
                });
            }

            // Create result embed
            const embed = new EmbedBuilder()
                .setTitle('⚔️ NPC Battle Complete!')
                .setDescription(`**${attacker.username}** vs **Monkey D. Tester** (2000 CP)`)
                .addFields(
                    { name: '🏆 Result', value: combatResult.result === 'victory' ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                    { name: '💖 Your HP', value: `${combatResult.attackerHP}/100`, inline: true },
                    { name: '💖 NPC HP', value: `${combatResult.defenderHP}/100`, inline: true }
                )
                .setColor(combatResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                .setTimestamp();

            // Add combat log
            if (combatResult.combatLog && combatResult.combatLog.length > 0) {
                embed.addFields({ 
                    name: '⚔️ Battle Log', 
                    value: combatResult.combatLog.join('\n'), 
                    inline: false 
                });
            }

            // Add rewards if victory
            if (combatResult.result === 'victory' && combatResult.rewards) {
                let rewardText = '';
                if (combatResult.rewards.berries > 0) {
                    rewardText += `🫐 **+${combatResult.rewards.berries.toLocaleString()} berries**\n`;
                }
                if (combatResult.rewards.fruits && combatResult.rewards.fruits.length > 0) {
                    rewardText += `🍈 **+${combatResult.rewards.fruits.length} Devil Fruit(s)**`;
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
