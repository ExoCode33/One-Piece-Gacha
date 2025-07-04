const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { setDebugMode, setForcedRarity, getDebugStatus } = require('../animations/engine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gacha-admin')
        .setDescription('Devil Fruit Gacha admin commands for debugging and testing')
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
                            { name: '🟫 Common', value: 'common' },
                            { name: '🟩 Uncommon', value: 'uncommon' },
                            { name: '🟦 Rare', value: 'rare' },
                            { name: '🟨 Legendary', value: 'legendary' },
                            { name: '🟥 Mythical', value: 'mythical' },
                            { name: '🌈 Divine', value: 'omnipotent' },
                            { name: '🎲 Random (Off)', value: 'off' }
                        ))
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'debug') {
            const mode = interaction.options.getString('mode');
            const rarity = interaction.options.getString('rarity');

            try {
                if (mode === 'enable') {
                    const enabled = setDebugMode(true);
                    
                    let response = '✅ **Debug Mode Enabled!**\n\n🔧 Debug mode is now active. You can now force specific rarities for testing animations and drops.';
                    
                    if (rarity && rarity !== 'off') {
                        const success = setForcedRarity(rarity);
                        if (success) {
                            const rarityEmojis = {
                                common: '🟫',
                                uncommon: '🟩', 
                                rare: '🟦',
                                legendary: '🟨',
                                mythical: '🟥',
                                omnipotent: '🌈'
                            };
                            response += `\n\n🎯 **Forced Rarity:** ${rarityEmojis[rarity]} **${rarity.toUpperCase()}**`;
                            response += `\n\n*All Devil Fruit pulls will now be ${rarity} rarity (but random fruits within that rarity). Use /pull to test the animation!*`;
                        }
                    } else {
                        response += '\n\n*Use the rarity option to force specific rarities for testing, or use /pull for random drops while in debug mode.*';
                    }
                    
                    await interaction.reply({ content: response, ephemeral: true });
                    
                } else if (mode === 'disable') {
                    setDebugMode(false);
                    await interaction.reply({ 
                        content: '❌ **Debug Mode Disabled!**\n\n🎲 Debug mode is now off. All Devil Fruit drops will be completely random with normal rarity chances.', 
                        ephemeral: true 
                    });
                    
                } else if (mode === 'status') {
                    const status = getDebugStatus();
                    const statusEmbed = new EmbedBuilder()
                        .setTitle('🔧 **Debug Status Report**')
                        .setColor(status.enabled ? '#00FF00' : '#FF0000')
                        .addFields(
                            { 
                                name: '🔧 Debug Mode', 
                                value: status.enabled ? '✅ **ENABLED**' : '❌ **DISABLED**', 
                                inline: true 
                            },
                            { 
                                name: '🎯 Forced Rarity', 
                                value: status.forcedRarity ? `🎯 **${status.forcedRarity.toUpperCase()}**` : '🎲 **RANDOM**', 
                                inline: true 
                            },
                            { 
                                name: '📊 Current Behavior', 
                                value: status.enabled 
                                    ? (status.forcedRarity 
                                        ? `All pulls will be **${status.forcedRarity}** rarity` 
                                        : 'All pulls are random but debug logging is active')
                                    : 'Normal random drops with standard rarity chances',
                                inline: false 
                            }
                        )
                        .setFooter({ text: 'Admin Debug System | Use /gacha-admin debug enable to activate testing mode' });
                    
                    await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
                }
                
                // Handle rarity changes when debug is already enabled
                if (rarity && mode !== 'enable') {
                    const status = getDebugStatus();
                    
                    if (!status.enabled) {
                        await interaction.reply({ 
                            content: '⚠️ **Debug mode must be enabled first!**\n\nUse `/gacha-admin debug enable` to activate debug mode before setting rarities.', 
                            ephemeral: true 
                        });
                        return;
                    }
                    
                    if (rarity === 'off') {
                        setForcedRarity(null);
                        await interaction.reply({ 
                            content: '🎲 **Forced rarity disabled!**\n\nDrops are now random while debug mode remains active. Debug logging will continue.', 
                            ephemeral: true 
                        });
                    } else {
                        const success = setForcedRarity(rarity);
                        if (success) {
                            const rarityEmojis = {
                                common: '🟫',
                                uncommon: '🟩',
                                rare: '🟦', 
                                legendary: '🟨',
                                mythical: '🟥',
                                omnipotent: '🌈'
                            };
                            await interaction.reply({ 
                                content: `🎯 **Forced rarity set!**\n\nAll Devil Fruit pulls will now be: ${rarityEmojis[rarity]} **${rarity.toUpperCase()}**\n\n*Use /pull to test the animation with ${rarity} rarity fruits!*`, 
                                ephemeral: true 
                            });
                        }
                    }
                }
                
            } catch (error) {
                console.error('🚨 Admin Command Error:', error);
                await interaction.reply({ 
                    content: '❌ **Admin command failed!**\n\nAn error occurred while processing the admin command. Please try again.', 
                    ephemeral: true 
                });
            }
        }
    }
};
