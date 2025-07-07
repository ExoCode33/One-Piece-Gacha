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

    // Multi-fruit attack system with resistance blocking
    performMultiFruitAttack(attackerFruits, defenderFruits, attackerCP, defenderHP) {
        const attacks = [];
        const totalAttacks = Math.min(attackerFruits.length, 3); // Max 3 attacks per turn
        
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
            
            const damage = this.calculateDamage(attackerCP, attackerFruit, blockingFruit || defenderFruits[0], defenderHP, blocked);
            
            attacks.push({
                attackerFruit,
                attackerElement,
                blocked,
                blockingFruit,
                damage
            });
        }
        
        return attacks;
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

    // Ship animation frames using your exact ship design
    getShipFrames() {
        return [
            `🌊 **Battle Ship Approaching!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **Ship Sailing Into Battle Zone!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **Ship Entering Combat Zone!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``,
            `🌊 **Battle Ship Ready!**\n\`\`\`\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀\n⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀\n⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀\n⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\`\`\``
        ];
    }

    // Start animated NPC combat
    async startNPCCombatWithAnimation(userId, username, interaction) {
        try {
            console.log(`🤖 Starting ENHANCED NPC combat for ${username}`);
            
            // Get user data
            const userFruits = await this.getUserFruits(userId);
            const userStats = await this.getUserStats(userId);
            
            if (!userFruits || userFruits.length === 0) {
                return {
                    success: false,
                    message: "❌ You need Devil Fruits to battle! Use `/pull` first."
                };
            }

            // NPC data
            const npcFruits = [
                { fruit_name: 'Mera Mera no Mi', rarity: 'rare' },
                { fruit_name: 'Zushi Zushi no Mi', rarity: 'epic' },
                { fruit_name: 'Hana Hana no Mi', rarity: 'uncommon' }
            ];
            const npcCP = 2000;

            // Calculate HP
            const playerMaxHP = this.calculateTotalHP(userStats.totalCP);
            const npcMaxHP = this.calculateTotalHP(npcCP);
            let playerHP = playerMaxHP;
            let npcHP = npcMaxHP;

            console.log(`💖 HP Scaling: Player ${playerMaxHP}HP (${userStats.totalCP} CP) vs NPC ${npcMaxHP}HP (${npcCP} CP)`);

            // Ship animation
            const shipFrames = this.getShipFrames();
            let currentFrame = 0;
            
            for (const frame of shipFrames) {
                await interaction.editReply({
                    content: `🏴‍☠️ **Epic Battle Approaching!**\n\n${frame}\n\n⚔️ Preparing for combat...`
                });
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // Battle preparation
            await interaction.editReply({
                content: `🏴‍☠️ **BATTLE ARENA READY!**\n\n👤 **${username}** (${userStats.totalCP} CP) | 💖 ${playerHP}/${playerMaxHP} HP\n🤖 **Monkey D. Tester** (${npcCP} CP) | 💖 ${npcHP}/${npcMaxHP} HP\n\n⚔️ **3... 2... 1... FIGHT!**`
            });
            await new Promise(resolve => setTimeout(resolve, 2000));

            const combatLog = [];
            let turn = 1;

            // 3 Turn Combat
            while (turn <= 3 && playerHP > 0 && npcHP > 0) {
                combatLog.push(`\n**═══════ TURN ${turn} ═══════**`);
                
                // Player's multi-fruit attack
                const playerAttacks = this.performMultiFruitAttack(userFruits, npcFruits, userStats.totalCP, npcMaxHP);
                let playerTurnDamage = 0;
                
                combatLog.push(`\n**${username}'s Multi-Fruit Attack:**`);
                for (const attack of playerAttacks) {
                    if (attack.blocked) {
                        combatLog.push(`🛡️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) **BLOCKED** by ${attack.blockingFruit.fruit_name}!`);
                    } else {
                        combatLog.push(`⚔️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) deals **${attack.damage}** damage!`);
                        playerTurnDamage += attack.damage;
                    }
                }
                
                npcHP = Math.max(0, npcHP - playerTurnDamage);
                combatLog.push(`💥 **Total damage:** ${playerTurnDamage} | 🤖 NPC: ${npcHP}/${npcMaxHP} HP`);

                if (npcHP <= 0) break;

                // NPC's multi-fruit attack
                const npcAttacks = this.performMultiFruitAttack(npcFruits, userFruits, npcCP, playerMaxHP);
                let npcTurnDamage = 0;
                
                combatLog.push(`\n**Monkey D. Tester's Counter-Attack:**`);
                for (const attack of npcAttacks) {
                    if (attack.blocked) {
                        combatLog.push(`🛡️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) **BLOCKED** by ${attack.blockingFruit.fruit_name}!`);
                    } else {
                        combatLog.push(`⚔️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) deals **${attack.damage}** damage!`);
                        npcTurnDamage += attack.damage;
                    }
                }
                
                playerHP = Math.max(0, playerHP - npcTurnDamage);
                combatLog.push(`💥 **Total damage:** ${npcTurnDamage} | 👤 You: ${playerHP}/${playerMaxHP} HP`);

                // Turn animation
                await interaction.editReply({
                    content: `⚔️ **TURN ${turn} - Battle in Progress!**\n\n👤 **${username}**: ${playerHP}/${playerMaxHP} HP\n🤖 **Monkey D. Tester**: ${npcHP}/${npcMaxHP} HP\n\n🔥 Combat is heating up...`
                });
                await new Promise(resolve => setTimeout(resolve, 2000));

                turn++;
            }

            // Determine result
            const victory = playerHP > npcHP;
            let berryReward = 0;

            if (victory) {
                berryReward = Math.floor(500 + Math.random() * 1000);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `NPC victory vs Monkey D. Tester`);
                    console.log(`💰 Added ${berryReward} berries to user ${userId} (NPC victory vs Monkey D. Tester)`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            return {
                success: true,
                result: victory ? 'victory' : 'defeat',
                playerHP,
                npcHP,
                playerMaxHP,
                npcMaxHP,
                combatLog,
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

    // Start animated PvP combat
    async startPvPCombatWithAnimation(attackerId, defenderId, attackerName, defenderName, interaction) {
        try {
            console.log(`⚔️ Starting ENHANCED PvP combat: ${attackerName} vs ${defenderName}`);
            
            // Get both players' data
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

            // Calculate HP
            const attackerMaxHP = this.calculateTotalHP(attackerStats.totalCP);
            const defenderMaxHP = this.calculateTotalHP(defenderStats.totalCP);
            let attackerHP = attackerMaxHP;
            let defenderHP = defenderMaxHP;

            console.log(`💖 PvP HP: ${attackerName} ${attackerMaxHP}HP vs ${defenderName} ${defenderMaxHP}HP`);

            // Ship animation
            const shipFrames = this.getShipFrames();
            
            for (const frame of shipFrames) {
                await interaction.editReply({
                    content: `🏴‍☠️ **Epic PvP Battle Approaching!**\n\n${frame}\n\n⚔️ Preparing for combat...`
                });
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // Battle preparation
            await interaction.editReply({
                content: `🏴‍☠️ **PvP BATTLE ARENA READY!**\n\n👤 **${attackerName}** (${attackerStats.totalCP} CP) | 💖 ${attackerHP}/${attackerMaxHP} HP\n👥 **${defenderName}** (${defenderStats.totalCP} CP) | 💖 ${defenderHP}/${defenderMaxHP} HP\n\n⚔️ **3... 2... 1... FIGHT!**`
            });
            await new Promise(resolve => setTimeout(resolve, 2000));

            const combatLog = [];
            let turn = 1;

            // 3 Turn PvP Combat
            while (turn <= 3 && attackerHP > 0 && defenderHP > 0) {
                combatLog.push(`\n**═══════ TURN ${turn} ═══════**`);
                
                // Attacker's multi-fruit attack
                const attackerAttacks = this.performMultiFruitAttack(attackerFruits, defenderFruits, attackerStats.totalCP, defenderMaxHP);
                let attackerTurnDamage = 0;
                
                combatLog.push(`\n**${attackerName}'s Multi-Fruit Attack:**`);
                for (const attack of attackerAttacks) {
                    if (attack.blocked) {
                        combatLog.push(`🛡️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) **BLOCKED** by ${attack.blockingFruit.fruit_name}!`);
                    } else {
                        combatLog.push(`⚔️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) deals **${attack.damage}** damage!`);
                        attackerTurnDamage += attack.damage;
                    }
                }
                
                defenderHP = Math.max(0, defenderHP - attackerTurnDamage);
                combatLog.push(`💥 **Total damage:** ${attackerTurnDamage} | 👥 ${defenderName}: ${defenderHP}/${defenderMaxHP} HP`);

                if (defenderHP <= 0) break;

                // Defender's counter-attack
                const defenderAttacks = this.performMultiFruitAttack(defenderFruits, attackerFruits, defenderStats.totalCP, attackerMaxHP);
                let defenderTurnDamage = 0;
                
                combatLog.push(`\n**${defenderName}'s Counter-Attack:**`);
                for (const attack of defenderAttacks) {
                    if (attack.blocked) {
                        combatLog.push(`🛡️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) **BLOCKED** by ${attack.blockingFruit.fruit_name}!`);
                    } else {
                        combatLog.push(`⚔️ ${attack.attackerFruit.fruit_name} (${attack.attackerElement}) deals **${attack.damage}** damage!`);
                        defenderTurnDamage += attack.damage;
                    }
                }
                
                attackerHP = Math.max(0, attackerHP - defenderTurnDamage);
                combatLog.push(`💥 **Total damage:** ${defenderTurnDamage} | 👤 ${attackerName}: ${attackerHP}/${attackerMaxHP} HP`);

                // Turn animation
                await interaction.editReply({
                    content: `⚔️ **TURN ${turn} - PvP Battle in Progress!**\n\n👤 **${attackerName}**: ${attackerHP}/${attackerMaxHP} HP\n👥 **${defenderName}**: ${defenderHP}/${defenderMaxHP} HP\n\n🔥 Epic battle is raging...`
                });
                await new Promise(resolve => setTimeout(resolve, 2000));

                turn++;
            }

            // Determine result
            const attackerVictory = attackerHP > defenderHP;
            let berryReward = 0;

            if (attackerVictory) {
                berryReward = Math.floor(200 + Math.random() * 500);
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(attackerId, berryReward, `PvP victory vs ${defenderName}`);
                    console.log(`💰 Added ${berryReward} berries to ${attackerName} (PvP victory vs ${defenderName})`);
                } catch (error) {
                    console.log('Berry system not available');
                }
            }

            return {
                success: true,
                result: attackerVictory ? 'victory' : 'defeat',
                attackerHP,
                defenderHP,
                attackerMaxHP,
                defenderMaxHP,
                combatLog,
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
