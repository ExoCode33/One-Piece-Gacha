const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!'),

    async execute(interaction) {
        await interaction.reply('🍈 Pull command is working! Full version coming soon...');
    }
};
