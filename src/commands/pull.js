const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { performPull, getAnimationSequence } = require('../animations/engine');
const { saveUserFruit, getUserFruits, checkForDuplicates } = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('🍈 Hunt for Devil Fruits in the Grand Line!')
        .addBooleanOption(option =>
            option.setName('skip-animation')
                .setDescription('Skip the animation and show results immediately')
                .setRequired(false)
        ),

    async execute(interaction) {
        const skipAnimation = interaction.options.getBoolean('skip-animation') || false;
        
        try {
            if (skipAnimation) {
                await handleInstantPull(interaction);
            } else {
                await handleAnimatedPull(interaction);
            }
        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            await interaction.reply({ 
                content: '❌ **Pull failed!**\n\nSomething went wrong while hunting for Devil Fruits. Please try again!', 
                ephemeral: true 
            });
        }
    }
};

async function handleInstantPull(interaction) {
    const pullResult = performPull();
    
    const duplicateInfo = await checkForDuplicates(interaction.user.id, pullResult.fruit.name);
    
    await saveUserFruit(interaction.user.id, pullResult.fruit, duplicateInfo.duplicateCount);
    
    const finalEmbed = createFinalEmbed(pullResult, duplicateInfo);
    const buttonRow = createButtonRow(pullResult.fruit.name);
    
    await interaction.reply({ 
        embeds: [finalEmbed], 
        components: [buttonRow] 
    });
}

async function handleAnimatedPull(interaction) {
    const pullResult = performPull();
    const animationSequence = getAnimationSequence(pullResult.rarity);
    
    await interaction.reply({ 
        embeds: [animationSequence.searching], 
        fetchReply: true 
    });
    
    setTimeout(async () => {
        try {
            await interaction.editReply({ embeds: [animationSequence.hunting] });
        } catch (error) {
            console.error('Animation error (hunting):', error);
        }
    }, 2000);
    
    setTimeout(async () => {
        try {
            await interaction.editReply({ embeds: [animationSequence.discovery] });
        } catch (error) {
            console.error('Animation error (discovery):', error);
        }
    }, 4000);
    
    setTimeout(async () => {
        try {
            const duplicateInfo = await checkForDuplicates(interaction.user.id, pullResult.fruit.name);
            await saveUserFruit(interaction.user.id, pullResult.fruit, duplicateInfo.duplicateCount);
            
            const finalEmbed = createFinalEmbed(pullResult, duplicateInfo);
            const buttonRow = createButtonRow(pullResult.fruit.name);
            
            await interaction.editReply({ 
                embeds: [finalEmbed], 
                components: [buttonRow] 
            });
        } catch (error) {
            console.error('Animation error (final):', error);
        }
    }, 6000);
}

function createFinalEmbed(pullResult, duplicateInfo) {
    const rarityColors = {
        common: '#8B4513',
        uncommon: '#228B22', 
        rare: '#4169E1',
        legendary: '#FFD700',
        mythical: '#FF0000',
        omnipotent: '#9932CC'
    };
    
    const rarityEmojis = {
        common: '🟫',
        uncommon: '🟩',
        rare: '🟦', 
        legendary: '🟨',
        mythical: '🟥',
        omnipotent: '🌈'
    };
    
    const embed = new EmbedBuilder()
        .setTitle(`${rarityEmojis[pullResult.rarity]} **${pullResult.fruit.name}**`)
        .setDescription(`*${pullResult.fruit.description}*\n\n**🏴‍☠️ Power:** ${pullResult.fruit.power}\n**⚔️ Combat Power:** ${pullResult.fruit.cp.toLocaleString()} CP`)
        .setColor(rarityColors[pullResult.rarity])
        .setImage(pullResult.fruit.image)
        .setFooter({ text: `Rarity: ${pullResult.rarity.toUpperCase()} | Grand Line Devil Fruit Hunter` });
    
    if (duplicateInfo.isDuplicate) {
        embed.addFields({
            name: '🔄 **Duplicate Found!**',
            value: `You already have this fruit! **+${duplicateInfo.cpBonus} CP** bonus applied.\n**New Total CP:** ${pullResult.fruit.cp + duplicateInfo.cpBonus} CP`,
            inline: false
        });
    }
    
    return embed;
}

function createButtonRow(fruitName) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`hunt_again_${Date.now()}`)
                .setLabel('🍈 Hunt Again')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`view_collection_${Date.now()}`)
                .setLabel('📦 View Collection')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`view_full_collection_${Date.now()}`)
                .setLabel('📋 Full Collection')
                .setStyle(ButtonStyle.Secondary)
        );
}

async function handleButtonInteraction(interaction) {
    const customId = interaction.customId;
    
    if (customId.startsWith('hunt_again_')) {
        await handleHuntAgain(interaction);
    } else if (customId.startsWith('view_collection_')) {
        await handleCollection(interaction);
    } else if (customId.startsWith('view_full_collection_')) {
        await handleFullCollection(interaction);
    }
}

async function handleHuntAgain(interaction) {
    await interaction.deferUpdate();
    
    const pullResult = performPull();
    const animationSequence = getAnimationSequence(pullResult.rarity);
    
    await interaction.editReply({ 
        embeds: [animationSequence.searching], 
        components: [] 
    });
    
    setTimeout(async () => {
        try {
            await interaction.editReply({ embeds: [animationSequence.hunting] });
        } catch (error) {
            console.error('Hunt again animation error (hunting):', error);
        }
    }, 2000);
    
    setTimeout(async () => {
        try {
            await interaction.editReply({ embeds: [animationSequence.discovery] });
        } catch (error) {
            console.error('Hunt again animation error (discovery):', error);
        }
    }, 4000);
    
    setTimeout(async () => {
        try {
            const duplicateInfo = await checkForDuplicates(interaction.user.id, pullResult.fruit.name);
            await saveUserFruit(interaction.user.id, pullResult.fruit, duplicateInfo.duplicateCount);
            
            const finalEmbed = createFinalEmbed(pullResult, duplicateInfo);
            const buttonRow = createButtonRow(pullResult.fruit.name);
            
            await interaction.editReply({ 
                embeds: [finalEmbed], 
                components: [buttonRow] 
            });
        } catch (error) {
            console.error('Hunt again animation error (final):', error);
        }
    }, 6000);
}

async function handleCollection(interaction) {
    try {
        const userFruits = await getUserFruits(interaction.user.id, 5);
        
        if (userFruits.length === 0) {
            await interaction.reply({ 
                content: '📦 **Your collection is empty!**\n\nUse `/pull` to start hunting for Devil Fruits!', 
                ephemeral: true 
            });
            return;
        }
        
        const embed = new EmbedBuilder()
            .setTitle('📦 **Your Recent Devil Fruits**')
            .setDescription('*Your 5 most recent Devil Fruit discoveries*')
            .setColor('#4169E1')
            .setFooter({ text: `Total Fruits: ${userFruits.length} | Use 'Full Collection' for complete list` });
        
        const rarityEmojis = {
            common: '🟫',
            uncommon: '🟩',
            rare: '🟦',
            legendary: '🟨', 
            mythical: '🟥',
            omnipotent: '🌈'
        };
        
        userFruits.forEach((fruit, index) => {
            const rarityEmoji = rarityEmojis[fruit.rarity] || '❓';
            embed.addFields({
                name: `${rarityEmoji} **${fruit.fruit_name}**`,
                value: `**CP:** ${fruit.cp.toLocaleString()} | **Rarity:** ${fruit.rarity.toUpperCase()}`,
                inline: true
            });
        });
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        
    } catch (error) {
        console.error('Collection view error:', error);
        await interaction.reply({ 
            content: '❌ **Collection view failed!**\n\nCould not retrieve your Devil Fruit collection. Please try again!', 
            ephemeral: true 
        });
    }
}

async function handleFullCollection(interaction) {
    try {
        const userFruits = await getUserFruits(interaction.user.id);
        
        if (userFruits.length === 0) {
            await interaction.reply({ 
                content: '📋 **Your collection is empty!**\n\nUse `/pull` to start hunting for Devil Fruits!', 
                ephemeral: true 
            });
            return;
        }
        
        const rarityEmojis = {
            common: '🟫',
            uncommon: '🟩',
            rare: '🟦',
            legendary: '🟨',
            mythical: '🟥',
            omnipotent: '🌈'
        };
        
        const groupedFruits = userFruits.reduce((acc, fruit) => {
            const key = fruit.fruit_name;
            if (!acc[key]) {
                acc[key] = {
                    ...fruit,
                    count: 0,
                    totalCp: 0
                };
            }
            acc[key].count++;
            acc[key].totalCp += fruit.cp;
            return acc;
        }, {});
        
        const uniqueFruits = Object.values(groupedFruits);
        const totalCp = uniqueFruits.reduce((sum, fruit) => sum + fruit.totalCp, 0);
        
        const embed = new EmbedBuilder()
            .setTitle('📋 **Complete Devil Fruit Collection**')
            .setDescription(`*Your complete Devil Fruit arsenal*\n\n**🏆 Total CP:** ${totalCp.toLocaleString()}\n**📊 Unique Fruits:** ${uniqueFruits.length}\n**🔢 Total Fruits:** ${userFruits.length}`)
            .setColor('#9932CC')
            .setFooter({ text: 'Grand Line Devil Fruit Hunter | Complete Collection' });
        
        let description = '';
        uniqueFruits.forEach((fruit) => {
            const rarityEmoji = rarityEmojis[fruit.rarity] || '❓';
            const countText = fruit.count > 1 ? ` **(x${fruit.count})**` : '';
            description += `${rarityEmoji} **${fruit.fruit_name}**${countText} - ${fruit.totalCp.toLocaleString()} CP\n`;
        });
        
        if (description.length > 4000) {
            description = description.substring(0, 4000) + '...\n*Collection too large to display fully*';
        }
        
        embed.addFields({
            name: '🏴‍☠️ **Your Devil Fruits**',
            value: description,
            inline: false
        });
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        
    } catch (error) {
        console.error('Full collection view error:', error);
        await interaction.reply({ 
            content: '❌ **Full collection view failed!**\n\nCould not retrieve your complete Devil Fruit collection. Please try again!', 
            ephemeral: true 
        });
    }
}

module.exports.handleButtonInteraction = handleButtonInteraction;
