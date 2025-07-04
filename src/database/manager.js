const { DatabaseSetup } = require('./setup');
const { LevelSystem } = require('../data/counter-system');

class DatabaseManager {
    // ═══════════════════════════════════════════════════════════════
    //                         USER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    
    static async getOrCreateUser(userId, username, guildId = null) {
        try {
            // Check if user exists
            const userResult = await DatabaseSetup.query(
                'SELECT * FROM users WHERE user_id = $1',
                [userId]
            );

            if (userResult.rows.length > 0) {
                // Update username if changed
                await DatabaseSetup.query(
                    'UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
                    [username, userId]
                );
                return userResult.rows[0];
            }

            // Create new user
            const newUserResult = await DatabaseSetup.query(`
                INSERT INTO users (user_id, username, guild_id) 
                VALUES ($1, $2, $3) 
                RETURNING *
            `, [userId, username, guildId]);

            // Initialize user stats tables
            await this.initializeUserStats(userId);

            return newUserResult.rows[0];

        } catch (error) {
            console.error('Error getting/creating user:', error);
            throw error;
        }
    }

    static async initializeUserStats(userId) {
        try {
            // Initialize rarity stats
            const rarities = ['common', 'uncommon', 'rare', 'legendary', 'mythical', 'omnipotent'];
            for (const rarity of rarities) {
                await DatabaseSetup.query(`
                    INSERT INTO user_rarity_stats (user_id, rarity, count) 
                    VALUES ($1, $2, 0) 
                    ON CONFLICT (user_id, rarity) DO NOTHING
                `, [userId, rarity]);
            }

            // Initialize type stats
            const types = ['Paramecia', 'Zoan', 'Logia', 'Ancient Zoan', 'Mythical Zoan', 'Special Paramecia'];
            for (const type of types) {
                await DatabaseSetup.query(`
                    INSERT INTO user_type_stats (user_id, fruit_type, count) 
                    VALUES ($1, $2, 0) 
                    ON CONFLICT (user_id, fruit_type) DO NOTHING
                `, [userId, type]);
            }

            // Initialize level stats
            await DatabaseSetup.query(`
                INSERT INTO user_levels (user_id) 
                VALUES ($1) 
                ON CONFLICT (user_id) DO NOTHING
            `, [userId]);

            // Initialize cooldowns
            await DatabaseSetup.query(`
                INSERT INTO user_cooldowns (user_id) 
                VALUES ($1) 
                ON CONFLICT (user_id) DO NOTHING
            `, [userId]);

        } catch (error) {
            console.error('Error initializing user stats:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //                         DEVIL FRUIT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    static async addDevilFruit(userId, fruit, element = null) {
        try {
            // Check if user already has this fruit
            const existingResult = await DatabaseSetup.query(
                'SELECT * FROM user_devil_fruits WHERE user_id = $1 AND fruit_id = $2',
                [userId, fruit.id]
            );

            if (existingResult.rows.length > 0) {
                // Update times obtained
                await DatabaseSetup.query(`
                    UPDATE user_devil_fruits 
                    SET times_obtained = times_obtained + 1, last_obtained = CURRENT_TIMESTAMP 
                    WHERE user_id = $1 AND fruit_id = $2
                `, [userId, fruit.id]);
            } else {
                // Add new fruit
                await DatabaseSetup.query(`
                    INSERT INTO user_devil_fruits 
                    (user_id, fruit_id, fruit_name, fruit_type, rarity, element, power_level) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [userId, fruit.id, fruit.name, fruit.type, fruit.rarity, element, fruit.powerLevel]);
            }

            // Update rarity stats
            await DatabaseSetup.query(`
                UPDATE user_rarity_stats 
                SET count = count + 1 
                WHERE user_id = $1 AND rarity = $2
            `, [userId, fruit.rarity]);

            // Update type stats
            await DatabaseSetup.query(`
                UPDATE user_type_stats 
                SET count = count + 1 
                WHERE user_id = $1 AND fruit_type = $2
            `, [userId, fruit.type]);

            // Update user totals
            await DatabaseSetup.query(`
                UPDATE users 
                SET total_hunts = total_hunts + 1,
                    total_fruits = (SELECT COUNT(*) FROM user_devil_fruits WHERE user_id = $1),
                    updated_at = CURRENT_TIMESTAMP 
                WHERE user_id = $1
            `, [userId]);

            // Recalculate discovery rate
            await this.updateDiscoveryRate(userId);

        } catch (error) {
            console.error('Error adding devil fruit:', error);
            throw error;
        }
    }

    static async getUserCollection(userId) {
        try {
            const result = await DatabaseSetup.query(`
                SELECT 
                    u.*,
                    COALESCE(ul.discord_level, 0) as discord_level,
                    COALESCE(ul.rank_name, 'Newcomer') as rank_name,
                    COALESCE(ul.level_multiplier, 1.0) as level_multiplier,
                    COALESCE(ul.total_combat_power, 0) as total_combat_power
                FROM users u
                LEFT JOIN user_levels ul ON u.user_id = ul.user_id
                WHERE u.user_id = $1
            `, [userId]);

            if (result.rows.length === 0) {
                return null;
            }

            const user = result.rows[0];

            // Get devil fruits
            const fruitsResult = await DatabaseSetup.query(`
                SELECT * FROM user_devil_fruits 
                WHERE user_id = $1 
                ORDER BY power_level DESC
            `, [userId]);

            // Get rarity stats
            const rarityResult = await DatabaseSetup.query(`
                SELECT rarity, count FROM user_rarity_stats 
                WHERE user_id = $1 AND count > 0
            `, [userId]);

            // Get type stats
            const typeResult = await DatabaseSetup.query(`
                SELECT fruit_type, count FROM user_type_stats 
                WHERE user_id = $1 AND count > 0
            `, [userId]);

            // Build collection object
            const collection = {
                user: user,
                devilFruits: {},
                rarityCount: {},
                typeCount: {},
                battleProfile: {
                    level: user.discord_level,
                    rank: user.rank_name,
                    levelMultiplier: parseFloat(user.level_multiplier),
                    totalCombatPower: user.total_combat_power
                }
            };

            // Process fruits
            fruitsResult.rows.forEach(fruit => {
                collection.devilFruits[fruit.fruit_id] = {
                    id: fruit.fruit_id,
                    name: fruit.fruit_name,
                    type: fruit.fruit_type,
                    rarity: fruit.rarity,
                    element: fruit.element,
                    powerLevel: fruit.power_level,
                    timesObtained: fruit.times_obtained,
                    obtainedAt: fruit.first_obtained
                };
            });

            // Process rarity counts
            rarityResult.rows.forEach(row => {
                collection.rarityCount[row.rarity] = row.count;
            });

            // Process type counts
            typeResult.rows.forEach(row => {
                collection.typeCount[row.fruit_type] = row.count;
            });

            return collection;

        } catch (error) {
            console.error('Error getting user collection:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //                         LEVEL MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    static async updateUserLevel(userId, member) {
        try {
            const discordLevel = LevelSystem.extractLevelFromRoles(member);
            const levelMultiplier = LevelSystem.getMultiplierForLevel(discordLevel);
            const rankName = LevelSystem.getRankName(discordLevel);

            // Get user's base combat power
            const basePowerResult = await DatabaseSetup.query(`
                SELECT SUM(
                    udf.power_level * udf.times_obtained * 
                    CASE 
                        WHEN udf.rarity = 'common' THEN 1.0
                        WHEN udf.rarity = 'uncommon' THEN 1.2
                        WHEN udf.rarity = 'rare' THEN 1.5
                        WHEN udf.rarity = 'legendary' THEN 2.0
                        WHEN udf.rarity = 'mythical' THEN 3.0
                        WHEN udf.rarity = 'omnipotent' THEN 5.0
                        ELSE 1.0
                    END
                ) as base_power
                FROM user_devil_fruits udf
                WHERE udf.user_id = $1
            `, [userId]);

            const basePower = basePowerResult.rows[0]?.base_power || 0;
            const totalCombatPower = Math.round(basePower * levelMultiplier);
            const levelBonus = totalCombatPower - basePower;

            // Update level stats
            await DatabaseSetup.query(`
                UPDATE user_levels 
                SET discord_level = $1,
                    rank_name = $2,
                    level_multiplier = $3,
                    base_combat_power = $4,
                    total_combat_power = $5,
                    level_bonus = $6,
                    last_level_update = CURRENT_TIMESTAMP
                WHERE user_id = $7
            `, [discordLevel, rankName, levelMultiplier, basePower, totalCombatPower, levelBonus, userId]);

            return {
                level: discordLevel,
                rank: rankName,
                levelMultiplier: levelMultiplier,
                baseCombatPower: basePower,
                totalCombatPower: totalCombatPower,
                levelBonus: levelBonus
            };

        } catch (error) {
            console.error('Error updating user level:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //                         COOLDOWN MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    static async checkCooldown(userId) {
        try {
            const result = await DatabaseSetup.query(`
                SELECT * FROM user_cooldowns 
                WHERE user_id = $1
            `, [userId]);

            if (result.rows.length === 0) {
                return { onCooldown: false, timeLeft: 0 };
            }

            const cooldown = result.rows[0];
            const now = new Date();

            if (cooldown.cooldown_end && new Date(cooldown.cooldown_end) > now) {
                const timeLeft = Math.ceil((new Date(cooldown.cooldown_end) - now) / 1000);
                return { onCooldown: true, timeLeft: timeLeft };
            }

            return { onCooldown: false, timeLeft: 0 };

        } catch (error) {
            console.error('Error checking cooldown:', error);
            throw error;
        }
    }

    static async setCooldown(userId, cooldownSeconds = 5) {
        try {
            const cooldownEnd = new Date(Date.now() + (cooldownSeconds * 1000));
            
            await DatabaseSetup.query(`
                UPDATE user_cooldowns 
                SET last_single_pull = CURRENT_TIMESTAMP,
                    cooldown_end = $1
                WHERE user_id = $2
            `, [cooldownEnd, userId]);

        } catch (error) {
            console.error('Error setting cooldown:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //                         UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    static async updateDiscoveryRate(userId) {
        try {
            await DatabaseSetup.query(`
                UPDATE users 
                SET discovery_rate = (
                    CASE 
                        WHEN total_hunts > 0 THEN (total_fruits::decimal / total_hunts::decimal) * 100
                        ELSE 0
                    END
                )
                WHERE user_id = $1
            `, [userId]);
        } catch (error) {
            console.error('Error updating discovery rate:', error);
        }
    }

    // Get leaderboard (for future use)
    static async getLeaderboard(limit = 10, orderBy = 'total_combat_power') {
        try {
            const result = await DatabaseSetup.query(`
                SELECT u.username, ul.discord_level, ul.rank_name, ul.total_combat_power, u.total_fruits
                FROM users u
                LEFT JOIN user_levels ul ON u.user_id = ul.user_id
                ORDER BY ul.${orderBy} DESC NULLS LAST
                LIMIT $1
            `, [limit]);

            return result.rows;
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            throw error;
        }
    }
}

module.exports = { DatabaseManager };
