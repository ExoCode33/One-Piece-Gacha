// FIXED STRATEGIC COMBAT SYSTEM - Public Battles, Private Selection + Working Economy
class StrategicCombatSystem {
    constructor() {
        console.log('🔧 Enhanced Strategic Combat System initialized');
        this.activeBattles = new Map();
        this.berryStealRange = { min: 0.15, max: 0.35 };
    }

    // Start NPC combat
    async startNPCCombatWithAnimation(userId, username, interaction) {
        console.log(`🤖 Starting strategic NPC combat for ${username}`);
        
        try {
            const userFruits = await this.getUserFruitsWithElements(userId);
            
            if (userFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need at least 1 Devil Fruit to enter combat! Use `/pull` to hunt for fruits first."
                };
            }

            // PRIVATE fruit selection (ephemeral: true)
            await this.showPrivateFruitSelectionMenu(interaction, userFruits, 'npc', username);
            
            return { success: true, message: "Fruit selection phase initiated" };

        } catch (error) {
            console.error('NPC combat initialization error:', error);
            return {
                success: false,
                message: "❌ Failed to initialize combat system."
            };
        }
    }

    // Start PvP combat
    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        console.log(`⚔️ Starting strategic PvP: ${attackerName} vs ${defenderName}`);
        
        try {
            const attackerFruits = await this.getUserFruitsWithElements(attackerId);
            
            if (attackerFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need at least 1 Devil Fruit to challenge others! Use `/pull` to hunt for fruits first."
                };
            }

            const defenderFruits = await this.getUserFruitsWithElements(defenderId);
            if (defenderFruits.length === 0) {
                return {
                    success: false,
                    message: `❌ ${defenderName} has no Devil Fruits to defend with!`
                };
            }

            const battleId = `${attackerId}_vs_${defenderId}_${Date.now()}`;
            this.activeBattles.set(battleId, {
                attackerId,
                defenderId,
                attackerName,
                defenderName,
                attackerFruits,
                defenderFruits,
                phase: 'attacker_selection',
                attackerSelection: [],
                defenderSelection: [],
                createdAt: Date.now()
            });

            // PRIVATE fruit selection for PvP too
            await this.showPrivateFruitSelectionMenu(interaction, attackerFruits, 'pvp_attacker', attackerName, battleId);
            
            return { success: true, message: "PvP fruit selection phase initiated" };

        } catch (error) {
            console.error('PvP combat initialization error:', error);
            return {
                success: false,
                message: "❌ Failed to initialize PvP combat system."
            };
        }
    }

    // PRIVATE: Fruit selection menu (only visible to command user)
    async showPrivateFruitSelectionMenu(interaction, fruits, battleType, playerName, battleId = null) {
        const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
        
        const sortedFruits = fruits.sort((a, b) => b.totalPower - a.totalPower);
        const displayFruits = sortedFruits.slice(0, 25);
        
        const selectOptions = displayFruits.map((fruit, index) => {
            const duplicateText = fruit.duplicateCount > 1 ? ` x${fruit.duplicateCount}` : '';
            const powerText = ` (${fruit.totalPower} CP)`;
            
            return {
                label: `${fruit.name}${duplicateText}`,
                description: `${fruit.rarity.toUpperCase()} ${fruit.type}${powerText}`,
                value: `fruit_${index}`
            };
        });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`fruit_select_${battleType}_${battleId || 'npc'}`)
            .setPlaceholder('Choose up to 3 Devil Fruits for strategic combat...')
            .setMinValues(1)
            .setMaxValues(Math.min(3, selectOptions.length))
            .addOptions(selectOptions);

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        const totalFruits = fruits.length;
        const avgPower = Math.round(fruits.reduce((sum, f) => sum + f.totalPower, 0) / fruits.length);
        const typeAdvantages = this.getCleanTypeAdvantages();

        const selectionEmbed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle(`🔒 Private Battle Formation - ${playerName}`)
            .setDescription([
                `Select up to 3 Devil Fruits for ${battleType === 'npc' ? 'NPC combat' : 'PvP battle'}`,
                ``,
                `Collection: ${totalFruits} fruits | Average: ${avgPower} CP`,
                ``,
                `⚠️ **This selection is private** - only you can see this menu`
            ].join('\n'))
            .addFields([
                {
                    name: 'Type Advantages',
                    value: typeAdvantages,
                    inline: false
                },
                {
                    name: 'Combat Tips',
                    value: [
                        '• Higher rarity = more base power',
                        '• Duplicates give +1% CP bonus each',
                        '• Type advantages grant 50% damage bonus',
                        '• Combat will be visible to everyone after selection'
                    ].join('\n'),
                    inline: false
                }
            ])
            .setFooter({ text: 'Private fruit selection - Battle will be public' })
            .setTimestamp();

        // EPHEMERAL: Only visible to command user
        await interaction.reply({
            embeds: [selectionEmbed],
            components: [actionRow],
            ephemeral: true
        });

        // Store fruit data
        if (battleType.startsWith('pvp') && battleId) {
            const battle = this.activeBattles.get(battleId);
            if (battle) {
                battle.selectableFruits = displayFruits;
                this.activeBattles.set(battleId, battle);
            }
        } else {
            this.activeBattles.set(`npc_${interaction.user.id}`, {
                selectableFruits: displayFruits,
                battleType: 'npc',
                playerId: interaction.user.id,
                playerName: playerName
            });
        }
    }

    getCleanTypeAdvantages() {
        return [
            'FIRE > Ice, Gas, Plant',
            'ICE > Gas, Poison, Plant',
            'LIGHTNING > Metal, Water, Gas',
            'LIGHT > Darkness, Ice',
            'DARKNESS > Light, Energy',
            'MAGMA > Fire, Ice, Metal',
            'SAND > Fire, Poison',
            'RUBBER > Lightning, Light',
            'VIBRATION > Stone, Metal, Magma',
            'SPACE > Gravity, Matter',
            'GRAVITY > Light, Gas, Matter',
            'SOUL > Space, Biology',
            'POISON > Healing, Biology',
            'ZOAN > Gas, Basic Types'
        ].join('\n');
    }

    // FIXED: Process fruit selection with proper error handling
    async processFruitSelection(interaction, selectedValues, battleType, battleId) {
        try {
            // Acknowledge the selection interaction (still private)
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: true });
            }

            if (battleType === 'npc') {
                const battleData = this.activeBattles.get(`npc_${interaction.user.id}`);
                if (!battleData) {
                    await interaction.editReply({ content: 'Battle session expired!' });
                    return;
                }

                const selectedFruits = selectedValues.map(value => {
                    const index = parseInt(value.replace('fruit_', ''));
                    return battleData.selectableFruits[index];
                }).filter(fruit => fruit);

                // Confirm selection privately
                await interaction.editReply({ 
                    content: `✅ Selected ${selectedFruits.length} fruits! Starting public battle...`,
                    embeds: [],
                    components: []
                });
                
                // Start PUBLIC battle in the channel
                await this.startPublicNPCBattle(interaction, selectedFruits, battleData);
                this.activeBattles.delete(`npc_${interaction.user.id}`);

            } else if (battleType === 'pvp_attacker') {
                const battle = this.activeBattles.get(battleId);
                if (!battle) {
                    await interaction.editReply({ content: 'Battle session expired!' });
                    return;
                }

                const selectedFruits = selectedValues.map(value => {
                    const index = parseInt(value.replace('fruit_', ''));
                    return battle.selectableFruits[index];
                }).filter(fruit => fruit);

                battle.attackerSelection = selectedFruits;
                battle.phase = 'defender_selection';
                this.activeBattles.set(battleId, battle);

                await interaction.editReply({ 
                    content: `✅ Attacker fruits selected! Auto-selecting defender...`,
                    embeds: [],
                    components: []
                });

                await this.startPublicPvPBattle(interaction, battle);
            }
        } catch (error) {
            console.error('Error processing fruit selection:', error);
            try {
                if (!interaction.replied) {
                    await interaction.editReply({ content: 'Error processing selection!' });
                }
            } catch (replyError) {
                console.error('Could not reply to interaction:', replyError);
            }
        }
    }

    // PUBLIC: Start NPC battle visible to everyone
    async startPublicNPCBattle(interaction, selectedFruits, battleData) {
        try {
            const npcFruits = this.generateNPCFruits(selectedFruits);
            const playerCP = selectedFruits.reduce((total, fruit) => total + fruit.totalPower, 0);
            const npcCP = npcFruits.reduce((total, fruit) => total + fruit.totalPower, 0);
            
            // PUBLIC battle announcement
            const battleStartEmbed = new EmbedBuilder()
                .setColor(0xFF6B35)
                .setTitle('⚔️ PUBLIC STRATEGIC COMBAT')
                .setDescription([
                    `**${battleData.playerName}** challenges an NPC opponent!`,
                    ``,
                    `🎯 **Battle commencing...**`
                ].join('\n'))
                .addFields([
                    { 
                        name: `👤 ${battleData.playerName}`, 
                        value: `CP: ${playerCP.toLocaleString()}`, 
                        inline: true 
                    },
                    { 
                        name: `🤖 NPC Opponent`, 
                        value: `CP: ${npcCP.toLocaleString()}`, 
                        inline: true 
                    }
                ])
                .setFooter({ text: 'Strategic Combat - Visible to all' })
                .setTimestamp();

            // Send PUBLIC message in the channel
            const publicMessage = await interaction.followUp({
                embeds: [battleStartEmbed],
                ephemeral: false
            });

            // Execute combat with PUBLIC updates
            const combatResult = await this.executePublicTurnBasedCombat(
                publicMessage,
                selectedFruits,
                npcFruits,
                battleData.playerName,
                'NPC Opponent',
                playerCP,
                npcCP,
                'npc'
            );

            // Award berries and show results
            if (combatResult.victory) {
                await this.awardBerries(interaction.user.id, combatResult.stolenBerries);
            }

            await this.showPublicBattleResults(publicMessage, combatResult, 'npc');

        } catch (error) {
            console.error('Error in public NPC battle:', error);
        }
    }

    // PUBLIC: Turn-based combat visible to everyone
    async executePublicTurnBasedCombat(message, attackerFruits, defenderFruits, attackerName, defenderName, attackerCP, defenderCP, battleType = 'npc') {
        const { EmbedBuilder } = require('discord.js');
        
        let attackerHP = 100;
        let defenderHP = 100;
        let turn = 1;
        
        const attackerLog = [];
        const defenderLog = [];

        // Combat loop
        while (attackerHP > 0 && defenderHP > 0 && turn <= 6) {
            
            // Attacker's turn
            if (attackerHP > 0) {
                const attackerFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                const defenderFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                
                const attackResult = this.calculateDetailedTurnDamage(
                    attackerFruit, defenderFruit, attackerCP, defenderCP
                );
                
                defenderHP = Math.max(0, defenderHP - attackResult.damage);
                
                attackerLog.push(`Turn ${turn}: ${attackerFruit.name} vs ${defenderFruit.name}`);
                attackerLog.push(`${attackResult.advantageText} | ${attackResult.damage} damage`);
                if (attackerLog.length > 8) attackerLog.splice(0, 2);
            }

            if (defenderHP <= 0) break;

            // Defender's turn
            if (defenderHP > 0) {
                const defenderFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                const attackerFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                
                const defenseResult = this.calculateDetailedTurnDamage(
                    defenderFruit, attackerFruit, defenderCP, attackerCP
                );
                
                attackerHP = Math.max(0, attackerHP - defenseResult.damage);
                
                defenderLog.push(`Turn ${turn}: ${defenderFruit.name} vs ${attackerFruit.name}`);
                defenderLog.push(`${defenseResult.advantageText} | ${defenseResult.damage} damage`);
                if (defenderLog.length > 8) defenderLog.splice(0, 2);
            }

            // PUBLIC turn results update
            const turnEmbed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle(`⚔️ Turn ${turn} Results`)
                .setDescription(`Public strategic combat in progress...`)
                .addFields([
                    { 
                        name: `${attackerName} Actions`, 
                        value: attackerLog.join('\n') || 'No actions yet', 
                        inline: true 
                    },
                    { 
                        name: `${defenderName} Actions`, 
                        value: defenderLog.join('\n') || 'No actions yet', 
                        inline: true 
                    },
                    {
                        name: 'Current Status',
                        value: `${attackerName}: ${this.createSimpleHPBar(attackerHP)}\n${defenderName}: ${this.createSimpleHPBar(defenderHP)}`,
                        inline: false
                    }
                ])
                .setFooter({ text: `Public Combat - Turn ${turn}` })
                .setTimestamp();

            await message.edit({ embeds: [turnEmbed] });
            await new Promise(resolve => setTimeout(resolve, 3000));

            turn++;
        }

        // Determine winner and rewards
        const winner = attackerHP > defenderHP ? attackerName : defenderName;
        const victory = attackerHP > defenderHP;
        
        let stolenBerries = 0;
        if (victory && battleType === 'npc') {
            stolenBerries = Math.floor(Math.random() * 5000) + 1000;
        }

        return {
            winner,
            victory,
            finalAttackerHP: attackerHP,
            finalDefenderHP: defenderHP,
            attackerLog,
            defenderLog,
            totalTurns: turn - 1,
            stolenBerries
        };
    }

    // PUBLIC: Show battle results to everyone
    async showPublicBattleResults(message, combatResult, battleType) {
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        const isVictory = combatResult.victory;
        
        const resultFields = [
            { 
                name: 'Final Health', 
                value: `${combatResult.finalAttackerHP} vs ${combatResult.finalDefenderHP} HP`, 
                inline: true 
            },
            {
                name: 'Battle Duration',
                value: `${combatResult.totalTurns} turns`,
                inline: true
            }
        ];

        if (combatResult.stolenBerries > 0) {
            resultFields.push({
                name: '💰 Berry Reward',
                value: `+${combatResult.stolenBerries.toLocaleString()} berries`,
                inline: true
            });
        }

        resultFields.push({
            name: 'Complete Battle Log',
            value: [
                `**${combatResult.winner} Actions:**`,
                combatResult.attackerLog.join('\n'),
                ``,
                `**Defender Actions:**`,
                combatResult.defenderLog.join('\n')
            ].join('\n'),
            inline: false
        });
        
        const resultEmbed = new EmbedBuilder()
            .setColor(isVictory ? 0x00FF00 : 0xFF0000)
            .setTitle(isVictory ? '🏆 PUBLIC VICTORY!' : '💀 PUBLIC DEFEAT!')
            .setDescription(`**${combatResult.winner}** wins after ${combatResult.totalTurns} turns of strategic combat!`)
            .addFields(resultFields)
            .setFooter({ text: 'Public Strategic Combat Results' })
            .setTimestamp();

        await message.edit({ embeds: [resultEmbed], components: [] });
    }

    // ENHANCED: Berry economy with proper initialization
    async awardBerries(userId, amount) {
        try {
            console.log(`💰 Attempting to award ${amount} berries to user ${userId}`);
            
            // Ensure user exists first
            const DatabaseManager = require('../database/manager');
            await DatabaseManager.ensureUser(userId, 'Combat Winner');
            
            // Get economy system
            const BerryEconomySystem = require('../systems/economy');
            
            // Initialize tables if needed
            await BerryEconomySystem.initializeBerryTable();
            
            // Award berries
            const newBalance = await BerryEconomySystem.addBerries(userId, amount, 'Combat Victory');
            
            console.log(`✅ Successfully awarded ${amount.toLocaleString()} berries to user ${userId}`);
            console.log(`💳 New balance: ${newBalance.toLocaleString()} berries`);
            
            return newBalance;
        } catch (error) {
            console.error('❌ Error awarding berries:', error);
            return 0;
        }
    }

    // PvP methods
    async startPublicPvPBattle(interaction, battle) {
        try {
            // Auto-select defender fruits
            const defenderFruits = battle.defenderFruits.slice(0, 3);
            battle.defenderSelection = defenderFruits;
            
            const attackerCP = battle.attackerSelection.reduce((total, fruit) => total + (fruit.totalPower || 500), 0);
            const defenderCP = battle.defenderSelection.reduce((total, fruit) => total + (fruit.totalPower || 500), 0);
            
            // PUBLIC PvP battle announcement
            const pvpStartEmbed = new EmbedBuilder()
                .setColor(0xFF1493)
                .setTitle('⚔️ PUBLIC PVP COMBAT')
                .setDescription([
                    `**${battle.attackerName}** challenges **${battle.defenderName}**!`,
                    ``,
                    `🎯 **PvP battle commencing...**`
                ].join('\n'))
                .addFields([
                    { 
                        name: `⚔️ ${battle.attackerName}`, 
                        value: `CP: ${attackerCP.toLocaleString()}`, 
                        inline: true 
                    },
                    { 
                        name: `🛡️ ${battle.defenderName}`, 
                        value: `CP: ${defenderCP.toLocaleString()}`, 
                        inline: true 
                    }
                ])
                .setFooter({ text: 'PvP Strategic Combat - Visible to all' })
                .setTimestamp();

            const publicMessage = await interaction.followUp({
                embeds: [pvpStartEmbed],
                ephemeral: false
            });

            const combatResult = await this.executePublicTurnBasedCombat(
                publicMessage,
                battle.attackerSelection,
                battle.defenderSelection,
                battle.attackerName,
                battle.defenderName,
                attackerCP,
                defenderCP,
                'pvp'
            );

            if (combatResult.victory) {
                const stolenAmount = Math.floor(Math.random() * 2000) + 500;
                combatResult.stolenBerries = stolenAmount;
                await this.awardBerries(battle.attackerId, stolenAmount);
            }

            await this.showPublicBattleResults(publicMessage, combatResult, 'pvp');
            this.activeBattles.delete(battleId);

        } catch (error) {
            console.error('Error in public PvP battle:', error);
        }
    }

    // Other methods remain the same...
    calculateDetailedTurnDamage(attackerFruit, defenderFruit, attackerCP, defenderCP) {
        const { CombatSystem: ElementalCombat } = require('../data/counter-system');
        
        const cpRatio = attackerCP / Math.max(defenderCP, 1);
        let baseDamage = 15 + (cpRatio - 1) * 5;
        
        const elementalResult = ElementalCombat.calculateEffectiveness(
            attackerFruit.fruit_id, 
            defenderFruit.fruit_id
        );
        
        let finalDamage = Math.floor(baseDamage * elementalResult.effectiveness);
        finalDamage = Math.floor(finalDamage * (0.9 + Math.random() * 0.2));
        finalDamage = Math.max(5, Math.min(45, finalDamage));
        
        let advantageText;
        if (elementalResult.effectiveness > 1.3) {
            advantageText = "SUPER EFFECTIVE!";
        } else if (elementalResult.effectiveness < 0.8) {
            advantageText = "NOT VERY EFFECTIVE";
        } else {
            advantageText = "Normal effectiveness";
        }

        return {
            damage: finalDamage,
            attackerFruit,
            defenderFruit,
            effectiveness: elementalResult.effectiveness,
            advantageText
        };
    }

    createSimpleHPBar(hp) {
        const percentage = hp / 100;
        const filledBars = Math.floor(percentage * 10);
        const emptyBars = 10 - filledBars;
        
        let color = 'GREEN';
        if (percentage < 0.3) color = 'RED';
        else if (percentage < 0.6) color = 'YELLOW';
        
        return `${'█'.repeat(filledBars)}${'░'.repeat(emptyBars)} ${hp}/100 HP (${color})`;
    }

    async getUserFruitsWithElements(userId) {
        try {
            const DatabaseManager = require('../database/manager');
            const userFruits = await DatabaseManager.getUserFruits(userId);
            
            console.log(`🔍 Processing ${userFruits.length} fruits for user ${userId}`);
            
            const processedFruits = userFruits.map(fruit => {
                const { DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
                const element = DEVIL_FRUIT_ELEMENTS[fruit.fruit_id] || 'neutral';
                
                return {
                    ...fruit,
                    element: element,
                    combatPower: fruit.combat_power || this.getRarityBasePower(fruit.rarity)
                };
            });

            const fruitMap = {};
            processedFruits.forEach(fruit => {
                const fruitId = fruit.fruit_id;
                
                if (!fruitMap[fruitId]) {
                    fruitMap[fruitId] = {
                        ...fruit,
                        duplicateCount: 0,
                        totalPower: 0,
                        instances: []
                    };
                }
                
                fruitMap[fruitId].duplicateCount++;
                fruitMap[fruitId].instances.push(fruit);
                
                const duplicateBonus = 1 + ((fruitMap[fruitId].duplicateCount - 1) * 0.01);
                fruitMap[fruitId].totalPower = Math.floor(fruit.combatPower * duplicateBonus);
            });

            const result = Object.values(fruitMap);
            
            console.log(`📊 Grouped into ${result.length} unique fruits with duplicates:`);
            result.forEach(fruit => {
                if (fruit.duplicateCount > 1) {
                    console.log(`  - ${fruit.name}: ${fruit.duplicateCount} copies (${fruit.totalPower} CP total)`);
                }
            });

            return result;

        } catch (error) {
            console.error('Error getting user fruits:', error);
            return [];
        }
    }

    generateNPCFruits(playerFruits) {
        const { getAllFruits } = require('../data/devilfruit');
        const allFruits = getAllFruits();
        
        const npcFruits = [];
        const avgPlayerPower = playerFruits.reduce((total, fruit) => total + fruit.totalPower, 0) / playerFruits.length;
        
        for (let i = 0; i < 3; i++) {
            const randomFruit = allFruits[Math.floor(Math.random() * allFruits.length)];
            npcFruits.push({
                ...randomFruit,
                totalPower: Math.floor(avgPlayerPower * (0.8 + Math.random() * 0.4))
            });
        }
        
        return npcFruits;
    }

    getRarityBasePower(rarity) {
        const powers = {
            'common': 150, 'uncommon': 300, 'rare': 600, 'epic': 1000,
            'legendary': 1500, 'mythical': 2500, 'omnipotent': 4000
        };
        return powers[rarity?.toLowerCase()] || 150;
    }

    async getUserCombatPower(userId) {
        try {
            const fruits = await this.getUserFruitsWithElements(userId);
            return fruits.reduce((total, fruit) => total + fruit.totalPower, 0);
        } catch (error) {
            return 100;
        }
    }

    async getUserBattleStats(userId) {
        return {
            totalBattles: 0,
            victories: 0,
            defeats: 0,
            winRate: 0,
            totalCP: await this.getUserCombatPower(userId)
        };
    }
}

module.exports = new StrategicCombatSystem();
