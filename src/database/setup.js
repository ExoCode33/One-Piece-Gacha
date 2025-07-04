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
        
        console.log('📋 Creating database tables...');
        
        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(20) PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                total_hunts INTEGER DEFAULT 0,
                discovery_rate INTEGER DEFAULT 0,
                level INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // User Devil Fruits collection
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_devil_fruits (
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
                obtained_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // User rarity statistics
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_rarity_stats (
                user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
                rarity VARCHAR(50) NOT NULL,
                count INTEGER DEFAULT 0,
                PRIMARY KEY (user_id, rarity)
            )
        `);
        
        // User type statistics
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_type_stats (
                user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
                type VARCHAR(100) NOT NULL,
                count INTEGER DEFAULT 0,
                PRIMARY KEY (user_id, type)
            )
        `);
        
        // User levels (for Discord role integration)
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_levels (
                user_id VARCHAR(20) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
                level INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // User cooldowns (FIXED column names)
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_cooldowns (
                user_id VARCHAR(20) NOT NULL,
                cooldown_type VARCHAR(50) NOT NULL,
                end_time TIMESTAMP NOT NULL,
                PRIMARY KEY (user_id, cooldown_type)
            )
        `);
        
        // Battle history (for future PvP system)
        await client.query(`
            CREATE TABLE IF NOT EXISTS battle_history (
                id SERIAL PRIMARY KEY,
                attacker_id VARCHAR(20) NOT NULL,
                defender_id VARCHAR(20) NOT NULL,
                result VARCHAR(20) NOT NULL,
                stolen_fruits JSONB,
                battle_time TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Create indexes for better performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_user_id 
            ON user_devil_fruits(user_id)
        `);
        
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_rarity 
            ON user_devil_fruits(rarity)
        `);
        
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_devil_fruits_type 
            ON user_devil_fruits(type)
        `);
        
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_cooldowns_user_id 
            ON user_cooldowns(user_id)
        `);
        
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_battle_history_attacker 
            ON battle_history(attacker_id)
        `);
        
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_battle_history_defender 
            ON battle_history(defender_id)
        `);
        
        console.log('✅ All database tables created successfully');
        console.log('✅ Database indexes created for optimal performance');
        
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
