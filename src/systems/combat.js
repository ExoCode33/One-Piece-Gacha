// ENHANCED COMBAT SYSTEM WITH FULL DETAILS
// All fruits attack, detailed defense system, ASCII ship animation

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
            'goro goro no mi': 'lightning',
            'suna suna no mi': 'earth',
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

    getCritChance(rarity) {
        const critChances = {
            common: 0.05,
            uncommon: 0.08,
            rare: 0.12,
            epic: 0.16,
            legendary: 0.20,
            mythical: 0.25,
            omnipotent: 0.30
        };
        return critChances[rarity?.toLowerCase()] || 0.05;
    }

    calculateDamage(attackerCP, attackerFruit, defenderFruit, defenderMaxHP, defenseInfo) {
        const baseDamage = Math.floor(attackerCP * 0.04);
        const variation = 0.8 + Math.random() * 0.4;
        let damage = Math.floor(baseDamage * variation);
        
        // Apply elemental advantages/disadvantages
        const attackerElement = this.getFruitElement(attackerFruit.fruit_name);
        const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
        
        let elementalMultiplier = 1.0;
        if (this.elementalAdvantages[attackerElement]?.includes(defenderElement)) {
            elementalMultiplier = 1.5; // 50% bonus for advantage
            damage = Math.floor(damage * elementalMultiplier);
        } else if (this.elementalAdvantages[defenderElement]?.includes(attackerElement)) {
            elementalMultiplier = 0.7; // 30% reduction for disadvantage
            damage = Math.floor(damage * elementalMultiplier);
        }
        
        // Critical hit chance
        const critChance = this.getCritChance(attackerFruit.rarity);
        const isCritical = Math.random() < critChance;
        if (isCritical) {
            damage = Math.floor(damage * 1.3);
        }
        
        // Apply blocking/resistance
        if (defenseInfo.isBlocked) {
            damage = 0; // Complete block
        } else if (defenseInfo.isResisted) {
            damage = Math.floor(damage * 0.5); // 50% damage reduction
        }
        
        const maxDamage = Math.floor(defenderMaxHP * 0.15);
        damage = Math.min(damage, maxDamage);
        
        return {
            damage: Math.max(damage, defenseInfo.isBlocked ? 0 : 1),
            elementalMultiplier,
            isCritical,
            attackerElement,
            defenderElement
        };
    }

    // Your exact ASCII ship animation
    getShipFrames() {
        return [
            `🌊 **⚓ Battle Ship Setting Sail!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **🚢 Ship Sailing to Combat Zone!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀\n⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀\n⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀\n⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **⚔️ Ship Entering Battle Zone!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀\n⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀\n⠀⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀\n⠀⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **🏴‍☠️ Battle Ship Ready for War!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀\n⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀\n⠀⠀⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠\n⠀⠀⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``
        ];
    }

    // Analyze defense for detailed blocking/resistance information
    analyzeDefense(attackerFruit, defenderFruits) {
        const attackerElement = this.getFruitElement(attackerFruit.fruit_name);
        let bestDefense = { isBlocked: false, isResisted: false, defendingFruit: null, defenseType: 'none' };
        
        for (const defenderFruit of defenderFruits) {
            const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
            const resistances = this.elementalResistances[defenderElement] || [];
            
            // Check for complete block (perfect resistance)
            if (resistances.includes(attackerElement)) {
                bestDefense = {
                    isBlocked: true,
                    isResisted: false,
                    defendingFruit: defenderFruit,
                    defenseType: 'perfect_block',
                    defenderElement
                };
                break; // Perfect block takes priority
            }
            
            // Check for partial resistance (elemental disadvantage)
            if (this.elementalAdvantages[defenderElement]?.includes(attackerElement)) {
                bestDefense = {
                    isBlocked: false,
                    isResisted: true,
                    defendingFruit: defenderFruit,
                    defenseType: 'resistance',
                    defenderElement
                };
            }
        }
        
        return bestDefense;
    }

    // Show detailed defense information
    getDefenseDescription(defenseInfo, attackerElement) {
        if (defenseInfo.isBlocked) {
            return {
                title: '🛡️ **PERFECT DEFENSE!**',
                description: `**${defenseInfo.defendingFruit.fruit_name}** (${defenseInfo.defenderElement.toUpperCase()}) completely blocks the ${attackerElement.toUpperCase()} attack!`,
                effectiveness: 'COMPLETE BLOCK',
                damageReduction: '100%',
                color: 0x87CEEB
            };
        } else if (defenseInfo.isResisted) {
            return {
                title: '🛡️ **ELEMENTAL RESISTANCE!**',
                description: `**${defenseInfo.defendingFruit.fruit_name}** (${defenseInfo.defenderElement.toUpperCase()}) resists the ${attackerElement.toUpperCase()} attack!`,
                effectiveness: 'DAMAGE REDUCED',
                damageReduction: '50%',
                color: 0xFFD700
            };
        } else {
            return {
                title: '💥 **NO DEFENSE!**',
                description: `No fruits can defend against this ${attackerElement.toUpperCase()} attack!`,
                effectiveness: 'FULL DAMAGE',
                damageReduction: '0%',
                color: 0xFF6B35
            };
        }
    }

    // Enhanced combat with ALL fruits attacking and detailed defense
    async performAllFruitsCombat(attackerFruits, defenderFruits, attackerCP, defenderHP, defenderMaxHP, attackerName, defenderName, interaction, turn) {
        const totalFruits = attackerFruits.length; // Use ALL fruits, not just 3
        let currentDefenderHP = defenderHP;
        let totalDamage = 0;
        let totalBlocked = 0;
        let totalResisted = 0;

        // Show preparation with ALL fruits
        // Show preparation with ALL fruits
        const prepEmbed = {
            title: `⚔️ **TURN ${turn} - ALL DEVIL FRUITS UNLEASHED!**`,
            description: `**${attackerName}** unleashes **ALL ${totalFruits} Devil Fruits** in a devastating barrage!`,
            fields: [
                { 
                    name: '🍈 Attacking Fruits', 
                    value: attackerFruits.slice(0, 8).map(f => f.fruit_name).join('\n') + (totalFruits > 8 ? `\n...and ${totalFruits - 8} more!` : ''), 
                    inline: true 
                },
                { 
                    name: '🛡️ Defending Fruits', 
                    value: defenderFruits.slice(0, 8).map(f => f.fruit_name).join('\n'), 
                    inline: true 
                },
                { 
                    name: '🎯 Combat Info', 
                    value: `Target: ${defenderName}\nHP: ${currentDefenderHP}/${defenderMaxHP}\nTotal Attacks: ${totalFruits}`, 
                    inline: true 
                }
            ],
            color: 0x8A2BE2,
            timestamp: new Date().toISOString()
        };
        
        await interaction.editReply({ embeds: [prepEmbed] });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Execute ALL fruit attacks
        for (let i = 0; i < totalFruits && currentDefenderHP > 0; i++) {
            const attackerFruit = attackerFruits[i];
            const attackerElement = this.getFruitElement(attackerFruit.fruit_name);
            
            // Analyze defense in detail
            const defenseInfo = this.analyzeDefense(attackerFruit, defenderFruits);
            
            // Calculate damage with defense applied
            const damageResult = this.calculateDamage(attackerCP, attackerFruit, defenseInfo.defendingFruit || defenderFruits[0], defenderMaxHP, defenseInfo);
            
            const beforeHP = currentDefenderHP;
            currentDefenderHP = Math.max(0, currentDefenderHP - damageResult.damage);

            // Track statistics
            if (defenseInfo.isBlocked) {
                totalBlocked++;
            } else if (defenseInfo.isResisted) {
                totalResisted++;
            } else {
                totalDamage += damageResult.damage;
            }

            // Get detailed defense description
            const defenseDesc = this.getDefenseDescription(defenseInfo, attackerElement);

            // Show detailed attack animation
            const attackEmbed = {
                title: `⚔️ **ATTACK ${i + 1}/${totalFruits}** - ${defenseDesc.title}`,
                description: `**${attackerFruit.fruit_name}** (${attackerElement.toUpperCase()}) attacks!\n\n${defenseDesc.description}`,
                fields: [
                    { name: '🍈 Attacking Fruit', value: `${attackerFruit.fruit_name}\nElement: ${attackerElement.toUpperCase()}\nRarity: ${attackerFruit.rarity.toUpperCase()}`, inline: true },
                    { 
                        name: '🛡️ Defense Analysis', 
                        value: defenseInfo.defendingFruit ? 
                            `${defenseInfo.defendingFruit.fruit_name}\nElement: ${defenseInfo.defenderElement.toUpperCase()}\nType: ${defenseInfo.defenseType.replace('_', ' ').toUpperCase()}` :
                            'No defensive fruit\nType: NONE\nResult: DIRECT HIT', 
                        inline: true 
                    },
                    { 
                        name: '💥 Damage Report', 
                        value: `Original: ${Math.floor(attackerCP * 0.04 * (0.8 + Math.random() * 0.4))}\nFinal: **${damageResult.damage}**\nReduction: ${defenseDesc.damageReduction}`, 
                        inline: true 
                    }
                ],
                color: defenseDesc.color,
                timestamp: new Date().toISOString()
            };

            // Add HP bar visualization
            if (damageResult.damage > 0) {
                const hpPercentage = Math.round((currentDefenderHP / defenderMaxHP) * 100);
                const hpBarLength = 20;
                const filledBars = Math.round((currentDefenderHP / defenderMaxHP) * hpBarLength);
                const emptyBars = hpBarLength - filledBars;
                
                let hpBarColor = '🟢';
                if (hpPercentage <= 25) hpBarColor = '🔴';
                else if (hpPercentage <= 50) hpBarColor = '🟡';
                else if (hpPercentage <= 75) hpBarColor = '🟠';

                const hpBar = hpBarColor.repeat(filledBars) + '⬜'.repeat(emptyBars);
                
                attackEmbed.fields.push({
                    name: `💖 ${defenderName}'s Health`,
                    value: `${hpBar}\n**${beforeHP}** → **${currentDefenderHP}** / **${defenderMaxHP}** HP\n**${hpPercentage}%** remaining`,
                    inline: false
                });
            }

            // Add critical hit indicator
            if (damageResult.isCritical && damageResult.damage > 0) {
                attackEmbed.fields.push({
                    name: '⭐ Special Effect',
                    value: '**CRITICAL HIT!** +30% damage from rarity bonus!',
                    inline: false
                });
            }

            // Add elemental effectiveness
            if (damageResult.elementalMultiplier !== 1.0) {
                const effectType = damageResult.elementalMultiplier > 1.0 ? 'SUPER EFFECTIVE' : 'NOT VERY EFFECTIVE';
                const effectEmoji = damageResult.elementalMultiplier > 1.0 ? '🔥' : '💧';
                attackEmbed.fields.push({
                    name: `${effectEmoji} Elemental Effect`,
                    value: `**${effectType}**\n${attackerElement.toUpperCase()} vs ${damageResult.defenderElement.toUpperCase()}\nMultiplier: ${Math.round(damageResult.elementalMultiplier * 100)}%`,
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [attackEmbed] });
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (currentDefenderHP <= 0) {
                // Epic knockout animation
                const koEmbed = {
                    title: `💀 **ULTIMATE KNOCKOUT!**`,
                    description: `**${defenderName}** has been completely overwhelmed by **${attackerName}'s** devastating ${totalFruits}-fruit assault!`,
                    fields: [
                        { name: '🏆 Victor', value: attackerName, inline: true },
                        { name: '💥 Finishing Blow', value: `${attackerFruit.fruit_name}\n(Attack ${i + 1}/${totalFruits})`, inline: true },
                        { name: '⚡ Final Element', value: attackerElement.toUpperCase(), inline: true },
                        { 
                            name: '📊 Battle Statistics', 
                            value: `Total Attacks: ${i + 1}/${totalFruits}\nDamage Dealt: ${totalDamage + damageResult.damage}\nBlocked: ${totalBlocked}\nResisted: ${totalResisted}`, 
                            inline: false 
                        }
                    ],
                    color: 0x8B0000,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [koEmbed] });
                await new Promise(resolve => setTimeout(resolve, 4000));
                break;
            }
        }

        // Turn summary if battle continues
        if (currentDefenderHP > 0) {
            const summaryEmbed = {
                title: `📊 **TURN ${turn} COMPLETE - DEVASTATING BARRAGE!**`,
                description: `**${attackerName}** unleashed **${totalFruits} Devil Fruit attacks**!`,
                fields: [
                    { name: '🍈 Total Fruits Used', value: `${totalFruits}`, inline: true },
                    { name: '💥 Total Damage', value: `${totalDamage}`, inline: true },
                    { name: '🛡️ Perfect Blocks', value: `${totalBlocked}`, inline: true },
                    { name: '🔄 Resisted Attacks', value: `${totalResisted}`, inline: true },
                    { name: '✅ Successful Hits', value: `${totalFruits - totalBlocked - totalResisted}`, inline: true },
                    { name: '📈 Success Rate', value: `${Math.round(((totalFruits - totalBlocked - totalResisted) / totalFruits) * 100)}%`, inline: true },
                    { 
                        name: `💖 ${defenderName}'s Status`, 
                        value: `${currentDefenderHP}/${defenderMaxHP} HP (${Math.round((currentDefenderHP/defenderMaxHP)*100)}% remaining)`, 
                        inline: false 
                    }
                ],
                color: 0x4169E1,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [summaryEmbed] });
            await new Promise(resolve => setTimeout(resolve, 3500));
        }

        return {
            finalHP: currentDefenderHP,
            totalDamage,
            totalBlocked,
            totalResisted,
            attacksUsed: totalFruits
        };
    }

    // Enhanced NPC combat with ALL fruits and detailed defense
    async startNPCCombatWithAnimation(userId, username, interaction) {
        try {
            console.log(`🤖 Starting ENHANCED ALL-FRUITS NPC combat for ${username}`);
            
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
                { fruit_name: 'Hana Hana no Mi', rarity: 'uncommon' },
                { fruit_name: 'Goro Goro no Mi', rarity: 'legendary' }
            ];
            const npcCP = 2500; // Stronger NPC for balance

            const playerMaxHP = this.calculateTotalHP(userStats.totalCP);
            const npcMaxHP = this.calculateTotalHP(npcCP);
            let playerHP = playerMaxHP;
            let npcHP = npcMaxHP;

            console.log(`💖 Enhanced HP: Player ${playerMaxHP}HP (${userStats.totalCP} CP, ${userFruits.length} fruits) vs NPC ${npcMaxHP}HP (${npcCP} CP)`);

            // Epic ASCII ship animation
            const shipFrames = this.getShipFrames();
            for (let i = 0; i < shipFrames.length; i++) {
                await interaction.editReply({ content: shipFrames[i] });
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Enhanced battle arena setup
            const arenaEmbed = {
                title: `🏟️ **ULTIMATE BATTLE ARENA**`,
                description: `**${username}** vs **Monkey D. Tester**\n\n🔥 **ALL DEVIL FRUITS UNLEASHED!**`,
                fields: [
                    { 
                        name: '👤 Your Arsenal', 
                        value: `**${userStats.totalCP} CP**\n💖 ${playerHP}/${playerMaxHP} HP\n🍈 **${userFruits.length} Devil Fruits**\n⚡ ALL FRUITS ATTACK!`, 
                        inline: true 
                    },
                    { 
                        name: '🤖 NPC Arsenal', 
                        value: `**${npcCP} CP**\n💖 ${npcHP}/${npcMaxHP} HP\n🍈 **${npcFruits.length} Devil Fruits**\n🛡️ Advanced Defense`, 
                        inline: true 
                    },
                    { 
                        name: '🎮 Battle System', 
                        value: `**3 EPIC TURNS**\nAll-Fruit Combat\nDetailed Defense Analysis\nResistance System`, 
                        inline: true 
                    }
                ],
                color: 0x1E90FF,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [arenaEmbed] });
            await new Promise(resolve => setTimeout(resolve, 4000));

            let turn = 1;

            // 3 epic turns with ALL fruits
            while (turn <= 3 && playerHP > 0 && npcHP > 0) {
                // Player's ALL-FRUITS turn
                const playerResult = await this.performAllFruitsCombat(
                    userFruits, npcFruits, userStats.totalCP, npcHP, npcMaxHP,
                    username, "Monkey D. Tester", interaction, turn
                );
                
                npcHP = playerResult.finalHP;
                if (npcHP <= 0) break;

                // NPC's ALL-FRUITS turn  
                const npcResult = await this.performAllFruitsCombat(
                    npcFruits, userFruits, npcCP, playerHP, playerMaxHP,
                    "Monkey D. Tester", username, interaction, turn
                );
                
                playerHP = npcResult.finalHP;
                if (playerHP <= 0) break;

                turn++;
            }

            // Epic battle conclusion
            const victory = playerHP > npcHP;
            let berryReward = 0;

            if (victory) {
                berryReward = Math.floor(1000 + Math.random() * 1500); // Better rewards for harder battle
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `Epic All-Fruits NPC victory`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            const resultEmbed = {
                title: victory ? `🏆 **LEGENDARY ALL-FRUITS VICTORY!** 🏆` : `💀 **EPIC ALL-FRUITS DEFEAT!** 💀`,
                description: victory ? 
                    `**${username}** emerges victorious using **${userFruits.length} Devil Fruits** in an ULTIMATE battle!\n\n🎉 What an incredible display of multi-fruit mastery!` :
                    `**${username}** fought valiantly with **${userFruits.length} Devil Fruits** but **Monkey D. Tester** proves too powerful!\n\n⚔️ An epic battle worthy of legends!`,
                fields: [
                    { name: '👤 Your Final Status', value: `${playerHP}/${playerMaxHP} HP\n${Math.round((playerHP/playerMaxHP)*100)}% remaining\n${userFruits.length} fruits used`, inline: true },
                    { name: '🤖 NPC Final Status', value: `${npcHP}/${npcMaxHP} HP\n${Math.round((npcHP/npcMaxHP)*100)}% remaining\n${npcFruits.length} fruits used`, inline: true },
                    { name: '🎯 Battle Stats', value: `${turn} epic turns\nAll-fruits combat\nAdvanced defense\nResistance analysis`, inline: true }
                ],
                color: victory ? 0x00FF00 : 0xFF0000,
                timestamp: new Date().toISOString()
            };

            if (victory && berryReward > 0) {
                resultEmbed.fields.push({ 
                    name: '💰 Ultimate Reward', 
                    value: `**+${berryReward} berries**\nFor your legendary all-fruits victory!`, 
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
            console.error('Enhanced NPC combat error:', error);
            return {
                success: false,
                message: "❌ Combat system error occurred."
            };
        }
    }

    // Enhanced PvP combat with ALL fruits and detailed defense
    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        try {
            console.log(`⚔️ Starting ENHANCED ALL-FRUITS PvP: ${attackerName} vs ${defenderName}`);
            
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

            console.log(`💖 PvP All-Fruits: ${attackerName} ${attackerMaxHP}HP (${attackerFruits.length} fruits) vs ${defenderName} ${defenderMaxHP}HP (${defenderFruits.length} fruits)`);

            // Epic ASCII ship animation
            const shipFrames = this.getShipFrames();
            for (let i = 0; i < shipFrames.length; i++) {
                await interaction.editReply({ content: shipFrames[i] });
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Enhanced PvP arena setup
            const arenaEmbed = {
                title: `🏟️ **ULTIMATE PvP ALL-FRUITS ARENA**`,
                description: `**${attackerName}** vs **${defenderName}**\n\n🔥 **EVERY DEVIL FRUIT UNLEASHED!**`,
                fields: [
                    { 
                        name: '👤 Attacker Arsenal', 
                        value: `**${attackerStats.totalCP} CP**\n💖 ${attackerHP}/${attackerMaxHP} HP\n🍈 **${attackerFruits.length} Fruits**\n⚔️ ALL ATTACK!`, 
                        inline: true 
                    },
                    { 
                        name: '👥 Defender Arsenal', 
                        value: `**${defenderStats.totalCP} CP**\n💖 ${defenderHP}/${defenderMaxHP} HP\n🍈 **${defenderFruits.length} Fruits**\n🛡️ FULL DEFENSE!`, 
                        inline: true 
                    },
                    { 
                        name: '🎮 PvP System', 
                        value: `**3 EPIC TURNS**\nPlayer vs Player\nAll-Fruits Combat\nFull Defense Analysis`, 
                        inline: true 
                    }
                ],
                color: 0xFF1493,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [arenaEmbed] });
            await new Promise(resolve => setTimeout(resolve, 4000));

            let turn = 1;

            // 3 epic turns of all-fruits PvP
            while (turn <= 3 && attackerHP > 0 && defenderHP > 0) {
                // Attacker's ALL-FRUITS turn
                const attackerResult = await this.performAllFruitsCombat(
                    attackerFruits, defenderFruits, attackerStats.totalCP, defenderHP, defenderMaxHP,
                    attackerName, defenderName, interaction, turn
                );
                
                defenderHP = attackerResult.finalHP;
                if (defenderHP <= 0) break;

                // Defender's ALL-FRUITS counter-attack
                const defenderResult = await this.performAllFruitsCombat(
                    defenderFruits, attackerFruits, defenderStats.totalCP, attackerHP, attackerMaxHP,
                    defenderName, attackerName, interaction, turn
                );
                
                attackerHP = defenderResult.finalHP;
                if (attackerHP <= 0) break;

                turn++;
            }

            // Epic PvP conclusion
            const attackerVictory = attackerHP > defenderHP;
            let berryReward = 0;

            if (attackerVictory) {
                berryReward = Math.floor(500 + Math.random() * 1000);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(attackerId, berryReward, `Epic All-Fruits PvP victory`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            const resultEmbed = {
                title: attackerVictory ? `🏆 **${attackerName.toUpperCase()} ULTIMATE VICTORY!** 🏆` : `🏆 **${defenderName.toUpperCase()} ULTIMATE VICTORY!** 🏆`,
                description: attackerVictory ? 
                    `**${attackerName}** defeats **${defenderName}** using **${attackerFruits.length} Devil Fruits** in an ULTIMATE PvP battle!\n\n🎉 Incredible all-fruits mastery displayed!` :
                    `**${defenderName}** successfully defends against **${attackerName}** using **${defenderFruits.length} Devil Fruits**!\n\n⚔️ What a legendary all-fruits defensive performance!`,
                fields: [
                    { name: '👤 Attacker Final', value: `${attackerHP}/${attackerMaxHP} HP\n${Math.round((attackerHP/attackerMaxHP)*100)}%\n${attackerFruits.length} fruits`, inline: true },
                    { name: '👥 Defender Final', value: `${defenderHP}/${defenderMaxHP} HP\n${Math.round((defenderHP/defenderMaxHP)*100)}%\n${defenderFruits.length} fruits`, inline: true },
                    { name: '🎯 Battle Stats', value: `${turn} epic turns\nAll-fruits PvP\nFull defense analysis\nUltimate combat`, inline: true }
                ],
                color: attackerVictory ? 0x00FF00 : 0xFF6B35,
                timestamp: new Date().toISOString()
            };

            if (attackerVictory && berryReward > 0) {
                resultEmbed.fields.push({ 
                    name: '💰 Ultimate PvP Reward', 
                    value: `**+${berryReward} berries** for ${attackerName}'s all-fruits victory!`, 
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
            console.error('Enhanced PvP combat error:', error);
            return {
                success: false,
                message: "❌ PvP combat system error occurred."
            };
        }
    }
}

module.exports = new CombatSystem();
