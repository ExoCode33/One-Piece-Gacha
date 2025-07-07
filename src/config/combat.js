// src/config/combat.js - Complete Fixed Combat System
console.log('🔧 Loading combat system...');

const RaidAnimation = require('../animations/raid');

class CombatSystem {
    constructor() {
        console.log('🔧 Combat System initialized');
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
    }

    async startNPCCombatWithAnimation(userId, username, interaction) {
        console.log(`🤖 Starting NPC combat for ${username}`);
        
        try {
            // Play ship animation from raid.js
            await RaidAnimation.playQuickAnimation(interaction, 'combat');
            
            // Get user's combat power
            const userCP = await this.getUserCombatPower(userId);
            const npcCP = 1500; // Fixed NPC power
            
            // Calculate victory chance based on CP difference
            const powerRatio = userCP / npcCP;
            let victoryChance = 0.5; // Base 50%
            
            if (powerRatio > 1.5) victoryChance = 0.8;
            else if (powerRatio > 1.2) victoryChance = 0.7;
            else if (powerRatio > 0.8) victoryChance = 0.6;
            else if (powerRatio < 0.5) victoryChance = 0.3;
            else victoryChance = 0.5;
            
            const victory = Math.random() < victoryChance;
            const berryReward = victory ? Math.floor(500 + Math.random() * 1000) : 0;
            
            // Create battle result
            const resultEmbed = {
                title: victory ? '🏆 **VICTORY!**' : '💀 **DEFEAT!**',
                description: victory ? 
                    `**${username}** defeats **Monkey D. Tester** in epic combat!` :
                    `**Monkey D. Tester** proves too strong this time!`,
                color: victory ? 0x00FF00 : 0xFF0000,
                fields: [
                    { name: '⚔️ Your Combat Power', value: `${userCP.toLocaleString()} CP`, inline: true },
                    { name: '🤖 Enemy Combat Power', value: `${npcCP.toLocaleString()} CP`, inline: true },
                    { name: '📊 Victory Chance', value: `${Math.round(victoryChance * 100)}%`, inline: true }
                ],
                timestamp: new Date().toISOString()
            };

            if (victory && berryReward > 0) {
                resultEmbed.fields.push({
                    name: '💰 Reward Earned',
                    value: `+${berryReward} berries`,
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [resultEmbed] });

            // Victory animation
            if (victory) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                await RaidAnimation.playVictoryAnimation(interaction);
            }

            return {
                success: true,
                result: victory ? 'victory' : 'defeat',
                berryReward,
                userCP,
                npcCP
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
            // Play ship animation from raid.js
            await RaidAnimation.playQuickAnimation(interaction, 'pvp');
            
            // Get both players' combat power
            const attackerCP = await this.getUserCombatPower(attackerId);
            const defenderCP = await this.getUserCombatPower(defenderId);
            
            // Calculate battle outcome
            const battleResult = this.calculatePvPOutcome(attackerCP, defenderCP);
            const berryReward = battleResult.victory ? Math.floor(200 + Math.random() * 500) : 0;

            // Create detailed battle result
            const resultEmbed = {
                title: battleResult.victory ? 
                    `🏆 **${attackerName} WINS!**` : 
                    `🏆 **${defenderName} WINS!**`,
                description: battleResult.message,
                color: battleResult.victory ? 0x00FF00 : 0xFF6B35,
                fields: [
                    { name: '⚔️ Attacker Power', value: `${attackerCP.toLocaleString()} CP`, inline: true },
                    { name: '🛡️ Defender Power', value: `${defenderCP.toLocaleString()} CP`, inline: true },
                    { name: '📊 Power Ratio', value: `${battleResult.powerRatio.toFixed(2)}:1`, inline: true }
                ],
                timestamp: new Date().toISOString()
            };

            if (battleResult.victory && berryReward > 0) {
                resultEmbed.fields.push({
                    name: '💰 Victory Reward',
                    value: `+${berryReward} berries for ${attackerName}`,
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [resultEmbed] });

            // Victory animation for winner
            if (battleResult.victory) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                await RaidAnimation.playVictoryAnimation(interaction);
            }

            return {
                success: true,
                result: battleResult.victory ? 'victory' : 'defeat',
                berryReward,
                winner: battleResult.victory ? attackerName : defenderName,
                attackerCP,
                defenderCP,
                powerRatio: battleResult.powerRatio
            };

        } catch (error) {
            console.error('PvP combat error:', error);
            return {
                success: false,
                message: "❌ PvP combat system error occurred."
            };
        }
    }

    // Calculate PvP battle outcome with detailed logic
    calculatePvPOutcome(attackerCP, defenderCP) {
        // Add randomness to combat power (80-120% effectiveness)
        const attackerEffective = attackerCP * (0.8 + Math.random() * 0.4);
        const defenderEffective = defenderCP * (0.8 + Math.random() * 0.4);
        
        const powerRatio = attackerEffective / (defenderEffective || 1);
        
        // Calculate victory chance based on power ratio
        let victoryChance = 0.5; // Base 50% chance
        
        if (powerRatio > 3) {
            victoryChance = 0.9;
        } else if (powerRatio > 2) {
            victoryChance = 0.8;
        } else if (powerRatio > 1.5) {
            victoryChance = 0.7;
        } else if (powerRatio > 1.2) {
            victoryChance = 0.6;
        } else if (powerRatio < 0.3) {
            victoryChance = 0.1;
        } else if (powerRatio < 0.5) {
            victoryChance = 0.2;
        } else if (powerRatio < 0.8) {
            victoryChance = 0.4;
        }

        const victory = Math.random() < victoryChance;
        
        // Generate battle message based on outcome
        let message;
        if (victory) {
            if (powerRatio > 2.5) {
                message = "🌟 **OVERWHELMING DOMINATION!** The attacker's superior power was unstoppable!";
            } else if (powerRatio > 1.8) {
                message = "⚔️ **DECISIVE VICTORY!** Superior strength secured the win!";
            } else if (powerRatio > 1.2) {
                message = "🥊 **SOLID VICTORY!** Skills and power proved superior!";
            } else {
                message = "😤 **NARROW VICTORY!** A hard-fought battle with a close outcome!";
            }
        } else {
            if (powerRatio < 0.4) {
                message = "💥 **CRUSHING DEFEAT!** The attacker was completely outmatched!";
            } else if (powerRatio < 0.7) {
                message = "😵 **CLEAR DEFEAT!** The defender's power was too great!";
            } else {
                message = "🛡️ **SUCCESSFUL DEFENSE!** The defender barely held their ground!";
            }
        }

        return {
            victory,
            message,
            powerRatio,
            victoryChance
        };
    }

    // Get user's total combat power from their Devil Fruit collection
    async getUserCombatPower(userId) {
        try {
            const DatabaseManager = require('../database/manager');
            const userFruits = await DatabaseManager.getUserFruits(userId);
            
            if (!userFruits || userFruits.length === 0) {
                return 100; // Base power for users with no fruits
            }

            let totalCP = 0;
            
            // Calculate total combat power with duplicate bonuses
            const fruitPowerMap = {};
            
            userFruits.forEach(fruit => {
                if (!fruitPowerMap[fruit.fruit_id]) {
                    fruitPowerMap[fruit.fruit_id] = {
                        count: 0,
                        basePower: fruit.combat_power || this.getRarityBasePower(fruit.rarity)
                    };
                }
                fruitPowerMap[fruit.fruit_id].count++;
            });

            // Calculate power with duplicate bonuses
            Object.values(fruitPowerMap).forEach(fruitData => {
                const duplicateBonus = 1 + ((fruitData.count - 1) * 0.01); // 1% per duplicate
                const effectivePower = Math.floor(fruitData.basePower * duplicateBonus);
                totalCP += effectivePower * fruitData.count;
            });

            return Math.max(totalCP, 100); // Minimum 100 CP
            
        } catch (error) {
            console.error('Error calculating user combat power:', error);
            return 100; // Fallback power
        }
    }

    // Get base combat power for rarity tiers
    getRarityBasePower(rarity) {
        const rarityPowers = {
            'common': 150,
            'uncommon': 300,
            'rare': 600,
            'epic': 1000,
            'legendary': 1500,
            'mythical': 2500,
            'omnipotent': 4000
        };
        return rarityPowers[rarity?.toLowerCase()] || 150;
    }

    // Get user battle stats for display
    async getUserBattleStats(userId) {
        try {
            const DatabaseManager = require('../database/manager');
            
            // This would get battle history from database
            // For now, return mock stats
            return {
                totalBattles: 0,
                victories: 0,
                defeats: 0,
                winRate: 0,
                totalCP: await this.getUserCombatPower(userId)
            };
        } catch (error) {
            console.error('Error getting battle stats:', error);
            return {
                totalBattles: 0,
                victories: 0,
                defeats: 0,
                winRate: 0,
                totalCP: 100
            };
        }
    }
}

console.log('🔧 Creating combat instance...');
const combatInstance = new CombatSystem();
console.log('🔧 Combat instance created successfully');

module.exports = combatInstance;
