// Enhanced methods to add to your existing src/systems/economy.js

class BerryEconomySystem {
    // ... existing methods ...

    // Get income collection data for bank command
    async getIncomeCollectionData(userId) {
        try {
            await this.initializeBerryTable();
            
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
            const canCollect = hoursElapsed >= 1; // Can collect after 1 hour
            
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

    // Enhanced balance display with transaction history
    async getDetailedBalance(userId) {
        try {
            await this.initializeBerryTable();
            
            const balanceQuery = `
                SELECT berries, total_earned, total_spent, created_at, last_income_collection
                FROM user_berries 
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(balanceQuery, [userId]);
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

    // Auto-income processor (called by automatic-income.js every 10 minutes)
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

    // Income leaderboard
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
            
            // Calculate CP and hourly income for each user
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

    // Check if user can afford something
    async canAfford(userId, amount) {
        try {
            const currentBerries = await this.getBerries(userId);
            return currentBerries >= amount;
        } catch (error) {
            console.error('Error checking affordability:', error);
            return false;
        }
    }

    // Purchase something (with transaction logging)
    async makePurchase(userId, amount, itemName, itemData = {}) {
        try {
            const canAfford = await this.canAfford(userId, amount);
            if (!canAfford) {
                return { 
                    success: false, 
                    message: 'Insufficient berries!',
                    currentBalance: await this.getBerries(userId)
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

    // Log purchases for analytics
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

    // Economic statistics for admins
    async getEconomicStatistics() {
        try {
            await this.initializeBerryTable();
            
            const statsQuery = `
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
            
            const result = await DatabaseManager.query(statsQuery);
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
        const circulation = parseInt(stats.total_berries_in_circulation || 0);
        
        if (generated === 0) return 'No Activity';
        
        const spendingRate = spent / generated;
        const circulationRate = circulation / generated;
        
        if (spendingRate > 0.8) return 'High Activity';
        if (spendingRate > 0.5) return 'Healthy';
        if (spendingRate > 0.2) return 'Growing';
        return 'Accumulating';
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
            
            // Create index for better performance
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
        }
    }

    // Daily economic reset (if needed for events)
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

// Export the enhanced methods
module.exports = BerryEconomySystem;
