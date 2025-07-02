const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createGachaAnimation } = require('../animations/gacha');
const { getCharacterDetails, GachaMechanics } = require('../data/examples');

// User session management (in production, use a database)
const userSessions = new Map();

// Cooldown system (in production, use a database)
const userCooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull a One Piece character from the gacha!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of pull to perform')
                .setRequired(false)
                .addChoices(
                    { name: '🏴‍☠️ Single Pull', value: 'single' },
                    { name: '⚓ Multi Pull (10x)', value: 'multi' },
                    { name: '🌟 Premium Pull', value: 'premium' }
                )),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const pullType = interaction.options.getString('type') || 'single';
        
        // Check cooldown
        if (userCooldowns.has(userId)) {
            const cooldownEnd = userCooldowns.get(userId);
            const now = Date.now();
            
            if (now < cooldownEnd) {
                const timeLeft = Math.ceil((cooldownEnd - now) / 1000);
                
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('⏰ The Seas Are Calm')
                    .setDescription(`
🌊 The Grand Line needs time to gather its power...

**Time Remaining:** ${timeLeft} seconds

*Use this time to prepare for your next adventure!*
                    `)
                    .setColor('#3498DB')
                    .setFooter({ text: 'Patience brings the greatest treasures!' });
                
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }
        }
        
        // Set cooldown (30 seconds for single, 2 minutes for multi)
        const cooldownTime = pullType === 'multi' ? 120000 : 30000;
        userCooldowns.set(userId, Date.now() + cooldownTime);
        
        // Initialize user session if needed
        if (!userSessions.has(userId)) {
            userSessions.set(userId, {
                totalPulls: 0,
                streak: 0,
                lastRarity: null,
                collection: new Set(),
                berrySpent: 0
            });
        }
        
        const userSession = userSessions.get(userId);
        
        try {
            await interaction.deferReply();
            
            if (pullType === 'multi') {
                await handleMultiPull(interaction, userSession);
            } else if (pullType === 'premium') {
                await handlePremiumPull(interaction, userSession);
            } else {
                await handleSinglePull(interaction, userSession);
            }
            
        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ The Grand Line Rebels!')
                .setDescription(`
The seas are too chaotic right now!

\`\`\`
${error.message}
\`\`\`

*The adventure will continue - please try again!*
                `)
                .setColor('#E74C3C')
                .setFooter({ text: 'Even the greatest pirates face storms!' });
            
            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};

async function handleSinglePull(interaction, userSession) {
    // Update session
    userSession.totalPulls++;
    
    // Run the main animation
    await createGachaAnimation(interaction);
    
    // The animation already handles the final result display
    // We could add post-pull statistics here
    setTimeout(() => {
        updateUserStats(interaction, userSession, 'single');
    }, 5000);
}

async function handleMultiPull(interaction, userSession) {
    const results = [];
    
    // Generate 10 pulls
    for (let i = 0; i < 10; i++) {
        // Simulate getting results (you'd integrate this with your gacha system)
        const mockResult = {
            character: { name: `Character ${i + 1}`, crew: 'Test Crew', bounty: '1,000,000' },
            rarity: 'common' // This would come from your actual gacha logic
        };
        results.push(mockResult);
    }
    
    // Show multi-pull results
    const multiEmbed = createMultiPullEmbed(results, interaction.user);
    const components = createMultiPullComponents();
    
    await interaction.editReply({ 
        embeds: [multiEmbed], 
        components: components 
    });
    
    userSession.totalPulls += 10;
    updateUserStats(interaction, userSession, 'multi');
}

async function handlePremiumPull(interaction, userSession) {
    // Premium pull guarantees at least rare
    const premiumEmbed = new EmbedBuilder()
        .setTitle('✨ Premium Pull Coming Soon! ✨')
        .setDescription(`
🌟 **Premium pulls are being prepared!**

Premium features will include:
• Guaranteed Rare or higher
• Exclusive characters
• Special animations
• Bonus rewards

*Stay tuned for this epic upgrade!*
        `)
        .setColor('#9B59B6')
        .setFooter({ text: 'The most legendary treasures await...' });
    
    await interaction.editReply({ embeds: [premiumEmbed] });
}

function createMultiPullEmbed(results, user) {
    const rarityCount = {};
    let bestPull = null;
    
    results.forEach(result => {
        const rarity = result.rarity;
        rarityCount[rarity] = (rarityCount[rarity] || 0) + 1;
        
        if (!bestPull || getRarityValue(rarity) > getRarityValue(bestPull.rarity)) {
            bestPull = result;
        }
    });
    
    const rarityDisplay = Object.entries(rarityCount)
        .map(([rarity, count]) => `${getRarityEmoji(rarity)} ${rarity}: ${count}`)
        .join('\n');
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ Multi-Pull Results! 🏴‍☠️')
        .setDescription(`
**Best Pull:** ${bestPull.character.name}
**Rarity:** ${bestPull.rarity}

**Summary:**
${rarityDisplay}

*${user.username}, your crew grows stronger!*
        `)
        .setColor('#F39C12')
        .setFooter({ text: '⚓ 10 new crew members join your adventure!' })
        .setTimestamp();
}

function createMultiPullComponents() {
    return [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('view_all_pulls')
                    .setLabel('📋 View All Results')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('pull_again')
                    .setLabel('🔄 Pull Again')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_collection')
                    .setLabel('📚 My Collection')
                    .setStyle(ButtonStyle.Success)
            )
    ];
}

function updateUserStats(interaction, userSession, pullType) {
    // This could send a follow-up message with stats
    // Or update a database with user progress
    // For now, just log the activity
    console.log(`📊 ${interaction.user.username} completed ${pullType} pull. Total: ${userSession.totalPulls}`);
}

function getRarityValue(rarity) {
    const values = {
        common: 1,
        uncommon: 2,
        rare: 3,
        legendary: 4,
        mythical: 5,
        omnipotent: 6
    };
    return values[rarity] || 0;
}

function getRarityEmoji(rarity) {
    const emojis = {
        common: '⚪',
        uncommon: '🟢',
        rare: '🔵',
        legendary: '🟡',
        mythical: '🔴',
        omnipotent: '🌌'
    };
    return emojis[rarity] || '❓';
}

// Button interaction handler (add this to your main bot file)
async function handleButtonInteractions(interaction) {
    if (!interaction.isButton()) return;
    
    const userId = interaction.user.id;
    const userSession = userSessions.get(userId);
    
    try {
        switch (interaction.customId) {
            case 'pull_again':
                // Check cooldown and allow another pull
                if (userCooldowns.has(userId)) {
                    const cooldownEnd = userCooldowns.get(userId);
                    if (Date.now() < cooldownEnd) {
                        await interaction.reply({ 
                            content: '⏰ Please wait before pulling again!', 
                            ephemeral: true 
                        });
                        return;
                    }
                }
                
                await interaction.deferReply();
                await handleSinglePull(interaction, userSession);
                break;
                
            case 'view_crew':
            case 'view_collection':
                const collectionEmbed = new EmbedBuilder()
                    .setTitle('📚 Your Pirate Collection')
                    .setDescription(`
🏴‍☠️ **Captain ${interaction.user.username}'s Crew**

**Total Pulls:** ${userSession?.totalPulls || 0}
**Unique Characters:** ${userSession?.collection?.size || 0}
**Current Streak:** ${userSession?.streak || 0}

*Your collection system is being upgraded!*
*Soon you'll see all your legendary crew members here.*
                    `)
                    .setColor('#3498DB')
                    .setFooter({ text: 'Every great pirate needs a great crew!' });
                
                await interaction.reply({ embeds: [collectionEmbed], ephemeral: true });
                break;
                
            case 'view_all_pulls':
                await interaction.reply({ 
                    content: '📋 Detailed pull history coming soon!', 
                    ephemeral: true 
                });
                break;
        }
    } catch (error) {
        console.error('Button interaction error:', error);
        await interaction.reply({ 
            content: '❌ Something went wrong with that action!', 
            ephemeral: true 
        });
    }
}

// Export button handler for use in main bot file
module.exports.handleButtonInteractions = handleButtonInteractions;

// Self-registration script (if running this file directly)
if (require.main === module) {
    const { REST, Routes } = require('discord.js');
    require('dotenv').config();
    
    const commands = [
        new SlashCommandBuilder()
            .setName('pull')
            .setDescription('Pull a One Piece character from the gacha!')
            .addStringOption(option =>
                option.setName('type')
                    .setDescription('Type of pull to perform')
                    .setRequired(false)
                    .addChoices(
                        { name: '🏴‍☠️ Single Pull', value: 'single' },
                        { name: '⚓ Multi Pull (10x)', value: 'multi' },
                        { name: '🌟 Premium Pull', value: 'premium' }
                    ))
    ];
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    (async () => {
        try {
            console.log('🔄 Registering enhanced slash commands...');
            
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            
            console.log('✅ Successfully registered enhanced slash commands!');
            console.log('🏴‍☠️ The Grand Line awaits your command!');
        } catch (error) {
            console.error('❌ Error registering commands:', error);
        }
    })();
}
