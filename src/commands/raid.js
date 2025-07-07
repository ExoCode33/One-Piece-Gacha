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
                // Enhanced PvP with detailed turn-based combat
                const attackerId = user.id;
                const targetId = target.id;

                // Basic validation
                if (attackerId === targetId) {
                    return await interaction.reply({
                        content: '❌ You cannot raid yourself! Use `/raid` without a target to fight the test NPC.',
                        ephemeral: true
                    });
                }

                if (target.bot) {
                    return await interaction.reply({
                        content: '❌ You cannot raid bots! Use `/raid` without a target to fight the test NPC.',
                        ephemeral: true
                    });
                }

                // Get both players' stats using the combat system
                let attackerStats = { totalCP: 100, totalFruits: 1 };
                let targetStats = { totalCP: 100, totalFruits: 1 };

                try {
                    const CombatSystem = require('../systems/combat');
                    attackerStats = await CombatSystem.getUserStats(attackerId);
                    targetStats = await CombatSystem.getUserStats(targetId);
                } catch (error) {
                    console.warn('Combat system not available for PvP, using defaults');
                }

                // Basic validation
                if (attackerStats.totalCP === 0) {
                    return await interaction.reply({
                        content: '❌ **No Combat Power**\nYou need Devil Fruits to raid other players!\n💡 Use `/pull` to get Devil Fruits first.',
                        ephemeral: true
                    });
                }

                if (targetStats.totalCP === 0) {
                    return await interaction.reply({
                        content: '❌ **Invalid Target**\nTarget has no Devil Fruits to raid!\n💡 Try fighting the test NPC instead.',
                        ephemeral: true
                    });
                }

                // Start PvP with animated combat
                await interaction.deferReply();

                try {
                    // Execute detailed PvP combat
                    const CombatSystem = require('../systems/combat');
                    const pvpResult = await CombatSystem.startPvPCombat(attackerId, targetId, user.username, target.username);

                    if (!pvpResult.success) {
                        return await interaction.editReply({
                            content: `❌ **PvP Combat Error**\n${pvpResult.error}`
                        });
                    }

                    // Create animated result with detailed combat log
                    const embed = new EmbedBuilder()
                        .setTitle('⚔️ PvP Battle Complete!')
                        .setDescription(`**${user.username}** vs **${target.username}**`)
                        .addFields(
                            { name: '👤 Your Stats', value: `⚔️ ${attackerStats.totalCP} CP\n🍈 ${attackerStats.totalFruits} fruits`, inline: true },
                            { name: '🎯 Target Stats', value: `⚔️ ${targetStats.totalCP} CP\n🍈 ${targetStats.totalFruits} fruits`, inline: true },
                            { name: '🏆 Result', value: pvpResult.result === 'victory' ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                            { name: '💖 Your HP', value: `${pvpResult.attackerHP}/100`, inline: true },
                            { name: '💖 Target HP', value: `${pvpResult.defenderHP}/100`, inline: true },
                            { name: '⚔️ Battle Type', value: '3-Turn Combat', inline: true }
                        )
                        .setColor(pvpResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                        .setTimestamp();

                    // Add detailed combat log - split into chunks if too long
                    if (pvpResult.combatLog && pvpResult.combatLog.length > 0) {
                        const fullLog = pvpResult.combatLog.join('\n');
                        
                        if (fullLog.length <= 1024) {
                            embed.addFields({ name: '⚔️ Detailed PvP Battle Log', value: fullLog, inline: false });
                        } else {
                            // Split into multiple fields
                            const logChunks = [];
                            let currentChunk = '';
                            
                            for (const line of pvpResult.combatLog) {
                                if ((currentChunk + line + '\n').length > 1024) {
                                    if (currentChunk) logChunks.push(currentChunk);
                                    currentChunk = line + '\n';
                                } else {
                                    currentChunk += line + '\n';
                                }
                            }
                            if (currentChunk) logChunks.push(currentChunk);
                            
                            // Add up to 3 log chunks
                            for (let i = 0; i < Math.min(logChunks.length, 3); i++) {
                                const fieldName = i === 0 ? '⚔️ Detailed PvP Battle Log' : `⚔️ PvP Battle Log (Part ${i + 1})`;
                                embed.addFields({ name: fieldName, value: logChunks[i], inline: false });
                            }
                        }
                    }

                    // Add rewards if victory
                    if (pvpResult.result === 'victory' && pvpResult.rewards) {
                        let rewardText = '';
                        if (pvpResult.rewards.berries > 0) {
                            rewardText += `🫐 **${pvpResult.rewards.berries.toLocaleString()} berries** stolen!\n`;
                        }
                        if (pvpResult.rewards.fruits && pvpResult.rewards.fruits.length > 0) {
                            rewardText += `🍈 **${pvpResult.rewards.fruits.length} fruit(s)** stolen!`;
                        }
                        if (rewardText) {
                            embed.addFields({ name: '💰 Loot', value: rewardText, inline: false });
                        }
                    }

                    return await interaction.editReply({ embeds: [embed] });

                } catch (error) {
                    console.error('PvP combat error:', error);
                    return await interaction.editReply({
                        content: '❌ **PvP System Error**\nDetailed PvP combat is not available. Please try again later.'
                    });
                }
            }

            // Try to use the real combat system, fallback to simple if not available
            let combatResult;
            try {
                const CombatSystem = require('../systems/combat');
                combatResult = await CombatSystem.startNPCCombat(user.id, user.username);
            } catch (error) {
                console.error('Combat system error:', error);
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

            // Create result embed with detailed combat log
            const embed = new EmbedBuilder()
                .setTitle('⚔️ NPC Battle Complete!')
                .setDescription(`**${user.username}** vs **Monkey D. Tester**`)
                .addFields(
                    { name: '🏆 Result', value: combatResult.result === 'victory' ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                    { name: '💖 Your HP', value: `${combatResult.attackerHP}/100`, inline: true },
                    { name: '💖 NPC HP', value: `${combatResult.defenderHP}/100`, inline: true }
                )
                .setColor(combatResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                .setTimestamp();

            // Add detailed combat log - split into chunks if too long
            if (combatResult.combatLog && combatResult.combatLog.length > 0) {
                const fullLog = combatResult.combatLog.join('\n');
                
                // Discord has a 1024 character limit per field, so we need to split long logs
                if (fullLog.length <= 1024) {
                    embed.addFields({ name: '⚔️ Detailed Battle Log', value: fullLog, inline: false });
                } else {
                    // Split into multiple fields
                    const logChunks = [];
                    let currentChunk = '';
                    
                    for (const line of combatResult.combatLog) {
                        if ((currentChunk + line + '\n').length > 1024) {
                            if (currentChunk) logChunks.push(currentChunk);
                            currentChunk = line + '\n';
                        } else {
                            currentChunk += line + '\n';
                        }
                    }
                    if (currentChunk) logChunks.push(currentChunk);
                    
                    // Add up to 3 log chunks (Discord embed limit is 25 fields total)
                    for (let i = 0; i < Math.min(logChunks.length, 3); i++) {
                        const fieldName = i === 0 ? '⚔️ Detailed Battle Log' : `⚔️ Battle Log (Part ${i + 1})`;
                        embed.addFields({ name: fieldName, value: logChunks[i], inline: false });
                    }
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
