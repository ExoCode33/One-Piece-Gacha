// ENHANCED ANIMATED COMBAT SYSTEM
// Multi-fruit attacks, resistance blocking, better CP scaling, and proper ship animation

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
            gravity: ['fire', 'ice', 'plant', 'earth', 'water', 'lightning'], // Gravity beats all
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
            gravity: [], // Gravity resists nothing
            light: ['darkness'],
            darkness: ['light']
        };
    }

    // Calculate total HP with much better CP scaling
    calculateTotalHP(totalCP) {
        const baseHP = 200;
        const hpBonus = Math.floor(totalCP / 50); // +1 HP per 50 CP (much more generous)
        const maxHP = 800; // Higher max HP
        return Math.min(baseHP + hpBonus, maxHP);
    }

    // Calculate balanced damage for multi-fruit system
    calculateDamage(attackerCP, attackerFruit, defenderFruit, defenderHP, isBlocked = false) {
        if (isBlocked) return 0; // Blocked attacks do no damage
        
        // Base damage: 2% of CP (very low for multi-fruit attacks)
        const baseDamage = Math.floor(attackerCP * 0.02);
        
        // Random variation (80-120%)
        const variation = 0.8 + Math.random() * 0.4;
        let damage = Math.floor(baseDamage * variation);
        
        // Elemental advantage bonus
        const attackerElement = this.getFruitElement(attackerFruit.fruit_name || attackerFruit.name);
        const defenderElement = this.getFruitElement(defenderFruit.fruit_name || defenderFruit.name);
        
        if (this.hasElementalAdvantage(attackerElement, defenderElement)) {
            damage = Math.floor(damage * 1.4); // 40% bonus
        }
        
        // Critical hit chance based on rarity
        const critChance = this.getCritChance(attackerFruit.rarity);
        if (Math.random() < critChance) {
            damage = Math.floor(damage * 1.3); // 30% crit bonus
        }
        
        // Cap damage at 8% of defender's max HP
        const maxDamage = Math.floor(defenderHP * 0.08);
        damage = Math.min(damage, maxDamage);
        
        return Math.max(damage, 1); // Minimum 1 damage
    }

    // Professional hit animation with detailed impact visualization
    async showHitAnimation(interaction, attackerName, defenderName, damage, beforeHP, afterHP, maxHP, fruitUsed, elementType, isBlocked, isCritical, turn, isNPC = false) {
        try {
            // Create professional hit effect animation
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
            const targetEmoji = isNPC ? '🤖' : '👥';
            const attackerEmoji = isNPC ? '👤' : '👤';

            // Calculate HP percentage for visual bar
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
                // Blocked attack animation
                const blockEmbed = {
                    title: `🛡️ **ATTACK BLOCKED!**`,
                    description: `**${attackerName}** attacks with **${fruitUsed}**!\n\n🛡️ **PERFECT BLOCK!** No damage taken!`,
                    fields: [
                        { name: '🍈 Devil Fruit Used', value: `${fruitUsed} (${elementType.toUpperCase()})`, inline: true },
                        { name: '🛡️ Defense Result', value: `**BLOCKED**`, inline: true },
                        { name: '💖 HP Status', value: `${afterHP}/${maxHP} (${hpPercentage}%)`, inline: true }
                    ],
                    color: 0x87CEEB,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [blockEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } else {
                // Hit animation - Phase 1: Wind-up
                const windupEmbed = {
                    title: `⚔️ **TURN ${turn} - ATTACK INCOMING!**`,
                    description: `**${attackerName}** prepares to strike with **${fruitUsed}**!`,
                    fields: [
                        { name: '🎯 Target', value: `${targetEmoji} **${defenderName}**`, inline: true },
                        { name: '🍈 Devil Fruit', value: `${fruitUsed}`, inline: true },
                        { name: '⚡ Element', value: `${elementType.toUpperCase()}`, inline: true }
                    ],
                    color: 0xFFD700,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [windupEmbed] });
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Phase 2: Impact animation
                const impactTitle = isCritical ? `💥 **CRITICAL HIT!** 💥` : `💥 **DIRECT HIT!** 💥`;
                const impactEmbed = {
                    title: impactTitle,
                    description: `${hitEffect}\n\n**${attackerName}** strikes **${defenderName}**!\n\n${hitEffect}`,
                    fields: [
                        { name: '💥 Damage Dealt', value: `**-${damage} HP**`, inline: true },
                        { name: '⚡ Element', value: `${elementType.toUpperCase()}`, inline: true },
                        { name: '🎯 Hit Type', value: isCritical ? '**CRITICAL**' : '**NORMAL**', inline: true }
                    ],
                    color: isCritical ? 0xFF0000 : 0xFF6B35,
                    timestamp: new Date().toISOString()
                };

                await interaction.editReply({ embeds: [impactEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Phase 3: Damage result with HP bar
                const afterHitEmbed = {
                    title: `📊 **DAMAGE REPORT**`,
                    description: `**${defenderName}** takes the hit!`,
                    fields: [
                        { 
                            name: `💖 **${defenderName}'s Health**`, 
                            value: `${hpBar}\n**${beforeHP}** → **${afterHP}** / **${maxHP}** HP\n**${hpPercentage}%** remaining`, 
                            inline: false 
                        },
                        { name: '💥 Damage Taken', value: `**${damage}** HP`, inline: true },
                        { name: '🍈 Hit By', value: `${fruitUsed}`, inline: true },
                        { name: '⚡ Element', value: `${elementType.toUpperCase()}`, inline: true }
                    ],
                    color: afterHP <= maxHP * 0.25 ? 0xFF0000 : afterHP <= maxHP * 0.5 ? 0xFFD700 : 0x00FF00,
                    timestamp: new Date().toISOString()
                };

                if (afterHP <= 0) {
                    afterHitEmbed.fields.push({ 
                        name: '💀 Status', 
                        value: '**KNOCKED OUT!**', 
                        inline: false 
                    });
                }

                await interaction.editReply({ embeds: [afterHitEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2500));
            }

        } catch (error) {
            console.warn('Hit animation failed:', error.message);
        }
    }

    // Enhanced multi-fruit attack with professional animations
    async performMultiFruitAttackWithAnimation(attackerFruits, defenderFruits, attackerCP, defenderHP, defenderMaxHP, attackerName, defenderName, interaction, turn, isNPCDefender = false) {
        const attacks = [];
        const totalAttacks = Math.min(attackerFruits.length, 3); // Max 3 attacks per turn
        let currentDefenderHP = defenderHP;
        let totalDamage = 0;

        // Show multi-attack preparation
        const prepEmbed = {
            title: `⚔️ **TURN ${turn} - MULTI-FRUIT ASSAULT!**`,
            description: `**${attackerName}** prepares a devastating combo attack!\n\n🍈 **${totalAttacks} Devil Fruits** ready for battle!`,
            color: 0x8A2BE2,
            timestamp: new Date().toISOString()
        };
        
        await interaction.editReply({ embeds: [prepEmbed] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        for (let i = 0; i < totalAttacks; i++) {
            const attackerFruit = attackerFruits[i];
            const attackerElement = this.getFruitElement(attackerFruit.fruit_name || attackerFruit.name);
            
            // Check if any defender fruit can block this attack
            let blocked = false;
            let blockingFruit = null;
            
            for (const defenderFruit of defenderFruits) {
                const defenderElement = this.getFruitElement(defenderFruit.fruit_name || defenderFruit.name);
                const resistances = this.elementalResistances[defenderElement] || [];
                
                if (resistances.includes(attackerElement)) {
                    blocked = true;
                    blockingFruit = defenderFruit;
                    break;
                }
            }

            const beforeHP = currentDefenderHP;
            const damage = blocked ? 0 : this.calculateDamage(attackerCP, attackerFruit, blockingFruit || defenderFruits[0], defenderMaxHP, blocked);
            currentDefenderHP = Math.max(0, currentDefenderHP - damage);
            
            // Determine if critical hit
            const critChance = this.getCritChance(attackerFruit.rarity);
            const isCritical = !blocked && Math.random() < critChance;

            attacks.push({
                attackerFruit,
                attackerElement,
                blocked,
                blockingFruit,
                damage,
                isCritical,
                beforeHP,
                afterHP: currentDefenderHP
            });

            if (!blocked) {
                totalDamage += damage;
            }

            // Show individual attack animation
            await this.showHitAnimation(
                interaction,
                attackerName,
                defenderName,
                damage,
                beforeHP,
                currentDefenderHP,
                defenderMaxHP,
                attackerFruit.fruit_name || attackerFruit.name,
                attackerElement,
                blocked,
                isCritical,
                turn,
                isNPCDefender
            );

            if (currentDefenderHP <= 0) {
                // Show knockout animation
                const koEmbed = {
                    title: `💀 **KNOCKOUT!**`,
                    description: `**${defenderName}** has been defeated!\n\n${attackerName} wins with a devastating multi-fruit combo!`,
                    color: 0x8B0000,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [koEmbed] });
                await new Promise(resolve => setTimeout(resolve, 3000));
                break;
            }
        }

        // Show turn summary
        const summaryEmbed = {
            title: `📊 **TURN ${turn} SUMMARY**`,
            description: `**${attackerName}'s** multi-fruit assault complete!`,
            fields: [
                { name: '🍈 Fruits Used', value: `${totalAttacks}`, inline: true },
                { name: '💥 Total Damage', value: `${totalDamage}`, inline: true },
                { name: '🛡️ Attacks Blocked', value: `${attacks.filter(a => a.blocked).length}`, inline: true },
                { 
                    name: `💖 ${defenderName}'s Health`, 
                    value: `${currentDefenderHP}/${defenderMaxHP} HP`, 
                    inline: false 
                }
            ],
            color: 0x4169E1,
            timestamp: new Date().toISOString()
        };

        await interaction.editReply({ embeds: [summaryEmbed] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            attacks,
            totalDamage,
            finalHP: currentDefenderHP
        };
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

    // Ship animation frames (inverted to move from left to right)
    getShipFrames() {
        return [
            `🌊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⚓`,
            `🌊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⚓\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⚓\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀
