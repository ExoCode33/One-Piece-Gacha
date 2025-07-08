// ENHANCED BERRY ECONOMY SYSTEM - Railway Compatible
const DatabaseManager = require('../database/manager');

class BerryEconomySystem {
    constructor() {
        // Load from Railway environment variables
        this.baseIncomeRate = parseInt(process.env.BASE_INCOME_RATE) || 100;
        this.cpMultiplier = parseFloat(process.env.CP_MULTIPLIER) || 0.1;
        this.maxStoredHours = parseInt(process.env.MAX_STORED_HOURS) || 24;
        this.pullCost = parseInt(process.env.PULL_COST) || 1000;
        
        // Combat & Raid settings
        this.berryStealMin = parseFloat(process.env.BERRY_STEAL_MIN) || 0.10;
        this.berryStealMax = parseFloat(process.env.BERRY_STEAL_MAX) || 0.50;
        this.fruitStealChance = parseFloat(process.env.FRUIT_STEAL_CHANCE) || 0.15;
        this.maxFruitsStolen = parseInt(process.env.MAX_FRUITS_STOLEN) || 3;
        this.minBerriesToRaid = parseInt(process.env.MIN_BERRIES_TO_RAID) || 100;
        
        // CP Bonus thresholds
        this.cp50kBonus = parseInt(process.env.CP_50K_BONUS) || 500;
        this.cp100kBonus = parseInt(process.env.CP_100K_BONUS) || 1000;
        this.cp200kBonus = parseInt(process.env.CP_200K_BONUS) || 2000;
        
        console.log('💰 Berry Economy System initialized with Railway config');
    }

    // Initialize berry table if needed
    async initializeBerryTable() {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS user_berries (
                    user_id TEXT PRIMARY KEY,
                    berries BIGINT DEFAULT 0,
                    last_income_collection TIMESTAMP DEFAULT NOW(),
                    total_earned BIGINT DEFAULT 0,
                    total_spent BIGINT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `;
            
            await DatabaseManager.query(query);
            
            // Create index for better performance
            await DatabaseManager.query(`
                CREATE INDEX IF NOT EXISTS idx_user_berries_user_id 
                ON user_berries(user_id)
            `);
            
            console.log('✅ User berries table ready');
        } catch (error) {
            console.error('Error initializing berry table:', error);
        }
    }

    // Add berries to user with logging
    async addBerries(userId, amount, reason = 'Reward') {
        try {
            await this.initializeBerryTable();
            
            const query = `
                INSERT INTO user_berries (user_id, berries, total_earned, updated_at)
                VALUES ($1, $2, $2, NOW())
                ON CONFLICT (user_id)
                DO UPDATE SET 
                    berries = user_berries.berries + $2,
                    total_earned = user_berries.total_earned + $2,
                    updated_at = NOW()
                RETURNING berries
            `;
            
            const result = await DatabaseManager.query(query, [userId, amount]);
            const newBalance = result.rows[0]?.berries || amount;
            
            console.log(`💰 Added ${amount.toLocaleString()} berries to user ${userId} (${reason}) - New balance: ${newBalance.toLocaleString()}`);
            
            // Log to Discord channel
            await this.logBerryTransaction(userId, amount, reason, newBalance);
            
            return newBalance;
        } catch (error) {
            console.error('Error adding berries:', error);
            return 0;
        }
    }
    
    // Remove berries from user
    async removeBerries(userId, amount, reason = 'Purchase') {
        try {
            await this.initializeBerryTable();
            
            // First check if user has enough berries
            const currentBalance = await this.getBerries(userId);
            if (currentBalance < amount) {
                console.log(`❌ User ${userId} has insufficient berries: ${currentBalance} < ${amount}`);
                return false;
            }
            
            const query = `
                UPDATE user_berries 
                SET berries = GREATEST(0, berries - $2),
                    total_spent = total_spent + $2,
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING berries
            `;
            
            const result = await DatabaseManager.query(query, [userId, amount]);
            const newBalance = result.rows[0]?.berries || 0;
            
            console.log(`💸 Removed ${amount.toLocaleString()} berries from user ${userId} (${reason}) - New balance: ${newBalance.toLocaleString()}`);
            
            // Log to Discord channel
            await this.logBerryTransaction(userId, -amount, reason, newBalance);
            
            return newBalance;
        } catch (error) {
            console.error('Error removing berries:', error);
            return false;
        }
    }
    
    // Get user's berry balance
    async getBerries(userId) {
        try {
            await this.initializeBerryTable();
            
            const query = `
                SELECT berries FROM user_berries WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            return result.rows.length > 0 ? parseInt(result.rows[0].berries) : 0;
        } catch (error) {
            console.error('Error getting berries:', error);
            return 0;
        }
    }

    // Calculate user's total combat power
    async calculateUserTotalCP(userId) {
        try {
            const DatabaseManager = require('../database/manager');
            const userFruits = await DatabaseManager.getUserFruits(userId);
            
            if (userFruits.length === 0) return 100; // Base CP
            
            // Group by fruit ID and calculate with duplicate bonuses
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
                const duplicateBonus = 1 + ((fruitData.count - 1) * 0.01); // 1% per duplicate
                const fruitTotalPower = Math.floor(fruitData.basePower * duplicateBonus * fruitData.count);
                totalCP += fruitTotalPower;
            });
            
            return totalCP;
        } catch (error) {
            console.error('Error calculating user CP:', error);
            return 100;
        }
    }

    // Calculate hourly income based on CP
    async calculateHourlyIncome(userId) {
        try {
            const totalCP = await this.calculateUserTotalCP(userId);
            
            let income = this.baseIncomeRate + (totalCP * this.cpMultiplier);
            
            // Add CP milestone bonuses
            if (totalCP >= 200000) {
                income += this.cp200kBonus;
            } else if (totalCP >= 100000) {
                income += this.cp100kBonus;
            } else if (totalCP >= 50000) {
                income += this.cp50kBonus;
            }
            
            return Math.floor(income);
        } catch (error) {
            console.error('Error calculating hourly income:', error);
            return this.baseIncomeRate;
        }
    }

    // Collect accumulated income
    async collectIncome(userId, username) {
        try {
            await this.initializeBerryTable();
            
            // Get last collection time
            const query = `
                SELECT berries, last_income_collection 
                FROM user_berries 
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const userData = result.rows[0];
            
            if (!userData) {
                // First time user
                await this.addBerries(userId, 0, 'Account Creation');
                return { collected: 0, newBalance: 0, hourlyRate: this.baseIncomeRate };
            }
            
            const lastCollection = new Date(userData.last_income_collection);
            const now = new Date();
            const hoursElapsed = Math.min(
                (now - lastCollection) / (1000 * 60 * 60), 
                this.maxStoredHours
            );
            
            if (hoursElapsed < 1) {
                return { 
                    collected: 0, 
                    newBalance: parseInt(userData.berries),
                    hourlyRate: await this.calculateHourlyIncome(userId),
                    timeUntilNext: Math.ceil((1 - hoursElapsed) * 60) // minutes
                };
            }
            
            const hourlyRate = await this.calculateHourlyIncome(userId);
            const collectedAmount = Math.floor(hourlyRate * hoursElapsed);
            
            // Update berries and collection time
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
            
            // Log income collection
            const totalCP = await this.calculateUserTotalCP(userId);
            await this.logIncomeCollection(userId, username, collectedAmount, newBalance, hourlyRate, totalCP);
            
            return {
                collected: collectedAmount,
                newBalance: newBalance,
                hourlyRate: hourlyRate,
                hoursCollected: Math.floor(hoursElapsed * 10) / 10
            };
            
        } catch (error) {
            console.error('Error collecting income:', error);
            return { collected: 0, newBalance: 0, hourlyRate: this.baseIncomeRate };
        }
    }

    // Get user's economic stats
    async getUserEconomicStats(userId) {
        try {
            await this.initializeBerryTable();
            
            const query = `
                SELECT berries, total_earned, total_spent, 
                       last_income_collection, created_at
                FROM user_berries 
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const userData = result.rows[0];
            
            if (!userData) {
                return {
                    currentBerries: 0,
                    totalEarned: 0,
                    totalSpent: 0,
                    netWorth: 0,
                    hourlyIncome: this.baseIncomeRate,
                    accountAge: 0
                };
            }
            
            const hourlyIncome = await this.calculateHourlyIncome(userId);
            const totalCP = await this.calculateUserTotalCP(userId);
            const accountAge = Math.floor((new Date() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24));
            
            return {
                currentBerries: parseInt(userData.berries),
                totalEarned: parseInt(userData.total_earned),
                totalSpent: parseInt(userData.total_spent),
                netWorth: parseInt(userData.total_earned) - parseInt(userData.total_spent),
                hourlyIncome: hourlyIncome,
                totalCP: totalCP,
                accountAge: accountAge
            };
            
        } catch (error) {
            console.error('Error getting economic stats:', error);
            return {
                currentBerries: 0,
                totalEarned: 0,
                totalSpent: 0,
                netWorth: 0,
                hourlyIncome: this.baseIncomeRate,
                totalCP: 0,
                accountAge: 0
            };
        }
    }

    // Log berry transactions to Discord
    async logBerryTransaction(userId, amount, reason, newBalance) {
        try {
            if (!process.env.ENABLE_ECONOMY_LOGS || process.env.ENABLE_ECONOMY_LOGS !== 'true') {
                return;
            }
            
            const ActivityLogger = require('./logger');
            const DatabaseManager = require('../database/manager');
            
            const user = await DatabaseManager.getUser(userId);
            const username = user?.username || 'Unknown User';
            
            // Don't log small automatic transactions
            if (Math.abs(amount) < 10 && reason === 'Reward') return;
            
            if (amount > 0) {
                const totalCP = await this.calculateUserTotalCP(userId);
                await ActivityLogger.logBerryCollection(
                    userId, 
                    username, 
                    amount, 
                    newBalance, 
                    0, // Hourly income not relevant for direct rewards
                    totalCP
                );
            }
            
        } catch (error) {
            console.error('Error logging berry transaction:', error);
        }
    }

    // Log income collection
    async logIncomeCollection(userId, username, amount, totalBerries, hourlyIncome, totalCP) {
        try {
            if (!process.env.ENABLE_ECONOMY_LOGS || process.env.ENABLE_ECONOMY_LOGS !== 'true') {
                return;
            }
            
            const ActivityLogger = require('./logger');
            await ActivityLogger.logBerryCollection(
                userId, 
                username, 
                amount, 
                totalBerries, 
                hourlyIncome, 
                totalCP
            );
            
        } catch (error) {
            console.error('Error logging income collection:', error);
        }
    }

    // Helper: Get base power by rarity
    getRarityBasePower(rarity) {
        const powers = {
            'common': 150,
            'uncommon': 300,
            'rare': 600,
            'epic': 1000,
            'legendary': 1500,
            'mythical': 2500,
            'omnipotent': 4000
        };
        return powers[rarity?.toLowerCase()] || 150;
    }

    // Get economy configuration
    getConfig() {
        return {
            baseIncomeRate: this.baseIncomeRate,
            cpMultiplier: this.cpMultiplier,
            maxStoredHours: this.maxStoredHours,
            pullCost: this.pullCost,
            berryStealMin: this.berryStealMin,
            berryStealMax: this.berryStealMax,
            fruitStealChance: this.fruitStealChance,
            maxFruitsStolen: this.maxFruitsStolen,
            minBerriesToRaid: this.minBerriesToRaid,
            cpBonuses: {
                '50k': this.cp50kBonus,
                '100k': this.cp100kBonus,
                '200k': this.cp200kBonus
            }
        };
    }
}

module.exports = new BerryEconomySystem();
