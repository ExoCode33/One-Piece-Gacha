const DatabaseManager = require('../database/manager');
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

    // NPC Combat with animations
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

    // PvP Combat with animations
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
            'goro goro no mi': 'lightning',
            'uo uo no mi': 'water',
            'pika pika no mi': 'light',
            'yami yami no mi': 'darkness',
            'suna suna no mi': 'earth',
            'gomu gomu no mi': 'neutral',
            'buku buku no mi': 'neutral',
            'nagi nagi no mi': 'neutral',
            'yomi yomi no mi': 'neutral'
        };

        const lowerName = fruitName.toLowerCase();
        return elementMap[lowerName] || 'neutral';
    }

    calculateDamage(attackerCP, attackerFruit, defenderFruit, defenderMaxHP, isBlocked = false, isResisted = false) {
        if (isBlocked) return 0;

        const baseDamage = Math.floor(attackerCP * 0.04);
        const variation = 0.8 + Math.random() * 0.4;
        let damage = Math.floor(baseDamage * variation);

        if (isResisted) {
            damage = Math.floor(damage * 0.5);
        }

        const maxDamage = Math.floor(defenderMaxHP * 0.15);
        damage = Math.min(damage, maxDamage);

        return Math.max(damage, 5);
    }

    getDefenseDetails(attackerElement, defenderFruit, blocked, resisted, originalDamage, finalDamage) {
        const defenderElement = this.getFruitElement(defenderFruit.fruit_name);

        if (blocked) {
            return {
                type: 'PERFECT BLOCK',
                description: `${defenderFruit.fruit_name} (${defenderElement.toUpperCase()}) completely blocks the ${attackerElement.toUpperCase()} attack!`,
                effectiveness: 'Perfect Defense - 100% damage negation',
                icon: '🛡️',
                color: 0x87CEEB
            };
        } else if (resisted) {
            return {
                type: 'ELEMENTAL RESISTANCE',
                description: `${defenderFruit.fruit_name} (${defenderElement.toUpperCase()}) resists the ${attackerElement.toUpperCase()} attack!`,
                effectiveness: `Damage Reduced: ${originalDamage} → ${finalDamage} (50% reduction)`,
                icon: '🔄',
                color: 0xFFA500
            };
        } else {
            return {
                type: 'DIRECT HIT',
                description: `No defense against ${attackerElement.toUpperCase()} attack!`,
                effectiveness: `Full damage dealt: ${finalDamage}`,
                icon: '💥',
                color: 0xFF6B35
            };
        }
    }

    createHPBar(currentHP, maxHP) {
        const percentage = (currentHP / maxHP) * 100;
        const barLength = 20;
        const filledBars = Math.floor((currentHP / maxHP) * barLength);
        const emptyBars = barLength - filledBars;

        let bar = '';
        let color = '';

        if (percentage > 75) {
            bar = '🟢'.repeat(filledBars) + '⬜'.repeat(emptyBars);
            color = 'Excellent';
        } else if (percentage > 50) {
            bar = '🟡'.repeat(filledBars) + '⬜'.repeat(emptyBars);
            color = 'Good';
        } else if (percentage > 25) {
            bar = '🟠'.repeat(filledBars) + '⬜'.repeat(emptyBars);
            color = 'Damaged';
        } else {
            bar = '🔴'.repeat(filledBars) + '⬜'.repeat(emptyBars);
            color = 'Critical';
        }

        return {
            bar,
            percentage: Math.floor(percentage),
            status: color,
            text: `${currentHP}/${maxHP} HP (${Math.floor(percentage)}%)`
        };
    }

    // Ship animation frames for combat
    getShipAnimationFrames() {
        const ship = [
            "      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀",
            "⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀",
            "⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀",
            "⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀",
            "⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀",
            "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀"
        ];

        const maxWidth = 62;
        const totalFrames = maxWidth - 12;
        const frames = [];
        for (let offset = 0; offset < totalFrames; offset++) {
            const paddedShip = ship.map(line => {
                let lpad = " ".repeat(offset);
                return (lpad + line).slice(0, maxWidth);
            });
            frames.push({
                title: offset === 0
                    ? "🌊 **A ship appears on the horizon...**"
                    : offset === totalFrames-1
                        ? "🌊 **The ship disappears into the mist...**"
                        : "🌊 **The ship sails...**",
                content: "```" + paddedShip.join('\n') + "```"
            });
        }
        return frames;
    }

    // Check if user can defend against attack
    canDefend(attackerElement, defenderFruit) {
        const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
        
        // Perfect block chance (very rare)
        if (Math.random() < 0.05) { // 5% chance
            return { blocked: true, resisted: false };
        }
        
        // Elemental resistance
        if (this.elementalResistances[defenderElement]?.includes(attackerElement)) {
            return { blocked: false, resisted: true };
        }
        
        return { blocked: false, resisted: false };
    }

    // Calculate battle turn
    async executeBattleTurn(attacker, defender, attackerFruit, defenderFruit) {
        const attackerElement = this.getFruitElement(attackerFruit.fruit_name);
        const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
        
        const defense = this.canDefend(attackerElement, defenderFruit);
        const originalDamage = this.calculateDamage(
            attacker.totalCP, 
            attackerFruit, 
            defenderFruit, 
            defender.maxHP
        );
        
        let finalDamage = originalDamage;
        if (defense.blocked) {
            finalDamage = 0;
        } else if (defense.resisted) {
            finalDamage = Math.floor(originalDamage * 0.5);
        }
        
        return {
            damage: finalDamage,
            originalDamage,
            blocked: defense.blocked,
            resisted: defense.resisted,
            attackerElement,
            defenderElement,
            defenseDetails: this.getDefenseDetails(
                attackerElement, 
                defenderFruit, 
                defense.blocked, 
                defense.resisted, 
                originalDamage, 
                finalDamage
            )
        };
    }

    // Get random fruit for combat
    getRandomCombatFruit(fruits) {
        if (!fruits || fruits.length === 0) {
            return {
                fruit_name: 'Basic Fighting',
                rarity: 'common',
                duplicate_count: 1
            };
        }
        
        return fruits[Math.floor(Math.random() * fruits.length)];
    }

    // Format combat power for display
    formatCombatPower(cp) {
        if (cp >= 1000000) {
            return `${(cp / 1000000).toFixed(1)}M`;
        } else if (cp >= 1000) {
            return `${(cp / 1000).toFixed(1)}K`;
        }
        return cp.toString();
    }

    // Get power level description
    getPowerLevel(cp) {
        if (cp >= 10000) return 'Yonko Level';
        if (cp >= 5000) return 'Admiral Level';
        if (cp >= 2500) return 'Vice Admiral';
        if (cp >= 1000) return 'Captain Level';
        if (cp >= 500) return 'Officer Level';
        if (cp >= 100) return 'Soldier Level';
        return 'Rookie Level';
    }

    // Calculate critical hit chance
    calculateCriticalHit(attackerCP, defenderCP) {
        const baseCritChance = 0.15; // 15% base
        const powerDifference = attackerCP - defenderCP;
        const bonusCrit = Math.max(0, powerDifference / 10000); // 1% per 10k CP difference
        
        return Math.random() < (baseCritChance + bonusCrit);
    }

    // Get battle result message
    getBattleResultMessage(victory, powerRatio) {
        if (victory) {
            if (powerRatio > 2) {
                return "🏆 **OVERWHELMING VICTORY!** Your superior power crushed the enemy!";
            } else if (powerRatio > 1.5) {
                return "⚔️ **DECISIVE VICTORY!** Your strength proved superior!";
            } else {
                return "🥊 **HARD-FOUGHT VICTORY!** You barely managed to overcome your opponent!";
            }
        } else {
            if (powerRatio < 0.5) {
                return "💥 **CRUSHING DEFEAT!** You were no match for their power!";
            } else if (powerRatio < 0.7) {
                return "😵 **CLEAR DEFEAT!** Their strength overwhelmed you!";
            } else {
                return "😤 **NARROW DEFEAT!** You fought well but came up short!";
            }
        }
    }
}

console.log('🔧 Creating combat instance...');
const combatInstance = new CombatSystem();
console.log('🔧 Combat instance created with methods:', Object.getOwnPropertyNames(combatInstance));

module.exports = combatInstance;
