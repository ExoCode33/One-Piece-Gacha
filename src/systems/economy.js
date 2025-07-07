// BERRY ECONOMY SYSTEM
// Simple berry management for rewards

const DatabaseManager = require('../database/manager');

class BerryEconomySystem {
    // Add berries to user
    async addBerries(userId, amount, reason = 'Reward') {
        try {
            // Create simple berry table if it doesn't exist
            await this.initializeBerryTable();
            
            const query = `
                INSERT INTO user_berries (user_id, berries, last_updated)
                VALUES ($1, $2, NOW())
                ON CONFLICT (user_id)
                DO UPDATE SET 
                    berries = user_berries.berries + $2,
                    last_updated = NOW()
            `;
            
            await DatabaseManager.query(query, [userId, amount]);
            console.log(`💰 Added ${amount} berries to user ${userId} (${reason})`);
            return true;
        } catch (error) {
            console.error('Error adding berries:', error);
            return false;
        }
    }
    
    // Remove berries from user
    async removeBerries(userId, amount, reason = 'Purchase') {
        try {
            await this.initializeBerryTable();
            
            const query = `
                UPDATE user_berries 
                SET berries = GREATEST(0, berries - $2),
                    last_updated = NOW()
                WHERE user_id = $1
            `;
            
            await DatabaseManager.query(query, [userId, amount]);
            console.log(`💸 Removed ${amount} berries from user ${userId} (${reason})`);
            return true;
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
            return result.rows.length > 0 ? result.rows[0].berries : 0;
        } catch (error) {
            console.error('Error getting berries:', error);
            return 0;
        }
    }
    
    // Initialize berry table
    async initializeBerryTable() {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS user_berries (
                    user_id TEXT PRIMARY KEY,
                    berries INTEGER DEFAULT 0,
                    last_updated TIMESTAMP DEFAULT NOW()
                )
            `;
            
            await DatabaseManager.query(query);
        } catch (error) {
            console.error('Error initializing berry table:', error);
        }
    }
}

module.exports = new BerryEconomySystem();
