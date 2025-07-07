// ENHANCED COMBAT SYSTEM WITH LEFT-TO-RIGHT SHIP ANIMATION

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

        // Optional: add advantage bonus (uncomment to use)
        // const attackerElement = this.getFruitElement(attackerFruit.fruit_name);
        // const defenderElement = this.getFruitElement(defenderFruit.fruit_name);
        // if (this.elementalAdvantages[attackerElement]?.includes(defenderElement)) {
        //     damage = Math.floor(damage * 1.3);
        // }
        
        if (isResisted) {
            damage = Math.floor(damage * 0.5);
        }
        
        const maxDamage = Math.floor(defenderMaxHP * 0.15);
        damage = Math.min(damage, maxDamage);
        
        return Math.max(damage, 5);
    }

    // LEFT-TO-RIGHT SHIP SAILING ANIMATION
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
        const totalFrames = 18;
        const shipFrames = [];
        for (let i = 0; i < totalFrames; i++) {
            const spaces = " ".repeat(i * 2);
            shipFrames.push({
                title: i === 0 ? "🌊 **A ship approaches from the horizon...**"
                    : (i === totalFrames - 1 ? "🌊 **The ship sails off into the distance...**" : "🌊 **The ship sails...**"),
                content: "```" + ship.map(line => spaces + line).join('\n') + "```"
            });
        }
        return shipFrames;
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

    // --- FULL BATTLE FUNCTIONS BELOW ---

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
                { 
                    name: '🍈 Attacking Fruits', 
                    value: attackerFruits.slice(0, 5).map(f => f.fruit_name).join('\n') + (totalFruits > 5 ? `\n+${totalFruits - 5} more...` : ''), 
                    inline: true 
                },
                { 
                    name: '🛡️ Defending Fruits', 
                    value: defenderFruits.slice(0, 5).map(f => f.fruit_name).join('\n') + (defenderFruits.length > 5 ? `\n+${defenderFruits.length - 5} more...` : ''), 
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
            const beforeHP = currentDefenderHP;
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
                    { 
                        name: '🍈 Attacking Fruit', 
                        value: `${attackerFruit.fruit_name}\nElement: ${attackerElement.toUpperCase()}\nRarity: ${attackerFruit.rarity.toUpperCase()}`, 
                        inline: true 
                    },
                    { 
                        name: '🛡️ Defense Analysis', 
                        value: blockingFruit ? 
                            `${blockingFruit.fruit_name}\nElement: ${this.getFruitElement(blockingFruit.fruit_name).toUpperCase()}\nType: ${defenseInfo.type}` :
                            `No Defense\nElement: NONE\nType: VULNERABLE`, 
                        inline: true 
                    },
                    { 
                        name: '💥 Damage Report', 
                        value: blocked ? 
                            `Original: ${originalDamage}\nFinal: 0\nReduction: 100%` :
                            `Original: ${originalDamage}\nFinal: ${finalDamage}\nReduction: ${Math.floor(((originalDamage - finalDamage) / originalDamage) * 100)}%`, 
                        inline: true 
                    },
                    { 
                        name: '💖 Health Status', 
                        value: `${hpBar.bar}\n${hpBar.text}\nStatus: ${hpBar.status}`, 
                        inline: false 
                    }
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
                        { name: '🎯 Attack Number', value: `${i + 1}/${totalFruits}`, inline: true },
                        { name: '💥 Final Damage', value: `${finalDamage}`, inline: true }
                    ],
                    color: 0x8B0000,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [koEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2500));
                break;
            }
        }

        // Show turn summary with detailed statistics
        const successRate = Math.floor((successfulAttacks / totalFruits) * 100);
        const summaryEmbed = {
            title: `📊 **TURN ${turn} SUMMARY**`,
            description: `**${attackerName}**'s multi-fruit assault complete!`,
            fields: [
                { name: '⚔️ Total Attacks', value: `${totalFruits}`, inline: true },
                { name: '🎯 Successful Hits', value: `${successfulAttacks}`, inline: true },
                { name: '📈 Success Rate', value: `${successRate}%`, inline: true },
                { name: '🛡️ Perfect Blocks', value: `${attacksBlocked}`, inline: true },
                { name: '🔄 Resisted Attacks', value: `${attacksResisted}`, inline: true },
                { name: '💥 Total Damage', value: `${totalDamage}`, inline: true },
                { name: '💖 Defender HP', value: `${currentDefenderHP}/${defenderMaxHP} (${Math.floor((currentDefenderHP/defenderMaxHP)*100)}%)`, inline: false }
            ],
            color: currentDefenderHP > 0 ? 0x1E90FF : 0x8B0000,
            timestamp: new Date().toISOString()
        };

        await interaction.editReply({ embeds: [summaryEmbed] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            finalHP: currentDefenderHP,
            totalDamage,
            attacksBlocked,
            attacksResisted,
            successfulAttacks,
            successRate
        };
    }

    async startNPCCombatWithAnimation(userId, username, interaction) {
        try {
            console.log(`🤖 Starting ULTIMATE NPC combat for ${username}`);
            
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
            const npcCP = 2500;

            const playerMaxHP = this.calculateTotalHP(userStats.totalCP);
            const npcMaxHP = this.calculateTotalHP(npcCP);
            let playerHP = playerMaxHP;
            let npcHP = npcMaxHP;

            // SHIP ANIMATION
            const shipFrames = this.getShipAnimationFrames();
            for (let i = 0; i < shipFrames.length; i++) {
                await interaction.editReply({ 
                    content: shipFrames[i].title,
                    embeds: [{ 
                        description: shipFrames[i].content,
                        color: 0x1E90FF
                    }]
                });
                await new Promise(resolve => setTimeout(resolve, 400));
            }

            // Battle arena setup
            const arenaEmbed = {
                title: `🏟️ **EPIC BATTLE ARENA - ALL FRUITS UNLEASHED**`,
                description: `**${username}** vs **Monkey D. Tester**\n\n*All Devil Fruits will participate in this legendary battle!*`,
                fields: [
                    { name: '👤 Your Power', value: `💪 ${userStats.totalCP} CP\n💖 ${playerHP}/${playerMaxHP} HP\n🍈 ${userFruits.length} Devil Fruits`, inline: true },
                    { name: '🤖 NPC Power', value: `💪 ${npcCP} CP\n💖 ${npcHP}/${npcMaxHP} HP\n🍈 ${npcFruits.length} Devil Fruits`, inline: true },
                    { name: '🎮 Battle Format', value: `⚔️ 3 Epic Turns\n🍈 All-Fruit Combat\n🛡️ Defense Analysis\n📊 Detailed Statistics`, inline: true }
                ],
                color: 0x1E90FF,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [arenaEmbed] });
            await new Promise(resolve => setTimeout(resolve, 4000));

            let turn = 1;

            // Epic 3-turn combat with ALL fruits
            while (turn <= 3 && playerHP > 0 && npcHP > 0) {
                // Player's turn - ALL fruits attack
                const playerResult = await this.performAdvancedCombat(
                    userFruits, npcFruits, userStats.totalCP, npcHP, npcMaxHP,
                    username, "Monkey D. Tester", interaction, turn
                );
                
                npcHP = playerResult.finalHP;
                if (npcHP <= 0) break;

                await new Promise(resolve => setTimeout(resolve, 2000));

                // NPC's turn - ALL fruits attack
                const npcResult = await this.performAdvancedCombat(
                    npcFruits, userFruits, npcCP, playerHP, playerMaxHP,
                    "Monkey D. Tester", username, interaction, turn
                );
                
                playerHP = npcResult.finalHP;
                if (playerHP <= 0) break;

                turn++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Epic battle conclusion
            const victory = playerHP > npcHP;
            let berryReward = 0;

            if (victory) {
                berryReward = Math.floor(1000 + Math.random() * 1500);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `Ultimate NPC victory - ${userFruits.length} fruits used`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            const finalPlayerHPBar = this.createHPBar(playerHP, playerMaxHP);
            const finalNPCHPBar = this.createHPBar(npcHP, npcMaxHP);

            const resultEmbed = {
                title: victory ? `🏆 **LEGENDARY VICTORY!** 🏆` : `💀 **HEROIC DEFEAT!** 💀`,
                description: victory ? 
                    `**${username}** emerges victorious with the power of **${userFruits.length} Devil Fruits**!` :
                    `**Monkey D. Tester** proves too powerful even against **${userFruits.length} Devil Fruits**!`,
                fields: [
                    { name: '👤 Your Final Status', value: `${finalPlayerHPBar.bar}\n${finalPlayerHPBar.text}\nStatus: ${finalPlayerHPBar.status}`, inline: true },
                    { name: '🤖 NPC Final Status', value: `${finalNPCHPBar.bar}\n${finalNPCHPBar.text}\nStatus: ${finalNPCHPBar.status}`, inline: true },
                    { name: '📊 Battle Stats', value: `🎯 Turns Completed: ${turn}\n🍈 Fruits Used: ${userFruits.length}\n⚔️ Epic Combat Mode`, inline: true }
                ],
                color: victory ? 0x00FF00 : 0xFF0000,
                timestamp: new Date().toISOString()
            };

            if (victory && berryReward > 0) {
                resultEmbed.fields.push({ 
                    name: '💰 Epic Reward', 
                    value: `+${berryReward} berries\n*Bonus for using ${userFruits.length} fruits!*`, 
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
                berryReward,
                fruitsUsed: userFruits.length
            };

        } catch (error) {
            console.error('Ultimate NPC combat error:', error);
            return {
                success: false,
                message: "❌ Combat system error occurred."
            };
        }
    }

    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        try {
            console.log(`⚔️ Starting ULTIMATE PvP: ${attackerName} vs ${defenderName}`);
            
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

            // SHIP ANIMATION
            const shipFrames = this.getShipAnimationFrames();
            for (let i = 0; i < shipFrames.length; i++) {
                await interaction.editReply({ 
                    content: shipFrames[i].title,
                    embeds: [{ 
                        description: shipFrames[i].content,
                        color: 0xFF1493
                    }]
                });
                await new Promise(resolve => setTimeout(resolve, 400));
            }

            // PvP arena setup
            const arenaEmbed = {
                title: `🏟️ **ULTIMATE PvP ARENA - ALL FRUITS CLASH**`,
                description: `**${attackerName}** vs **${defenderName}**\n\n*Every Devil Fruit will participate in this epic duel!*`,
                fields: [
                    { name: '👤 Attacker', value: `💪 ${attackerStats.totalCP} CP\n💖 ${attackerHP}/${attackerMaxHP} HP\n🍈 ${attackerFruits.length} Devil Fruits`, inline: true },
                    { name: '👥 Defender', value: `💪 ${defenderStats.totalCP} CP\n💖 ${defenderHP}/${defenderMaxHP} HP\n🍈 ${defenderFruits.length} Devil Fruits`, inline: true },
                    { name: '🎮 PvP Format', value: `⚔️ Ultimate Combat\n🍈 All-Fruit Battle\n🛡️ Advanced Defense\n📊 Real-time Stats`, inline: true }
                ],
                color: 0xFF1493,
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({ embeds: [arenaEmbed] });
            await new Promise(resolve => setTimeout(resolve, 4000));

            let turn = 1;

            // Epic 3-turn PvP combat with ALL fruits
            while (turn <= 3 && attackerHP > 0 && defenderHP > 0) {
                // Attacker's turn - ALL fruits attack
                const attackerResult = await this.performAdvancedCombat(
                    attackerFruits, defenderFruits, attackerStats.totalCP, defenderHP, defenderMaxHP,
                    attackerName, defenderName, interaction, turn
                );
                
                defenderHP = attackerResult.finalHP;
                if (defenderHP <= 0) break;

                await new Promise(resolve => setTimeout(resolve, 2000));

                // Defender's turn - ALL fruits attack
                const defenderResult = await this.performAdvancedCombat(
                    defenderFruits, attackerFruits, defenderStats.totalCP, attackerHP, attackerMaxHP,
                    defenderName, attackerName, interaction, turn
                );
                
                attackerHP = defenderResult.finalHP;
                if (attackerHP <= 0) break;

                turn++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Epic PvP conclusion
            const attackerVictory = attackerHP > defenderHP;
            let berryReward = 0;

            if (attackerVictory) {
                berryReward = Math.floor(500 + Math.random() * 1000);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(attackerId, berryReward, `Ultimate PvP victory - ${attackerFruits.length} vs ${defenderFruits.length} fruits`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            const finalAttackerHPBar = this.createHPBar(attackerHP, attackerMaxHP);
            const finalDefenderHPBar = this.createHPBar(defenderHP, defenderMaxHP);

            const resultEmbed = {
                title: attackerVictory ? `🏆 **${attackerName.toUpperCase()} DOMINATES!** 🏆` : `🏆 **${defenderName.toUpperCase()} TRIUMPHS!** 🏆`,
                description: attackerVictory ? 
                    `**${attackerName}** overwhelms **${defenderName}** with **${attackerFruits.length} Devil Fruits**!` :
                    `**${defenderName}** withstands the assault and defeats **${attackerName}**!`,
                fields: [
                    { name: '👤 Attacker Final Status', value: `${finalAttackerHPBar.bar}\n${finalAttackerHPBar.text}\nStatus: ${finalAttackerHPBar.status}`, inline: true },
                    { name: '👥 Defender Final Status', value: `${finalDefenderHPBar.bar}\n${finalDefenderHPBar.text}\nStatus: ${finalDefenderHPBar.status}`, inline: true },
                    { name: '📊 PvP Battle Stats', value: `🎯 Turns: ${turn}\n⚔️ ${attackerFruits.length} vs ${defenderFruits.length} Fruits\n🏆 Ultimate PvP Mode`, inline: true }
                ],
                color: attackerVictory ? 0x00FF00 : 0xFF6B35,
                timestamp: new Date().toISOString()
            };

            if (attackerVictory && berryReward > 0) {
                resultEmbed.fields.push({ 
                    name: '💰 Victory Reward', 
                    value: `+${berryReward} berries for ${attackerName}\n*Epic PvP Victory Bonus!*`, 
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
                winner: attackerVictory ? attackerName : defenderName,
                attackerFruits: attackerFruits.length,
                defenderFruits: defenderFruits.length
            };

        } catch (error) {
            console.error('Ultimate PvP combat error:', error);
            return {
                success: false,
                message: "❌ PvP combat system error occurred."
            };
        }
    }
}

module.exports = new CombatSystem();
