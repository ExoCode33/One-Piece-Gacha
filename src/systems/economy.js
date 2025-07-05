// BERRY ECONOMY SYSTEM
// Hourly income based on Combat Power + currency for gacha pulls

const DatabaseManager = require('../database/manager');

class BerryEconomySystem {
    constructor() {
        this.baseIncomeRate = 100; // Base berries per hour
        this.cpMultiplier = 0.1; // 0.1 berries per CP per hour
        this.pullCost = 1000; // Cost to pull a Devil Fruit
        this.maxStoredHours = 24; // Maximum hours that can accumulate
    }

    // Calculate hourly income based on user's total combat power
    calculateHourlyIncome(totalCombatPower) {
        const cpBonus = Math.floor(totalCombatPower * this.cpMultiplier);
        const totalIncome = this.baseIncomeRate + cpBonus;
        
        // Add some scaling bonuses for high CP players
        let scalingBonus = 0;
        if (totalCombatPower >= 50000) scalingBonus += 500;
        if (totalCombatPower >= 100000) scalingBonus += 1000;
        if (totalCombatPower >= 200000) scalingBonus += 2000;
        
        return totalIncome + scalingBonus;
    }

    // Calculate accumulated berries since last collection
    async calculateAccumulatedBerries(userId) {
        try {
            // Get user's last collection time and total CP
            const user = await DatabaseManager.getUser(userId);
            if (!user) return 0;

            const lastCollection = await this.getLastCollectionTime(userId);
            const now = Date.now();
            const hoursElapsed = Math.min(
                (now - lastCollection) / (1000 * 60 * 60), // Convert to hours
                this.maxStoredHours // Cap at max stored hours
            );

            if (hoursElapsed < 1) return 0; // Must wait at least 1 hour

            // Calculate total combat power
            const totalCP = await this.calculateUserTotalCP(userId);
            const hourlyIncome = this.calculateHourlyIncome(totalCP);
            
            return Math.floor(hoursElapsed * hourlyIncome);
        } catch (error) {
            console.error('Error calculating accumulated berries:', error);
            return 0;
        }
    }

    // Calculate user's total combat power from their fruits
    async calculateUserTotalCP(userId) {
        try {
            const userFruits = await DatabaseManager.getUserFruits(userId);
            let totalCP = 0;

            // Group fruits by ID to calculate duplicate bonuses
            const fruitGroups = {};
            userFruits.forEach(fruit => {
                if (!fruitGroups[fruit.fruit_id]) {
                    fruitGroups[fruit.fruit_id] = {
                        count: 0,
                        basePower: fruit.combat_power || 100
                    };
                }
                fruitGroups[fruit.fruit_id].count++;
            });

            // Calculate total CP with duplicate bonuses
            Object.values(fruitGroups).forEach(group => {
                const duplicateBonus = 1 + (group.count - 1) * 0.01; // 1% per duplicate
                const fruitTotalCP = group.basePower * duplicateBonus * group.count;
                totalCP += fruitTotalCP;
            });

            return Math.floor(totalCP);
        } catch (error) {
            console.error('Error calculating user total CP:', error);
            return 0;
        }
    }

    // Collect accumulated berries
    async collectBerries(userId) {
        try {
            const accumulated = await this.calculateAccumulatedBerries(userId);
            if (accumulated <= 0) {
                return { success: false, amount: 0, message: 'No berries to collect yet!' };
            }

            // Add berries to user account
            await this.addBerries(userId, accumulated);
            
            // Update last collection time
            await this.updateLastCollectionTime(userId);

            return { 
                success: true, 
                amount: accumulated, 
                message: `Collected ${accumulated.toLocaleString()} berries!` 
            };
        } catch (error) {
            console.error('Error collecting berries:', error);
            return { success: false, amount: 0, message: 'Error collecting berries!' };
        }
    }

    // Add berries to user account
    async addBerries(userId, amount) {
        try {
            await DatabaseManager.query(
                `INSERT INTO user_berries (user_id, berries, updated_at)
                 VALUES ($1, $2, NOW())
                 ON CONFLICT (user_id)
                 DO UPDATE SET berries = user_berries.berries + $2, updated_at = NOW()`,
                [userId, amount]
            );
        } catch (error) {
            console.error('Error adding berries:', error);
            throw error;
        }
    }

    // Remove berries from user account
    async removeBerries(userId, amount) {
        try {
            const result = await DatabaseManager.query(
                `UPDATE user_berries 
                 SET berries = GREATEST(0, berries - $2), updated_at = NOW()
                 WHERE user_id = $1
                 RETURNING berries`,
                [userId, amount]
            );
            
            return result.rows[0]?.berries || 0;
        } catch (error) {
            console.error('Error removing berries:', error);
            throw error;
        }
    }

    // Get user's current berry balance
    async getBerries(userId) {
        try {
            const result = await DatabaseManager.query(
                'SELECT berries FROM user_berries WHERE user_id = $1',
                [userId]
            );
            return result.rows[0]?.berries || 0;
        } catch (error) {
            console.error('Error getting berries:', error);
            return 0;
        }
    }

    // Check if user can afford a pull
    async canAffordPull(userId) {
        const berries = await this.getBerries(userId);
        return berries >= this.pullCost;
    }

    // Charge for a pull
    async chargePull(userId) {
        const berries = await this.getBerries(userId);
        if (berries < this.pullCost) {
            return { success: false, remaining: berries };
        }

        const remaining = await this.removeBerries(userId, this.pullCost);
        return { success: true, remaining: remaining };
    }

    // Get or set last collection time
    async getLastCollectionTime(userId) {
        try {
            const result = await DatabaseManager.query(
                'SELECT last_collection FROM user_berries WHERE user_id = $1',
                [userId]
            );
            
            if (result.rows[0]?.last_collection) {
                return new Date(result.rows[0].last_collection).getTime();
            } else {
                // First time - set to current time minus 1 hour so they can collect immediately
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                await this.updateLastCollectionTime(userId, oneHourAgo);
                return oneHourAgo;
            }
        } catch (error) {
            console.error('Error getting last collection time:', error);
            return Date.now() - (60 * 60 * 1000); // Default to 1 hour ago
        }
    }

    async updateLastCollectionTime(userId, timestamp = Date.now()) {
        try {
            await DatabaseManager.query(
                `INSERT INTO user_berries (user_id, berries, last_collection, updated_at)
                 VALUES ($1, 0, $2, NOW())
                 ON CONFLICT (user_id)
                 DO UPDATE SET last_collection = $2, updated_at = NOW()`,
                [userId, new Date(timestamp)]
            );
        } catch (error) {
            console.error('Error updating last collection time:', error);
            throw error;
        }
    }

    // Get user economy stats
    async getUserEconomyStats(userId) {
        try {
            const berries = await this.getBerries(userId);
            const totalCP = await this.calculateUserTotalCP(userId);
            const hourlyIncome = this.calculateHourlyIncome(totalCP);
            const accumulated = await this.calculateAccumulatedBerries(userId);
            const lastCollection = await this.getLastCollectionTime(userId);
            
            const timeUntilNextHour = Math.max(0, 
                (60 * 60 * 1000) - (Date.now() - lastCollection)
            );

            return {
                berries,
                totalCP,
                hourlyIncome,
                accumulated,
                timeUntilNextHour,
                pullCost: this.pullCost,
                canAffordPull: berries >= this.pullCost
            };
        } catch (error) {
            console.error('Error getting user economy stats:', error);
            return {
                berries: 0,
                totalCP: 0,
                hourlyIncome: this.baseIncomeRate,
                accumulated: 0,
                timeUntilNextHour: 0,
                pullCost: this.pullCost,
                canAffordPull: false
            };
        }
    }

    // Initialize berry economy tables
    async initializeTables() {
        try {
            // User berries table
            await DatabaseManager.query(`
                CREATE TABLE IF NOT EXISTS user_berries (
                    user_id BIGINT PRIMARY KEY,
                    berries BIGINT DEFAULT 0,
                    last_collection TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                )
            `);

            // Create index for faster queries
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_user_berries_last_collection 
                ON user_berries(last_collection)
            `);

            console.log('✅ Berry economy tables initialized');
        } catch (error) {
            console.error('❌ Error initializing berry economy tables:', error);
            throw error;
        }
    }
}

module.exports = new BerryEconomySystem();
