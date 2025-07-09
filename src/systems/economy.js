// src/systems/economy.js - COMPLETE IMPLEMENTATION
const DatabaseManager = require('../database/manager');

class BerryEconomySystem {
    constructor() {
        this.baseIncomeRate = parseInt(process.env.BASE_INCOME_RATE) || 100;
        this.cpMultiplier = parseFloat(process.env.CP_MULTIPLIER) || 0.1;
        this.maxStoredHours = parseInt(process.env.MAX_STORED_HOURS) || 24;
        this.pullCost = parseInt(process.env.PULL_COST) || 1000;
        
        // CP Milestone bonuses
        this.cpBonuses = {
            '50k': parseInt(process.env.CP_50K_BONUS) || 500,
            '100k': parseInt(process.env.CP_100K_BONUS) || 1000,
            '200k': parseInt(process.env.CP_200K_BONUS) || 2000
        };
        
        console.log('💰 Berry Economy System initialized');
    }

    // Initialize the berry economy table
    async initializeBerryTable() {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS user_berries (
                    user_id TEXT PRIMARY KEY,
                    berries BIGINT DEFAULT 0,
                    total_earned BIGINT DEFAULT 0,
                    total_spent BIGINT DEFAULT 0,
                    last_income_collection TIMESTAMP DEFAULT NOW(),
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `;
            
            await DatabaseManager.query(query);
            
            // Create indexes
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_user_berries_user_id 
                ON user_berries(user_id)
            `);
            
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_user_berries_last_income 
                ON user_berries(last_income_collection)
            `);
            
            console.log('✅ User berries table ready');
        } catch (error) {
            console.error('Error initializing berry table:', error);
            throw error;
        }
    }

    // Initialize purchase tracking table
    async initializePurchaseTable() {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS user_purchases (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    amount BIGINT NOT NULL,
                    item_name TEXT NOT NULL,
                    item_data JSONB DEFAULT '{}',
                    purchase_time TIMESTAMP DEFAULT NOW()
                )
            `;
            
            await DatabaseManager.query(query);
            
            // Create indexes
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id 
                ON user_purchases(user_id)
            `);
            
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_user_purchases_time 
                ON user_purchases(purchase_time)
            `);
            
            console.log('✅ User purchases table ready');
        } catch (error) {
            console.error('Error initializing purchase table:', error);
            throw error;
        }
    }

    // Get user's berry balance
    async getBerries(userId) {
        try {
            await this.ensureUserExists(userId);
            
            const query = 'SELECT berries FROM user_berries WHERE user_id = $1';
            const result = await DatabaseManager.query(query, [userId]);
            
            return result.rows[0] ? parseInt(result.rows[0].berries) : 0;
        } catch (error) {
            console.error('Error getting berries:', error);
            return 0;
        }
    }

    // Add berries to user's account
    async addBerries(userId, amount, reason = 'Unknown') {
        try {
            await this.ensureUserExists(userId);
            
            const query = `
                UPDATE user_berries 
                SET berries = berries + $2, 
                    total_earned = total_earned + $2,
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING berries
            `;
            
            const result = await DatabaseManager.query(query, [userId, amount]);
            const newBalance = parseInt(result.rows[0].berries);
            
            console.log(`💰 Added ${amount} berries to ${userId} (${reason}). New balance: ${newBalance}`);
            return newBalance;
        } catch (error) {
            console.error('Error adding berries:', error);
            throw error;
        }
    }

    // Remove berries from user's account
    async removeBerries(userId, amount, reason = 'Unknown') {
        try {
            await this.ensureUserExists(userId);
            
            const currentBerries = await this.getBerries(userId);
            if (currentBerries < amount) {
                console.log(`❌ User ${userId} doesn't have enough berries (${currentBerries} < ${amount})`);
                return false;
            }
            
            const query = `
                UPDATE user_berries 
                SET berries = berries - $2, 
                    total_spent = total_spent + $2,
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING berries
            `;
            
            const result = await DatabaseManager.query(query, [userId, amount]);
            const newBalance = parseInt(result.rows[0].berries);
            
            console.log(`💸 Removed ${amount} berries from ${userId} (${reason}). New balance: ${newBalance}`);
            return newBalance;
        } catch (error) {
            console.error('Error removing berries:', error);
            throw error;
        }
    }

    // Ensure user exists in berry system
    async ensureUserExists(userId) {
        try {
            const query = `
                INSERT INTO user_berries (user_id, berries, total_earned, total_spent, last_income_collection)
                VALUES ($1, 0, 0, 0, NOW())
                ON CONFLICT (user_id) DO NOTHING
            `;
            
            await DatabaseManager.query(query, [userId]);
        } catch (error) {
            console.error('Error ensuring user exists:', error);
            throw error;
        }
    }

    // Calculate user's total combat power
    async calculateUserTotalCP(userId) {
        try {
            const userFruits = await DatabaseManager.getUserFruits(userId);
            
            if (userFruits.length === 0) {
                return 0;
            }
            
            // Group fruits by ID to calculate duplicates
            const fruitMap = {};
            userFruits.forEach(fruit => {
                if (!fruitMap[fruit.fruit_id]) {
                    fruitMap[fruit.fruit_id] = {
                        count: 0,
                        basePower: fruit.combat_power || this.getRarityBasePower(fruit.rarity)
                    };
                }
                fruitMap[fruit.fruit_id].count++;
            });
            
            // Calculate total CP with duplicate bonuses
            let totalCP = 0;
            Object.values(fruitMap).forEach(fruitData => {
                const duplicateBonus = 1 + (fruitData.count - 1) * 0.01; // 1% per duplicate
                const totalFruitPower = Math.floor(fruitData.basePower * duplicateBonus);
                totalCP += totalFruitPower * fruitData.count;
            });
            
            return totalCP;
        } catch (error) {
            console.error('Error calculating user total CP:', error);
            return 0;
        }
    }

    // Get base power for rarity
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

    // Calculate user's hourly income
    async calculateHourlyIncome(userId) {
        try {
            const totalCP = await this.calculateUserTotalCP(userId);
            
            if (totalCP === 0) {
                return 0; // No income without Devil Fruits
            }
            
            let income = this.baseIncomeRate + (totalCP * this.cpMultiplier);
            
            // Add milestone bonuses
            if (totalCP >= 200000) {
                income += this.cpBonuses['200k'];
            } else if (totalCP >= 100000) {
                income += this.cpBonuses['100k'];
            } else if (totalCP >= 50000) {
                income += this.cpBonuses['50k'];
            }
            
            return Math.floor(income);
        } catch (error) {
            console.error('Error calculating hourly income:', error);
            return 0;
        }
    }

    // Collect accumulated income
    async collectIncome(userId, username) {
        try {
            await this.ensureUserExists(userId);
            
            const query = `
                SELECT berries, last_income_collection, total_earned
                FROM user_berries 
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const userData = result.rows[0];
            
            if (!userData) {
                return { collected: 0, newBalance: 0, hoursCollected: 0 };
            }
            
            const lastCollection = new Date(userData.last_income_collection);
            const now = new Date();
            const hoursElapsed = Math.min(
                (now - lastCollection) / (1000 * 60 * 60), 
                this.maxStoredHours
            );
            
            // Must wait at least 1 hour
            if (hoursElapsed < 1) {
                return { 
                    collected: 0, 
                    newBalance: parseInt(userData.berries),
                    hoursCollected: 0,
                    timeUntilNext: Math.ceil((1 - hoursElapsed) * 60) // minutes
                };
            }
            
            const hourlyRate = await this.calculateHourlyIncome(userId);
            const collectedAmount = Math.floor(hourlyRate * hoursElapsed);
            
            if (collectedAmount <= 0) {
                return { collected: 0, newBalance: parseInt(userData.berries), hoursCollected: 0 };
            }
            
            // Update berries and last collection time
            const updateQuery = `
                UPDATE user_berries 
                SET berries = berries + $2,
                    total_earned = total_earned + $2,
                    last_income_collection = NOW(),
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING berries
            `;
            
            const updateResult = await DatabaseManager.query(updateQuery, [userId, collectedAmount]);
            const newBalance = parseInt(updateResult.rows[0].berries);
            
            console.log(`💰 ${username} collected ${collectedAmount} berries (${Math.floor(hoursElapsed * 10) / 10} hours)`);
            
            return { 
                collected: collectedAmount, 
                newBalance: newBalance,
                hoursCollected: Math.floor(hoursElapsed * 10) / 10,
                hourlyRate: hourlyRate
            };
            
        } catch (error) {
            console.error('Error collecting income:', error);
            return { collected: 0, newBalance: 0, hoursCollected: 0 };
        }
    }

    // Get detailed balance information
    async getDetailedBalance(userId) {
        try {
            await this.ensureUserExists(userId);
            
            const query = `
                SELECT berries, total_earned, total_spent, created_at, last_income_collection
                FROM user_berries 
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const userData = result.rows[0];
            
            if (!userData) {
                return {
                    balance: 0,
                    totalEarned: 0,
                    totalSpent: 0,
                    netWorth: 0,
                    accountAge: 0,
                    lastActivity: null
                };
            }
            
            const accountAge = Math.floor((new Date() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24));
            const netWorth = parseInt(userData.total_earned) - parseInt(userData.total_spent);
            
            return {
                balance: parseInt(userData.berries),
                totalEarned: parseInt(userData.total_earned),
                totalSpent: parseInt(userData.total_spent),
                netWorth: netWorth,
                accountAge: accountAge,
                lastActivity: new Date(userData.last_income_collection)
            };
            
        } catch (error) {
            console.error('Error getting detailed balance:', error);
            return {
                balance: 0,
                totalEarned: 0,
                totalSpent: 0,
                netWorth: 0,
                accountAge: 0,
                lastActivity: null
            };
        }
    }

    // Get income collection data
    async getIncomeCollectionData(userId) {
        try {
            await this.ensureUserExists(userId);
            
            const query = `
                SELECT berries, last_income_collection, total_earned, total_spent
                FROM user_berries 
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const userData = result.rows[0];
            
            if (!userData) {
                return {
                    currentBerries: 0,
                    accumulatedIncome: 0,
                    hoursAccumulated: 0,
                    canCollect: false,
                    nextCollection: null,
                    totalEarned: 0,
                    totalSpent: 0
                };
            }
            
            const lastCollection = new Date(userData.last_income_collection);
            const now = new Date();
            const hoursElapsed = Math.min(
                (now - lastCollection) / (1000 * 60 * 60), 
                this.maxStoredHours
            );
            
            const hourlyRate = await this.calculateHourlyIncome(userId);
            const accumulatedIncome = Math.floor(hourlyRate * hoursElapsed);
            const canCollect = hoursElapsed >= 1;
            
            const nextCollectionTime = canCollect ? null : 
                new Date(lastCollection.getTime() + (60 * 60 * 1000)); // +1 hour
            
            return {
                currentBerries: parseInt(userData.berries),
                accumulatedIncome: accumulatedIncome,
                hoursAccumulated: Math.floor(hoursElapsed * 10) / 10,
                canCollect: canCollect,
                nextCollection: nextCollectionTime,
                hourlyRate: hourlyRate,
                totalEarned: parseInt(userData.total_earned),
                totalSpent: parseInt(userData.total_spent)
            };
            
        } catch (error) {
            console.error('Error getting income collection data:', error);
            return {
                currentBerries: 0,
                accumulatedIncome: 0,
                hoursAccumulated: 0,
                canCollect: false,
                nextCollection: null,
                hourlyRate: 100,
                totalEarned: 0,
                totalSpent: 0
            };
        }
    }

    // Get user economic statistics
    async getUserEconomicStats(userId) {
        try {
            const balance = await this.getDetailedBalance(userId);
            const totalCP = await this.calculateUserTotalCP(userId);
            const hourlyIncome = await this.calculateHourlyIncome(userId);
            
            return {
                ...balance,
                totalCP: totalCP,
                hourlyIncome: hourlyIncome,
                incomeRank: 'Unknown' // Could implement ranking system
            };
        } catch (error) {
            console.error('Error getting user economic stats:', error);
            return {
                balance: 0,
                totalEarned: 0,
                totalSpent: 0,
                netWorth: 0,
                accountAge: 0,
                totalCP: 0,
                hourlyIncome: 0,
                incomeRank: 'Unknown'
            };
        }
    }

    // Get economic statistics for admins
    async getEconomicStatistics() {
        try {
            await this.initializeBerryTable();
            
            const query = `
                SELECT 
                    COUNT(*) as total_users,
                    SUM(berries) as total_berries_in_circulation,
                    AVG(berries) as average_balance,
                    SUM(total_earned) as total_berries_generated,
                    SUM(total_spent) as total_berries_spent,
                    MAX(berries) as richest_user_balance,
                    MIN(berries) as poorest_user_balance
                FROM user_berries
            `;
            
            const result = await DatabaseManager.query(query);
            const stats = result.rows[0];
            
            return {
                totalUsers: parseInt(stats.total_users),
                totalBerriesInCirculation: parseInt(stats.total_berries_in_circulation || 0),
                averageBalance: Math.round(parseFloat(stats.average_balance || 0)),
                totalBerriesGenerated: parseInt(stats.total_berries_generated || 0),
                totalBerriesSpent: parseInt(stats.total_berries_spent || 0),
                richestUserBalance: parseInt(stats.richest_user_balance || 0),
                poorestUserBalance: parseInt(stats.poorest_user_balance || 0),
                economicHealth: this.calculateEconomicHealth(stats)
            };
            
        } catch (error) {
            console.error('Error getting economic statistics:', error);
            return {
                totalUsers: 0,
                totalBerriesInCirculation: 0,
                averageBalance: 0,
                totalBerriesGenerated: 0,
                totalBerriesSpent: 0,
                richestUserBalance: 0,
                poorestUserBalance: 0,
                economicHealth: 'Unknown'
            };
        }
    }

    // Calculate economic health indicator
    calculateEconomicHealth(stats) {
        const generated = parseInt(stats.total_berries_generated || 0);
        const spent = parseInt(stats.total_berries_spent || 0);
        
        if (generated === 0) return 'No Activity';
        
        const spendingRate = spent / generated;
        
        if (spendingRate > 0.8) return 'High Activity';
        if (spendingRate > 0.5) return 'Healthy';
        if (spendingRate > 0.2) return 'Growing';
        return 'Accumulating';
    }

    // Get income leaderboard
    async getIncomeLeaderboard(limit = 10) {
        try {
            await this.initializeBerryTable();
            
            const query = `
                SELECT ub.user_id, u.username, ub.berries, ub.total_earned
                FROM user_berries ub
                JOIN users u ON ub.user_id = u.user_id
                ORDER BY ub.total_earned DESC
                LIMIT $1
            `;
            
            const result = await DatabaseManager.query(query, [limit]);
            
            const leaderboard = [];
            for (const row of result.rows) {
                const totalCP = await this.calculateUserTotalCP(row.user_id);
                const hourlyIncome = await this.calculateHourlyIncome(row.user_id);
                
                leaderboard.push({
                    userId: row.user_id,
                    username: row.username,
                    currentBerries: parseInt(row.berries),
                    totalEarned: parseInt(row.total_earned),
                    totalCP: totalCP,
                    hourlyIncome: hourlyIncome
                });
            }
            
            return leaderboard;
            
        } catch (error) {
            console.error('Error getting income leaderboard:', error);
            return [];
        }
    }

    // Get configuration for admin display
    getConfig() {
        return {
            baseIncomeRate: this.baseIncomeRate,
            cpMultiplier: this.cpMultiplier,
            maxStoredHours: this.maxStoredHours,
            pullCost: this.pullCost,
            cpBonuses: this.cpBonuses
        };
    }

    // Make a purchase
    async makePurchase(userId, amount, itemName, itemData = {}) {
        try {
            const currentBerries = await this.getBerries(userId);
            
            if (currentBerries < amount) {
                return { 
                    success: false, 
                    message: 'Insufficient berries!',
                    currentBalance: currentBerries
                };
            }

            const newBalance = await this.removeBerries(userId, amount, `Purchase: ${itemName}`);
            
            // Log the purchase
            await this.logPurchase(userId, amount, itemName, itemData);
            
            return {
                success: true,
                message: `Successfully purchased ${itemName}!`,
                newBalance: newBalance,
                amountSpent: amount
            };
            
        } catch (error) {
            console.error('Error making purchase:', error);
            return {
                success: false,
                message: 'Purchase failed due to an error.',
                currentBalance: await this.getBerries(userId)
            };
        }
    }

    // Log a purchase
    async logPurchase(userId, amount, itemName, itemData) {
        try {
            const query = `
                INSERT INTO user_purchases (user_id, amount, item_name, item_data, purchase_time)
                VALUES ($1, $2, $3, $4, NOW())
            `;
            
            await DatabaseManager.query(query, [userId, amount, itemName, JSON.stringify(itemData)]);
        } catch (error) {
            console.error('Error logging purchase:', error);
        }
    }

    // Get purchase history
    async getPurchaseHistory(userId, limit = 10) {
        try {
            const query = `
                SELECT amount, item_name, item_data, purchase_time
                FROM user_purchases 
                WHERE user_id = $1 
                ORDER BY purchase_time DESC 
                LIMIT $2
            `;
            
            const result = await DatabaseManager.query(query, [userId, limit]);
            return result.rows.map(row => ({
                amount: parseInt(row.amount),
                itemName: row.item_name,
                itemData: JSON.parse(row.item_data || '{}'),
                purchaseTime: new Date(row.purchase_time)
            }));
            
        } catch (error) {
            console.error('Error getting purchase history:', error);
            return [];
        }
    }

    // Process automatic income (called by automatic-income.js)
    async processAutoIncome(userId, username) {
        try {
            const totalCP = await this.calculateUserTotalCP(userId);
            
            // Users with 0 CP get no income
            if (totalCP <= 0) {
                return { generated: 0, reason: 'No Combat Power' };
            }

            // Calculate 10-minute income (1/6 of hourly)
            const hourlyIncome = await this.calculateHourlyIncome(userId);
            const tenMinuteIncome = Math.floor(hourlyIncome / 6);

            if (tenMinuteIncome <= 0) {
                return { generated: 0, reason: 'No income calculated' };
            }

            // Award the berries
            const newBalance = await this.addBerries(
                userId, 
                tenMinuteIncome, 
                'Automatic Income (10min)'
            );

            return { 
                generated: tenMinuteIncome, 
                newBalance: newBalance,
                totalCP: totalCP,
                reason: 'Success' 
            };

        } catch (error) {
            console.error(`Error processing auto income for user ${userId}:`, error);
            return { generated: 0, reason: 'Error: ' + error.message };
        }
    }

    // Daily economic reset (maintenance)
    async performDailyEconomicReset() {
        try {
            console.log('🔄 Performing daily economic maintenance...');
            
            // Clean up old purchase records (keep last 30 days)
            await DatabaseManager.query(`
                DELETE FROM user_purchases 
                WHERE purchase_time < NOW() - INTERVAL '30 days'
            `);
            
            // Update economic statistics
            const stats = await this.getEconomicStatistics();
            console.log('📊 Daily Economic Stats:', {
                totalUsers: stats.totalUsers,
                totalBerries: stats.totalBerriesInCirculation,
                economicHealth: stats.economicHealth
            });
            
            console.log('✅ Daily economic maintenance completed');
            return stats;
            
        } catch (error) {
            console.error('❌ Error during daily economic reset:', error);
            return null;
        }
    }
}

module.exports = new BerryEconomySystem();
