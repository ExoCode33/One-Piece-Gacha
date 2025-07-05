const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RaidCombatSystem = require('../systems/raid');
const BerryEconomySystem = require('../systems/economy');
const DatabaseManager = require('../database/manager');
const CombatSystem = require('../systems/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Raid another player or fight the test NPC!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The player you want to raid (leave empty to fight test NPC)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const attacker = interaction.user;
        const target = interaction.options.getUser('target');

        try {
            if (!target) {
                // Fight NPC - no cooldowns or restrictions
                console.log(`🤖 ${attacker.username} is fighting the test NPC`);
                
                // Start NPC combat
                const combatResult = await CombatSystem.startNPCCombat(attacker.id, attacker.username);
                
                if (!combatResult.success) {
                    return await interaction.reply({
                        content: `❌ **Combat Error**\n${combatResult.error}`,
                        ephemeral: true
                    });
                }

                // Create combat result embed
                const embed = new EmbedBuilder()
                    .setTitle('⚔️ NPC Raid Complete!')
                    .setDescription(`**${attacker.username}** vs **Monkey D. Tester** (Level 25)`)
                    .addFields(
                        { name: '🏆 Result', value: combatResult.result === 'victory' ? '**VICTORY!**' : '**DEFEAT!**', inline: true },
                        { name: '💖 Your HP', value: `${combatResult.attackerHP}/100`, inline: true },
                        { name: '💖 NPC HP', value: `${combatResult.defenderHP}/100`, inline: true },
                        { name: '⚔️ Combat Log', value: combatResult.combatLog.join('\n'), inline: false }
                    )
                    .setColor(combatResult.result === 'victory' ? 0x00FF00 : 0xFF0000)
                    .setTimestamp();

                if (combatResult.result === 'victory' && combatResult.rewards) {
                    let rewardText = '';
                    if (combatResult.rewards.berries > 0) {
                        rewardText += `🫐 **+${combatResult.rewards.berries.toLocaleString()} berries**\n`;
                    }
                    if (combatResult.rewards.fruits && combatResult.rewards.fruits.length > 0) {
                        rewardText += `🍈 **Fruits stolen:**\n${combatResult.rewards.fruits.map(f => `• ${f.name}`).join('\n')}`;
                    }
                    if (rewardText) {
                        embed.addFields({ name: '🎁 Rewards', value: rewardText, inline: false });
                    }
                }

                // Create action buttons
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_again')
                            .setLabel('⚔️ Fight Again')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('check_stats')
                            .setLabel('📊 My Stats')
                            .setStyle(ButtonStyle.Secondary)
                    );

                const response = await interaction.reply({
                    embeds: [embed],
                    components: [row]
                });

                // Handle button interactions
                const collector = response.createMessageComponentCollector({ time: 60000 });

                collector.on('collect', async (buttonInteraction) => {
                    if (buttonInteraction.user.id !== attacker.id) {
                        return await buttonInteraction.reply({
                            content: '❌ This is not your raid!',
                            ephemeral: true
                        });
                    }

                    try {
                        if (buttonInteraction.customId === 'fight_again') {
                            // Start another NPC fight
                            await buttonInteraction.deferReply({ ephemeral: true });
                            const newCombat = await CombatSystem.startNPCCombat(attacker.id, attacker.username);
                            
                            if (newCombat.success) {
                                const quickEmbed = new EmbedBuilder()
                                    .setTitle('⚔️ Quick NPC Battle')
                                    .setDescription(`**${newCombat.result === 'victory' ? 'VICTORY!' : 'DEFEAT!'}**`)
                                    .addFields(
                                        { name: '💖 Your HP', value: `${newCombat.attackerHP}/100`, inline: true },
                                        { name: '💖 NPC HP', value: `${newCombat.defenderHP}/100`, inline: true }
                                    )
                                    .setColor(newCombat.result === 'victory' ? 0x00FF00 : 0xFF0000);

                                if (newCombat.result === 'victory' && newCombat.rewards) {
                                    let quickReward = '';
                                    if (newCombat.rewards.berries > 0) {
                                        quickReward += `🫐 +${newCombat.rewards.berries.toLocaleString()} berries\n`;
                                    }
                                    if (newCombat.rewards.fruits && newCombat.rewards.fruits.length > 0) {
                                        quickReward += `🍈 +${newCombat.rewards.fruits.length} fruit(s)`;
                                    }
                                    if (quickReward) {
                                        quickEmbed.addFields({ name: '🎁 Rewards', value: quickReward, inline: false });
                                    }
                                }

                                await buttonInteraction.editReply({ embeds: [quickEmbed] });
                            } else {
                                await buttonInteraction.editReply({ content: `❌ Combat failed: ${newCombat.error}` });
                            }

                        } else if (buttonInteraction.customId === 'check_stats') {
                            await buttonInteraction.deferReply({ ephemeral: true });
                            
                            // Get user stats
                            const userStats = await DatabaseManager.getUserStats(attacker.id);
                            const berries = await BerryEconomySystem.getBerries(attacker.id);
                            
                            const statsEmbed = new EmbedBuilder()
                                .setTitle('📊 Your Battle Stats')
                                .setDescription(`**${attacker.username}**'s Current Status`)
                                .addFields(
                                    { name: '🫐 Berries', value: berries.toLocaleString(), inline: true },
                                    { name: '🍈 Fruits', value: userStats.totalFruits?.toString() || '0', inline: true },
                                    { name: '⚔️ Combat Power', value: userStats.totalCP?.toString() || '0', inline: true }
                                )
                                .setColor(0x3498db)
                                .setTimestamp();

                            await buttonInteraction.editReply({ embeds: [statsEmbed] });
                        }
                    } catch (error) {
                        console.error('Button interaction error:', error);
                        await buttonInteraction.editReply({ content: '❌ An error occurred processing your request.' });
                    }
                });

                collector.on('end', () => {
                    // Disable buttons after timeout
                    const disabledRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('fight_again')
                                .setLabel('⚔️ Fight Again')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('check_stats')
                                .setLabel('📊 My Stats')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        );

                    interaction.editReply({ components: [disabledRow] }).catch(() => {});
                });

                return;
            }

            // PvP Raid Logic
            const attackerId = attacker.id;
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

            // Check raid cooldown
            const canRaid = await RaidCombatSystem.canRaid(attackerId);
            if (!canRaid.allowed) {
                const timeLeft = Math.ceil(canRaid.timeLeft / (1000 * 60)); // Convert to minutes
                return await interaction.reply({
                    content: `⏰ **Raid Cooldown**\nYou must wait **${timeLeft} minutes** before raiding again!\n\n💡 *Tip: Use \`/raid\` without a target to fight the test NPC (no cooldown)*`,
                    ephemeral: true
                });
            }

            // Check if target is protected
            const isProtected = await RaidCombatSystem.isProtected(targetId);
            if (isProtected.protected) {
                const timeLeft = Math.ceil(isProtected.timeLeft / (1000 * 60)); // Convert to minutes
                return await interaction.reply({
                    content: `🛡️ **Target Protected**\n${target.username} is protected from raids for **${timeLeft} minutes**!\n\n💡 *Tip: Use \`/raid\` without a target to fight the test NPC instead*`,
                    ephemeral: true
                });
            }

            // Get combat stats for both players
            const attackerStats = await DatabaseManager.getUserStats(attackerId);
            const targetStats = await DatabaseManager.getUserStats(targetId);

            if (attackerStats.totalCP === 0) {
                return await interaction.reply({
                    content: '❌ **No Combat Power**\nYou need Devil Fruits to participate in raids!\n\n💡 *Use `/pull` to get Devil Fruits, or fight the test NPC with `/raid`*',
                    ephemeral: true
                });
            }

            if (targetStats.totalCP === 0) {
                return await interaction.reply({
                    content: '❌ **Invalid Target**\nTarget has no Devil Fruits to raid!\n\n💡 *Try fighting the test NPC with `/raid` instead*',
                    ephemeral: true
                });
            }

            // Calculate battle prediction
            const prediction = RaidCombatSystem.calculateBattlePrediction(attackerStats.totalCP, targetStats.totalCP);

            // Create pre-raid embed
            const preRaidEmbed = new EmbedBuilder()
                .setTitle('⚔️ Raid Analysis')
                .setDescription(`**${attacker.username}** vs **${target.username}**`)
                .addFields(
                    { name: '👤 Your Stats', value: `⚔️ ${attackerStats.totalCP} CP\n🍈 ${attackerStats.totalFruits} fruits`, inline: true },
                    { name: '🎯 Target Stats', value: `⚔️ ${targetStats.totalCP} CP\n🍈 ${targetStats.totalFruits} fruits`, inline: true },
                    { name: '📊 Win Prediction', value: `**${prediction.winChance}%** chance\n${prediction.outcome}`, inline: true }
                )
                .setColor(prediction.winChance >= 50 ? 0x00FF00 : 0xFF8000)
                .setTimestamp();

            // Create confirmation buttons
            const confirmRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_raid')
                        .setLabel('⚔️ Attack!')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('cancel_raid')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Secondary)
                );

            const response = await interaction.reply({
                embeds: [preRaidEmbed],
                components: [confirmRow]
            });

            // Handle raid confirmation
            const confirmCollector = response.createMessageComponentCollector({ time: 30000 });

            confirmCollector.on('collect', async (confirmInteraction) => {
                if (confirmInteraction.user.id !== attackerId) {
                    return await confirmInteraction.reply({
                        content: '❌ This is not your raid!',
                        ephemeral: true
                    });
                }

                if (confirmInteraction.customId === 'cancel_raid') {
                    await confirmInteraction.update({
                        content: '❌ **Raid Cancelled**\nYou decided not to attack.',
                        embeds: [],
                        components: []
                    });
                    return;
                }

                if (confirmInteraction.customId === 'confirm_raid') {
                    await confirmInteraction.deferUpdate();

                    // Execute the raid
                    const result = await RaidCombatSystem.executeRaid(attackerId, targetId, attacker.username, target.username);

                    if (!result.success) {
                        await confirmInteraction.editReply({
                            content: `❌ **Raid Failed**\n${result.error}`,
                            embeds: [],
                            components: []
                        });
                        return;
                    }

                    // Create result embed
                    const resultEmbed = new EmbedBuilder()
                        .setTitle('⚔️ Raid Complete!')
                        .setDescription(`**${attacker.username}** attacked **${target.username}**`)
                        .addFields(
                            { name: '🏆 Result', value: result.victory ? '**VICTORY!**' : '**DEFEAT!**', inline: true },
                            { name: '🎲 Battle Roll', value: `${result.battleRoll}/100`, inline: true },
                            { name: '📊 Win Chance', value: `${result.winChance}%`, inline: true }
                        )
                        .setColor(result.victory ? 0x00FF00 : 0xFF0000)
                        .setTimestamp();

                    if (result.victory && result.loot) {
                        let lootText = '';
                        if (result.loot.berries > 0) {
                            lootText += `🫐 **${result.loot.berries.toLocaleString()} berries** stolen\n`;
                        }
                        if (result.loot.fruits && result.loot.fruits.length > 0) {
                            lootText += `🍈 **Fruits stolen:**\n${result.loot.fruits.map(f => `• ${f.name} (${f.rarity})`).join('\n')}`;
                        }
                        if (lootText) {
                            resultEmbed.addFields({ name: '💰 Loot', value: lootText, inline: false });
                        }
                    }

                    await confirmInteraction.editReply({
                        embeds: [resultEmbed],
                        components: []
                    });
                }
            });

            confirmCollector.on('end', async () => {
                try {
                    await interaction.editReply({
                        content: '⏰ **Raid Expired**\nRaid confirmation timed out.',
                        embeds: [],
                        components: []
                    });
                } catch (error) {
                    // Interaction might already be handled
                }
            });

        } catch (error) {
            console.error('Raid command error:', error);
            await interaction.reply({
                content: '❌ **System Error**\nSomething went wrong with the raid system. Please try again.',
                ephemeral: true
            });
        }
    }
};
