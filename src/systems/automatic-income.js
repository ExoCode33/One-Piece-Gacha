// src/systems/automatic-income.js - 10 Minute Income Generation System
class AutomaticIncomeSystem {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.client = null;
        this.INCOME_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
        
        console.log('💰 Automatic Income System initialized');
        console.log(`⏰ Income will be generated every ${this.INCOME_INTERVAL / 1000 / 60} minutes`);
    }

    // Initialize the system with Discord client
    async initialize(client) {
        this.client = client;
        console.log('🚀 Starting automatic income generation system...');
        
        try {
            // Start the income generation loop
            await this.startIncomeGeneration();
            console.log('✅ Automatic income system is now running');
            console.log(`📊 Processing income for all users every 10 minutes`);
        } catch (error) {
            console.error('❌ Failed to start automatic income system:', error);
            throw error;
        }
    }

    // Start the periodic income generation
    async startIncomeGeneration() {
        if (this.isRunning) {
            console.log('⚠️ Income system already running');
            return;
        }

        this.isRunning = true;
        
        // Run immediately on startup (after 30 seconds to let bot settle)
        setTimeout(async () => {
            console.log('🏁 Running initial income generation...');
            await this.processAllUsersIncome();
        }, 30000);

        // Then run every 10 minutes
        this.interval = setInterval(async () => {
            try {
                await this.processAllUsersIncome();
            } catch (error) {
                console.error('❌ Error in periodic income generation:', error);
            }
        }, this.INCOME_INTERVAL);

        console.log(`✅ Income generation scheduled every ${this.INCOME_INTERVAL / 1000 / 60} minutes`);
    }

    // Process income for all users
    async processAllUsersIncome() {
        console.log('💰 Processing automatic income for all users...');
        
        try {
            const DatabaseManager = require('../database/manager');
            const BerryEconomySystem = require('./economy');
            
            // Get all users from the database
            const allUsers = await this.getAllUsers();
            
            if (!allUsers || allUsers.length === 0) {
                console.log('👥 No users found for income processing');
                return;
            }

            console.log(`👥 Processing income for ${allUsers.length} users...`);

            let totalProcessed = 0;
            let totalBerriesGenerated = 0;
            let usersWithIncome = 0;

            for (const user of allUsers) {
                try {
                    const result = await this.processUserIncome(user.user_id, user.username);
                    totalProcessed++;
                    
                    if (result.generated > 0) {
                        totalBerriesGenerated += result.generated;
                        usersWithIncome++;
                    }
                    
                } catch (error) {
                    console.error(`❌ Error processing income for user ${user.user_id}:`, error);
                }
            }

            console.log(`✅ Income processing complete:`);
            console.log(`   📊 Users processed: ${totalProcessed}`);
            console.log(`   💰 Users with income: ${usersWithIncome}`);
            console.log(`   🔢 Total berries generated: ${totalBerriesGenerated.toLocaleString()}`);
            console.log(`   ⏰ Next processing in 10 minutes`);

            // Log to Discord channel if significant activity
            if (usersWithIncome > 0) {
                await this.logIncomeGeneration(usersWithIncome, totalBerriesGenerated);
            }

        } catch (error) {
            console.error('❌ Error in processAllUsersIncome:', error);
        }
    }

    // Process income for a single user
    async processUserIncome(userId, username) {
        const BerryEconomySystem = require('./economy');
        
        try {
            // Calculate user's combat power
            const totalCP = await BerryEconomySystem.calculateUserTotalCP(userId);
            
            // Users with 0 CP get no income
            if (totalCP <= 0) {
                return { generated: 0, reason: 'No Combat Power' };
            }

            // Calculate 10-minute income (1/6 of hourly)
            const hourlyIncome = await BerryEconomySystem.calculateHourlyIncome(userId);
            const tenMinuteIncome = Math.floor(hourlyIncome / 6);

            if (tenMinuteIncome <= 0) {
                return { generated: 0, reason: 'No income calculated' };
            }

            // Award the berries
            await BerryEconomySystem.initializeBerryTable();
            const newBalance = await BerryEconomySystem.addBerries(
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
            console.error(`Error processing income for user ${userId}:`, error);
            return { generated: 0, reason: 'Error: ' + error.message };
        }
    }

    // Get all users from database
    async getAllUsers() {
        try {
            const DatabaseManager = require('../database/manager');
            
            const query = `
                SELECT user_id, username 
                FROM users 
                WHERE user_id IS NOT NULL 
                ORDER BY user_id
            `;
            
            const result = await DatabaseManager.query(query);
            return result.rows;
            
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    }

    // Log income generation to Discord channel
    async logIncomeGeneration(userCount, totalBerries) {
        try {
            if (!process.env.ENABLE_ECONOMY_LOGS || process.env.ENABLE_ECONOMY_LOGS !== 'true') {
                return;
            }

            const ActivityLogger = require('./logger');
            
            // Create a system event log
            await ActivityLogger.logSystemEvent(
                'income_generation',
                '💰 Automatic Income Generated',
                'Periodic income distribution completed',
                [
                    { name: '👥 Users with Income', value: userCount.toString(), inline: true },
                    { name: '💰 Total Generated', value: `${totalBerries.toLocaleString()} berries`, inline: true },
                    { name: '⏰ Next Generation', value: 'In 10 minutes', inline: true }
                ]
            );

        } catch (error) {
            console.error('Error logging income generation:', error);
        }
    }

    // Stop the income generation system
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('🛑 Automatic income system stopped');
    }

    // Get system status
    getStatus() {
        return {
            isRunning: this.isRunning,
            intervalMinutes: this.INCOME_INTERVAL / 1000 / 60,
            nextRun: this.isRunning ? 'Every 10 minutes' : 'Stopped'
        };
    }

    // Manual trigger for testing
    async triggerManualIncome() {
        console.log('🔧 Manual income generation triggered');
        await this.processAllUsersIncome();
    }

    // Get income statistics
    async getIncomeStats() {
        try {
            const DatabaseManager = require('../database/manager');
            
            // Get total users and berries in circulation
            const statsQuery = `
                SELECT 
                    COUNT(DISTINCT u.user_id) as total_users,
                    COALESCE(SUM(ub.berries), 0) as total_berries,
                    COALESCE(AVG(ub.berries), 0) as avg_berries
                FROM users u
                LEFT JOIN user_berries ub ON u.user_id = ub.user_id
            `;
            
            const result = await DatabaseManager.query(statsQuery);
            const stats = result.rows[0];
            
            return {
                totalUsers: parseInt(stats.total_users),
                totalBerries: parseInt(stats.total_berries),
                averageBerries: Math.round(parseFloat(stats.avg_berries)),
                incomeInterval: this.INCOME_INTERVAL / 1000 / 60,
                systemStatus: this.isRunning ? 'Running' : 'Stopped'
            };
            
        } catch (error) {
            console.error('Error getting income stats:', error);
            return {
                totalUsers: 0,
                totalBerries: 0,
                averageBerries: 0,
                incomeInterval: this.INCOME_INTERVAL / 1000 / 60,
                systemStatus: 'Error'
            };
        }
    }
}

module.exports = new AutomaticIncomeSystem();
