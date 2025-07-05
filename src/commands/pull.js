const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createUltimateCinematicExperience } = require('../animations/gacha');
const DatabaseManager = require('../database/manager');
const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('../data/counter-system');
const { generateRandomDevilFruit } = require('../data/devilfruit');
const { generateParticles } = require('../animations/particles');
const { getChangingIndicators } = require('../animations/indicators');

const rainbowEmbedColors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8000FF, 0x8B4513];
const rainbowColors = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];

const rarityColors = {
    common: { emoji: '🟫', embed: 0x8B4513 },
    uncommon: { emoji: '🟩', embed: 0x00FF00 },
    rare: { emoji: '🟦', embed: 0x0000FF },
    epic: { emoji: '🟪', embed: 0x8000FF },
    legendary: { emoji: '🟨', embed: 0xFFFF00 },
    mythical: { emoji: '🟥', embed: 0xFF0000 },
    omnipotent: { emoji: '⬜', embed: 0xFFFFFF }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!'),

    async execute(interaction) {
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
    },

    async handleButtonInteraction(interaction) {
        try {
            const customId = interaction.customId;
            
            switch (customId) {
                case 'huntAgain':
                    await handleHuntAgain(interaction);
                    break;
                case 'collection':
                    await handleCollection(interaction);
                    break;
                case 'fullCollection':
                    await handleFullCollection(interaction);
                    break;
                default:
                    await interaction.reply({
                        content: '❌ Unknown action.',
                        ephemeral: true
                    });
            }
        } catch (error) {
            console.error(`Button interaction error:`, error);
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: '⚠️ Something went wrong with that action.',
                        ephemeral: true
                    });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    }
};

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

async function handleHuntAgain(interaction) {
    try {
        const userId = interaction.user.id;
        const cooldownEnd = await DatabaseManager.getCooldown(userId, 'pull');
        
        if (cooldownEnd && Date.now() < cooldownEnd) {
            const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
            return await interaction.reply({
                content: `⏰ Your crew is still recovering from the last hunt! Wait **${timeLeft}** more seconds before searching for another Devil Fruit.`,
                ephemeral: true
            });
        }

        await DatabaseManager.setCooldown(interaction.user.id, 'pull', Date.now() + 5000);
        
        const userData = await DatabaseManager.getUser(interaction.user.id);
        const userLevel = userData ? userData.level : 0;
        
        await createUltimateCinematicExperience(interaction, userLevel);
        
    } catch (error) {
        console.error('Hunt again error:', error);
        await interaction.reply({
            content: '⚠️ Something went wrong during your Devil Fruit hunt! Please try again.',
            ephemeral: true
        });
    }
}

async function handleCollection(interaction) {
    try {
        const userId = interaction.user.id;
        const collection = await DatabaseManager.getUserCollection(userId);
        
        if (!collection || collection.length === 0) {
            return await interaction.reply({
                content: '🍈 Your Devil Fruit collection is empty! Use `/pull` to start hunting for Devil Fruits.',
                ephemeral: true
            });
        }

        const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
        collection.sort((a, b) => {
            const rarityA = rarityOrder.indexOf(a.rarity);
            const rarityB = rarityOrder.indexOf(b.rarity);
            if (rarityA !== rarityB) {
                return rarityA - rarityB;
            }
            return a.name.localeCompare(b.name);
        });

        const embed = new EmbedBuilder()
            .setTitle('🍈 Your Devil Fruit Collection')
            .setColor(0x00FF00)
            .setDescription(`**Total Unique Fruits:** ${collection.length}/150\n\n`);

        const rarityGroups = {};
        collection.forEach(fruit => {
            if (!rarityGroups[fruit.rarity]) {
                rarityGroups[fruit.rarity] = [];
            }
            const duplicateText = fruit.duplicates > 0 ? ` (x${fruit.duplicates + 1})` : '';
            rarityGroups[fruit.rarity].push(`${fruit.name}${duplicateText}`);
        });

        rarityOrder.forEach(rarity => {
            if (rarityGroups[rarity] && rarityGroups[rarity].length > 0) {
                const rarityEmoji = rarityColors[rarity]?.emoji || '❓';
                embed.addFields({
                    name: `${rarityEmoji} ${rarity.toUpperCase()} (${rarityGroups[rarity].length})`,
                    value: rarityGroups[rarity].join(', '),
                    inline: false
                });
            }
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        
    } catch (error) {
        console.error('Collection error:', error);
        await interaction.reply({
            content: '⚠️ Something went wrong while fetching your collection.',
            ephemeral: true
        });
    }
}

async function handleFullCollection(interaction) {
    try {
        const userId = interaction.user.id;
        const collection = await DatabaseManager.getUserCollection(userId);
        
        if (!collection || collection.length === 0) {
            return await interaction.reply({
                content: '🍈 Your Devil Fruit collection is empty! Use `/pull` to start hunting for Devil Fruits.',
                ephemeral: true
            });
        }

        const rarityOrder = ['omnipotent', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
        const rarityGroups = {};
        
        collection.forEach(fruit => {
            if (!rarityGroups[fruit.rarity]) {
                rarityGroups[fruit.rarity] = [];
            }
            const duplicateText = fruit.duplicates > 0 ? ` (x${fruit.duplicates + 1})` : '';
            const cpText = fruit.combat_power ? ` [${fruit.combat_power} CP]` : '';
            rarityGroups[fruit.rarity].push(`${fruit.name}${duplicateText}${cpText}`);
        });

        let response = `🍈 **Your Complete Devil Fruit Collection** (${collection.length}/150)\n\n`;
        
        rarityOrder.forEach(rarity => {
            if (rarityGroups[rarity] && rarityGroups[rarity].length > 0) {
                const rarityEmoji = rarityColors[rarity]?.emoji || '❓';
                response += `${rarityEmoji} **${rarity.toUpperCase()}** (${rarityGroups[rarity].length})\n`;
                response += rarityGroups[rarity].join('\n') + '\n\n';
            }
        });

        const maxLength = 2000;
        if (response.length > maxLength) {
            const chunks = [];
            let currentChunk = '';
            const lines = response.split('\n');
            
            for (const line of lines) {
                if (currentChunk.length + line.length > maxLength) {
                    chunks.push(currentChunk);
                    currentChunk = line + '\n';
                } else {
                    currentChunk += line + '\n';
                }
            }
            if (currentChunk) chunks.push(currentChunk);
            
            await interaction.reply({ content: chunks[0], ephemeral: true });
            for (let i = 1; i < chunks.length; i++) {
                await interaction.followUp({ content: chunks[i], ephemeral: true });
            }
        } else {
            await interaction.reply({ content: response, ephemeral: true });
        }
        
    } catch (error) {
        console.error('Full collection error:', error);
        await interaction.reply({
            content: '⚠️ Something went wrong while fetching your full collection.',
            ephemeral: true
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
