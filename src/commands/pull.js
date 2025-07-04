const { SlashCommandBuilder } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { CombatSystem } = require('../data/counter-system');

async function execute(interaction) {
    try {
        console.log(`🎮 ${interaction.user.username} used /pull`);

        const userId = interaction.user.id;
        const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');

        if (cooldownEnd && Date.now() < cooldownEnd) {
            const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
            return await interaction.reply({
                content: `⏰ Your crew is still recovering from the last hunt! Wait **${timeLeft}** more seconds before searching for another Devil Fruit.`,
                ephemeral: true
            });
        }

        await handleSingleHunt(interaction);
    } catch (error) {
        console.error(`🚨 Pull Command Error:`, error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '⚠️ Something went wrong during your Devil Fruit hunt! Please try again.',
                ephemeral: true
            });
        }
    }
}

async function handleSingleHunt(interaction) {
    try {
        console.log(`🎮 ${interaction.user.username} initiated single Devil Fruit hunt`);

        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        await DatabaseManager.ensureUser(interaction.user.id, interaction.user.username);

        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;

        await createUltimateCinematicExperience(interaction, userLevel);

        console.log(`🎊 Single hunt success for ${interaction.user.username}`);
    } catch (error) {
        console.error('Single hunt error:', error);
        throw error;
    }
}

async function handleButtonInteraction(interaction) {
    try {
        const [action] = interaction.customId.split('_');

        switch (action) {
            case 'huntAgain':
                await handleHuntAgain(interaction);
                break;
            case 'collection':
                await handleCollection(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown action.',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error(`Button interaction error:`, error);
        await interaction.reply({
            content: '⚠️ Something went wrong with that action.',
            ephemeral: true
        });
    }
}

async function handleHuntAgain(interaction) {
    const userId = interaction.user.id;
    const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');

    if (cooldownEnd && Date.now() < cooldownEnd) {
        const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
        await interaction.reply({
            content: `⏰ Your crew is still recovering! Wait **${timeLeft}** more seconds before hunting again.`,
            ephemeral: true
        });
        return;
    }

    await interaction.deferReply();
    await handleSingleHunt(interaction);
}

async function handleCollection(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.user.id;
        const username = interaction.user.username;

        await DatabaseManager.ensureUser(userId, username);

        const userData = await DatabaseManager.getUser(userId);
        const userFruits = await DatabaseManager.getUserFruits(userId);
        const rarityStats = await DatabaseManager.getUserRarityStats(userId);
        const typeStats = await DatabaseManager.getUserTypeStats(userId);

        const userLevel = userData ? userData.level : 0;
        const levelMultiplier = CombatSystem.getLevelMultiplier(userLevel);
        const levelRank = CombatSystem.getLevelRank(userLevel);

        let totalBasePower = 0;
        let totalCombatPower = 0;
        let strongestFruit = null;
        let strongestPower = 0;
        const fruitsByType = {};

        for (const fruit of userFruits) {
            const basePower = CombatSystem.calculateBasePower(fruit.rarity);
            const enhancedPower = Math.floor(basePower * levelMultiplier);

            totalBasePower += basePower;
            totalCombatPower += enhancedPower;

            if (enhancedPower > strongestPower) {
                strongestPower = enhancedPower;
                strongestFruit = fruit;
            }

            if (!fruitsByType[fruit.type]) {
                fruitsByType[fruit.type] = [];
            }
            fruitsByType[fruit.type].push({
                ...fruit,
                basePower,
                enhancedPower
            });
        }

        const levelBonus = totalCombatPower - totalBasePower;
        const levelBonusPercentage = levelMultiplier > 1 ? Math.round((levelMultiplier - 1) * 100) : 0;
        const powerRank = CombatSystem.getPowerRank(totalCombatPower);

        let collectionContent = `🏴‍☠️ **${username}'s Devil Fruit Collection** 🏴‍☠️\n\n`;

        if (userLevel > 0) {
            collectionContent += `🎖️ **Level:** ${userLevel} (${levelRank})\n`;
            collectionContent += `⚔️ **Total Combat Power:** ${totalCombatPower.toLocaleString()} CP\n`;
            if (levelBonusPercentage > 0) {
                collectionContent += `📈 **Level Bonus:** +${levelBonusPercentage}% Combat Power\n`;
            }
            collectionContent += `🏆 **Power Rank:** ${powerRank}\n`;
            if (strongestFruit) {
                collectionContent += `💪 **Strongest Fruit:** ${strongestFruit.name} (${strongestPower.toLocaleString()} CP)\n`;
            }
            collectionContent += `\n`;
        }

        const totalFruits = userFruits.length;
        const uniqueFruits = new Set(userFruits.map(f => f.fruit_id)).size;
        const discoveryRate = userData ? Math.round((uniqueFruits / userData.total_hunts) * 100) : 0;

        collectionContent += `📊 **Collection Stats:**\n`;
        collectionContent += `🍈 Total Fruits: ${totalFruits}\n`;
        collectionContent += `✨ Unique Fruits: ${uniqueFruits}\n`;
        collectionContent += `🎯 Discovery Rate: ${discoveryRate}%\n`;
        collectionContent += `🏴‍☠️ Total Hunts: ${userData ? userData.total_hunts : 0}\n\n`;

        // You can truncate here if needed or add more logic to fit Discord length limits

        await interaction.editReply({ content: collectionContent });

    } catch (error) {
        console.error('Collection error:', error);
        await interaction.editReply({
            content: '⚠️ Error displaying collection. Please try again.'
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!'),
    execute,
    handleButtonInteraction
};
