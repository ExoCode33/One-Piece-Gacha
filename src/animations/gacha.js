const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    NATURAL SAILING ENGINE
// ═══════════════════════════════════════════════════════════════════

const SailingEngine = {
    // Ultra-fast rainbow colors
    rainbowColors: [
        '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
        '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
        '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
        '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
        '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033'
    ],

    // Create sailing ship progress bar
    createShipProgress(percentage) {
        const totalWidth = 40;
        const shipPosition = Math.floor((percentage / 100) * (totalWidth - 3));
        
        let progressBar = '';
        for (let i = 0; i < totalWidth; i++) {
            if (i === shipPosition) {
                progressBar += '🚢';
            } else if (i === shipPosition + 1) {
                progressBar += '💨';
            } else if (i < shipPosition) {
                progressBar += '🌊';
            } else {
                progressBar += '⋅';
            }
        }
        
        return `${progressBar} ${percentage}%`;
    },

    // Ultra-fast color
    getUltraColor(frame) {
        return this.rainbowColors[frame % this.rainbowColors.length];
    },

    // Simple text styling
    createText(text, useRed = false) {
        return useRed ? `🔴 ${text}` : text;
    }
};

// ═══════════════════════════════════════════════════════════════════
//                    NATURAL ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: Hunt Beginning (6 frames)
function createHuntBeginning(frame) {
    const percentage = Math.floor((frame / 5) * 25);
    
    const messages = [
        "Starting Devil Fruit hunt...",
        "Searching the Grand Line...",
        "Detecting energy signatures...",
        "Something is out there...",
        "Power levels rising...",
        "Getting closer to something..."
    ];
    
    const message = messages[frame];
    const useRed = Math.random() < 0.3;
    const styledMessage = SailingEngine.createText(message, useRed);
    
    const shipProgress = SailingEngine.createShipProgress(percentage);
    const effects = '🔍🌊⚡'.repeat(8);
    
    return new EmbedBuilder()
        .setTitle('🔍 Devil Fruit Hunt')
        .setDescription(`
${effects}

**${styledMessage}**

${shipProgress}

*Sailing through the Grand Line...*
        `)
        .setColor(SailingEngine.getUltraColor(frame * 8))
        .setFooter({ text: `Hunt Progress: ${percentage}%` });
}

// PHASE 2: Energy Detection (8 frames)
function createEnergyDetection(frame) {
    const percentage = 25 + Math.floor((frame / 7) * 35);
    
    const messages = [
        "Weak energy detected...",
        "Power signature found...",
        "Energy getting stronger...",
        "Significant power ahead...",
        "Strong energy confirmed...",
        "Impressive power levels...",
        "Exceptional energy detected...",
        "Incredible power found..."
    ];
    
    const message = messages[frame];
    const useRed = Math.random() < 0.4;
    const styledMessage = SailingEngine.createText(message, useRed);
    
    const shipProgress = SailingEngine.createShipProgress(percentage);
    const effects = '⚡🔥💫'.repeat(8);
    
    return new EmbedBuilder()
        .setTitle('⚡ Energy Rising')
        .setDescription(`
${effects}

**${styledMessage}**

${shipProgress}

*Power building in the distance...*
        `)
        .setColor(SailingEngine.getUltraColor(frame * 10 + 20))
        .setFooter({ text: `Energy Level: ${percentage}%` });
}

// PHASE 3: Rarity Lock-On (Pick ONE rarity and stick with it)
function createRarityLockOn(frame, lockedRarity) {
    const percentage = 60 + Math.floor((frame / 11) * 30);
    
    // Get the locked rarity config
    const rarityConfigs = {
        legendary: {
            emoji: '🟡',
            color: '#F39C12',
            name: 'LEGENDARY',
            messages: [
                "LEGENDARY signature detected...",
                "LEGENDARY power confirmed...",
                "LEGENDARY Devil Fruit found...",
                "LEGENDARY class verified...",
                "LEGENDARY energy strong...",
                "LEGENDARY power building...",
                "LEGENDARY signature locked...",
                "LEGENDARY energy at peak...",
                "Wait... something's changing...",
                "Energy pattern shifting...",
                "Different power emerging...",
                "Final reading coming in..."
            ]
        },
        mythical: {
            emoji: '🔴',
            color: '#E74C3C',
            name: 'MYTHICAL',
            messages: [
                "MYTHICAL signature detected...",
                "MYTHICAL power confirmed...",
                "MYTHICAL Devil Fruit found...",
                "MYTHICAL class verified...",
                "MYTHICAL energy strong...",
                "MYTHICAL power building...",
                "MYTHICAL signature locked...",
                "MYTHICAL energy at peak...",
                "Hold on... readings changing...",
                "Power signature shifting...",
                "New energy pattern found...",
                "True result incoming..."
            ]
        },
        omnipotent: {
            emoji: '🌌',
            color: '#9B59B6',
            name: 'OMNIPOTENT',
            messages: [
                "OMNIPOTENT signature detected...",
                "OMNIPOTENT power confirmed...",
                "OMNIPOTENT Devil Fruit found...",
                "OMNIPOTENT class verified...",
                "OMNIPOTENT energy strong...",
                "OMNIPOTENT power building...",
                "OMNIPOTENT signature locked...",
                "OMNIPOTENT energy at peak...",
                "Something unexpected...",
                "Energy completely changing...",
                "Totally different power...",
                "Real result appearing..."
            ]
        }
    };
    
    const config = rarityConfigs[lockedRarity];
    const message = config.messages[frame];
    const useRed = frame >= 8 ? true : Math.random() < 0.2;
    const styledMessage = SailingEngine.createText(message, useRed);
    
    // Use the locked rarity color for most frames, then change
    let color = config.color;
    let effects = config.emoji.repeat(20);
    let title = `${config.emoji} ${config.name} DETECTED! ${config.emoji}`;
    
    // In final frames, show it's changing
    if (frame >= 8) {
        color = SailingEngine.getUltraColor(frame * 15 + 60);
        effects = '🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊💫🌊';
        title = '🌊 Power Signature Changing 🌊';
    }
    
    const shipProgress = SailingEngine.createShipProgress(percentage);
    
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(`
${effects}

**${styledMessage}**

${shipProgress}

*${frame < 8 ? config.name + ' power confirmed!' : 'Wait... something different...'}*
        `)
        .setColor(color)
        .setFooter({ text: `${frame < 8 ? config.emoji : '🌊'} ${frame < 8 ? config.name + ' CLASS' : 'CHANGING'} | ${percentage}%` });
}

// PHASE 4: Final Approach (6 frames)
function createFinalApproach(frame) {
    const percentage = 90 + Math.floor((frame / 5) * 10);
    
    const messages = [
        "Final approach...",
        "Devil Fruit materializing...",
        "Almost there...",
        "Power stabilizing...",
        "Ready to reveal...",
        "Here it comes..."
    ];
    
    const message = messages[frame];
    const useRed = Math.random() < 0.3;
    const styledMessage = SailingEngine.createText(message, useRed);
    
    const shipProgress = SailingEngine.createShipProgress(percentage);
    const effects = '🎯✨🎯✨🎯✨🎯✨🎯✨🎯✨🎯✨🎯✨🎯✨🎯';
    
    return new EmbedBuilder()
        .setTitle('🎯 Final Approach')
        .setDescription(`
${effects}

**${styledMessage}**

${shipProgress}

*Your Devil Fruit is materializing...*
        `)
        .setColor(SailingEngine.getUltraColor(frame * 25 + 100))
        .setFooter({ text: `Final Approach: ${percentage}%` });
}

// PHASE 5: Devil Fruit Materialization
async function createDevilFruitMaterialization(interaction, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const frames = 6;
    
    for (let frame = 0; frame < frames; frame++) {
        const progress = frame / (frames - 1);
        
        // Progressive name reveal
        const nameLength = devilFruit.name.length;
        const revealedChars = Math.floor(nameLength * progress);
        const visibleName = devilFruit.name.slice(0, revealedChars);
        const hiddenName = '◆'.repeat(nameLength - revealedChars);
        const displayName = frame === frames - 1 ? devilFruit.name : visibleName + hiddenName;
        
        const styledName = SailingEngine.createText(displayName, Math.random() < 0.4);
        
        // Info reveal
        const infoLines = [
            `📋 **Type:** ${frame >= 1 ? devilFruit.type : '???'}`,
            `👤 **User:** ${frame >= 2 ? devilFruit.user : '???'}`,
            `⚡ **Power:** ${frame >= 3 ? devilFruit.power : '???'}`,
            `⭐ **Rarity:** ${frame >= 4 ? config.name : '???'}`,
            `🔥 **Power Level:** ${frame >= 5 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const effects = config.emoji.repeat(20);
        const shipProgress = SailingEngine.createShipProgress(100);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} Devil Fruit Found! ${config.emoji}`)
            .setDescription(`
${effects}

**${styledName}**

${infoLines.join('\n')}

${shipProgress}

${config.stars.repeat(Math.min(frame + 3, 8))}
            `)
            .setColor(config.color)
            .setFooter({ text: `🍈 ${config.name} Devil Fruit | ${Math.floor(progress * 100)}% materialized` });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// PHASE 6: Final Result
function createFinalResult(devilFruit, rarity, interaction) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const finaleMessages = {
        omnipotent: '🌌 OMNIPOTENT DEVIL FRUIT! 🌌',
        mythical: '🔮 MYTHICAL DEVIL FRUIT! 🔮',
        legendary: '👑 LEGENDARY DEVIL FRUIT! 👑',
        rare: '💎 RARE DEVIL FRUIT! 💎',
        uncommon: '🌟 UNCOMMON DEVIL FRUIT! 🌟',
        common: '⚓ DEVIL FRUIT FOUND! ⚓'
    };
    
    const effects = {
        omnipotent: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
        mythical: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮✨🌟💎',
        legendary: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑⚡🔥🌟',
        rare: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎🌟✨⭐',
        uncommon: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟⭐✨💫',
        common: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐'
    };
    
    const epicName = SailingEngine.createText(devilFruit.name);
    const finalEffect = effects[rarity] || effects.common;
    const finalTitle = finaleMessages[rarity] || finaleMessages.common;
    
    const shipProgress = SailingEngine.createShipProgress(100);
    
    const description = `
${finalEffect}

**${finalTitle}**

🍈 **${devilFruit.name}**
📋 **Type:** ${devilFruit.type}
👤 **User:** ${devilFruit.user}
⚡ **Power:** ${devilFruit.power}
🔥 **Power Level:** ${devilFruit.powerLevel.toLocaleString()}
⭐ **Rarity:** ${config.name}

${shipProgress}

${config.stars.repeat(8)}

🏆 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🏆

> *"${devilFruit.description}"*

${finalEffect}
    `;

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('🍈 Hunt Again!')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('view_collection')
                .setLabel('📚 Collection')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('fruit_details')
                .setLabel('🔍 Details')
                .setStyle(ButtonStyle.Success)
        );

    return {
        embed: new EmbedBuilder()
            .setTitle(`${config.emoji} ${epicName} ${config.emoji}`)
            .setDescription(description)
            .setColor(config.color)
            .setFooter({ 
                text: `🍈 Devil Fruit Hunt Complete | Found by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// ═══════════════════════════════════════════════════════════════════
//                    MASTER NATURAL SEQUENCE
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        // Pick a fake high rarity to lock onto (if not already high)
        const fakeRarities = ['legendary', 'mythical', 'omnipotent'];
        const lockedRarity = rarity === 'common' || rarity === 'uncommon' || rarity === 'rare' ? 
            fakeRarities[Math.floor(Math.random() * fakeRarities.length)] : 
            rarity; // If already high rarity, don't fake it
        
        console.log(`🎮 NATURAL HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username} | Fake: ${lockedRarity}`);
        
        // PHASE 1: Hunt Beginning (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createHuntBeginning(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 2: Energy Detection (8 frames, 3 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createEnergyDetection(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 375));
        }
        
        // PHASE 3: Rarity Lock-On (12 frames, 4 seconds)
        for (let frame = 0; frame < 12; frame++) {
            const embed = createRarityLockOn(frame, lockedRarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 333));
        }
        
        // PHASE 4: Final Approach (6 frames, 3 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalApproach(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // PHASE 5: Devil Fruit Materialization (6 frames, 5 seconds)
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 6: Final Result
        const finale = createFinalResult(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        console.log(`🎊 NATURAL COMPLETE: ${devilFruit.name} (${rarity}) for ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Natural Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Hunt Error!')
            .setDescription(`
Hunt failed! Please try again!
            `)
            .setColor('#E74C3C');
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience
};
