const { SlashCommandBuilder } = require('discord.js');

async function execute(interaction) {
    await interaction.reply('It works!');
}

async function handleButtonInteraction(interaction) {
    await interaction.reply('Button pressed!');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!'),
    execute,
    handleButtonInteraction
};
