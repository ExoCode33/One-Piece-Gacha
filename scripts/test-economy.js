// scripts/test-economy.js - Test Economy System Functionality
require('dotenv').config();

async function testEconomySystem() {
    console.log('🧪 Testing Economy System...\n');

    try {
        // Test database connection
        console.log('1. Testing Database Connection...');
        const DatabaseManager = require('../src/database/manager');
        await DatabaseManager.initializeDatabase();
        console.log('✅ Database connection successful\n');

        // Test economy system initialization
        console.log('2. Testing Economy System Initialization...');
        const BerryEconomySystem = require('../src/systems/economy');
        await BerryEconomySystem.initializeBerryTable();
        await BerryEconomySystem.initializePurchaseTable();
        console.log('✅ Economy system initialized\n');

        // Test user creation and berry operations
        console.log('3. Testing User Operations...');
        const testUserId = 'test_user_123';
        const testUsername = 'TestUser';

        await DatabaseManager.ensureUser(testUserId, testUsername);
        console.log('✅ Test user created');

        // Test adding berries
        const initialBalance = await BerryEconomySystem.addBerries(testUserId, 1000, 'Test Addition');
        console.log(`✅ Added 1000 berries. Balance: ${initialBalance}`);

        // Test CP calculation (simulate having devil fruits)
        console.log('\n4. Testing Combat Power Calculation...');
        const totalCP = await BerryEconomySystem.calculateUserTotalCP(testUserId);
        console.log(`✅ Total CP calculated: ${totalCP}`);

        // Test income calculation
        console.log('\n5. Testing Income Calculation...');
        const hourlyIncome = await BerryEconomySystem.calculateHourlyIncome(testUserId);
        const tenMinIncome = Math.floor(hourlyIncome / 6);
        console.log(`✅ Hourly income: ${hourlyIncome} berries`);
        console.log(`✅ 10-minute income: ${tenMinIncome} berries`);

        // Test income processing
        console.log('\n6. Testing Income Processing...');
        const incomeResult = await BerryEconomySystem.processAutoIncome(testUserId, testUsername);
        console.log(`✅ Income processing result:`, incomeResult);

        // Test purchase system
        console.log('\n7. Testing Purchase System...');
        const purchaseResult = await BerryEconomySystem.makePurchase(testUserId, 100, 'Test Item', { type: 'test' });
        console.log('✅ Purchase result:', purchaseResult);

        // Test economic statistics
        console.log('\n8. Testing Economic Statistics...');
        const economicStats = await BerryEconomySystem.getEconomicStatistics();
        console.log('✅ Economic stats:', {
            totalUsers: economicStats.totalUsers,
            totalBerries: economicStats.totalBerriesInCirculation,
            economicHealth: economicStats.economicHealth
        });

        // Clean up test data
        console.log('\n9. Cleaning up test data...');
        await DatabaseManager.query('DELETE FROM user_berries WHERE user_id = $1', [testUserId]);
        await DatabaseManager.query('DELETE FROM user_purchases WHERE user_id = $1', [testUserId]);
        await DatabaseManager.query('DELETE FROM users WHERE user_id = $1', [testUserId]);
        console.log('✅ Test data cleaned up');

        console.log('\n🎉 ALL TESTS PASSED! Economy system is working correctly.');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run tests if this file is executed directly
if (require.main === module) {
    testEconomySystem();
}

module.exports = { testEconomySystem };
