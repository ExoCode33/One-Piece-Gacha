// NEW DETAILED 3-TURN COMBAT SYSTEM
// Turn-based combat with elemental advantages and detailed logs

const DatabaseManager = require('../database/manager');

class CombatSystem {
    constructor() {
        // Elemental advantage matrix
        this.elementalAdvantages = {
            'fire': ['ice', 'plant'],
            'ice': ['plant', 'earth'],
            'plant': ['earth', 'water'],
            'earth': ['fire', 'lightning'],
            'water': ['fire', 'lightning'],
            'lightning': ['water', 'ice'],
            'darkness': ['light'],
            'light': ['darkness'],
            'gravity': ['all'],
            'soul': ['neutral'],
            'neutral': []
        };

        // Rarity-based critical hit chances
        this.rarityCritChances = {
            'common': 0.10,
            'uncommon': 0.15,
            'rare': 0.20,
            'epic': 0.25,
            'legendary': 0.30,
            'mythical': 0.35,
            'omnipotent': 0.40
        };
    }

    // Get elemental type from devil fruit name
    getElementalType(fruitName) {
        const name = fruitName.toLowerCase();
        
        if (name.includes('mera') || name.includes('fire') || name.includes('flame')) return 'fire';
        if (name.includes('hie') || name.includes('ice') || name.includes('snow')) return 'ice';
        if (name.includes('hana') || name.includes('plant') || name.includes('flower')) return 'plant';
        if (name.includes('suna') || name.includes('earth') || name.includes('sand')) return 'earth';
        if (name.includes('mizu') || name.includes('water') || name.includes('aqua')) return 'water';
        if (name.includes('goro') || name.includes('denki') || name.includes('lightning')) return 'lightning';
        if (name.includes('yami') || name.includes('dark') || name.includes('kage')) return 'darkness';
        if (name.includes('pika') || name.includes('light') || name.includes('beam')) return 'light';
        if (name.includes('zushi') || name.includes('gravity')) return 'gravity';
        if (name.includes('yomi') || name.includes('soul') || name.includes('spirit')) return 'soul';
        
        return 'neutral';
    }

    // Calculate elemental effectiveness
    calculateElementalMultiplier(attackerElement, defenderElement) {
        if (attackerElement === 'gravity') return 1.5;
        if (this.elementalAdvantages[attackerElement]?.includes(defenderElement)) return 1.5;
        if (this.elementalAdvantages[defenderElement]?.includes(attackerElement)) return 0.67;
        return 1.0;
    }

    // Calculate damage for one attack
    calculateDamage(attackerCP, attackerFruit, defenderFruit) {
        const baseDamage = attackerCP * 0.25;
        const attackerElement = this.getElementalType(attackerFruit.fruit_name);
        const defenderElement = this.getElementalType(defenderFruit.fruit_name);
        const elementalMultiplier = this.calculateElementalMultiplier(attackerElement, defenderElement);
        
        const critChance = this.rarityCritChances[attackerFruit.rarity] || 0.15;
        const isCritical = Math.random() < critChance;
        const critMultiplier = isCritical ? 1.5 : 1.0;
        
        const finalDamage = Math.floor(baseDamage * elementalMultiplier * critMultiplier);
        
        return {
            damage: Math.max(1, finalDamage),
            elementalMultiplier,
            isCritical,
            attackerElement,
            defenderElement
        };
    }

    // Get description for elemental interaction
    getElementalDescription(attackerElement, defenderElement, multiplier) {
        if (multiplier > 1.0) {
            return `🔥 **ELEMENTAL ADVANTAGE!** ${attackerElement} beats ${defenderElement}!`;
        } else if (multiplier < 1.0) {
            return `🛡️ **ELEMENTAL RESISTANCE!** ${defenderElement} resists ${attackerElement}!`;
        } else {
            return `⚔️ **NEUTRAL DAMAGE** - No elemental advantage`;
        }
    }

    async startNPCCombat(userId, username) {
        try {
            console.log(`🤖 Starting DETAILED NPC combat for ${username}`);
            
            // Get user's stats and fruits
            const userStats = await this.getUserStats(userId);
            if (userStats.totalCP === 0) {
                return {
                    success: false,
                    error: 'You need Devil Fruits to fight! Use `/pull` to get some first.'
                };
            }

            const userFruits = await this.getUserFruits(userId);
            if (!userFruits || userFruits.length === 0) {
                return {
                    success: false,
                    error: 'No Devil Fruits found in your collection!'
                };
            }

            // NPC data with detailed fruits
            const npcFruits = [
                { fruit_name: 'Mera Mera no Mi', rarity: 'rare' },
                { fruit_name: 'Zushi Zushi no Mi', rarity: 'epic' },
                { fruit_name: 'Hana Hana no Mi', rarity: 'uncommon' },
                { fruit_name: 'Yomi Yomi no Mi', rarity: 'uncommon' }
            ];
            
            // Initialize combat
            let playerHP = 100;
            let npcHP = 100;
            const combatLog = [];
            const npcCP = 2000;
            
            combatLog.push(`🏟️ **DETAILED BATTLE BEGINS!**`);
            combatLog.push(`👤 **${username}** (${userStats.totalCP} CP) vs 🤖 **Monkey D. Tester** (${npcCP} CP)`);
            combatLog.push(`💖 Both fighters start at 100/100 HP\n`);
            
            // 3 detailed turns of combat
            for (let turn = 1; turn <= 3 && playerHP > 0 && npcHP > 0; turn++) {
                combatLog.push(`═══════════════════════════════════════`);
                combatLog.push(`🗡️ **TURN ${turn}**`);
                combatLog.push(`═══════════════════════════════════════`);
                
                // === PLAYER'S TURN ===
                combatLog.push(`\n👤 **${username}'s Attack:**`);
                const playerFruit = userFruits[Math.floor(Math.random() * userFruits.length)];
                const npcDefenseFruit = npcFruits[Math.floor(Math.random() * npcFruits.length)];
                
                const playerAttack = this.calculateDamage(userStats.totalCP, playerFruit, npcDefenseFruit);
                
                combatLog.push(`🍈 Using: **${playerFruit.fruit_name}** (${playerAttack.attackerElement.toUpperCase()})`);
                combatLog.push(`🛡️ NPC defends with: **${npcDefenseFruit.fruit_name}** (${playerAttack.defenderElement.toUpperCase()})`);
                combatLog.push(this.getElementalDescription(playerAttack.attackerElement, playerAttack.defenderElement, playerAttack.elementalMultiplier));
                
                if (playerAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** Rarity bonus activated!`);
                }
                
                const oldNpcHP = npcHP;
                npcHP = Math.max(0, npcHP - playerAttack.damage);
                combatLog.push(`💥 **${playerAttack.damage}** damage dealt!`);
                combatLog.push(`🤖 Monkey D. Tester: ${oldNpcHP}/100 → **${npcHP}/100 HP**`);
                
                if (npcHP <= 0) {
                    combatLog.push(`\n🏆 **KNOCKOUT!** Monkey D. Tester is defeated in Turn ${turn}!`);
                    break;
                }
                
                // === NPC'S TURN ===
                combatLog.push(`\n🤖 **Monkey D. Tester's Counter-Attack:**`);
                const npcAttackFruit = npcFruits[Math.floor(Math.random() * npcFruits.length)];
                const playerDefenseFruit = userFruits[Math.floor(Math.random() * userFruits.length)];
                
                const npcAttack = this.calculateDamage(npcCP, npcAttackFruit, playerDefenseFruit);
                
                combatLog.push(`🍈 Using: **${npcAttackFruit.fruit_name}** (${npcAttack.attackerElement.toUpperCase()})`);
                combatLog.push(`🛡️ You defend with: **${playerDefenseFruit.fruit_name}** (${npcAttack.defenderElement.toUpperCase()})`);
                combatLog.push(this.getElementalDescription(npcAttack.attackerElement, npcAttack.defenderElement, npcAttack.elementalMultiplier));
                
                if (npcAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** NPC gets lucky!`);
                }
                
                const oldPlayerHP = playerHP;
                playerHP = Math.max(0, playerHP - npcAttack.damage);
                combatLog.push(`💥 **${npcAttack.damage}** damage dealt!`);
                combatLog.push(`👤 **${username}**: ${oldPlayerHP}/100 → **${playerHP}/100 HP**`);
                
                if (playerHP <= 0) {
                    combatLog.push(`\n💀 **KNOCKOUT!** You are defeated in Turn ${turn}!`);
                    break;
                }
                
                // Turn summary
                combatLog.push(`\n📊 **Turn ${turn} Summary:**`);
                combatLog.push(`👤 You: ${playerHP}/100 HP | 🤖 NPC: ${npcHP}/100 HP`);
                
                if (turn < 3 && playerHP > 0 && npcHP > 0) {
                    combatLog.push(`⏭️ Moving to Turn ${turn + 1}...\n`);
                }
            }
            
            // Final result
            combatLog.push(`\n🏁 **BATTLE CONCLUDED!**`);
            const result = playerHP > npcHP ? 'victory' : 'defeat';
            
            if (result === 'victory') {
                combatLog.push(`🎉 **VICTORY!** You defeated Monkey D. Tester!`);
            } else {
                combatLog.push(`💀 **DEFEAT!** Monkey D. Tester proved too strong!`);
            }
            
            // Calculate rewards for victory
            let rewards = null;
            if (result === 'victory') {
                const berryReward = Math.floor(Math.random() * 1000) + 500;
                rewards = {
                    berries: berryReward,
                    fruits: []
                };
                
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `NPC victory vs Monkey D. Tester`);
                } catch (error) {
                    console.warn('Berry system not available');
                    rewards.berries = 0;
                }
            }
            
            console.log(`🎯 DETAILED Combat result: ${result} for ${username}`);
            
            return {
                success: true,
                result,
                attackerHP: playerHP,
                defenderHP: npcHP,
                combatLog,
                rewards
            };
            
        } catch (error) {
            console.error('Detailed NPC combat error:', error);
            return {
                success: false,
                error: 'Combat system error. Please try again.'
            };
        }
    }

    // Get user statistics
    async getUserStats(userId) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_fruits,
                    COALESCE(SUM(CASE 
                        WHEN rarity = 'common' THEN 50 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'uncommon' THEN 150 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'rare' THEN 400 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'epic' THEN 800 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'legendary' THEN 1500 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'mythical' THEN 2500 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'omnipotent' THEN 5000 * (1 + duplicate_count * 0.01)
                        ELSE 50
                    END), 0) as total_cp
                FROM user_devil_fruits
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const stats = result.rows[0];
            
            return {
                totalFruits: parseInt(stats.total_fruits) || 0,
                totalCP: Math.floor(parseFloat(stats.total_cp)) || 0
            };
            
        } catch (error) {
            console.error('Error getting user stats:', error);
            return { totalFruits: 0, totalCP: 0 };
        }
    }

    // Get user's devil fruits
    async getUserFruits(userId) {
        try {
            const query = `
                SELECT fruit_name, rarity, duplicate_count
                FROM user_devil_fruits
                WHERE user_id = $1
                ORDER BY RANDOM()
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error getting user fruits:', error);
            return [];
        }
    }

    // Simple battle prediction for PvP
    calculateBattlePrediction(attackerCP, defenderCP) {
        const cpDifference = attackerCP - defenderCP;
        const baseChance = 50;
        const cpBonus = Math.floor(cpDifference / 100) * 5;
        const winChance = Math.max(10, Math.min(90, baseChance + cpBonus));
        
        let outcome;
        if (winChance >= 70) {
            outcome = 'Highly Favored';
        } else if (winChance >= 55) {
            outcome = 'Favored';
        } else if (winChance >= 45) {
            outcome = 'Even Match';
        } else if (winChance >= 30) {
            outcome = 'Underdog';
        } else {
            outcome = 'Heavy Underdog';
        }
        
        return { winChance, outcome };
    }
}

module.exports = new CombatSystem();
