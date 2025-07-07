// src/config/combat.js - Strategic Turn-Based Combat System
console.log('🔧 Loading strategic combat system...');

const RaidAnimation = require('../animations/raid');
const { ELEMENT_TYPES, DEVIL_FRUIT_ELEMENTS, CombatSystem: ElementalCombat } = require('../data/counter-system');

class StrategicCombatSystem {
    constructor() {
        console.log('🔧 Strategic Combat System initialized');
        this.activeBattles = new Map(); // Store ongoing battles
    }

    // Start NPC combat with fruit selection
    async startNPCCombatWithAnimation(userId, username, interaction) {
        console.log(`🤖 Starting strategic NPC combat for ${username}`);
        
        try {
            // First, play the ship animation BEFORE combat
            await this.playPreCombatAnimation(interaction, 'combat');
            
            // Get user's Devil Fruits for selection
            const userFruits = await this.getUserFruitsWithElements(userId);
            
            if (userFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need at least 1 Devil Fruit to enter combat! Use `/pull` to hunt for fruits first."
                };
            }

            // Show fruit selection menu
            await this.showFruitSelectionMenu(interaction, userFruits, 'npc', username);
            
            return { success: true, message: "Fruit selection phase initiated" };

        } catch (error) {
            console.error('NPC combat initialization error:', error);
            return {
                success: false,
                message: "❌ Failed to initialize combat system."
            };
        }
    }

    // Start PvP combat with fruit selection
    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        console.log(`⚔️ Starting strategic PvP: ${attackerName} vs ${defenderName}`);
        
        try {
            // First, play the ship animation BEFORE combat
            await this.playPreCombatAnimation(interaction, 'pvp');
            
            // Get attacker's Devil Fruits for selection
            const attackerFruits = await this.getUserFruitsWithElements(attackerId);
            
            if (attackerFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need at least 1 Devil Fruit to challenge others! Use `/pull` to hunt for fruits first."
                };
            }

            // Check if defender has fruits
            const defenderFruits = await this.getUserFruitsWithElements(defenderId);
            if (defenderFruits.length === 0) {
                return {
                    success: false,
                    message: `❌ ${defenderName} has no Devil Fruits to defend with!`
                };
            }

            // Store battle data
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

            // Show attacker's fruit selection menu
            await this.showFruitSelectionMenu(interaction, attackerFruits, 'pvp_attacker', attackerName, battleId);
            
            return { success: true, message: "PvP fruit selection phase initiated" };

        } catch (error) {
            console.error('PvP combat initialization error:', error);
            return {
                success: false,
                message: "❌ Failed to initialize PvP combat system."
            };
        }
    }

    // Play pre-combat animation (ship arriving)
    async playPreCombatAnimation(interaction, animationType) {
        console.log(`🎬 Playing pre-combat animation: ${animationType}`);
        
        const preAnimationEmbed = {
            title: '🌊 **Battle Preparation**',
            description: 'A battle ship approaches the combat zone...',
            color: 0x3498db,
            footer: { text: 'Preparing for strategic combat...' },
            timestamp: new Date().toISOString()
        };
        
        await interaction.editReply({ embeds: [preAnimationEmbed] });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Play the ship animation
        await RaidAnimation.playQuickAnimation(interaction, animationType);
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Get user fruits with elemental information
    async getUserFruitsWithElements(userId) {
        try {
            const DatabaseManager = require('../database/manager');
            const userFruits = await DatabaseManager.getUserFruits(userId);
            
            // Process fruits and add elemental information
            const processedFruits = userFruits.map(fruit => {
                const element = DEVIL_FRUIT_ELEMENTS[fruit.fruit_id] || 'neutral';
                const elementName = this.getElementDisplayName(element);
                
                return {
                    ...fruit,
                    element: element,
                    elementName: elementName,
                    displayName: `${fruit.name}`,
                    combatPower: fruit.combat_power || this.getRarityBasePower(fruit.rarity)
                };
            });

            // Group by fruit ID to show duplicates
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
                
                // Calculate power with duplicate bonus
                const duplicateBonus = 1 + ((fruitMap[fruit.fruit_id].duplicateCount - 1) * 0.01);
                fruitMap[fruit.fruit_id].totalPower = Math.floor(fruit.combatPower * duplicateBonus);
            });

            return Object.values(fruitMap);

        } catch (error) {
            console.error('Error getting user fruits with elements:', error);
            return [];
        }
    }

    // Show fruit selection menu
    async showFruitSelectionMenu(interaction, fruits, battleType, playerName, battleId = null) {
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
        
        // Limit to top 25 fruits (Discord select menu limit)
        const displayFruits = fruits.slice(0, 25);
        
        // Create fruit selection options
        const selectOptions = displayFruits.map((fruit, index) => {
            const rarityEmojis = {
                'common': '⚪',
                'uncommon': '🟢',
                'rare': '🔵',
                'epic': '🟣',
                'legendary': '🟡',
                'mythical': '🔴',
                'omnipotent': '⭐'
            };
            
            const rarityEmoji = rarityEmojis[fruit.rarity] || '❓';
            const duplicateText = fruit.duplicateCount > 1 ? ` x${fruit.duplicateCount}` : '';
            const powerText = fruit.totalPower ? ` (${fruit.totalPower} CP)` : '';
            
            return {
                label: `${fruit.name}${duplicateText}`,
                description: `${rarityEmoji} ${fruit.rarity} • ${fruit.elementName}${powerText}`,
                value: `fruit_${index}`,
                emoji: this.getElementEmoji(fruit.element)
            };
        });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`fruit_select_${battleType}_${battleId || 'npc'}`)
            .setPlaceholder('Choose up to 3 Devil Fruits for battle...')
            .setMinValues(1)
            .setMaxValues(Math.min(3, selectOptions.length))
            .addOptions(selectOptions);

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        // Create detailed fruit list embed
        const fruitListText = displayFruits.map((fruit, index) => {
            const rarityEmojis = {
                'common': '⚪',
                'uncommon': '🟢',
                'rare': '🔵',
                'epic': '🟣',
                'legendary': '🟡',
                'mythical': '🔴',
                'omnipotent': '⭐'
            };
            
            const rarityEmoji = rarityEmojis[fruit.rarity] || '❓';
            const elementEmoji = this.getElementEmoji(fruit.element);
            const duplicateText = fruit.duplicateCount > 1 ? ` x${fruit.duplicateCount}` : '';
            const powerText = fruit.totalPower ? ` (${fruit.totalPower} CP)` : '';
            
            return `${elementEmoji} **${fruit.name}**${duplicateText}\n${rarityEmoji} ${fruit.rarity} • ${fruit.elementName}${powerText}`;
        }).join('\n\n');

        const selectionEmbed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle(`⚔️ Select Your Battle Formation - ${playerName}`)
            .setDescription(`Choose up to 3 Devil Fruits for ${battleType === 'npc' ? 'NPC combat' : 'PvP battle'}!\n\n**Your Devil Fruits:**\n\n${fruitListText}`)
            .addFields([
                {
                    name: '🎯 Strategy Tips',
                    value: '• Choose fruits with different elements for versatility\n• Higher CP fruits deal more damage\n• Consider elemental advantages',
                    inline: false
                },
                {
                    name: '⚡ Elemental System',
                    value: '🔥 Fire > Ice • ❄️ Ice > Plant • 🌿 Plant > Earth\n🌍 Earth > Lightning • ⚡ Lightning > Water • 🌊 Water > Fire',
                    inline: false
                }
            ])
            .setFooter({ text: 'Select 1-3 fruits from the dropdown menu below' })
            .setTimestamp();

        await interaction.editReply({
            embeds: [selectionEmbed],
            components: [actionRow]
        });

        // Store fruit data for selection processing
        if (battleType.startsWith('pvp') && battleId) {
            const battle = this.activeBattles.get(battleId);
            if (battle) {
                battle.selectableFruits = displayFruits;
                this.activeBattles.set(battleId, battle);
            }
        } else {
            // Store for NPC battle
            this.activeBattles.set(`npc_${interaction.user.id}`, {
                selectableFruits: displayFruits,
                battleType: 'npc',
                playerId: interaction.user.id,
                playerName: playerName
            });
        }
    }

    // Process fruit selection
    async processFruitSelection(interaction, selectedValues, battleType, battleId) {
        try {
            const { EmbedBuilder } = require('discord.js');
            
            if (battleType === 'npc') {
                // Handle NPC battle
                const battleData = this.activeBattles.get(`npc_${interaction.user.id}`);
                if (!battleData) {
                    return await interaction.reply({ content: '❌ Battle session expired!', ephemeral: true });
                }

                const selectedFruits = selectedValues.map(value => {
                    const index = parseInt(value.replace('fruit_', ''));
                    return battleData.selectableFruits[index];
                }).filter(fruit => fruit);

                await this.executeNPCBattle(interaction, selectedFruits, battleData);
                this.activeBattles.delete(`npc_${interaction.user.id}`);

            } else if (battleType === 'pvp_attacker') {
                // Handle PvP attacker selection
                const battle = this.activeBattles.get(battleId);
                if (!battle) {
                    return await interaction.reply({ content: '❌ Battle session expired!', ephemeral: true });
                }

                const selectedFruits = selectedValues.map(value => {
                    const index = parseInt(value.replace('fruit_', ''));
                    return battle.selectableFruits[index];
                }).filter(fruit => fruit);

                battle.attackerSelection = selectedFruits;
                battle.phase = 'defender_selection';
                this.activeBattles.set(battleId, battle);

                // Show defender selection
                await this.notifyDefenderSelection(interaction, battle);

            } else if (battleType === 'pvp_defender') {
                // Handle PvP defender selection
                const battle = this.activeBattles.get(battleId);
                if (!battle) {
                    return await interaction.reply({ content: '❌ Battle session expired!', ephemeral: true });
                }

                const selectedFruits = selectedValues.map(value => {
                    const index = parseInt(value.replace('fruit_', ''));
                    return battle.selectableFruits[index];
                }).filter(fruit => fruit);

                battle.defenderSelection = selectedFruits;
                battle.phase = 'combat';
                this.activeBattles.set(battleId, battle);

                // Execute PvP battle
                await this.executePvPBattle(interaction, battle);
                this.activeBattles.delete(battleId);
            }

        } catch (error) {
            console.error('Error processing fruit selection:', error);
            await interaction.reply({ content: '❌ Error processing fruit selection!', ephemeral: true });
        }
    }

    // Execute NPC battle with selected fruits
    async executeNPCBattle(interaction, selectedFruits, battleData) {
        const { EmbedBuilder } = require('discord.js');
        
        // Generate NPC fruits (balanced against player)
        const npcFruits = this.generateNPCFruits(selectedFruits);
        
        // Calculate total combat power
        const playerCP = selectedFruits.reduce((total, fruit) => total + fruit.totalPower, 0);
        const npcCP = npcFruits.reduce((total, fruit) => total + fruit.totalPower, 0);
        
        // Execute turn-based combat
        const combatResult = await this.executeTurnBasedCombat(
            interaction,
            selectedFruits,
            npcFruits,
            battleData.playerName,
            'Monkey D. Tester',
            playerCP,
            npcCP
        );

        // Show final results
        await this.showBattleResults(interaction, combatResult, 'npc');
    }

    // Execute PvP battle
    async executePvPBattle(interaction, battle) {
        const attackerCP = battle.attackerSelection.reduce((total, fruit) => total + fruit.totalPower, 0);
        const defenderCP = battle.defenderSelection.reduce((total, fruit) => total + fruit.totalPower, 0);
        
        const combatResult = await this.executeTurnBasedCombat(
            interaction,
            battle.attackerSelection,
            battle.defenderSelection,
            battle.attackerName,
            battle.defenderName,
            attackerCP,
            defenderCP
        );

        await this.showBattleResults(interaction, combatResult, 'pvp');
    }

    // Execute turn-based combat with elemental calculations
    async executeTurnBasedCombat(interaction, attackerFruits, defenderFruits, attackerName, defenderName, attackerCP, defenderCP) {
        const { EmbedBuilder } = require('discord.js');
        
        const combatLog = [];
        let attackerHP = 100;
        let defenderHP = 100;
        let turn = 1;

        // Combat embed
        const combatEmbed = new EmbedBuilder()
            .setColor(0xFF6B35)
            .setTitle('⚔️ **TURN-BASED COMBAT INITIATED**')
            .setDescription(`**${attackerName}** vs **${defenderName}**\n\nCombat power determines damage multipliers!`)
            .addFields([
                { name: `⚔️ ${attackerName}`, value: `CP: ${attackerCP.toLocaleString()}\nHP: ${attackerHP}/100`, inline: true },
                { name: `🛡️ ${defenderName}`, value: `CP: ${defenderCP.toLocaleString()}\nHP: ${defenderHP}/100`, inline: true },
                { name: '🎲 Combat Rules', value: 'Element advantages give 50% damage bonus\nCP difference affects damage multiplier', inline: false }
            ])
            .setTimestamp();

        await interaction.editReply({ embeds: [combatEmbed], components: [] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Combat loop
        while (attackerHP > 0 && defenderHP > 0 && turn <= 6) {
            // Attacker's turn
            if (attackerHP > 0) {
                const attackResult = this.calculateTurnDamage(
                    attackerFruits[Math.floor(Math.random() * attackerFruits.length)],
                    defenderFruits[Math.floor(Math.random() * defenderFruits.length)],
                    attackerCP,
                    defenderCP
                );
                
                defenderHP = Math.max(0, defenderHP - attackResult.damage);
                combatLog.push(`**Turn ${turn}A:** ${attackerName}'s ${attackResult.attackerFruit.name} ${attackResult.effectiveness} vs ${attackResult.defenderFruit.name} - **${attackResult.damage} damage**`);
            }

            if (defenderHP <= 0) break;

            // Defender's turn
            if (defenderHP > 0) {
                const defenseResult = this.calculateTurnDamage(
                    defenderFruits[Math.floor(Math.random() * defenderFruits.length)],
                    attackerFruits[Math.floor(Math.random() * attackerFruits.length)],
                    defenderCP,
                    attackerCP
                );
                
                attackerHP = Math.max(0, attackerHP - defenseResult.damage);
                combatLog.push(`**Turn ${turn}B:** ${defenderName}'s ${defenseResult.attackerFruit.name} ${defenseResult.effectiveness} vs ${defenseResult.defenderFruit.name} - **${defenseResult.damage} damage**`);
            }

            // Show turn results
            const turnEmbed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle(`⚔️ Turn ${turn} Results`)
                .setDescription(combatLog.slice(-2).join('\n\n'))
                .addFields([
                    { name: `⚔️ ${attackerName}`, value: this.createHPBar(attackerHP), inline: true },
                    { name: `🛡️ ${defenderName}`, value: this.createHPBar(defenderHP), inline: true }
                ])
                .setTimestamp();

            await interaction.editReply({ embeds: [turnEmbed] });
            await new Promise(resolve => setTimeout(resolve, 3000));

            turn++;
        }

        // Determine winner
        const winner = attackerHP > defenderHP ? attackerName : defenderName;
        const victory = attackerHP > defenderHP;

        return {
            winner,
            victory,
            finalAttackerHP: attackerHP,
            finalDefenderHP: defenderHP,
            combatLog,
            totalTurns: turn - 1
        };
    }

    // Calculate turn damage with elemental advantages
    calculateTurnDamage(attackerFruit, defenderFruit, attackerCP, defenderCP) {
        // Base damage from CP difference
        const cpRatio = attackerCP / (defenderCP || 1);
        let baseDamage = 15 + (cpRatio - 1) * 5; // Base 15 damage, modified by CP ratio
        
        // Get elemental effectiveness
        const elementalResult = ElementalCombat.calculateEffectiveness(attackerFruit.fruit_id, defenderFruit.fruit_id);
        
        // Apply elemental multiplier
        let finalDamage = Math.floor(baseDamage * elementalResult.effectiveness);
        
        // Add randomness (90-110%)
        finalDamage = Math.floor(finalDamage * (0.9 + Math.random() * 0.2));
        
        // Minimum and maximum damage bounds
        finalDamage = Math.max(5, Math.min(40, finalDamage));

        return {
            damage: finalDamage,
            attackerFruit,
            defenderFruit,
            effectiveness: elementalResult.description,
            multiplier: elementalResult.effectiveness
        };
    }

    // Generate balanced NPC fruits
    generateNPCFruits(playerFruits) {
        const { getAllFruits } = require('../data/devilfruit');
        const allFruits = getAllFruits();
        
        // Generate 3 NPC fruits with similar power level
        const npcFruits = [];
        const avgPlayerPower = playerFruits.reduce((total, fruit) => total + fruit.totalPower, 0) / playerFruits.length;
        
        for (let i = 0; i < 3; i++) {
            const randomFruit = allFruits[Math.floor(Math.random() * allFruits.length)];
            const element = DEVIL_FRUIT_ELEMENTS[randomFruit.id] || 'neutral';
            
            npcFruits.push({
                ...randomFruit,
                element: element,
                elementName: this.getElementDisplayName(element),
                totalPower: Math.floor(avgPlayerPower * (0.8 + Math.random() * 0.4)) // 80-120% of player avg
            });
        }
        
        return npcFruits;
    }

    // Show battle results
    async showBattleResults(interaction, combatResult, battleType) {
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        const resultEmbed = new EmbedBuilder()
            .setColor(combatResult.victory ? 0x00FF00 : 0xFF0000)
            .setTitle(combatResult.victory ? '🏆 **VICTORY!**' : '💀 **DEFEAT!**')
            .setDescription(`**${combatResult.winner}** emerges victorious after ${combatResult.totalTurns} turns of intense combat!`)
            .addFields([
                { name: '📊 Final Results', value: `Final HP: ${combatResult.finalAttackerHP} vs ${combatResult.finalDefenderHP}`, inline: false },
                { name: '⚔️ Combat Log', value: combatResult.combatLog.slice(-3).join('\n'), inline: false }
            ])
            .setTimestamp();

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('battle_again')
                    .setLabel('⚔️ Battle Again')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_power')
                    .setLabel('💪 View Power')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [resultEmbed], components: [actionRow] });

        // Play victory animation if player won
        if (combatResult.victory && battleType === 'npc') {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await RaidAnimation.playVictoryAnimation(interaction);
        }
    }

    // Helper methods
    createHPBar(hp) {
        const percentage = hp / 100;
        const filledBars = Math.floor(percentage * 10);
        const emptyBars = 10 - filledBars;
        
        let color = '🟢';
        if (percentage < 0.3) color = '🔴';
        else if (percentage < 0.6) color = '🟡';
        
        return `${color.repeat(filledBars)}⬜${'⬜'.repeat(emptyBars)} ${hp}/100 HP`;
    }

    getElementDisplayName(element) {
        const names = {
            fire: 'Fire 🔥',
            ice: 'Ice ❄️',
            lightning: 'Lightning ⚡',
            light: 'Light ✨',
            darkness: 'Darkness 🌑',
            magma: 'Magma 🌋',
            sand: 'Sand 🏜️',
            gas: 'Gas 💨',
            rubber: 'Rubber 🔄',
            vibration: 'Vibration 📳',
            spatial: 'Space 🌌',
            gravity: 'Gravity 🌍',
            soul: 'Soul 👻',
            poison: 'Poison ☠️',
            zoan_beast: 'Beast 🐺',
            zoan_ancient: 'Ancient 🦕',
            zoan_mythical: 'Mythical 🐉',
            metal: 'Metal ⚔️',
            stone: 'Stone 🗿',
            neutral: 'Neutral ⚪'
        };
        return names[element] || 'Unknown ❓';
    }

    getElementEmoji(element) {
        const emojis = {
            fire: '🔥',
            ice: '❄️',
            lightning: '⚡',
            light: '✨',
            darkness: '🌑',
            magma: '🌋',
            sand: '🏜️',
            gas: '💨',
            rubber: '🔄',
            vibration: '📳',
            spatial: '🌌',
            gravity: '🌍',
            soul: '👻',
            poison: '☠️',
            zoan_beast: '🐺',
            zoan_ancient: '🦕',
            zoan_mythical: '🐉',
            metal: '⚔️',
            stone: '🗿',
            neutral: '⚪'
        };
        return emojis[element] || '❓';
    }

    getRarityBasePower(rarity) {
        const rarityPowers = {
            'common': 150,
            'uncommon': 300,
            'rare': 600,
            'epic': 1000,
            'legendary': 1500,
            'mythical': 2500,
            'omnipotent': 4000
        };
        return rarityPowers[rarity?.toLowerCase()] || 150;
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

console.log('🔧 Creating strategic combat instance...');
const strategicCombatInstance = new StrategicCombatSystem();
console.log('🔧 Strategic Combat instance created successfully');

module.exports = strategicCombatInstance;
