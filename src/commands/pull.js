const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// For now, mock the animation function until the files are created
async function createUltimateCinematicExperience(interaction) {
    // Mock response until animation files are created
    const mockResult = {
        devilFruit: {
            id: 'mock1',
            name: 'Gomu Gomu no Mi',
            type: 'Paramecia',
            user: 'Monkey D. Luffy',
            power: 'Rubber Body',
            powerLevel: 850,
            description: 'Turns the user into a rubber human.'
        },
        rarity: 'legendary',
        user: interaction.user
    };

    const embed = new EmbedBuilder()
        .setTitle('🍈 **DEVIL FRUIT MASTERY ACHIEVED!** 🍈')
        .setDescription(`
🎉 **LEGENDARY CLASS DISCOVERED!**

**🍈 Devil Fruit:** ${mockResult.devilFruit.name}
**📋 Type:** ${mockResult.devilFruit.type}
**👤 User:** ${mockResult.devilFruit.user}
**⚡ Power:** ${mockResult.devilFruit.power}
**💎 Class:** Legendary
**🌟 Level:** ${mockResult.devilFruit.powerLevel}

*${mockResult.devilFruit.description}*

**Note:** This is a mock result until animation files are created!
        `)
        .setColor('#FFD700')
        .setFooter({ text: 'Mock Devil Fruit System | Animation files needed' });

    const components = [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hunt_again')
                    .setLabel('🍈 Hunt Again!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.editReply({ embeds: [embed], components });
    return mockResult;
}

// User cooldowns and statistics
const userCooldowns = new Map();
const userStats = new Map();

// Cooldown times (in milliseconds)
const COOLDOWNS = {
    single: 5000,    // 5 seconds
    multi: 30000,    // 30 seconds
    premium: 60000   // 60 seconds
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Hunt for Devil Fruits in the Grand Line!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose your hunt type')
                .setRequired(false)
                .addChoices(
                    { name: '🍈 Single Hunt (5s cooldown)', value: 'single' },
                    { name: '🍈x10 Multi Hunt (30s cooldown)', value: 'multi' },
                    { name: '💎 Premium Hunt (60s cooldown, better rates)', value: 'premium' }
                )),

    async execute(interaction) {
        try {
            const huntType = interaction.options.getString('type') || 'single';
            const userId = interaction.user.id;
            const userName = interaction.user.username;

            // Check cooldowns
            const now = Date.now();
            const cooldownKey = `${userId}_${huntType}`;
            
            if (userCooldowns.has(cooldownKey)) {
                const cooldownEnd = userCooldowns.get(cooldownKey);
                if (now < cooldownEnd) {
                    const timeLeft = Math.ceil((cooldownEnd - now) / 1000);
                    return await interaction.reply({
                        content: `⏰ **Cooldown Active!** Wait **${timeLeft}s** before your next ${huntType} hunt!`,
                        ephemeral: true
                    });
                }
            }

            // Set cooldown
            userCooldowns.set(cooldownKey, now + COOLDOWNS[huntType]);

            // Initialize user stats if needed
            if (!userStats.has(userId)) {
                userStats.set(userId, {
                    totalHunts: 0,
                    devilFruits: {},
                    rarityCount: { common: 0, uncommon: 0, rare: 0, legendary: 0, mythical: 0, omnipotent: 0 }
                });
            }

            const stats = userStats.get(userId);
            stats.totalHunts++;

            console.log(`🎮 ${userName} initiated ${huntType} Devil Fruit hunt`);

            // Handle different hunt types
            switch (huntType) {
                case 'single':
                    await handleSingleHunt(interaction);
                    break;
                case 'multi':
                    await handleMultiHunt(interaction);
                    break;
                case 'premium':
                    await handlePremiumHunt(interaction);
                    break;
                default:
                    await handleSingleHunt(interaction);
            }

        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ Hunt Failed!')
                .setDescription('The Grand Line\'s mysteries proved too powerful! Try again when the seas calm.')
                .setColor('#FF4500')
                .setFooter({ text: 'Devil Fruit Hunt System | Please try again' });
            
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    }
};

// Single hunt with full cinematic experience
async function handleSingleHunt(interaction) {
    try {
        // Defer reply for long animation
        await interaction.deferReply();

        // Start the ultimate cinematic experience
        const result = await createUltimateCinematicExperience(interaction);

        // Update user statistics
        const userId = interaction.user.id;
        const stats = userStats.get(userId);
        if (stats && result) {
            stats.rarityCount[result.rarity]++;
            if (!stats.devilFruits[result.devilFruit.id]) {
                stats.devilFruits[result.devilFruit.id] = {
                    ...result.devilFruit,
                    obtainedAt: new Date(),
                    timesObtained: 1
                };
            } else {
                stats.devilFruits[result.devilFruit.id].timesObtained++;
            }
        }

        console.log(`🎊 Single hunt success: ${result.devilFruit.name} (${result.rarity}) for ${interaction.user.username}`);

    } catch (error) {
        console.error('Single hunt error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Sea Monsters Interfered!')
            .setDescription('Your Devil Fruit hunt was disrupted by powerful sea creatures! The Grand Line\'s treasures remain hidden for now.')
            .setColor('#FF4500')
            .setFooter({ text: 'Try again when the waters are calmer...' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

// Multi hunt (10x pulls with summary)
async function handleMultiHunt(interaction) {
    try {
        await interaction.deferReply();

        // Mock multi hunt
        const mockEmbed = new EmbedBuilder()
            .setTitle('🍈x10 **MULTI HUNT SYSTEM LOADING** 🍈x10')
            .setDescription('🚧 Multi Hunt is currently being implemented!\n\n**Note:** Animation files need to be created first.')
            .setColor('#3498DB')
            .setFooter({ text: 'Multi Hunt System | Under Development' });

        await interaction.editReply({ embeds: [mockEmbed] });

        console.log(`🎊 Multi hunt placeholder for ${interaction.user.username}`);

    } catch (error) {
        console.error('Multi hunt error:', error);
        throw error;
    }
}

// Premium hunt with enhanced rates
async function handlePremiumHunt(interaction) {
    try {
        await interaction.deferReply();

        // Mock premium hunt
        const mockEmbed = new EmbedBuilder()
            .setTitle('💎 **PREMIUM HUNT SYSTEM LOADING** 💎')
            .setDescription('🚧 Premium Hunt is currently being implemented!\n\n**Note:** Animation files need to be created first.')
            .setColor('#FFD700')
            .setFooter({ text: 'Premium Hunt System | Under Development' });

        await interaction.editReply({ embeds: [mockEmbed] });

        console.log(`🎊 Premium hunt placeholder for ${interaction.user.username}`);

    } catch (error) {
        console.error('Premium hunt error:', error);
        throw error;
    }
}
