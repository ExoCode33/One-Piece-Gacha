console.log('🔧 Loading combat system...');

const RaidAnimation = require('../animations/raid');

class CombatSystem {
    constructor() {
        console.log('🔧 Combat System initialized');
    }

    async startNPCCombatWithAnimation(userId, username, interaction) {
        console.log(`🤖 Starting NPC combat for ${username}`);
        
        try {
            // Use the raid animation
            await RaidAnimation.playQuickAnimation(interaction, 'combat');
            
            // Simple battle logic
            const victory = Math.random() > 0.4; // 60% win chance
            const berryReward = victory ? Math.floor(500 + Math.random() * 1000) : 0;
            
            const resultEmbed = {
                title: victory ? '🏆 **VICTORY!**' : '💀 **DEFEAT!**',
                description: victory ? 
                    `**${username}** defeats **Monkey D. Tester**!` :
                    `**Monkey D. Tester** proves too strong!`,
                fields: victory && berryReward > 0 ? [
                    { name: '💰 Berry Reward', value: `+${berryReward} berries`, inline: false }
                ] : [],
                color: victory ? 0x00FF00 : 0xFF0000,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [resultEmbed] });

            // Victory animation
            if (victory) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await RaidAnimation.playVictoryAnimation(interaction);
            }

            return {
                success: true,
                result: victory ? 'victory' : 'defeat',
                berryReward
            };

        } catch (error) {
            console.error('NPC combat error:', error);
            return {
                success: false,
                message: "❌ Combat system error occurred."
            };
        }
    }

    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        console.log(`⚔️ Starting PvP: ${attackerName} vs ${defenderName}`);
        
        try {
            // Use the raid animation
            await RaidAnimation.playQuickAnimation(interaction, 'pvp');
            
            // Simple PvP logic
            const attackerVictory = Math.random() > 0.5; // 50/50 chance
            const berryReward = attackerVictory ? Math.floor(200 + Math.random() * 500) : 0;

            const resultEmbed = {
                title: attackerVictory ? `🏆 **${attackerName} WINS!**` : `🏆 **${defenderName} WINS!**`,
                description: attackerVictory ? 
                    `**${attackerName}** defeats **${defenderName}**!` :
                    `**${defenderName}** successfully defends!`,
                fields: attackerVictory && berryReward > 0 ? [
                    { name: '💰 Berry Reward', value: `+${berryReward} berries for ${attackerName}`, inline: false }
                ] : [],
                color: attackerVictory ? 0x00FF00 : 0xFF6B35,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [resultEmbed] });

            // Victory animation for winner
            if (attackerVictory) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await RaidAnimation.playVictoryAnimation(interaction);
            }

            return {
                success: true,
                result: attackerVictory ? 'victory' : 'defeat',
                berryReward,
                winner: attackerVictory ? attackerName : defenderName
            };

        } catch (error) {
            console.error('PvP combat error:', error);
            return {
                success: false,
                message: "❌ PvP combat system error occurred."
            };
        }
    }
}

console.log('🔧 Creating combat instance...');
const combatInstance = new CombatSystem();
console.log('🔧 Combat instance created with methods:', Object.getOwnPropertyNames(combatInstance));

module.exports = combatInstance;
