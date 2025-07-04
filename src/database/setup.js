const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('🗄️ Initializing PostgreSQL database...');
        
        // Test connection
        await client.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL database');
        
        console.log('🧹 Cleaning up existing tables...');
        await client.query('DROP TABLE IF EXISTS user_duplicate_stats CASCADE');
        await client.query('DROP TABLE IF EXISTS battle_history CASCADE');
        await client.query('DROP TABLE IF EXISTS user_cooldowns CASCADE');
        await client.query('DROP TABLE IF EXISTS user_levels CASCADE');
        await client.query('DROP TABLE IF EXISTS user_type_stats CASCADE');
        await client.query('DROP TABLE IF EXISTS user_rarity_stats CASCADE');
        await client.query('DROP TABLE IF EXISTS user_devil_fruits CASCADE');
        await client.query('DROP TABLE IF EXISTS users CASCADE');
        
        console.log('📋 Creating database tables with duplicate system...');
        
        // Create users table
        await client.query(`
            CREATE TABLE users (
                user_id VARCHAR(20) PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                total_hunts INTEGER DEFAULT 0,
                discovery_rate INTEGER DEFAULT 0,
                level INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Create user_devil_fruits table with duplicate_count column
        await client.query(`
            CREATE TABLE user_devil_fruits (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
                fruit_id VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                rarity VARCHAR(50) NOT NULL,
                power TEXT,
                previous_user VARCHAR(255),
                description TEXT,
                awakening TEXT,
                weakness TEXT,
                duplicate_count INTEGER DEFAULT 1,
                obtained_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Create user_duplicate_stats table for tracking duplicate bonuses
        await client.query(`
            CREATE TABLE user_duplicate_stats (
                user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
                fruit_id VARCHAR(50) NOT NULL,
                duplicate_count INTEGER DEFAULT 1,
                updated_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY (user_id, fruit_id)
            )
        `);
        
        // Create user_rarity_stats table
        await client.query(`
            CREATE TABLE user_rarity_stats (
                user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
                rarity VARCHAR(50) NOT NULL,
                count INTEGER DEFAULT 0,
                PRIMARY KEY (user_id, rarity)
            )
        `);
        
        // Create user_type_stats table
        await client.query(`
            CREATE TABLE user_type_stats (
                user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
                type VARCHAR(100) NOT NULL,
                count INTEGER DEFAULT 0,
                PRIMARY KEY (user_id, type)
            )
        `);
        
        // Create user_levels table
        await client.query(`
            CREATE TABLE user_levels (
                user_id VARCHAR(20) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
                level INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Create user_cooldowns table
        await client.query(`
            CREATE TABLE user_cooldowns (
                user_id VARCHAR(20) NOT NULL,
                cooldown_type VARCHAR(50) NOT NULL,
                end_time TIMESTAMP NOT NULL,
                PRIMARY KEY (user_id, cooldown_type)
            )
        `);
        
        // Create battle_history table
        await client.query(`
            CREATE TABLE battle_history (
                id SERIAL PRIMARY KEY,
                attacker_id VARCHAR(20) NOT NULL,
                defender_id VARCHAR(20) NOT NULL,
                result VARCHAR(20) NOT NULL,
                stolen_fruits JSONB,
                battle_time TIMESTAMP DEFAULT NOW()
            )
        `);
        
        console.log('🔧 Creating database indexes for optimal performance...');
        
        // Indexes for user_devil_fruits
        await client.query(`
            CREATE INDEX idx_user_devil_fruits_user_id 
            ON user_devil_fruits(user_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_devil_fruits_fruit_id 
            ON user_devil_fruits(fruit_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_devil_fruits_rarity 
            ON user_devil_fruits(rarity)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_devil_fruits_type 
            ON user_devil_fruits(type)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_devil_fruits_duplicate_count 
            ON user_devil_fruits(duplicate_count)
        `);
        
        // Indexes for user_duplicate_stats
        await client.query(`
            CREATE INDEX idx_user_duplicate_stats_user_id 
            ON user_duplicate_stats(user_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_duplicate_stats_fruit_id 
            ON user_duplicate_stats(fruit_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_duplicate_stats_duplicate_count 
            ON user_duplicate_stats(duplicate_count)
        `);
        
        // Indexes for user_cooldowns
        await client.query(`
            CREATE INDEX idx_user_cooldowns_user_id 
            ON user_cooldowns(user_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_user_cooldowns_end_time 
            ON user_cooldowns(end_time)
        `);
        
        // Indexes for battle_history
        await client.query(`
            CREATE INDEX idx_battle_history_attacker 
            ON battle_history(attacker_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_battle_history_defender 
            ON battle_history(defender_id)
        `);
        
        await client.query(`
            CREATE INDEX idx_battle_history_battle_time 
            ON battle_history(battle_time)
        `);
        
        // Indexes for user_rarity_stats
        await client.query(`
            CREATE INDEX idx_user_rarity_stats_user_id 
            ON user_rarity_stats(user_id)
        `);
        
        // Indexes for user_type_stats
        await client.query(`
            CREATE INDEX idx_user_type_stats_user_id 
            ON user_type_stats(user_id)
        `);
        
        console.log('✅ All database tables created successfully');
        console.log('✅ Database indexes created for optimal performance');
        console.log('🔄 Duplicate system enabled - fruits now gain 1% CP per duplicate!');
        
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function closePool() {
    await pool.end();
}

module.exports = { initializeDatabase, closePool };
