const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Import debug configuration
let debugConfig = null;
try {
    const adminModule = require('./admin');
    debugConfig = adminModule.getDebugConfig;
    console.log('✅ Admin module loaded successfully');
} catch (error) {
    console.log('⚠️ Admin module not found, debug features disabled');
}

// Mock Devil Fruit database (replace with actual database later)
const DEVIL_FRUITS = {
    common: [
        { id: 'df001', name: 'Gomu Gomu no Mi', type: 'Paramecia', user: 'Monkey D. Luffy', power: 'Rubber Body', powerLevel: 850, description: 'Grants rubber properties to the user\'s body.' },
        { id: 'df002', name: 'Chop Chop no Mi', type: 'Paramecia', user: 'Buggy', power: 'Body Separation', powerLevel: 200, description: 'Allows the user to split their body into pieces.' }
    ],
    uncommon: [
        { id: 'df003', name: 'Sube Sube no Mi', type: 'Paramecia', user: 'Alvida', power: 'Smooth Skin', powerLevel: 150, description: 'Makes the user\'s skin smooth and slippery.' },
        { id: 'df004', name: 'Bomu Bomu no Mi', type: 'Paramecia', user: 'Mr. 5', power: 'Explosion', powerLevel: 300, description: 'Allows the user to explode any part of their body.' }
    ],
    rare: [
        { id: 'df005', name: 'Mera Mera no Mi', type: 'Logia', user: 'Portgas D. Ace', power: 'Fire Control', powerLevel: 750, description: 'Grants the ability to create, control, and transform into fire.' },
        { id: 'df006', name: 'Hito Hito no Mi', type: 'Zoan', user: 'Tony Tony Chopper', power: 'Human Form', powerLevel: 400, description: 'Allows animals to transform into human form.' }
    ],
    legendary: [
        { id: 'df007', name: 'Ope Ope no Mi', type: 'Paramecia', user: 'Trafalgar Law', power: 'Spatial Manipulation', powerLevel: 950, description: 'Creates a spherical space where the user can manipulate anything.' },
        { id: 'df008', name: 'Gura Gura no Mi', type: 'Paramecia', user: 'Edward Newgate', power: 'Earthquake', powerLevel: 980, description: 'Grants the power to create earthquakes and tremors.' }
    ],
    mythical: [
        { id: 'df009', name: 'Hito Hito no Mi Model: Nika', type: 'Mythical Zoan', user: 'Monkey D. Luffy', power: 'Sun God', powerLevel: 1000, description: 'Grants the powers of the legendary Sun God Nika.' },
        { id: 'df010', name: 'Yami Yami no Mi', type: 'Logia', user: 'Marshall D. Teach', power: 'Darkness', powerLevel: 999, description: 'Grants the power to control darkness and nullify other Devil Fruit abilities.' }
    ],
    omnipotent: [
        { id: 'df011', name: 'Kami Kami no Mi', type: 'Mythical Paramecia', user: 'Unknown', power: 'Divine Authority', powerLevel: 1500, description: 'Grants god-like powers over reality itself.' }
    ]
};

// Rarity chances (in percentage)
const RARITY_CHANCES = {
    normal: { common: 60, uncommon: 25, rare: 10, legendary: 4, mythical: 0.9, omnipotent: 0.1 },
    premium: { common: 40, uncommon: 30, rare: 20, legendary: 8, mythical: 1.8, omnipotent: 0.2 }
};

// Function to determine rarity based on debug settings
function determineRarity(huntType = 'normal') {
    // Check debug mode first
    if (debugConfig && debugConfig().enabled && debugConfig().forcedRarity) {
        console.log(`🔧 DEBUG: Forcing rarity to ${debugConfig().forcedRarity}`);
        return debugConfig().forcedRarity;
    }

    // Normal random rarity selection
    const chances = RARITY_CHANCES[huntType] || RARITY_CHANCES.normal;
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(chances)) {
        cumulative += chance;
        if (random <= cumulative) {
            return rarity;
        }
    }

    return 'common'; // Fallback
}

// Function to get random devil fruit of specific rarity
function getRandomDevilFruit(rarity) {
    const fruits = DEVIL_FRUITS[rarity];
    if (!fruits || fruits.length === 0) {
        return DEVIL_FRUITS.common[0]; // Fallback
    }
    return fruits[Math.floor(Math.random() * fruits.length)];
}

// Enhanced animation function with debug support
async function createUltimateCinematicExperience(interaction, huntType = 'normal') {
    const isDebugMode = debugConfig && debugConfig().enabled;
    const showAnimations = !isDebugMode || debugConfig().showAnimations;
    
    // Determine rarity (respects debug settings)
    const rarity = determineRarity(huntType);
    const devilFruit = getRandomDevilFruit(rarity);
    
    // Debug logging
    if (isDebugMode) {
        console.log(`🔧 DEBUG MODE ACTIVE:`);
        console.log(`   • Forced Rarity: ${debugConfig().forcedRarity || 'None'}`);
        console.log(`   • Result Rarity: ${rarity}`);
        console.log(`   • Devil Fruit: ${devilFruit.name}`);
        console.log(`   • Hunt Type: ${huntType}`);
        console.log(`   • Show Animations: ${showAnimations}`);
    }

    // Show animation sequence if enabled
    if (showAnimations) {
        await showHuntingAnimation(interaction, isDebugMode);
    }

    // Rarity configuration
    const rarityConfig = {
        common: { emoji: '⬜', color: '#95A5A6', name: 'Common' },
        uncommon: { emoji: '🟩', color: '#27AE60', name: 'Uncommon' },
        rare: { emoji: '🟦', color: '#3498DB', name: 'Rare' },
        legendary: { emoji: '🟨', color: '#F1C40F', name: 'Legendary' },
        mythical: { emoji: '🟥', color: '#E74C3C', name: 'Mythical' },
        omnipotent: { emoji: '🌈', color: '#9B59B6', name: 'Omnipotent' }
    };

    const config = rarityConfig[rarity] || rarityConfig.common;

    // Create the result embed
    const embed = new EmbedBuilder()
        .setTitle(`🍈 **DEVIL FRUIT MASTERY ACHIEVED!** 🍈`)
        .setDescription(`
${config.emoji} **${config.name.toUpperCase()} CLASS DISCOVERED!**

**🍈 Devil Fruit:** ${devilFruit.name}
**📋 Type:** ${devilFruit.type}
**👤 User:** ${devilFruit.user}
**⚡ Power:** ${devilFruit.power}
**💎 Class:** ${config.name}
**🌟 Level:** ${devilFruit.powerLevel}

*${devilFruit.description}*

${isDebugMode ? `
🔧 **DEBUG INFORMATION:**
• **Debug Mode:** ON
• **Forced Rarity:** ${debugConfig().forcedRarity || 'Random'}
• **Hunt Type:** ${huntType}
• **Animations:** ${showAnimations ? 'Enabled' : 'Disabled'}
• **Random Roll:** ${debugConfig().forcedRarity ? 'Overridden' : 'Active'}` : ''}
        `)
        .setColor(config.color)
        .setFooter({ 
            text: isDebugMode ? 'DEBUG MODE ACTIVE | Devil Fruit System' : 'Devil Fruit Hunt System',
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    // Add debug field if in debug mode
    if (isDebugMode) {
        embed.addFields({
            name: '🔧 Debug Status',
            value: `**Enabled:** ${debugConfig().enabled}\n**Forced Rarity:** ${debugConfig().forcedRarity || 'Random'}\n**Hunt Type:** ${huntType}\n**Animations:** ${showAnimations ? 'On' : 'Off'}`,
            inline: true
        });
    }

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
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('share_discovery')
                    .setLabel('📢 Share Discovery')
                    .setStyle(ButtonStyle.Success)
            )
    ];

    // Add debug button if in debug mode
    if (isDebugMode) {
        components[0].addComponents(
            new ButtonBuilder()
                .setCustomId('debug_info')
                .setLabel('🔧 Debug Info')
                .setStyle(ButtonStyle.Danger)
        );
    }

    await interaction.editReply({ embeds: [embed], components });
    
    return {
        devilFruit,
        rarity,
        user: interaction.user,
        debugMode: isDebugMode
    };
}

// Show hunting animation sequence
async function showHuntingAnimation(interaction, isDebugMode = false) {
    const frames = [
        {
            title: '🌊 **ENTERING THE GRAND LINE** 🌊',
            description: `${isDebugMode ? '🔧 DEBUG: ' : ''}Sailing through treacherous waters...`,
            color: '#3498DB'
        },
        {
            title: '🏝️ **MYSTERIOUS ISLAND SPOTTED** 🏝️',
            description: `${isDebugMode ? '🔧 DEBUG: ' : ''}Landing on an uncharted island...`,
            color: '#27AE60'
        },
        {
            title: '🌴 **SEARCHING FOR TREASURES** 🌴',
            description: `${isDebugMode ? '🔧 DEBUG: ' : ''}Exploring the dense jungle...`,
            color: '#F39C12'
        },
        {
            title: '✨ **DEVIL FRUIT ENERGY DETECTED** ✨',
            description: `${isDebugMode ? '🔧 DEBUG: ' : ''}A powerful aura emanates nearby...`,
            color: '#9B59B6'
        },
        {
            title: '🍈 **DEVIL FRUIT DISCOVERED!** 🍈',
            description: `${isDebugMode ? '🔧 DEBUG: ' : ''}Revealing your discovery...`,
            color: '#E74C3C'
        }
    ];

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const embed = new EmbedBuilder()
            .setTitle(frame.title)
            .setDescription(frame.description)
            .setColor(frame.color)
            .setFooter({ 
                text: `Animation ${i + 1}/${frames.length}${isDebugMode ? ' | DEBUG MODE' : ''}` 
            });

        if (i === 0) {
            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({ embeds: [embed] });
        }
        
        // Wait between frames (shorter in debug mode)
        await new Promise(resolve => setTimeout(resolve, isDebugMode ? 800 : 1500));
    }
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
            const isDebugMode = debugConfig && debugConfig().enabled;

            // Debug mode bypasses cooldowns
            if (!isDebugMode) {
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
            }

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

            console.log(`🎮 ${userName} initiated ${huntType} Devil Fruit hunt${isDebugMode ? ' (DEBUG MODE)' : ''}`);

            // Handle different hunt types
            switch (huntType) {
                case 'single':
                    await handleSingleHunt(interaction, 'normal');
                    break;
                case 'multi':
                    await handleMultiHunt(interaction);
                    break;
                case 'premium':
                    await handleSingleHunt(interaction, 'premium');
                    break;
                default:
                    await handleSingleHunt(interaction, 'normal');
            }

        } catch (error) {
        console.error('Button interaction error:', error);
        await interaction.reply({
            content: '❌ Button action failed!',
            ephemeral: true
        });
    }
}

// Show debug information
async function showDebugInfo(interaction) {
    const debugInfo = debugConfig();
    
    const debugEmbed = new EmbedBuilder()
        .setTitle('🔧 **DEBUG INFORMATION**')
        .setDescription(`
**Current Debug Settings:**
• **Mode:** ${debugInfo.enabled ? 'Enabled' : 'Disabled'}
• **Forced Rarity:** ${debugInfo.forcedRarity || 'Random'}
• **Animations:** ${debugInfo.showAnimations ? 'Enabled' : 'Disabled'}
• **Admin User:** ${debugInfo.adminUserId ? `<@${debugInfo.adminUserId}>` : 'None'}

**System Status:**
• **Total Rarities:** ${Object.keys(DEVIL_FRUITS).length}
• **Total Fruits:** ${Object.values(DEVIL_FRUITS).flat().length}
• **Animation Frames:** 5
• **Cooldown Bypass:** Active

**Next Actions:**
• Use \`/pull\` to test with current settings
• Use \`/admin debug\` to change settings
• Use \`/admin reset\` to disable debug mode
        `)
        .setColor('#FF6B6B')
        .setFooter({ text: 'Debug Information | Admin Only' })
        .setTimestamp();

    await interaction.reply({ embeds: [debugEmbed], ephemeral: true });
}

// Show user's Devil Fruit collection
async function showUserCollection(interaction) {
    const userId = interaction.user.id;
    const stats = userStats.get(userId);
    const isDebugMode = debugConfig && debugConfig().enabled;

    if (!stats || Object.keys(stats.devilFruits).length === 0) {
        const emptyEmbed = new EmbedBuilder()
            .setTitle('📚 **Your Devil Fruit Collection**')
            .setDescription(`🍈 Your collection is empty! Start hunting to collect Devil Fruits!

${isDebugMode ? `
🔧 **DEBUG MODE ACTIVE:**
• Debug features enabled
• Forced Rarity: ${debugConfig().forcedRarity || 'Random'}
• Perfect for testing!
• Cooldowns bypassed` : ''}`)
            .setColor('#95A5A6')
            .setFooter({ text: isDebugMode ? 'DEBUG MODE | Use /pull to start testing!' : 'Use /pull to start your Devil Fruit journey!' });

        return await interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
    }

    // Collection summary
    const totalFruits = Object.keys(stats.devilFruits).length;
    const totalHunts = stats.totalHunts;
    
    let rarityBreakdown = '';
    Object.keys(stats.rarityCount).reverse().forEach(rarity => {
        if (stats.rarityCount[rarity] > 0) {
            const rarityNames = {
                omnipotent: { emoji: '🌈', name: 'Omnipotent' },
                mythical: { emoji: '🟥', name: 'Mythical' },
                legendary: { emoji: '🟨', name: 'Legendary' },
                rare: { emoji: '🟦', name: 'Rare' },
                uncommon: { emoji: '🟩', name: 'Uncommon' },
                common: { emoji: '⬜', name: 'Common' }
            };
            const config = rarityNames[rarity] || { emoji: '❓', name: rarity };
            rarityBreakdown += `${config.emoji} **${config.name}:** ${stats.rarityCount[rarity]}x\n`;
        }
    });

    const collectionEmbed = new EmbedBuilder()
        .setTitle(`📚 **${interaction.user.username}'s Devil Fruit Collection**`)
        .setDescription(`
🏴‍☠️ **Collection Stats:**
🍈 **Unique Fruits:** ${totalFruits}
🎯 **Total Hunts:** ${totalHunts}
📊 **Success Rate:** ${Math.round((totalFruits / totalHunts) * 100)}%

**🌟 Rarity Breakdown:**
${rarityBreakdown || 'No fruits collected yet!'}

${isDebugMode ? `
🔧 **DEBUG STATUS:**
• Debug Mode: ON
• Forced Rarity: ${debugConfig().forcedRarity || 'Random'}
• Cooldowns: Bypassed
• Animations: ${debugConfig().showAnimations ? 'On' : 'Off'}` : ''}

*Use buttons below to explore your collection!*
        `)
        .setColor('#3498DB')
        .setFooter({ text: `Collection last updated: ${new Date().toLocaleDateString()}${isDebugMode ? ' | DEBUG MODE' : ''}` });

    const components = [
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('detailed_collection')
                    .setLabel('📋 Detailed View')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('rarity_stats')
                    .setLabel('📊 Rarity Stats')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.reply({ embeds: [collectionEmbed], components, ephemeral: true });
}

// Share discovery with others
async function shareDiscovery(interaction) {
    const shareEmbed = new EmbedBuilder()
        .setTitle('📢 **Devil Fruit Discovery Shared!**')
        .setDescription(`🎉 ${interaction.user.username} found an incredible Devil Fruit! Check out their amazing discovery above!

🍈 **Want to find your own Devil Fruit?** Use \`/pull\` to start hunting!`)
        .setColor('#E67E22')
        .setFooter({ text: '🍈 Join the hunt with /pull!' });

    await interaction.reply({ embeds: [shareEmbed] });
}

// Show detailed multi-hunt results
async function showDetailedResults(interaction) {
    const detailsEmbed = new EmbedBuilder()
        .setTitle('📋 **Detailed Multi-Hunt Results**')
        .setDescription(`🚧 **Multi-Hunt Details Coming Soon!**

This feature will show:
• Individual pull results
• Rarity distribution
• Power level statistics
• Duplicate tracking
• Collection updates

**Current Status:** Under Development`)
        .setColor('#F39C12')
        .setFooter({ text: 'Multi-Hunt System | Feature in Development' });

    await interaction.reply({ embeds: [detailsEmbed], ephemeral: true });
}

// Export button handler for use in main bot file
module.exports.handleButtonInteractions = handleButtonInteractions;) {
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
async function handleSingleHunt(interaction, huntType = 'normal') {
    try {
        // Defer reply for long animation
        await interaction.deferReply();

        // Start the ultimate cinematic experience
        const result = await createUltimateCinematicExperience(interaction, huntType);

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

        console.log(`🎊 Single hunt success: ${result.devilFruit.name} (${result.rarity}) for ${interaction.user.username}${result.debugMode ? ' [DEBUG]' : ''}`);

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

        const isDebugMode = debugConfig && debugConfig().enabled;
        
        // Mock multi hunt with debug support
        const mockEmbed = new EmbedBuilder()
            .setTitle('🍈x10 **MULTI HUNT SYSTEM LOADING** 🍈x10')
            .setDescription(`🚧 Multi Hunt is currently being implemented!

**Planned Features:**
• 10x Devil Fruit pulls at once
• Summary of all results
• Bulk rarity statistics
• Special multi-hunt animations

${isDebugMode ? `
🔧 **DEBUG MODE DETECTED:**
• Debug settings will apply to all 10 pulls
• Forced Rarity: ${debugConfig().forcedRarity || 'Random'}
• Enhanced debug logging enabled
• Animation control: ${debugConfig().showAnimations ? 'On' : 'Off'}` : ''}

**Note:** Animation files need to be created first.`)
            .setColor('#3498DB')
            .setFooter({ text: isDebugMode ? 'Multi Hunt System | DEBUG MODE ACTIVE' : 'Multi Hunt System | Under Development' });

        await interaction.editReply({ embeds: [mockEmbed] });

        console.log(`🎊 Multi hunt placeholder for ${interaction.user.username}${isDebugMode ? ' [DEBUG]' : ''}`);

    } catch (error) {
        console.error('Multi hunt error:', error);
        throw error;
    }
}

// Button interaction handler
async function handleButtonInteractions(interaction) {
    try {
        const { customId, user } = interaction;
        const isDebugMode = debugConfig && debugConfig().enabled;

        switch (customId) {
            case 'hunt_again':
                await interaction.deferUpdate();
                // Re-run single hunt
                await handleSingleHunt(interaction, 'normal');
                break;

            case 'view_collection':
                await showUserCollection(interaction);
                break;

            case 'share_discovery':
                await shareDiscovery(interaction);
                break;

            case 'debug_info':
                if (isDebugMode) {
                    await showDebugInfo(interaction);
                } else {
                    await interaction.reply({
                        content: '🔧 Debug mode is not active!',
                        ephemeral: true
                    });
                }
                break;

            case 'detailed_results':
                await showDetailedResults(interaction);
                break;

            default:
                await interaction.reply({
                    content: '❓ Unknown button action!',
                    ephemeral: true
                });
        }

    } catch (error
