// COMPLETE ADVANCED COMBAT SYSTEM
// Professional game-like combat with multi-fruit attacks and animations

const DatabaseManager = require('../database/manager');

class CombatSystem {
    constructor() {
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

    calculateTotalHP(totalCP) {
        const baseHP = 200;
        const hpBonus = Math.floor(totalCP / 50);
        const maxHP = 800;
        return Math.min(baseHP + hpBonus, maxHP);
    }

    async getUserFruits(userId) {
        try {
            const possibleQueries = [
                'SELECT name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1',
                'SELECT fruit_name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1'
            ];

            for (const query of possibleQueries) {
                try {
                    const result = await DatabaseManager.query(query, [userId]);
                    if (result.rows && result.rows.length > 0) {
                        return result.rows.map(row => ({
                            fruit_name: row.name || row.fruit_name,
                            rarity: row.rarity,
                            duplicate_count: row.duplicate_count || 1
                        }));
                    }
                } catch (err) {
                    continue;
                }
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    async getUserStats(userId) {
        try {
            const fruits = await this.getUserFruits(userId);
            if (!fruits || fruits.length === 0) return { totalCP: 100, fruitCount: 0 };

            let totalCP = 0;
            for (const fruit of fruits) {
                let baseCP = this.getRarityCP(fruit.rarity);
                const duplicateBonus = (fruit.duplicate_count - 1) * 0.01;
                const effectiveCP = Math.floor(baseCP * (1 + duplicateBonus));
                totalCP += effectiveCP;
            }

            return { totalCP, fruitCount: fruits.length };
        } catch (error) {
            return { totalCP: 100, fruitCount: 0 };
        }
    }

    getRarityCP(rarity) {
        const rarityCP = {
            common: 150,
            uncommon: 250,
            rare: 400,
            epic: 600,
            legendary: 850,
            mythical: 1200,
            omnipotent: 1600
        };
        return rarityCP[rarity?.toLowerCase()] || 150;
    }

    getFruitElement(fruitName) {
        const elementMap = {
            'mera mera no mi': 'fire',
            'hie hie no mi': 'ice',
            'hana hana no mi': 'plant',
            'zushi zushi no mi': 'gravity',
            'gomu gomu no mi': 'neutral',
            'buku buku no mi': 'neutral',
            'nagi nagi no mi': 'neutral'
        };
        
        const lowerName = fruitName.toLowerCase();
        return elementMap[lowerName] || 'neutral';
    }

    calculateDamage(attackerCP, attackerFruit, defenderFruit, defenderMaxHP, isBlocked = false) {
        if (isBlocked) return 0;
        
        const baseDamage = Math.floor(attackerCP * 0.04);
        const variation = 0.8 + Math.random() * 0.4;
        let damage = Math.floor(baseDamage * variation);
        
        const maxDamage = Math.floor(defenderMaxHP * 0.15);
        damage = Math.min(damage, maxDamage);
        
        return Math.max(damage, 5);
    }

    getShipFrames() {
        return [
            '🌊 ⚓ **Ship approaching battle zone...**',
            '🌊 🚢 **Ship sailing into position...**', 
            '🌊 ⚔️ **Ship ready for combat!**',
            '🌊 🏴‍☠️ **Battle ship deployed!**'
        ];
    }

    async performAdvancedCombat(attackerFruits, defenderFruits, attackerCP, defenderHP, defenderMaxHP, attackerName, defenderName, interaction, turn) {
        const maxAttacks = Math.min(attackerFruits.length, 3);
        let currentDefenderHP = defenderHP;
        let totalDamage = 0;

        // Show preparation
        const prepEmbed = {
            title: `⚔️ **TURN ${turn} - MULTI-FRUIT BARRAGE!**`,
            description: `**${attackerName}** unleashes **${maxAttacks} Devil Fruit attacks**!`,
            color: 0x8A2BE2,
            timestamp: new Date().toISOString()
        };
        
        await interaction.editReply({ embeds: [prepEmbed] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Execute attacks
        for (let i = 0; i < maxAttacks && currentDefenderHP > 0; i++) {
            const attackerFruit = attackerFruits[i];
            const attackerElement = this.getFruitElement(attackerFruit.fruit_name);
            
            // Check for blocking
            let blocked = false;
            for (const defenderFruit of defenderFruits) {
                const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
                const resistances = this.elementalResistances[defenderElement] || [];
                
                if (resistances.includes(attackerElement)) {
                    blocked = true;
                    break;
                }
            }

            const damage = this.calculateDamage(attackerCP, attackerFruit, defenderFruits[0], defenderMaxHP, blocked);
            const beforeHP = currentDefenderHP;
            currentDefenderHP = Math.max(0, currentDefenderHP - damage);

            if (!blocked) {
                totalDamage += damage;
            }

            // Show attack animation
            const attackEmbed = {
                title: blocked ? `🛡️ **ATTACK BLOCKED!**` : `💥 **DIRECT HIT!**`,
                description: blocked ? 
                    `**${attackerFruit.fruit_name}** was blocked by resistance!` :
                    `**${attackerFruit.fruit_name}** deals **${damage}** damage!`,
                fields: [
                    { name: '🍈 Fruit', value: attackerFruit.fruit_name, inline: true },
                    { name: '⚡ Element', value: attackerElement.toUpperCase(), inline: true },
                    { name: '💖 HP', value: `${currentDefenderHP}/${defenderMaxHP}`, inline: true }
                ],
                color: blocked ? 0x87CEEB : 0xFF6B35,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [attackEmbed] });
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (currentDefenderHP <= 0) {
                const koEmbed = {
                    title: `💀 **KNOCKOUT!**`,
                    description: `**${defenderName}** has been defeated by **${attackerName}**!`,
                    color: 0x8B0000,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [koEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                break;
            }
        }

        return {
            finalHP: currentDefenderHP,
            totalDamage
        };
    }

    async startNPCCombatWithAnimation(userId, username, interaction) {
        try {
            console.log(`🤖 Starting ADVANCED NPC combat for ${username}`);
            
            const userFruits = await this.getUserFruits(userId);
            const userStats = await this.getUserStats(userId);
            
            if (!userFruits || userFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need Devil Fruits to battle! Use `/pull` first."
                };
            }

            const npcFruits = [
                { fruit_name: 'Mera Mera no Mi', rarity: 'rare' },
                { fruit_name: 'Zushi Zushi no Mi', rarity: 'epic' },
                { fruit_name: 'Hana Hana no Mi', rarity: 'uncommon' }
            ];
            const npcCP = 2000;

            const playerMaxHP = this.calculateTotalHP(userStats.totalCP);
            const npcMaxHP = this.calculateTotalHP(npcCP);
            let playerHP = playerMaxHP;
            let npcHP = npcMaxHP;

            // Ship animation
            const shipFrames = this.getShipFrames();
            for (let i = 0; i < shipFrames.length; i++) {
                await interaction.editReply({ content: shipFrames[i] });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Battle setup
            const arenaEmbed = {
                title: `🏟️ **EPIC BATTLE ARENA**`,
                description: `**${username}** vs **Monkey D. Tester**`,
                fields: [
                    { name: '👤 Your Power', value: `${userStats.totalCP} CP\n${playerHP}/${playerMaxHP} HP`, inline: true },
                    { name: '🤖 NPC Power', value: `${npcCP} CP\n${npcHP}/${npcMaxHP} HP`, inline: true },
                    { name: '🎮 Format', value: `3 Epic Turns\nMulti-Fruit Combat`, inline: true }
                ],
                color: 0x1E90FF,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [arenaEmbed] });
            await new Promise(resolve => setTimeout(resolve, 3000));

            let turn = 1;

            // 3 turns of combat
            while (turn <= 3 && playerHP > 0 && npcHP > 0) {
                // Player's turn
                const playerResult = await this.performAdvancedCombat(
                    userFruits, npcFruits, userStats.totalCP, npcHP, npcMaxHP,
                    username, "Monkey D. Tester", interaction, turn
                );
                
                npcHP = playerResult.finalHP;
                if (npcHP <= 0) break;

                // NPC's turn
                const npcResult = await this.performAdvancedCombat(
                    npcFruits, userFruits, npcCP, playerHP, playerMaxHP,
                    "Monkey D. Tester", username, interaction, turn
                );
                
                playerHP = npcResult.finalHP;
                if (playerHP <= 0) break;

                turn++;
            }

            // Results
            const victory = playerHP > npcHP;
            let berryReward = 0;

            if (victory) {
                berryReward = Math.floor(800 + Math.random() * 1200);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `Epic NPC victory`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            const resultEmbed = {
                title: victory ? `🏆 **LEGENDARY VICTORY!** 🏆` : `💀 **HEROIC DEFEAT!** 💀`,
                description: victory ? 
                    `**${username}** emerges victorious!` :
                    `**Monkey D. Tester** proves too powerful!`,
                fields: [
                    { name: '👤 Your HP', value: `${playerHP}/${playerMaxHP}`, inline: true },
                    { name: '🤖 NPC HP', value: `${npcHP}/${npcMaxHP}`, inline: true },
                    { name: '🎯 Turns', value: `${turn}`, inline: true }
                ],
                color: victory ? 0x00FF00 : 0xFF0000,
                timestamp: new Date().toISOString()
            };

            if (victory && berryReward > 0) {
                resultEmbed.fields.push({ 
                    name: '💰 Reward', 
                    value: `+${berryReward} berries`, 
                    inline: false 
                });
            }

            await interaction.editReply({ embeds: [resultEmbed] });

            return {
                success: true,
                result: victory ? 'victory' : 'defeat',
                playerHP,
                npcHP,
                playerMaxHP,
                npcMaxHP,
                berryReward
            };

        } catch (error) {
            console.error('Advanced NPC combat error:', error);
            return {
                success: false,
                message: "❌ Combat system error occurred."
            };
        }
    }

    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        try {
            console.log(`⚔️ Starting ADVANCED PvP: ${attackerName} vs ${defenderName}`);
            
            const attackerFruits = await this.getUserFruits(attackerId);
            const defenderFruits = await this.getUserFruits(defenderId);
            const attackerStats = await this.getUserStats(attackerId);
            const defenderStats = await this.getUserStats(defenderId);
            
            if (!attackerFruits?.length || !defenderFruits?.length) {
                return {
                    success: false,
                    message: "❌ Both players need Devil Fruits to battle!"
                };
            }

            const attackerMaxHP = this.calculateTotalHP(attackerStats.totalCP);
            const defenderMaxHP = this.calculateTotalHP(defenderStats.totalCP);
            let attackerHP = attackerMaxHP;
            let defenderHP = defenderMaxHP;

            // Ship animation
            const shipFrames = this.getShipFrames();
            for (let i = 0; i < shipFrames.length; i++) {
                await interaction.editReply({ content: shipFrames[i] });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // PvP setup
            const arenaEmbed = {
                title: `🏟️ **EPIC PvP ARENA**`,
                description: `**${attackerName}** vs **${defenderName}**`,
                fields: [
                    { name: '👤 Attacker', value: `${attackerStats.totalCP} CP\n${attackerHP}/${attackerMaxHP} HP`, inline: true },
                    { name: '👥 Defender', value: `${defenderStats.totalCP} CP\n${defenderHP}/${defenderMaxHP} HP`, inline: true },
                    { name: '🎮 Format', value: `PvP Combat\nMulti-Fruit`, inline: true }
                ],
                color: 0xFF1493,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [arenaEmbed] });
            await new Promise(resolve => setTimeout(resolve, 3000));

            let turn = 1;

            // 3 turns of PvP combat
            while (turn <= 3 && attackerHP > 0 && defenderHP > 0) {
                // Attacker's turn
                const attackerResult = await this.performAdvancedCombat(
                    attackerFruits, defenderFruits, attackerStats.totalCP, defenderHP, defenderMaxHP,
                    attackerName, defenderName, interaction, turn
                );
                
                defenderHP = attackerResult.finalHP;
                if (defenderHP <= 0) break;

                // Defender's turn
                const defenderResult = await this.performAdvancedCombat(
                    defenderFruits, attackerFruits, defenderStats.totalCP, attackerHP, attackerMaxHP,
                    defenderName, attackerName, interaction, turn
                );
                
                attackerHP = defenderResult.finalHP;
                if (attackerHP <= 0) break;

                turn++;
            }

            // PvP results
            const attackerVictory = attackerHP > defenderHP;
            let berryReward = 0;

            if (attackerVictory) {
                berryReward = Math.floor(300 + Math.random() * 700);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(attackerId, berryReward, `Epic PvP victory`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            const resultEmbed = {
                title: attackerVictory ? `🏆 **${attackerName.toUpperCase()} WINS!** 🏆` : `🏆 **${defenderName.toUpperCase()} WINS!** 🏆`,
                description: attackerVictory ? 
                    `**${attackerName}** defeats **${defenderName}**!` :
                    `**${defenderName}** successfully defends!`,
                fields: [
                    { name: '👤 Attacker', value: `${attackerHP}/${attackerMaxHP} HP`, inline: true },
                    { name: '👥 Defender', value: `${defenderHP}/${defenderMaxHP} HP`, inline: true },
                    { name: '🎯 Turns', value: `${turn}`, inline: true }
                ],
                color: attackerVictory ? 0x00FF00 : 0xFF6B35,
                timestamp: new Date().toISOString()
            };

            if (attackerVictory && berryReward > 0) {
                resultEmbed.fields.push({ 
                    name: '💰 Reward', 
                    value: `+${berryReward} berries for ${attackerName}`, 
                    inline: false 
                });
            }

            await interaction.editReply({ embeds: [resultEmbed] });

            return {
                success: true,
                result: attackerVictory ? 'victory' : 'defeat',
                attackerHP,
                defenderHP,
                attackerMaxHP,
                defenderMaxHP,
                berryReward,
                winner: attackerVictory ? attackerName : defenderName
            };

        } catch (error) {
            console.error('Advanced PvP combat error:', error);
            return {
                success: false,
                message: "❌ PvP combat system error occurred."
            };
        }
    }
}

module.exports = new CombatSystem();
