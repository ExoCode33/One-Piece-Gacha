// ENHANCED STRATEGIC COMBAT SYSTEM - Clean UI & Persistent Combat Logs
class StrategicCombatSystem {
    constructor() {
        console.log('🔧 Enhanced Strategic Combat System initialized');
        this.activeBattles = new Map();
        this.berryStealRange = { min: 0.15, max: 0.35 }; // 15-35% berry steal
    }

    // START: Play ship animation FIRST, then show fruit selection
    async startNPCCombatWithAnimation(userId, username, interaction) {
        console.log(`🤖 Starting strategic NPC combat for ${username}`);
        
        try {
            // Get user's Devil Fruits first to validate
            const userFruits = await this.getUserFruitsWithElements(userId);
            
            if (userFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need at least 1 Devil Fruit to enter combat! Use `/pull` to hunt for fruits first."
                };
            }

            // PLAY ANIMATION FIRST
            await this.playPreCombatAnimation(interaction, 'combat');
            
            // THEN show fruit selection (animation message will be replaced)
            await this.showCleanFruitSelectionMenu(interaction, userFruits, 'npc', username);
            
            return { success: true, message: "Fruit selection phase initiated" };

        } catch (error) {
            console.error('NPC combat initialization error:', error);
            return {
                success: false,
                message: "❌ Failed to initialize combat system."
            };
        }
    }

    // CLEAN: Minimal emoji fruit selection
    async showCleanFruitSelectionMenu(interaction, fruits, battleType, playerName, battleId = null) {
        const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
        
        // Sort fruits by power (highest first)
        const sortedFruits = fruits.sort((a, b) => b.totalPower - a.totalPower);
        const displayFruits = sortedFruits.slice(0, 25);
        
        // CLEAN selection options (minimal emojis)
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

        // CLEAN summary stats
        const totalFruits = fruits.length;
        const avgPower = Math.round(fruits.reduce((sum, f) => sum + f.totalPower, 0) / fruits.length);

        // CLEAN type advantages (no excessive emojis)
        const typeAdvantages = this.getCleanTypeAdvantages();

        const selectionEmbed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle(`Strategic Battle Formation - ${playerName}`)
            .setDescription([
                `Select up to 3 Devil Fruits for ${battleType === 'npc' ? 'NPC combat' : 'PvP battle'}`,
                ``,
                `Collection: ${totalFruits} fruits | Average: ${avgPower} CP`,
                `Showing top 25 by Combat Power`
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
                        '• Combat Power affects damage scaling'
                    ].join('\n'),
                    inline: false
                }
            ])
            .setFooter({ text: 'Select your battle formation from the dropdown below' })
            .setTimestamp();

        await interaction.editReply({
            embeds: [selectionEmbed],
            components: [actionRow]
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

    // CLEAN: Type advantages without excessive emojis
    getCleanTypeAdvantages() {
        return [
            'FIRE > Ice, Gas, Plant | ICE > Gas, Poison, Plant',
            'LIGHTNING > Metal, Water, Gas | LIGHT > Darkness, Ice',
            'DARKNESS > Light, Energy | MAGMA > Fire, Ice, Metal',
            'SAND > Fire, Poison | RUBBER > Lightning, Light',
            'VIBRATION > Stone, Metal, Magma | SPACE > Gravity, Matter',
            'GRAVITY > Light, Gas, Matter | SOUL > Space, Biology',
            'POISON > Healing, Biology | ZOAN > Gas, Basic Types'
        ].join('\n');
    }

    // FIXED: Ship animation without sailing messages
    async playPreCombatAnimation(interaction, animationType) {
        console.log(`Playing pre-combat animation: ${animationType}`);
        
        try {
            // Simple preparation message
            const preAnimationEmbed = {
                title: 'Battle Preparation',
                description: 'Preparing for strategic combat...',
                color: 0x3498db,
                footer: { text: 'Loading battle system...' }
            };
            
            await interaction.editReply({ 
                embeds: [preAnimationEmbed], 
                components: []
            });
            
            // Play the ship animation (will replace this message)
            const RaidAnimation = require('../animations/raid');
            await RaidAnimation.playQuickAnimation(interaction, animationType);
            
            // Brief pause after animation
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Pre-combat animation error:', error);
        }
    }

    // ENHANCED: Persistent combat log with clear advantages/resistance
    async executeTurnBasedCombat(interaction, attackerFruits, defenderFruits, attackerName, defenderName, attackerCP, defenderCP) {
        const { EmbedBuilder } = require('discord.js');
        
        let attackerHP = 100;
        let defenderHP = 100;
        let turn = 1;
        
        // PERSISTENT combat logs for both sides
        const attackerLog = [];
        const defenderLog = [];

        // Combat introduction
        const combatEmbed = new EmbedBuilder()
            .setColor(0xFF6B35)
            .setTitle('STRATEGIC COMBAT INITIATED')
            .setDescription([
                `**${attackerName}** vs **${defenderName}**`,
                `Turn-based combat with type advantages`,
                `First to 0 HP loses`
            ].join('\n'))
            .addFields([
                { 
                    name: `${attackerName} (Attacker)`, 
                    value: `CP: ${attackerCP.toLocaleString()} | HP: ${attackerHP}/100`, 
                    inline: true 
                },
                { 
                    name: `${defenderName} (Defender)`, 
                    value: `CP: ${defenderCP.toLocaleString()} | HP: ${defenderHP}/100`, 
                    inline: true 
                }
            ])
            .setTimestamp();

        await interaction.editReply({ embeds: [combatEmbed], components: [] });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Slower pace

        // SLOWER combat loop with persistent logs
        while (attackerHP > 0 && defenderHP > 0 && turn <= 6) {
            
            // Attacker's turn
            if (attackerHP > 0) {
                const attackerFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                const defenderFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                
                const attackResult = this.calculateDetailedTurnDamage(
                    attackerFruit, defenderFruit, attackerCP, defenderCP
                );
                
                defenderHP = Math.max(0, defenderHP - attackResult.damage);
                
                // Add to persistent attacker log
                attackerLog.push(`Turn ${turn}: ${attackerFruit.name} vs ${defenderFruit.name}`);
                attackerLog.push(`${attackResult.advantageText} | ${attackResult.damage} damage`);
                if (attackerLog.length > 8) attackerLog.splice(0, 2); // Keep last 4 turns
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
                
                // Add to persistent defender log
                defenderLog.push(`Turn ${turn}: ${defenderFruit.name} vs ${attackerFruit.name}`);
                defenderLog.push(`${defenseResult.advantageText} | ${defenseResult.damage} damage`);
                if (defenderLog.length > 8) defenderLog.splice(0, 2); // Keep last 4 turns
            }

            // Show PERSISTENT turn results (logs don't disappear)
            const turnEmbed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle(`Turn ${turn} Results`)
                .setDescription(`Combat continues...`)
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
                .setTimestamp();

            await interaction.editReply({ embeds: [turnEmbed] });
            await new Promise(resolve => setTimeout(resolve, 4000)); // Slower pace

            turn++;
        }

        // Determine winner and handle berry theft
        const winner = attackerHP > defenderHP ? attackerName : defenderName;
        const victory = attackerHP > defenderHP;
        
        let stolenBerries = 0;
        if (victory && battleType === 'npc') {
            // Steal berries from NPC (simulate)
            stolenBerries = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 berries
            await this.awardBerries(interaction.user.id, stolenBerries);
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

    // CLEAR: Obvious advantage/resistance calculation
    calculateDetailedTurnDamage(attackerFruit, defenderFruit, attackerCP, defenderCP) {
        const { CombatSystem: ElementalCombat } = require('../data/counter-system');
        
        // Base damage calculation
        const cpRatio = attackerCP / Math.max(defenderCP, 1);
        let baseDamage = 15 + (cpRatio - 1) * 5;
        
        // Get elemental effectiveness
        const elementalResult = ElementalCombat.calculateEffectiveness(
            attackerFruit.fruit_id, 
            defenderFruit.fruit_id
        );
        
        // Apply elemental multiplier
        let finalDamage = Math.floor(baseDamage * elementalResult.effectiveness);
        
        // Add variance
        finalDamage = Math.floor(finalDamage * (0.9 + Math.random() * 0.2));
        finalDamage = Math.max(5, Math.min(45, finalDamage));
        
        // CLEAR advantage text
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

    // SIMPLE: Clean HP bar
    createSimpleHPBar(hp) {
        const percentage = hp / 100;
        const filledBars = Math.floor(percentage * 10);
        const emptyBars = 10 - filledBars;
        
        let color = 'GREEN';
        if (percentage < 0.3) color = 'RED';
        else if (percentage < 0.6) color = 'YELLOW';
        
        return `${'█'.repeat(filledBars)}${'░'.repeat(emptyBars)} ${hp}/100 HP (${color})`;
    }

    // BERRY ECONOMY: Award berries after victory
    async awardBerries(userId, amount) {
        try {
            const BerryEconomySystem = require('../systems/economy');
            await BerryEconomySystem.addBerries(userId, amount, 'Combat Victory');
            console.log(`💰 Awarded ${amount} berries to user ${userId}`);
            
            // Log to channel
            const ActivityLogger = require('../systems/logger');
            const DatabaseManager = require('../database/manager');
            const user = await DatabaseManager.getUser(userId);
            const totalBerries = await BerryEconomySystem.getBerries(userId);
            
            await ActivityLogger.logBerryCollection(
                userId, 
                user?.username || 'Unknown', 
                amount, 
                totalBerries, 
                0, // No hourly income
                0  // No CP calculation needed
            );
            
        } catch (error) {
            console.error('Error awarding berries:', error);
        }
    }

    // ENHANCED: Battle results with berry rewards
    async showBattleResults(interaction, combatResult, battleType) {
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

        // Add berry rewards
        if (combatResult.stolenBerries > 0) {
            resultFields.push({
                name: 'Berry Reward',
                value: `+${combatResult.stolenBerries.toLocaleString()} berries`,
                inline: true
            });
        }

        // Add complete combat logs
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
            .setTitle(isVictory ? 'VICTORY!' : 'DEFEAT!')
            .setDescription(`**${combatResult.winner}** wins after ${combatResult.totalTurns} turns of strategic combat!`)
            .addFields(resultFields)
            .setTimestamp();

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('battle_again')
                    .setLabel('Fight Again')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_power')
                    .setLabel('View Stats')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [resultEmbed], components: [actionRow] });
    }

    // Process fruit selection
    async processFruitSelection(interaction, selectedValues, battleType, battleId) {
        try {
            if (battleType === 'npc') {
                const battleData = this.activeBattles.get(`npc_${interaction.user.id}`);
                if (!battleData) {
                    return await interaction.reply({ content: 'Battle session expired!', ephemeral: true });
                }

                const selectedFruits = selectedValues.map(value => {
                    const index = parseInt(value.replace('fruit_', ''));
                    return battleData.selectableFruits[index];
                }).filter(fruit => fruit);

                await this.executeNPCBattle(interaction, selectedFruits, battleData);
                this.activeBattles.delete(`npc_${interaction.user.id}`);
            }
        } catch (error) {
            console.error('Error processing fruit selection:', error);
            await interaction.reply({ content: 'Error processing selection!', ephemeral: true });
        }
    }

    // Execute NPC battle
    async executeNPCBattle(interaction, selectedFruits, battleData) {
        const npcFruits = this.generateNPCFruits(selectedFruits);
        const playerCP = selectedFruits.reduce((total, fruit) => total + fruit.totalPower, 0);
        const npcCP = npcFruits.reduce((total, fruit) => total + fruit.totalPower, 0);
        
        const combatResult = await this.executeTurnBasedCombat(
            interaction,
            selectedFruits,
            npcFruits,
            battleData.playerName,
            'NPC Opponent',
            playerCP,
            npcCP
        );

        await this.showBattleResults(interaction, combatResult, 'npc');
    }

    // Helper methods remain the same...
    async getUserFruitsWithElements(userId) {
        try {
            const DatabaseManager = require('../database/manager');
            const userFruits = await DatabaseManager.getUserFruits(userId);
            
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
                if (!fruitMap[fruit.fruit_id]) {
                    fruitMap[fruit.fruit_id] = {
                        ...fruit,
                        duplicateCount: 0,
                        totalPower: 0
                    };
                }
                fruitMap[fruit.fruit_id].duplicateCount++;
                
                const duplicateBonus = 1 + ((fruitMap[fruit.fruit_id].duplicateCount - 1) * 0.01);
                fruitMap[fruit.fruit_id].totalPower = Math.floor(fruit.combatPower * duplicateBonus);
            });

            return Object.values(fruitMap);
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
