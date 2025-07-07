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

    async performAdvancedCombat(attackerFruits, defenderFruits, attackerCP, defenderHP, defenderMaxHP, attackerName, defenderName, interaction, turn) {
        const totalFruits = attackerFruits.length;
        let currentDefenderHP = defenderHP;
        let totalDamage = 0;
        let attacksBlocked = 0;
        let attacksResisted = 0;
        let successfulAttacks = 0;

        // Show preparation with ALL fruits
        const prepEmbed = {
            title: `⚔️ **TURN ${turn} - ALL DEVIL FRUITS UNLEASHED!**`,
            description: `**${attackerName}** unleashes **ALL ${totalFruits} Devil Fruits** in a devastating barrage!`,
            fields: [
                { name: '🍈 Attacking Fruits', value: attackerFruits.slice(0, 5).map(f => f.fruit_name).join('\n') + (totalFruits > 5 ? `\n+${totalFruits - 5} more...` : ''), inline: true },
                { name: '🛡️ Defending Fruits', value: defenderFruits.slice(0, 5).map(f => f.fruit_name).join('\n') + (defenderFruits.length > 5 ? `\n+${defenderFruits.length - 5} more...` : ''), inline: true },
                { name: '🎯 Combat Info', value: `Target: ${defenderName}\nHP: ${currentDefenderHP}/${defenderMaxHP}\nTotal Attacks: ${totalFruits}`, inline: true }
            ],
            color: 0x8A2BE2,
            timestamp: new Date().toISOString()
        };

        await interaction.editReply({ embeds: [prepEmbed] });
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Execute ALL fruit attacks
        for (let i = 0; i < totalFruits && currentDefenderHP > 0; i++) {
            const attackerFruit = attackerFruits[i];
            const attackerElement = this.getFruitElement(attackerFruit.fruit_name);

            // Check for blocking and resistance
            let blocked = false;
            let resisted = false;
            let blockingFruit = null;

            for (const defenderFruit of defenderFruits) {
                const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
                const resistances = this.elementalResistances[defenderElement] || [];

                if (resistances.includes(attackerElement)) {
                    if (Math.random() < 0.3) { // 30% chance for perfect block
                        blocked = true;
                        blockingFruit = defenderFruit;
                        break;
                    } else { // Otherwise just resistance
                        resisted = true;
                        blockingFruit = defenderFruit;
                        break;
                    }
                }
            }

            const originalDamage = this.calculateDamage(attackerCP, attackerFruit, defenderFruits[0], defenderMaxHP, false, false);
            const finalDamage = this.calculateDamage(attackerCP, attackerFruit, defenderFruits[0], defenderMaxHP, blocked, resisted);
            currentDefenderHP = Math.max(0, currentDefenderHP - finalDamage);

            // Track statistics
            if (blocked) {
                attacksBlocked++;
            } else if (resisted) {
                attacksResisted++;
                totalDamage += finalDamage;
                successfulAttacks++;
            } else {
                totalDamage += finalDamage;
                successfulAttacks++;
            }

            // Get defense details
            const defenseInfo = this.getDefenseDetails(attackerElement, blockingFruit || defenderFruits[0], blocked, resisted, originalDamage, finalDamage);
            const hpBar = this.createHPBar(currentDefenderHP, defenderMaxHP);

            // Show detailed attack animation
            const attackEmbed = {
                title: `${defenseInfo.icon} **ATTACK ${i + 1}/${totalFruits} - ${defenseInfo.type}!**`,
                description: defenseInfo.description,
                fields: [
                    { name: '🍈 Attacking Fruit', value: `${attackerFruit.fruit_name}\nElement: ${attackerElement.toUpperCase()}\nRarity: ${attackerFruit.rarity.toUpperCase()}`, inline: true },
                    { name: '🛡️ Defense Analysis', value: blockingFruit ? `${blockingFruit.fruit_name}\nElement: ${this.getFruitElement(blockingFruit.fruit_name).toUpperCase()}\nType: ${defenseInfo.type}` : `No Defense\nElement: NONE\nType: VULNERABLE`, inline: true },
                    { name: '💥 Damage Report', value: blocked ? `Original: ${originalDamage}\nFinal: 0\nReduction: 100%` : `Original: ${originalDamage}\nFinal: ${finalDamage}\nReduction: ${Math.floor(((originalDamage - finalDamage) / originalDamage) * 100)}%`, inline: true },
                    { name: '💖 Health Status', value: `${hpBar.bar}\n${hpBar.text}\nStatus: ${hpBar.status}`, inline: false }
                ],
                color: defenseInfo.color,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [attackEmbed] });
            await new Promise(resolve => setTimeout(resolve, 1800));

            if (currentDefenderHP <= 0) {
                const koEmbed = {
                    title: `💀 **KNOCKOUT!**`,
                    description: `**${defenderName}** has been defeated by **${attackerName}**'s overwhelming assault!`,
                    fields: [
                        { name: '⚰️ Final Blow', value: `${attackerFruit.fruit_name} (${attackerElement.toUpperCase()})`, inline: true },
