const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DevilFruitDatabase } = require('../data/devilfruit');

// ═══════════════════════════════════════════════════════════════════
//                    CLEAN PROFESSIONAL ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

const CleanEngine = {
    // 120+ ULTRA-DIVERSE COLORS for lightning-fast cycling
    hyperColors: [
        '#FF0000', '#FF1100', '#FF2200', '#FF3300', '#FF4400', '#FF5500', '#FF6600', '#FF7700',
        '#FF8800', '#FF9900', '#FFAA00', '#FFBB00', '#FFCC00', '#FFDD00', '#FFEE00', '#FFFF00',
        '#EEFF00', '#DDFF00', '#CCFF00', '#BBFF00', '#AAFF00', '#99FF00', '#88FF00', '#77FF00',
        '#66FF00', '#55FF00', '#44FF00', '#33FF00', '#22FF00', '#11FF00', '#00FF00', '#00FF11',
        '#00FF22', '#00FF33', '#00FF44', '#00FF55', '#00FF66', '#00FF77', '#00FF88', '#00FF99',
        '#00FFAA', '#00FFBB', '#00FFCC', '#00FFDD', '#00FFEE', '#00FFFF', '#00EEFF', '#00DDFF',
        '#00CCFF', '#00BBFF', '#00AAFF', '#0099FF', '#0088FF', '#0077FF', '#0066FF', '#0055FF',
        '#0044FF', '#0033FF', '#0022FF', '#0011FF', '#0000FF', '#1100FF', '#2200FF', '#3300FF',
        '#4400FF', '#5500FF', '#6600FF', '#7700FF', '#8800FF', '#9900FF', '#AA00FF', '#BB00FF',
        '#CC00FF', '#DD00FF', '#EE00FF', '#FF00FF', '#FF00EE', '#FF00DD', '#FF00CC', '#FF00BB',
        '#FF00AA', '#FF0099', '#FF0088', '#FF0077', '#FF0066', '#FF0055', '#FF0044', '#FF0033',
        '#FF0022', '#FF0011', '#8B0000', '#DC143C', '#B22222', '#CD5C5C', '#F08080', '#FA8072',
        '#E9967A', '#FFA07A', '#FF7F50', '#FF6347', '#FF4500', '#FFD700', '#FFFF00', '#ADFF2F',
        '#7FFF00', '#32CD32', '#00FF7F', '#00FA9A', '#40E0D0', '#00CED1', '#5F9EA0', '#4682B4',
        '#6495ED', '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#0000FF', '#0000CD', '#4169E1'
    ],

    // ULTRA-FAST color cycling
    getHyperColor(frame, intensity = 1) {
        const stream1 = (frame * 17 + intensity * 23) % this.hyperColors.length;
        const stream2 = (frame * 31 + intensity * 41) % this.hyperColors.length;
        const combinedIndex = (stream1 + stream2) % this.hyperColors.length;
        return this.hyperColors[combinedIndex];
    },

    // Epic Canvas Devil Fruit Card Generator
    async createEpicCanvasFinale(devilFruit, rarity) {
        const config = DevilFruitDatabase.getRarityConfig(rarity);
        
        // Create high-resolution canvas
        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext('2d');
        
        // Rarity-based backgrounds and effects
        const rarityStyles = {
            omnipotent: {
                bg: ['#000000', '#4B0082', '#8B00FF', '#9400D3'],
                glow: '#FF00FF',
                particles: '#FFFFFF',
                border: '#FFD700'
            },
            mythical: {
                bg: ['#8B0000', '#DC143C', '#FF4500', '#FF6347'],
                glow: '#FF0000',
                particles: '#FFD700',
                border: '#FF4500'
            },
            legendary: {
                bg: ['#FF8C00', '#FFD700', '#FFA500', '#FFFF00'],
                glow: '#FFD700',
                particles: '#FFFFFF',
                border: '#FFD700'
            },
            rare: {
                bg: ['#4169E1', '#0000FF', '#1E90FF', '#00BFFF'],
                glow: '#00BFFF',
                particles: '#FFFFFF',
                border: '#0000FF'
            },
            uncommon: {
                bg: ['#32CD32', '#00FF00', '#7FFF00', '#ADFF2F'],
                glow: '#00FF00',
                particles: '#FFFFFF',
                border: '#32CD32'
            },
            common: {
                bg: ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3'],
                glow: '#FFFFFF',
                particles: '#E0E0E0',
                border: '#808080'
            }
        };
        
        const style = rarityStyles[rarity] || rarityStyles.common;
        
        // Create gradient background based on rarity
        const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
        gradient.addColorStop(0, style.bg[0]);
        gradient.addColorStop(0.3, style.bg[1]);
        gradient.addColorStop(0.6, style.bg[2]);
        gradient.addColorStop(1, style.bg[3]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Add particle effects
        this.drawParticleField(ctx, style.particles, rarity);
        
        // Draw main Devil Fruit circle with glow effect
        this.drawGlowingCircle(ctx, 400, 200, 120, style.glow, style.border);
        
        // Devil Fruit emoji/icon (large)
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText('🍈', 400, 220);
        ctx.fillText('🍈', 400, 220);
        
        // Rarity badge with effects
        this.drawRarityBadge(ctx, rarity, config, style);
        
        // Devil Fruit name with epic styling
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(devilFruit.name, 400, 280);
        ctx.fillText(devilFruit.name, 400, 280);
        
        // Type information
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = style.glow;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeText(`Type: ${devilFruit.type}`, 400, 320);
        ctx.fillText(`Type: ${devilFruit.type}`, 400, 320);
        
        // User information
        if (devilFruit.user) {
            ctx.strokeText(`User: ${devilFruit.user}`, 400, 350);
            ctx.fillText(`User: ${devilFruit.user}`, 400, 350);
        }
        
        // Power description (wrapped text)
        this.drawWrappedText(ctx, devilFruit.power, 400, 390, 600, 20, '#FFFFFF', '#000000');
        
        // Epic border with pulsing effect
        this.drawEpicBorder(ctx, style.border, rarity);
        
        // Rarity watermark
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = style.glow + '80'; // Semi-transparent
        ctx.textAlign = 'right';
        ctx.fillText(`${config.name.toUpperCase()} CLASS`, 780, 580);
        
        return canvas.toBuffer('image/png');
    },
    
    // Draw particle field based on rarity
    drawParticleField(ctx, color, rarity) {
        const particleCount = {
            omnipotent: 200,
            mythical: 150,
            legendary: 100,
            rare: 70,
            uncommon: 50,
            common: 30
        };
        
        const count = particleCount[rarity] || 30;
        
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            const size = Math.random() * 3 + 1;
            
            ctx.fillStyle = color + Math.floor(Math.random() * 100 + 50).toString(16);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
    },
    
    // Draw glowing circle effect
    drawGlowingCircle(ctx, x, y, radius, glowColor, borderColor) {
        // Outer glow
        const glowGradient = ctx.createRadialGradient(x, y, radius - 20, x, y, radius + 30);
        glowGradient.addColorStop(0, glowColor + '00');
        glowGradient.addColorStop(0.5, glowColor + '40');
        glowGradient.addColorStop(1, glowColor + '00');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius + 30, 0, 2 * Math.PI);
        ctx.fill();
        
        // Main circle
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    },
    
    // Draw rarity badge
    drawRarityBadge(ctx, rarity, config, style) {
        const badgeX = 400;
        const badgeY = 450;
        
        // Badge background
        ctx.fillStyle = style.bg[0] + 'CC';
        ctx.strokeStyle = style.border;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(badgeX - 100, badgeY - 20, 200, 40, 20);
        ctx.fill();
        ctx.stroke();
        
        // Badge text
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = style.glow;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeText(`${config.emoji} ${config.name.toUpperCase()} ${config.emoji}`, badgeX, badgeY + 7);
        ctx.fillText(`${config.emoji} ${config.name.toUpperCase()} ${config.emoji}`, badgeX, badgeY + 7);
    },
    
    // Draw wrapped text
    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, fillColor, strokeColor) {
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                ctx.strokeText(line, x, currentY);
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.strokeText(line, x, currentY);
        ctx.fillText(line, x, currentY);
    },
    
    // Draw epic border
    drawEpicBorder(ctx, color, rarity) {
        const thickness = {
            omnipotent: 8,
            mythical: 6,
            legendary: 5,
            rare: 4,
            uncommon: 3,
            common: 2
        };
        
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness[rarity] || 2;
        ctx.strokeRect(10, 10, 780, 580);
        
        // Corner decorations for high rarities
        if (['omnipotent', 'mythical', 'legendary'].includes(rarity)) {
            ctx.fillStyle = color;
            const cornerSize = 20;
            
            // Top-left
            ctx.fillRect(10, 10, cornerSize, cornerSize);
            // Top-right  
            ctx.fillRect(770, 10, cornerSize, cornerSize);
            // Bottom-left
            ctx.fillRect(10, 570, cornerSize, cornerSize);
            // Bottom-right
            ctx.fillRect(770, 570, cornerSize, cornerSize);
        }
    },

    // Clean particle effects - no overload
    createCleanParticles(intensity) {
        const particles = ['⚡', '✨', '💫', '🔥', '💥', '⭐'];
        const count = Math.min(intensity + 4, 8);
        return particles.slice(0, count).join('');
    },

    // Single clean charging bar
    createSingleChargingBar(percentage, frame) {
        const barLength = 20;
        const filled = Math.floor((percentage / 100) * barLength);
        const empty = barLength - filled;
        
        const filledBar = '█'.repeat(filled);
        const emptyBar = '░'.repeat(empty);
        
        // Pulsing effect on the edge
        const sparkle = percentage > 80 ? '✨' : percentage > 50 ? '⚡' : '🔋';
        
        return `${sparkle} [${filledBar}${emptyBar}] ${percentage}%`;
    }
};

// PHASE 1: Energy Detection (6 frames, 1.5 seconds)
function createEnergyDetection(frame) {
    const percentage = Math.floor((frame / 5) * 25); // 0-25%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 2);
    
    const messages = [
        "🔍 Scanning the Grand Line for Devil Fruit energy...",
        "⚡ Mysterious power signature detected...",
        "🌊 Ancient energy stirring in the depths..."
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 3, 1))
        .setTitle('🔍 **DEVIL FRUIT ENERGY DETECTION** 🔍')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `🔋 Scanning... | ${percentage}% Complete` });
}

// PHASE 2: Power Surge (8 frames, 2 seconds)
function createPowerSurge(frame) {
    const percentage = 25 + Math.floor((frame / 7) * 40); // 25-65%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 6);
    
    const messages = [
        "💥 MASSIVE ENERGY SURGE DETECTED!",
        "🔥 Power levels climbing rapidly!",
        "⚡ Devil Fruit signature intensifying!",
        "✨ Extraordinary energy resonance confirmed!"
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 5 + 15, 2))
        .setTitle('💥 **POWER SURGE DETECTED** 💥')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `⚡ Power Surge | ${percentage}% Complete` });
}

// PHASE 3: Critical Phase (6 frames, 1.5 seconds)
function createCriticalPhase(frame) {
    const percentage = 65 + Math.floor((frame / 5) * 25); // 65-90%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 10);
    
    const messages = [
        "🌟 CRITICAL ENERGY THRESHOLD REACHED!",
        "💫 Power crystallization initiating...",
        "⭐ Devil Fruit formation beginning..."
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 7 + 30, 3))
        .setTitle('🌟 **CRITICAL PHASE ACTIVATED** 🌟')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `🌟 Critical Phase | ${percentage}% Complete` });
}

// PHASE 4: Final Materialization (6 frames, 1.5 seconds)
function createFinalMaterialization(frame) {
    const percentage = 90 + Math.floor((frame / 5) * 10); // 90-100%
    const chargingBar = CleanEngine.createSingleChargingBar(percentage, frame);
    const particles = CleanEngine.createCleanParticles(frame + 12);
    
    const messages = [
        "✨ Final materialization sequence...",
        "🍈 Devil Fruit taking physical form...",
        "💎 Manifestation complete!"
    ];
    
    const message = messages[Math.floor(frame / 2)] || messages[0];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 9 + 50, 4))
        .setTitle('✨ **FINAL MATERIALIZATION** ✨')
        .setDescription(`
${particles}

${chargingBar}

*${message}*
        `)
        .setFooter({ text: `✨ Materializing | ${percentage}% Complete` });
}

// PHASE 5: Devil Fruit Revelation (8 frames, 4 seconds)
function createDevilFruitRevelation(frame, devilFruit, rarity) {
    const particles = CleanEngine.createCleanParticles(15);
    
    const revealStages = [
        "🍈 A Devil Fruit emerges from the mist...",
        "🌀 The fruit's form becomes clearer...",
        "✨ Ancient power radiates from within...",
        "🔮 The Devil Fruit stabilizes...",
        "💫 Energy patterns are locking in...",
        "⚡ Power signature finalizing...",
        "🌟 The revelation is almost complete...",
        "✨ **DEVIL FRUIT MATERIALIZED!**"
    ];
    
    const currentReveal = revealStages[frame] || revealStages[revealStages.length - 1];
    
    return new EmbedBuilder()
        .setColor(CleanEngine.getHyperColor(frame * 11 + 70, 5))
        .setTitle(`🍈 **DEVIL FRUIT MATERIALIZATION** 🍈`)
        .setDescription(`
${particles}

🔋 [████████████████████] 100% ✨

*${currentReveal}*
        `)
        .setFooter({ text: `🍈 Materialization Complete | Ready for revelation...` });
}

// PHASE 6: Epic Finale (Text version for now)
function createEpicFinale(devilFruit, rarity) {
    const config = DevilFruitDatabase.getRarityConfig(rarity);
    
    const rarityMessages = {
        omnipotent: "🌌 **OMNIPOTENT CLASS ACQUIRED!** Reality itself bends to your will! The multiverse trembles! 🌌",
        mythical: "🔮 **MYTHICAL CLASS OBTAINED!** Ancient legends come to life! Gods whisper your name! 🔮",
        legendary: "⭐ **LEGENDARY CLASS DISCOVERED!** Epic power courses through your being! Heroes are born! ⭐",
        rare: "💎 **RARE CLASS SECURED!** Impressive abilities flow within you! Adventure awaits! 💎",
        uncommon: "🌟 **UNCOMMON CLASS UNLOCKED!** Notable power gained! Your journey begins! 🌟",
        common: "⚪ **DEVIL FRUIT ACQUIRED!** Every legend starts with a single step! Potential awaits! ⚪"
    };
    
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
    
    return {
        embeds: [new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`${config.emoji} **DEVIL FRUIT REVEALED!** ${config.emoji}`)
            .setDescription(`
${CleanEngine.createCleanParticles(20)}

${rarityMessages[rarity]}

**🍈 Name:** ${devilFruit.name}
**📋 Type:** ${devilFruit.type}
**👤 User:** ${devilFruit.user || 'Unknown'}
**⚡ Power:** ${devilFruit.power}
**💎 Class:** ${config.name}
**🌟 Level:** ${devilFruit.powerLevel || 'Mysterious'}

*${devilFruit.description || 'A mysterious Devil Fruit with incredible potential...'}*
            `)
            .setFooter({ text: `${config.emoji} Congratulations! You discovered a ${config.name} class Devil Fruit! ${config.emoji}` })],
        components
    };
}

// MAIN CLEAN ANIMATION CONTROLLER
async function createUltimateCinematicExperience(interaction) {
    try {
        // Pre-determine results
        const rarity = DevilFruitDatabase.calculateDropRarity();
        const devilFruit = DevilFruitDatabase.getRandomDevilFruit(rarity);
        
        console.log(`🎭 CLEAN HUNT: ${devilFruit.name} (${rarity}) for ${interaction.user.username}`);
        
        // PHASE 1: Energy Detection (6 frames, 1.5 seconds - ULTRA FAST)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createEnergyDetection(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Ultra fast!
        }
        
        // PHASE 2: Power Surge (8 frames, 2 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createPowerSurge(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Lightning fast!
        }
        
        // PHASE 3: Critical Phase (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createCriticalPhase(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Hyper fast!
        }
        
        // PHASE 4: Final Materialization (6 frames, 1.5 seconds)
        for (let frame = 0; frame < 6; frame++) {
            const embed = createFinalMaterialization(frame);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 250)); // Mega fast!
        }
        
        // PHASE 5: Devil Fruit Revelation (8 frames, 4 seconds)
        for (let frame = 0; frame < 8; frame++) {
            const embed = createDevilFruitRevelation(frame, devilFruit, rarity);
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 500)); // Slower for dramatic reveal
        }
        
        // PHASE 6: Epic Finale (permanent display)
        const finale = createEpicFinale(devilFruit, rarity);
        await interaction.editReply(finale);
        
        console.log(`🎊 CLEAN SUCCESS: ${devilFruit.name} (${rarity}) discovered by ${interaction.user.username}!`);
        
        return { devilFruit, rarity };
        
    } catch (error) {
        console.error('🚨 Clean Animation Error:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('⚠️ Hunt Failed!')
            .setDescription('The Devil Fruit energy was too chaotic! Please try again.')
            .setColor('#FF0000')
            .setFooter({ text: 'System Error | Please retry hunt' });
        
        await interaction.editReply({ embeds: [errorEmbed] });
        throw error;
    }
}

module.exports = {
    createUltimateCinematicExperience
};
