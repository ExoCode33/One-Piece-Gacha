const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Mock debug config until the animation files are created
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands for bot management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('debug')
                .setDescription('Control debug mode and rarity testing')
                .addStringOption(option =>
                    option.setName('mode')
                        .setDescription('Debug mode control')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Enable Debug Mode', value: 'enable' },
                            { name: 'Disable Debug Mode', value: 'disable' },
                            { name: 'Status', value: 'status' }
                        ))
                .addStringOption(option =>
                    option.setName('rarity')
                        .setDescription('Force a specific rarity (requires debug mode)')
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
            if (mode === 'enable') {
                setDebugMode(true);
                
                let response = '✅ **Debug Mode Enabled!**\n\nDebug mode is now active. You can now force specific rarities for testing.';
                
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
                        response += `\n🎯 **Forced Rarity:** ${rarityEmojis[rarity]} ${rarity.toUpperCase()}`;
                    }
                }
                
                await interaction.reply({ content: response, ephemeral: true });
                
            } else if (mode === 'disable') {
                setDebugMode(false);
                await interaction.reply({ 
                    content: '❌ **Debug Mode Disabled!**\n\nDebug mode is now off. All drops will be random.', 
                    ephemeral: true 
                });
                
            } else if (mode === 'status') {
                const statusEmbed = new EmbedBuilder()
                    .setTitle('🔧 **Debug Status**')
                    .setColor(DEBUG_CONFIG.enabled ? '#00FF00' : '#FF0000')
                    .addFields(
                        { name: '🔧 Debug Mode', value: DEBUG_CONFIG.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
                        { name: '🎯 Forced Rarity', value: DEBUG_CONFIG.forcedRarity ? `${DEBUG_CONFIG.forcedRarity.toUpperCase()}` : 'Random', inline: true }
                    )
                    .setFooter({ text: 'Admin Debug System | Use /admin debug enable to activate' });
                
                await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
            }
            
            // Handle rarity changes when debug is already enabled
            if (rarity && mode === 'enable') {
                // Already handled above
            } else if (rarity) {
                if (!DEBUG_CONFIG.enabled) {
                    await interaction.reply({ 
                        content: '⚠️ **Debug mode must be enabled first!**\n\nUse `/admin debug enable` to activate debug mode.', 
                        ephemeral: true 
                    });
                    return;
                }
                
                if (rarity === 'off') {
                    setForcedRarity(null);
                    await interaction.reply({ 
                        content: '🎲 **Forced rarity disabled!**\n\nDrops are now random while debug mode remains active.', 
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
                            content: `🎯 **Forced rarity set!**\n\nAll drops will now be: ${rarityEmojis[rarity]} **${rarity.toUpperCase()}**`, 
                            ephemeral: true 
                        });
                    }
                }
            }
            
        } catch (error) {
            console.error('🚨 Admin Command Error:', error);
            await interaction.reply({ 
                content: '❌ **Admin command failed!**\n\nAn error occurred while processing the admin command.', 
                ephemeral: true 
            });
        }
    }
};
