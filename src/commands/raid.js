// src/commands/raid.js - Strategic Raid Command with Fruit Selection
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CombatSystem = require('../config/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('🏴‍☠️ Challenge an NPC or another pirate to strategic combat!')
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

                console.log(`⚔️ ${username} is challenging ${targetUser.username} to strategic PvP combat`);

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

            } else {
                // NPC Combat
                console.log(`🤖 ${username} is starting strategic NPC combat`);

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
            }

            // Set up button and select menu interaction handlers
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 600000 // 10 minutes for strategic selection
            });

            collector.on('collect', async (componentInteraction) => {
                try {
                    if (componentInteraction.isStringSelectMenu()) {
                        await this.handleFruitSelection(componentInteraction);
                    } else if (componentInteraction.isButton()) {
                        await this.handleButtonInteraction(componentInteraction, interaction);
                    }
                } catch (error) {
                    console.error('Component interaction error:', error);
                    try {
                        if (!componentInteraction.replied && !componentInteraction.deferred) {
                            await componentInteraction.reply({ 
                                content: '❌ An error occurred with the interaction!', 
                                ephemeral: true 
                            });
                        }
                    } catch (replyError) {
                        console.error('Failed to send error reply:', replyError);
                    }
                }
            });

            collector.on('end', () => {
                // Disable components after timeout
                interaction.editReply({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.error('Raid command error:', error);
            
            try {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚔️ Strategic Combat System Error')
                    .setDescription('Something went wrong during combat initialization!')
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
                    .setFooter({ text: 'Strategic Combat System' })
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

    // Handle fruit selection from dropdown menu
    async handleFruitSelection(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const { customId, values } = interaction;
            
            // Parse the custom ID to get battle type and ID
            const idParts = customId.split('_');
            const battleType = idParts.slice(2, -1).join('_'); // fruit_select_[battleType]_[battleId]
            const battleId = idParts[idParts.length - 1];

            console.log(`🎯 Processing fruit selection: ${battleType}, battleId: ${battleId}, selected: ${values.length} fruits`);

            // Process the selection through the combat system
            await CombatSystem.processFruitSelection(interaction, values, battleType, battleId);

            // Confirm selection to user
            await interaction.editReply({
                content: `✅ Selected ${values.length} Devil Fruit${values.length > 1 ? 's' : ''} for battle!`,
            });

        } catch (error) {
            console.error('Error handling fruit selection:', error);
            try {
                await interaction.editReply({ 
                    content: '❌ Error processing fruit selection! Please try again.' 
                });
            } catch (replyError) {
                console.error('Failed to send selection error reply:', replyError);
            }
        }
    },

    // Handle button interactions (post-battle actions)
    async handleButtonInteraction(buttonInteraction, originalInteraction) {
        const { customId, user } = buttonInteraction;

        try {
            switch (customId) {
                case 'battle_again':
                    await buttonInteraction.reply({
                        content: '⚔️ Use `/raid` to start a new strategic battle!',
                        ephemeral: true
                    });
                    break;

                case 'view_power':
                    await this.showPowerStats(buttonInteraction);
                    break;

                case 'view_stats':
                    await this.showBattleStats(buttonInteraction);
                    break;

                case 'view_collection':
                    await this.showCollection(buttonInteraction);
                    break;

                case 'fight_npc_again':
                    await buttonInteraction.reply({
                        content: '🤖 Use `/raid` (without target) to fight another NPC!',
                        ephemeral: true
                    });
                    break;

                default:
                    await buttonInteraction.reply({
                        content: '❓ Unknown button action!',
                        ephemeral: true
                    });
                    break;
            }
        } catch (error) {
            console.error('Button interaction error:', error);
            try {
                if (!buttonInteraction.replied) {
                    await buttonInteraction.reply({
                        content: '❌ Error processing button interaction!',
                        ephemeral: true
                    });
                }
            } catch (replyError) {
                console.error('Failed to send button error reply:', replyError);
            }
        }
    },

    async showBattleStats(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const battleStats = await CombatSystem.getUserBattleStats(userId);
            
            const statsEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📊 Your Strategic Battle Statistics')
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
                    },
                    {
                        name: '⚡ Combat System',
                        value: 'Strategic turn-based combat with elemental advantages',
                        inline: false
                    }
                ])
                .setFooter({ text: 'Master the elements to dominate in battle!' })
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
            let elementalBreakdown = 'No fruits collected yet';
            
            try {
                const DatabaseManager = require('../database/manager');
                const userFruits = await DatabaseManager.getUserFruits(userId);
                fruitCount = userFruits.length;
                
                // Calculate elemental breakdown
                if (fruitCount > 0) {
                    const elements = {};
                    const { DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
                    
                    userFruits.forEach(fruit => {
                        const element = DEVIL_FRUIT_ELEMENTS[fruit.fruit_id] || 'neutral';
                        const elementName = CombatSystem.getElementDisplayName ? 
                            CombatSystem.getElementDisplayName(element).split(' ')[0] : 
                            element;
                        elements[elementName] = (elements[elementName] || 0) + 1;
                    });
                    
                    elementalBreakdown = Object.entries(elements)
                        .slice(0, 5) // Top 5 elements
                        .map(([element, count]) => `${element}: ${count}`)
                        .join(' • ') || 'Mixed elements';
                }
            } catch (error) {
                console.warn('Could not get detailed fruit info:', error.message);
            }

            const powerEmbed = new EmbedBuilder()
                .setColor(0xF39C12)
                .setTitle('💪 Your Strategic Combat Power')
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
                        name: '⚡ Elemental Distribution',
                        value: elementalBreakdown,
                        inline: false
                    },
                    { 
                        name: '💡 Strategic Tips', 
                        value: '• Collect diverse elements for tactical advantage\n• Duplicate fruits give +1% CP bonus each\n• Use elemental counters in battle', 
                        inline: false 
                    }
                ])
                .setFooter({ text: 'Use /pull to hunt for more Devil Fruits and /raid to test your power!' })
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
        if (totalCP >= 15000) return '👑 Pirate Emperor';
        if (totalCP >= 10000) return '🌟 Yonko';
        if (totalCP >= 7500) return '⭐ Admiral';
        if (totalCP >= 5000) return '🎖️ Vice Admiral';
        if (totalCP >= 2500) return '🥇 Captain';
        if (totalCP >= 1000) return '🥈 Lieutenant';
        if (totalCP >= 500) return '🥉 Ensign';
        return '⚪ Recruit';
    },

    getPowerRank(totalCP) {
        if (totalCP >= 20000) return '🌟 **Legendary Warrior**';
        if (totalCP >= 15000) return '👑 **Emperor-Level Fighter**';
        if (totalCP >= 10000) return '⭐ **Admiral-Class Combatant**';
        if (totalCP >= 7500) return '🎖️ **Elite Vice Admiral**';
        if (totalCP >= 5000) return '🥇 **Skilled Captain**';
        if (totalCP >= 2500) return '🥈 **Competent Officer**';
        if (totalCP >= 1000) return '🥉 **Rising Fighter**';
        if (totalCP >= 500) return '⚪ **Rookie Pirate**';
        return '🌱 **Aspiring Warrior**';
    }
};
