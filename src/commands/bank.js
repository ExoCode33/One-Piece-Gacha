// src/commands/income.js - Income Information Command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('income')
        .setDescription('📈 View your berry income rate and generation details'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const userId = interaction.user.id;
            const username = interaction.user.username;

            // Ensure user exists in database
            const DatabaseManager = require('../database/manager');
            await DatabaseManager.ensureUser(userId, username);

            // Get economy system
            const BerryEconomySystem = require('../systems/economy');
            await BerryEconomySystem.initializeBerryTable();

            // Calculate user's combat power and income
            const totalCP = await BerryEconomySystem.calculateUserTotalCP(userId);
            const hourlyIncome = await BerryEconomySystem.calculateHourlyIncome(userId);
            const per10MinIncome = Math.floor(hourlyIncome / 6); // Every 10 minutes = 1/6 of hourly

            // Get current berries
            const currentBerries = await BerryEconomySystem.getBerries(userId);

            // Get economic stats
            const economicStats = await BerryEconomySystem.getUserEconomicStats(userId);

            // Calculate income breakdown
            const baseIncome = parseInt(process.env.BASE_INCOME_RATE) || 100;
            const cpMultiplier = parseFloat(process.env.CP_MULTIPLIER) || 0.1;
            const cpBonus = Math.floor(totalCP * cpMultiplier);
            
            // CP Milestone bonuses
            let milestoneBonus = 0;
            const cp50kBonus = parseInt(process.env.CP_50K_BONUS) || 500;
            const cp100kBonus = parseInt(process.env.CP_100K_BONUS) || 1000;
            const cp200kBonus = parseInt(process.env.CP_200K_BONUS) || 2000;
            
            if (totalCP >= 200000) {
                milestoneBonus = cp200kBonus;
            } else if (totalCP >= 100000) {
                milestoneBonus = cp100kBonus;
            } else if (totalCP >= 50000) {
                milestoneBonus = cp50kBonus;
            }

            // Create income breakdown
            const incomeBreakdown = [
                `• Base Rate: ${baseIncome.toLocaleString()} berries/hour`,
                `• CP Bonus: ${cpBonus.toLocaleString()} berries/hour (${totalCP.toLocaleString()} CP × ${cpMultiplier})`,
                milestoneBonus > 0 ? `• Milestone Bonus: ${milestoneBonus.toLocaleString()} berries/hour` : null
            ].filter(Boolean).join('\n');

            // Calculate next milestone
            let nextMilestone = '';
            if (totalCP < 50000) {
                const needed = 50000 - totalCP;
                nextMilestone = `Next milestone: ${needed.toLocaleString()} CP for +${cp50kBonus} berries/hour`;
            } else if (totalCP < 100000) {
                const needed = 100000 - totalCP;
                nextMilestone = `Next milestone: ${needed.toLocaleString()} CP for +${cp100kBonus} berries/hour`;
            } else if (totalCP < 200000) {
                const needed = 200000 - totalCP;
                nextMilestone = `Next milestone: ${needed.toLocaleString()} CP for +${cp200kBonus} berries/hour`;
            } else {
                nextMilestone = 'Maximum milestone reached!';
            }

            // Create income embed
            const incomeEmbed = new EmbedBuilder()
                .setColor(0x00D4AA)
                .setTitle(`💰 ${username}'s Berry Income Report`)
                .setDescription([
                    `📊 **Current Income Generation:**`,
                    `**${hourlyIncome.toLocaleString()}** berries per hour`,
                    `**${per10MinIncome.toLocaleString()}** berries every 10 minutes`,
                    ``,
                    `💳 **Current Balance:** ${currentBerries.toLocaleString()} berries`
                ].join('\n'))
                .addFields([
                    {
                        name: '📈 Income Breakdown',
                        value: incomeBreakdown,
                        inline: false
                    },
                    {
                        name: '⚔️ Combat Power',
                        value: `${totalCP.toLocaleString()} CP`,
                        inline: true
                    },
                    {
                        name: '🎯 Next Goal',
                        value: nextMilestone,
                        inline: false
                    },
                    {
                        name: '📊 Economic Stats',
                        value: [
                            `Total Earned: ${economicStats.totalEarned.toLocaleString()}`,
                            `Total Spent: ${economicStats.totalSpent.toLocaleString()}`,
                            `Net Worth: ${economicStats.netWorth.toLocaleString()}`,
                            `Account Age: ${economicStats.accountAge} days`
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '⏰ Automatic Income',
                        value: [
                            '• Income is generated every 10 minutes',
                            '• Requires at least 1 CP to earn berries',
                            '• Use `/pull` to get Devil Fruits and increase CP',
                            '• Check `/bank` to see your current balance'
                        ].join('\n'),
                        inline: false
                    }
                ])
                .setFooter({ 
                    text: totalCP === 0 ? 
                        'Get Devil Fruits to start earning berries!' : 
                        'Income automatically generated every 10 minutes' 
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [incomeEmbed] });

        } catch (error) {
            console.error('Error in income command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Income Error')
                .setDescription('Failed to load income information. Please try again.')
                .addFields({
                    name: 'Error Details',
                    value: error.message || 'Unknown error',
                    inline: false
                });
            
            try {
                await interaction.editReply({ embeds: [errorEmbed] });
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};
