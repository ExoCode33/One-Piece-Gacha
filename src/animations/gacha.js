const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Professional Animation Framework
const CinematicEngine = {
    // Sophisticated visual effects library
    effects: {
        ocean: {
            calm: ['〰️', '🌊', '〰️', '🌊'],
            rough: ['🌊', '💨', '🌊', '💨', '🌊'],
            storm: ['🌩️', '⚡', '🌊', '💥', '⚡', '🌪️']
        },
        energy: {
            gathering: ['◯', '◉', '⦿', '●', '⭕'],
            building: ['✦', '✧', '✩', '✪', '✫', '✬'],
            explosive: ['💥', '⚡', '🌟', '💫', '✨', '🔥']
        },
        mystical: {
            glow: ['◊', '◈', '◇', '♦', '💎'],
            divine: ['🌌', '✨', '🔮', '💫', '⭐'],
            cosmic: ['🌠', '🌟', '💫', '🌌', '✨']
        }
    },

    // Dynamic color palettes for atmosphere
    atmospheres: {
        mysterious: ['#1a1a2e', '#16213e', '#0f3460', '#533a71'],
        building: ['#ff6b6b', '#ee5a24', '#ff9ff3', '#54a0ff'],
        explosive: ['#feca57', '#ff9ff3', '#48dbfb', '#0abde3'],
        legendary: ['#ff6348', '#ff9ff3', '#1dd1a1', '#feca57'],
        divine: ['#a55eea', '#26de81', '#fd79a8', '#fdcb6e']
    },

    // Professional text styling
    createCinematicText(text, intensity = 1, style = 'normal') {
        const styles = {
            whisper: text.toLowerCase(),
            normal: text,
            emphasis: `**${text}**`,
            strong: `***${text}***`,
            legendary: `✨ **${text}** ✨`,
            mythical: `🌟 ***${text}*** 🌟`,
            divine: `💫 ⭐ **${text}** ⭐ 💫`,
            cosmic: `🌌 💫 ⭐ ***${text}*** ⭐ 💫 🌌`
        };
        
        if (intensity <= 2) return styles[style] || text;
        if (intensity <= 4) return styles.emphasis || `**${text}**`;
        if (intensity <= 6) return styles.legendary || `✨ **${text}** ✨`;
        return styles.cosmic || `🌌 ***${text}*** 🌌`;
    },

    // Advanced visual frames
    createMysticalFrame(content, frameType = 'simple', glowLevel = 1) {
        const frames = {
            simple: {
                corners: ['╔', '╗', '╚', '╝'],
                horizontal: '═',
                vertical: '║'
            },
            ornate: {
                corners: ['◆', '◆', '◆', '◆'],
                horizontal: '◈',
                vertical: '◇'
            },
            mystical: {
                corners: ['✦', '✦', '✦', '✦'],
                horizontal: '✧',
                vertical: '✦'
            },
            divine: {
                corners: ['🌟', '🌟', '🌟', '🌟'],
                horizontal: '✨',
                vertical: '💫'
            }
        };

        const frame = frames[frameType] || frames.simple;
        const width = 42;
        const padding = ' '.repeat(Math.max(0, width - content.length - 4));
        
        const topLine = frame.horizontal.repeat(width);
        const contentLine = `${frame.vertical} ${content}${padding} ${frame.vertical}`;
        const bottomLine = frame.horizontal.repeat(width);
        
        // Add glow effect for higher levels
        if (glowLevel > 3) {
            const glow = '✨'.repeat(Math.min(glowLevel - 2, 6));
            return `\`\`\`\n${glow}\n${topLine}\n${contentLine}\n${bottomLine}\n${glow}\n\`\`\``;
        }
        
        return `\`\`\`\n${topLine}\n${contentLine}\n${bottomLine}\n\`\`\``;
    },

    // Dynamic particle effects
    createParticleField(intensity, type = 'energy') {
        const particles = this.effects[type] || this.effects.energy.gathering;
        const count = Math.min(intensity * 2, 20);
        const field = [];
        
        for (let i = 0; i < 3; i++) {
            let line = '';
            for (let j = 0; j < count; j++) {
                const particle = particles[Math.floor(Math.random() * particles.length)];
                line += particle + ' ';
            }
            field.push(line.trim());
        }
        
        return field.join('\n');
    },

    // Atmospheric color transitions
    getAtmosphericColor(phase, intensity) {
        const atmosphereKeys = Object.keys(this.atmospheres);
        const atmosphere = this.atmospheres[atmosphereKeys[phase % atmosphereKeys.length]];
        return atmosphere[Math.min(intensity, atmosphere.length - 1)];
    }
};

// Enhanced gacha data with more dramatic descriptions
const epicGachaData = {
    rarities: {
        common: { 
            name: 'Common', 
            color: '#95A5A6', 
            emoji: '⚪', 
            stars: '⭐',
            chance: 50,
            description: 'A reliable soul joins your crew',
            power: 'Foundation'
        },
        uncommon: { 
            name: 'Uncommon', 
            color: '#2ECC71', 
            emoji: '🟢', 
            stars: '⭐⭐',
            chance: 30,
            description: 'Skilled warrior with hidden potential',
            power: 'Rising'
        },
        rare: { 
            name: 'Rare', 
            color: '#3498DB', 
            emoji: '🔵', 
            stars: '⭐⭐⭐',
            chance: 15,
            description: 'Exceptional fighter with remarkable abilities',
            power: 'Elite'
        },
        legendary: { 
            name: 'Legendary', 
            color: '#F39C12', 
            emoji: '🟡', 
            stars: '⭐⭐⭐⭐',
            chance: 4,
            description: 'Hero whose name echoes through history',
            power: 'Legendary'
        },
        mythical: { 
            name: 'Mythical', 
            color: '#E74C3C', 
            emoji: '🔴', 
            stars: '⭐⭐⭐⭐⭐',
            chance: 0.8,
            description: 'Ancient being with world-shaping power',
            power: 'Mythical'
        },
        omnipotent: { 
            name: 'Omnipotent', 
            color: '#9B59B6', 
            emoji: '🌌', 
            stars: '⭐⭐⭐⭐⭐⭐',
            chance: 0.2,
            description: 'Transcendent entity beyond mortal comprehension',
            power: 'Divine'
        }
    },

    characters: {
        common: [
            { name: 'Tony Tony Chopper', crew: 'Straw Hat Pirates', bounty: '1,000', title: 'Cotton Candy Lover' },
            { name: 'Usopp', crew: 'Straw Hat Pirates', bounty: '500,000,000', title: 'God Usopp' },
            { name: 'Nami', crew: 'Straw Hat Pirates', bounty: '366,000,000', title: 'Cat Burglar' }
        ],
        uncommon: [
            { name: 'Brook', crew: 'Straw Hat Pirates', bounty: '383,000,000', title: 'Soul King' },
            { name: 'Franky', crew: 'Straw Hat Pirates', bounty: '394,000,000', title: 'Cyborg' },
            { name: 'Jinbe', crew: 'Straw Hat Pirates', bounty: '1,100,000,000', title: 'Knight of the Sea' }
        ],
        rare: [
            { name: 'Nico Robin', crew: 'Straw Hat Pirates', bounty: '930,000,000', title: 'Devil Child' },
            { name: 'Sanji', crew: 'Straw Hat Pirates', bounty: '1,032,000,000', title: 'Black Leg' },
            { name: 'Portgas D. Ace', crew: 'Whitebeard Pirates', bounty: '550,000,000', title: 'Fire Fist' }
        ],
        legendary: [
            { name: 'Roronoa Zoro', crew: 'Straw Hat Pirates', bounty: '1,111,000,000', title: 'Pirate Hunter' },
            { name: 'Monkey D. Luffy', crew: 'Straw Hat Pirates', bounty: '3,000,000,000', title: 'Straw Hat' },
            { name: 'Trafalgar D. Water Law', crew: 'Heart Pirates', bounty: '3,000,000,000', title: 'Surgeon of Death' }
        ],
        mythical: [
            { name: 'Edward Newgate', crew: 'Whitebeard Pirates', bounty: '5,046,000,000', title: 'Whitebeard' },
            { name: 'Kaido', crew: 'Beast Pirates', bounty: '4,611,100,000', title: 'King of Beasts' },
            { name: 'Shanks', crew: 'Red Hair Pirates', bounty: '4,048,900,000', title: 'Red Hair' }
        ],
        omnipotent: [
            { name: 'Gol D. Roger', crew: 'Roger Pirates', bounty: '5,564,800,000', title: 'Pirate King' },
            { name: 'Joy Boy', crew: 'Ancient Kingdom', bounty: 'Beyond Measure', title: 'The Liberator' },
            { name: 'Monkey D. Luffy (Gear 5)', crew: 'Straw Hat Pirates', bounty: '3,000,000,000', title: 'Sun God Nika' }
        ]
    }
};

// Utility functions
function getRarity() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, config] of Object.entries(epicGachaData.rarities)) {
        cumulative += config.chance;
        if (roll <= cumulative) {
            return rarity;
        }
    }
    return 'common';
}

function getRandomCharacter(rarity) {
    const pool = epicGachaData.characters[rarity] || epicGachaData.characters.common;
    return pool[Math.floor(Math.random() * pool.length)];
}

// PHASE 1: Mysterious Awakening (Build atmosphere)
function createMysteriousAwakening(frame) {
    const mysteryMessages = [
        "The ancient seas begin to stir...",
        "Whispers echo from the Grand Line...",
        "Something legendary approaches...",
        "The very air crackles with potential...",
        "Destiny calls from beyond the horizon..."
    ];
    
    const message = mysteryMessages[Math.min(frame, mysteryMessages.length - 1)];
    const styledMessage = CinematicEngine.createCinematicText(message, frame, 'whisper');
    const color = CinematicEngine.getAtmosphericColor(0, frame);
    
    const oceanEffect = CinematicEngine.effects.ocean.calm[frame % CinematicEngine.effects.ocean.calm.length];
    const particles = CinematicEngine.createParticleField(frame + 1, 'mystical');
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ One Piece Treasure Summon')
        .setDescription(`
${oceanEffect.repeat(8)}

${CinematicEngine.createMysticalFrame(styledMessage, 'simple', frame)}

${particles}

*The Grand Line holds its breath...*
        `)
        .setColor(color)
        .setFooter({ text: `🌊 Ancient powers gather... ${frame + 1}/5` });
}

// PHASE 2: Energy Building (Escalating power)
function createEnergyBuilding(frame) {
    const energyMessages = [
        "⚡ Energy crackles in the distance...",
        "🌩️ Storm clouds gather overhead...",
        "💥 Lightning strikes the ocean...",
        "🌪️ A massive whirlpool forms...",
        "⚡ The seas ROAR with power...",
        "🌩️ Reality itself begins to SHAKE...",
        "💥 THE GRAND LINE AWAKENS!"
    ];
    
    const message = energyMessages[Math.min(frame, energyMessages.length - 1)];
    const intensity = Math.floor(frame / 2) + 2;
    const styledMessage = CinematicEngine.createCinematicText(message, intensity, 'emphasis');
    const color = CinematicEngine.getAtmosphericColor(1, Math.min(frame, 3));
    
    const stormEffect = CinematicEngine.effects.ocean.storm[frame % CinematicEngine.effects.ocean.storm.length];
    const energyField = CinematicEngine.createParticleField(frame + 3, 'energy');
    
    return new EmbedBuilder()
        .setTitle(`⚡ ${CinematicEngine.createCinematicText('POWER AWAKENING', intensity)} ⚡`)
        .setDescription(`
${stormEffect.repeat(12)}

${CinematicEngine.createMysticalFrame(styledMessage, 'ornate', intensity)}

${energyField}

*The very fabric of reality trembles!*
        `)
        .setColor(color)
        .setFooter({ text: `⚡ Power Level: ${Math.floor((frame / 7) * 100)}% | BRACE YOURSELF!` });
}

// PHASE 3: Dimensional Rift (Mystery deepens)
function createDimensionalRift(frame) {
    const riftMessages = [
        "🌌 A dimensional rift tears open...",
        "✨ Cosmic energy floods through...",
        "🔮 Ancient seals begin to shatter...",
        "💫 Time and space bend and twist...",
        "🌟 SOMETHING BEYOND IMAGINATION STIRS...",
        "🌌 THE VOID ITSELF ANSWERS YOUR CALL!"
    ];
    
    const message = riftMessages[Math.min(frame, riftMessages.length - 1)];
    const intensity = frame + 3;
    const styledMessage = CinematicEngine.createCinematicText(message, intensity, 'strong');
    const color = CinematicEngine.getAtmosphericColor(2, Math.min(frame, 3));
    
    const cosmicField = CinematicEngine.createParticleField(frame + 5, 'mystical');
    const riftEffect = '🌌'.repeat(frame + 1) + '💫'.repeat(Math.floor(frame / 2));
    
    return new EmbedBuilder()
        .setTitle(`🌌 ${CinematicEngine.createCinematicText('DIMENSIONAL BREACH', intensity)} 🌌`)
        .setDescription(`
${riftEffect}

${CinematicEngine.createMysticalFrame(styledMessage, 'mystical', intensity)}

${cosmicField}

*What unimaginable power will emerge?*
        `)
        .setColor(color)
        .setFooter({ text: `🌌 Reality Distortion: ${Math.floor((frame / 6) * 100)}%` });
}

// PHASE 4: Rarity Revelation (The big reveal)
async function createRarityRevelation(interaction, rarity) {
    const config = epicGachaData.rarities[rarity];
    const revealFrames = Math.min(8, { common: 3, uncommon: 4, rare: 5, legendary: 6, mythical: 7, omnipotent: 8 }[rarity]);
    
    for (let frame = 0; frame < revealFrames; frame++) {
        const intensity = frame + 4;
        const progress = frame / revealFrames;
        
        // Progressive reveal effect
        const hiddenText = '◆'.repeat(config.name.length);
        const revealedChars = Math.floor(config.name.length * progress);
        const partialReveal = config.name.slice(0, revealedChars) + hiddenText.slice(revealedChars);
        
        const revealText = frame < 2 ? '???' : frame < revealFrames - 1 ? partialReveal : config.name.toUpperCase();
        const styledText = CinematicEngine.createCinematicText(revealText, intensity, 'legendary');
        
        // Rarity-specific effects
        let rarityEffect = '';
        if (rarity === 'omnipotent') {
            rarityEffect = '🌌'.repeat(15) + '\n' + '💫'.repeat(12) + '\n' + '⭐'.repeat(10);
        } else if (rarity === 'mythical') {
            rarityEffect = '🔮'.repeat(12) + '\n' + '✨'.repeat(10) + '\n' + '🌟'.repeat(8);
        } else if (rarity === 'legendary') {
            rarityEffect = '👑'.repeat(10) + '\n' + '⚡'.repeat(8) + '\n' + '🔥'.repeat(6);
        } else {
            rarityEffect = config.emoji.repeat(Math.min(frame + 4, 10));
        }
        
        const color = frame < 2 ? '#2C2C2C' : config.color;
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} RARITY REVEALED! ${config.emoji}`)
            .setDescription(`
${rarityEffect}

${CinematicEngine.createMysticalFrame(styledText, 'divine', intensity)}

${config.stars.repeat(Math.min(frame + 1, 6))}

${frame >= revealFrames - 1 ? `*${config.description}*` : '*The truth emerges from the void...*'}
            `)
            .setColor(color)
            .setFooter({ 
                text: frame >= revealFrames - 1 ? 
                    `${config.stars} ${config.name.toUpperCase()} POWER CONFIRMED! ${config.stars}` :
                    `Revelation Progress: ${Math.floor(progress * 100)}%`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 400 + (frame * 100)));
    }
}

// PHASE 5: Character Materialization (Epic entrance)
async function createCharacterMaterialization(interaction, character, rarity) {
    const config = epicGachaData.rarities[rarity];
    const materializationFrames = 5;
    
    for (let frame = 0; frame < materializationFrames; frame++) {
        const intensity = frame + 5;
        const progress = frame / (materializationFrames - 1);
        
        // Character name reveal with typing effect
        const nameProgress = Math.floor(character.name.length * progress);
        const visibleName = character.name.slice(0, nameProgress);
        const hiddenName = '◇'.repeat(character.name.length - nameProgress);
        const displayName = frame === materializationFrames - 1 ? character.name : visibleName + hiddenName;
        
        const styledName = CinematicEngine.createCinematicText(displayName, intensity, 'divine');
        
        // Materialization stages
        const stages = [
            "A shadow emerges from the void...",
            "Features begin to take shape...",
            "Power radiates from the figure...",
            "The legend stands before you...",
            "MATERIALIZATION COMPLETE!"
        ];
        
        const stage = stages[frame];
        const styledStage = CinematicEngine.createCinematicText(stage, intensity, 'emphasis');
        
        // Progressive info reveal
        const infoLines = [
            `**Crew:** ${frame >= 2 ? character.crew : '???'}`,
            `**Bounty:** ${frame >= 3 ? character.bounty + ' Berry' : '???'}`,
            `**Title:** ${frame >= 4 ? character.title : '???'}`,
            `**Rarity:** ${frame >= 4 ? config.name : 'Materializing...'}`
        ];
        
        const materializationEffect = CinematicEngine.createParticleField(frame + 6, 'mystical');
        const color = CinematicEngine.getAtmosphericColor(3, Math.min(frame, 3));
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} LEGENDARY SUMMON ${config.emoji}`)
            .setDescription(`
${materializationEffect}

${CinematicEngine.createMysticalFrame(styledName, 'divine', intensity)}

**${styledStage}**

${infoLines.join('\n')}

${config.stars.repeat(Math.min(frame + 2, 6))}
            `)
            .setColor(color)
            .setFooter({ 
                text: `Materialization: ${Math.floor(progress * 100)}% | ${config.power} Power Detected`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// PHASE 6: Epic Finale (Grand celebration)
function createEpicFinale(character, rarity, interaction) {
    const config = epicGachaData.rarities[rarity];
    
    // Rarity-specific finale effects
    const finaleEffects = {
        omnipotent: {
            title: '🌌 OMNIPOTENT BEING SUMMONED! 🌌',
            subtitle: '✨ Reality itself kneels before your power! ✨',
            effect: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
            celebration: 'THE MULTIVERSE TREMBLES!'
        },
        mythical: {
            title: '🔮 MYTHICAL LEGEND AWAKENED! 🔮',
            subtitle: '⚡ Ancient powers flow through your very soul! ⚡',
            effect: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮',
            celebration: 'LEGENDS SPEAK YOUR NAME!'
        },
        legendary: {
            title: '👑 LEGENDARY HERO RISES! 👑',
            subtitle: '🔥 History will remember this glorious moment! 🔥',
            effect: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑',
            celebration: 'EPIC GLORY ACHIEVED!'
        },
        rare: {
            title: '💎 RARE WARRIOR APPEARS! 💎',
            subtitle: '✨ Exceptional power joins your legendary crew! ✨',
            effect: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎',
            celebration: 'SKILLED POWER OBTAINED!'
        },
        uncommon: {
            title: '🌟 SKILLED PIRATE EMERGES! 🌟',
            subtitle: '⭐ Promising potential awaits your command! ⭐',
            effect: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟',
            celebration: 'RISING STAR JOINS!'
        },
        common: {
            title: '⚓ RELIABLE CREW MEMBER! ⚓',
            subtitle: '⭐ Every legend needs a strong foundation! ⭐',
            effect: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓',
            celebration: 'SOLID FOUNDATION BUILT!'
        }
    };
    
    const finale = finaleEffects[rarity] || finaleEffects.common;
    const epicName = CinematicEngine.createCinematicText(character.name, 8, 'cosmic');
    
    const description = `
${finale.effect}

${CinematicEngine.createMysticalFrame(epicName, 'divine', 8)}

**${finale.title}**
*${finale.subtitle}*

╔════════════════════════════════════╗
║ 👑 **${character.title.padEnd(25)}** ║
║ ⚓ **Crew:** ${character.crew.padEnd(21)} ║
║ 💰 **Bounty:** ${character.bounty.padEnd(18)} Berry ║  
║ ⭐ **Rarity:** ${config.name.padEnd(18)} ║
║ 🔥 **Power:** ${config.power.padEnd(19)} ║
╚════════════════════════════════════╝

${config.stars.repeat(8)}

🏆 **${finale.celebration}** 🏆
🎊 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🎊
*The Grand Line has blessed you with incredible power!*

${finale.effect}
    `;

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('🏴‍☠️ Set Sail Again!')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⚓'),
            new ButtonBuilder()
                .setCustomId('view_crew')
                .setLabel('👥 View Your Crew')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📚'),
            new ButtonBuilder()
                .setCustomId('share_pull')
                .setLabel('📢 Share Victory!')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🎉')
        );

    return {
        embed: new EmbedBuilder()
            .setTitle(`${config.emoji} ${epicName} ${config.emoji}`)
            .setDescription(description)
            .setColor(config.color)
            .setFooter({ 
                text: `🌊 One Piece Gacha | Epic summon by ${interaction.user.username} | ${new Date().toLocaleTimeString()}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// MASTER ANIMATION ORCHESTRATOR
async function createEpicGachaAnimation(interaction) {
    try {
        const rarity = getRarity();
        const character = getRandomCharacter(rarity);
        
        console.log(`🎲 Epic Gacha: ${character.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Mysterious Awakening (5 frames, 4 seconds)
        for (let frame = 0; frame < 5; frame++) {
            const embed = createMysteriousAwakening(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // PHASE 2: Energy Building (7 frames, 6 seconds)
        for (let frame = 0; frame < 7; frame++) {
            const embed = createEnergyBuilding(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 800 - (frame * 50)));
        }
        
        // PHASE 3: Dimensional Rift (6 frames, 6 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createDimensionalRift(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // PHASE 4: Rarity Revelation (dynamic duration)
        await createRarityRevelation(interaction, rarity);
        
        // PHASE 5: Character Materialization (5 seconds)
        await createCharacterMaterialization(interaction, character, rarity);
        
        // PHASE 6: Epic Finale
        const finale = createEpicFinale(character, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
    } catch (error) {
        console.error('🚨 Epic Animation Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Grand Line Rebels!')
            .setDescription(`
The cosmic forces were too powerful to contain!

*The adventure continues - please try again, brave pirate!*
            `)
            .setColor('#E74C3C')
            .setFooter({ text: 'Even legends face challenges!' });
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createEpicGachaAnimation
};
