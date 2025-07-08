// ENHANCED STRATEGIC COMBAT SYSTEM - Fixed for 164+ Fruits
class StrategicCombatSystem {
    constructor() {
        console.log('🔧 Enhanced Strategic Combat System initialized');
        this.activeBattles = new Map();
    }

    // IMPROVED: Compact fruit selection for large collections
    async showFruitSelectionMenu(interaction, fruits, battleType, playerName, battleId = null) {
        const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
        
        // Sort fruits by power (highest first)
        const sortedFruits = fruits.sort((a, b) => b.totalPower - a.totalPower);
        
        // Limit to top 25 fruits (Discord limit)
        const displayFruits = sortedFruits.slice(0, 25);
        
        // Create selection options (NO emojis, compact format)
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

        // COMPACT: Summary instead of full list
        const totalFruits = fruits.length;
        const rarityCount = this.getRaritySummary(fruits);
        const typeCount = this.getTypeSummary(fruits);
        const avgPower = Math.round(fruits.reduce((sum, f) => sum + f.totalPower, 0) / fruits.length);

        // ENHANCED: Complete type advantage system
        const typeAdvantages = this.getCompleteTypeAdvantages();

        const selectionEmbed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle(`⚔️ Strategic Battle Formation - ${playerName}`)
            .setDescription([
                `Select up to 3 Devil Fruits for ${battleType === 'npc' ? 'NPC combat' : 'PvP battle'}!`,
                ``,
                `📊 **Your Collection Summary:**`,
                `• Total Fruits: ${totalFruits} | Average Power: ${avgPower} CP`,
                `• ${rarityCount}`,
                `• ${typeCount}`,
                ``,
                `🎯 **Showing Top 25 by Power** (sorted by Combat Power)`
            ].join('\n'))
            .addFields([
                {
                    name: '⚡ **Complete Type Advantages**',
                    value: typeAdvantages,
                    inline: false
                },
                {
                    name: '🎯 **Strategic Tips**',
                    value: [
                        '• Higher rarity = more base power',
                        '• Duplicates give +1% CP bonus each',
                        '• Mix different types for versatility',
                        '• Use type advantages for 50% damage bonus'
                    ].join('\n'),
                    inline: false
                }
            ])
            .setFooter({ 
                text: totalFruits > 25 ? 
                    `Showing top 25 of ${totalFruits} fruits | Select from dropdown below` :
                    'Select your battle formation from the dropdown below'
            })
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

    // NEW: Get compact rarity summary
    getRaritySummary(fruits) {
        const counts = {};
        fruits.forEach(fruit => {
            counts[fruit.rarity] = (counts[fruit.rarity] || 0) + 1;
        });
        
        const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
        const summary = rarityOrder
            .filter(rarity => counts[rarity])
            .map(rarity => `${rarity}: ${counts[rarity]}`)
            .join(' • ');
            
        return `Rarities: ${summary}`;
    }

    // NEW: Get compact type summary  
    getTypeSummary(fruits) {
        const counts = {};
        fruits.forEach(fruit => {
            counts[fruit.type] = (counts[fruit.type] || 0) + 1;
        });
        
        const summary = Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5) // Top 5 types
            .map(([type, count]) => `${type}: ${count}`)
            .join(' • ');
            
        return `Types: ${summary}`;
    }

    // ENHANCED: Complete type advantage system
    getCompleteTypeAdvantages() {
        return [
            '**🔥 FIRE** > Ice, Gas, Plant | **❄️ ICE** > Gas, Poison, Plant',
            '**⚡ LIGHTNING** > Metal, Water, Gas | **🌟 LIGHT** > Darkness, Ice',
            '**🌑 DARKNESS** > Light, Energy | **🌋 MAGMA** > Fire, Ice, Metal',
            '**🏜️ SAND** > Fire, Poison | **🔄 RUBBER** > Lightning, Light',
            '**📳 VIBRATION** > Stone, Metal, Magma | **🌌 SPACE** > Gravity, Matter',
            '**🌍 GRAVITY** > Light, Gas, Matter | **👻 SOUL** > Space, Biology',
            '**☠️ POISON** > Healing, Biology | **🐺 ZOAN** > Gas, Basic Types',
            '**🦕 ANCIENT** > Regular Zoan | **🐉 MYTHICAL** > Soul, Darkness'
        ].join('\n');
    }

    // ENHANCED: Detailed turn-based combat with better descriptions
    async executeTurnBasedCombat(interaction, attackerFruits, defenderFruits, attackerName, defenderName, attackerCP, defenderCP) {
        const { EmbedBuilder } = require('discord.js');
        
        const combatLog = [];
        let attackerHP = 100;
        let defenderHP = 100;
        let turn = 1;

        // Enhanced combat introduction
        const combatEmbed = new EmbedBuilder()
            .setColor(0xFF6B35)
            .setTitle('⚔️ **STRATEGIC COMBAT INITIATED**')
            .setDescription([
                `**${attackerName}** challenges **${defenderName}** to strategic battle!`,
                ``,
                `🎯 **Battle Conditions:**`,
                `• Turn-based combat with elemental strategy`,
                `• Type advantages grant 50% damage bonus`,
                `• Combat Power affects damage scaling`,
                `• Victory requires reducing opponent to 0 HP`
            ].join('\n'))
            .addFields([
                { 
                    name: `⚔️ ${attackerName} (Attacker)`, 
                    value: [
                        `💪 Combat Power: ${attackerCP.toLocaleString()} CP`,
                        `❤️ Health Points: ${attackerHP}/100 HP`,
                        `🍈 Active Fruits: ${attackerFruits.length}`
                    ].join('\n'), 
                    inline: true 
                },
                { 
                    name: `🛡️ ${defenderName} (Defender)`, 
                    value: [
                        `💪 Combat Power: ${defenderCP.toLocaleString()} CP`,
                        `❤️ Health Points: ${defenderHP}/100 HP`,
                        `🍈 Active Fruits: ${defenderFruits.length}`
                    ].join('\n'), 
                    inline: true 
                },
                {
                    name: '🎲 **Combat Mechanics**',
                    value: [
                        '• Random fruit selection each turn',
                        '• Type advantages multiply damage',
                        '• CP difference affects base damage',
                        '• RNG adds 90-110% variance'
                    ].join('\n'),
                    inline: false
                }
            ])
            .setTimestamp();

        await interaction.editReply({ embeds: [combatEmbed], components: [] });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Enhanced combat loop with detailed logging
        while (attackerHP > 0 && defenderHP > 0 && turn <= 6) {
            const turnResults = [];
            
            // Attacker's turn
            if (attackerHP > 0) {
                const attackerFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                const defenderFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                
                const attackResult = this.calculateEnhancedTurnDamage(
                    attackerFruit, defenderFruit, attackerCP, defenderCP, attackerName, defenderName
                );
                
                defenderHP = Math.max(0, defenderHP - attackResult.damage);
                turnResults.push({
                    attacker: attackerName,
                    result: attackResult,
                    newHP: defenderHP,
                    isAttacker: true
                });
                
                combatLog.push(attackResult.detailedLog);
            }

            if (defenderHP <= 0) break;

            // Defender's turn
            if (defenderHP > 0) {
                const defenderFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                const attackerFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                
                const defenseResult = this.calculateEnhancedTurnDamage(
                    defenderFruit, attackerFruit, defenderCP, attackerCP, defenderName, attackerName
                );
                
                attackerHP = Math.max(0, attackerHP - defenseResult.damage);
                turnResults.push({
                    attacker: defenderName,
                    result: defenseResult,
                    newHP: attackerHP,
                    isAttacker: false
                });
                
                combatLog.push(defenseResult.detailedLog);
            }

            // Show detailed turn results
            const turnEmbed = new EmbedBuilder()
                .setColor(turn % 2 === 1 ? 0xE74C3C : 0x3498DB)
                .setTitle(`⚔️ **Turn ${turn} - Combat Results**`)
                .setDescription(this.formatTurnResults(turnResults))
                .addFields([
                    { 
                        name: `⚔️ ${attackerName}`, 
                        value: this.createDetailedHPBar(attackerHP), 
                        inline: true 
                    },
                    { 
                        name: `🛡️ ${defenderName}`, 
                        value: this.createDetailedHPBar(defenderHP), 
                        inline: true 
                    },
                    {
                        name: '🎯 **Turn Summary**',
                        value: `Turn ${turn} completed • ${turnResults.length} attack(s) executed`,
                        inline: false
                    }
                ])
                .setFooter({ text: `Strategic Combat • Turn ${turn}/6` })
                .setTimestamp();

            await interaction.editReply({ embeds: [turnEmbed] });
            await new Promise(resolve => setTimeout(resolve, 4000));

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
            totalTurns: turn - 1,
            battleStats: {
                totalDamageDealt: combatLog.length,
                averageDamage: combatLog.reduce((sum, log) => sum + (log.damage || 0), 0) / combatLog.length,
                typeAdvantagesUsed: combatLog.filter(log => log.multiplier > 1).length
            }
        };
    }

    // ENHANCED: Detailed damage calculation with full logging
    calculateEnhancedTurnDamage(attackerFruit, defenderFruit, attackerCP, defenderCP, attackerName, defenderName) {
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
        
        // Add variance (90-110%)
        const variance = 0.9 + Math.random() * 0.2;
        finalDamage = Math.floor(finalDamage * variance);
        
        // Damage bounds
        finalDamage = Math.max(5, Math.min(45, finalDamage));
        
        // Determine attack quality
        let attackQuality = 'Normal';
        if (elementalResult.effectiveness > 1.3) attackQuality = 'Super Effective';
        else if (elementalResult.effectiveness < 0.8) attackQuality = 'Not Very Effective';
        else if (variance > 1.05) attackQuality = 'Critical Hit';
        else if (variance < 0.95) attackQuality = 'Glancing Blow';

        // Create detailed log
        const detailedLog = [
            `**${attackerName}** attacks with **${attackerFruit.name}**`,
            `🎯 Target: ${defenderName}'s **${defenderFruit.name}**`,
            `⚡ Type Matchup: ${elementalResult.description}`,
            `💥 Attack Quality: ${attackQuality}`,
            `🩸 **${finalDamage} DAMAGE**`
        ].join('\n');

        return {
            damage: finalDamage,
            attackerFruit,
            defenderFruit,
            effectiveness: elementalResult.description,
            multiplier: elementalResult.effectiveness,
            variance,
            attackQuality,
            detailedLog,
            cpRatio
        };
    }

    // NEW: Format turn results for display
    formatTurnResults(turnResults) {
        return turnResults.map((result, index) => {
            const arrow = result.isAttacker ? '⚔️' : '🛡️';
            return [
                `${arrow} **${result.attacker}** uses **${result.result.attackerFruit.name}**`,
                `${result.result.effectiveness} • ${result.result.attackQuality}`,
                `💥 **${result.result.damage} damage** → ${result.newHP} HP remaining`
            ].join('\n');
        }).join('\n\n');
    }

    // ENHANCED: Detailed HP bar with status indicators
    createDetailedHPBar(hp) {
        const percentage = hp / 100;
        const filledBars = Math.floor(percentage * 10);
        const emptyBars = 10 - filledBars;
        
        let color = '🟢';
        let status = 'Healthy';
        
        if (percentage <= 0) {
            color = '💀';
            status = 'Defeated';
        } else if (percentage < 0.25) {
            color = '🔴';
            status = 'Critical';
        } else if (percentage < 0.5) {
            color = '🟡';
            status = 'Injured';
        } else if (percentage < 0.75) {
            color = '🟠';
            status = 'Wounded';
        }
        
        const hpBar = color.repeat(filledBars) + '⬜'.repeat(emptyBars);
        return `${hpBar}\n${hp}/100 HP (${status})`;
    }

    // Enhanced battle results with detailed statistics
    async showBattleResults(interaction, combatResult, battleType) {
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        const isVictory = combatResult.victory;
        const stats = combatResult.battleStats;
        
        const resultEmbed = new EmbedBuilder()
            .setColor(isVictory ? 0x00FF00 : 0xFF0000)
            .setTitle(isVictory ? '🏆 **STRATEGIC VICTORY!**' : '💀 **HONORABLE DEFEAT!**')
            .setDescription([
                `**${combatResult.winner}** emerges victorious after ${combatResult.totalTurns} turns!`,
                ``,
                `🎯 **Battle Statistics:**`,
                `• Total Attacks: ${stats.totalDamageDealt}`,
                `• Average Damage: ${Math.round(stats.averageDamage)}`,
                `• Type Advantages: ${stats.typeAdvantagesUsed}`,
                `• Battle Duration: ${combatResult.totalTurns} turns`
            ].join('\n'))
            .addFields([
                { 
                    name: '📊 **Final Health**', 
                    value: `${combatResult.finalAttackerHP} vs ${combatResult.finalDefenderHP} HP`, 
                    inline: true 
                },
                {
                    name: '⚔️ **Combat Log (Last 3 Actions)**',
                    value: combatResult.combatLog.slice(-3).map(log => 
                        typeof log === 'string' ? log : log.detailedLog
                    ).join('\n\n'),
                    inline: false
                }
            ])
            .setFooter({ text: 'Strategic Combat System • Use type advantages for victory!' })
            .setTimestamp();

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('battle_again')
                    .setLabel('⚔️ Fight Again')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_power')
                    .setLabel('💪 View Stats')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 Collection')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [resultEmbed], components: [actionRow] });

        // Victory animation for NPC battles
        if (isVictory && battleType === 'npc') {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const RaidAnimation = require('../animations/raid');
            await RaidAnimation.playVictoryAnimation(interaction);
        }
    }

    // Additional helper methods remain the same...
    getElementDisplayName(element) {
        const names = {
            fire: 'Fire 🔥', ice: 'Ice ❄️', lightning: 'Lightning ⚡',
            light: 'Light ✨', darkness: 'Darkness 🌑', magma: 'Magma 🌋',
            sand: 'Sand 🏜️', gas: 'Gas 💨', rubber: 'Rubber 🔄',
            vibration: 'Vibration 📳', spatial: 'Space 🌌', gravity: 'Gravity 🌍',
            soul: 'Soul 👻', poison: 'Poison ☠️', zoan_beast: 'Beast 🐺',
            zoan_ancient: 'Ancient 🦕', zoan_mythical: 'Mythical 🐉',
            metal: 'Metal ⚔️', stone: 'Stone 🗿', neutral: 'Neutral ⚪'
        };
        return names[element] || 'Unknown ❓';
    }

    getRarityBasePower(rarity) {
        const powers = {
            'common': 150, 'uncommon': 300, 'rare': 600, 'epic': 1000,
            'legendary': 1500, 'mythical': 2500, 'omnipotent': 4000
        };
        return powers[rarity?.toLowerCase()] || 150;
    }
}

module.exports = new StrategicCombatSystem();
