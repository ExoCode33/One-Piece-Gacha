// src/commands/economy-admin.js - Simple Admin Economy Management
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

            if (subcommand === 'stats') {
                await this.handleStats(interaction);
            } else if (subcommand === 'give') {
                await this.handleGive(interaction);
            } else if (subcommand === 'take') {
                await this.handleTake(interaction);
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
            const economicStats = await BerryEconomySystem.getEconomicStatistics();

            const statsEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Economic Statistics')
                .setDescription('Overview of the bot\'s economy system')
                .addFields([
                    {
                        name: '👥 Total Users',
                        value: economicStats.totalUsers.toLocaleString(),
                        inline: true
                    },
                    {
                        name: '💰 Total Berries',
                        value: economicStats.totalBerriesInCirculation.toLocaleString(),
                        inline: true
                    },
                    {
                        name: '📈 Average Balance',
                        value: economicStats.averageBalance.toLocaleString(),
                        inline: true
                    },
                    {
                        name: '💎 Economic Health',
                        value: economicStats.economicHealth,
                        inline: true
                    },
                    {
                        name: '🏆 Richest User',
                        value: `${economicStats.richestUserBalance.toLocaleString()} berries`,
                        inline: true
                    },
                    {
                        name: '📊 Total Generated',
                        value: `${economicStats.totalBerriesGenerated.toLocaleString()} berries`,
                        inline: true
                    }
                ])
                .setFooter({ text: 'Economy Admin Panel' })
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
                .setDescription(`Successfully gave **${amount.toLocaleString()}** berries to **${targetUser.username}**`)
                .addFields([
                    {
                        name: '💳 New Balance',
                        value: `${newBalance.toLocaleString()} berries`,
                        inline: true
                    },
                    {
                        name: '👤 Target User',
                        value: targetUser.username,
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
                .setDescription(`Successfully removed **${amount.toLocaleString()}** berries from **${targetUser.username}**`)
                .addFields([
                    {
                        name: '💳 New Balance',
                        value: `${newBalance.toLocaleString()} berries`,
                        inline: true
                    },
                    {
                        name: '👤 Target User',
                        value: targetUser.username,
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
    }
};
