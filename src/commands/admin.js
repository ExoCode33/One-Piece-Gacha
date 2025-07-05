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
                            { name: 'Disable Debug Mode', value: 'disable' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('force-rarity')
                .setDescription('Force a specific rarity for testing')
                .addStringOption(option =>
                    option.setName('rarity')
                        .setDescription('Set the rarity')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Common', value: 'common' },
                            { name: 'Uncommon', value: 'uncommon' },
                            { name: 'Rare', value: 'rare' },
                            { name: 'Epic', value: 'epic' },
                            { name: 'Legendary', value: 'legendary' },
                            { name: 'Mythical', value: 'mythical' },
                            { name: 'Omnipotent', value: 'omnipotent' }
                        )
                )
        ),
    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();
            if (subcommand === 'debug') {
                const mode = interaction.options.getString('mode');
                setDebugMode(mode === 'enable');
                await interaction.reply({
                    content: `🛠️ Debug mode has been **${mode === 'enable' ? 'enabled' : 'disabled'}**!`,
                    ephemeral: true
                });
            } else if (subcommand === 'force-rarity') {
                const rarity = interaction.options.getString('rarity');
                setForcedRarity(rarity);
                await interaction.reply({
                    content: `🎯 Forced rarity set to **${rarity.toUpperCase()}**!`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('🚨 Admin Command Error:', error);
            await interaction.reply({
                content: '❌ **Admin command failed!**\n\nAn error occurred while processing the admin command. Please try again.',
                ephemeral: true
            });
        }
    }
};
