// scripts/economy-stats.js - View Economy Statistics
require('dotenv').config();

async function showEconomyStats() {
    console.log('📊 Economy System Statistics\n');

    try {
        const DatabaseManager = require('../src/database/manager');
        const BerryEconomySystem = require('../src/systems/economy');

        await DatabaseManager.initializeDatabase();
        await BerryEconomySystem.initializeBerryTable();

        const stats = await BerryEconomySystem.getEconomicStatistics();
        const leaderboard = await BerryEconomySystem.getIncomeLeaderboard(5);

        console.log('💰 ECONOMIC OVERVIEW');
        console.log('==================');
        console.log(`Total Users: ${stats.totalUsers}`);
        console.log(`Total Berries in Circulation: ${stats.totalBerriesInCirculation.toLocaleString()}`);
        console.log(`Average Balance: ${stats.averageBalance.toLocaleString()}`);
        console.log(`Total Generated: ${stats.totalBerriesGenerated.toLocaleString()}`);
        console.log(`Total Spent: ${stats.totalBerriesSpent.toLocaleString()}`);
        console.log(`Economic Health: ${stats.economicHealth}`);

        console.log('\n🏆 TOP 5 USERS BY TOTAL EARNED');
        console.log('==============================');
        if (leaderboard.length > 0) {
            leaderboard.forEach((user, index) => {
                console.log(`${index + 1}. ${user.username}: ${user.totalEarned.toLocaleString()} berries (${user.hourlyIncome}/hour)`);
            });
        } else {
            console.log('No users found with economic data');
        }

        // Show system configuration
        console.log('\n⚙️ SYSTEM CONFIGURATION');
        console.log('=======================');
        const config = BerryEconomySystem.getConfig();
        console.log(`Base Income Rate: ${config.baseIncomeRate} berries/hour`);
        console.log(`CP Multiplier: ${config.cpMultiplier} berries per CP`);
        console.log(`Max Stored Hours: ${config.maxStoredHours} hours`);
        console.log(`CP Bonuses: 50k(+${config.cpBonuses['50k']}), 100k(+${config.cpBonuses['100k']}), 200k(+${config.cpBonuses['200k']})`);

        // Show income rate examples
        console.log('\n📈 INCOME RATE EXAMPLES');
        console.log('=======================');
        const examples = [
            { cp: 0, label: 'No Devil Fruits' },
            { cp: 1000, label: 'Beginner (1,000 CP)' },
            { cp: 5000, label: 'Intermediate (5,000 CP)' },
            { cp: 50000, label: 'Advanced (50,000 CP)' },
            { cp: 100000, label: 'Expert (100,000 CP)' },
            { cp: 200000, label: 'Master (200,000 CP)' }
        ];

        examples.forEach(example => {
            let income = config.baseIncomeRate + (example.cp * config.cpMultiplier);
            
            // Add milestone bonuses
            if (example.cp >= 200000) {
                income += config.cpBonuses['200k'];
            } else if (example.cp >= 100000) {
                income += config.cpBonuses['100k'];
            } else if (example.cp >= 50000) {
                income += config.cpBonuses['50k'];
            }
            
            const per10min = Math.floor(income / 6);
            console.log(`${example.label}: ${Math.floor(income)} berries/hour (${per10min} per 10min)`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run stats if this file is executed directly
if (require.main === module) {
    showEconomyStats();
}

module.exports = { showEconomyStats };
