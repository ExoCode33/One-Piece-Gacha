// ANIMATED SHIP COMBAT SYSTEM
// Cinematic turn-based combat with ship animations and balanced damage

const DatabaseManager = require('../database/manager');

class CombatSystem {
    constructor() {
        // Elemental advantage matrix
        this.elementalAdvantages = {
            'fire': ['ice', 'plant'],
            'ice': ['plant', 'earth'],
            'plant': ['earth', 'water'],
            'earth': ['fire', 'lightning'],
            'water': ['fire', 'lightning'],
            'lightning': ['water', 'ice'],
            'darkness': ['light'],
            'light': ['darkness'],
            'gravity': ['all'],
            'soul': ['neutral'],
            'neutral': []
        };

        // Rarity-based critical hit chances
        this.rarityCritChances = {
            'common': 0.08,
            'uncommon': 0.12,
            'rare': 0.15,
            'epic': 0.18,
            'legendary': 0.22,
            'mythical': 0.25,
            'omnipotent': 0.30
        };

        // Ship ASCII art for animation
        this.shipFrames = [
            "```\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n```",
            "```\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀\n⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀\n⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀\n⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n```",
            "```\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀\n⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀\n⠀⠀⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀\n⠀⠀⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀\n```"
        ];
    }

    // Calculate total HP based on CP (more CP = much more HP)
    calculateTotalHP(totalCP) {
        const baseHP = 150;
        const hpBonus = Math.floor(totalCP / 100); // +1 HP per 100 CP (more generous)
        return Math.min(baseHP + hpBonus, 500); // Cap at 500 HP
    }

    // Get elemental type from devil fruit name
    getElementalType(fruitName) {
        const name = fruitName.toLowerCase();
        
        if (name.includes('mera') || name.includes('fire') || name.includes('flame')) return 'fire';
        if (name.includes('hie') || name.includes('ice') || name.includes('snow')) return 'ice';
        if (name.includes('hana') || name.includes('plant') || name.includes('flower')) return 'plant';
        if (name.includes('suna') || name.includes('earth') || name.includes('sand')) return 'earth';
        if (name.includes('mizu') || name.includes('water') || name.includes('aqua')) return 'water';
        if (name.includes('goro') || name.includes('denki') || name.includes('lightning')) return 'lightning';
        if (name.includes('yami') || name.includes('dark') || name.includes('kage')) return 'darkness';
        if (name.includes('pika') || name.includes('light') || name.includes('beam')) return 'light';
        if (name.includes('zushi') || name.includes('gravity')) return 'gravity';
        if (name.includes('yomi') || name.includes('soul') || name.includes('spirit')) return 'soul';
        
        return 'neutral';
    }

    // Calculate elemental effectiveness
    calculateElementalMultiplier(attackerElement, defenderElement) {
        if (attackerElement === 'gravity') return 1.3;
        if (this.elementalAdvantages[attackerElement]?.includes(defenderElement)) return 1.3;
        if (this.elementalAdvantages[defenderElement]?.includes(attackerElement)) return 0.8;
        return 1.0;
    }

    // Calculate balanced damage (heavily reduced to ensure 3 full turns)
    calculateDamage(attackerCP, attackerFruit, defenderFruit, defenderHP) {
        // Much more reduced base damage to ensure longer battles
        const baseDamage = attackerCP * 0.04; // Reduced from 0.08 to 0.04
        const attackerElement = this.getElementalType(attackerFruit.fruit_name);
        const defenderElement = this.getElementalType(defenderFruit.fruit_name);
        const elementalMultiplier = this.calculateElementalMultiplier(attackerElement, defenderElement);
        
        const critChance = this.rarityCritChances[attackerFruit.rarity] || 0.08;
        const isCritical = Math.random() < critChance;
        const critMultiplier = isCritical ? 1.3 : 1.0; // Reduced crit multiplier
        
        // Add some randomness (70% to 130% of calculated damage)
        const randomMultiplier = 0.7 + (Math.random() * 0.6);
        
        const finalDamage = Math.floor(baseDamage * elementalMultiplier * critMultiplier * randomMultiplier);
        
        // Ensure damage is reasonable (3-15% of max HP per hit for longer battles)
        const maxDamage = Math.floor(defenderHP * 0.15);
        const minDamage = Math.floor(defenderHP * 0.03);
        
        return {
            damage: Math.max(minDamage, Math.min(maxDamage, finalDamage)),
            elementalMultiplier,
            isCritical,
            attackerElement,
            defenderElement
        };
    }

    // Get description for elemental interaction
    getElementalDescription(attackerElement, defenderElement, multiplier) {
        if (multiplier > 1.0) {
            return `🔥 **ELEMENTAL ADVANTAGE!** ${attackerElement} beats ${defenderElement}!`;
        } else if (multiplier < 1.0) {
            return `🛡️ **ELEMENTAL RESISTANCE!** ${defenderElement} resists ${attackerElement}!`;
        } else {
            return `⚔️ **NEUTRAL DAMAGE** - No elemental advantage`;
        }
    }

    // Animated ship sailing
    async animateShipSailing(interaction, direction = "right") {
        try {
            for (let i = 0; i < this.shipFrames.length; i++) {
                const embed = {
                    title: `🏴‍☠️ ${direction === "right" ? "Approaching Battle Zone" : "Sailing to Combat"}`,
                    description: `${this.shipFrames[i]}\n\n⚓ **Preparing for epic combat...**`,
                    color: 0x1E90FF,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [embed] });
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second per frame
            }
        } catch (error) {
            console.warn('Ship animation failed:', error.message);
        }
    }

    async startNPCCombatWithAnimation(userId, username, interaction) {
        try {
            console.log(`🤖 Starting ANIMATED NPC combat for ${username}`);
            
            // Get user's stats and fruits
            const userStats = await this.getUserStats(userId);
            if (userStats.totalCP === 0) {
                return {
                    success: false,
                    error: 'You need Devil Fruits to fight! Use `/pull` to get some first.'
                };
            }

            const userFruits = await this.getUserFruits(userId);
            if (!userFruits || userFruits.length === 0) {
                console.warn('No fruits found, using default fruit for combat');
                const defaultFruits = [
                    { fruit_name: 'Gomu Gomu no Mi', rarity: 'common', duplicate_count: 1 }
                ];
                return await this.performAnimatedCombat(userId, username, userStats, defaultFruits, interaction, 'npc');
            }

            return await this.performAnimatedCombat(userId, username, userStats, userFruits, interaction, 'npc');
        } catch (error) {
            console.error('Animated NPC combat error:', error);
            return {
                success: false,
                error: 'Combat system error. Please try again.'
            };
        }
    }

    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        try {
            console.log(`⚔️ Starting ANIMATED PvP combat: ${attackerName} vs ${defenderName}`);
            
            // Get both players' stats and fruits
            const attackerStats = await this.getUserStats(attackerId);
            const defenderStats = await this.getUserStats(defenderId);
            
            const attackerFruits = await this.getUserFruits(attackerId);
            const defenderFruits = await this.getUserFruits(defenderId);
            
            // Fallback fruits if needed
            const attackerActiveFruits = attackerFruits.length > 0 ? attackerFruits : [{ fruit_name: 'Gomu Gomu no Mi', rarity: 'common', duplicate_count: 1 }];
            const defenderActiveFruits = defenderFruits.length > 0 ? defenderFruits : [{ fruit_name: 'Bara Bara no Mi', rarity: 'common', duplicate_count: 1 }];
            
            return await this.performAnimatedPvPCombat(attackerId, defenderId, attackerName, defenderName, attackerStats, defenderStats, attackerActiveFruits, defenderActiveFruits, interaction);
        } catch (error) {
            console.error('Animated PvP combat error:', error);
            return {
                success: false,
                error: 'PvP combat system error. Please try again.'
            };
        }
    }

    async performAnimatedCombat(userId, username, userStats, userFruits, interaction, combatType = 'npc') {
        try {
            // Ship sailing animation
            await this.animateShipSailing(interaction, "right");
            
            // NPC data with detailed fruits
            const npcFruits = [
                { fruit_name: 'Mera Mera no Mi', rarity: 'rare' },
                { fruit_name: 'Zushi Zushi no Mi', rarity: 'epic' },
                { fruit_name: 'Hana Hana no Mi', rarity: 'uncommon' },
                { fruit_name: 'Yomi Yomi no Mi', rarity: 'uncommon' }
            ];
            
            // Calculate HP for both fighters
            const playerMaxHP = this.calculateTotalHP(userStats.totalCP);
            const npcMaxHP = this.calculateTotalHP(2000); // NPC has 2000 CP
            
            console.log(`💖 HP Scaling: Player ${playerMaxHP} HP (${userStats.totalCP} CP), NPC ${npcMaxHP} HP (2000 CP)`);
            
            let playerHP = playerMaxHP;
            let npcHP = npcMaxHP;
            const combatLog = [];
            const npcCP = 2000;
            
            combatLog.push(`🏟️ **EPIC BATTLE BEGINS!**`);
            combatLog.push(`👤 **${username}** (${userStats.totalCP} CP) vs 🤖 **Monkey D. Tester** (${npcCP} CP)`);
            combatLog.push(`💖 ${username}: ${playerHP}/${playerMaxHP} HP | Monkey D. Tester: ${npcHP}/${npcMaxHP} HP\n`);
            
            // 3 animated turns of combat
            for (let turn = 1; turn <= 3 && playerHP > 0 && npcHP > 0; turn++) {
                // Show turn start animation
                const turnStartEmbed = {
                    title: `⚔️ TURN ${turn} - BATTLE IN PROGRESS!`,
                    description: `**${username}** vs **Monkey D. Tester**`,
                    fields: [
                        { name: '👤 Your HP', value: `${playerHP}/${playerMaxHP}`, inline: true },
                        { name: '🤖 NPC HP', value: `${npcHP}/${npcMaxHP}`, inline: true },
                        { name: '🎮 Status', value: `Turn ${turn} starting...`, inline: true }
                    ],
                    color: 0xFFD700,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [turnStartEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                combatLog.push(`═══════════════════════════════════════`);
                combatLog.push(`🗡️ **TURN ${turn}**`);
                combatLog.push(`═══════════════════════════════════════`);
                
                // === PLAYER'S TURN ===
                combatLog.push(`\n👤 **${username}'s Attack:**`);
                const playerFruit = userFruits[Math.floor(Math.random() * userFruits.length)];
                const npcDefenseFruit = npcFruits[Math.floor(Math.random() * npcFruits.length)];
                
                const playerAttack = this.calculateDamage(userStats.totalCP, playerFruit, npcDefenseFruit, npcMaxHP);
                
                combatLog.push(`🍈 Using: **${playerFruit.fruit_name}** (${playerAttack.attackerElement.toUpperCase()})`);
                combatLog.push(`🛡️ NPC defends with: **${npcDefenseFruit.fruit_name}** (${playerAttack.defenderElement.toUpperCase()})`);
                combatLog.push(this.getElementalDescription(playerAttack.attackerElement, playerAttack.defenderElement, playerAttack.elementalMultiplier));
                
                if (playerAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** Rarity bonus activated!`);
                }
                
                const oldNpcHP = npcHP;
                npcHP = Math.max(0, npcHP - playerAttack.damage);
                combatLog.push(`💥 **${playerAttack.damage}** damage dealt!`);
                combatLog.push(`🤖 Monkey D. Tester: ${oldNpcHP}/${npcMaxHP} → **${npcHP}/${npcMaxHP} HP**`);
                
                if (npcHP <= 0) {
                    combatLog.push(`\n🏆 **KNOCKOUT!** Monkey D. Tester is defeated in Turn ${turn}!`);
                    break;
                }
                
                // Show mid-turn update
                const midTurnEmbed = {
                    title: `⚔️ TURN ${turn} - YOUR ATTACK!`,
                    description: `**${username}** strikes with **${playerFruit.fruit_name}**!`,
                    fields: [
                        { name: '💥 Damage Dealt', value: `${playerAttack.damage}`, inline: true },
                        { name: '🤖 NPC HP', value: `${npcHP}/${npcMaxHP}`, inline: true },
                        { name: '⚡ Element', value: `${playerAttack.attackerElement.toUpperCase()}`, inline: true }
                    ],
                    color: 0xFF6B35,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [midTurnEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (npcHP <= 0) break;
                
                // === NPC'S TURN ===
                combatLog.push(`\n🤖 **Monkey D. Tester's Counter-Attack:**`);
                const npcAttackFruit = npcFruits[Math.floor(Math.random() * npcFruits.length)];
                const playerDefenseFruit = userFruits[Math.floor(Math.random() * userFruits.length)];
                
                const npcAttack = this.calculateDamage(npcCP, npcAttackFruit, playerDefenseFruit, playerMaxHP);
                
                combatLog.push(`🍈 Using: **${npcAttackFruit.fruit_name}** (${npcAttack.attackerElement.toUpperCase()})`);
                combatLog.push(`🛡️ You defend with: **${playerDefenseFruit.fruit_name}** (${npcAttack.defenderElement.toUpperCase()})`);
                combatLog.push(this.getElementalDescription(npcAttack.attackerElement, npcAttack.defenderElement, npcAttack.elementalMultiplier));
                
                if (npcAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** NPC gets lucky!`);
                }
                
                const oldPlayerHP = playerHP;
                playerHP = Math.max(0, playerHP - npcAttack.damage);
                combatLog.push(`💥 **${npcAttack.damage}** damage dealt!`);
                combatLog.push(`👤 **${username}**: ${oldPlayerHP}/${playerMaxHP} → **${playerHP}/${playerMaxHP} HP**`);
                
                if (playerHP <= 0) {
                    combatLog.push(`\n💀 **KNOCKOUT!** You are defeated in Turn ${turn}!`);
                    break;
                }
                
                // Show NPC counter-attack animation
                const npcCounterEmbed = {
                    title: `⚔️ TURN ${turn} - NPC COUNTER-ATTACK!`,
                    description: `**Monkey D. Tester** strikes back with **${npcAttackFruit.fruit_name}**!`,
                    fields: [
                        { name: '💥 Damage Dealt', value: `${npcAttack.damage}`, inline: true },
                        { name: '👤 Your HP', value: `${playerHP}/${playerMaxHP}`, inline: true },
                        { name: '⚡ Element', value: `${npcAttack.attackerElement.toUpperCase()}`, inline: true }
                    ],
                    color: 0xFF4444,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [npcCounterEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (playerHP <= 0) break;
                
                // Turn summary
                combatLog.push(`\n📊 **Turn ${turn} Summary:**`);
                combatLog.push(`👤 You: ${playerHP}/${playerMaxHP} HP | 🤖 NPC: ${npcHP}/${npcMaxHP} HP`);
                
                if (turn < 3 && playerHP > 0 && npcHP > 0) {
                    combatLog.push(`⏭️ Moving to Turn ${turn + 1}...\n`);
                    
                    // Show turn end summary
                    const turnEndEmbed = {
                        title: `📊 TURN ${turn} COMPLETE!`,
                        description: `Both fighters prepare for the next round!`,
                        fields: [
                            { name: '👤 Your HP', value: `${playerHP}/${playerMaxHP}`, inline: true },
                            { name: '🤖 NPC HP', value: `${npcHP}/${npcMaxHP}`, inline: true },
                            { name: '⏳ Next Turn', value: `Turn ${turn + 1} starting...`, inline: true }
                        ],
                        color: 0x00FF00,
                        timestamp: new Date().toISOString()
                    };
                    
                    await interaction.editReply({ embeds: [turnEndEmbed] });
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            
            // Final result
            combatLog.push(`\n🏁 **BATTLE CONCLUDED!**`);
            const result = playerHP > npcHP ? 'victory' : 'defeat';
            
            if (result === 'victory') {
                combatLog.push(`🎉 **VICTORY!** You defeated Monkey D. Tester!`);
            } else if (playerHP === 0) {
                combatLog.push(`💀 **DEFEAT!** Monkey D. Tester proved too strong!`);
            } else {
                combatLog.push(`⚖️ **TIME UP!** Battle ended after 3 turns!`);
                if (playerHP > npcHP) {
                    combatLog.push(`🏆 **You win by HP advantage!**`);
                } else {
                    combatLog.push(`💀 **NPC wins by HP advantage!**`);
                }
            }
            
            // Calculate rewards for victory
            let rewards = null;
            if (result === 'victory') {
                const berryReward = Math.floor(Math.random() * 1000) + 500;
                rewards = {
                    berries: berryReward,
                    fruits: []
                };
                
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `NPC victory vs Monkey D. Tester`);
                } catch (error) {
                    console.warn('Berry system not available');
                    rewards.berries = 0;
                }
            }
            
            console.log(`🎯 ANIMATED Combat result: ${result} for ${username}`);
            
            return {
                success: true,
                result,
                attackerHP: playerHP,
                attackerMaxHP: playerMaxHP,
                defenderHP: npcHP,
                defenderMaxHP: npcMaxHP,
                combatLog,
                rewards
            };
            
        } catch (error) {
            console.error('Animated combat performance error:', error);
            return {
                success: false,
                error: 'Combat execution error. Please try again.'
            };
        }
    }

    async performAnimatedPvPCombat(attackerId, defenderId, attackerName, defenderName, attackerStats, defenderStats, attackerFruits, defenderFruits, interaction) {
        try {
            // Ship sailing animation for PvP
            await this.animateShipSailing(interaction, "left");
            
            // Calculate HP for both fighters
            const attackerMaxHP = this.calculateTotalHP(attackerStats.totalCP);
            const defenderMaxHP = this.calculateTotalHP(defenderStats.totalCP);
            
            console.log(`💖 PvP HP Scaling: ${attackerName} ${attackerMaxHP} HP (${attackerStats.totalCP} CP), ${defenderName} ${defenderMaxHP} HP (${defenderStats.totalCP} CP)`);
            
            let attackerHP = attackerMaxHP;
            let defenderHP = defenderMaxHP;
            const combatLog = [];
            
            combatLog.push(`🏟️ **EPIC PvP BATTLE BEGINS!**`);
            combatLog.push(`👤 **${attackerName}** (${attackerStats.totalCP} CP) vs 👥 **${defenderName}** (${defenderStats.totalCP} CP)`);
            combatLog.push(`💖 ${attackerName}: ${attackerHP}/${attackerMaxHP} HP | ${defenderName}: ${defenderHP}/${defenderMaxHP} HP\n`);
            
            // 3 animated turns of PvP combat
            for (let turn = 1; turn <= 3 && attackerHP > 0 && defenderHP > 0; turn++) {
                // Show turn start animation
                const turnStartEmbed = {
                    title: `⚔️ TURN ${turn} - PvP BATTLE!`,
                    description: `**${attackerName}** vs **${defenderName}**`,
                    fields: [
                        { name: '👤 Attacker HP', value: `${attackerHP}/${attackerMaxHP}`, inline: true },
                        { name: '👥 Defender HP', value: `${defenderHP}/${defenderMaxHP}`, inline: true },
                        { name: '🎮 Status', value: `Turn ${turn} in progress...`, inline: true }
                    ],
                    color: 0xFFD700,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [turnStartEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                combatLog.push(`═══════════════════════════════════════`);
                combatLog.push(`🗡️ **TURN ${turn}**`);
                combatLog.push(`═══════════════════════════════════════`);
                
                // === ATTACKER'S TURN ===
                combatLog.push(`\n👤 **${attackerName}'s Attack:**`);
                const attackerFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                const defenderDefenseFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                
                const attackerAttack = this.calculateDamage(attackerStats.totalCP, attackerFruit, defenderDefenseFruit, defenderMaxHP);
                
                combatLog.push(`🍈 Using: **${attackerFruit.fruit_name}** (${attackerAttack.attackerElement.toUpperCase()})`);
                combatLog.push(`🛡️ ${defenderName} defends with: **${defenderDefenseFruit.fruit_name}** (${attackerAttack.defenderElement.toUpperCase()})`);
                combatLog.push(this.getElementalDescription(attackerAttack.attackerElement, attackerAttack.defenderElement, attackerAttack.elementalMultiplier));
                
                if (attackerAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** ${attackerName} gets a rarity bonus!`);
                }
                
                const oldDefenderHP = defenderHP;
                defenderHP = Math.max(0, defenderHP - attackerAttack.damage);
                combatLog.push(`💥 **${attackerAttack.damage}** damage dealt!`);
                combatLog.push(`👥 ${defenderName}: ${oldDefenderHP}/${defenderMaxHP} → **${defenderHP}/${defenderMaxHP} HP**`);
                
                if (defenderHP <= 0) {
                    combatLog.push(`\n🏆 **KNOCKOUT!** ${defenderName} is defeated in Turn ${turn}!`);
                    break;
                }
                
                // Show attacker's move animation
                const attackerMoveEmbed = {
                    title: `⚔️ TURN ${turn} - ${attackerName.toUpperCase()}'S ATTACK!`,
                    description: `**${attackerName}** strikes with **${attackerFruit.fruit_name}**!`,
                    fields: [
                        { name: '💥 Damage Dealt', value: `${attackerAttack.damage}`, inline: true },
                        { name: '👥 Defender HP', value: `${defenderHP}/${defenderMaxHP}`, inline: true },
                        { name: '⚡ Element', value: `${attackerAttack.attackerElement.toUpperCase()}`, inline: true }
                    ],
                    color: 0xFF6B35,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [attackerMoveEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (defenderHP <= 0) break;
                
                // === DEFENDER'S TURN ===
                combatLog.push(`\n👥 **${defenderName}'s Counter-Attack:**`);
                const defenderAttackFruit = defenderFruits[Math.floor(Math.random() * defenderFruits.length)];
                const attackerDefenseFruit = attackerFruits[Math.floor(Math.random() * attackerFruits.length)];
                
                const defenderAttack = this.calculateDamage(defenderStats.totalCP, defenderAttackFruit, attackerDefenseFruit, attackerMaxHP);
                
                combatLog.push(`🍈 Using: **${defenderAttackFruit.fruit_name}** (${defenderAttack.attackerElement.toUpperCase()})`);
                combatLog.push(`🛡️ ${attackerName} defends with: **${attackerDefenseFruit.fruit_name}** (${defenderAttack.defenderElement.toUpperCase()})`);
                combatLog.push(this.getElementalDescription(defenderAttack.attackerElement, defenderAttack.defenderElement, defenderAttack.elementalMultiplier));
                
                if (defenderAttack.isCritical) {
                    combatLog.push(`⭐ **CRITICAL HIT!** ${defenderName} gets lucky!`);
                }
                
                const oldAttackerHP = attackerHP;
                attackerHP = Math.max(0, attackerHP - defenderAttack.damage);
                combatLog.push(`💥 **${defenderAttack.damage}** damage dealt!`);
                combatLog.push(`👤 ${attackerName}: ${oldAttackerHP}/${attackerMaxHP} → **${attackerHP}/${attackerMaxHP} HP**`);
                
                if (attackerHP <= 0) {
                    combatLog.push(`\n💀 **KNOCKOUT!** ${attackerName} is defeated in Turn ${turn}!`);
                    break;
                }
                
                // Show defender's counter-attack animation
                const defenderCounterEmbed = {
                    title: `⚔️ TURN ${turn} - ${defenderName.toUpperCase()}'S COUNTER!`,
                    description: `**${defenderName}** strikes back with **${defenderAttackFruit.fruit_name}**!`,
                    fields: [
                        { name: '💥 Damage Dealt', value: `${defenderAttack.damage}`, inline: true },
                        { name: '👤 Attacker HP', value: `${attackerHP}/${attackerMaxHP}`, inline: true },
                        { name: '⚡ Element', value: `${defenderAttack.attackerElement.toUpperCase()}`, inline: true }
                    ],
                    color: 0xFF4444,
                    timestamp: new Date().toISOString()
                };
                
                await interaction.editReply({ embeds: [defenderCounterEmbed] });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (attackerHP <= 0) break;
                
                // Turn summary
                combatLog.push(`\n📊 **Turn ${turn} Summary:**`);
                combatLog.push(`👤 ${attackerName}: ${attackerHP}/${attackerMaxHP} HP | 👥 ${defenderName}: ${defenderHP}/${defenderMaxHP} HP`);
                
                if (turn < 3 && attackerHP > 0 && defenderHP > 0) {
                    combatLog.push(`⏭️ Moving to Turn ${turn + 1}...\n`);
                    
                    // Show turn end summary
                    const turnEndEmbed = {
                        title: `📊 TURN ${turn} COMPLETE!`,
                        description: `Both fighters prepare for the next round!`,
                        fields: [
                            { name: '👤 Attacker HP', value: `${attackerHP}/${attackerMaxHP}`, inline: true },
                            { name: '👥 Defender HP', value: `${defenderHP}/${defenderMaxHP}`, inline: true },
                            { name: '⏳ Next Turn', value: `Turn ${turn + 1} starting...`, inline: true }
                        ],
                        color: 0x00FF00,
                        timestamp: new Date().toISOString()
                    };
                    
                    await interaction.editReply({ embeds: [turnEndEmbed] });
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            
            // Final result
            combatLog.push(`\n🏁 **PvP BATTLE CONCLUDED!**`);
            const result = attackerHP > defenderHP ? 'victory' : 'defeat';
            
            if (attackerHP > 0 && defenderHP <= 0) {
                combatLog.push(`🎉 **VICTORY!** ${attackerName} defeated ${defenderName}!`);
            } else if (defenderHP > 0 && attackerHP <= 0) {
                combatLog.push(`💀 **DEFEAT!** ${defenderName} proved too strong!`);
            } else {
                combatLog.push(`⚖️ **TIME UP!** Battle ended after 3 turns!`);
                if (attackerHP > defenderHP) {
                    combatLog.push(`🏆 **${attackerName} wins by HP advantage!**`);
                } else if (defenderHP > attackerHP) {
                    combatLog.push(`🏆 **${defenderName} wins by HP advantage!**`);
                } else {
                    combatLog.push(`🤝 **DRAW!** Both fighters have equal HP!`);
                }
            }
            
            // Calculate rewards for victory
            let rewards = null;
            if (result === 'victory') {
                const berryReward = Math.floor(Math.random() * 500) + 200;
                rewards = {
                    berries: berryReward,
                    fruits: []
                };
                
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(attackerId, berryReward, `PvP victory vs ${defenderName}`);
                } catch (error) {
                    console.warn('Berry system not available for PvP rewards');
                    rewards.berries = 0;
                }
            }
            
            console.log(`🎯 ANIMATED PvP result: ${result} for ${attackerName} vs ${defenderName}`);
            
            return {
                success: true,
                result,
                attackerHP: attackerHP,
                attackerMaxHP: attackerMaxHP,
                defenderHP: defenderHP,
                defenderMaxHP: defenderMaxHP,
                combatLog,
                rewards
            };
            
        } catch (error) {
            console.error('Animated PvP combat error:', error);
            return {
                success: false,
                error: 'PvP combat system error. Please try again.'
            };
        }
    }

    // Get user statistics
    async getUserStats(userId) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_fruits,
                    COALESCE(SUM(CASE 
                        WHEN rarity = 'common' THEN 50 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'uncommon' THEN 150 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'rare' THEN 400 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'epic' THEN 800 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'legendary' THEN 1500 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'mythical' THEN 2500 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'omnipotent' THEN 5000 * (1 + duplicate_count * 0.01)
                        ELSE 50
                    END), 0) as total_cp
                FROM user_devil_fruits
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const stats = result.rows[0];
            
            return {
                totalFruits: parseInt(stats.total_fruits) || 0,
                totalCP: Math.floor(parseFloat(stats.total_cp)) || 0
            };
            
        } catch (error) {
            console.error('Error getting user stats:', error);
            return { totalFruits: 0, totalCP: 0 };
        }
    }

    // Get user's devil fruits
    async getUserFruits(userId) {
        try {
            const possibleQueries = [
                'SELECT fruit_name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1',
                'SELECT name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1',
                'SELECT fruit_id, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1',
                'SELECT devil_fruit_name, rarity, duplicate_count FROM user_devil_fruits WHERE user_id = $1'
            ];
            
            for (const query of possibleQueries) {
                try {
                    const result = await DatabaseManager.query(query, [userId]);
                    return result.rows.map(row => ({
                        fruit_name: row.fruit_name || row.name || row.fruit_id || row.devil_fruit_name,
                        rarity: row.rarity,
                        duplicate_count: row.duplicate_count
                    }));
                } catch (error) {
                    continue;
                }
            }
            
            console.warn('Could not find fruits with any column name variation');
            return [];
            
        } catch (error) {
            console.error('Error getting user fruits:', error);
            return [];
        }
    }

    // Simple battle prediction for PvP
    calculateBattlePrediction(attackerCP, defenderCP) {
        const cpDifference = attackerCP - defenderCP;
        const baseChance = 50;
        const cpBonus = Math.floor(cpDifference / 100) * 5;
        const winChance = Math.max(10, Math.min(90, baseChance + cpBonus));
        
        let outcome;
        if (winChance >= 70) {
            outcome = 'Highly Favored';
        } else if (winChance >= 55) {
            outcome = 'Favored';
        } else if (winChance >= 45) {
            outcome = 'Even Match';
        } else if (winChance >= 30) {
            outcome = 'Underdog';
        } else {
            outcome = 'Heavy Underdog';
        }
        
        return { winChance, outcome };
    }
}

module.exports = new CombatSystem();
