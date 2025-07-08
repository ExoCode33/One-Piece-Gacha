// src/commands/bank.js - Enhanced Bank Command with Income Collection
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank')
        .setDescription('💳 View your berry balance and collect accumulated income'),

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

            // Get detailed balance information
            const balanceData = await BerryEconomySystem.getDetailedBalance(userId);
            const incomeData = await BerryEconomySystem.getIncomeCollectionData(userId);
            const totalCP = await BerryEconomySystem.calculateUserTotalCP(userId);

            // Create main bank embed
            const bankEmbed = new EmbedBuilder()
                .setColor(0x00D4AA)
                .setTitle(`💳 ${username}'s Berry Bank`)
                .setDescription(`Your personal berry account and financial overview`)
                .addFields([
                    {
                        name: '💰 Current Balance',
                        value: `**${balanceData.balance.toLocaleString()}** berries`,
                        inline: true
                    },
                    {
                        name: '📈 Accumulated Income',
                        value: incomeData.accumulatedIncome > 0 ? 
                            `**${incomeData.accumulatedIncome.toLocaleString()}** berries ready` :
                            `Collecting... (${incomeData.hoursAccumulated.toFixed(1)}h)`,
                        inline: true
                    },
                    {
                        name: '⚔️ Combat Power',
                        value: `${totalCP.toLocaleString()} CP`,
                        inline: true
                    },
                    {
                        name: '📊 Financial Statistics',
                        value: [
                            `💵 Total Earned: ${balanceData.totalEarned.toLocaleString()}`,
                            `💸 Total Spent: ${balanceData.totalSpent.toLocaleString()}`,
                            `📈 Net Worth: ${balanceData.netWorth.toLocaleString()}`,
                            `📅 Account Age: ${balanceData.accountAge} days`
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '⏰ Income Generation',
                        value: [
                            `🕐 Hourly Rate: ${incomeData.hourlyRate.toLocaleString()} berries/hour`,
                            `🕕 Per 10 Minutes: ${Math.floor(incomeData.hourlyRate / 6).toLocaleString()} berries`,
                            incomeData.canCollect ? 
                                `✅ **Ready to collect!**` :
                                `⏳ Next collection: <t:${Math.floor(incomeData.nextCollection?.getTime() / 1000)}:R>`
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

            // Create action buttons
            const actionRow = new ActionRowBuilder();

            if (incomeData.canCollect && incomeData.accumulatedIncome > 0) {
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId('collect_income')
                        .setLabel(`💰 Collect ${incomeData.accumulatedIncome.toLocaleString()} Berries`)
                        .setStyle(ButtonStyle.Success)
                );
            }

            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId('view_income_details')
                    .setLabel('📈 Income Details')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('transaction_history')
                    .setLabel('📜 Transaction History')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({
                embeds: [bankEmbed],
                components: [actionRow]
            });

            // Set up button interaction handler
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'collect_income') {
                        await this.handleIncomeCollection(buttonInteraction);
                    } else if (buttonInteraction.customId === 'view_income_details') {
                        await this.showIncomeDetails(buttonInteraction);
                    } else if (buttonInteraction.customId === 'transaction_history') {
                        await this.showTransactionHistory(buttonInteraction);
                    }
                } catch (error) {
                    console.log('Button interaction error:', error);
                    try {
                        if (!buttonInteraction.replied) {
                            await buttonInteraction.reply({ 
                                content: '❌ An error occurred with the button interaction!', 
                                ephemeral: true 
                            });
                        }
                    } catch (followUpError) {
                        console.log('Failed to send follow-up:', followUpError);
                    }
                }
            });

            collector.on('end', () => {
                // Disable buttons after timeout
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.error('Error in bank command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Bank Error')
                .setDescription('Failed to load bank information. Please try again.')
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

    // Handle income collection button
    async handleIncomeCollection(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const username = interaction.user.username;

            const BerryEconomySystem = require('../systems/economy');
            
            // Collect the income
            const collectionResult = await BerryEconomySystem.collectIncome(userId, username);

            if (collectionResult.collected > 0) {
                const successEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('💰 Income Collected!')
                    .setDescription(`Successfully collected your accumulated berry income!`)
                    .addFields([
                        {
                            name: '💵 Amount Collected',
                            value: `${collectionResult.collected.toLocaleString()} berries`,
                            inline: true
                        },
                        {
                            name: '💳 New Balance',
                            value: `${collectionResult.newBalance.toLocaleString()} berries`,
                            inline: true
                        },
                        {
                            name: '⏰ Collection Period',
                            value: `${collectionResult.hoursCollected} hours`,
                            inline: true
                        }
                    ])
                    .setFooter({ text: 'Next collection available in 1 hour' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [successEmbed] });

                // Update the main bank display
                setTimeout(async () => {
                    try {
                        const originalInteraction = interaction.message.interaction;
                        if (originalInteraction) {
                            await this.execute(originalInteraction);
                        }
                    } catch (error) {
                        console.log('Failed to update main display:', error);
                    }
                }, 2000);

            } else {
                const failEmbed = new EmbedBuilder()
                    .setColor(0xFF9900)
                    .setTitle('⏰ No Income Available')
                    .setDescription('You need to wait at least 1 hour between income collections.')
                    .addFields({
                        name: '📈 Current Hourly Rate',
                        value: `${collectionResult.hourlyRate.toLocaleString()} berries/hour`,
                        inline: true
                    });

                if (collectionResult.timeUntilNext) {
                    failEmbed.addFields({
                        name: '⏳ Next Collection',
                        value: `${collectionResult.timeUntilNext} minutes`,
                        inline: true
                    });
                }

                await interaction.editReply({ embeds: [failEmbed] });
            }

        } catch (error) {
            console.error('Error collecting income:', error);
            await interaction.editReply({ 
                content: '❌ Failed to collect income. Please try again later!' 
            });
        }
    },

    // Show detailed income breakdown
    async showIncomeDetails(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const BerryEconomySystem = require('../systems/economy');

            const totalCP = await BerryEconomySystem.calculateUserTotalCP(userId);
            const hourlyIncome = await BerryEconomySystem.calculateHourlyIncome(userId);
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

            const detailsEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📈 Detailed Income Analysis')
                .setDescription(`Complete breakdown of your berry income generation`)
                .addFields([
                    {
                        name: '💰 Total Hourly Income',
                        value: `**${hourlyIncome.toLocaleString()}** berries/hour`,
                        inline: false
                    },
                    {
                        name: '📊 Income Breakdown',
                        value: incomeBreakdown,
                        inline: false
                    },
                    {
                        name: '🎯 Next Milestone',
                        value: nextMilestone,
                        inline: false
                    },
                    {
                        name: '⚔️ Combat Power Impact',
                        value: `Your ${totalCP.toLocaleString()} CP generates ${cpBonus.toLocaleString()} bonus berries/hour`,
                        inline: false
                    },
                    {
                        name: '📈 Income Rates',
                        value: [
                            `Per Hour: ${hourlyIncome.toLocaleString()} berries`,
                            `Per 10 Minutes: ${Math.floor(hourlyIncome / 6).toLocaleString()} berries`,
                            `Per Day: ${(hourlyIncome * 24).toLocaleString()} berries`,
                            `Per Week: ${(hourlyIncome * 24 * 7).toLocaleString()} berries`
                        ].join('\n'),
                        inline: false
                    }
                ])
                .setFooter({ text: 'Increase your CP to earn more berries!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [detailsEmbed] });

        } catch (error) {
            console.error('Error showing income details:', error);
            await interaction.editReply({ 
                content: '❌ Failed to load income details!' 
            });
        }
    },

    // Show transaction history
    async showTransactionHistory(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const BerryEconomySystem = require('../systems/economy');

            // Get purchase history
            const purchaseHistory = await BerryEconomySystem.getPurchaseHistory(userId, 10);
            const economicStats = await BerryEconomySystem.getUserEconomicStats(userId);

            let historyText = 'No transactions yet';
            if (purchaseHistory.length > 0) {
                historyText = purchaseHistory.map(purchase => {
                    const timeAgo = Math.floor((new Date() - purchase.purchaseTime) / (1000 * 60 * 60 * 24));
                    return `• **${purchase.itemName}**: -${purchase.amount.toLocaleString()} berries (${timeAgo}d ago)`;
                }).join('\n');
            }

            const historyEmbed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setTitle('📜 Transaction History')
                .setDescription('Your recent berry transactions and spending patterns')
                .addFields([
                    {
                        name: '💸 Recent Purchases (Last 10)',
                        value: historyText,
                        inline: false
                    },
                    {
                        name: '📊 Lifetime Statistics',
                        value: [
                            `Total Earned: ${economicStats.totalEarned.toLocaleString()} berries`,
                            `Total Spent: ${economicStats.totalSpent.toLocaleString()} berries`,
                            `Net Worth: ${economicStats.netWorth.toLocaleString()} berries`,
                            `Account Age: ${economicStats.account
