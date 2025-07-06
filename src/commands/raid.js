// RAID COMBAT SYSTEM
// PvP raids to steal berries and devil fruits

const DatabaseManager = require('../database/manager');

class RaidCombatSystem {
    // Check if user can raid (cooldown check)
    async canRaid(userId) {
        try {
            // 2 hours = 7200000 ms
            const cooldownMs = 2 * 60 * 60 * 1000;
            const query = `
                SELECT expires_at 
                FROM user_cooldowns 
                WHERE user_id = $1 AND cooldown_type = 'raid'
                ORDER BY expires_at DESC 
                LIMIT 1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            
            if (result.rows.length === 0) {
                return { allowed: true, timeLeft: 0 };
            }
            
            const expiresAt = new Date(result.rows[0].expires_at);
            const now = new Date();
            
            if (now >= expiresAt) {
                return { allowed: true, timeLeft: 0 };
            }
            
            const timeLeft = expiresAt.getTime() - now.getTime();
            return { allowed: false, timeLeft };
            
        } catch (error) {
            console.error('Error checking raid cooldown:', error);
            // If cooldown table doesn't exist, allow raid
            return { allowed: true, timeLeft: 0 };
        }
    }
    
    // Check if target is protected from raids
    async isProtected(userId) {
        try {
            // 1 hour = 3600000 ms
            const protectionMs = 60 * 60 * 1000;
            const query = `
                SELECT created_at 
                FROM battle_history 
                WHERE defender_id = $1 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            
            if (result.rows.length === 0) {
                return { protected: false, timeLeft: 0 };
            }
            
            const lastBattle = new Date(result.rows[0].created_at);
            const protectionEnds = new Date(lastBattle.getTime() + protectionMs);
            const now = new Date();
            
            if (now >= protectionEnds) {
                return { protected: false, timeLeft: 0 };
            }
            
            const timeLeft = protectionEnds.getTime() - now.getTime();
            return { protected: true, timeLeft };
            
        } catch (error) {
            console.error('Error checking protection status:', error);
            // If battle history doesn't exist, no protection
            return { protected: false, timeLeft: 0 };
        }
    }
    
    // Execute a PvP raid
    async executeRaid(attackerId, defenderId, attackerName, defenderName) {
        try {
            // Get both players' stats
            const attackerStats = await this.getUserStats(attackerId);
            const defenderStats = await this.getUserStats(defenderId);
            
            // Calculate battle outcome
            const prediction = this.calculateBattlePrediction(attackerStats.totalCP, defenderStats.totalCP);
            const battleRoll = Math.floor(Math.random() * 100) + 1;
            const victory = battleRoll <= prediction.winChance;
            
            // Set raid cooldown for attacker
            await this.setRaidCooldown(attackerId);
            
            // Set protection for defender
            await this.setProtection(defenderId);
            
            let loot = null;
            
            if (victory) {
                // Calculate loot
                loot = await this.calculateLoot(defenderId);
                
                // Transfer loot to attacker
                if (loot.berries > 0) {
                    await this.transferBerries(defenderId, attackerId, loot.berries);
                }
                
                if (loot.fruits && loot.fruits.length > 0) {
                    await this.transferFruits(defenderId, attackerId, loot.fruits);
                }
            }
            
            // Record battle in history
            await this.recordBattle(attackerId, defenderId, victory, loot);
            
            return {
                success: true,
                victory,
                battleRoll,
                winChance: prediction.winChance,
                loot
            };
            
        } catch (error) {
            console.error('Error executing raid:', error);
            return {
                success: false,
                error: 'Raid execution failed. Please try again.'
            };
        }
    }
    
    // Calculate battle prediction
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
    
    // Get user stats (simplified version)
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
            console.error('Error getting user stats for raid:', error);
            return { totalFruits: 0, totalCP: 0 };
        }
    }
    
    // Set raid cooldown
    async setRaidCooldown(userId) {
        try {
            const expiresAt = new Date(Date.now() + EconomyConfig.getRaidCooldownMs());
            const query = `
                INSERT INTO user_cooldowns (user_id, cooldown_type, expires_at)
                VALUES ($1, 'raid', $2)
                ON CONFLICT (user_id, cooldown_type) 
                DO UPDATE SET expires_at = $2
            `;
            await DatabaseManager.query(query, [userId, expiresAt]);
        } catch (error) {
            console.error('Error setting raid cooldown:', error);
        }
    }
    
    // Set protection for defender
    async setProtection(userId) {
        try {
            const query = `
                INSERT INTO battle_history (defender_id, created_at)
                VALUES ($1, NOW())
            `;
            await DatabaseManager.query(query, [userId]);
        } catch (error) {
            console.error('Error setting protection:', error);
        }
    }
    
    // Calculate loot for successful raid
    async calculateLoot(defenderId) {
        try {
            const loot = { berries: 0, fruits: [] };
            
            // Try to get berries (would need BerryEconomySystem)
            try {
                const BerryEconomySystem = require('./economy');
                const defenderBerries = await BerryEconomySystem.getBerries(defenderId);
                const stealPercentage = EconomyConfig.getRandomBerrySteal();
                loot.berries = Math.floor(defenderBerries * stealPercentage);
            } catch (error) {
                console.warn('Berry system not available for loot calculation');
            }
            
            // Try to steal fruits
            const defenderFruits = await this.getRandomUserFruits(defenderId, EconomyConfig.maxFruitsStolen);
            for (const fruit of defenderFruits) {
                if (Math.random() < EconomyConfig.fruitStealChance) {
                    loot.fruits.push(fruit);
                }
            }
            
            return loot;
            
        } catch (error) {
            console.error('Error calculating loot:', error);
            return { berries: 0, fruits: [] };
        }
    }
    
    // Get random fruits from user
    async getRandomUserFruits(userId, maxFruits) {
        try {
            const query = `
                SELECT fruit_name, rarity
                FROM user_devil_fruits
                WHERE user_id = $1
                ORDER BY RANDOM()
                LIMIT $2
            `;
            const result = await DatabaseManager.query(query, [userId, maxFruits]);
            return result.rows.map(row => ({ name: row.fruit_name, rarity: row.rarity }));
        } catch (error) {
            console.error('Error getting random user fruits:', error);
            return [];
        }
    }
    
    // Transfer berries between users
    async transferBerries(fromUserId, toUserId, amount) {
        try {
            const BerryEconomySystem = require('./economy');
            await BerryEconomySystem.removeBerries(fromUserId, amount, `Raided by user ${toUserId}`);
            await BerryEconomySystem.addBerries(toUserId, amount, `Raid victory vs user ${fromUserId}`);
        } catch (error) {
            console.warn('Berry transfer failed:', error);
        }
    }
    
    // Transfer fruits between users
    async transferFruits(fromUserId, toUserId, fruits) {
        try {
            // This would need more complex implementation with your database structure
            console.log(`Would transfer ${fruits.length} fruits from ${fromUserId} to ${toUserId}`);
            // For now, just log it - implementation depends on your exact table structure
        } catch (error) {
            console.error('Error transferring fruits:', error);
        }
    }
    
    // Record battle in history
    async recordBattle(attackerId, defenderId, victory, loot) {
        try {
            const query = `
                INSERT INTO battle_history (attacker_id, defender_id, victory, loot_berries, loot_fruits, created_at)
                VALUES ($1, $2, $3, $4, $5, NOW())
            `;
            const lootBerries = loot ? loot.berries : 0;
            const lootFruits = loot && loot.fruits ? loot.fruits.length : 0;
            await DatabaseManager.query(query, [attackerId, defenderId, victory, lootBerries, lootFruits]);
        } catch (error) {
            console.error('Error recording battle:', error);
        }
    }
}

module.exports = new RaidCombatSystem();
