const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RaidCombatSystem = require('../systems/raid');
const BerryEconomySystem = require('../systems/economy');
const DatabaseManager = require('../database/manager');
const FakePlayerSystem = require('../data/fakeplayer');
const TurnBasedCombat = require('../systems/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Launch a raid against another player to steal their berries and fruits! ⚔️')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The player you want to raid (leave empty to fight test NPC)')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RaidCombatSystem = require('../systems/raid');
const BerryEconomySystem = require('../systems/economy');
const DatabaseManager = require('../database/manager');
const FakePlayerSystem = require('../data/fakeplayer');
const TurnBasedCombat = require('../systems/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Launch a raid against another player to steal their berries and fruits! ⚔️')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The player you want to raid (leave empty to fight test NPC)')
                .setRequired(false)),

    async execute(interaction) {
        try {
            const attacker = interaction.user;
            const target = interaction.options.getUser('target');
            
            // Ensure attacker exists in database
            await DatabaseManager.ensureUser(attacker.id, attacker.username);

            if (!target) {
                // Fight fake player with turn-based combat
                await this.fightFakePlayer(interaction, attacker.id, attacker.username);
            } else {
                // Ensure target exists in database
                await DatabaseManager.ensureUser(target.id, target.username);
                
                // Traditional raid against real player
                await this.showPreRaidInfo(interaction, attacker.id, target.id);
            }

        } catch (error) {
            console.log('🚨 Raid Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Error')
                .setDescription('Something went wrong with the raid system! Please try again.')
                .setFooter({ text: 'If this persists, contact an admin.' });
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], components: [] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    async fightFakePlayer(interaction, attackerId, attackerName) {
        try {
            // Get attacker's stats
            const attackerStats = await BerryEconomySystem.getUserEconomyStats(attackerId);
            const fakePlayer = FakePlayerSystem.getDisplayStatus();
            
            // Show pre-combat info
            const embed = new EmbedBuilder()
                .setColor(0xFF4500)
                .setTitle(`⚔️ Challenge: ${fakePlayer.name}`)
                .setDescription(`Prepare for **Turn-Based Combat** against our test NPC!\nThis is a 3-turn battle with detailed combat mechanics.`)
                .addFields(
                    { 
                        name: '👤 Your Stats', 
                        value: `**CP:** ${attackerStats.totalCP.toLocaleString()}\n**Berries:** ${attackerStats.berries.toLocaleString()}\n**HP:** 100/100`, 
                        inline: true 
                    },
                    { 
                        name: '🎯 NPC Stats', 
                        value: `**Level:** ${fakePlayer.level}\n**CP:** ${fakePlayer.totalCP}\n**Berries:** ${fakePlayer.berries}\n**HP:** ${fakePlayer.hp}\n**Win Rate:** ${fakePlayer.winRate}`, 
                        inline: true 
                    },
                    { 
                        name: '🍈 NPC\'s Top Fruits', 
                        value: fakePlayer.topFruits, 
                        inline: false 
                    },
                    { 
                        name: '⚔️ Combat System', 
                        value: '• **3 turns** of automatic combat\n• **Elemental advantages** affect damage\n• **Resistances** based on Devil Fruits\n• **Critical hits** possible\n• **Detailed combat log** shows everything', 
                        inline: false 
                    },
                    { 
                        name: '💰 Potential Rewards', 
                        value: `• **Berries:** 10-50% of ${fakePlayer.berries}\n• **Fruits:** 15% chance each (max 3)\n• **No cooldown** for NPC fights`, 
                        inline: false 
                    }
                )
                .setFooter({ text: 'Turn-based combat uses advanced damage calculations!' })
                .setTimestamp();

            // Create buttons
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('start_combat')
                        .setLabel('⚔️ Start Combat!')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('npc_info')
                        .setLabel('📊 NPC Details')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('cancel_npc_fight')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.reply({ 
                embeds: [embed], 
                components: [buttons] 
            });

            // Handle button interactions
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'start_combat') {
                        await this.executeTurnBasedCombat(buttonInteraction, attackerId, attackerName);
                    } else if (buttonInteraction.customId === 'npc_info') {
                        await this.showNPCDetails(buttonInteraction);
                    } else if (buttonInteraction.customId === 'cancel_npc_fight') {
                        await this.cancelNPCFight(buttonInteraction);
                    }
                } catch (error) {
                    console.log('NPC combat button error:', error);
                    try {
                        if (buttonInteraction.isRepliable()) {
                            await buttonInteraction.followUp({ 
                                content: '❌ An error occurred during NPC combat!', 
                                ephemeral: true 
                            });
                        }
                    } catch (followUpError) {
                        console.log('Failed to send follow-up:', followUpError);
                    }
                }
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.log('Fight fake player error:', error);
            await interaction.reply({ 
                content: '❌ Error loading NPC combat!', 
                ephemeral: true 
            });
        }
    },

    async executeTurnBasedCombat(interaction, attackerId, attackerName) {
        try {
            await interaction.deferReply();
            
            // Execute the turn-based combat
            const combatLog = await TurnBasedCombat.executeCombat(attackerId, attackerName);
            
            if (combatLog.error) {
                return await interaction.editReply({ 
                    content: `❌ Combat error: ${combatLog.message}` 
                });
            }

            // Format and display combat results
            const combatEmbed = TurnBasedCombat.formatCombatLog(combatLog);
            
            // Add rewards to player if they won
            if (combatLog.result.victory) {
                if (combatLog.result.rewards.berries > 0) {
                    await BerryEconomySystem.addBerries(attackerId, combatLog.result.rewards.berries);
                }
                
                // Add stolen fruits to player's collection
                for (const fruit of combatLog.result.rewards.fruits) {
                    await DatabaseManager.query(
                        `INSERT INTO user_devil_fruits (user_id, fruit_id, name, type, rarity, power, previous_user, combat_power, duplicate_count, obtained_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, NOW())`,
                        [attackerId, fruit.fruit_id, fruit.name, fruit.type, fruit.rarity, 
                         fruit.power, fruit.previousUser, fruit.combat_power || 100]
                    );
                }
                
                // Update user stats
                await DatabaseManager.updateUserStats(attackerId);
                
                // Log the combat result
                const ActivityLogger = require('../systems/logger');
                await ActivityLogger.logRaidAttempt(
                    attackerId, 
                    attackerName, 
                    'fake_player_npc', 
                    'Monkey D. Tester (NPC)', 
                    {
                        success: true,
                        attackerCP: combatLog.attacker.totalCP,
                        defenderCP: combatLog.defender.totalCP,
                        stolenBerries: combatLog.result.rewards.berries,
                        stolenFruits: combatLog.result.rewards.fruits,
                        battleMessage: `Turn-based combat victory in ${combatLog.turns.length} turns!`
                    }
                );
            }

            // Create action buttons for after combat
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('fight_again')
                        .setLabel('🔄 Fight Again')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('view_collection')
                        .setLabel('📚 My Collection')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.editReply({ 
                embeds: [combatEmbed], 
                components: [actionRow] 
            });

        } catch (error) {
            console.log('Execute turn-based combat error:', error);
            await interaction.editReply({ 
                content: '❌ Error during turn-based combat! Please try again.' 
            });
        }
    },

    async showNPCDetails(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const fakePlayer = FakePlayerSystem.getFakePlayer();
            const strongestFruits = FakePlayerSystem.getStrongestFruits(5);
            
            // Create detailed NPC info
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Monkey D. Tester (NPC) - Detailed Stats')
                .setDescription('**Test NPC for combat system training**')
                .addFields(
                    { 
                        name: '⭐ Basic Info', 
                        value: `**Level:** ${fakePlayer.level}\n**Total CP:** ${fakePlayer.totalCombatPower.toLocaleString()}\n**Berries:** ${fakePlayer.berries.toLocaleString()}\n**Hourly Income:** ${fakePlayer.hourlyIncome.toLocaleString()}`, 
                        inline: true 
                    },
                    { 
                        name: '🛡️ Combat Stats', 
                        value: `**HP:** ${fakePlayer.currentHP}/${fakePlayer.baseHP}\n**Defense Rate:** ${fakePlayer.raidStats.defenseWinRate}%\n**Battles:** ${fakePlayer.raidStats.totalDefenses}\n**Wins:** ${fakePlayer.raidStats.successfulDefenses}`, 
                        inline: true 
                    }
                )
                .setFooter({ text: 'NPC stats reset after each server restart' })
                .setTimestamp();

            // Add Devil Fruits breakdown
            let fruitsText = '';
            strongestFruits.forEach((fruit, index) => {
                const duplicateText = fruit.duplicates > 1 ? ` x${fruit.duplicates} (+${fruit.duplicates-1}% CP)` : '';
                fruitsText += `**${index + 1}.** ${fruit.name}${duplicateText}\n`;
                fruitsText += `   └ ${fruit.effectiveCP.toLocaleString()} CP • ${fruit.element} element • ${fruit.type}\n`;
            });

            embed.addFields({
                name: '🍈 Devil Fruit Arsenal',
                value: fruitsText || 'No fruits available',
                inline: false
            });

            // Add elemental resistances info
            const elementInfo = `**Fire Resistance:** 90% (Mera Mera no Mi)\n**Physical Resistance:** 80% (Logia immunity)\n**Gravity Resistance:** 90% (Zushi Zushi no Mi)\n**Soul Resistance:** 80% (Yomi Yomi no Mi)\n**Ice Weakness:** -30% (Fire vs Ice)`;
            
            embed.addFields({
                name: '⚔️ Elemental Resistances',
                value: elementInfo,
                inline: false
            });

            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.log('Show NPC details error:', error);
            await interaction.editReply({ 
                content: '❌ Error loading NPC details!' 
            });
        }
    },

    async cancelNPCFight(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('❌ NPC Combat Cancelled')
                .setDescription('You decided not to fight the test NPC. Train more and come back stronger!')
                .setFooter({ text: 'Use /berries to check your income and /pull to get stronger fruits!' });
            
            await interaction.update({ 
                embeds: [embed], 
                components: [] 
            });
        } catch (error) {
            console.log('Cancel NPC fight error:', error);
        }
    },

    // Keep all the original PvP raid functions...
    async showPreRaidInfo(interaction, attackerId, targetId) {
        try {
            // Get both players' stats
            const attackerStats = await BerryEconomySystem.getUserEconomyStats(attackerId);
            const targetStats = await BerryEconomySystem.getUserEconomyStats(targetId);
            const attackerRaidStats = await RaidCombatSystem.getUserRaidStats(attackerId);
            const targetRaidStats = await RaidCombatSystem.getUserRaidStats(targetId);
            
            const target = await interaction.client.users.fetch(targetId);
            
            // Calculate potential loot
            const potentialBerries = Math.floor(targetStats.berries * 0.3); // Average 30%
            const targetFruits = await DatabaseManager.getUserFruits(targetId);
            
            // Check if raid is possible
            let canRaid = true;
            let blockingReason = '';
            
            if (!attackerRaidStats.canRaid) {
                canRaid = false;
                const minutes = Math.ceil(attackerRaidStats.cooldownRemaining / 1000 / 60);
                blockingReason = `You're on cooldown for ${minutes} more minutes!`;
            } else if (targetRaidStats.protected) {
                canRaid = false;
                const minutes = Math.ceil(targetRaidStats.protectionRemaining / 1000 / 60);
                blockingReason = `${target.username} is protected for ${minutes} more minutes!`;
            } else if (targetStats.berries < 100 && targetFruits.length === 0) {
                canRaid = false;
                blockingReason = 'Target has no berries or fruits worth raiding!';
            } else if (attackerId === targetId) {
                canRaid = false;
                blockingReason = 'You cannot raid yourself!';
            }

            // Create embed
            const embed = new EmbedBuilder()
                .setColor(canRaid ? 0xFF4500 : 0x808080)
                .setTitle(`⚔️ Raid Preparation: ${target.username}`)
                .setDescription(canRaid ? 
                    `Prepare for battle! Analyze your target and plan your attack.` :
                    `❌ **Raid Blocked:** ${blockingReason}`)
                .addFields(
                    { 
                        name: '👤 Your Stats', 
                        value: `**CP:** ${attackerStats.totalCP.toLocaleString()}\n**Berries:** ${attackerStats.berries.toLocaleString()}\n**Raid Record:** ${attackerRaidStats.wins}W/${attackerRaidStats.totalAttacks - attackerRaidStats.wins}L`, 
                        inline: true 
                    },
                    { 
                        name: '🎯 Target Stats', 
                        value: `**CP:** ${targetStats.totalCP.toLocaleString()}\n**Berries:** ${targetStats.berries.toLocaleString()}\n**Fruits:** ${targetFruits.length}\n**Defense Record:** ${targetRaidStats.successfulDefenses}W/${targetRaidStats.totalDefenses - targetRaidStats.successfulDefenses}L`, 
                        inline: true 
                    },
                    { 
                        name: '💰 Potential Loot', 
                        value: `**Berries:** ${potentialBerries.toLocaleString()} (10-50%)\n**Fruits:** 0-3 (15% chance each)\n**Protection:** 1 hour after raid`, 
                        inline: true 
                    }
                )
                .setFooter({ 
                    text: canRaid ? 
                        'Victory is not guaranteed! Higher CP increases your chances.' :
                        'Raid requirements not met.'
                })
                .setTimestamp();

            // Add power comparison
            if (canRaid) {
                const powerRatio = attackerStats.totalCP / (targetStats.totalCP + 1);
                let advantageText = '';
                
                if (powerRatio > 2) {
                    advantageText = '🟢 **MASSIVE ADVANTAGE** - Very likely to win!';
                } else if (powerRatio > 1.5) {
                    advantageText = '🟢 **STRONG ADVANTAGE** - Good chance to win!';
                } else if (powerRatio > 1.1) {
                    advantageText = '🟡 **SLIGHT ADVANTAGE** - Decent chance to win.';
                } else if (powerRatio > 0.9) {
                    advantageText = '🟡 **EVEN MATCH** - 50/50 chance to win.';
                } else if (powerRatio > 0.7) {
                    advantageText = '🟠 **SLIGHT DISADVANTAGE** - Lower chance to win.';
                } else if (powerRatio > 0.5) {
                    advantageText = '🔴 **STRONG DISADVANTAGE** - Low chance to win.';
                } else {
                    advantageText = '🔴 **MASSIVE DISADVANTAGE** - Very unlikely to win!';
                }
                
                embed.addFields({
                    name: '⚡ Battle Prediction',
                    value: advantageText,
                    inline: false
                });
            }

            // Create buttons
            const buttons = new ActionRowBuilder();
            
            if (canRaid) {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_raid')
                        .setLabel('⚔️ Launch Raid!')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('cancel_raid')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Secondary)
                );
            } else {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId('raid_info')
                        .setLabel('📊 Raid Information')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('my_raid_stats')
                        .setLabel('📈 My Raid Stats')
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            await interaction.reply({ 
                embeds: [embed], 
                components: [buttons] 
            });

            // Handle button interactions
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'confirm_raid') {
                        await this.executeRaid(buttonInteraction, attackerId, targetId);
                    } else if (buttonInteraction.customId === 'cancel_raid') {
                        await this.cancelRaid(buttonInteraction);
                    } else if (buttonInteraction.customId === 'raid_info') {
                        await this.showRaidInfo(buttonInteraction);
                    } else if (buttonInteraction.customId === 'my_raid_stats') {
                        await this.showMyRaidStats(buttonInteraction, attackerId);
                    }
                } catch (error) {
                    console.log('Raid button interaction error:', error);
                    try {
                        if (buttonInteraction.isRepliable()) {
                            await buttonInteraction.followUp({ 
                                content: '❌ An error occurred during the raid!', 
                                ephemeral: true 
                            });
                        }
                    } catch (followUpError) {
                        console.log('Failed to send follow-up:', followUpError);
                    }
                }
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.log('Pre-raid info error:', error);
            await interaction.reply({ 
                content: '❌ Error loading raid information!', 
                ephemeral: true 
            });
        }
    },

    async executeRaid(interaction, attackerId, targetId) {
        try {
            await interaction.deferReply();
            
            // Execute the raid
            const result = await RaidCombatSystem.executeRaid(attackerId, targetId, interaction.user.username, target.username);
            
            const target = await interaction.client.users.fetch(targetId);
            
            // Create result embed
            const embed = new EmbedBuilder()
                .setColor(result.success ? 0x00FF00 : 0xFF0000)
                .setTitle(result.success ? '🏆 RAID VICTORY!' : '💀 RAID DEFEAT!')
                .setDescription(result.battleMessage)
                .addFields(
                    { 
                        name: '⚔️ Combat Power', 
                        value: `**Your CP:** ${result.attackerCP.toLocaleString()}\n**${target.username}'s CP:** ${result.defenderCP.toLocaleString()}`, 
                        inline: true 
                    }
                );

            if (result.success) {
                // Victory - show loot
                let lootText = '';
                
                if (result.stolenBerries > 0) {
                    lootText += `💰 **${result.stolenBerries.toLocaleString()} berries** stolen!\n`;
                }
                
                if (result.stolenFruits && result.stolenFruits.length > 0) {
                    lootText += `🍈 **${result.stolenFruits.length} Devil Fruit(s)** stolen:\n`;
                    result.stolenFruits.forEach(fruit => {
                        lootText += `• ${fruit.name} (${fruit.rarity})\n`;
                    });
                } else {
                    lootText += `🍈 No Devil Fruits stolen this time\n`;
                }
                
                if (!lootText) {
                    lootText = 'No loot obtained (target had nothing valuable)';
                }
                
                embed.addFields({
                    name: '💎 Loot Obtained',
                    value: lootText,
                    inline: false
                });
                
                embed.setFooter({ 
                    text: `${target.username} is now protected for 1 hour. You're on cooldown for 2 hours.` 
                });
            } else {
                // Defeat
                embed.addFields({
                    name: '😤 Result',
                    value: `You failed to steal anything from ${target.username}. Better luck next time!`,
                    inline: false
                });
                
                embed.setFooter({ 
                    text: 'You\'re on cooldown for 2 hours. Train harder and try again!' 
                });
            }

            await interaction.editReply({ 
                embeds: [embed], 
                components: [] 
            });

        } catch (error) {
            console.log('Execute raid error:', error);
            await interaction.editReply({ 
                content: '❌ Error executing raid! Please try again.' 
            });
        }
    },

    async cancelRaid(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('❌ Raid Cancelled')
                .setDescription('You decided not to raid. Perhaps it\'s better to train more first!')
                .setFooter({ text: 'Use /berries to check your income and /pull to get stronger!' });
            
            await interaction.update({ 
                embeds: [embed], 
                components: [] 
            });
        } catch (error) {
            console.log('Cancel raid error:', error);
        }
    },

    async showRaidInfo(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Raid System Information')
                .setDescription('Learn how the raid system works!')
                .addFields(
                    { 
                        name: '⚔️ How Raids Work', 
                        value: '• Challenge other players to steal their berries and fruits\n• Victory depends on Combat Power + luck\n• Higher CP = better chances to win', 
                        inline: false 
                    },
                    { 
                        name: '💰 Berry Stealing', 
                        value: '• Steal 10-50% of target\'s berries on victory\n• Amount is random within this range\n• Minimum 100 berries required to raid', 
                        inline: false 
                    },
                    { 
                        name: '🍈 Fruit Stealing', 
                        value: '• 15% chance to steal each fruit (up to 3 attempts)\n• Stolen fruits are transferred to your collection\n• Duplicate count resets for new owner', 
                        inline: false 
                    },
                    { 
                        name: '🤖 NPC Combat', 
                        value: '• Fight test NPCs without cooldowns\n• **Turn-based combat** with detailed mechanics\n• **Elemental advantages** and resistances\n• **3 turns** of strategic combat', 
                        inline: false 
                    },
                    { 
                        name: '🛡️ Protection & Cooldowns', 
                        value: '• 2 hour cooldown after raiding players\n• 1 hour protection after being raided\n• **No cooldown** for NPC fights\n• Cannot raid yourself or protected players', 
                        inline: false 
                    },
                    { 
                        name: '💡 Strategy Tips', 
                        value: '• Build your collection to increase CP\n• Target players with similar CP for best odds\n• **Practice on NPCs** to learn combat\n• Use **elemental advantages** in turn-based combat', 
                        inline: false 
                    }
                )
                .setFooter({ text: 'Good luck on your raids, pirate!' });
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log('Raid info error:', error);
            await interaction.editReply({ 
                content: '❌ Error loading raid information!' 
            });
        }
    },

    async showMyRaidStats(interaction, userId) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const stats = await RaidCombatSystem.getUserRaidStats(userId);
            const economyStats = await BerryEconomySystem.getUserEconomyStats(userId);
            
            // Calculate win rates
            const attackWinRate = stats.totalAttacks > 0 ? 
                Math.round((stats.wins / stats.totalAttacks) * 100) : 0;
            const defenseWinRate = stats.totalDefenses > 0 ? 
                Math.round((stats.successfulDefenses / stats.totalDefenses) * 100) : 0;
            
            // Format time remaining
            const formatTime = (ms) => {
                if (ms <= 0) return 'Ready!';
                const minutes = Math.ceil(ms / 1000 / 60);
                return `${minutes} minutes`;
            };
            
            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('📈 Your Raid Statistics')
                .setDescription(`**${interaction.user.username}'s Raid Record**`)
                .addFields(
                    { 
                        name: '⚔️ Attack Record', 
                        value: `**Total Raids:** ${stats.totalAttacks}\n**Victories:** ${stats.wins}\n**Win Rate:** ${attackWinRate}%\n**Berries Stolen:** ${stats.totalBerriesStolen.toLocaleString()}`, 
                        inline: true 
                    },
                    { 
                        name: '🛡️ Defense Record', 
                        value: `**Times Raided:** ${stats.totalDefenses}\n**Successful Defenses:** ${stats.successfulDefenses}\n**Defense Rate:** ${defenseWinRate}%`, 
                        inline: true 
                    },
                    { 
                        name: '⏰ Status', 
                        value: `**Next Raid:** ${formatTime(stats.cooldownRemaining)}\n**Protected:** ${stats.protected ? formatTime(stats.protectionRemaining) : 'No'}\n**Combat Power:** ${economyStats.totalCP.toLocaleString()}`, 
                        inline: true 
                    },
                    { 
                        name: '🤖 Training Options', 
                        value: `**NPC Fights:** No cooldown!\n**Turn-Based Combat:** Practice strategy\n**Elemental System:** Learn advantages\n**Tip:** Use \`/raid\` with no target to fight NPCs`, 
                        inline: false 
                    }
                )
                .setFooter({ text: 'Increase your CP to win more raids!' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log('My raid stats error:', error);
            await interaction.editReply({ 
                content: '❌ Error loading your raid statistics!' 
            });
        }
    }
};const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RaidCombatSystem = require('../systems/raid');
const BerryEconomySystem = require('../systems/economy');
const DatabaseManager = require('../database/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Launch a raid against another player to steal their berries and fruits! ⚔️')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The player you want to raid')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const attacker = interaction.user;
            const target = interaction.options.getUser('target');
            
            if (!target) {
                return await interaction.reply({ 
                    content: '❌ Please specify a valid target to raid!', 
                    ephemeral: true 
                });
            }

            // Ensure both users exist in database
            await DatabaseManager.ensureUser(attacker.id, attacker.username);
            await DatabaseManager.ensureUser(target.id, target.username);

            // Show pre-raid information
            await this.showPreRaidInfo(interaction, attacker.id, target.id);

        } catch (error) {
            console.log('🚨 Raid Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Error')
                .setDescription('Something went wrong with the raid system! Please try again.')
                .setFooter({ text: 'If this persists, contact an admin.' });
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], components: [] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    async showPreRaidInfo(interaction, attackerId, targetId) {
        try {
            // Get both players' stats
            const attackerStats = await BerryEconomySystem.getUserEconomyStats(attackerId);
            const targetStats = await BerryEconomySystem.getUserEconomyStats(targetId);
            const attackerRaidStats = await RaidCombatSystem.getUserRaidStats(attackerId);
            const targetRaidStats = await RaidCombatSystem.getUserRaidStats(targetId);
            
            const target = await interaction.client.users.fetch(targetId);
            
            // Calculate potential loot
            const potentialBerries = Math.floor(targetStats.berries * 0.3); // Average 30%
            const targetFruits = await DatabaseManager.getUserFruits(targetId);
            
            // Check if raid is possible
            let canRaid = true;
            let blockingReason = '';
            
            if (!attackerRaidStats.canRaid) {
                canRaid = false;
                const minutes = Math.ceil(attackerRaidStats.cooldownRemaining / 1000 / 60);
                blockingReason = `You're on cooldown for ${minutes} more minutes!`;
            } else if (targetRaidStats.protected) {
                canRaid = false;
                const minutes = Math.ceil(targetRaidStats.protectionRemaining / 1000 / 60);
                blockingReason = `${target.username} is protected for ${minutes} more minutes!`;
            } else if (targetStats.berries < 100 && targetFruits.length === 0) {
                canRaid = false;
                blockingReason = 'Target has no berries or fruits worth raiding!';
            } else if (attackerId === targetId) {
                canRaid = false;
                blockingReason = 'You cannot raid yourself!';
            }

            // Create embed
            const embed = new EmbedBuilder()
                .setColor(canRaid ? 0xFF4500 : 0x808080)
                .setTitle(`⚔️ Raid Preparation: ${target.username}`)
                .setDescription(canRaid ? 
                    `Prepare for battle! Analyze your target and plan your attack.` :
                    `❌ **Raid Blocked:** ${blockingReason}`)
                .addFields(
                    { 
                        name: '👤 Your Stats', 
                        value: `**CP:** ${attackerStats.totalCP.toLocaleString()}\n**Berries:** ${attackerStats.berries.toLocaleString()}\n**Raid Record:** ${attackerRaidStats.wins}W/${attackerRaidStats.totalAttacks - attackerRaidStats.wins}L`, 
                        inline: true 
                    },
                    { 
                        name: '🎯 Target Stats', 
                        value: `**CP:** ${targetStats.totalCP.toLocaleString()}\n**Berries:** ${targetStats.berries.toLocaleString()}\n**Fruits:** ${targetFruits.length}\n**Defense Record:** ${targetRaidStats.successfulDefenses}W/${targetRaidStats.totalDefenses - targetRaidStats.successfulDefenses}L`, 
                        inline: true 
                    },
                    { 
                        name: '💰 Potential Loot', 
                        value: `**Berries:** ${potentialBerries.toLocaleString()} (10-50%)\n**Fruits:** 0-3 (15% chance each)\n**Protection:** 1 hour after raid`, 
                        inline: true 
                    }
                )
                .setFooter({ 
                    text: canRaid ? 
                        'Victory is not guaranteed! Higher CP increases your chances.' :
                        'Raid requirements not met.'
                })
                .setTimestamp();

            // Add power comparison
            if (canRaid) {
                const powerRatio = attackerStats.totalCP / (targetStats.totalCP + 1);
                let advantageText = '';
                
                if (powerRatio > 2) {
                    advantageText = '🟢 **MASSIVE ADVANTAGE** - Very likely to win!';
                } else if (powerRatio > 1.5) {
                    advantageText = '🟢 **STRONG ADVANTAGE** - Good chance to win!';
                } else if (powerRatio > 1.1) {
                    advantageText = '🟡 **SLIGHT ADVANTAGE** - Decent chance to win.';
                } else if (powerRatio > 0.9) {
                    advantageText = '🟡 **EVEN MATCH** - 50/50 chance to win.';
                } else if (powerRatio > 0.7) {
                    advantageText = '🟠 **SLIGHT DISADVANTAGE** - Lower chance to win.';
                } else if (powerRatio > 0.5) {
                    advantageText = '🔴 **STRONG DISADVANTAGE** - Low chance to win.';
                } else {
                    advantageText = '🔴 **MASSIVE DISADVANTAGE** - Very unlikely to win!';
                }
                
                embed.addFields({
                    name: '⚡ Battle Prediction',
                    value: advantageText,
                    inline: false
                });
            }

            // Create buttons
            const buttons = new ActionRowBuilder();
            
            if (canRaid) {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_raid')
                        .setLabel('⚔️ Launch Raid!')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('cancel_raid')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Secondary)
                );
            } else {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId('raid_info')
                        .setLabel('📊 Raid Information')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('my_raid_stats')
                        .setLabel('📈 My Raid Stats')
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            await interaction.reply({ 
                embeds: [embed], 
                components: [buttons] 
            });

            // Handle button interactions
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'confirm_raid') {
                        await this.executeRaid(buttonInteraction, attackerId, targetId);
                    } else if (buttonInteraction.customId === 'cancel_raid') {
                        await this.cancelRaid(buttonInteraction);
                    } else if (buttonInteraction.customId === 'raid_info') {
                        await this.showRaidInfo(buttonInteraction);
                    } else if (buttonInteraction.customId === 'my_raid_stats') {
                        await this.showMyRaidStats(buttonInteraction, attackerId);
                    }
                } catch (error) {
                    console.log('Raid button interaction error:', error);
                    try {
                        if (buttonInteraction.isRepliable()) {
                            await buttonInteraction.followUp({ 
                                content: '❌ An error occurred during the raid!', 
                                ephemeral: true 
                            });
                        }
                    } catch (followUpError) {
                        console.log('Failed to send follow-up:', followUpError);
                    }
                }
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.log('Pre-raid info error:', error);
            await interaction.reply({ 
                content: '❌ Error loading raid information!', 
                ephemeral: true 
            });
        }
    },

    async executeRaid(interaction, attackerId, targetId) {
        try {
            await interaction.deferReply();
            
            // Execute the raid
            const result = await RaidCombatSystem.executeRaid(attackerId, targetId, interaction.user.username, target.username);
            
            const target = await interaction.client.users.fetch(targetId);
            
            // Create result embed
            const embed = new EmbedBuilder()
                .setColor(result.success ? 0x00FF00 : 0xFF0000)
                .setTitle(result.success ? '🏆 RAID VICTORY!' : '💀 RAID DEFEAT!')
                .setDescription(result.battleMessage)
                .addFields(
                    { 
                        name: '⚔️ Combat Power', 
                        value: `**Your CP:** ${result.attackerCP.toLocaleString()}\n**${target.username}'s CP:** ${result.defenderCP.toLocaleString()}`, 
                        inline: true 
                    }
                );

            if (result.success) {
                // Victory - show loot
                let lootText = '';
                
                if (result.stolenBerries > 0) {
                    lootText += `💰 **${result.stolenBerries.toLocaleString()} berries** stolen!\n`;
                }
                
                if (result.stolenFruits && result.stolenFruits.length > 0) {
                    lootText += `🍈 **${result.stolenFruits.length} Devil Fruit(s)** stolen:\n`;
                    result.stolenFruits.forEach(fruit => {
                        lootText += `• ${fruit.name} (${fruit.rarity})\n`;
                    });
                } else {
                    lootText += `🍈 No Devil Fruits stolen this time\n`;
                }
                
                if (!lootText) {
                    lootText = 'No loot obtained (target had nothing valuable)';
                }
                
                embed.addFields({
                    name: '💎 Loot Obtained',
                    value: lootText,
                    inline: false
                });
                
                embed.setFooter({ 
                    text: `${target.username} is now protected for 1 hour. You're on cooldown for 2 hours.` 
                });
            } else {
                // Defeat
                embed.addFields({
                    name: '😤 Result',
                    value: `You failed to steal anything from ${target.username}. Better luck next time!`,
                    inline: false
                });
                
                embed.setFooter({ 
                    text: 'You\'re on cooldown for 2 hours. Train harder and try again!' 
                });
            }

            await interaction.editReply({ 
                embeds: [embed], 
                components: [] 
            });

        } catch (error) {
            console.log('Execute raid error:', error);
            await interaction.editReply({ 
                content: '❌ Error executing raid! Please try again.' 
            });
        }
    },

    async cancelRaid(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('❌ Raid Cancelled')
                .setDescription('You decided not to raid. Perhaps it\'s better to train more first!')
                .setFooter({ text: 'Use /berries to check your income and /pull to get stronger!' });
            
            await interaction.update({ 
                embeds: [embed], 
                components: [] 
            });
        } catch (error) {
            console.log('Cancel raid error:', error);
        }
    },

    async showRaidInfo(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Raid System Information')
                .setDescription('Learn how the raid system works!')
                .addFields(
                    { 
                        name: '⚔️ How Raids Work', 
                        value: '• Challenge other players to steal their berries and fruits\n• Victory depends on Combat Power + luck\n• Higher CP = better chances to win', 
                        inline: false 
                    },
                    { 
                        name: '💰 Berry Stealing', 
                        value: '• Steal 10-50% of target\'s berries on victory\n• Amount is random within this range\n• Minimum 100 berries required to raid', 
                        inline: false 
                    },
                    { 
                        name: '🍈 Fruit Stealing', 
                        value: '• 15% chance to steal each fruit (up to 3 attempts)\n• Stolen fruits are transferred to your collection\n• Duplicate count resets for new owner', 
                        inline: false 
                    },
                    { 
                        name: '🛡️ Protection & Cooldowns', 
                        value: '• 2 hour cooldown after raiding\n• 1 hour protection after being raided\n• Cannot raid yourself or protected players', 
                        inline: false 
                    },
                    { 
                        name: '💡 Strategy Tips', 
                        value: '• Build your collection to increase CP\n• Target players with similar CP for best odds\n• Time your raids when you have good chances', 
                        inline: false 
                    }
                )
                .setFooter({ text: 'Good luck on your raids, pirate!' });
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log('Raid info error:', error);
            await interaction.editReply({ 
                content: '❌ Error loading raid information!' 
            });
        }
    },

    async showMyRaidStats(interaction, userId) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const stats = await RaidCombatSystem.getUserRaidStats(userId);
            const economyStats = await BerryEconomySystem.getUserEconomyStats(userId);
            
            // Calculate win rates
            const attackWinRate = stats.totalAttacks > 0 ? 
                Math.round((stats.wins / stats.totalAttacks) * 100) : 0;
            const defenseWinRate = stats.totalDefenses > 0 ? 
                Math.round((stats.successfulDefenses / stats.totalDefenses) * 100) : 0;
            
            // Format time remaining
            const formatTime = (ms) => {
                if (ms <= 0) return 'Ready!';
                const minutes = Math.ceil(ms / 1000 / 60);
                return `${minutes} minutes`;
            };
            
            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('📈 Your Raid Statistics')
                .setDescription(`**${interaction.user.username}'s Raid Record**`)
                .addFields(
                    { 
                        name: '⚔️ Attack Record', 
                        value: `**Total Raids:** ${stats.totalAttacks}\n**Victories:** ${stats.wins}\n**Win Rate:** ${attackWinRate}%\n**Berries Stolen:** ${stats.totalBerriesStolen.toLocaleString()}`, 
                        inline: true 
                    },
                    { 
                        name: '🛡️ Defense Record', 
                        value: `**Times Raided:** ${stats.totalDefenses}\n**Successful Defenses:** ${stats.successfulDefenses}\n**Defense Rate:** ${defenseWinRate}%`, 
                        inline: true 
                    },
                    { 
                        name: '⏰ Status', 
                        value: `**Next Raid:** ${formatTime(stats.cooldownRemaining)}\n**Protected:** ${stats.protected ? formatTime(stats.protectionRemaining) : 'No'}\n**Combat Power:** ${economyStats.totalCP.toLocaleString()}`, 
                        inline: true 
                    }
                )
                .setFooter({ text: 'Increase your CP to win more raids!' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log('My raid stats error:', error);
            await interaction.editReply({ 
                content: '❌ Error loading your raid statistics!' 
            });
        }
    }
};
