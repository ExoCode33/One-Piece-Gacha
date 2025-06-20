const { SlashCommandBuilder } = require('discord.js');
const { createGachaAnimation } = require('../animations/gacha');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull a One Piece character from the gacha!'),
    
    async execute(interaction) {
        await interaction.deferReply();
        await createGachaAnimation(interaction);
    },
};

// Script to register this command (run this file directly)
if (require.main === module) {
    const { REST, Routes } = require('discord.js');
    require('dotenv').config();
    
    const commands = [
        new SlashCommandBuilder()
            .setName('pull')
            .setDescription('Pull a One Piece character from the gacha!')
    ];
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    (async () => {
        try {
            console.log('🔄 Registering slash commands...');
            
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            
            console.log('✅ Successfully registered slash commands!');
        } catch (error) {
            console.error('❌ Error registering commands:', error);
        }
    })();
}
