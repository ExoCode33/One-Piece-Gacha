const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { setDebugMode, isDebugMode, forceRarity } = require('../animations/engine');
const dbManager = require('../database/manager'); // Fixed import path

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gacha-admin')
        .setDescription('🛠️ Admin controls for the gacha system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('debug')
                .setDescription('Control debug mode')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('Debug action')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Enable', value: 'enable' },
                            { name: 'Disable', value: 'disable' },
                            { name: 'Status', value: 'status' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('force-rarity')
                .setDescription('Force a specific rarity for testing')
                .addStringOption(option =>
                    option.setName('rarity')
                        .setDescription('Rarity to force')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Common', value: 'Common' },
                            { name: 'Uncommon', value: 'Uncommon' },
                            { name: 'Rare', value: 'Rare' },
                            { name: 'Epic', value: 'Epic' },
                            { name: 'Legendary', value: 'Legendary' },
                            { name: 'Mythical', value: 'Mythical' },
                            { name: 'Disable', value: 'disable' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('View server statistics'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user-stats')
                .setDescription('View specific user statistics')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to check')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cleanup')
                .setDescription('Clean up expired data')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'debug':
                    await handleDebugCommand(interaction);
                    break;
                case 'force-rarity':
                    await handleForceRarityCommand(interaction);
                    break;
                case 'stats':
                    await handleStatsCommand(interaction);
                    break;
                case 'user-stats':
                    await handleUserStatsCommand(interaction);
                    break;
                case 'cleanup':
                    await handleCleanupCommand(interaction);
                    break;
                default:
                    await interaction.reply({
                        content: '❌ Unknown subcommand!',
                        ephemeral: true
                    });
            }
        } catch (error) {
            console.error('❌ Admin command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Admin Command Error')
                .setDescription('An error occurred while executing the admin command.')
                .setFooter({ text: 'Check console for details' });
            
            if (interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};

async function handleDebugCommand(interaction) {
    const action = interaction.options.getString('action');
    
    switch (action) {
        case 'enable':
            setDebugMode(true);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ Debug Mode Enabled')
                    .setDescription('Debug mode is now **enabled**\n\n**Debug Features:**\n• No cooldowns\n• Enhanced logging\n• Force rarity testing')
                    .setFooter({ text: 'Remember to disable debug mode in production!' })
                ]
            });
            break;
            
        case 'disable':
            setDebugMode(false);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF6B6B')
                    .setTitle('❌ Debug Mode Disabled')
                    .setDescription('Debug mode is now **disabled**\n\nNormal operation restored.')
                    .setFooter({ text: 'Production mode active' })
                ]
            });
            break;
            
        case 'status':
            const isDebug = isDebugMode();
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(isDebug ? '#00FF00' : '#95A5A6')
                    .setTitle('🔍 Debug Status')
                    .setDescription(`Debug mode is currently **${isDebug ? 'ENABLED' : 'DISABLED'}**`)
                    .addFields(
                        { name: 'Cooldowns', value: isDebug ? 'Disabled' : 'Enabled', inline: true },
                        { name: 'Enhanced Logging', value: isDebug ? 'Active' : 'Inactive', inline: true },
                        { name: 'Force Rarity', value: isDebug ? 'Available' : 'Unavailable', inline: true }
                    )
                    .setFooter({ text: isDebug ? 'Debug mode is active' : 'Production mode active' })
                ]
            });
            break;
    }
}

async function handleForceRarityCommand(interaction) {
    const rarity = interaction.options.getString('rarity');
    
    if (rarity === 'disable') {
        forceRarity(null);
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#95A5A6')
                .setTitle('🎯 Force Rarity Disabled')
                .setDescription('Rarity forcing is now **disabled**\n\nNormal rarity distribution restored.')
                .setFooter({ text: 'RNG is back to normal' })
            ]
        });
    } else {
        forceRarity(rarity);
        
        const rarityEmojis = {
            'Common': '⚪',
            'Uncommon': '🔵',
            'Rare': '🟣',
            'Epic': '🔴',
            'Legendary': '🟡',
            'Mythical': '🌟'
        };
        
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#FF9500')
                .setTitle('🎯 Force Rarity Enabled')
                .setDescription(`All pulls will now be **${rarityEmojis[rarity]} ${rarity}** rarity until disabled.`)
                .addFields(
                    { name: '⚠️ Warning', value: 'This is for testing purposes only!\nRemember to disable before production use.', inline: false }
                )
                .setFooter({ text: `Forcing ${rarity} rarity` })
            ]
        });
    }
}

async function handleStatsCommand(interaction) {
    try {
        const stats = await dbManager.getServerStats();
        const topCollectors = await dbManager.getTopCollectors(5);
        const topByPower = await dbManager.getTopByPower(5);
        
        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('📊 Server Statistics')
            .setDescription('Current server statistics for the Devil Fruit gacha system')
            .addFields(
                { name: '👥 Total Users', value: stats.totalUsers.toString(), inline: true },
                { name: '🍎 Total Fruits', value: stats.totalFruits.toString(), inline: true },
                { name: '⚔️ Total Battles', value: stats.totalBattles.toString(), inline: true }
            )
            .setFooter({ text: 'Statistics updated in real-time' })
            .setTimestamp();
        
        // Add top collectors
        if (topCollectors.length > 0) {
            let collectorList = '';
            topCollectors.forEach((collector, index) => {
                collectorList += `${index + 1}. **${collector.username}** - ${collector.unique_fruits} unique fruits\n`;
            });
            embed.addFields({ name: '🏆 Top Collectors', value: collectorList, inline: false });
        }
        
        // Add top by power
        if (topByPower.length > 0) {
            let powerList = '';
            topByPower.forEach((user, index) => {
                powerList += `${index + 1}. **${user.username}** - Level ${user.level} (${user.total_fruits} fruits)\n`;
            });
            embed.addFields({ name: '💪 Top by Power', value: powerList, inline: false });
        }
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('❌ Stats command error:', error);
        await interaction.reply({
            content: '❌ Failed to retrieve server statistics.',
            ephemeral: true
        });
    }
}

async function handleUserStatsCommand(interaction) {
    try {
        const targetUser = interaction.options.getUser('user');
        const userId = targetUser.id;
        const username = targetUser.username;
        
        // Ensure user exists
        await dbManager.ensureUser(userId, username);
        
        const user = await dbManager.getUser(userId);
        const fruits = await dbManager.getUserFruitsWithDuplicates(userId);
        const rarityStats = await dbManager.getUserRarityStats(userId);
        const typeStats = await dbManager.getUserTypeStats(userId);
        const level = await dbManager.getUserLevel(userId);
        
        const uniqueFruits = [...new Set(fruits.map(f => f.fruit_id))];
        
        const embed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle(`📊 ${username}'s Statistics`)
            .setDescription(`Detailed statistics for ${targetUser.toString()}`)
            .addFields(
                { name: '🎯 Total Hunts', value: user.total_hunts.toString(), inline: true },
                { name: '🍎 Total Fruits', value: fruits.length.toString(), inline: true },
                { name: '✨ Unique Fruits', value: uniqueFruits.length.toString(), inline: true },
                { name: '📈 Discovery Rate', value: `${user.discovery_rate}%`, inline: true },
                { name: '⭐ Level', value: level.toString(), inline: true },
                { name: '📅 Member Since', value: new Date(user.created_at).toLocaleDateString(), inline: true }
            )
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();
        
        // Add rarity breakdown
        if (Object.keys(rarityStats).length > 0) {
            let rarityBreakdown = '';
            Object.entries(rarityStats).forEach(([rarity, count]) => {
                const emoji = {
                    'Common': '⚪',
                    'Uncommon': '🔵',
                    'Rare': '🟣',
                    'Epic': '🔴',
                    'Legendary': '🟡',
                    'Mythical': '🌟'
                }[rarity] || '❓';
                rarityBreakdown += `${emoji} ${rarity}: ${count}\n`;
            });
            embed.addFields({ name: '🎨 Rarity Breakdown', value: rarityBreakdown, inline: true });
        }
        
        // Add type breakdown
        if (Object.keys(typeStats).length > 0) {
            let typeBreakdown = '';
            Object.entries(typeStats).forEach(([type, count]) => {
                typeBreakdown += `${type}: ${count}\n`;
            });
            embed.addFields({ name: '🔥 Type Breakdown', value: typeBreakdown, inline: true });
        }
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('❌ User stats command error:', error);
        await interaction.reply({
            content: '❌ Failed to retrieve user statistics.',
            ephemeral: true
        });
    }
}

async function handleCleanupCommand(interaction) {
    try {
        await dbManager.cleanup();
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Cleanup Complete')
            .setDescription('Database cleanup completed successfully!')
            .addFields(
                { name: '🧹 Tasks Completed', value: '• Expired cooldowns removed\n• Database optimized', inline: false }
            )
            .setFooter({ text: 'System maintenance complete' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('❌ Cleanup command error:', error);
        await interaction.reply({
            content: '❌ Failed to perform cleanup.',
            ephemeral: true
        });
    }
}
