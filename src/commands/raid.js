const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Fight the test NPC!'),

    async execute(interaction) {
        try {
            await interaction.reply({
                content: '⚔️ **Test NPC Battle**\n\n🎲 Rolling dice...\n\n' + 
                        (Math.random() > 0.5 ? 
                            '🏆 **VICTORY!** You defeated the test NPC!\n🫐 +' + Math.floor(Math.random() * 1000 + 500) + ' berries!' :
                            '💀 **DEFEAT!** The NPC was too strong!\nTry again to test your luck!'
                        )
            });
        } catch (error) {
            console.error('Raid error:', error);
            await interaction.reply({
                content: '❌ Error occurred!',
                ephemeral: true
            });
        }
    }
};
