async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results for consistent timing
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 ULTIMATE GACHA: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Epic Prologue (10 frames, ~12 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEpicPrologue(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.prologue));
        }
        
        // PHASE 2: Cosmic Awakening (8 frames, ~8 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createCosmicAwakening(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.awakening));
        }
        
        // PHASE 3: Energy Gathering (10 frames, ~8 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEnergyGathering(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.gathering));
        }
        
        // PHASE 4: The Great Storm (12 frames, ~7 seconds)
        for (let frame = 0; frame < 12; frame++) {
            const embed = createGreatStorm(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.storm));
        }
        
        // PHASE 5: Dimensional Rift (8 frames, ~8 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createDimensionalRift(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.rift));
        }
        
        // PHASE 6: The Great Revelation (dynamic duration based on rarity)
        await createGreatRevelation(interaction, rarity);
        
        // PHASE 7: Devil Fruit Materialization (8 frames, ~10 seconds)
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 8: Ultimate Finale (permanent display)
        const finale = createUltimateFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        // Log the epic result
        console.log(`🎊 EPIC SUCCESS: ${devilFruit.name} (${rarity}, ${devilFruit.powerLevel} power) discovered by ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Ultimate Cinematic Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Cosmic Forces Were Too Powerful!')
            .setDescription(`
The dimensional rift became unstable during the Devil Fruit hunt!

**Error:** \`${error.message}\`

*The Grand Line's power was too intense to contain. Please try again, brave treasure hunter!*

🌊 *Even the greatest legends face cosmic storms...*
            `)
            .setColor('#E74C3C')
            .setFooter({ text: 'The adventure continues beyond any single setback!' });
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    ULTIMATE CINEMATIC ENGINE
// ═══════════════════════════════════════════════════════════════════

const CinematicMasterpiece = {
    // Extended timing for maximum suspense
    timing: {
        prologue: 1200,        // Slow atmospheric build
        awakening: 1000,       // Mystery deepens
        gathering: 800,        // Energy building
        storm: 600,            // Chaos increases
        rift: 1000,            // Dimensional opening
        revelation: 1500,      // The big reveal
        materialization: 1200,  // Character forming
        finale: 2000          // Epic celebration
    },

    // Advanced visual effects library
    visualLibrary: {
        ocean: {
            calm: ['〰️', '🌊', '〰️', '🌊', '〰️'],
            rough: ['🌊', '💨', '🌊', '💨', '🌊', '💨'],
            storm: ['🌩️', '⚡', '🌊', '💥', '⚡', '🌪️', '🌊'],
            tsunami: ['🌊', '💥', '🌊', '💥', '🌊', '💥', '🌊']
        },
        energy: {
            spark: ['✦', '✧', '✩', '✪', '✫'],
            charge: ['⚡', '🔥', '💥', '✨', '🌟'],
            overload: ['💥', '⚡', '🌟', '💫', '✨', '🔥', '💥'],
            cosmic: ['🌌', '💫', '⭐', '🌟', '✨', '🌠']
        },
        mystical: {
            glow: ['◯', '◉', '⦿', '●', '⭕'],
            crystal: ['💎', '💍', '💠', '🔮', '💎'],
            divine: ['🌟', '✨', '💫', '⭐', '🌠'],
            ancient: ['◊', '◈', '◇', '♦', '💎', '◊']
        },
        reality: {
            crack: ['⚡', '💥', '🌟', '💫', '⚡'],
            tear: ['🌌', '🌠', '💫', '⭐', '🌌'],
            collapse: ['💥', '🌪️', '⚡', '🌊', '💥'],
            rebirth: ['✨', '🌟', '💫', '🌠', '✨']
        }
    },

    // Advanced atmospheric color systems
    atmosphericSystems: {
        mysterious: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533a71'],
        awakening: ['#2c3e50', '#34495e', '#5d6d7e', '#85929e', '#aeb6bf'],
        building: ['#8e44ad', '#9b59b6', '#af7ac5', '#c39bd3', '#d7bde2'],
        storm: ['#e74c3c', '#ec7063', '#f1948a', '#f5b7b1', '#fadbd8'],
        cosmic: ['#3498db', '#5dade2', '#85c1e9', '#aed6f1', '#d6eaf8'],
        divine: ['#f39c12', '#f8c471', '#fdeaa7', '#fff5b4', '#fffdd0'],
        omnipotent: ['#9b59b6', '#bb8fce', '#d2b4de', '#e8daef', '#f4ecf7']
    },

    // Professional text animation system
    createEpicText(text, intensity = 1, style = 'normal') {
        const effects = {
            whisper: text.toLowerCase(),
            normal: text,
            emphasis: `*${text}*`,
            strong: `**${text}**`,
            bold: `***${text}***`,
            glowing: `✨ *${text}* ✨`,
            shining: `🌟 **${text}** 🌟`,
            blazing: `💫 ***${text}*** 💫`,
            cosmic: `🌌 ✨ **${text}** ✨ 🌌`,
            divine: `⭐ 🌟 ***${text}*** 🌟 ⭐`,
            omnipotent: `🌌 💫 ⭐ 🌟 ***${text}*** 🌟 ⭐ 💫 🌌`
        };

        if (intensity <= 1) return effects.whisper;
        if (intensity <= 2) return effects.normal;
        if (intensity <= 3) return effects.emphasis;
        if (intensity <= 4) return effects.strong;
        if (intensity <= 5) return effects.glowing;
        if (intensity <= 6) return effects.shining;
        if (intensity <= 7) return effects.blazing;
        if (intensity <= 8) return effects.cosmic;
        if (intensity <= 9) return effects.divine;
        return effects.omnipotent;
    },

    // Advanced frame creation with multiple styles
    createLegendaryFrame(content, frameStyle = 'simple', glowIntensity = 1, width = 50) {
        const frames = {
            simple: { corners: ['┌', '┐', '└', '┘'], h: '─', v: '│' },
            double: { corners: ['╔', '╗', '╚', '╝'], h: '═', v: '║' },
            ornate: { corners: ['◆', '◆', '◆', '◆'], h: '◈', v: '◇' },
            mystical: { corners: ['✦', '✦', '✦', '✦'], h: '✧', v: '✦' },
            divine: { corners: ['🌟', '🌟', '🌟', '🌟'], h: '✨', v: '💫' },
            cosmic: { corners: ['🌌', '🌌', '🌌', '🌌'], h: '💫', v: '⭐' },
            omnipotent: { corners: ['💎', '💎', '💎', '💎'], h: '🌟', v: '✨' }
        };

        const frame = frames[frameStyle] || frames.simple;
        const padding = Math.max(0, width - content.length - 4);
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        
        const topLine = frame.h.repeat(width);
        const contentLine = `${frame.v} ${' '.repeat(leftPad)}${content}${' '.repeat(rightPad)} ${frame.v}`;
        const bottomLine = frame.h.repeat(width);
        
        // Add progressive glow effects
        let glowEffect = '';
        if (glowIntensity > 3) {
            const glowChars = ['✨', '🌟', '💫', '⭐', '🌠'];
            const glow = glowChars[Math.min(glowIntensity - 4, glowChars.length - 1)];
            glowEffect = glow.repeat(Math.min(glowIntensity - 2, 8));
        }
        
        return glowEffect ? 
            `\`\`\`\n${glowEffect}\n${topLine}\n${contentLine}\n${bottomLine}\n${glowEffect}\n\`\`\`` :
            `\`\`\`\n${topLine}\n${contentLine}\n${bottomLine}\n\`\`\``;
    },

    // Advanced particle field generator
    createParticleStorm(intensity, effect = 'energy', pattern = 'random') {
        const particles = this.visualLibrary[effect] || this.visualLibrary.energy.spark;
        const maxIntensity = Math.min(intensity, 15);
        const lines = [];
        
        for (let row = 0; row < 4; row++) {
            let line = '';
            const particleCount = Math.floor(maxIntensity * (0.5 + Math.random()));
            
            for (let i = 0; i < particleCount; i++) {
                if (pattern === 'wave') {
                    const wavePos = Math.sin((i + row) * 0.5) * 2;
                    line += ' '.repeat(Math.max(0, Math.floor(wavePos))) + 
                           particles[Math.floor(Math.random() * particles.length)] + ' ';
                } else {
                    line += particles[Math.floor(Math.random() * particles.length)] + ' ';
                }
            }
            lines.push(line.trim());
        }
        
        return lines.join('\n');
    },

    // Dynamic color progression
    getEvolutionColor(phase, frame, maxFrames, rarity = null) {
        const systems = this.atmosphericSystems;
        const progress = frame / maxFrames;
        
        if (rarity && phase >= 6) {
            // Use rarity-specific colors for final phases
            const rarityColors = {
                omnipotent: systems.omnipotent,
                mythical: systems.divine,
                legendary: systems.cosmic,
                rare: systems.building,
                uncommon: systems.awakening,
                common: systems.mysterious
            };
            const colors = rarityColors[rarity] || systems.mysterious;
            return colors[Math.floor(progress * (colors.length - 1))];
        }
        
        const phaseColors = [
            systems.mysterious,   // Phase 1: Prologue
            systems.awakening,    // Phase 2: Awakening  
            systems.building,     // Phase 3: Gathering
            systems.storm,        // Phase 4: Storm
            systems.cosmic,       // Phase 5: Rift
            systems.divine,       // Phase 6: Revelation
            systems.omnipotent    // Phase 7+: Epic
        ];
        
        const colors = phaseColors[Math.min(phase, phaseColors.length - 1)];
        return colors[Math.floor(progress * (colors.length - 1))];
    },

    // Advanced typing effect with delays
    createTypingEffect(text, frame, totalFrames, style = 'typewriter') {
        const progress = Math.min(frame / totalFrames, 1);
        const visibleChars = Math.floor(text.length * progress);
        const visible = text.slice(0, visibleChars);
        
        if (style === 'typewriter') {
            const cursor = frame % 20 < 10 ? '|' : ' ';
            return visible + cursor;
        } else if (style === 'decode') {
            const remaining = text.length - visibleChars;
            const scrambled = '◆'.repeat(remaining);
            return visible + scrambled;
        } else if (style === 'reveal') {
            const remaining = text.length - visibleChars;
            const hidden = '█'.repeat(remaining);
            return visible + hidden;
        }
        
        return visible;
    }
};

// ═══════════════════════════════════════════════════════════════════
//                         EPIC ANIMATION PHASES
// ═══════════════════════════════════════════════════════════════════

// PHASE 1: The Prologue (10 frames, ~12 seconds)
function createEpicPrologue(frame) {
    const prologueMessages = [
        "In the vast expanse of the Grand Line...",
        "Where legends sleep beneath the waves...",
        "Ancient powers stir in the darkness...",
        "The sea itself holds its breath...",
        "For something extraordinary approaches...",
        "A call echoes through the void...",
        "Destiny prepares to unveil its secrets...",
        "The very fabric of reality trembles...",
        "And from the depths of eternity...",
        "A legendary presence awakens..."
    ];
    
    const message = prologueMessages[Math.min(frame, prologueMessages.length - 1)];
    const typedMessage = CinematicMasterpiece.createTypingEffect(message, frame * 3, 20, 'typewriter');
    const styledMessage = CinematicMasterpiece.createEpicText(typedMessage, Math.floor(frame / 2) + 1);
    
    const oceanEffect = CinematicMasterpiece.visualLibrary.ocean.calm[frame % 5];
    const mysticalField = CinematicMasterpiece.createParticleStorm(frame + 1, 'mystical', 'wave');
    const color = CinematicMasterpiece.getEvolutionColor(1, frame, 10);
    
    return new EmbedBuilder()
        .setTitle('🏴‍☠️ The Grand Line Calls...')
        .setDescription(`
${oceanEffect.repeat(10)}

${CinematicMasterpiece.createLegendaryFrame(styledMessage, 'simple', frame)}

${mysticalField}

*The ancient sea whispers of legends yet to be born...*
        `)
        .setColor(color)
        .setFooter({ text: `📖 Prologue: ${frame + 1}/10 | The story begins...` });
}

// PHASE 2: The Awakening (8 frames, ~8 seconds)
function createCosmicAwakening(frame) {
    const awakeningMessages = [
        "⚡ The first spark ignites...",
        "🌟 Cosmic energy begins to flow...",
        "💫 Reality starts to bend...",
        "✨ Ancient seals weaken...",
        "🌌 The void responds to your call...",
        "💥 Dimensional barriers crack...",
        "⚡ POWER BEYOND IMAGINATION STIRS...",
        "🌠 THE AWAKENING HAS BEGUN!"
    ];
    
    const message = awakeningMessages[Math.min(frame, awakeningMessages.length - 1)];
    const intensity = Math.floor(frame / 2) + 2;
    const styledMessage = CinematicMasterpiece.createEpicText(message, intensity);
    
    const energyStorm = CinematicMasterpiece.createParticleStorm(frame + 3, 'energy', 'random');
    const glowEffect = CinematicMasterpiece.visualLibrary.mystical.glow[frame % 5];
    const color = CinematicMasterpiece.getEvolutionColor(2, frame, 8);
    
    return new EmbedBuilder()
        .setTitle(`⚡ ${CinematicMasterpiece.createEpicText('COSMIC AWAKENING', intensity)} ⚡`)
        .setDescription(`
${glowEffect.repeat(12)}

${CinematicMasterpiece.createLegendaryFrame(styledMessage, 'ornate', intensity)}

${energyStorm}

*The Grand Line trembles as ancient forces awaken!*
        `)
        .setColor(color)
        .setFooter({ text: `⚡ Awakening Phase: ${frame + 1}/8 | Power Level Rising...` });
}

// PHASE 3: Energy Gathering (10 frames, ~8 seconds)
function createEnergyGathering(frame) {
    const gatheringMessages = [
        "🌩️ Storm clouds gather from all horizons...",
        "⚡ Lightning begins to dance across the sky...",
        "🌊 The ocean itself rises in response...",
        "💥 Thunder echoes through dimensions...",
        "🌪️ Reality warps around the gathering power...",
        "⚡ Energy cascades from the heavens...",
        "🌩️ The very air crackles with potential...",
        "💥 Space and time begin to FRACTURE...",
        "⚡ COSMIC FORCES ALIGN IN PERFECT HARMONY...",
        "🌌 THE GATHERING REACHES CRITICAL MASS!"
    ];
    
    const message = gatheringMessages[Math.min(frame, gatheringMessages.length - 1)];
    const intensity = Math.floor(frame / 2) + 3;
    const styledMessage = CinematicMasterpiece.createEpicText(message, intensity);
    
    const stormEffect = CinematicMasterpiece.createParticleStorm(frame + 5, 'energy', 'wave');
    const lightningField = CinematicMasterpiece.visualLibrary.energy.overload[frame % 7];
    const color = CinematicMasterpiece.getEvolutionColor(3, frame, 10);
    
    return new EmbedBuilder()
        .setTitle(`🌩️ ${CinematicMasterpiece.createEpicText('ENERGY GATHERING', intensity)} 🌩️`)
        .setDescription(`
${lightningField.repeat(15)}

${CinematicMasterpiece.createLegendaryFrame(styledMessage, 'mystical', intensity)}

${stormEffect}

*The universe itself bends to accommodate this incredible power!*
        `)
        .setColor(color)
        .setFooter({ text: `🌩️ Energy Level: ${Math.floor((frame / 10) * 100)}% | BRACE FOR IMPACT!` });
}

// PHASE 4: The Great Storm (12 frames, ~7 seconds)
function createGreatStorm(frame) {
    const stormMessages = [
        "🌊 Massive waves crash against reality itself...",
        "⚡ Lightning tears through the fabric of space...",
        "🌪️ A cosmic hurricane forms around you...",
        "💥 Reality SHATTERS and REBUILDS repeatedly...",
        "🌩️ The storm reaches UNIMAGINABLE proportions...",
        "⚡ Chaos and order dance in perfect balance...",
        "🌊 The ocean becomes a sea of pure energy...",
        "💥 DIMENSIONAL BARRIERS EXPLODE OUTWARD...",
        "🌪️ THE STORM BECOMES A LIVING ENTITY...",
        "⚡ TIME ITSELF BENDS TO THE STORM'S WILL...",
        "🌩️ REALITY SCREAMS AS IT TEARS APART...",
        "💥 THE STORM REACHES ITS ULTIMATE CRESCENDO!"
    ];
    
    const message = stormMessages[Math.min(frame, stormMessages.length - 1)];
    const intensity = Math.floor(frame / 2) + 4;
    const styledMessage = CinematicMasterpiece.createEpicText(message, intensity);
    
    const chaosField = CinematicMasterpiece.createParticleStorm(frame + 8, 'reality', 'random');
    const stormCore = CinematicMasterpiece.visualLibrary.ocean.tsunami[frame % 7];
    const color = CinematicMasterpiece.getEvolutionColor(4, frame, 12);
    
    return new EmbedBuilder()
        .setTitle(`🌪️ ${CinematicMasterpiece.createEpicText('THE GREAT STORM', intensity)} 🌪️`)
        .setDescription(`
${stormCore.repeat(18)}

${CinematicMasterpiece.createLegendaryFrame(styledMessage, 'divine', intensity)}

${chaosField}

*The Grand Line itself ROARS with primal fury!*
        `)
        .setColor(color)
        .setFooter({ text: `🌪️ Storm Intensity: ${Math.floor((frame / 12) * 100)}% | CHAOS INCARNATE!` });
}

// PHASE 5: Dimensional Rift (8 frames, ~8 seconds)
function createDimensionalRift(frame) {
    const riftMessages = [
        "🌌 A crack appears in the void...",
        "💫 The rift widens, revealing infinite possibilities...",
        "⭐ Cosmic light pours through the opening...",
        "🌠 Time and space collapse into singularity...",
        "🌌 The dimensional barrier SHATTERS completely...",
        "💫 Infinite realities converge at this point...",
        "⭐ THE VOID ITSELF ANSWERS YOUR SUMMONS...",
        "🌠 OMNIPOTENT FORCES BREACH INTO REALITY!"
    ];
    
    const message = riftMessages[Math.min(frame, riftMessages.length - 1)];
    const intensity = frame + 5;
    const styledMessage = CinematicMasterpiece.createEpicText(message, intensity);
    
    const cosmicField = CinematicMasterpiece.createParticleStorm(frame + 10, 'mystical', 'wave');
    const voidEffect = CinematicMasterpiece.visualLibrary.reality.tear[frame % 5];
    const color = CinematicMasterpiece.getEvolutionColor(5, frame, 8);
    
    return new EmbedBuilder()
        .setTitle(`🌌 ${CinematicMasterpiece.createEpicText('DIMENSIONAL BREACH', intensity)} 🌌`)
        .setDescription(`
${voidEffect.repeat(20)}

${CinematicMasterpiece.createLegendaryFrame(styledMessage, 'cosmic', intensity)}

${cosmicField}

*What unimaginable power will emerge from beyond the veil?*
        `)
        .setColor(color)
        .setFooter({ text: `🌌 Dimensional Integrity: ${100 - Math.floor((frame / 8) * 100)}% | REALITY COMPROMISED!` });
}

// PHASE 6: The Great Revelation (Dynamic based on rarity)
async function createGreatRevelation(interaction, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const revealFrames = {
        common: 5, uncommon: 6, rare: 7, 
        legendary: 9, mythical: 12, omnipotent: 15
    }[rarity] || 5;
    
    for (let frame = 0; frame < revealFrames; frame++) {
        const intensity = frame + 6;
        const progress = frame / revealFrames;
        
        // Progressive reveal of rarity name
        const hiddenText = '◆'.repeat(config.name.length);
        const revealedChars = Math.floor(config.name.length * progress);
        const partialReveal = config.name.slice(0, revealedChars) + hiddenText.slice(revealedChars);
        
        let displayText;
        if (frame < 2) {
            displayText = '???';
        } else if (frame < revealFrames - 2) {
            displayText = partialReveal;
        } else {
            displayText = config.name.toUpperCase();
        }
        
        const styledText = CinematicMasterpiece.createEpicText(displayText, intensity);
        
        // Rarity-specific revelation effects
        let revelationEffect = '';
        let revelationMessage = '';
        
        if (rarity === 'omnipotent') {
            revelationEffect = '🌌'.repeat(20) + '\n' + '💫'.repeat(15) + '\n' + '⭐'.repeat(12) + '\n' + '🌟'.repeat(10);
            revelationMessage = frame >= revealFrames - 1 ? 
                '*THE MULTIVERSE ITSELF KNEELS BEFORE THIS OMNIPOTENT BEING!*' :
                '*Reality bends and reshapes itself...*';
        } else if (rarity === 'mythical') {
            revelationEffect = '🔮'.repeat(15) + '\n' + '✨'.repeat(12) + '\n' + '🌟'.repeat(10);
            revelationMessage = frame >= revealFrames - 1 ? 
                '*MYTHICAL LEGENDS TRANSCEND THE BOUNDARIES OF POSSIBILITY!*' :
                '*Ancient powers surge through dimensions...*';
        } else if (rarity === 'legendary') {
            revelationEffect = '👑'.repeat(12) + '\n' + '⚡'.repeat(10) + '\n' + '🔥'.repeat(8);
            revelationMessage = frame >= revealFrames - 1 ? 
                '*LEGENDARY HEROES RESHAPE THE COURSE OF HISTORY!*' :
                '*Heroic power radiates through time and space...*';
        } else {
            revelationEffect = config.emoji.repeat(Math.min(frame + 6, 15));
            revelationMessage = frame >= revealFrames - 1 ? 
                `*${config.description}*` :
                '*The truth emerges from the cosmic void...*';
        }
        
        const color = frame < 3 ? '#1a1a1a' : 
                     CinematicMasterpiece.getEvolutionColor(6, frame, revealFrames, rarity);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} THE GREAT REVELATION ${config.emoji}`)
            .setDescription(`
${revelationEffect}

${CinematicMasterpiece.createLegendaryFrame(styledText, 'omnipotent', intensity)}

${config.stars.repeat(Math.min(frame + 2, 8))}

${revelationMessage}
            `)
            .setColor(color)
            .setFooter({ 
                text: frame >= revealFrames - 1 ? 
                    `${config.stars} ${config.name.toUpperCase()} POWER CONFIRMED! ${config.stars}` :
                    `Revelation Progress: ${Math.floor(progress * 100)}% | Truth Emerges...`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 
            CinematicMasterpiece.timing.revelation - (frame * 100)
        ));
    }
}

// PHASE 7: Devil Fruit Materialization (8 frames, ~10 seconds)
async function createDevilFruitMaterialization(interaction, devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    const materializationFrames = 8;
    
    for (let frame = 0; frame < materializationFrames; frame++) {
        const intensity = frame + 7;
        const progress = frame / (materializationFrames - 1);
        
        // Progressive Devil Fruit name reveal with special effects
        const nameReveal = CinematicMasterpiece.createTypingEffect(
            devilFruit.name, frame * 3, 20, 'decode'
        );
        const styledName = CinematicMasterpiece.createEpicText(nameReveal, intensity);
        
        // Materialization stages with epic descriptions
        const stages = [
            "A mysterious fruit begins to coalesce from the void...",
            "Ancient patterns start to form on its surface...",
            "The fruit gains supernatural essence and power...",
            "Legendary aura radiates from the Devil Fruit...",
            "Immense power flows through its very being...",
            "Its true form becomes crystal clear...",
            "The Devil Fruit manifests in all its glory...",
            "MATERIALIZATION ACHIEVED PERFECTLY!"
        ];
        
        const stage = stages[frame];
        const styledStage = CinematicMasterpiece.createEpicText(stage, intensity);
        
        // Progressive information reveal
        const infoLines = [
            `**Type:** ${frame >= 2 ? devilFruit.type : '???'}`,
            `**Current User:** ${frame >= 3 ? devilFruit.user : '???'}`,
            `**Power:** ${frame >= 4 ? devilFruit.power : '???'}`,
            `**Awakening:** ${frame >= 5 ? devilFruit.awakening : '???'}`,
            `**Weakness:** ${frame >= 6 ? devilFruit.weakness : '???'}`,
            `**Power Level:** ${frame >= 7 ? devilFruit.powerLevel.toLocaleString() : '???'}`
        ];
        
        const materializationField = CinematicMasterpiece.createParticleStorm(
            frame + 12, 'reality', 'wave'
        );
        const color = CinematicMasterpiece.getEvolutionColor(7, frame, 8, rarity);
        
        const embed = new EmbedBuilder()
            .setTitle(`${config.emoji} DEVIL FRUIT MATERIALIZATION ${config.emoji}`)
            .setDescription(`
${materializationField}

${CinematicMasterpiece.createLegendaryFrame(styledName, 'omnipotent', intensity)}

**${styledStage}**

${infoLines.join('\n')}

${config.stars.repeat(Math.min(frame + 3, 8))}
            `)
            .setColor(color)
            .setFooter({ 
                text: `Materialization: ${Math.floor(progress * 100)}% | ${config.power} Energy Detected`
            });

        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.materialization));
    }
}

// PHASE 8: The Ultimate Finale (Epic celebration)
function createUltimateFinale(character, rarity, interaction) {
    const config = CharacterDatabase.getRarityConfig(rarity);
    
    // Rarity-specific ultimate celebrations
    const finaleSpectaculars = {
        omnipotent: {
            title: '🌌 OMNIPOTENT DEITY SUMMONED! 🌌',
            subtitle: '✨ REALITY ITSELF BOWS TO YOUR SUPREME POWER! ✨',
            effect: '🌌💫⭐🌟💫🌌💫⭐🌟💫🌌💫⭐🌟💫🌌',
            celebration: 'THE ENTIRE MULTIVERSE ACKNOWLEDGES YOUR DOMINION!',
            description: 'You have summoned a being beyond mortal comprehension!'
        },
        mythical: {
            title: '🔮 MYTHICAL LEGEND INCARNATED! 🔮',
            subtitle: '⚡ ANCIENT POWERS FLOW THROUGH YOUR VERY SOUL! ⚡',
            effect: '🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮✨🌟💎🌟✨🔮',
            celebration: 'LEGENDS ACROSS ALL AGES SING YOUR NAME!',
            description: 'A mythical being of immense power has answered your call!'
        },
        legendary: {
            title: '👑 LEGENDARY HERO ASCENDANT! 👑',
            subtitle: '🔥 HISTORY WILL FOREVER REMEMBER THIS GLORIOUS MOMENT! 🔥',
            effect: '👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑⚡🔥🌟🔥⚡👑',
            celebration: 'EPIC GLORY TRANSCENDS TIME AND SPACE!',
            description: 'A legendary hero whose name echoes through eternity!'
        },
        rare: {
            title: '💎 RARE CHAMPION EMERGES! 💎',
            subtitle: '✨ EXCEPTIONAL POWER JOINS YOUR LEGENDARY FLEET! ✨',
            effect: '💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎🌟✨⭐✨🌟💎',
            celebration: 'REMARKABLE STRENGTH FLOWS THROUGH YOUR RANKS!',
            description: 'A rare warrior of exceptional skill and power!'
        },
        uncommon: {
            title: '🌟 SKILLED WARRIOR MANIFESTS! 🌟',
            subtitle: '⭐ PROMISING POTENTIAL AWAITS YOUR COMMAND! ⭐',
            effect: '🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟⭐✨💫✨⭐🌟',
            celebration: 'RISING STARS ILLUMINATE YOUR PATH!',
            description: 'A skilled pirate with untapped potential!'
        },
        common: {
            title: '⚓ RELIABLE CREW MEMBER JOINS! ⚓',
            subtitle: '⭐ EVERY LEGEND NEEDS A STRONG FOUNDATION! ⭐',
            effect: '⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓⭐🌊⭐🌊⭐⚓',
            celebration: 'SOLID FOUNDATIONS BUILD ETERNAL LEGENDS!',
            description: 'A dependable crew member ready for adventure!'
        }
    };
    
    const finale = finaleSpectaculars[rarity] || finaleSpectaculars.common;
    const epicName = CinematicMasterpiece.createEpicText(character.name, 10);
    
    // Create epic character card
    const characterCard = `
╔════════════════════════════════════════════╗
║ 👑 **${character.title.padEnd(30)}**     ║
║ ⚓ **Crew:** ${character.crew.padEnd(25)}     ║
║ 💰 **Bounty:** ${character.bounty.padEnd(22)} Berry ║  
║ 🍎 **Devil Fruit:** ${character.devilFruit.padEnd(18)}     ║
║ ⚡ **Specialty:** ${character.specialty.padEnd(20)}     ║
║ 🔥 **Power Level:** ${character.powerLevel.toLocaleString().padEnd(15)}     ║
║ ⭐ **Rarity:** ${config.name.padEnd(23)}     ║
╚════════════════════════════════════════════╝`;

    const description = `
${finale.effect}

${CinematicMasterpiece.createLegendaryFrame(epicName, 'omnipotent', 10)}

**${finale.title}**
*${finale.subtitle}*

${characterCard}

${config.stars.repeat(10)}

🏆 **${finale.celebration}** 🏆
🎊 **CONGRATULATIONS ${interaction.user.username.toUpperCase()}!** 🎊

*${finale.description}*

> **"${character.quote}"**

${finale.effect}
    `;

    // Create enhanced action row with more options
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pull_again')
                .setLabel('🏴‍☠️ Set Sail Again!')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⚓'),
            new ButtonBuilder()
                .setCustomId('view_crew')
                .setLabel('👥 View Fleet')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📚'),
            new ButtonBuilder()
                .setCustomId('character_details')
                .setLabel('📊 Character Details')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🔍')
        );

    return {
        embed: new EmbedBuilder()
            .setTitle(`${config.emoji} ${epicName} ${config.emoji}`)
            .setDescription(description)
            .setColor(config.color)
            .setFooter({ 
                text: `🌊 One Piece Ultimate Gacha | Epic summon by ${interaction.user.username} | ${new Date().toLocaleTimeString()}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(),
        components: [actionRow]
    };
}

// ═══════════════════════════════════════════════════════════════════
//                    MASTER ANIMATION ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════

async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results for consistent timing
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 ULTIMATE GACHA: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Epic Prologue (10 frames, ~12 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEpicPrologue(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.prologue));
        }
        
        // PHASE 2: Cosmic Awakening (8 frames, ~8 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createCosmicAwakening(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.awakening));
        }
        
        // PHASE 3: Energy Gathering (10 frames, ~8 seconds)
        for (let frame = 0; frame < 10; frame++) {
            const embed = createEnergyGathering(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.gathering));
        }
        
        // PHASE 4: The Great Storm (12 frames, ~7 seconds)
        for (let frame = 0; frame < 12; frame++) {
            const embed = createGreatStorm(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.storm));
        }
        
        // PHASE 5: Dimensional Rift (8 frames, ~8 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createDimensionalRift(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, CinematicMasterpiece.timing.rift));
        }
        
        // PHASE 6: The Great Revelation (dynamic duration based on rarity)
        await createGreatRevelation(interaction, rarity);
        
        // PHASE 7: Devil Fruit Materialization (8 frames, ~10 seconds)
        await createDevilFruitMaterialization(interaction, devilFruit, rarity);
        
        // PHASE 8: Ultimate Finale (permanent display)
        const finale = createUltimateFinale(devilFruit, rarity, interaction);
        await interaction.editReply({ 
            embeds: [finale.embed], 
            components: finale.components 
        });
        
        // Log the epic result
        console.log(`🎊 EPIC SUCCESS: ${devilFruit.name} (${rarity}, ${devilFruit.powerLevel} power) discovered by ${interaction.user.username}!`);
        
    } catch (error) {
        console.error('🚨 Ultimate Cinematic Error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ The Cosmic Forces Were Too Powerful!')
            .setDescription(`
The dimensional rift became unstable during the summoning!

**Error:** \`${error.message}\`

*The Grand Line's power was too intense to contain. Please try again, brave admiral!*

🌊 *Even the greatest legends face cosmic storms...*
            `)
            .setColor('#E74C3C')
            .setFooter({ text: 'The adventure continues beyond any single setback!' });
            
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
}

module.exports = {
    createUltimateCinematicExperience,
    CinematicMasterpiece
};
