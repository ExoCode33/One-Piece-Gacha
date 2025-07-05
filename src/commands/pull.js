const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { performPull, getAnimationSequence, isDebugMode } = require('../animations/engine');
const dbManager = require('../database/manager'); // Fixed import path

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🏴‍☠️ Hunt for Devil Fruits on the Grand Line!')
        .addBooleanOption(option =>
            option.setName('skip-animation')
                .setDescription('Skip the hunting animation')
                .setRequired(false)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const skipAnimation = interaction.options.getBoolean('skip-animation') || false;

        try {
            // Ensure user exists in database
            await dbManager.ensureUser(userId, username);

            // Check for cooldown (optional - can be disabled during debug)
            const cooldownTime = await dbManager.getCooldown(userId, 'pull');
            const now = Date.now();
            
            if (cooldownTime && now < cooldownTime && !isDebugMode()) {
                const timeLeft = Math.ceil((cooldownTime - now) / 1000);
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                const cooldownEmbed = new EmbedBuilder()
                    .setColor('#FF6B6B')
                    .setTitle('⏰ Still Resting!')
                    .setDescription(`You need to wait **${minutes}m ${seconds}s** before hunting again!`)
                    .setFooter({ text: 'The Grand Line is dangerous - rest is important!' });
                
                return await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            // Set cooldown (5 minutes = 300000ms)
            if (!isDebugMode()) {
                await dbManager.setCooldown(userId, 'pull', now + 300000);
            }

            // Perform the pull
            const result = await performPull();
            
            if (skipAnimation) {
                // Skip animation - show final result immediately
                const finalEmbed = await createFinalEmbed(result, userId);
                const buttons = createActionButtons();
                
                // Save to database
                const savedResult = await dbManager.saveUserFruit(userId, result);
                
                // Add duplicate info to embed if applicable
                if (savedResult.duplicateCount > 0) {
                    finalEmbed.addFields({
                        name: '🔄 Duplicate Found!',
                        value: `You already had **${savedResult.duplicateCount}** of these fruits!\n+${savedResult.duplicateCount}% Combat Power bonus!`,
                        inline: false
                    });
                }
                
                return await interaction.reply({ embeds: [finalEmbed], components: [buttons] });
            }

            // Show animated sequence
            const animationSequence = getAnimationSequence();
            let currentEmbed = createAnimationEmbed(animationSequence[0]);
            
            // Initial reply
            await interaction.reply({ embeds: [currentEmbed] });

            // Animation sequence
            for (let i = 1; i < animationSequence.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                currentEmbed = createAnimationEmbed(animationSequence[i]);
                await interaction.editReply({ embeds: [currentEmbed] });
            }

            // Final result
            await new Promise(resolve => setTimeout(resolve, 2000));
            const finalEmbed = await createFinalEmbed(result, userId);
            const buttons = createActionButtons();
            
            // Save to database
            const savedResult = await dbManager.saveUserFruit(userId, result);
            
            // Add duplicate info to embed if applicable
            if (savedResult.duplicateCount > 0) {
                finalEmbed.addFields({
                    name: '🔄 Duplicate Found!',
                    value: `You already had **${savedResult.duplicateCount}** of these fruits!\n+${savedResult.duplicateCount}% Combat Power bonus!`,
                    inline: false
                });
            }
            
            await interaction.editReply({ embeds: [finalEmbed], components: [buttons] });

        } catch (error) {
            console.error('❌ Pull command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Hunt Failed!')
                .setDescription('Something went wrong during your hunt. Please try again!')
                .setFooter({ text: 'The Grand Line can be unpredictable...' });
            
            if (interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], components: [] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};

function createAnimationEmbed(animationData) {
    return new EmbedBuilder()
        .setColor(animationData.color)
        .setTitle(animationData.title)
        .setDescription(animationData.description)
        .setFooter({ text: animationData.footer || 'Hunting on the Grand Line...' });
}

async function createFinalEmbed(fruit, userId) {
    const rarityColors = {
        'Common': '#95A5A6',
        'Uncommon': '#3498DB',
        'Rare': '#9B59B6',
        'Epic': '#E74C3C',
        'Legendary': '#F39C12',
        'Mythical': '#E91E63'
    };

    const rarityEmojis = {
        'Common': '⚪',
        'Uncommon': '🔵',
        'Rare': '🟣',
        'Epic': '🔴',
        'Legendary': '🟡',
        'Mythical': '🌟'
    };

    // Get user stats
    const userStats = await dbManager.updateUserStats(userId);
    
    const embed = new EmbedBuilder()
        .setColor(rarityColors[fruit.rarity])
        .setTitle(`${rarityEmojis[fruit.rarity]} ${fruit.name}`)
        .setDescription(`**${fruit.type}**\n*${fruit.rarity} Rarity*`)
        .addFields(
            { name: '⚡ Power', value: fruit.power, inline: true },
            { name: '👤 Previous User', value: fruit.previousUser || 'Unknown', inline: true },
            { name: '🎯 Total Hunts', value: userStats.totalHunts.toString(), inline: true },
            { name: '📖 Description', value: fruit.description, inline: false }
        )
        .setFooter({ text: `Discovery Rate: ${userStats.discoveryRate}% | Unique Fruits: ${userStats.uniqueFruits}` })
        .setTimestamp();

    if (fruit.awakening) {
        embed.addFields({ name: '🌟 Awakening', value: fruit.awakening, inline: false });
    }

    if (fruit.weakness) {
        embed.addFields({ name: '⚠️ Weakness', value: fruit.weakness, inline: false });
    }

    return embed;
}

function createActionButtons() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('hunt_again')
                .setLabel('🏴‍☠️ Hunt Again')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('view_collection')
                .setLabel('📚 View Collection')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('full_collection')
                .setLabel('📋 Full Collection')
                .setStyle(ButtonStyle.Success)
        );
}

// Button interaction handler
async function handleButtonInteraction(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    try {
        await dbManager.ensureUser(userId, username);

        switch (interaction.customId) {
            case 'hunt_again':
                // Check cooldown
                const cooldownTime = await dbManager.getCooldown(userId, 'pull');
                const now = Date.now();
                
                if (cooldownTime && now < cooldownTime && !isDebugMode()) {
                    const timeLeft = Math.ceil((cooldownTime - now) / 1000);
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    
                    return await interaction.reply({
                        content: `⏰ Please wait **${minutes}m ${seconds}s** before hunting again!`,
                        ephemeral: true
                    });
                }

                // Set new cooldown
                if (!isDebugMode()) {
                    await dbManager.setCooldown(userId, 'pull', now + 300000);
                }

                // Perform new pull
                const result = await performPull();
                const finalEmbed = await createFinalEmbed(result, userId);
                const buttons = createActionButtons();
                
                // Save to database
                const savedResult = await dbManager.saveUserFruit(userId, result);
                
                // Add duplicate info if applicable
                if (savedResult.duplicateCount > 0) {
                    finalEmbed.addFields({
                        name: '🔄 Duplicate Found!',
                        value: `You already had **${savedResult.duplicateCount}** of these fruits!\n+${savedResult.duplicateCount}% Combat Power bonus!`,
                        inline: false
                    });
                }
                
                await interaction.reply({ embeds: [finalEmbed], components: [buttons] });
                break;

            case 'view_collection':
                await showUserCollection(interaction, userId, false);
                break;

            case 'full_collection':
                await showUserCollection(interaction, userId, true);
                break;
        }
    } catch (error) {
        console.error('❌ Button interaction error:', error);
        await interaction.reply({
            content: '❌ Something went wrong! Please try again.',
            ephemeral: true
        });
    }
}

async function showUserCollection(interaction, userId, showFull = false) {
    try {
        const fruits = await dbManager.getUserFruitsWithDuplicates(userId);
        const rarityStats = await dbManager.getUserRarityStats(userId);
        const typeStats = await dbManager.getUserTypeStats(userId);

        if (fruits.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor('#95A5A6')
                .setTitle('📚 Your Collection')
                .setDescription('Your collection is empty! Use `/pull` to start hunting for Devil Fruits!')
                .setFooter({ text: 'The Grand Line awaits...' });
            
            return await interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
        }

        const uniqueFruits = [...new Set(fruits.map(f => f.fruit_id))];
        const totalFruits = fruits.length;

        let description = `**Total Fruits:** ${totalFruits}\n**Unique Fruits:** ${uniqueFruits.length}\n\n`;

        // Add rarity breakdown
        if (Object.keys(rarityStats).length > 0) {
            description += '**Rarity Breakdown:**\n';
            Object.entries(rarityStats).forEach(([rarity, count]) => {
                const emoji = {
                    'Common': '⚪',
                    'Uncommon': '🔵',
                    'Rare': '🟣',
                    'Epic': '🔴',
                    'Legendary': '🟡',
                    'Mythical': '🌟'
                }[rarity] || '❓';
                description += `${emoji} ${rarity}: ${count}\n`;
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('📚 Your Devil Fruit Collection')
            .setDescription(description)
            .setFooter({ text: `Discovery Rate: ${Math.round((uniqueFruits.length / totalFruits) * 100)}%` })
            .setTimestamp();

        if (showFull) {
            // Show detailed list (limited to prevent embed size issues)
            const recentFruits = fruits.slice(0, 10);
            let fruitList = '';
            
            recentFruits.forEach((fruit, index) => {
                const duplicateText = fruit.total_duplicates > 1 ? ` (x${fruit.total_duplicates})` : '';
                fruitList += `${index + 1}. **${fruit.name}** - ${fruit.rarity}${duplicateText}\n`;
            });

            if (fruits.length > 10) {
                fruitList += `\n*...and ${fruits.length - 10} more fruits*`;
            }

            embed.addFields({ name: '🎯 Recent Fruits', value: fruitList, inline: false });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('❌ Collection display error:', error);
        await interaction.reply({
            content: '❌ Failed to load your collection. Please try again!',
            ephemeral: true
        });
    }
}

module.exports.handleButtonInteraction = handleButtonInteraction;
