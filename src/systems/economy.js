// ECONOMY & RAID CONFIGURATION SYSTEM
// All values configurable via environment variables

class EconomyConfig {
    constructor() {
        // Economy Settings
        this.baseIncomeRate = parseInt(process.env.BASE_INCOME_RATE) || 100; // Base berries per hour
        this.cpMultiplier = parseFloat(process.env.CP_MULTIPLIER) || 0.1; // Berries per CP per hour
        this.maxStoredHours = parseInt(process.env.MAX_STORED_HOURS) || 24; // Max accumulation hours
        this.pullCost = parseInt(process.env.PULL_COST) || 1000; // Berry cost per pull
        
        // Scaling bonuses for high CP players
        this.scalingBonuses = {
            cp50k: parseInt(process.env.CP_50K_BONUS) || 500,
            cp100k: parseInt(process.env.CP_100K_BONUS) || 1000,
            cp200k: parseInt(process.env.CP_200K_BONUS) || 2000
        };

        // Raid Settings
        this.berryStealMin = parseFloat(process.env.BERRY_STEAL_MIN) || 0.10; // 10% minimum
        this.berryStealMax = parseFloat(process.env.BERRY_STEAL_MAX) || 0.50; // 50% maximum
        this.fruitStealChance = parseFloat(process.env.FRUIT_STEAL_CHANCE) || 0.15; // 15% chance
        this.maxFruitsStolen = parseInt(process.env.MAX_FRUITS_STOLEN) || 3; // Max fruits per raid
        this.raidCooldown = parseInt(process.env.RAID_COOLDOWN_HOURS) || 2; // Hours
        this.protectionTime = parseInt(process.env.PROTECTION_TIME_HOURS) || 1; // Hours
        this.minBerriesToRaid = parseInt(process.env.MIN_BERRIES_TO_RAID) || 100; // Minimum target berries

        // Logging Settings
        this.logChannelId = process.env.LOG_CHANNEL_ID || null; // Discord channel ID for logs
        this.enableDetailedLogs = (process.env.ENABLE_DETAILED_LOGS || 'true').toLowerCase() === 'true';
        this.enableEconomyLogs = (process.env.ENABLE_ECONOMY_LOGS || 'true').toLowerCase() === 'true';
        this.enableRaidLogs = (process.env.ENABLE_RAID_LOGS || 'true').toLowerCase() === 'true';

        // Convert hours to milliseconds for internal use
        this.raidCooldownMs = this.raidCooldown * 60 * 60 * 1000;
        this.protectionTimeMs = this.protectionTime * 60 * 60 * 1000;
    }

    // Get berry steal range
    getBerryStealRange() {
        return {
            min: this.berryStealMin,
            max: this.berryStealMax
        };
    }

    // Calculate scaling bonus for given CP
    getScalingBonus(totalCP) {
        let bonus = 0;
        if (totalCP >= 200000) bonus += this.scalingBonuses.cp200k;
        else if (totalCP >= 100000) bonus += this.scalingBonuses.cp100k;
        else if (totalCP >= 50000) bonus += this.scalingBonuses.cp50k;
        return bonus;
    }

    // Get configuration summary for admin commands
    getConfigSummary() {
        return {
            economy: {
                baseIncomeRate: this.baseIncomeRate,
                cpMultiplier: this.cpMultiplier,
                maxStoredHours: this.maxStoredHours,
                pullCost: this.pullCost,
                scalingBonuses: this.scalingBonuses
            },
            raid: {
                berryStealRange: `${(this.berryStealMin * 100)}%-${(this.berryStealMax * 100)}%`,
                fruitStealChance: `${(this.fruitStealChance * 100)}%`,
                maxFruitsStolen: this.maxFruitsStolen,
                raidCooldownHours: this.raidCooldown,
                protectionTimeHours: this.protectionTime,
                minBerriesToRaid: this.minBerriesToRaid
            },
            logging: {
                logChannelId: this.logChannelId,
                enableDetailedLogs: this.enableDetailedLogs,
                enableEconomyLogs: this.enableEconomyLogs,
                enableRaidLogs: this.enableRaidLogs
            }
        };
    }

    // Validate configuration
    validate() {
        const issues = [];
        
        if (this.pullCost <= 0) issues.push('PULL_COST must be positive');
        if (this.berryStealMin < 0 || this.berryStealMin > 1) issues.push('BERRY_STEAL_MIN must be between 0 and 1');
        if (this.berryStealMax < 0 || this.berryStealMax > 1) issues.push('BERRY_STEAL_MAX must be between 0 and 1');
        if (this.berryStealMin >= this.berryStealMax) issues.push('BERRY_STEAL_MIN must be less than BERRY_STEAL_MAX');
        if (this.fruitStealChance < 0 || this.fruitStealChance > 1) issues.push('FRUIT_STEAL_CHANCE must be between 0 and 1');
        if (this.maxFruitsStolen <= 0) issues.push('MAX_FRUITS_STOLEN must be positive');
        if (this.raidCooldown <= 0) issues.push('RAID_COOLDOWN_HOURS must be positive');
        if (this.protectionTime < 0) issues.push('PROTECTION_TIME_HOURS must be non-negative');
        if (this.maxStoredHours <= 0) issues.push('MAX_STORED_HOURS must be positive');
        
        return issues;
    }
}

module.exports = new EconomyConfig();
