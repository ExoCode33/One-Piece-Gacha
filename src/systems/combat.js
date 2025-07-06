// SIMPLE WORKING COMBAT SYSTEM
// Uses existing database structure

const DatabaseManager = require('../database/manager');

class CombatSystem {
    async startNPCCombat(userId, username) {
        try {
            console.log(`🤖 Starting NPC combat for ${username}`);
            
            // Get user's combat power from existing method
            const userStats = await this.getUserStats(userId);
            if (userStats.totalCP === 0) {
                return {
                    success: false,
                    error: 'You need Devil Fruits to fight! Use `/pull` to get some first.'
                };
            }

            // Simple combat simulation
            const playerCP = userStats.totalCP || 0;
            const npcCP = 2000; // Fixed NPC power
            
            // Calculate win chance based on CP difference
            const cpDifference = playerCP - npcCP;
            const baseWinChance = 50;
            const cpBonus = Math.floor(cpDifference / 100) * 5;
            const winChance = Math.max(10, Math.min(90, baseWinChance + cpBonus));
            
            // Simulate battle
            const battleRoll = Math.floor(Math.random() * 100) + 1;
            const victory = battleRoll <= winChance;
            
            // Simulate HP (for display)
            const playerHP = victory ? Math.floor(Math.random() * 50) + 25 : 0;
            const npcHP = victory ? 0 : Math.floor(Math.random() * 50) + 25;
            
            // Create simple combat log
            const combatLog = [
                `⚔️ **${username}** (${playerCP} CP) vs **Monkey D. Tester** (${npcCP} CP)`,
                `🎲 Battle roll: ${battleRoll}/100 (needed ${winChance} or less)`,
                victory ? '🏆 **Victory!** You defeated the NPC!' : '💀 **Defeat!** The NPC was too strong!'
            ];

            let rewards = null;
            
            // Calculate rewards for victory
            if (victory) {
                const berryReward = Math.floor(Math.random() * 1000) + 500; // 500-1500 berries
                
                rewards = {
                    berries: berryReward,
                    fruits: [] // No fruit stealing for now
                };
                
                // Add berries to user (if BerryEconomySystem exists)
                try {
                    const BerryEconomySystem = require('./economy');
                    await BerryEconomySystem.addBerries(userId, berryReward, `NPC victory vs Monkey D. Tester`);
                } catch (error) {
                    console.warn('Berry system not available, skipping berry reward');
                    rewards.berries = 0;
                }
            }
            
            console.log(`🎯 NPC Combat result: ${victory ? 'Victory' : 'Defeat'} for ${username}`);
            
            return {
                success: true,
                result: victory ? 'victory' : 'defeat',
                attackerHP: playerHP,
                defenderHP: npcHP,
                combatLog,
                rewards
            };
            
        } catch (error) {
            console.error('NPC combat error:', error);
            return {
                success: false,
                error: 'Combat system error. Please try again.'
            };
        }
    }
    
    // Get user statistics using your existing database structure
    async getUserStats(userId) {
        try {
            // Use the actual table structure we discovered
            const query = `
                SELECT 
                    COUNT(*) as total_fruits,
                    COALESCE(SUM(CASE 
                        WHEN rarity = 'common' THEN 50 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'uncommon' THEN 150 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'rare' THEN 400 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'epic' THEN 800 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'legendary' THEN 1500 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'mythical' THEN 2500 * (1 + duplicate_count * 0.01)
                        WHEN rarity = 'omnipotent' THEN 5000 * (1 + duplicate_count * 0.01)
                        ELSE 50
                    END), 0) as total_cp
                FROM user_devil_fruits
                WHERE user_id = $1
            `;
            
            const result = await DatabaseManager.query(query, [userId]);
            const stats = result.rows[0];
            
            const userFruits = parseInt(stats.total_fruits) || 0;
            const userCP = Math.floor(parseFloat(stats.total_cp)) || 0;
            
            console.log(`📊 User ${userId} stats: ${userFruits} fruits, ${userCP} CP`);
            
            return {
                totalFruits: userFruits,
                totalCP: userCP
            };
            
        } catch (error) {
            console.error('Error getting user stats:', error);
            // Ultimate fallback - give them minimal stats for testing
            return {
                totalFruits: 1,
                totalCP: 100
            };
        }
    }
    
    // List available tables
    async listTables() {
        try {
            const query = `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `;
            const result = await DatabaseManager.query(query);
            return result.rows.map(row => row.table_name);
        } catch (error) {
            console.error('Error listing tables:', error);
            return [];
        }
    }
    
    // Simple battle prediction for PvP
    calculateBattlePrediction(attackerCP, defenderCP) {
        const cpDifference = attackerCP - defenderCP;
        const baseChance = 50;
        const cpBonus = Math.floor(cpDifference / 100) * 5;
        const winChance = Math.max(10, Math.min(90, baseChance + cpBonus));
        
        let outcome;
        if (winChance >= 70) {
            outcome = 'Highly Favored';
        } else if (winChance >= 55) {
            outcome = 'Favored';
        } else if (winChance >= 45) {
            outcome = 'Even Match';
        } else if (winChance >= 30) {
            outcome = 'Underdog';
        } else {
            outcome = 'Heavy Underdog';
        }
        
        return { winChance, outcome };
    }
}

module.exports = new CombatSystem();
