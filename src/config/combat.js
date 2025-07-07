console.log('🔧 Loading combat system...');

const RaidAnimation = require('../animations/raid');

class CombatSystem {
    constructor() {
        console.log('🔧 Combat System initialized');
    }

    async startNPCCombatWithAnimation(userId, username, interaction) {
        console.log(`🤖 Starting NPC combat for ${username}`);
        
        try {
            // Use the improved slow ship animation
            await this.playSlowShipAnimation(interaction, 'combat');
            
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
                await this.playVictoryAnimation(interaction);
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
            // Use the improved slow ship animation
            await this.playSlowShipAnimation(interaction, 'pvp');
            
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
                await this.playVictoryAnimation(interaction);
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

    // Improved slower ship animation
    async playSlowShipAnimation(interaction, animationType = 'combat') {
        const ship = [
            "                    |\\",
            "                    | \\",
            "                    |  \\",
            "               _____|   \\____",
            "       _______/              \\_______",
            "      /                              \\",
            "     |    🏴‍☠️  ONE PIECE SHIP  🏴‍☠️    |",
            "     |________________________________|",
            "      \\______________________________/",
            "        \\_________________________/",
            "          \\____________________/",
            "            \\_______________/",
            "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        ];

        // Create smoother animation frames with proper positioning
        const frames = [
            {
                title: '🌊 **A ship appears on the distant horizon...**',
                ship: this.positionShip(ship, 30), // Far right
                delay: 2000
            },
            {
                title: '🚢 **The battle ship sails closer...**',
                ship: this.positionShip(ship, 20), // Moving in
                delay: 1800
            },
            {
                title: '⚔️ **Ship entering combat position...**',
                ship: this.positionShip(ship, 10), // Getting closer
                delay: 1600
            },
            {
                title: '🏴‍☠️ **Battle ship ready for combat!**',
                ship: this.positionShip(ship, 0), // Final position
                delay: 1500
            }
        ];

        // Play each frame with proper timing
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            
            const embed = {
                title: frame.title,
                description: `\`\`\`\n${frame.ship}\n\`\`\``,
                color: this.getAnimationColor(animationType),
                footer: {
                    text: `Combat Animation • Frame ${i + 1}/${frames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            // Don't delay after the last frame
            if (i < frames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, frame.delay));
            }
        }
    }

    // Position ship with proper padding and width control
    positionShip(shipLines, offset) {
        const normalSpace = ' '; // Use regular spaces instead of braille
        
        return shipLines.map(line => {
            if (offset > 0) {
                // Add normal spaces to the left
                return normalSpace.repeat(Math.min(offset, 20)) + line;
            } else {
                // For negative offset, clip from the left
                return line.substring(Math.abs(offset));
            }
        }).join('\n');
    }

    // Get color based on animation type
    getAnimationColor(type) {
        const colors = {
            combat: 0x1E90FF,    // Blue for combat
            pvp: 0xFF1493,       // Pink for PvP
            victory: 0x00FF00,   // Green for victory
            defeat: 0xFF0000     // Red for defeat
        };
        return colors[type] || colors.combat;
    }

    // Victory animation - ship sailing away slowly
    async playVictoryAnimation(interaction) {
        const ship = [
            "                    |\\",
            "                    | \\",
            "                    |  \\",
            "               _____|   \\____",
            "       _______/              \\_______",
            "      /                              \\",
            "     |    🏆  VICTORY SHIP  🏆      |",
            "     |________________________________|",
            "      \\______________________________/",
            "        \\_________________________/",
            "          \\____________________/",
            "            \\_______________/",
            "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        ];

        const victoryFrames = [
            {
                title: '🏆 **VICTORY! Ship beginning departure...**',
                ship: this.positionShip(ship, 0),
                delay: 2000
            },
            {
                title: '⛵ **Sailing towards the sunset...**',
                ship: this.positionShip(ship, -15),
                delay: 2000
            },
            {
                title: '🌅 **Until the next adventure!**',
                ship: this.positionShip(ship, -30),
                delay: 1500
            }
        ];
        
        for (let i = 0; i < victoryFrames.length; i++) {
            const frame = victoryFrames[i];
            
            const embed = {
                title: frame.title,
                description: `\`\`\`\n${frame.ship}\n\`\`\``,
                color: 0x00FF00, // Victory green
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            if (i < victoryFrames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, frame.delay));
            }
        }
    }
}

console.log('🔧 Creating combat instance...');
const combatInstance = new CombatSystem();
console.log('🔧 Combat instance created with methods:', Object.getOwnPropertyNames(combatInstance));

module.exports = combatInstance;
