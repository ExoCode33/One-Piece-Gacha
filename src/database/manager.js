// src/database/manager.js - FIXED WITH PROPER CONNECTION HANDLING
const { Pool } = require('pg');

class DatabaseManager {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20, // Maximum number of connections in the pool
            idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
            connectionTimeoutMillis: 2000, // How long to wait for a connection
            acquireTimeoutMillis: 60000, // How long to wait for a connection from the pool
            maxUses: 7500, // Close connections after this many uses
        });
        
        // Add error handling for the pool
        this.pool.on('error', (err) => {
            console.error('❌ Unexpected error on idle PostgreSQL client:', err);
        });
        
        this.pool.on('connect', () => {
            console.log('✅ New PostgreSQL client connected');
        });
        
        this.pool.on('remove', () => {
            console.log('🔄 PostgreSQL client removed from pool');
        });
    }

    async query(text, params) {
        const start = Date.now();
        let client;
        
        try {
            client = await this.pool.connect();
            const result = await client.query(text, params);
            const duration = Date.now() - start;
            
            // Log slow queries (over 1 second)
            if (duration > 1000) {
                console.warn(`⚠️ Slow query detected (${duration}ms):`, text.substring(0, 100));
            }
            
            return result;
        } catch (error) {
            console.error('❌ Database query error:', error);
            console.error('Query:', text);
            console.error('Params:', params);
            throw error;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    // Test database connection
    async testConnection() {
        try {
            const result = await this.query('SELECT NOW() as current_time, version() as version');
            console.log('✅ Database connection test successful');
            console.log('📊 Database info:', {
                time: result.rows[0].current_time,
                version: result.rows[0].version.split(' ')[0]
            });
            return true;
        } catch (error) {
            console.error('❌ Database connection test failed:', error);
            return false;
        }
    }

    // PERSISTENCE FIX: This method preserves data across restarts
    async initializeDatabase() {
        try {
            console.log('🗄️ Initializing PostgreSQL database...');
            
            // Test connection first
            const connectionTest = await this.testConnection();
            if (!connectionTest) {
                throw new Error('Database connection failed');
            }
            
            // Create tables ONLY if they don't exist (preserves data)
            console.log('📋 Ensuring database tables exist...');
            
            // Users table
            await this.query(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    total_hunts INTEGER DEFAULT 0,
                    discovery_rate INTEGER DEFAULT 0,
                    level INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Devil Fruits table (main collection)
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_devil_fruits (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
                    fruit_id VARCHAR(50) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    rarity VARCHAR(50) NOT NULL,
                    power TEXT NOT NULL,
                    previous_user VARCHAR(255),
                    description TEXT,
                    awakening TEXT,
                    weakness TEXT,
                    combat_power INTEGER DEFAULT 100,
                    duplicate_count INTEGER DEFAULT 1,
                    obtained_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Berries table (economy system)
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_berries (
                    user_id TEXT PRIMARY KEY,
                    berries BIGINT DEFAULT 0,
                    total_earned BIGINT DEFAULT 0,
                    total_spent BIGINT DEFAULT 0,
                    last_income_collection TIMESTAMP DEFAULT NOW(),
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Purchases table (transaction history)
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_purchases (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    amount BIGINT NOT NULL,
                    item_name TEXT NOT NULL,
                    item_data JSONB DEFAULT '{}',
                    purchase_time TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Duplicate Stats table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_duplicate_stats (
                    user_id TEXT,
                    fruit_id VARCHAR(50),
                    duplicate_count INTEGER DEFAULT 1,
                    updated_at TIMESTAMP DEFAULT NOW(),
                    PRIMARY KEY (user_id, fruit_id)
                )
            `);
            
            // User Rarity Stats table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_rarity_stats (
                    user_id TEXT,
                    rarity VARCHAR(50),
                    count INTEGER DEFAULT 0,
                    PRIMARY KEY (user_id, rarity)
                )
            `);
            
            // User Type Stats table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_type_stats (
                    user_id TEXT,
                    type VARCHAR(50),
                    count INTEGER DEFAULT 0,
                    PRIMARY KEY (user_id, type)
                )
            `);
            
            // User Levels table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_levels (
                    user_id TEXT PRIMARY KEY,
                    level INTEGER DEFAULT 0,
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Cooldowns table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_cooldowns (
                    user_id TEXT,
                    cooldown_type VARCHAR(50),
                    end_time TIMESTAMP NOT NULL,
                    PRIMARY KEY (user_id, cooldown_type)
                )
            `);
            
            // Battle History table
            await this.query(`
                CREATE TABLE IF NOT EXISTS battle_history (
                    id SERIAL PRIMARY KEY,
                    attacker_id TEXT,
                    defender_id TEXT,
                    result VARCHAR(50) NOT NULL,
                    stolen_fruits JSONB,
                    battle_time TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // Raid History table
            await this.query(`
                CREATE TABLE IF NOT EXISTS raid_history (
                    id SERIAL PRIMARY KEY,
                    attacker_id TEXT,
                    defender_id TEXT,
                    victory BOOLEAN NOT NULL,
                    stolen_berries BIGINT DEFAULT 0,
                    stolen_fruits JSONB,
                    attacker_cp BIGINT DEFAULT 0,
                    defender_cp BIGINT DEFAULT 0,
                    raid_time TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Raid Cooldowns table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_raid_cooldowns (
                    user_id TEXT PRIMARY KEY,
                    cooldown_end TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // User Raid Protection table
            await this.query(`
                CREATE TABLE IF NOT EXISTS user_raid_protection (
                    user_id TEXT PRIMARY KEY,
                    protection_end TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // Create indexes for better performance
            console.log('🔧 Creating database indexes for optimal performance...');
            
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_user_id ON user_devil_fruits(user_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_fruit_id ON user_devil_fruits(fruit_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_rarity ON user_devil_fruits(rarity)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_obtained_at ON user_devil_fruits(obtained_at)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_berries_user_id ON user_berries(user_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_berries_last_income ON user_berries(last_income_collection)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_purchases_time ON user_purchases(purchase_time)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_user_cooldowns_end_time ON user_cooldowns(end_time)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_battle_history_attacker ON battle_history(attacker_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_battle_history_defender ON battle_history(defender_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_raid_history_attacker ON raid_history(attacker_id)`);
            await this.query(`CREATE INDEX IF NOT EXISTS idx_raid_history_defender ON raid_history(defender_id)`);
            
            console.log('✅ All database tables ready');
            console.log('✅ Database indexes created for optimal performance');
            console.log('🔄 Duplicate system enabled - fruits now gain 1% CP per duplicate!');
            console.log('✅ Database initialization complete');
            console.log('🗄️ PostgreSQL database ready for Devil Fruit data!');
            
            return true;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    // User management with better error handling
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
                `INSERT INTO user_devil_fruits (user_id, fruit_id, name, type, rarity, power, previous_user, description, awakening, weakness, combat_power, duplicate_count, obtained_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
                 RETURNING *`,
                [userId, fruit.id, fruit.name, fruit.type, fruit.rarity, fruit.power, 
                 fruit.previousUser, fruit.description, fruit.awakening, fruit.weakness, 
                 fruit.combatPower, duplicateCount]
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

    // Battle system
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
            
            // Clean up old battle history (keep last 30 days)
            await this.query(`
                DELETE FROM battle_history 
                WHERE battle_time < NOW() - INTERVAL '30 days'
            `);
            
            // Clean up old raid history (keep last 30 days)
            await this.query(`
                DELETE FROM raid_history 
                WHERE raid_time < NOW() - INTERVAL '30 days'
            `);
            
            console.log('✅ Database cleanup completed');
        } catch (error) {
            console.error('❌ Database cleanup error:', error);
        }
    }

    // Graceful shutdown
    async close() {
        try {
            await this.pool.end();
            console.log('🔒 Database connection pool closed');
        } catch (error) {
            console.error('❌ Error closing database pool:', error);
        }
    }

    // Health check
    async healthCheck() {
        try {
            const start = Date.now();
            await this.query('SELECT 1');
            const duration = Date.now() - start;
            
            return {
                healthy: true,
                responseTime: duration,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                healthy: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = new DatabaseManager();
