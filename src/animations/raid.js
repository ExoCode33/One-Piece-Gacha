// src/commands/raid.js - Improved Raid Command
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CombatSystem = require('../config/combat'); // Fixed: was ../systems/combat

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

            // Ensure user exists in database
            try {
                const DatabaseManager = require('../database/manager');
                await DatabaseManager.ensureUser(userId, username);
            } catch (dbError) {
                console.warn('Database unavailable, continuing without persistence:', dbError.message);
            }

            if (targetUser) {
                // PvP Combat
                if (targetUser.bot) {
                    return interaction.editReply({
                        content: '❌ You cannot challenge bots to combat!'
                    });
                }

                if (targetUser.id === userId) {
                    return interaction.editReply({
                        content: '❌ You cannot challenge yourself! Use raid without a target to fight NPCs.'
                    });
                }

                // Ensure target user exists
                try {
                    const DatabaseManager = require('../database/manager');
                    await DatabaseManager.ensureUser(targetUser.id, targetUser.username);
                } catch (dbError) {
                    console.warn('Database unavailable for target user');
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

                // Add action buttons for post-combat options
                const actionRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('raid_again')
                            .setLabel('⚔️ Fight Again')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('view_stats')
                            .setLabel('📊 Battle Stats')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('view_collection')
                            .setLabel('📚 My Collection')
                            .setStyle(ButtonStyle.Secondary)
                    );

                // Add buttons to the final embed
                await interaction.editReply({
                    components: [actionRow]
                });

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

                // Add action buttons for post-combat options
                const actionRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_npc_again')
                            .setLabel('🤖 Fight NPC Again')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('challenge_player')
                            .setLabel('⚔️ Challenge Player')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('view_power')
                            .setLabel('💪 My Power')
                            .setStyle(ButtonStyle.Secondary)
                    );

                // Add buttons to the final embed
                await interaction.editReply({
                    components: [actionRow]
                });
            }

            // Set up button interaction handler
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    await this.handleButtonInteraction(buttonInteraction, interaction);
                } catch (error) {
                    console.error('Button interaction error:', error);
                    try {
                        await buttonInteraction.reply({ 
                            content: '❌ An error occurred with the button interaction!', 
                            ephemeral: true 
                        });
                    } catch (replyError) {
                        console.error('Failed to send error reply:', replyError);
                    }
                }
            });

            collector.on('end', () => {
                // Disable buttons after timeout
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.error('Raid command error:', error);
            
            try {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚔️ Combat System Error')
                    .setDescription('Something went wrong during combat!')
                    .addFields([
                        { 
                            name: '🔧 Troubleshooting', 
                            value: 'Try again in a moment. If the issue persists, contact an admin.',
                            inline: false 
                        },
                        {
                            name: '📝 Error Details',
                            value: `\`${error.message || 'Unknown error'}\``,
                            inline: false
                        }
                    ])
                    .setFooter({ text: 'Combat System' })
                    .setTimestamp();
                
                await interaction.editReply({ 
                    embeds: [errorEmbed], 
                    components: [] 
                });
            } catch (replyError) {
                console.error('Failed to send error embed:', replyError);
            }
        }
    },

    async handleButtonInteraction(buttonInteraction, originalInteraction) {
        const { customId, user } = buttonInteraction;

        switch (customId) {
            case 'fight_npc_again':
                await buttonInteraction.deferUpdate();
                
                const npcResult = await CombatSystem.startNPCCombatWithAnimation(
                    user.id,
                    user.username,
                    originalInteraction
                );
                
                if (!npcResult.success) {
                    await buttonInteraction.followUp({
                        content: '❌ Failed to start NPC combat again!',
                        ephemeral: true
                    });
                }
                break;

            case 'raid_again':
                await buttonInteraction.reply({
                    content: '⚔️ Use `/raid @user` to challenge someone to combat again!',
                    ephemeral: true
                });
                break;

            case 'challenge_player':
                await buttonInteraction.reply({
                    content: '🏴‍☠️ Use `/raid @player` to challenge another pirate to combat!',
                    ephemeral: true
                });
                break;

            case 'view_stats':
                await this.showBattleStats(buttonInteraction);
                break;

            case 'view_power':
                await this.showPowerStats(buttonInteraction);
                break;

            case 'view_collection':
                await this.showCollection(buttonInteraction);
                break;

            default:
                await buttonInteraction.reply({
                    content: '❓ Unknown button action!',
                    ephemeral: true
                });
                break;
        }
    },

    async showBattleStats(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const battleStats = await CombatSystem.getUserBattleStats(userId);
            
            const statsEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Your Battle Statistics')
                .setDescription(`Combat record for **${interaction.user.username}**`)
                .addFields([
                    { 
                        name: '⚔️ Total Combat Power', 
                        value: `${battleStats.totalCP.toLocaleString()} CP`, 
                        inline: true 
                    },
                    { 
                        name: '🏆 Total Battles', 
                        value: `${battleStats.totalBattles}`, 
                        inline: true 
                    },
                    { 
                        name: '📈 Win Rate', 
                        value: `${battleStats.winRate}%`, 
                        inline: true 
                    },
                    { 
                        name: '✅ Victories', 
                        value: `${battleStats.victories}`, 
                        inline: true 
                    },
                    { 
                        name: '❌ Defeats', 
                        value: `${battleStats.defeats}`, 
                        inline: true 
                    },
                    { 
                        name: '🎖️ Battle Rank', 
                        value: this.getBattleRank(battleStats.totalCP), 
                        inline: true 
                    }
                ])
                .setFooter({ text: 'Keep fighting to improve your stats!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [statsEmbed] });

        } catch (error) {
            console.error('Error showing battle stats:', error);
            await interaction.editReply({ 
                content: '❌ Failed to load battle statistics!' 
            });
        }
    },

    async showPowerStats(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const totalCP = await CombatSystem.getUserCombatPower(userId);
            
            // Get fruit count for additional info
            let fruitCount = 0;
            try {
                const DatabaseManager = require('../database/manager');
                const userFruits = await DatabaseManager.getUserFruits(userId);
                fruitCount = userFruits.length;
            } catch (error) {
                console.warn('Could not get fruit count:', error.message);
            }

            const powerEmbed = new EmbedBuilder()
                .setColor(0xF39C12)
                .setTitle('💪 Your Combat Power')
                .setDescription(`Power analysis for **${interaction.user.username}**`)
                .addFields([
                    { 
                        name: '⚔️ Total Combat Power', 
                        value: `**${totalCP.toLocaleString()} CP**`, 
                        inline: false 
                    },
                    { 
                        name: '🍈 Devil Fruits Owned', 
                        value: `${fruitCount} fruits`, 
                        inline: true 
                    },
                    { 
                        name: '📊 Average Power per Fruit', 
                        value: fruitCount > 0 ? `${Math.round(totalCP / fruitCount)} CP` : '0 CP', 
                        inline: true 
                    },
                    { 
                        name: '🏅 Power Ranking', 
                        value: this.getPowerRank(totalCP), 
                        inline: false 
                    },
                    { 
                        name: '💡 Power Tips', 
                        value: 'Collect duplicate Devil Fruits for +1% CP bonus each!', 
                        inline: false 
                    }
                ])
                .setFooter({ text: 'Use /pull to hunt for more Devil Fruits!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [powerEmbed] });

        } catch (error) {
            console.error('Error showing power stats:', error);
            await interaction.editReply({ 
                content: '❌ Failed to load power statistics!' 
            });
        }
    },

    async showCollection(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            // Redirect to the pull command's collection function
            const pullCommand = require('./pull');
            await pullCommand.showBasicCollection(interaction);

        } catch (error) {
            console.error('Error showing collection:', error);
            await interaction.editReply({ 
                content: '❌ Failed to load collection! Use `/pull` and click "My Collection" instead.' 
            });
        }
    },

    getBattleRank(totalCP) {
        if (totalCP >= 10000) return '👑 Yonko';
        if (totalCP >= 7500) return '⭐ Admiral';
        if (totalCP >= 5000) return '🎖️ Vice Admiral';
        if (totalCP >= 2500) return '🥇 Captain';
        if (totalCP >= 1000) return '🥈 Lieutenant';
        if (totalCP >= 500) return '🥉 Ensign';
        return '⚪ Recruit';
    },

    getPowerRank(totalCP) {
        if (totalCP >= 15000) return '🌟 **World-Class Warrior**';
        if (totalCP >= 10000) return '👑 **Emperor-Level Fighter**';
        if (totalCP >= 7500) return '⭐ **Admiral-Class Combatant**';
        if (totalCP >= 5000) return '🎖️ **Elite Officer**';
        if (totalCP >= 2500) return '🥇 **Skilled Captain**';
        if (totalCP >= 1000) return '🥈 **Competent Fighter**';
        if (totalCP >= 500) return '🥉 **Rookie Pirate**';
        return '⚪ **Aspiring Warrior**';
    }
};
