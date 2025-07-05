// TURN-BASED COMBAT SYSTEM
// 3-turn auto combat with elemental advantages and resistances

const FakePlayerSystem = require('../data/fakeplayer');
const BerryEconomySystem = require('./economy');
const DatabaseManager = require('../database/manager');
const { getFruitById } = require('../data/devilfruit');

class TurnBasedCombat {
    constructor() {
        this.maxTurns = 3;
        this.baseHP = 100;
    }

    // Execute complete combat sequence
    async executeCombat(attackerId, attackerName) {
        try {
            // Initialize combatants
            const attacker = await this.initializeAttacker(attackerId, attackerName);
            const defender = FakePlayerSystem.getFakePlayer();
            
            // Reset fake player HP
            FakePlayerSystem.heal();
            
            const combatLog = {
                attacker: attacker,
                defender: {
                    name: defender.displayName,
                    level: defender.level,
                    hp: defender.currentHP,
                    maxHP: defender.baseHP,
                    totalCP: defender.totalCombatPower,
                    topFruits: FakePlayerSystem.getStrongestFruits(3)
                },
                turns: [],
                result: null,
                summary: {
                    totalDamageDealt: 0,
                    totalDamageReceived: 0,
                    elementalAdvantages: 0,
                    criticalHits: 0
                }
            };

            // Execute 3 turns of combat
            for (let turn = 1; turn <= this.maxTurns; turn++) {
                const turnResult = await this.executeTurn(turn, attacker, defender);
                combatLog.turns.push(turnResult);
                
                // Update summary stats
                combatLog.summary.totalDamageDealt += turnResult.attackerDamage;
                combatLog.summary.totalDamageReceived += turnResult.defenderDamage;
                if (turnResult.attackerAdvantage > 1.0) combatLog.summary.elementalAdvantages++;
                if (turnResult.attackerCritical) combatLog.summary.criticalHits++;
                
                // Check for knockouts
                if (attacker.hp <= 0 || defender.currentHP <= 0) {
                    break;
                }
            }

            // Determine winner and calculate results
            const attackerWins = attacker.hp > defender.currentHP;
            combatLog.result = this.calculateCombatResult(attackerWins, attacker, defender);
            
            return combatLog;
            
        } catch (error) {
            console.error('Error in turn-based combat:', error);
            return {
                error: true,
                message: 'Combat system error occurred'
            };
        }
    }

    // Initialize attacker stats
    async initializeAttacker(attackerId, attackerName) {
        const userFruits = await DatabaseManager.getUserFruits(attackerId);
        const totalCP = await BerryEconomySystem.calculateUserTotalCP(attackerId);
        
        // Get attacker's strongest fruits for combat
        const fruitPowers = {};
        userFruits.forEach(fruit => {
            if (!fruitPowers[fruit.fruit_id]) {
                fruitPowers[fruit.fruit_id] = {
                    count: 0,
                    data: getFruitById(fruit.fruit_id) || {
                        name: fruit.name,
                        type: fruit.type,
                        rarity: fruit.rarity,
                        combatPower: fruit.combat_power || 100
                    }
                };
            }
            fruitPowers[fruit.fruit_id].count++;
        });

        // Get top 3 strongest fruits with duplicate bonuses
        const topFruits = Object.entries(fruitPowers)
            .map(([id, data]) => {
                const duplicateBonus = 1 + (data.count - 1) * 0.01;
                const effectiveCP = Math.floor(data.data.combatPower * duplicateBonus);
                return {
                    id: id,
                    name: data.data.name,
                    type: data.data.type,
                    rarity: data.data.rarity,
                    element: this.getElementFromFruit(data.data),
                    combatPower: data.data.combatPower,
                    effectiveCP: effectiveCP,
                    duplicates: data.count
                };
            })
            .sort((a, b) => b.effectiveCP - a.effectiveCP)
            .slice(0, 3);

        return {
            id: attackerId,
            name: attackerName,
            hp: this.baseHP,
            maxHP: this.baseHP,
            totalCP: totalCP,
            topFruits: topFruits,
            currentFruitIndex: 0
        };
    }

    // Execute a single turn
    async executeTurn(turnNumber, attacker, defender) {
        const turnLog = {
            turn: turnNumber,
            attackerHP: attacker.hp,
            defenderHP: defender.currentHP,
            attackerAction: {},
            defenderAction: {},
            attackerDamage: 0,
            defenderDamage: 0,
            attackerAdvantage: 1.0,
            defenderAdvantage: 1.0,
            attackerCritical: false,
            defenderCritical: false,
            descriptions: []
        };

        // Attacker's action
        const attackerFruit = attacker.topFruits[attacker.currentFruitIndex] || attacker.topFruits[0];
        const defenderFruit = FakePlayerSystem.getStrongestFruits(1)[0];
        
        if (attackerFruit && defenderFruit) {
            // Calculate attacker's damage
            const attackerAction = this.calculateAttack(attackerFruit, defenderFruit, attacker.totalCP);
            turnLog.attackerAction = attackerAction;
            turnLog.attackerDamage = attackerAction.damage;
            turnLog.attackerAdvantage = attackerAction.elementalAdvantage;
            turnLog.attackerCritical = attackerAction.critical;
            
            // Apply damage to defender
            const newDefenderHP = FakePlayerSystem.takeDamage(attackerAction.damage);
            
            turnLog.descriptions.push(
                `🗡️ **${attacker.name}** attacks with **${attackerFruit.name}** (${attackerFruit.element})!`
            );
            turnLog.descriptions.push(attackerAction.description);
            turnLog.descriptions.push(
                `💥 Deals **${attackerAction.damage}** damage! ${defender.displayName}: ${newDefenderHP}/${defender.baseHP} HP`
            );
            
            // Defender's counter-attack (if still alive)
            if (newDefenderHP > 0) {
                const defenderAction = this.calculateAttack(defenderFruit, attackerFruit, defender.totalCombatPower);
                turnLog.defenderAction = defenderAction;
                turnLog.defenderDamage = defenderAction.damage;
                turnLog.defenderAdvantage = defenderAction.elementalAdvantage;
                turnLog.defenderCritical = defenderAction.critical;
                
                // Apply damage to attacker
                attacker.hp = Math.max(0, attacker.hp - defenderAction.damage);
                
                turnLog.descriptions.push(
                    `⚔️ **${defender.displayName}** counters with **${defenderFruit.name}** (${defenderFruit.element})!`
                );
                turnLog.descriptions.push(defenderAction.description);
                turnLog.descriptions.push(
                    `💥 Deals **${defenderAction.damage}** damage! ${attacker.name}: ${attacker.hp}/${attacker.maxHP} HP`
                );
            } else {
                turnLog.descriptions.push(`💀 **${defender.displayName}** is knocked out!`);
            }
        }
        
        // Rotate attacker's fruit for next turn
        attacker.currentFruitIndex = (attacker.currentFruitIndex + 1) % attacker.topFruits.length;
        
        return turnLog;
    }

    // Calculate attack damage and effects
    calculateAttack(attackerFruit, defenderFruit, attackerCP) {
        // Base damage calculation
        const baseDamage = Math.floor(attackerFruit.effectiveCP * 0.15); // 15% of CP as base damage
        const cpBonus = Math.floor(attackerCP * 0.005); // Small total CP bonus
        let totalDamage = baseDamage + cpBonus;
        
        // Elemental advantage
        const elementalAdvantage = FakePlayerSystem.calculateElementalAdvantage(
            attackerFruit.element, 
            defenderFruit.element
        );
        totalDamage = Math.floor(totalDamage * elementalAdvantage);
        
        // Defender resistance
        const resistance = FakePlayerSystem.calculateResistance(attackerFruit.element, 'physical');
        const resistanceMultiplier = 1 - resistance;
        totalDamage = Math.floor(totalDamage * resistanceMultiplier);
        
        // Critical hit chance (5% base + rarity bonus)
        const critChance = 0.05 + (this.getRarityBonus(attackerFruit.rarity) * 0.02);
        const critical = Math.random() < critChance;
        if (critical) {
            totalDamage = Math.floor(totalDamage * 1.5);
        }
        
        // Minimum 1 damage
        totalDamage = Math.max(1, totalDamage);
        
        // Generate description
        let description = FakePlayerSystem.getCombatDescription(
            attackerFruit.element, 
            defenderFruit.element, 
            elementalAdvantage
        );
        
        if (resistance > 0.3) {
            description += ` 🛡️ High resistance reduces damage by ${Math.round(resistance * 100)}%!`;
        } else if (resistance < -0.1) {
            description += ` 💔 Weakness increases damage by ${Math.round(Math.abs(resistance) * 100)}%!`;
        }
        
        if (critical) {
            description += ` ⭐ **CRITICAL HIT!** Damage increased by 50%!`;
        }
        
        return {
            damage: totalDamage,
            elementalAdvantage: elementalAdvantage,
            resistance: resistance,
            critical: critical,
            description: description,
            baseDamage: baseDamage,
            cpBonus: cpBonus
        };
    }

    // Calculate final combat result
    calculateCombatResult(attackerWins, attacker, defender) {
        const result = {
            victory: attackerWins,
            winner: attackerWins ? attacker.name : defender.displayName,
            loser: attackerWins ? defender.displayName : attacker.name,
            finalHP: {
                attacker: attacker.hp,
                defender: defender.currentHP
            },
            rewards: {
                berries: 0,
                fruits: []
            }
        };

        if (attackerWins) {
            // Calculate stolen berries (10-50% of fake player's berries)
            const EconomyConfig = require('../config/economy');
            const berryStealRange = EconomyConfig.getBerryStealRange();
            const stealPercentage = berryStealRange.min + 
                Math.random() * (berryStealRange.max - berryStealRange.min);
            const stolenBerries = Math.floor(defender.berries * stealPercentage);
            
            result.rewards.berries = stolenBerries;
            FakePlayerSystem.adjustBerries(-stolenBerries);
            
            // Try to steal fruits (15% chance each, max 3)
            const maxFruits = EconomyConfig.maxFruitsStolen;
            const stealChance = EconomyConfig.fruitStealChance;
            
            for (let i = 0; i < maxFruits; i++) {
                if (Math.random() < stealChance) {
                    const stolenFruit = FakePlayerSystem.loseRandomFruit();
                    if (stolenFruit) {
                        result.rewards.fruits.push(stolenFruit);
                    }
                }
            }
            
            result.message = `🏆 **VICTORY!** You defeated ${defender.displayName} in epic combat!`;
        } else {
            result.message = `💀 **DEFEAT!** ${defender.displayName} proved too powerful in battle!`;
        }

        return result;
    }

    // Get element from fruit data
    getElementFromFruit(fruit) {
        // Simple element assignment based on fruit type and name
        const name = fruit.name.toLowerCase();
        
        if (name.includes('mera') || name.includes('fire')) return 'fire';
        if (name.includes('hie') || name.includes('ice')) return 'ice';
        if (name.includes('goro') || name.includes('lightning')) return 'lightning';
        if (name.includes('suna') || name.includes('sand')) return 'earth';
        if (name.includes('mizu') || name.includes('water')) return 'water';
        if (name.includes('zushi') || name.includes('gravity')) return 'gravity';
        if (name.includes('yomi') || name.includes('soul')) return 'soul';
        if (name.includes('hana')) return 'plant';
        if (name.includes('moku') || name.includes('smoke')) return 'wind';
        if (name.includes('pika') || name.includes('light')) return 'light';
        if (name.includes('yami') || name.includes('darkness')) return 'dark';
        if (name.includes('magu') || name.includes('magma')) return 'fire';
        
        // Default based on type
        if (fruit.type === 'Logia') return 'elemental';
        if (fruit.type === 'Zoan') return 'physical';
        return 'neutral';
    }

    // Get rarity bonus for critical hits
    getRarityBonus(rarity) {
        const rarityMap = {
            'common': 0,
            'uncommon': 1,
            'rare': 2,
            'epic': 3,
            'legendary': 4,
            'mythical': 5,
            'omnipotent': 6
        };
        return rarityMap[rarity] || 0;
    }

    // Format combat log for display
    formatCombatLog(combatLog) {
        if (combatLog.error) {
            return {
                title: '❌ Combat Error',
                description: combatLog.message,
                color: 0xFF0000
            };
        }

        const embed = {
            title: '⚔️ Turn-Based Combat Results',
            description: `**${combatLog.attacker.name}** VS **${combatLog.defender.name}**`,
            color: combatLog.result.victory ? 0x00FF00 : 0xFF0000,
            fields: [],
            footer: {
                text: `Combat completed in ${combatLog.turns.length} turn(s)`
            }
        };

        // Add turn-by-turn breakdown
        combatLog.turns.forEach((turn, index) => {
            const turnDesc = turn.descriptions.join('\n');
            embed.fields.push({
                name: `🎯 Turn ${turn.turn}`,
                value: turnDesc,
                inline: false
            });
        });

        // Add final result
        embed.fields.push({
            name: '🏁 Final Result',
            value: combatLog.result.message,
            inline: false
        });

        // Add rewards if victory
        if (combatLog.result.victory && (combatLog.result.rewards.berries > 0 || combatLog.result.rewards.fruits.length > 0)) {
            let rewardsText = '';
            if (combatLog.result.rewards.berries > 0) {
                rewardsText += `💰 **${combatLog.result.rewards.berries.toLocaleString()} berries** stolen!\n`;
            }
            if (combatLog.result.rewards.fruits.length > 0) {
                rewardsText += `🍈 **${combatLog.result.rewards.fruits.length} Devil Fruit(s)** stolen:\n`;
                combatLog.result.rewards.fruits.forEach(fruit => {
                    rewardsText += `• ${fruit.name} (${fruit.rarity})\n`;
                });
            }
            
            embed.fields.push({
                name: '💎 Loot Obtained',
                value: rewardsText,
                inline: false
            });
        }

        // Add combat statistics
        const stats = combatLog.summary;
        embed.fields.push({
            name: '📊 Combat Statistics',
            value: `**Damage Dealt:** ${stats.totalDamageDealt}\n**Damage Received:** ${stats.totalDamageReceived}\n**Elemental Advantages:** ${stats.elementalAdvantages}\n**Critical Hits:** ${stats.criticalHits}`,
            inline: true
        });

        return embed;
    }
}

module.exports = new TurnBasedCombat();
