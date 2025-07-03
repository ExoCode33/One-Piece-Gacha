const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Debug configuration that can be accessed by other modules
const DEBUG_CONFIG = {
    enabled: false,
    forcedRarity: null
};

function setDebugMode(enabled) {
    DEBUG_CONFIG.enabled = enabled;
    if (!enabled) {
        DEBUG_CONFIG.forcedRarity = null;
    }
    console.log(`🔧 DEBUG MODE: ${enabled ? 'ENABLED' : 'DISABLED'}`);
}

function setForcedRarity(rarity) {
    if (!DEBUG_CONFIG.enabled) {
        console.log(`⚠️ DEBUG MODE is disabled. Enable it first.`);
        return false;
    }
    
    const validRarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
    if (rarity && !validRarities.includes(rarity)) {
        console.log(`❌ Invalid rarity: ${rarity}. Valid options: ${validRarities.join(', ')}`);
        return false;
    }
    
    DEBUG_CONFIG.forcedRarity = rarity;
    console.log(`🎯 FORCED RARITY: ${rarity || 'OFF (random)'}`);
    return true;
}

// Export debug config so other modules can access it
function getDebugConfig() {
    return DEBUG_CONFIG;
}

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
                        ))
        ),

    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const rarity = interaction.options.getString('rarity');

        try {
            if (mode === 'on') {
                setDebugMode(true);
                
                let response = '✅ **Debug Mode Enabled!**\n\n🔧 Debug mode is now active. You can now force specific rarities for testing.\n\n📊 **Debug Features:**\n• Force specific rarities\n• View debug animations\n• Enhanced logging\n• Testing controls';
                
                if (rarity && rarity !== 'off') {
                    const success = setForcedRarity(rarity);
                    if (success) {
                        const rarityEmojis = {
                            common: '⬜',
                            uncommon: '🟩', 
                            rare: '🟦',
                            legendary: '🟨',
                            mythical: '🟥',
                            omnipotent: '🌈'
                        };
                        response += `\n\n🎯 **Forced Rarity Set:** ${rarityEmojis[rarity]} **${rarity.toUpperCase()}**\n*All pulls will now be ${rarity} rarity*`;
                    }
                }
                
                await interaction.reply({ content: response, ephemeral: true });
                
            } else if (mode === 'off') {
                setDebugMode(false);
                await interaction.reply({ 
                    content: '❌ **Debug Mode Disabled!**\n\n🔧 Debug mode is now OFF. All features returned to normal:\n• Random rarity drops\n• Standard animations\n• Normal logging\n• Production mode active', 
                    ephemeral: true 
                });
                
            } else if (mode === 'status') {
                const rarityEmojis = {
                    common: '⬜ Common',
                    uncommon: '🟩 Uncommon',
                    rare: '🟦 Rare',
                    legendary: '🟨 Legendary',
                    mythical: '🟥 Mythical',
                    omnipotent: '🌈 Omnipotent'
                };

                const statusEmbed = new EmbedBuilder()
                    .setTitle('🔧 **Admin Debug Status**')
                    .setColor(DEBUG_CONFIG.enabled ? '#00FF00' : '#FF0000')
                    .addFields(
                        { 
                            name: '🔧 Debug Mode', 
                            value: DEBUG_CONFIG.enabled ? '✅ **ENABLED**' : '❌ **DISABLED**', 
                            inline: true 
                        },
                        { 
                            name: '🎯 Forced Rarity', 
                            value: DEBUG_CONFIG.forcedRarity ? rarityEmojis[DEBUG_CONFIG.forcedRarity] : '🎲 **Random**', 
                            inline: true 
                        },
                        {
                            name: '📊 Debug Features',
                            value: DEBUG_CONFIG.enabled ? 
                                '• Rarity forcing active\n• Debug animations enabled\n• Enhanced logging\n• Test mode controls' :
                                '• Standard operation\n• Random drops\n• Normal animations\n• Production mode',
                            inline: false
                        }
                    )
                    .setFooter({ text: 'Admin Debug System | Use /admin debug on to activate' })
                    .setTimestamp();
                
                await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
            }
            
            // Handle standalone rarity changes
            if (rarity && mode !== 'on') {
                if (!DEBUG_CONFIG.enabled) {
                    await interaction.reply({ 
                        content: '⚠️ **Debug mode must be enabled first!**\n\n🔧 Use `/admin debug on` to activate debug mode before setting rarities.', 
                        ephemeral: true 
                    });
                    return;
                }
                
                if (rarity === 'off') {
                    setForcedRarity(null);
                    await interaction.reply({ 
                        content: '🎲 **Forced rarity disabled!**\n\n🔧 Drops are now random while debug mode remains active.\n\n*Use `/admin debug off` to fully disable debug mode.*', 
                        ephemeral: true 
                    });
                } else {
                    const success = setForcedRarity(rarity);
                    if (success) {
                        const rarityEmojis = {
                            common: '⬜',
                            uncommon: '🟩',
                            rare: '🟦', 
                            legendary: '🟨',
                            mythical: '🟥',
                            omnipotent: '🌈'
                        };
                        await interaction.reply({ 
                            content: `🎯 **Forced rarity updated!**\n\n${rarityEmojis[rarity]} All drops will now be: **${rarity.toUpperCase()}**\n\n*Debug mode remains active. Use \`/pull\` to test!*`, 
                            ephemeral: true 
                        });
                    }
                }
            }
            
        } catch (error) {
            console.error('🚨 Admin Command Error:', error);
            await interaction.reply({ 
                content: '❌ **Admin command failed!**\n\n🔧 An error occurred while processing the admin command. Please try again or contact the bot administrator.', 
                ephemeral: true 
            });
        }
    },

    // Export functions for other modules to use
    getDebugConfig,
    setDebugMode,
    setForcedRarity
};
