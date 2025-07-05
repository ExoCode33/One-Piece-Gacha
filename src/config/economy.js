// ECONOMY & RAID CONFIGURATION SYSTEM
// All values configurable via environment variables

class EconomyConfig {
    constructor() {
        // Economy Settings
        this.baseIncomeRate = parseInt(process.env.BASE_INCOME_RATE) || 100; // Base berries per hour
        this.cpMultiplier = parseFloat(process.env.CP_MULTIPLIER) || 0.1; // Berries per CP point
        this.maxAccumulationHours = parseInt(process.env.MAX_ACCUMULATION_HOURS) || 24; // Max hours to accumulate
        this.pullCost = parseInt(process.env.PULL_COST) || 1000; // Berries per Devil Fruit pull
        this.incomeScalingThreshold = parseInt(process.env.INCOME_SCALING_THRESHOLD) || 1000; // CP threshold for bonus
        this.scalingBonusRate = parseFloat(process.env.SCALING_BONUS_RATE) || 0.05; // Additional bonus rate

        // Raid Settings
        this.berryStealMin = parseFloat(process.env.BERRY_STEAL_MIN) || 0.10; // 10% minimum steal
        this.berryStealMax = parseFloat(process.env.BERRY_STEAL_MAX) || 0.50; // 50% maximum steal
        this.fruitStealChance = parseFloat(process.env.FRUIT_STEAL_CHANCE) || 0.15; // 15% chance per fruit
        this.maxFruitsStolen = parseInt(process.env.MAX_FRUITS_STOLEN) || 3; // Max 3 fruits per raid
        this.raidCooldownHours = parseInt(process.env.RAID_COOLDOWN_HOURS) || 2; // 2 hour cooldown
        this.protectionTimeHours = parseInt(process.env.PROTECTION_TIME_HOURS) || 1; // 1 hour protection

        // Combat Settings
        this.baseDamageMultiplier = parseFloat(process.env.BASE_DAMAGE_MULTIPLIER) || 0.25; // Base damage scaling
        this.elementalAdvantageBonus = parseFloat(process.env.ELEMENTAL_ADVANTAGE_BONUS) || 1.5; // 50% bonus
        this.criticalHitChance = parseFloat(process.env.CRITICAL_HIT_CHANCE) || 0.15; // 15% base crit
        this.criticalHitMultiplier = parseFloat(process.env.CRITICAL_HIT_MULTIPLIER) || 1.5; // 50% bonus damage

        // Logging Settings
        this.logChannelId = process.env.LOG_CHANNEL_ID || null;
        this.enableBerryLogs = process.env.ENABLE_BERRY_LOGS === 'true' || true;
        this.enableRaidLogs = process.env.ENABLE_RAID_LOGS === 'true' || true;
        this.enablePullLogs = process.env.ENABLE_PULL_LOGS === 'true' || true;
        this.enableDailySummaries = process.env.ENABLE_DAILY_SUMMARIES === 'true' || false;
    }

    // Calculate hourly income based on Combat Power
    calculateHourlyIncome(totalCP) {
        let income = this.baseIncomeRate + (totalCP * this.cpMultiplier);
        
        // Apply scaling bonus for high CP players
        if (totalCP > this.incomeScalingThreshold) {
            const bonus = (totalCP - this.incomeScalingThreshold) * this.scalingBonusRate;
            income += bonus;
        }
        
        return Math.floor(income);
    }

    // Calculate maximum berry accumulation
    calculateMaxAccumulation(totalCP) {
        const hourlyIncome = this.calculateHourlyIncome(totalCP);
        return hourlyIncome * this.maxAccumulationHours;
    }

    // Get random berry steal percentage
    getRandomBerrySteal() {
        return Math.random() * (this.berryStealMax - this.berryStealMin) + this.berryStealMin;
    }

    // Calculate raid cooldown in milliseconds
    getRaidCooldownMs() {
        return this.raidCooldownHours * 60 * 60 * 1000;
    }

    // Calculate protection time in milliseconds
    getProtectionTimeMs() {
        return this.protectionTimeHours * 60 * 60 * 1000;
    }

    // Get all configuration as object (for admin commands)
    getAllConfig() {
        return {
            economy: {
                baseIncomeRate: this.baseIncomeRate,
                cpMultiplier: this.cpMultiplier,
                maxAccumulationHours: this.maxAccumulationHours,
                pullCost: this.pullCost,
                incomeScalingThreshold: this.incomeScalingThreshold,
                scalingBonusRate: this.scalingBonusRate
            },
            raid: {
                berryStealMin: this.berryStealMin,
                berryStealMax: this.berryStealMax,
                fruitStealChance: this.fruitStealChance,
                maxFruitsStolen: this.maxFruitsStolen,
                raidCooldownHours: this.raidCooldownHours,
                protectionTimeHours: this.protectionTimeHours
            },
            combat: {
                baseDamageMultiplier: this.baseDamageMultiplier,
                elementalAdvantageBonus: this.elementalAdvantageBonus,
                criticalHitChance: this.criticalHitChance,
                criticalHitMultiplier: this.criticalHitMultiplier
            },
            logging: {
                logChannelId: this.logChannelId,
                enableBerryLogs: this.enableBerryLogs,
                enableRaidLogs: this.enableRaidLogs,
                enablePullLogs: this.enablePullLogs,
                enableDailySummaries: this.enableDailySummaries
            }
        };
    }
}

module.exports = new EconomyConfig();
