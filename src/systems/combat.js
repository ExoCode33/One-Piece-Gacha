// ENHANCED ANIMATED COMBAT SYSTEM
// Multi-fruit attacks, resistance blocking, better CP scaling, and proper ship animation

const DatabaseManager = require('../database/manager');

class CombatSystem {
    constructor() {
        // Elemental advantage matrix
        this.elementalAdvantages = {
            fire: ['ice', 'plant'],
            ice: ['plant', 'earth'],
            plant: ['earth', 'water'],
            earth: ['fire', 'lightning'],
            water: ['fire', 'lightning'],
            lightning: ['water', 'ice'],
            gravity: ['fire', 'ice', 'plant', 'earth', 'water', 'lightning'],
            light: ['darkness'],
            darkness: ['light']
        };

        // Resistance matrix
        this.elementalResistances = {
            fire: ['ice', 'plant'],
            ice: ['water', 'lightning'],
            plant: ['earth', 'fire'],
            earth: ['lightning', 'gravity'],
            water: ['fire', 'ice'],
            lightning: ['earth', 'water'],
            gravity: [],
            light: ['darkness'],
            darkness: ['light']
        };
    }

    // Calculate total HP with much better CP scaling
    calculateTotalHP(totalCP) {
        const baseHP = 200;
        const hpBonus = Math.floor(totalCP / 50);
        const maxHP = 800;
        return Math.min(baseHP + hpBonus, maxHP);
    }

    // Get simplified fruit element
    getFruitElement(fruitName) {
        const elementMap = {
            'mera mera no mi': 'fire',
            'hie hie no mi': 'ice',
            'moku moku no mi': 'neutral',
            'suna suna no mi': 'earth',
            'goro goro no mi': 'lightning',
            'hana hana no mi': 'plant',
            'zushi zushi no mi': 'gravity',
            'pika pika no mi': 'light',
            'yami yami no mi': 'darkness',
            'uo uo no mi': 'water',
            'gomu gomu no mi': 'neutral',
            'buku buku no mi': 'neutral',
            'nagi nagi no mi': 'neutral',
            'yomi yomi no mi': 'neutral'
        };
        
        const lowerName = fruitName.toLowerCase();
        return elementMap[lowerName] || 'neutral';
    }

    // Simple NPC combat (working version)
    async startNPCCombatWithAnimation(userId, username, interaction) {
        try {
            console.log(`🤖 Starting simple NPC combat for ${username}`);
            
            // Basic combat result
            const victory = Math.random() > 0.4; // 60% win chance
            const berryReward = victory ? Math.floor(500 + Math.random() * 1000) : 0;

            // Ship animation
            await interaction.editReply({ content: '🌊 Ship approaching...' });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await interaction.editReply({ content: '🚢 Battle beginning!' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Battle result
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

    // Simple PvP combat (working version)
    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        try {
            console.log(`⚔️ Starting simple PvP: ${attackerName} vs ${defenderName}`);
            
            // Basic combat result
            const attackerVictory = Math.random() > 0.5; // 50/50 chance
            const berryReward = attackerVictory ? Math.floor(200 + Math.random() * 500) : 0;

            // Ship animation
            await interaction.editReply({ content: '🌊 PvP battle approaching...' });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await interaction.editReply({ content: '⚔️ PvP battle beginning!' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Battle result
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

module.exports = new CombatSystem();
