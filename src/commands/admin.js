const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gacha-admin')
        .setDescription('Test Admin Command'),
    async execute(interaction) {
        await interaction.reply({ content: 'Admin works!', ephemeral: true });
    }
};
