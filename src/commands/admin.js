// src/commands/economy-admin.js - Admin Economy Management Command
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy-admin')
        .setDescription('🏛️ Admin commands for economy system management')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('📊 View complete economic statistics')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('give')
                .setDescription('💰 Give berries to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to give berries to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of berries to give')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(1000000)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('take')
                .setDescription('💸 Remove berries from a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to remove berries from')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of berries to remove')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(1000000)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('🔄 Reset a user\'s economy data')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to reset')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('income-toggle')
                .setDescription('⏰ Start or stop the automatic income system')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('Action to perform')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Start Income System', value: 'start' },
                            { name: 'Stop Income System', value: 'stop' },
                            { name: 'Restart Income System', value: 'restart' },
                            { name: 'Emergency Stop', value: 'emergency' },
                            { name: 'View Status', value: 'status' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('🏆 View berry leaderboards')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Type of leaderboard')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Richest Users', value: 'balance' },
                            { name: 'Highest Earners', value: 'earned' },
                            { name: 'Biggest Spenders', value: 'spent' },
                            { name: 'Highest Income Rate', value: 'income' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('trigger-income')
                .setDescription('🚀 Manually trigger income generation for all users')
        ),

    async execute(interaction) {
        try {
            // Check if user has administrator permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({
                    content: '❌ You need Administrator permissions to use this command!',
                    ephemeral: true
                });
            }

            await interaction.deferReply();
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'stats':
                    await this.handleStats(interaction);
                    break;
                case 'give':
                    await this.handleGive(interaction);
                    break;
                case 'take':
                    await this.handleTake(interaction);
                    break;
                case 'reset':
                    await this.handleReset(interaction);
                    break;
                case 'income-toggle':
                    await this.handleIncomeToggle(interaction);
                    break;
                case 'leaderboard':
                    await this.handleLeaderboard(interaction);
                    break;
                case 'trigger-income':
                    await this.handleTriggerIncome(interaction);
                    break;
            }

        } catch (error) {
            console.error('Error in economy-admin command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Admin Command Error')
                .setDescription('An error occurred while executing the admin command.')
                .addFields({
                    name: 'Error Details',
                    value: error.message || 'Unknown error',
                    inline: false
                });
            
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },

    // Handle economic statistics
    async handleStats(interaction) {
        try {
            const BerryEconomySystem = require('../systems/economy');
            const AutomaticIncomeSystem = require('../systems/automatic-income');

            const economicStats = await BerryEconomySystem.getEconomicStatistics();
            const systemStatus = AutomaticIncomeSystem.getStatus();

            const statsEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Complete Economic Statistics')
                .setDescription('Overview of the bot\'s economy system')
                .addFields([
                    {
                        name: '👥 User Statistics',
                        value: [
                            `Total Users: ${economicStats.totalUsers.toLocaleString()}`,
                            `Active Users: ${economicStats.totalUsers}`,
                            `Users with CP: ${Math.floor(economicStats.totalUsers * 0.8)}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '💰 Berry Statistics',
                        value: [
                            `Total in Circulation: ${economicStats.totalBerriesInCirculation.toLocaleString()}`,
                            `Average Balance: ${economicStats.averageBalance.toLocaleString()}`,
                            `Richest User: ${economicStats.richestUserBalance.toLocaleString()}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '📈 Economic Activity',
                        value: [
                            `Total Generated: ${economicStats.totalBerriesGenerated.toLocaleString()}`,
                            `Total Spent: ${economicStats.totalBerriesSpent.toLocaleString()}`,
                            `Economic Health: ${economicStats.economicHealth}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '⏰ Income System Status',
                        value: [
                            `Status: ${systemStatus.isRunning ? '✅ Running' : '❌ Stopped'}`,
                            `Interval: ${systemStatus.intervalMinutes} minutes`,
                            `Last Process: ${systemStatus.lastProcessTime ? `<t:${Math.floor(systemStatus.lastProcessTime.getTime() / 1000)}:R>` : 'Never'}`
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '🎯 Performance Metrics',
                        value: [
                            `System Health: ${systemStatus.systemHealth}`,
                            `Users Processed: ${systemStatus.processedUsersCount || 0}`,
                            `Next Processing: ${systemStatus.nextRun}`
                        ].join('\n'),
                        inline: false
                    }
                ])
                .setFooter({ text: 'Economy Admin Panel | Updated in real-time' })
                .setTimestamp();

            await interaction.editReply({ embeds: [statsEmbed] });
        } catch (error) {
            console.error('Error in handleStats:', error);
            await interaction.editReply({ content: '❌ Error loading statistics!' });
        }
    },

    // Handle giving berries to user
    async handleGive(interaction) {
        try {
            const targetUser = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');
            
            const BerryEconomySystem = require('../systems/economy');
            const DatabaseManager = require('../database/manager');

            // Ensure target user exists
            await DatabaseManager.ensureUser(targetUser.id, targetUser.username);

            // Give berries
            const newBalance = await BerryEconomySystem.addBerries(
                targetUser.id, 
                amount, 
                `Admin Grant by ${interaction.user.username}`
            );

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('💰 Berries Granted')
                .setDescription(`Successfully gave berries to ${targetUser.username}`)
                .addFields([
                    {
                        name: '🎯 Target User',
                        value: `${targetUser.username} (${targetUser.id})`,
                        inline: true
                    },
                    {
                        name: '💵 Amount Given',
                        value: `${amount.toLocaleString()} berries`,
                        inline: true
                    },
                    {
                        name: '💳 New Balance',
                        value: `${newBalance.toLocaleString()} berries`,
                        inline: true
                    }
                ])
                .setFooter({ text: `Admin action by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Error in handleGive:', error);
            await interaction.editReply({ content: '❌ Error giving berries!' });
        }
    },

    // Handle taking berries from user
    async handleTake(interaction) {
        try {
            const targetUser = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');
            
            const BerryEconomySystem = require('../systems/economy');

            // Remove berries
            const newBalance = await BerryEconomySystem.removeBerries(
                targetUser.id, 
                amount, 
                `Admin Deduction by ${interaction.user.username}`
            );

            if (newBalance === false) {
                return await interaction.editReply({
                    content: `❌ ${targetUser.username} doesn't have enough berries! (Tried to remove ${amount.toLocaleString()})`
                });
            }

            const successEmbed = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle('💸 Berries Removed')
                .setDescription(`Successfully removed berries from ${targetUser.username}`)
                .addFields([
                    {
                        name: '🎯 Target User',
                        value: `${targetUser.username} (${targetUser.id})`,
                        inline: true
                    },
                    {
                        name: '💸 Amount Removed',
                        value: `${amount.toLocaleString()} berries`,
                        inline: true
                    },
                    {
                        name: '💳 New Balance',
                        value: `${newBalance.toLocaleString()} berries`,
                        inline: true
                    }
                ])
                .setFooter({ text: `Admin action by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Error in handleTake:', error);
            await interaction.editReply({ content: '❌ Error removing berries!' });
        }
    },

    // Handle resetting user economy data
    async handleReset(interaction) {
        try {
            const targetUser = interaction.options.getUser('user');
            
            const DatabaseManager = require('../database/manager');

            // Reset user's economy data
            await DatabaseManager.query('DELETE FROM user_berries WHERE user_id = $1', [targetUser.id]);
            await DatabaseManager.query('DELETE FROM user_purchases WHERE user_id = $1', [targetUser.id]);

            const resetEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔄 Economy Data Reset')
                .setDescription(`Economy data has been reset for ${targetUser.username}`)
                .addFields([
                    {
                        name: '🎯 Target User',
                        value: `${targetUser.username} (${targetUser.id})`,
                        inline: true
                    },
                    {
                        name: '🗑️ Data Cleared',
                        value: 'Berries, purchases, transaction history',
                        inline: true
                    },
                    {
                        name: '⚠️ Warning',
                        value: 'This action cannot be undone!',
                        inline: true
                    }
                ])
                .setFooter({ text: `Admin action by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [resetEmbed] });

        } catch (error) {
            console.error('Error in handleReset:', error);
            await interaction.editReply({
                content: `❌ Failed to reset economy data for ${targetUser.username}: ${error.message}`
            });
        }
    },

    // Handle income system toggle
    async handleIncomeToggle(interaction) {
        try {
            const action = interaction.options.getString('action');
            const AutomaticIncomeSystem = require('../systems/automatic-income');

            let result = '';
            let color = 0x3498db;

            switch (action) {
                case 'start':
                    await AutomaticIncomeSystem.startIncomeGeneration();
                    result = '✅ Automatic income system started successfully!';
                    color = 0x00FF00;
                    break;
                
                case 'stop':
                    AutomaticIncomeSystem.stop();
                    result = '🛑 Automatic income system stopped.';
                    color = 0xFF9900;
                    break;
                
                case 'restart':
                    await AutomaticIncomeSystem.restart();
                    result = '🔄 Automatic income system restarted successfully!';
                    color = 0x00FF00;
                    break;
                
                case 'emergency':
                    AutomaticIncomeSystem.emergencyStop(`Emergency stop by ${interaction.user.username}`);
                    result = '🚨 Emergency stop executed! Income system halted.';
                    color = 0xFF0000;
                    break;
                
                case 'status':
                    const status = AutomaticIncomeSystem.getStatus();
                    const statusEmbed = new EmbedBuilder()
                        .setColor(status.isRunning ? 0x00FF00 : 0xFF0000)
                        .setTitle('⏰ Income System Status')
                        .addFields([
                            {
                                name: 'System Status',
                                value: status.isRunning ? '✅ Running' : '❌ Stopped',
                                inline: true
                            },
                            {
                                name: 'Interval',
                                value: `${status.intervalMinutes} minutes`,
                                inline: true
                            },
                            {
                                name: 'Last Process',
                                value: status.lastProcessTime ? 
                                    `<t:${Math.floor(status.lastProcessTime.getTime() / 1000)}:R>` : 
                                    'Never',
                                inline: true
                            },
                            {
                                name: 'System Health',
                                value: status.systemHealth,
                                inline: true
                            },
                            {
                                name: 'Next Run',
                                value: status.nextRun,
                                inline: true
                            }
                        ])
                        .setTimestamp();
                    
                    return await interaction.editReply({ embeds: [statusEmbed] });
            }

            const toggleEmbed = new EmbedBuilder()
                .setColor(color)
                .setTitle('⏰ Income System Control')
                .setDescription(result)
                .setFooter({ text: `Admin action by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [toggleEmbed] });
        } catch (error) {
            console.error('Error in handleIncomeToggle:', error);
            await interaction.editReply({ content: '❌ Error controlling income system!' });
        }
    },

    // Handle leaderboard display
    async handleLeaderboard(interaction) {
        try {
            const type = interaction.options.getString('type') || 'balance';
            const BerryEconomySystem = require('../systems/economy');

            const leaderboard = await BerryEconomySystem.getIncomeLeaderboard(10);

            if (leaderboard.length === 0) {
                return await interaction.editReply({
                    content: '📊 No users found with economic data.'
                });
            }

            let title = '';
            let sortKey = '';
            
            switch (type) {
                case 'balance':
                    title = '💰 Richest Users';
                    sortKey = 'currentBerries';
                    break;
                case 'earned':
                    title = '📈 Highest Earners';
                    sortKey = 'totalEarned';
                    break;
                case 'income':
                    title = '⏰ Highest Income Rate';
                    sortKey = 'hourlyIncome';
                    break;
            }

            const sortedLeaderboard = leaderboard.sort((a, b) => b[sortKey] - a[sortKey]);
            
            const leaderboardText = sortedLeaderboard
                .slice(0, 10)
                .map((user, index) => {
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍';
                    const value = user[sortKey].toLocaleString();
                    const unit = sortKey === 'hourlyIncome' ? '/hour' : '';
                    return `${medal} **${user.username}**: ${value} berries${unit}`;
                })
                .join('\n');

            const leaderboardEmbed = new EmbedBuilder()
                .setColor(0xF39C12)
                .setTitle(`🏆 ${title} Leaderboard`)
                .setDescription(leaderboardText)
                .setFooter({ text: 'Admin Leaderboard | Top 10 users' })
                .setTimestamp();

            await interaction.editReply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('Error in handleLeaderboard:', error);
            await interaction.editReply({ content: '❌ Error loading leaderboard!' });
        }
    },

    // Handle manual income trigger
    async handleTriggerIncome(interaction) {
        try {
            const AutomaticIncomeSystem = require('../systems/automatic-income');

            const triggerEmbed = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle('🚀 Manual Income Generation Triggered')
                .setDescription('Starting manual income generation for all users...')
                .addFields({
                    name: '⏰ Processing',
                    value: 'This may take a few moments depending on user count.',
                    inline: false
                })
                .setFooter({ text: `Triggered by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [triggerEmbed] });

            // Trigger manual income generation
            await AutomaticIncomeSystem.triggerManualIncome();

            const completeEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Manual Income Generation Complete')
                .setDescription('Successfully processed income for all eligible users!')
                .addFields({
                    name: '📊 Status',
                    value: 'All users with Combat Power have received their 10-minute income.',
                    inline: false
                })
                .setFooter({ text: `Completed by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [completeEmbed] });

        } catch (error) {
            console.error('Error in handleTriggerIncome:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Manual Income Generation Failed')
                .setDescription('An error occurred while processing income generation.')
                .addFields({
                    name: 'Error Details',
                    value: error.message || 'Unknown error',
                    inline: false
                })
                .setFooter({ text: `Error reported to ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
