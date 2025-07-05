// TURN-BASED COMBAT SYSTEM
// 3-turn auto combat with elemental advantages and resistances

const FakePlayerSystem = require('../data/fakeplayer');
const BerryEconomySystem = require('./economy');
const DatabaseManager = require('../database/manager');
const EconomyConfig = require('../config/economy');
const ActivityLogger = require('./logger');

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
            'gravity': ['all'], // Gravity affects everything
            'soul': ['neutral'],
            'neutral': [] // No advantages
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
        
        // Fire types
        if (name.includes('mera') || name.includes('fire') || name.includes('flame')) return 'fire';
        
        // Ice types
        if (name.includes('hie') || name.includes('ice') || name.includes('snow') || name.includes('freeze')) return 'ice';
        
        // Plant types
        if (name.includes('hana') || name.includes('plant') || name.includes('flower') || name.includes('tree')) return 'plant';
        
        // Earth types
        if (name.includes('suna') || name.includes('earth') || name.includes('sand') || name.includes('rock')) return 'earth';
        
        // Water types
        if (name.includes('mizu') || name.includes('water') || name.includes('aqua')) return 'water';
        
        // Lightning types
        if (name.includes('goro') || name.includes('denki') || name.includes('lightning') || name.includes('thunder')) return 'lightning';
        
        // Darkness types
        if (name.includes('yami') || name.includes('dark') || name.includes('shadow') || name.includes('kage')) return 'darkness';
        
        // Light types
        if (name.includes('pika') || name.includes('light') || name.includes('beam')) return 'light';
        
        // Gravity types
        if (name.includes('zushi') || name.includes('gravity')) return 'gravity';
        
        // Soul types
        if (name.includes('yomi') || name.includes('soul') || name.includes('spirit')) return 'soul';
        
        return 'neutral';
    }

    // Calculate elemental effectiveness
    calculateElementalMultiplier(attackerElement, defenderElement) {
        if (attackerElement === 'gravity') {
            return EconomyConfig.elementalAdvantageBonus; // Gravity is always effective
        }
        
        if (this.elementalAdvantages[attackerElement]?.includes(defenderElement)) {
            return EconomyConfig.elementalAdvantageBonus; // 1.5x damage
        }
        
        if (this.elementalAdvantages[defenderElement]?.includes(attackerElement)) {
            return 1 / EconomyConfig.elementalAdvantageBonus; // 0.67x damage (resistance)
        }
        
        return 1.0; // Neutral damage
    }

    // Calculate damage for one attack
    calculateDamage(attackerCP, attackerFruit, defenderFruit) {
        const baseDamage = attackerCP * EconomyConfig.baseDamageMultiplier;
        
        const attackerElement = this.getElementalType(attackerFruit.name);
        const defenderElement = this.getElementalType(defenderFruit.name);
        
        const elementalMultiplier = this.calculateElementalMultiplier(attackerElement, defenderElement);
        
        // Check for critical hit
        const critChance = this.rarityCritChances[attackerFruit.rarity] || EconomyConfig.criticalHitChance;
        const isCritical = Math.random() < critChance;
        const critMultiplier = isCritical ? EconomyConfig.criticalHitMultiplier : 1.0;
        
        const finalDamage = Math.floor(baseDamage * elementalMultiplier * critMultiplier);
        
        return {
            damage: Math.max(1, finalDamage), // Minimum 1 damage
            elementalMultiplier,
            isCritical,
            attackerElement,
            defenderElement
        };
    }

    // Get description for elemental interaction
    getElementalDescription(attackerElement, defenderElement, multiplier) {
        if (multiplier > 1.0) {
            return `🔥 ELEMENTAL ADVANTAGE! ${attackerElement} is super effective against ${defenderElement}!`;
        } else if (multiplier < 1.0) {
            return `🛡️ ELEMENTAL RESISTANCE! ${defenderElement} resists ${attackerElement} attacks!`;
        } else {
            return `⚔️ NEUTRAL DAMAGE - No elemental advantage`;
        }
    }

    // Start NPC combat
    async startNPCCombat(userId, username) {
        try {
            // Get user's stats and fruits
            const userStats = await DatabaseManager.getUserStats(userId);
            if (userStats.totalCP === 0) {
                return {
                    success: false,
                    error: 'You need Devil Fruits to fight! Use `/pull` to get some first.'
                };
            }

            const userFruits = await DatabaseManager.getUserFruits(userId);
            if (!userFruits || userFruits.length === 0) {
                return {
                    success: false,
                    error: 'No Devil Fruits found in your collection!'
                };
            }

            // Get NPC data
            const npcData = FakePlayerSystem.getFakePlayer();
            
            // Initialize combat
            let playerHP = 100;
            let npcHP = 100;
            const combatLog = [];
            
            // Get random fruits for combat
            const getRandomFruit = (fruits) => fruits[Math.floor(Math.random() * fruits.length)];
            
            // 3 turns of combat
            for (let turn = 1; turn <= 3 && playerHP > 0 && npcHP > 0; turn++) {
                combatLog.push(`\n**🗡️ Turn ${turn}:**`);
                
                // Player attacks first
                const playerFruit = getRandomFruit(userFruits);
                const npcFruit = getRandomFruit(npcData.fruits);
                
                const playerAttack = this.calculateDamage(userStats.totalCP, playerFruit, npcFruit);
                npcHP = Math.max(0, npcHP - playerAttack.damage);
                
                combatLog.push(`🗡️ **${username}** attacks with **${playerFruit.name}** (${playerAttack.attackerElement})!`);
                combatLog.push(this.getElementalDescription(playerAttack.attackerElement, playerAttack.defenderElement, playerAttack.elementalMultiplier));
                
                if (playerAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** Damage increased by ${Math.round((EconomyConfig.criticalHitMultiplier - 1) * 100)}%!`);
                }
                
                combatLog.push(`💥 Deals **${playerAttack.damage}** damage! Monkey D. Tester: **${npcHP}/100 HP**`);
                
                if (npcHP <= 0) {
                    combatLog.push('🏆 **Monkey D. Tester is defeated!**');
                    break;
                }
                
                // NPC counter-attacks
                const npcPlayerFruit = getRandomFruit(userFruits);
                const npcAttackFruit = getRandomFruit(npcData.fruits);
                
                const npcAttack = this.calculateDamage(npcData.totalCP, npcAttackFruit, npcPlayerFruit);
                playerHP = Math.max(0, playerHP - npcAttack.damage);
                
                combatLog.push(`\n⚔️ **Monkey D. Tester** counters with **${npcAttackFruit.name}** (${npcAttack.attackerElement})!`);
                combatLog.push(this.getElementalDescription(npcAttack.attackerElement, npcAttack.defenderElement, npcAttack.elementalMultiplier));
                
                if (npcAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** Damage increased by ${Math.round((EconomyConfig.criticalHitMultiplier - 1) * 100)}%!`);
                }
                
                combatLog.push(`💥 Deals **${npcAttack.damage}** damage! **${username}**: **${playerHP}/100 HP**`);
                
                if (playerHP <= 0) {
                    combatLog.push('💀 **You are defeated!**');
                    break;
                }
            }
            
            // Determine result
            const result = playerHP > npcHP ? 'victory' : 'defeat';
            let rewards = null;
            
            // Calculate rewards for victory
            if (result === 'victory') {
                const berrySteal = Math.floor(npcData.berries * EconomyConfig.getRandomBerrySteal());
                const stolenFruits = [];
                
                // Try to steal fruits
                for (let i = 0; i < Math.min(EconomyConfig.maxFruitsStolen, npcData.fruits.length); i++) {
                    if (Math.random() < EconomyConfig.fruitStealChance) {
                        const randomFruit = npcData.fruits[Math.floor(Math.random() * npcData.fruits.length)];
                        stolenFruits.push(randomFruit);
                    }
                }
                
                rewards = {
                    berries: berrySteal,
                    fruits: stolenFruits
                };
                
                // Add berries to user
                if (berrySteal > 0) {
                    await BerryEconomySystem.addBerries(userId, berrySteal, `NPC raid victory vs Monkey D. Tester`);
                }
                
                // Add stolen fruits to user collection
                for (const fruit of stolenFruits) {
                    await DatabaseManager.addFruit(userId, fruit.id);
                }
                
                // Log the NPC raid
                try {
                    await ActivityLogger.logNPCRaid({
                        attacker: { id: userId, username },
                        result: 'victory',
                        damage: { player: 100 - playerHP, npc: 100 - npcHP },
                        rewards,
                        combatLog: combatLog.join('\n')
                    });
                } catch (logError) {
                    console.warn('Failed to log NPC raid:', logError.message);
                }
            }
            
            return {
                success: true,
                result,
                attackerHP: playerHP,
                defenderHP: npcHP,
                combatLog,
                rewards
            };
            
        } catch (error) {
            console.error('NPC combat error:', error);
            return {
                success: false,
                error: 'Combat system error. Please try again.'
            };
        }
    }

    // Calculate battle prediction (for PvP)
    calculateBattlePrediction(attackerCP, defenderCP) {
        const cpDifference = attackerCP - defenderCP;
        const baseChance = 50;
        
        // Each 100 CP difference = 5% win chance change
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
