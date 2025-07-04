const { Pool } = require('pg');

// Database connection configuration for Railway PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database setup and table creation
class DatabaseSetup {
    static async initializeDatabase() {
        console.log('🗄️ Initializing PostgreSQL database...');
        
        try {
            // Test connection
            const client = await pool.connect();
            console.log('✅ Connected to PostgreSQL database');
            
            // Create tables
            await this.createTables(client);
            
            client.release();
            console.log('✅ Database initialization complete');
            
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    static async createTables(client) {
        console.log('📋 Creating database tables...');

        // Users table - stores basic user info and stats
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                guild_id VARCHAR(255),
                total_hunts INTEGER DEFAULT 0,
                total_fruits INTEGER DEFAULT 0,
                discovery_rate DECIMAL(5,2) DEFAULT 0.00,
                last_pull TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Devil Fruits collection table - stores owned fruits
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_devil_fruits (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
                fruit_id VARCHAR(255) NOT NULL,
                fruit_name VARCHAR(255) NOT NULL,
                fruit_type VARCHAR(100) NOT NULL,
                rarity VARCHAR(50) NOT NULL,
                element VARCHAR(100),
                power_level INTEGER NOT NULL,
                times_obtained INTEGER DEFAULT 1,
                first_obtained TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_obtained TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, fruit_id)
            );
        `);

        // Rarity statistics table - tracks pulls by rarity
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_rarity_stats (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
                rarity VARCHAR(50) NOT NULL,
                count INTEGER DEFAULT 0,
                UNIQUE(user_id, rarity)
            );
        `);

        // Type statistics table - tracks pulls by devil fruit type
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_type_stats (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
                fruit_type VARCHAR(100) NOT NULL,
                count INTEGER DEFAULT 0,
                UNIQUE(user_id, fruit_type)
            );
        `);

        // User levels table - stores Discord level integration
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_levels (
                user_id VARCHAR(255) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
                discord_level INTEGER DEFAULT 0,
                rank_name VARCHAR(100) DEFAULT 'Newcomer',
                level_multiplier DECIMAL(4,2) DEFAULT 1.00,
                base_combat_power INTEGER DEFAULT 0,
                total_combat_power INTEGER DEFAULT 0,
                level_bonus INTEGER DEFAULT 0,
                last_level_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Battle history table - for future PvP system
        await client.query(`
            CREATE TABLE IF NOT EXISTS battle_history (
                id SERIAL PRIMARY KEY,
                attacker_id VARCHAR(255) REFERENCES users(user_id),
                defender_id VARCHAR(255) REFERENCES users(user_id),
                winner_id VARCHAR(255) REFERENCES users(user_id),
                attacker_power INTEGER NOT NULL,
                defender_power INTEGER NOT NULL,
                type_advantage DECIMAL(4,2) DEFAULT 1.00,
                level_advantage DECIMAL(4,2) DEFAULT 1.00,
                final_score DECIMAL(6,3) NOT NULL,
                fruits_stolen TEXT[], -- Array of fruit IDs stolen
                battle_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Cooldowns table - manages pull cooldowns
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_cooldowns (
                user_id VARCHAR(255) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
                last_single_pull TIMESTAMP,
                cooldown_end TIMESTAMP,
                pulls_today INTEGER DEFAULT 0,
                daily_reset TIMESTAMP DEFAULT CURRENT_DATE
            );
        `);

        // Create indexes for better performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_fruits_user_id ON user_devil_fruits(user_id);
            CREATE INDEX IF NOT EXISTS idx_user_fruits_rarity ON user_devil_fruits(rarity);
            CREATE INDEX IF NOT EXISTS idx_user_fruits_element ON user_devil_fruits(element);
            CREATE INDEX IF NOT EXISTS idx_battle_history_date ON battle_history(battle_date);
            CREATE INDEX IF NOT EXISTS idx_users_guild ON users(guild_id);
        `);

        console.log('✅ All database tables created successfully');
    }

    static async getPool() {
        return pool;
    }

    // Utility function to execute queries
    static async query(text, params) {
        const client = await pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    // Close database connection (for graceful shutdown)
    static async close() {
        await pool.end();
        console.log('🗄️ Database connection closed');
    }
}

module.exports = {
    DatabaseSetup,
    pool
};
