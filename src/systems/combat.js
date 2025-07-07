// FULL ADVANCED COMBAT SYSTEM
// Professional game-like combat with multi-fruit attacks, animations, and detailed turns

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

        // Resistance matrix (what each element resists)
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
        const hpBonus = Math.floor(totalCP / 50); // +1 HP per 50 CP
        const maxHP = 800;
        return Math.min(baseHP + hpBonus, maxHP);
    }

    // Get user fruits with database auto-detection
    async getUserFruits(userId) {
        try {
            const possibleQueries = [
                'SELECT name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1',
                'SELECT fruit_name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1',
                'SELECT name, rarity, duplicates FROM user_devil_fruits WHERE user_id = $1'
            ];

            for (const query of possibleQueries) {
                try {
                    const result = await DatabaseManager.query(query, [userId]);
                    if (result.rows && result.rows.length > 0) {
                        console.log(`✅ Found fruits using query: ${query}`);
                        return result.rows.map(row => ({
                            fruit_name: row.name || row.fruit_name,
                            rarity: row.rarity,
                            duplicate_count: row.duplicate_count || row.duplicates || 1
                        }));
                    }
                } catch (err) {
                    continue;
                }
            }
            return [];
        } catch (error) {
            console.error('Error getting user fruits:', error);
            return [];
        }
    }

    // Get user combat stats
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
            console.error('Error getting user stats:', error);
            return { totalCP: 100, fruitCount: 0 };
        }
    }

    // Get rarity-based CP
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

    // Check elemental advantage
    hasElementalAdvantage(attackerElement, defenderElement) {
        const advantages = this.elementalAdvantages[attackerElement] || [];
        return advantages.includes(defenderElement);
    }

    // Get critical hit chance based on rarity
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

    // Calculate balanced damage for multi-fruit system
    calculateDamage(attackerCP, attackerFruit, defenderFruit, defenderMaxHP, isBlocked = false) {
        if (isBlocked) return 0;
        
        // Base damage: 3% of CP (balanced for 3-turn battles)
        const baseDamage = Math.floor(attackerCP * 0.03);
        
        // Random variation (80-120%)
        const variation = 0.8 + Math.random() * 0.4;
        let damage = Math.floor(baseDamage * variation);
        
        // Elemental advantage bonus
        const attackerElement = this.getFruitElement(attackerFruit.fruit_name || attackerFruit.name);
        const defenderElement = this.getFruitElement(defenderFruit.fruit_name || defenderFruit.name);
        
        if (this.hasElementalAdvantage(attackerElement, defenderElement)) {
            damage = Math.floor(damage * 1.4); // 40% bonus
        }
        
        // Critical hit chance
        const critChance = this.getCritChance(attackerFruit.rarity);
        if (Math.random() < critChance) {
            damage = Math.floor(damage * 1.3); // 30% crit bonus
        }
        
        // Cap damage at 12% of defender's max HP per hit
        const maxDamage = Math.floor(defenderMaxHP * 0.12);
        damage = Math.min(damage, maxDamage);
        
        return Math.max(damage, 5); // Minimum 5 damage
    }

    // Ship animation frames (your exact ship moving left to right)
    getShipFrames() {
        return [
            `🌊 **⚓ Pirate Ship Setting Sail!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **🚢 Ship Sailing to Battle Zone!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀\n⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀\n⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀\n⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **⚔️ Entering Combat Zone!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀\n⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀\n⠀⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀\n⠀⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **🏴‍☠️ Battle Ship Ready for War!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀\n⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀\n⠀⠀⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠\n⠀⠀⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``
        ];
    }

    // Professional hit animation with detailed impact
    async showDetailedHitAnimation(interaction, attackerName, defenderName, damage, beforeHP, afterHP, maxHP, fruitUsed, elementType, isBlocked, isCritical, turn, attackNumber) {
        try {
            const hitEffects = {
                fire: '🔥💥🔥',
                ice: '❄️💥❄️', 
                plant: '🌿💥🌿',
                earth: '🪨💥🪨',
                water: '💧💥💧',
                lightning: '⚡💥⚡',
                gravity: '🌌💥🌌',
                light: '✨💥✨',
                darkness: '🌑💥🌑',
                neutral: '💥⚡💥'
            };

            const hitEffect = hitEffects[elementType] || '💥⚡💥';

            // Calculate HP bar
            const hpPercentage = Math.round((afterHP / maxHP) * 100);
            const hpBarLength = 20;
            const filledBars = Math.round((afterHP / maxHP) * hpBarLength);
            const emptyBars = hpBarLength - filledBars;
            
            let hpBarColor = '🟢';
            if (hpPercentage <= 25) hpBarColor = '🔴';
            else if (hpPercentage <= 50) hpBarColor = '🟡';
            else if (hpPercentage <= 75) hpBarColor = '🟠';

            const hpBar = hpBarColor.repeat(filledBars) + '⬜'.repeat(emptyBars);

            if (isBlocked) {
                // Blocked attack
                const blockEmbed = {
                    title: `🛡️ **ATTACK ${attackNumber} BLOCKED!**`,
                    description: `**${attackerName}** attacks with **${fruitUsed}**!\n\n🛡️ **PERFECT DEFENSE!** Attack completely blocked!`,
                    fields: [
                        { name: '🍈 Fruit Used', value: `${fruitUsed} (${elementType.toUpperCase()})`, inline: true },
                        { name: '🛡️ Result', value: `**BLOCKED**`, inline: true },
                        { name: '💖 HP', value: `${afterHP}/${maxHP}`, inline: true }
                    ],
                    color: 0x87CEEB,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [blockEmbed] });
                await new Promise(resolve => setTimeout(resolve, 1500));
                
            } else {
                // Wind-up phase
                const windupEmbed = {
                    title: `⚔️ **TURN ${turn} - ATTACK ${attackNumber}!**`,
                    description: `**${attackerName}** charges up **${fruitUsed}**!`,
                    fields: [
                        { name: '🍈 Devil Fruit', value
