const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Import the epic animation system
const { createEpicGachaAnimation } = require('../animations/gacha');

// Fallback simple animation in case of issues
    try {
        // Simple rarity system for testing
        const rarities = {
            common: { name: 'Common', color: '#95A5A6', emoji: '⚪', stars: '⭐', chance: 50 },
            uncommon: { name: 'Uncommon', color: '#2ECC71', emoji: '🟢', stars: '⭐⭐', chance: 30 },
            rare: { name: 'Rare', color: '#3498DB', emoji: '🔵', stars: '⭐⭐⭐', chance: 15 },
            legendary: { name: 'Legendary', color: '#F39C12', emoji: '🟡', stars: '⭐⭐⭐⭐', chance: 4 },
            mythical: { name: 'Mythical', color: '#E74C3C', emoji: '🔴', stars: '⭐⭐⭐⭐⭐', chance: 0.8 },
            omnipotent: { name: 'Omnipotent', color: '#9B59B6', emoji: '🌌', stars: '⭐⭐⭐⭐⭐⭐', chance: 0.2 }
        };

        const characters = {
            common: [
                { name: 'Usopp', crew: 'Straw Hat Pirates', bounty: '500,000,000' },
                { name: 'Chopper', crew: 'Straw Hat Pirates', bounty: '1,000' }
            ],
            uncommon: [
                { name: 'Nami', crew: 'Straw Hat Pirates', bounty: '366,000,000' },
                { name: 'Brook', crew: 'Straw Hat Pirates', bounty: '383,000,000' }
            ],
            rare: [
                { name: 'Sanji', crew: 'Straw Hat Pirates', bounty: '1,032,000,000' },
                { name: 'Robin', crew: 'Straw Hat Pirates', bounty: '930,000,000' }
            ],
            legendary: [
                { name: 'Zoro', crew: 'Straw Hat Pirates', bounty: '1,111,000,000' },
                { name: 'Luffy', crew: 'Straw Hat Pirates', bounty: '3,000,000,000' }
            ],
            mythical: [
                { name: 'Whitebeard', crew: 'Whitebeard Pirates', bounty: '5,046,000,000' },
                { name: 'Kaido', crew: 'Beast Pirates', bounty: '4,611,100,000' }
            ],
            omnipotent: [
                { name: 'Gol D. Roger', crew: 'Roger Pirates', bounty: '5,564,800,000' },
                { name: 'Joy Boy', crew: 'Ancient Kingdom', bounty: 'Unknown' }
            ]
        };

        function getRarity() {
            const roll = Math.random() * 100;
            let cumulative = 0;
            
            for (const [rarity, config] of Object.entries(rarities)) {
                cumulative += config.chance;
                if (roll <= cumulative) {
                    return rarity;
                }
            }
            return 'common';
        }

        function getRandomCharacter(rarity) {
            const pool = characters[rarity] || characters.common;
            return pool[Math.floor(Math.random() * pool.length)];
        }

        // Get results immediately
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        const config = rarities[rarity];

        console.log(`🎲 Quick Gacha: ${character.name} (${rarity}) for ${interaction.user.username}`);

        // Phase 1: Initial pull (quick)
        const initialEmbed = new EmbedBuilder()
            .setTitle('🏴‍☠️ One Piece Gacha Pull')
            .setDescription(`
🌊 The Grand Line stirs...

\`\`\`
⚡ Summoning begins... ⚡
\`\`\`

*Preparing for adventure...*
            `)
            .setColor('#3498DB')
            .setFooter({ text: 'The seas are gathering power...' });

        await interaction.editReply({ embeds: [initialEmbed] });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Phase 2: Building suspense (faster)
        const suspenseEmbed = new EmbedBuilder()
            .setTitle('⚡ Power Building! ⚡')
            .setDescription(`
🌩️⚡🌩️⚡🌩️

\`\`\`
🌊 The seas grow restless... 🌊
\`\`\`

*Something approaches through the storm!*
            `)
            .setColor('#E67E22')
            .setFooter({ text: 'Energy gathering...' });

        await interaction.editReply({ embeds: [suspenseEmbed] });
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Phase 3: Rarity reveal (dramatic)
        const rarityEmbed = new EmbedBuilder()
            .setTitle(`${config.emoji} RARITY REVEALED! ${config.emoji}`)
            .setDescription(`
${config.emoji.repeat(8)}

\`\`\`
✨ ${config.name.toUpperCase()} CONFIRMED! ✨
\`\`\`

${config.stars.repeat(3)}

*${config.name} power fills the air!*
            `)
            .setColor(config.color)
            .setFooter({ text: `${config.stars} ${config.name.toUpperCase()} POWER! ${config.stars}` });

        await interaction.editReply({ embeds: [rarityEmbed] });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Phase 4: Character reveal (final)
        const finalEmbed = new EmbedBuilder()
            .setTitle(`${config.emoji} ${character.name} ${config.emoji}`)
            .setDescription(`
${config.emoji.repeat(6)}

\`\`\`
🏴‍☠️ LEGENDARY SUMMON COMPLETE! 🏴‍☠️
\`\`\`

**Character:** ${character.name}
**Crew:** ${character.crew}
**Bounty:** ${character.bounty} Berry
**Rarity:** ${config.name}

${config.stars.repeat(4)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆
*The seas have blessed you with incredible power!*

${config.emoji.repeat(6)}
            `)
            .setColor(config.color)
            .setFooter({ 
                text: `🌊 One Piece Gacha | Summoned by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        // Add interactive buttons
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pull_again')
                    .setLabel('⚓ Set Sail Again!')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🏴‍☠️'),
                new ButtonBuilder()
                    .setCustomId('view_crew')
                    .setLabel('👥 View Crew')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⚓')
            );

        await interaction.editReply({ 
            embeds: [finalEmbed], 
            components: [actionRow] 
        });

    } catch (error) {
        console.error('🚨 Quick Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Seas Are Too Rough!')
            .setDescription(`
The Grand Line's power was too intense!

*Please try your luck again, brave pirate!*
            `)
            .setColor('#E74C3C')
            .setFooter({ text: 'Even the greatest pirates face storms!' });
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

// User session management (simple in-memory for now)
const userCooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull a One Piece character from the gacha!'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        
        try {
            // Check cooldown (30 seconds)
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

            // Set cooldown (30 seconds)
            userCooldowns.set(userId, Date.now() + 30000);

            // CRITICAL: Defer reply immediately to prevent timeout
            await interaction.deferReply();
            
            console.log(`🎮 ${interaction.user.username} started a gacha pull`);
            
            // Run the epic animation
            await createEpicGachaAnimation(interaction);
            
        } catch (error) {
            console.error('🚨 Pull Command Error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ The Grand Line Rebels!')
                .setDescription(`
The seas are too chaotic right now!

**Error:** ${error.message}

*Please try again - the adventure continues!*
                `)
                .setColor('#E74C3C')
                .setFooter({ text: 'Even the greatest pirates face storms!' });
            
            try {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else if (!interaction.replied) {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};

// Button interaction handler
async function handleButtonInteractions(interaction) {
    if (!interaction.isButton()) return;
    
    const userId = interaction.user.id;
    
    try {
        switch (interaction.customId) {
            case 'pull_again':
                // Check cooldown
                if (userCooldowns.has(userId)) {
                    const cooldownEnd = userCooldowns.get(userId);
                    if (Date.now() < cooldownEnd) {
                        const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
                        await interaction.reply({ 
                            content: `⏰ Please wait ${timeLeft} more seconds before pulling again!`, 
                            ephemeral: true 
                        });
                        return;
                    }
                }
                
                // Set new cooldown
                userCooldowns.set(userId, Date.now() + 30000);
                
                await interaction.deferReply();
                await createEpicGachaAnimation(interaction);
                break;
                
            case 'view_crew':
                const collectionEmbed = new EmbedBuilder()
                    .setTitle('📚 Your Pirate Collection')
                    .setDescription(`
🏴‍☠️ **Captain ${interaction.user.username}'s Crew**

*Your collection system is being upgraded!*
*Soon you'll see all your legendary crew members here.*

**Coming Soon:**
• Detailed crew roster
• Character stats and abilities  
• Collection achievements
• Trading system
                    `)
                    .setColor('#3498DB')
                    .setFooter({ text: 'Every great pirate needs a great crew!' });
                
                await interaction.reply({ embeds: [collectionEmbed], ephemeral: true });
                break;
        }
    } catch (error) {
        console.error('Button interaction error:', error);
        try {
            await interaction.reply({ 
                content: '❌ Something went wrong with that action!', 
                ephemeral: true 
            });
        } catch (replyError) {
            console.error('Failed to send button error message:', replyError);
        }
    }
}

// Export button handler
module.exports.handleButtonInteractions = handleButtonInteractions;
