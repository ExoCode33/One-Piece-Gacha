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
                // Basic PvP implementation
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

                // Get both players' stats
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

                // Calculate battle prediction
                const cpDifference = attackerStats.totalCP - targetStats.totalCP;
                const baseChance = 50;
                const cpBonus = Math.floor(cpDifference / 100) * 5;
                const winChance = Math.max(10, Math.min(90, baseChance + cpBonus));

                let outcome;
                if (winChance >= 70) {
                    outcome = 'Highly Favored';
                } else if (winChance >= 55) {
                    outcome = 'Favored';
                } else if (winChance >= 45) {
                    outcome = 'Even Match';
                } else if (winChance >= 30) {
                    outcome = 'Underdog';
                } else {
                    outcome = 'Heavy Underdog';
                }

                // Execute battle
                const battleRoll = Math.floor(Math.random() * 100) + 1;
                const victory = battleRoll <= winChance;

                // Create result embed
                const embed = new EmbedBuilder()
                    .setTitle('⚔️ PvP Raid Complete!')
                    .setDescription(`**${user.username}** vs **${target.username}**`)
                    .addFields(
                        { name: '👤 Your Stats', value: `⚔️ ${attackerStats.totalCP} CP\n🍈 ${attackerStats.totalFruits} fruits`, inline: true },
                        { name: '🎯 Target Stats', value: `⚔️ ${targetStats.totalCP} CP\n🍈 ${targetStats.totalFruits} fruits`, inline: true },
                        { name: '📊 Prediction', value: `${winChance}% chance\n${outcome}`, inline: true },
                        { name: '🏆 Result', value: victory ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                        { name: '🎲 Battle Roll', value: `${battleRoll}/100`, inline: true },
                        { name: '⚔️ Outcome', value: victory ? 'You won the raid!' : 'Better luck next time!', inline: true }
                    )
                    .setColor(victory ? 0x00FF00 : 0xFF0000)
                    .setTimestamp();

                if (victory) {
                    const berryReward = Math.floor(Math.random() * 500) + 200;
                    embed.addFields({ 
                        name: '💰 Loot', 
                        value: `🫐 **${berryReward} berries** stolen!\n🍈 No fruits stolen this time`, 
                        inline: false 
                    });
                }

                return await interaction.reply({ embeds: [embed] });
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
