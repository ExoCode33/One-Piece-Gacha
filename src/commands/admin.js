const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { setDebugMode, setForcedRarity, DEBUG_CONFIG } = require('../animations/gacha');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands for bot management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('debug')
                .setDescription('Debug mode and rarity testing controls')
                .addStringOption(option =>
                    option.setName('mode')
                        .setDescription('Debug mode setting')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Enable Debug Mode', value: 'on' },
                            { name: 'Disable Debug Mode', value: 'off' },
                            { name: 'Status', value: 'status' }
                        ))
                .addStringOption(option =>
                    option.setName('rarity')
                        .setDescription('Force specific rarity (requires debug mode enabled)')
                        .setRequired(false)
                        .addChoices(
                            { name: '⬜ Common', value: 'common' },
                            { name: '🟩 Uncommon', value: 'uncommon' },
                            { name: '🟦 Rare', value: 'rare' },
                            { name: '🟨 Legendary', value: 'legendary' },
                            { name: '🟥 Mythical', value: 'mythical' },
                            { name: '🌈 Omnipotent', value: 'omnipotent' },
                            { name: '🎲 Random (Off)', value: 'off' }
                        ))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand !== 'debug') {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ **Unknown Subcommand**')
                .setDescription('Available subcommands: `debug`')
                .setColor('#FF0000');
            
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        try {
            const mode = interaction.options.getString('mode');
            const rarity = interaction.options.getString('rarity');

            // Handle mode changes first
            if (mode === 'on') {
                setDebugMode(true);
                
                const enableEmbed = new EmbedBuilder()
                    .setTitle('🔧 **Debug Mode Enabled**')
                    .setDescription('Debug features are now **ACTIVE**')
                    .setColor('#00FF00')
                    .addFields(
                        { name: 'Status', value: '✅ Enabled', inline: true },
                        { name: 'Rarity Control', value: 'Use the rarity option to force specific drops', inline: true },
                        { name: 'Current Setting', value: DEBUG_CONFIG.forcedRarity || 'Random', inline: true }
                    )
                    .setFooter({ text: 'Use /admin debug with rarity option to force specific rarities' });

                await interaction.reply({ embeds: [enableEmbed], ephemeral: true });

            } else if (mode === 'off') {
                setDebugMode(false);
                
                const disableEmbed = new EmbedBuilder()
                    .setTitle('🔧 **Debug Mode Disabled**')
                    .setDescription('All debug features are now **INACTIVE**')
                    .setColor('#FF0000')
                    .addFields(
                        { name: 'Status', value: '❌ Disabled', inline: true },
                        { name: 'Rarity Control', value: 'Inactive', inline: true },
                        { name: 'Drop Mode', value: 'Random (Normal)', inline: true }
                    )
                    .setFooter({ text: 'All Devil Fruit drops are now random again' });

                await interaction.reply({ embeds: [disableEmbed], ephemeral: true });

            } else if (mode === 'status') {
                const statusEmbed = new EmbedBuilder()
                    .setTitle('🔧 **Debug Status**')
                    .setColor(DEBUG_CONFIG.enabled ? '#00FF00' : '#95A5A6')
                    .addFields(
                        { name: 'Debug Mode', value: DEBUG_CONFIG.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
                        { name: 'Forced Rarity', value: DEBUG_CONFIG.forcedRarity ? `${DEBUG_CONFIG.forcedRarity}` : 'None (Random)', inline: true },
                        { name: 'Available Controls', value: DEBUG_CONFIG.enabled ? 'Rarity forcing active' : 'Enable debug mode first', inline: false }
                    );

                if (DEBUG_CONFIG.forcedRarity) {
                    const rarityConfig = require('../data/devilfruit').DevilFruitDatabase.getRarityConfig(DEBUG_CONFIG.forcedRarity);
                    statusEmbed.setDescription(`Currently forcing **${rarityConfig.name}** ${rarityConfig.emoji} drops`);
                    statusEmbed.setColor(rarityConfig.color);
                } else if (DEBUG_CONFIG.enabled) {
                    statusEmbed.setDescription('Debug mode enabled - drops are random');
                } else {
                    statusEmbed.setDescription('Debug mode disabled - normal operation');
                }

                await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
            }

            // Handle rarity setting if provided
            if (rarity) {
                if (!DEBUG_CONFIG.enabled) {
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('⚠️ **Debug Mode Required**')
                        .setDescription('Enable debug mode first with `/admin debug on`')
                        .setColor('#FF9900')
                        .addFields(
                            { name: 'Current Status', value: 'Debug mode disabled', inline: true },
                            { name: 'Required Action', value: 'Enable debug mode first', inline: true }
                        );
                    
                    return await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                }

                if (rarity === 'off') {
                    setForcedRarity(null);
                    
                    const randomEmbed = new EmbedBuilder()
                        .setTitle('🎲 **Random Mode Enabled**')
                        .setDescription('Devil Fruit drops are now **random** again')
                        .setColor('#95A5A6')
                        .addFields(
                            { name: 'Drop Mode', value: '🎲 Random', inline: true },
                            { name: 'Debug Status', value: '✅ Enabled', inline: true },
                            { name: 'Rarity Control', value: 'Off', inline: true }
                        )
                        .setFooter({ text: 'Normal drop rates restored' });
                    
                    await interaction.followUp({ embeds: [randomEmbed], ephemeral: true });
                } else {
                    const success = setForcedRarity(rarity);
                    
                    if (success) {
                        const rarityConfig = require('../data/devilfruit').DevilFruitDatabase.getRarityConfig(rarity);
                        
                        const rarityEmbed = new EmbedBuilder()
                            .setTitle(`${rarityConfig.emoji} **Forcing ${rarityConfig.name} Drops**`)
                            .setDescription(`All Devil Fruit drops will now be **${rarityConfig.name}** rarity`)
                            .setColor(rarityConfig.color)
                            .addFields(
                                { name: 'Forced Rarity', value: `${rarityConfig.emoji} ${rarityConfig.name}`, inline: true },
                                { name: 'Drop Rate', value: `100% (was ${rarityConfig.chance}%)`, inline: true },
                                { name: 'Debug Mode', value: '✅ Active', inline: true }
                            )
                            .setFooter({ text: 'Use rarity "Random (Off)" to return to normal drops' });

                        await interaction.followUp({ embeds: [rarityEmbed], ephemeral: true });
                    } else {
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('❌ **Failed to Set Rarity**')
                            .setDescription('Invalid rarity specified')
                            .setColor('#FF0000');
                        
                        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                    }
                }
            }

        } catch (error) {
            console.error('Admin debug command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ **Admin Command Error**')
                .setDescription('Something went wrong with the admin command')
                .setColor('#FF0000')
                .addFields(
                    { name: 'Error', value: 'Check console for details', inline: true },
                    { name: 'Command', value: '/admin debug', inline: true }
                )
                .setFooter({ text: 'Contact bot administrator' });
            
            try {
                if (interaction.replied) {
                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};
