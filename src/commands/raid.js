// src/commands/raid.js - Enhanced Raid Command with NPC Options
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const CombatSystem = require('../config/combat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('⚔️ Challenge another pirate or fight an NPC in strategic combat!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('player')
                .setDescription('Challenge another player to PvP combat')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The player you want to challenge')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('npc')
                .setDescription('Fight against an NPC opponent')
                .addStringOption(option =>
                    option.setName('difficulty')
                        .setDescription('Choose NPC difficulty level')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Easy - Monkey D. Tester', value: 'easy' },
                            { name: 'Medium - Vice Admiral', value: 'medium' },
                            { name: 'Hard - Admiral Level', value: 'hard' },
                            { name: 'Extreme - Yonko Level', value: 'extreme' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('quick')
                .setDescription('Quick battle selection menu')
        ),

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();
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

            if (subcommand === 'player') {
                await this.handlePlayerChallenge(interaction);
            } else if (subcommand === 'npc') {
                await this.handleNPCChallenge(interaction);
            } else if (subcommand === 'quick') {
                await this.handleQuickSelection(interaction);
            }

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

    // Handle player vs player challenge
    async handlePlayerChallenge(interaction) {
        const targetUser = interaction.options.getUser('target');
        const userId = interaction.user.id;
        const username = interaction.user.username;

        if (targetUser.bot) {
            return interaction.editReply({
                content: '❌ You cannot challenge bots to combat! Use `/raid npc` to fight NPCs instead.'
            });
        }

        if (targetUser.id === userId) {
            return interaction.editReply({
                content: '❌ You cannot challenge yourself! Use `/raid npc` to fight NPCs or challenge another player.'
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

        // Set up interaction handlers
        this.setupInteractionHandlers(interaction);
    },

    // Handle NPC challenge
    async handleNPCChallenge(interaction) {
        const difficulty = interaction.options.getString('difficulty') || 'easy';
        const userId = interaction.user.id;
        const username = interaction.user.username;

        console.log(`🤖 ${username} is starting strategic NPC combat (${difficulty} difficulty)`);

        const result = await CombatSystem.startNPCCombatWithAnimation(
            userId,
            username,
            interaction,
            difficulty
        );

        if (!result.success) {
            return interaction.editReply({
                content: result.message || '❌ NPC combat failed to start.'
            });
        }

        // Set up interaction handlers
        this.setupInteractionHandlers(interaction);
    },

    // Handle quick selection menu
    async handleQuickSelection(interaction) {
        const quickEmbed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('⚔️ Quick Battle Selection')
            .setDescription('Choose your battle type!')
            .addFields([
                {
                    name: '👥 Player vs Player',
                    value: 'Challenge another player to strategic combat',
                    inline: true
                },
                {
                    name: '🤖 NPC Battles',
                    value: 'Fight against AI opponents of various difficulties',
                    inline: true
                },
                {
                    name: '⚡ Quick Stats',
                    value: 'View your combat power and battle statistics',
                    inline: true
                }
            ])
            .setFooter({ text: 'Select an option below to continue' })
            .setTimestamp();

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('select_pvp_target')
                    .setLabel('👥 Challenge Player')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('select_npc_battle')
                    .setLabel('🤖 Fight NPC')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('view_combat_stats')
                    .setLabel('📊 Combat Stats')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({
            embeds: [quickEmbed],
            components: [actionRow]
        });

        // Set up interaction handlers
        this.setupInteractionHandlers(interaction);
    },

    // Set up button and select menu interaction handlers
    setupInteractionHandlers(interaction) {
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
                            flags: 64 // Use flags instead of ephemeral
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
    },

    // Handle fruit selection from dropdown menu
    async handleFruitSelection(interaction) {
        try {
            const { customId, values } = interaction;
            
            // Parse the custom ID to get battle type and ID
            const idParts = customId.split('_');
            const battleType = idParts.slice(2, -1).join('_');
            const battleId = idParts[idParts.length - 1];

            console.log(`🎯 Processing fruit selection: ${battleType}, battleId: ${battleId}, selected: ${values.length} fruits`);

            // Use flags instead of ephemeral
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ flags: 64 }); // 64 = ephemeral flag
            }

            // Process the selection through the combat system
            await CombatSystem.processFruitSelection(interaction, values, battleType, battleId);

        } catch (error) {
            console.error('Error handling fruit selection:', error);
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ 
                        content: '❌ Error processing fruit selection! Please try again.',
                        flags: 64
                    });
                } else if (interaction.deferred) {
                    await interaction.editReply({ 
                        content: '❌ Error processing fruit selection! Please try again.'
                    });
                }
            } catch (replyError) {
                console.error('Failed to send selection error reply:', replyError);
            }
        }
    },

    // Handle button interactions (post-battle actions and quick menu)
    async handleButtonInteraction(buttonInteraction, originalInteraction) {
        const { customId, user } = buttonInteraction;

        try {
            switch (customId) {
                case 'select_pvp_target':
                    await this.showPlayerSelectionMenu(buttonInteraction);
                    break;

                case 'select_npc_battle':
                    await this.showNPCSelectionMenu(buttonInteraction);
                    break;

                case 'view_combat_stats':
                    await this.showCombatStats(buttonInteraction);
                    break;

                case 'battle_again':
                    await buttonInteraction.reply({
                        content: '⚔️ Use `/raid quick` to start a new strategic battle!',
                        flags: 64
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
                        content: '🤖 Use `/raid npc` to fight another NPC!',
                        flags: 64
                    });
                    break;

                default:
                    await buttonInteraction.reply({
                        content: '❓ Unknown button action!',
                        flags: 64
                    });
                    break;
            }
        } catch (error) {
            console.error('Button interaction error:', error);
            try {
                if (!buttonInteraction.replied) {
                    await buttonInteraction.reply({
                        content: '❌ Error processing button interaction!',
                        flags: 64
                    });
                }
            } catch (replyError) {
                console.error('Failed to send button error reply:', replyError);
            }
        }
    },

    // Show player selection menu
    async showPlayerSelectionMenu(interaction) {
        await interaction.deferReply({ flags: 64 });

        const embed = new EmbedBuilder()
            .setColor(0xFF1493)
            .setTitle('👥 Challenge a Player')
            .setDescription('To challenge a player to PvP combat, use:\n\n`/raid player @username`\n\nExample: `/raid player @shankspk`')
            .addFields([
                {
                    name: '⚔️ PvP Combat Features',
                    value: '• Strategic fruit selection\n• Turn-based combat\n• Elemental advantages\n• Public battles for spectators',
                    inline: false
                },
                {
                    name: '🏆 Rewards',
                    value: '• Combat experience\n• Berry rewards for winners\n• Bragging rights!',
                    inline: false
                }
            ])
            .setFooter({ text: 'Use the command above to challenge someone!' });

        await interaction.editReply({ embeds: [embed] });
    },

    // Show NPC selection menu
    async showNPCSelectionMenu(interaction) {
        await interaction.deferReply({ flags: 64 });

        const npcEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🤖 NPC Battle Selection')
            .setDescription('Choose your NPC opponent!')
            .addFields([
                {
                    name: '🟢 Easy - Monkey D. Tester',
                    value: 'Perfect for beginners\n• Balanced combat power\n• Good for learning mechanics',
                    inline: true
                },
                {
                    name: '🟡 Medium - Vice Admiral',
                    value: 'Moderate challenge\n• Higher combat power\n• Strategic AI behavior',
                    inline: true
                },
                {
                    name: '🟠 Hard - Admiral Level',
                    value: 'Serious challenge\n• High combat power\n• Advanced strategies',
                    inline: true
                },
                {
                    name: '🔴 Extreme - Yonko Level',
                    value: 'Ultimate challenge\n• Maximum combat power\n• Elite battle tactics',
                    inline: true
                }
            ])
            .setFooter({ text: 'Use /raid npc difficulty:[level] to start!' });

        const npcRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start_easy_npc')
                    .setLabel('🟢 Easy Battle')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('start_medium_npc')
                    .setLabel('🟡 Medium Battle')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('start_hard_npc')
                    .setLabel('🟠 Hard Battle')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('start_extreme_npc')
                    .setLabel('🔴 Extreme Battle')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.editReply({ 
            embeds: [npcEmbed], 
            components: [npcRow] 
        });

        // Handle NPC difficulty selection
        const npcFilter = (i) => i.user.id === interaction.user.id && i.customId.startsWith('start_');
        const npcCollector = interaction.channel.createMessageComponentCollector({ 
            filter: npcFilter, 
            time: 300000 
        });

        npcCollector.on('collect', async (npcInteraction) => {
            try {
                const difficulty = npcInteraction.customId.replace('start_', '').replace('_npc', '');
                
                await npcInteraction.deferReply();
                
                console.log(`🤖 ${interaction.user.username} starting ${difficulty} NPC battle`);

                const result = await CombatSystem.startNPCCombatWithAnimation(
                    interaction.user.id,
                    interaction.user.username,
                    npcInteraction,
                    difficulty
                );

                if (!result.success) {
                    await npcInteraction.editReply({
                        content: result.message || '❌ NPC combat failed to start.'
                    });
                }
            } catch (error) {
                console.error('NPC selection error:', error);
                await npcInteraction.reply({
                    content: '❌ Error starting NPC battle!',
                    flags: 64
                });
            }
        });
    },

    // Show combat stats
    async showCombatStats(interaction) {
        try {
            await interaction.deferReply({ flags: 64 });

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
            console.error('Error showing combat stats:', error);
            await interaction.editReply({ 
                content: '❌ Failed to load combat statistics!' 
            });
        }
    },

    async showPowerStats(interaction) {
        try {
            await interaction.deferReply({ flags: 64 });

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

    async showBattleStats(interaction) {
        try {
            await interaction.deferReply({ flags: 64 });

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

    async showCollection(interaction) {
        try {
            await interaction.deferReply({ flags: 64 });

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
