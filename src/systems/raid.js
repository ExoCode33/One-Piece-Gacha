// RAID COMBAT SYSTEM
// PvP raids to steal berries and devil fruits

const DatabaseManager = require('../database/manager');
const BerryEconomySystem = require('./economy');

class RaidCombatSystem {
    constructor() {
        this.berryStealRange = { min: 0.10, max: 0.50 }; // 10-50% of target's berries
        this.fruitStealChance = 0.15; // 15% chance to steal fruits
        this.maxFruitsStolen = 3; // Maximum fruits that can be stolen
        this.raidCooldown = 2 * 60 * 60 * 1000; // 2 hours cooldown
        this.protectionTime = 1 * 60 * 60 * 1000; // 1 hour protection after being raided
    }

    // Execute a raid between two players
    async executeRaid(attackerId, defenderId) {
        try {
            // Validation checks
            const validation = await this.validateRaid(attackerId, defenderId);
            if (!validation.valid) {
                return { success: false, message: validation.message };
            }

            // Get both players' combat power
            const attackerCP = await BerryEconomySystem.calculateUserTotalCP(attackerId);
            const defenderCP = await BerryEconomySystem.calculateUserTotalCP(defenderId);

            // Calculate battle outcome
            const battleResult = this.calculateBattleOutcome(attackerCP, defenderCP);
            
            let raidResult = {
                success: battleResult.victory,
                attackerCP,
                defenderCP,
                stolenBerries: 0,
                stolenFruits: [],
                battleMessage: battleResult.message
            };

            if (battleResult.victory) {
                // Attacker wins - steal resources
                const stolenBerries = await this.stealBerries(attackerId, defenderId);
                const stolenFruits = await this.stealFruits(attackerId, defenderId);
                
                raidResult.stolenBerries = stolenBerries;
                raidResult.stolenFruits = stolenFruits;
            }

            // Record the raid
            await this.recordRaid(attackerId, defenderId, raidResult);
            
            // Set cooldowns
            await this.setRaidCooldown(attackerId);
            await this.setProtection(defenderId);

            return raidResult;

        } catch (error) {
            console.error('Error executing raid:', error);
            return { 
                success: false, 
                message: 'An error occurred during the raid!' 
            };
        }
    }

    // Validate if a raid can happen
    async validateRaid(attackerId, defenderId) {
        // Can't raid yourself
        if (attackerId === defenderId) {
            return { valid: false, message: 'You cannot raid yourself!' };
        }

        // Check if attacker is on cooldown
        const attackerCooldown = await this.getRaidCooldown(attackerId);
        if (attackerCooldown > Date.now()) {
            const remaining = Math.ceil((attackerCooldown - Date.now()) / 1000 / 60);
            return { 
                valid: false, 
                message: `You must wait ${remaining} minutes before raiding again!` 
            };
        }

        // Check if defender is protected
        const defenderProtection = await this.getProtectionTime(defenderId);
        if (defenderProtection > Date.now()) {
            const remaining = Math.ceil((defenderProtection - Date.now()) / 1000 / 60);
            return { 
                valid: false, 
                message: `This player is protected for ${remaining} more minutes!` 
            };
        }

        // Check if defender exists and has been active
        const defender = await DatabaseManager.getUser(defenderId);
        if (!defender) {
            return { valid: false, message: 'Target player not found!' };
        }

        // Check if defender has any berries or fruits
        const defenderBerries = await BerryEconomySystem.getBerries(defenderId);
        const defenderFruits = await DatabaseManager.getUserFruits(defenderId);
        
        if (defenderBerries < 100 && defenderFruits.length === 0) {
            return { 
                valid: false, 
                message: 'Target has no berries or fruits worth raiding!' 
            };
        }

        return { valid: true };
    }

    // Calculate battle outcome based on combat power
    calculateBattleOutcome(attackerCP, defenderCP) {
        // Base calculation with some randomness
        const attackerPower = attackerCP * (0.8 + Math.random() * 0.4); // 80-120% of CP
        const defenderPower = defenderCP * (0.8 + Math.random() * 0.4); // 80-120% of CP
        
        const powerRatio = attackerPower / (defenderPower + 1); // +1 to avoid division by zero
        
        // Calculate victory chance based on power ratio
        let victoryChance = 0.5; // Base 50% chance
        
        if (powerRatio > 2) {
            victoryChance = 0.85; // Much stronger
        } else if (powerRatio > 1.5) {
            victoryChance = 0.75; // Stronger
        } else if (powerRatio > 1.1) {
            victoryChance = 0.65; // Slightly stronger
        } else if (powerRatio < 0.5) {
            victoryChance = 0.15; // Much weaker
        } else if (powerRatio < 0.7) {
            victoryChance = 0.25; // Weaker
        } else if (powerRatio < 0.9) {
            victoryChance = 0.35; // Slightly weaker
        }

        const victory = Math.random() < victoryChance;
        
        let message;
        if (victory) {
            if (powerRatio > 2) {
                message = "🏆 **OVERWHELMING VICTORY!** Your superior power crushed the enemy!";
            } else if (powerRatio > 1.5) {
                message = "⚔️ **DECISIVE VICTORY!** Your strength proved superior!";
            } else {
                message = "🥊 **HARD-FOUGHT VICTORY!** You barely managed to overcome your opponent!";
            }
        } else {
            if (powerRatio < 0.5) {
                message = "💥 **CRUSHING DEFEAT!** You were no match for their power!";
            } else if (powerRatio < 0.7) {
                message = "😵 **CLEAR DEFEAT!** Their strength overwhelmed you!";
            } else {
                message = "😤 **NARROW DEFEAT!** You fought well but came up short!";
            }
        }

        return { victory, message, powerRatio };
    }

    // Steal berries from defender
    async stealBerries(attackerId, defenderId) {
        try {
            const defenderBerries = await BerryEconomySystem.getBerries(defenderId);
            if (defenderBerries < 100) return 0; // Not worth stealing if less than 100
            
            // Calculate steal amount (10-50% of defender's berries)
            const stealPercentage = this.berryStealRange.min + 
                Math.random() * (this.berryStealRange.max - this.berryStealRange.min);
            const stolenAmount = Math.floor(defenderBerries * stealPercentage);
            
            if (stolenAmount <= 0) return 0;
            
            // Transfer berries
            await BerryEconomySystem.removeBerries(defenderId, stolenAmount);
            await BerryEconomySystem.addBerries(attackerId, stolenAmount);
            
            return stolenAmount;
        } catch (error) {
            console.error('Error stealing berries:', error);
            return 0;
        }
    }

    // Steal fruits from defender
    async stealFruits(attackerId, defenderId) {
        try {
            const defenderFruits = await DatabaseManager.getUserFruits(defenderId);
            if (defenderFruits.length === 0) return [];
            
            const stolenFruits = [];
            const attempts = Math.min(this.maxFruitsStolen, defenderFruits.length);
            
            for (let i = 0; i < attempts; i++) {
                if (Math.random() < this.fruitStealChance) {
                    // Randomly select a fruit to steal
                    const randomIndex = Math.floor(Math.random() * defenderFruits.length);
                    const fruitToSteal = defenderFruits[randomIndex];
                    
                    // Transfer the fruit
                    await this.transferFruit(fruitToSteal, attackerId, defenderId);
                    stolenFruits.push(fruitToSteal);
                    
                    // Remove from defender's list to avoid stealing the same fruit twice
                    defenderFruits.splice(randomIndex, 1);
                }
            }
            
            return stolenFruits;
        } catch (error) {
            console.error('Error stealing fruits:', error);
            return [];
        }
    }

    // Transfer a fruit from defender to attacker
    async transferFruit(fruit, attackerId, defenderId) {
        try {
            // Add fruit to attacker's collection
            await DatabaseManager.query(
                `INSERT INTO user_devil_fruits (user_id, fruit_id, name, type, rarity, power, previous_user, description, awakening, weakness, combat_power, duplicate_count, obtained_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
                [attackerId, fruit.fruit_id, fruit.name, fruit.type, fruit.rarity, fruit.power, 
                 fruit.previous_user, fruit.description, fruit.awakening, fruit.weakness, 
                 fruit.combat_power, 1] // Reset duplicate count for new owner
            );
            
            // Remove from defender's collection
            await DatabaseManager.query(
                'DELETE FROM user_devil_fruits WHERE id = $1',
                [fruit.id]
            );
            
            // Update stats for both players
            await DatabaseManager.updateUserStats(attackerId);
            await DatabaseManager.updateUserStats(defenderId);
            
        } catch (error) {
            console.error('Error transferring fruit:', error);
            throw error;
        }
    }

    // Record raid in history
    async recordRaid(attackerId, defenderId, result) {
        try {
            await DatabaseManager.query(
                `INSERT INTO raid_history (attacker_id, defender_id, victory, stolen_berries, stolen_fruits, attacker_cp, defender_cp, raid_time)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [attackerId, defenderId, result.success, result.stolenBerries, 
                 JSON.stringify(result.stolenFruits), result.attackerCP, result.defenderCP]
            );
        } catch (error) {
            console.error('Error recording raid:', error);
        }
    }

    // Cooldown and protection management
    async setRaidCooldown(userId) {
        const endTime = Date.now() + this.raidCooldown;
        await DatabaseManager.query(
            `INSERT INTO user_raid_cooldowns (user_id, cooldown_end, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET cooldown_end = $2, updated_at = NOW()`,
            [userId, new Date(endTime)]
        );
    }

    async getRaidCooldown(userId) {
        try {
            const result = await DatabaseManager.query(
                'SELECT cooldown_end FROM user_raid_cooldowns WHERE user_id = $1',
                [userId]
            );
            
            if (result.rows[0]) {
                return new Date(result.rows[0].cooldown_end).getTime();
            }
            return 0;
        } catch (error) {
            console.error('Error getting raid cooldown:', error);
            return 0;
        }
    }

    async setProtection(userId) {
        const endTime = Date.now() + this.protectionTime;
        await DatabaseManager.query(
            `INSERT INTO user_raid_protection (user_id, protection_end, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET protection_end = $2, updated_at = NOW()`,
            [userId, new Date(endTime)]
        );
    }

    async getProtectionTime(userId) {
        try {
            const result = await DatabaseManager.query(
                'SELECT protection_end FROM user_raid_protection WHERE user_id = $1',
                [userId]
            );
            
            if (result.rows[0]) {
                return new Date(result.rows[0].protection_end).getTime();
            }
            return 0;
        } catch (error) {
            console.error('Error getting protection time:', error);
            return 0;
        }
    }

    // Get user's raid stats
    async getUserRaidStats(userId) {
        try {
            const cooldown = await this.getRaidCooldown(userId);
            const protection = await this.getProtectionTime(userId);
            
            // Get raid history stats
            const attackStats = await DatabaseManager.query(
                `SELECT COUNT(*) as total_attacks, 
                        SUM(CASE WHEN victory THEN 1 ELSE 0 END) as wins,
                        SUM(stolen_berries) as total_berries_stolen
                 FROM raid_history WHERE attacker_id = $1`,
                [userId]
            );
            
            const defenseStats = await DatabaseManager.query(
                `SELECT COUNT(*) as total_defenses,
                        SUM(CASE WHEN victory THEN 0 ELSE 1 END) as successful_defenses
                 FROM raid_history WHERE defender_id = $1`,
                [userId]
            );
            
            return {
                canRaid: cooldown <= Date.now(),
                cooldownRemaining: Math.max(0, cooldown - Date.now()),
                protected: protection > Date.now(),
                protectionRemaining: Math.max(0, protection - Date.now()),
                totalAttacks: parseInt(attackStats.rows[0]?.total_attacks || 0),
                wins: parseInt(attackStats.rows[0]?.wins || 0),
                totalBerriesStolen: parseInt(attackStats.rows[0]?.total_berries_stolen || 0),
                totalDefenses: parseInt(defenseStats.rows[0]?.total_defenses || 0),
                successfulDefenses: parseInt(defenseStats.rows[0]?.successful_defenses || 0)
            };
        } catch (error) {
            console.error('Error getting raid stats:', error);
            return {
                canRaid: true,
                cooldownRemaining: 0,
                protected: false,
                protectionRemaining: 0,
                totalAttacks: 0,
                wins: 0,
                totalBerriesStolen: 0,
                totalDefenses: 0,
                successfulDefenses: 0
            };
        }
    }

    // Initialize raid system tables
    async initializeTables() {
        try {
            // Raid history table
            await DatabaseManager.query(`
                CREATE TABLE IF NOT EXISTS raid_history (
                    id SERIAL PRIMARY KEY,
                    attacker_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
                    defender_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
                    victory BOOLEAN NOT NULL,
                    stolen_berries BIGINT DEFAULT 0,
                    stolen_fruits JSONB,
                    attacker_cp BIGINT DEFAULT 0,
                    defender_cp BIGINT DEFAULT 0,
                    raid_time TIMESTAMP DEFAULT NOW()
                )
            `);

            // Raid cooldowns table
            await DatabaseManager.query(`
                CREATE TABLE IF NOT EXISTS user_raid_cooldowns (
                    user_id BIGINT PRIMARY KEY,
                    cooldown_end TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                )
            `);

            // Raid protection table
            await DatabaseManager.query(`
                CREATE TABLE IF NOT EXISTS user_raid_protection (
                    user_id BIGINT PRIMARY KEY,
                    protection_end TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                )
            `);

            // Create indexes
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_raid_history_attacker 
                ON raid_history(attacker_id)
            `);
            
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_raid_history_defender 
                ON raid_history(defender_id)
            `);

            console.log('✅ Raid system tables initialized');
        } catch (error) {
            console.error('❌ Error initializing raid system tables:', error);
            throw error;
        }
    }
}

module.exports = new RaidCombatSystem();
