// src/systems/automatic-income.js - 10 Minute Income Generation System
class AutomaticIncomeSystem {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.client = null;
        this.INCOME_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
        this.lastProcessTime = null;
        this.processedUsers = new Set(); // Track processed users to avoid duplicates
        
        console.log('💰 Automatic Income System initialized');
        console.log(`⏰ Income will be generated every ${this.INCOME_INTERVAL / 1000 / 60} minutes`);
    }

    // Initialize the system with Discord client
    async initialize(client) {
        this.client = client;
        console.log('🚀 Starting automatic income generation system...');
        
        try {
            // Ensure economy tables are ready
            const BerryEconomySystem = require('./economy');
            await BerryEconomySystem.initializeBerryTable();
            await BerryEconomySystem.initializePurchaseTable();
            
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
        const startTime = Date.now();
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
            let errors = 0;

            // Process users in batches to avoid overwhelming the database
            const batchSize = 50;
            for (let i = 0; i < allUsers.length; i += batchSize) {
                const batch = allUsers.slice(i, i + batchSize);
                
                await Promise.all(batch.map(async (user) => {
                    try {
                        // Skip if already processed in this cycle (prevent duplicates)
                        if (this.processedUsers.has(user.user_id)) {
                            return;
                        }
                        
                        const result = await this.processUserIncome(user.user_id, user.username);
                        totalProcessed++;
                        
                        if (result.generated > 0) {
                            totalBerriesGenerated += result.generated;
                            usersWithIncome++;
                        }
                        
                        // Mark as processed
                        this.processedUsers.add(user.user_id);
                        
                    } catch (error) {
                        errors++;
                        console.error(`❌ Error processing income for user ${user.user_id}:`, error);
                    }
                }));
                
                // Small delay between batches to prevent overwhelming the database
                if (i + batchSize < allUsers.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            // Clear processed users set for next cycle
            this.processedUsers.clear();
            this.lastProcessTime = new Date();

            const processingTime = Date.now() - startTime;
            
            console.log(`✅ Income processing complete in ${processingTime}ms:`);
            console.log(`   📊 Users processed: ${totalProcessed}`);
            console.log(`   💰 Users with income: ${usersWithIncome}`);
            console.log(`   🔢 Total berries generated: ${totalBerriesGenerated.toLocaleString()}`);
            console.log(`   ❌ Errors: ${errors}`);
            console.log(`   ⚡ Performance: ${Math.round(totalProcessed / (processingTime / 1000))} users/second`);
            console.log(`   ⏰ Next processing in 10 minutes`);

            // Log to Discord channel if significant activity
            if (usersWithIncome > 0) {
                await this.logIncomeGeneration(usersWithIncome, totalBerriesGenerated, processingTime);
            }

            // Perform daily cleanup if it's a new day
            await this.performDailyMaintenance();

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

            // Award the berries using the enhanced method
            const newBalance = await BerryEconomySystem.addBerries(
                userId, 
                tenMinuteIncome, 
                'Automatic Income (10min)'
            );

            return { 
                generated: tenMinuteIncome, 
                newBalance: newBalance,
                totalCP: totalCP,
                hourlyRate: hourlyIncome,
                reason: 'Success' 
            };

        } catch (error) {
            console.error(`Error processing income for user ${userId}:`, error);
            return { generated: 0, reason: 'Error: ' + error.message };
        }
    }

    // Get all users from database with optimized query
    async getAllUsers() {
        try {
            const DatabaseManager = require('../database/manager');
            
            const query = `
                SELECT DISTINCT u.user_id, u.username 
                FROM users u
                WHERE u.user_id IS NOT NULL 
                AND EXISTS (
                    SELECT 1 FROM user_devil_fruits udf 
                    WHERE udf.user_id = u.user_id
                )
                ORDER BY u.user_id
            `;
            
            const result = await DatabaseManager.query(query);
            return result.rows;
            
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    }

    // Log income generation to Discord channel
    async logIncomeGeneration(userCount, totalBerries, processingTime) {
        try {
            if (!process.env.ENABLE_ECONOMY_LOGS || process.env.ENABLE_ECONOMY_LOGS !== 'true') {
                return;
            }

            const ActivityLogger = require('./logger');
            
            // Create a system event log
            await ActivityLogger.logSystemEvent(
                'income_generation',
                '💰 Automatic Income Generated',
                'Periodic income distribution completed successfully',
                [
                    { name: '👥 Users with Income', value: userCount.toString(), inline: true },
                    { name: '💰 Total Generated', value: `${totalBerries.toLocaleString()} berries`, inline: true },
                    { name: '⚡ Processing Time', value: `${processingTime}ms`, inline: true },
                    { name: '⏰ Next Generation', value: 'In 10 minutes', inline: true },
                    { name: '📊 Performance', value: `${Math.round(userCount / (processingTime / 1000))} users/sec`, inline: true },
                    { name: '🎯 System Health', value: 'Optimal', inline: true }
                ]
            );

        } catch (error) {
            console.error('Error logging income generation:', error);
        }
    }

    // Daily maintenance tasks
    async performDailyMaintenance() {
        try {
            const now = new Date();
            const lastMaintenance = this.getLastMaintenanceDate();
            
            // Check if it's a new day
            if (!lastMaintenance || now.toDateString() !== lastMaintenance.toDateString()) {
                console.log('🔄 Performing daily economic maintenance...');
                
                const BerryEconomySystem = require('./economy');
                const stats = await BerryEconomySystem.performDailyEconomicReset();
                
                // Update last maintenance date
                this.setLastMaintenanceDate(now);
                
                // Log daily statistics
                if (stats) {
                    console.log('📊 Daily Economic Summary:', {
                        totalUsers: stats.totalUsers,
                        totalBerries: stats.totalBerriesInCirculation,
                        economicHealth: stats.economicHealth,
                        averageBalance: stats.averageBalance
                    });
                }
                
                console.log('✅ Daily maintenance completed');
            }
            
        } catch (error) {
            console.error('Error during daily maintenance:', error);
        }
    }

    // Maintenance date tracking
    getLastMaintenanceDate() {
        try {
            const stored = process.env.LAST_MAINTENANCE_DATE;
            return stored ? new Date(stored) : null;
        } catch {
            return null;
        }
    }

    setLastMaintenanceDate(date) {
        // In a real application, you'd store this in the database
        // For now, we'll just keep it in memory
        this.lastMaintenanceDate = date;
    }

    // Stop the income generation system
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        this.processedUsers.clear();
        console.log('🛑 Automatic income system stopped');
    }

    // Get system status
    getStatus() {
        return {
            isRunning: this.isRunning,
            intervalMinutes: this.INCOME_INTERVAL / 1000 / 60,
            nextRun: this.isRunning ? 'Every 10 minutes' : 'Stopped',
            lastProcessTime: this.lastProcessTime,
            processedUsersCount: this.processedUsers.size,
            systemHealth: this.isRunning ? 'Healthy' : 'Stopped'
        };
    }

    // Manual trigger for testing/admin use
    async triggerManualIncome() {
        console.log('🔧 Manual income generation triggered by admin');
        await this.processAllUsersIncome();
    }

    // Get income statistics for dashboard
    async getIncomeStats() {
        try {
            const DatabaseManager = require('../database/manager');
            const BerryEconomySystem = require('./economy');
            
            const economicStats = await BerryEconomySystem.getEconomicStatistics();
            const systemStatus = this.getStatus();
            
            return {
                ...economicStats,
                systemStatus: systemStatus.systemHealth,
                isRunning: systemStatus.isRunning,
                lastProcessTime: systemStatus.lastProcessTime,
                incomeInterval: systemStatus.intervalMinutes,
                nextProcessing: systemStatus.nextRun
            };
            
        } catch (error) {
            console.error('Error getting income stats:', error);
            return {
                totalUsers: 0,
                totalBerries: 0,
                averageBalance: 0,
                systemStatus: 'Error',
                isRunning: false,
                incomeInterval: this.INCOME_INTERVAL / 1000 / 60
            };
        }
    }

    // Emergency stop for critical issues
    emergencyStop(reason = 'Manual stop') {
        console.warn(`🚨 Emergency stop triggered: ${reason}`);
        this.stop();
        
        // Log emergency stop
        try {
            const ActivityLogger = require('./logger');
            ActivityLogger.logSystemEvent(
                'emergency_stop',
                '🚨 Income System Emergency Stop',
                `Automatic income system stopped: ${reason}`,
                [
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Time', value: new Date().toISOString(), inline: true },
                    { name: 'Status', value: 'System Halted', inline: true }
                ]
            );
        } catch (error) {
            console.error('Failed to log emergency stop:', error);
        }
    }

    // Restart system after emergency stop
    async restart() {
        console.log('🔄 Restarting income generation system...');
        this.stop(); // Ensure clean stop
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        await this.startIncomeGeneration();
        console.log('✅ Income system restarted successfully');
    }
}

module.exports = new AutomaticIncomeSystem();
