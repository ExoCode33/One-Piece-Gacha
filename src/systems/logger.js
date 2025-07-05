// DETAILED LOGGING SYSTEM
// Logs all economy and raid activities to Discord channel

const { EmbedBuilder } = require('discord.js');
const EconomyConfig = require('../config/economy');

class ActivityLogger {
    constructor() {
        this.client = null;
        this.logChannel = null;
    }

    // Initialize with Discord client
    async initialize(client) {
        this.client = client;
        
        if (EconomyConfig.logChannelId) {
            try {
                this.logChannel = await client.channels.fetch(EconomyConfig.logChannelId);
                console.log(`✅ Activity logging enabled in channel: ${this.logChannel.name}`);
            } catch (error) {
                console.warn(`⚠️ Could not find log channel ${EconomyConfig.logChannelId}:`, error.message);
                this.logChannel = null;
            }
        } else {
            console.log('📝 Activity logging disabled (no LOG_CHANNEL_ID set)');
        }
    }

    // Send log to channel if enabled
    async sendLog(embed) {
        if (!this.logChannel || !EconomyConfig.enableDetailedLogs) return;
        
        try {
            await this.logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending log to channel:', error);
        }
    }

    // Log berry collection
    async logBerryCollection(userId, username, amount, totalBerries, hourlyIncome, totalCP) {
        if (!EconomyConfig.enableEconomyLogs) return;

        const embed = new EmbedBuilder()
            .setColor(0xFF6B35)
            .setTitle('🫐 Berry Collection')
            .setDescription(`**${username}** collected their hourly income`)
            .addFields(
                { name: '💰 Collected', value: `${amount.toLocaleString()} berries`, inline: true },
                { name: '💳 New Balance', value: `${totalBerries.toLocaleString()} berries`, inline: true },
                { name: '📈 Hourly Rate', value: `${hourlyIncome.toLocaleString()}/hour`, inline: true },
                { name: '⚔️ Combat Power', value: `${totalCP.toLocaleString()} CP`, inline: true },
                { name: '👤 User ID', value: userId, inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            )
            .setFooter({ text: 'Economy System' })
            .setTimestamp();

        await this.sendLog(embed);
        console.log(`💰 ${username} collected ${amount.toLocaleString()} berries (${totalBerries.toLocaleString()} total)`);
    }

    // Log Devil Fruit pull
    async logDevilFruitPull(userId, username, fruitName, rarity, berriesSpent, berriesRemaining) {
        if (!EconomyConfig.enableEconomyLogs) return;

        const rarityColors = {
            common: 0x8B4513,
            uncommon: 0x00FF00,
            rare: 0x0080FF,
            epic: 0x8000FF,
            legendary: 0xFFD700,
            mythical: 0xFF8000,
            omnipotent: 0xFF0000
        };

        const embed = new EmbedBuilder()
            .setColor(rarityColors[rarity] || 0x8B4513)
            .setTitle('🍈 Devil Fruit Pull')
            .setDescription(`**${username}** hunted a Devil Fruit!`)
            .addFields(
                { name: '🎯 Fruit Obtained', value: `**${fruitName}**`, inline: true },
                { name: '⭐ Rarity', value: rarity.toUpperCase(), inline: true },
                { name: '💸 Cost', value: `${berriesSpent.toLocaleString()} berries`, inline: true },
                { name: '💰 Remaining', value: `${berriesRemaining.toLocaleString()} berries`, inline: true },
                { name: '👤 User ID', value: userId, inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            )
            .setFooter({ text: 'Gacha System' })
            .setTimestamp();

        await this.sendLog(embed);
        console.log(`🍈 ${username} pulled ${fruitName} (${rarity}) for ${berriesSpent.toLocaleString()} berries`);
    }

    // Log raid attempt
    async logRaidAttempt(attackerId, attackerName, defenderId, defenderName, result) {
        if (!EconomyConfig.enableRaidLogs) return;

        const embed = new EmbedBuilder()
            .setColor(result.success ? 0x00FF00 : 0xFF0000)
            .setTitle(result.success ? '⚔️ Successful Raid!' : '🛡️ Raid Defended!')
            .setDescription(`**${attackerName}** raided **${defenderName}**`)
            .addFields(
                { name: '🥊 Outcome', value: result.success ? 'VICTORY' : 'DEFEAT', inline: true },
                { name: '⚔️ Attacker CP', value: `${result.attackerCP.toLocaleString()}`, inline: true },
                { name: '🛡️ Defender CP', value: `${result.defenderCP.toLocaleString()}`, inline: true }
            )
            .setFooter({ text: 'Raid System' })
            .setTimestamp();

        if (result.success) {
            let lootText = '';
            if (result.stolenBerries > 0) {
                lootText += `💰 ${result.stolenBerries.toLocaleString()} berries\n`;
            }
            if (result.stolenFruits && result.stolenFruits.length > 0) {
                lootText += `🍈 ${result.stolenFruits.length} Devil Fruit(s):\n`;
                result.stolenFruits.forEach(fruit => {
                    lootText += `• ${fruit.name} (${fruit.rarity})\n`;
                });
            }
            if (!lootText) lootText = 'No loot obtained';

            embed.addFields(
                { name: '💎 Loot Stolen', value: lootText, inline: false },
                { name: '👤 Attacker ID', value: attackerId, inline: true },
                { name: '👤 Defender ID', value: defenderId, inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            );
        } else {
            embed.addFields(
                { name: '🛡️ Result', value: `${defenderName} successfully defended their treasures!`, inline: false },
                { name: '👤 Attacker ID', value: attackerId, inline: true },
                { name: '👤 Defender ID', value: defenderId, inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            );
        }

        await this.sendLog(embed);
        
        if (result.success) {
            console.log(`⚔️ ${attackerName} raided ${defenderName} - Stole ${result.stolenBerries} berries + ${result.stolenFruits?.length || 0} fruits`);
        } else {
            console.log(`🛡️ ${defenderName} defended against ${attackerName}'s raid`);
        }
    }

    // Log berry transfer (for raids)
    async logBerryTransfer(fromId, fromName, toId, toName, amount, reason = 'raid') {
        if (!EconomyConfig.enableRaidLogs) return;

        const embed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('💸 Berry Transfer')
            .setDescription(`Berry transfer due to ${reason}`)
            .addFields(
                { name: '📤 From', value: `**${fromName}** (${fromId})`, inline: true },
                { name: '📥 To', value: `**${toName}** (${toId})`, inline: true },
                { name: '💰 Amount', value: `${amount.toLocaleString()} berries`, inline: true },
                { name: '📝 Reason', value: reason.toUpperCase(), inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            )
            .setFooter({ text: 'Economy System' })
            .setTimestamp();

        await this.sendLog(embed);
    }

    // Log fruit transfer (for raids)
    async logFruitTransfer(fromId, fromName, toId, toName, fruitName, fruitRarity, reason = 'raid') {
        if (!EconomyConfig.enableRaidLogs) return;

        const rarityColors = {
            common: 0x8B4513,
            uncommon: 0x00FF00,
            rare: 0x0080FF,
            epic: 0x8000FF,
            legendary: 0xFFD700,
            mythical: 0xFF8000,
            omnipotent: 0xFF0000
        };

        const embed = new EmbedBuilder()
            .setColor(rarityColors[fruitRarity] || 0x8B4513)
            .setTitle('🍈 Devil Fruit Transfer')
            .setDescription(`Devil Fruit stolen during ${reason}`)
            .addFields(
                { name: '📤 Stolen From', value: `**${fromName}** (${fromId})`, inline: true },
                { name: '📥 Stolen By', value: `**${toName}** (${toId})`, inline: true },
                { name: '🍈 Fruit', value: `**${fruitName}**`, inline: true },
                { name: '⭐ Rarity', value: fruitRarity.toUpperCase(), inline: true },
                { name: '📝 Reason', value: reason.toUpperCase(), inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            )
            .setFooter({ text: 'Raid System' })
            .setTimestamp();

        await this.sendLog(embed);
    }

    // Log system events
    async logSystemEvent(type, title, description, fields = []) {
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle(`🔧 ${title}`)
            .setDescription(description)
            .setFooter({ text: 'System Event' })
            .setTimestamp();

        if (fields.length > 0) {
            embed.addFields(fields);
        }

        await this.sendLog(embed);
        console.log(`🔧 System Event: ${title} - ${description}`);
    }

    // Log configuration changes
    async logConfigChange(adminId, adminName, setting, oldValue, newValue) {
        const embed = new EmbedBuilder()
            .setColor(0xFF9900)
            .setTitle('⚙️ Configuration Changed')
            .setDescription(`**${adminName}** modified system settings`)
            .addFields(
                { name: '🔧 Setting', value: setting, inline: true },
                { name: '📜 Old Value', value: String(oldValue), inline: true },
                { name: '🆕 New Value', value: String(newValue), inline: true },
                { name: '👤 Admin ID', value: adminId, inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
            )
            .setFooter({ text: 'Admin Action' })
            .setTimestamp();

        await this.sendLog(embed);
        console.log(`⚙️ ${adminName} changed ${setting} from ${oldValue} to ${newValue}`);
    }

    // Daily summary (can be called by a cron job)
    async logDailySummary(stats) {
        if (!EconomyConfig.enableDetailedLogs) return;

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('📊 Daily Activity Summary')
            .setDescription('Summary of the last 24 hours')
            .addFields(
                { name: '🫐 Berry Collections', value: `${stats.berryCollections || 0} collections`, inline: true },
                { name: '🍈 Devil Fruit Pulls', value: `${stats.fruitPulls || 0} pulls`, inline: true },
                { name: '⚔️ Raids Attempted', value: `${stats.raidsAttempted || 0} raids`, inline: true },
                { name: '🏆 Successful Raids', value: `${stats.successfulRaids || 0} victories`, inline: true },
                { name: '💰 Berries Earned', value: `${(stats.berriesEarned || 0).toLocaleString()}`, inline: true },
                { name: '💸 Berries Spent', value: `${(stats.berriesSpent || 0).toLocaleString()}`, inline: true }
            )
            .setFooter({ text: 'Daily Statistics' })
            .setTimestamp();

        await this.sendLog(embed);
    }
}

module.exports = new ActivityLogger();
