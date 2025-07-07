const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CombatSystem = require('../systems/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Fight the test NPC or raid another player!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Leave empty to fight test NPC with animated combat')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.user;
        const target = interaction.options.getUser('target');

        try {
            if (!target) {
                // Fight NPC with animated ship combat
                console.log(`🤖 ${user.username} is fighting the test NPC with animations`);
                
                // Start with a loading message
                await interaction.deferReply();
                
                // Start animated NPC combat
                const combatResult = await CombatSystem.startNPCCombatWithAnimation(user.id, user.username, interaction);
                
                if (!combatResult.success) {
                    return await interaction.editReply({
                        content: `❌ **Combat Error**\n${combatResult.error}`
                    });
                }

                // Create animated turn display
                let currentMessage = `🏴‍☠️ **Preparing for Epic Battle!**\n\n🎮 Initializing animated combat system...\n⏳ Loading ship animations...`;
                await interaction.editReply({ content: currentMessage });

                // Animation delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Create final result with detailed combat log and HP tracking
                const embed = new EmbedBuilder()
                    .setTitle('🏴‍☠️ Epic NPC Battle Complete!')
                    .setDescription(`**${user.username}** vs **Monkey D. Tester**`)
                    .addFields(
                        { name: '🏆 Result', value: combatResult.result === 'victory' ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                        { name: '💖 Your HP', value: `${combatResult.attackerHP}/${combatResult.attackerMaxHP || 100}`, inline: true },
                        { name: '💖 NPC HP', value: `${combatResult.defenderHP}/${combatResult.defenderMaxHP || 100}`, inline: true },
                        { name: '⚔️ Combat Type', value: 'Animated Ship Battle', inline: true },
                        { name: '🎯 Your CP', value: `${(await CombatSystem.getUserStats(user.id)).totalCP}`, inline: true },
                        { name: '🤖 NPC CP', value: '2000', inline: true }
                    )
                    .setColor(combatResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                    .setTimestamp();

                // Add detailed combat log - split into chunks if too long
                if (combatResult.combatLog && combatResult.combatLog.length > 0) {
                    const fullLog = combatResult.combatLog.join('\n');
                    
                    if (fullLog.length <= 1024) {
                        embed.addFields({ name: '⚔️ Complete Animated Battle Log', value: fullLog, inline: false });
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
                        
                        // Add up to 3 log chunks
                        for (let i = 0; i < Math.min(logChunks.length, 3); i++) {
                            const fieldName = i === 0 ? '⚔️ Complete Animated Battle Log' : `⚔️ Battle Log (Part ${i + 1})`;
                            embed.addFields({ name: fieldName, value: logChunks[i], inline: false });
                        }
                    }
                }

                // Add rewards if victory
                if (combatResult.result === 'victory' && combatResult.rewards) {
                    let rewardText = '';
                    if (combatResult.rewards.berries > 0) {
                        rewardText += `🫐 **+${combatResult.rewards.berries.toLocaleString()} berries**\n`;
                    }
                    if (combatResult.rewards.fruits && combatResult.rewards.fruits.length > 0) {
                        rewardText += `🍈 **+${combatResult.rewards.fruits.length} fruit(s)**`;
                    }
                    if (rewardText) {
                        embed.addFields({ name: '🎁 Victory Rewards', value: rewardText, inline: false });
                    }
                }

                return await interaction.editReply({ embeds: [embed] });
            }

            // PvP Raid Logic with validation
            const attackerId = user.id;
            const targetId = target.id;

            // Check if trying to raid themselves
            if (attackerId === targetId) {
                return await interaction.reply({
                    content: '❌ You cannot raid yourself! Use `/raid` without a target to fight the test NPC.',
                    ephemeral: true
                });
            }

            // Check if target is a bot
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
                // Execute animated PvP combat
                const pvpResult = await CombatSystem.startPvPCombatWithAnimation(attackerId, targetId, user.username, target.username, interaction);

                if (!pvpResult.success) {
                    return await interaction.editReply({
                        content: `❌ **PvP Combat Error**\n${pvpResult.error}`
                    });
                }

                // Create final result with detailed combat log
                const embed = new EmbedBuilder()
                    .setTitle('🏴‍☠️ Epic PvP Battle Complete!')
                    .setDescription(`**${user.username}** vs **${target.username}**`)
                    .addFields(
                        { name: '👤 Your Stats', value: `⚔️ ${attackerStats.totalCP} CP\n🍈 ${attackerStats.totalFruits} fruits`, inline: true },
                        { name: '🎯 Target Stats', value: `⚔️ ${targetStats.totalCP} CP\n🍈 ${targetStats.totalFruits} fruits`, inline: true },
                        { name: '🏆 Result', value: pvpResult.result === 'victory' ? '**VICTORY!** 🎉' : '**DEFEAT!** 💀', inline: true },
                        { name: '💖 Your HP', value: `${pvpResult.attackerHP}/${pvpResult.attackerMaxHP}`, inline: true },
                        { name: '💖 Target HP', value: `${pvpResult.defenderHP}/${pvpResult.defenderMaxHP}`, inline: true },
                        { name: '⚔️ Battle Type', value: 'Animated 3-Turn Combat', inline: true }
                    )
                    .setColor(pvpResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                    .setTimestamp();

                // Add detailed combat log - split into chunks if too long
                if (pvpResult.combatLog && pvpResult.combatLog.length > 0) {
                    const fullLog = pvpResult.combatLog.join('\n');
                    
                    if (fullLog.length <= 1024) {
                        embed.addFields({ name: '⚔️ Complete Battle Log', value: fullLog, inline: false });
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
                            const fieldName = i === 0 ? '⚔️ Complete Battle Log' : `⚔️ Battle Log (Part ${i + 1})`;
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
                    content: '❌ **PvP System Error**\nAnimated PvP combat encountered an issue. Please try again later.'
                });
            }

        } catch (error) {
            console.error('Raid command error:', error);
            try {
                await interaction.reply({
                    content: '❌ **System Error**\nSomething went wrong with the raid system. Please try again.',
                    ephemeral: true
                });
            } catch (replyError) {
                console.error('Failed to send error reply:', replyError);
            }
        }
    }
};
