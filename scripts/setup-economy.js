// scripts/setup-economy.js - Initial Economy Setup
require('dotenv').config();

async function setupEconomy() {
    console.log('🚀 Setting up Economy System...\n');

    try {
        const DatabaseManager = require('../src/database/manager');
        const BerryEconomySystem = require('../src/systems/economy');

        // Initialize database
        console.log('1. Initializing database...');
        await DatabaseManager.initializeDatabase();
        console.log('✅ Database initialized');

        // Initialize economy tables
        console.log('2. Setting up economy tables...');
        await BerryEconomySystem.initializeBerryTable();
        await BerryEconomySystem.initializePurchaseTable();
        console.log('✅ Economy tables created');

        // Verify configuration
        console.log('3. Verifying configuration...');
        const config = BerryEconomySystem.getConfig();
        console.log('✅ Configuration loaded:', {
            baseIncomeRate: config.baseIncomeRate,
            cpMultiplier: config.cpMultiplier,
            maxStoredHours: config.maxStoredHours
        });

        // Test database connectivity with a sample operation
        console.log('4. Testing database operations...');
        const testResult = await DatabaseManager.query('SELECT NOW() as current_time');
        console.log('✅ Database operations working:', testResult.rows[0].current_time);

        // Check if there are existing users
        console.log('5. Checking existing data...');
        const userCount = await DatabaseManager.query('SELECT COUNT(*) as count FROM users');
        const berryCount = await DatabaseManager.query('SELECT COUNT(*) as count FROM user_berries');
        console.log(`✅ Found ${userCount.rows[0].count} users and ${berryCount.rows[0].count} berry accounts`);

        console.log('\n🎉 Economy system setup complete!');
        console.log('\n📋 SETUP SUMMARY');
        console.log('================');
        console.log('✅ Database connection established');
        console.log('✅ All economy tables created');
        console.log('✅ Configuration verified');
        console.log('✅ System ready for use');
        
        console.log('\n📝 NEXT STEPS:');
        console.log('==============');
        console.log('1. Start your Discord bot: npm start');
        console.log('2. Use /pull to get Devil Fruits (increases CP)');
        console.log('3. Use /income to view income generation');
        console.log('4. Use /bank to collect berries');
        console.log('5. Income is automatically generated every 10 minutes');
        console.log('6. Use /economy-admin for admin controls');
        
        console.log('\n🧪 TESTING:');
        console.log('===========');
        console.log('Run "npm run economy:test" to test all systems');
        console.log('Run "npm run economy:stats" to view statistics');

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        console.error('\n🔧 TROUBLESHOOTING:');
        console.error('===================');
        console.error('1. Check your DATABASE_URL in .env file');
        console.error('2. Ensure PostgreSQL is running');
        console.error('3. Verify database permissions');
        console.error('4. Check network connectivity to database');
        process.exit(1);
    }

    process.exit(0);
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupEconomy();
}

module.exports = { setupEconomy };
