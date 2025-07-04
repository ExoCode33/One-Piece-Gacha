const { Pool } = require('pg');

class DatabaseManager {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    // User management
    async ensureUser(userId, username) {
        try {
            const result = await this.query(
                `INSERT INTO users (user_id, username, total_hunts, discovery_rate, level, created_at, updated_at)
                 VALUES ($1, $2, 0, 0, 0, NOW(), NOW())
                 ON CONFLICT (user_id) 
                 DO UPDATE SET username = $2, updated_at = NOW()
                 RETURNING *`,
                [userId, username]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error ensuring user:', error);
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const result = await this.query(
                'SELECT * FROM users WHERE user_id = $1',
                [userId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    async updateUserStats(userId) {
        try {
            // Get total hunts and unique fruits
            const huntsResult = await this.query(
                'SELECT COUNT(*) as total_hunts FROM user_devil_fruits WHERE user_id = $1',
                [userId]
            );
            
            const uniqueResult = await this.query(
                'SELECT COUNT(DISTINCT fruit_id) as unique_fruits FROM user_devil_fruits WHERE user_id = $1',
                [userId]
            );
            
            const totalHunts = parseInt(huntsResult.rows[0].total_hunts);
            const uniqueFruits = parseInt(uniqueResult.rows[0].unique_fruits);
            const discoveryRate = totalHunts > 0 ? Math.round((uniqueFruits / totalHunts) * 100) : 0;
            
            await this.query(
                `UPDATE users 
                 SET total_hunts = $2, discovery_rate = $3, updated_at = NOW()
                 WHERE user_id = $1`,
                [userId, totalHunts, discoveryRate]
            );
            
            return { totalHunts, uniqueFruits, discoveryRate };
        } catch (error) {
            console.error('Error updating user stats:', error);
            throw error;
        }
    }

    // ENHANCED Devil Fruit collection with duplicate support
    async saveUserFruit(userId, fruit) {
        try {
            console.log(`💾 Saving fruit ${fruit.name} for user ${userId}`);
            
            // Check if user already has this fruit
            const existingFruits = await this.query(
                'SELECT * FROM user_devil_fruits WHERE user_id = $1 AND fruit_id = $2',
                [userId, fruit.id]
            );
            
            let duplicateCount = existingFruits.rows.length + 1; // +1 for the one we're adding now
            
            console.log(`📊 This will be duplicate #${duplicateCount} of ${fruit.name}`);
            
            // Save the new fruit instance
            const result = await this.query(
                `INSERT INTO user_devil_fruits (user_id, fruit_id, name, type, rarity, power, previous_user, description, awakening, weakness, duplicate_count, obtained_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                 RETURNING *`,
                [userId, fruit.id, fruit.name, fruit.type, fruit.rarity, fruit.power, fruit.previousUser, fruit.description, fruit.awakening, fruit.weakness, duplicateCount]
            );
            
            // Update rarity and type stats
            await this.updateRarityStats(userId, fruit.rarity);
            await this.updateTypeStats(userId, fruit.type);
            
            // Update duplicate stats
            await this.updateDuplicateStats(userId, fruit.id, duplicateCount);
            
            console.log(`✅ Fruit saved successfully with duplicate count: ${duplicateCount}`);
            
            return {
                ...result.rows[0],
                isNewFruit: duplicateCount === 1,
                duplicateCount: duplicateCount - 1, // Return previous duplicates (before this one)
                totalDuplicates: duplicateCount
            };
        } catch (error) {
            console.error('Error saving user fruit:', error);
            throw error;
        }
    }

    // New method to handle duplicate statistics
    async updateDuplicateStats(userId, fruitId, duplicateCount) {
        try {
            await this.query(
                `INSERT INTO user_duplicate_stats (user_id, fruit_id, duplicate_count, updated_at)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (user_id, fruit_id)
                 DO UPDATE SET duplicate_count = $3, updated_at = NOW()`,
                [userId, fruitId, duplicateCount]
            );
        } catch (error) {
            console.error('Error updating duplicate stats:', error);
            throw error;
        }
    }

    async getUserFruits(userId) {
        try {
            const result = await this.query(
                'SELECT * FROM user_devil_fruits WHERE user_id = $1 ORDER BY obtained_at DESC',
                [userId]
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting user fruits:', error);
            return [];
        }
    }

    // Get user fruits with duplicate information
    async getUserFruitsWithDuplicates(userId) {
        try {
            const result = await this.query(
                `SELECT udf.*, uds.duplicate_count as total_duplicates
                 FROM user_devil_fruits udf
                 LEFT JOIN user_duplicate_stats uds ON udf.user_id = uds.user_id AND udf.fruit_id = uds.fruit_id
                 WHERE udf.user_id = $1 
                 ORDER BY udf.obtained_at DESC`,
                [userId]
            );
            
            return result.rows;
        } catch (error) {
            console.error('Error getting user fruits with duplicates:', error);
            return [];
        }
    }

    // Rarity stats
    async updateRarityStats(userId, rarity) {
        try {
            await this.query(
                `INSERT INTO user_rarity_stats (user_id, rarity, count)
                 VALUES ($1, $2, 1)
                 ON CONFLICT (user_id, rarity)
                 DO UPDATE SET count = user_rarity_stats.count + 1`,
                [userId, rarity]
            );
        } catch (error) {
            console.error('Error updating rarity stats:', error);
            throw error;
        }
    }

    async getUserRarityStats(userId) {
        try {
            const result = await this.query(
                'SELECT rarity, count FROM user_rarity_stats WHERE user_id = $1',
                [userId]
            );
            
            const stats = {};
            result.rows.forEach(row => {
                stats[row.rarity] = parseInt(row.count);
            });
            
            return stats;
        } catch (error) {
            console.error('Error getting rarity stats:', error);
            return {};
        }
    }

    // Type stats
    async updateTypeStats(userId, type) {
        try {
            await this.query(
                `INSERT INTO user_type_stats (user_id, type, count)
                 VALUES ($1, $2, 1)
                 ON CONFLICT (user_id, type)
                 DO UPDATE SET count = user_type_stats.count + 1`,
                [userId, type]
            );
        } catch (error) {
            console.error('Error updating type stats:', error);
            throw error;
        }
    }

    async getUserTypeStats(userId) {
        try {
            const result = await this.query(
                'SELECT type, count FROM user_type_stats WHERE user_id = $1',
                [userId]
            );
            
            const stats = {};
            result.rows.forEach(row => {
                stats[row.type] = parseInt(row.count);
            });
            
            return stats;
        } catch (error) {
            console.error('Error getting type stats:', error);
            return {};
        }
    }

    // Level management
    async setUserLevel(userId, level) {
        try {
            await this.query(
                `INSERT INTO user_levels (user_id, level, updated_at)
                 VALUES ($1, $2, NOW())
                 ON CONFLICT (user_id)
                 DO UPDATE SET level = $2, updated_at = NOW()`,
                [userId, level]
            );
            
            // Also update in main users table
            await this.query(
                'UPDATE users SET level = $2 WHERE user_id = $1',
                [userId, level]
            );
        } catch (error) {
            console.error('Error setting user level:', error);
            throw error;
        }
    }

    async getUserLevel(userId) {
        try {
            const result = await this.query(
                'SELECT level FROM user_levels WHERE user_id = $1',
                [userId]
            );
            return result.rows[0] ? parseInt(result.rows[0].level) : 0;
        } catch (error) {
            console.error('Error getting user level:', error);
            return 0;
        }
    }

    // Cooldown management
    async setCooldown(userId, type, endTime) {
        try {
            await this.query(
                `INSERT INTO user_cooldowns (user_id, cooldown_type, end_time)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (user_id, cooldown_type)
                 DO UPDATE SET end_time = $3`,
                [userId, type, new Date(endTime)]
            );
        } catch (error) {
            console.error('Error setting cooldown:', error);
            throw error;
        }
    }

    async getCooldown(userId, type) {
        try {
            const result = await this.query(
                'SELECT end_time FROM user_cooldowns WHERE user_id = $1 AND cooldown_type = $2',
                [userId, type]
            );
            
            if (result.rows[0]) {
                return new Date(result.rows[0].end_time).getTime();
            }
            return null;
        } catch (error) {
            console.error('Error getting cooldown:', error);
            return null;
        }
    }

    async clearExpiredCooldowns() {
        try {
            await this.query(
                'DELETE FROM user_cooldowns WHERE end_time < NOW()'
            );
        } catch (error) {
            console.error('Error clearing expired cooldowns:', error);
        }
    }

    // Battle system (for future PvP)
    async saveBattleResult(attackerId, defenderId, result, stolenFruits = []) {
        try {
            const battleResult = await this.query(
                `INSERT INTO battle_history (attacker_id, defender_id, result, stolen_fruits, battle_time)
                 VALUES ($1, $2, $3, $4, NOW())
                 RETURNING *`,
                [attackerId, defenderId, result, JSON.stringify(stolenFruits)]
            );
            return battleResult.rows[0];
        } catch (error) {
            console.error('Error saving battle result:', error);
            throw error;
        }
    }

    async getBattleHistory(userId, limit = 10) {
        try {
            const result = await this.query(
                `SELECT * FROM battle_history 
                 WHERE attacker_id = $1 OR defender_id = $1 
                 ORDER BY battle_time DESC 
                 LIMIT $2`,
                [userId, limit]
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting battle history:', error);
            return [];
        }
    }

    // Leaderboards
    async getTopCollectors(limit = 10) {
        try {
            const result = await this.query(
                `SELECT u.username, u.total_hunts, 
                        COUNT(DISTINCT udf.fruit_id) as unique_fruits,
                        u.discovery_rate, u.level
                 FROM users u
                 LEFT JOIN user_devil_fruits udf ON u.user_id = udf.user_id
                 GROUP BY u.user_id, u.username, u.total_hunts, u.discovery_rate, u.level
                 ORDER BY unique_fruits DESC, u.total_hunts DESC
                 LIMIT $1`,
                [limit]
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting top collectors:', error);
            return [];
        }
    }

    async getTopByPower(limit = 10) {
        try {
            // This would calculate total combat power for leaderboards
            const result = await this.query(
                `SELECT u.username, u.level, u.total_hunts,
                        COUNT(udf.id) as total_fruits
                 FROM users u
                 LEFT JOIN user_devil_fruits udf ON u.user_id = udf.user_id
                 GROUP BY u.user_id, u.username, u.level, u.total_hunts
                 ORDER BY u.level DESC, total_fruits DESC
                 LIMIT $1`,
                [limit]
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting top by power:', error);
            return [];
        }
    }

    // Utility functions
    async getServerStats() {
        try {
            const userCount = await this.query('SELECT COUNT(*) as count FROM users');
            const fruitCount = await this.query('SELECT COUNT(*) as count FROM user_devil_fruits');
            const battleCount = await this.query('SELECT COUNT(*) as count FROM battle_history');
            
            return {
                totalUsers: parseInt(userCount.rows[0].count),
                totalFruits: parseInt(fruitCount.rows[0].count),
                totalBattles: parseInt(battleCount.rows[0].count)
            };
        } catch (error) {
            console.error('Error getting server stats:', error);
            return { totalUsers: 0, totalFruits: 0, totalBattles: 0 };
        }
    }

    async cleanup() {
        try {
            // Clean up expired cooldowns
            await this.clearExpiredCooldowns();
            
            // Could add more cleanup tasks here
            console.log('✅ Database cleanup completed');
        } catch (error) {
            console.error('❌ Database cleanup error:', error);
        }
    }

    // Close database connection
    async close() {
        await this.pool.end();
    }
}

module.exports = new DatabaseManager();
