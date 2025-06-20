require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull a One Piece character from the gacha!')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
    try {
        console.log('🔄 Registering slash commands...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log('✅ Successfully registered slash commands!');
        console.log('📝 Commands may take a few minutes to appear in Discord');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

registerCommands();
