const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gacha-admin')
        .setDescription('Devil Fruit Gacha admin commands for debugging and testing'),

    async execute(interaction) {
        await interaction.reply({ content: '🔧 Admin command is working! Full version coming soon...', ephemeral: true });
    }
};
