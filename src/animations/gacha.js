// FIXED: Bottom line identical to top line, embed synced to first square

async function updateAnimationFrame(interaction, frame, targetFruit, metrics) {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            metrics.frameAttempts++;
            
            // Calculate rainbow positions and colors for 20-square bars
            const barLength = 20;
            const positions = [];
            
            // Calculate the rainbow pattern
            for (let i = 0; i < barLength; i++) {
                const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
            
            // TOP and BOTTOM bars are IDENTICAL
            const topBar = positions.join(' ');
            const bottomBar = positions.join(' '); // Exact copy
            
            // EMBED COLOR: Sync with the FIRST SQUARE (position 0)
            let embedColor;
            if (frame < 16) {
                // Get the color index of the first square (position 0)
                const firstSquareColorIndex = (0 - frame + rainbowColors.length * 100) % rainbowColors.length;
                embedColor = rainbowEmbedColors[firstSquareColorIndex];
            } else if (frame < 17) {
                // Brief hint at rarity
                embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
            } else {
                // Final reveal
                embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
            }
            
            // Get changing indicators
            const indicators = getChangingIndicators(frame, targetFruit.rarity, targetFruit.type);
            
            // Get particles
            const particles = generateParticles();
            
            // Get dynamic animation text (changes every 3 frames)
            const dynamicText = getDynamicAnimationText(frame, targetFruit, 'main');
            
            // Create animation content with dynamic text
            const animationContent = `${topBar}\n\n` +
                `🌊 **GRAND LINE EXPLORATION** 🌊\n\n` +
                `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
                `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
                `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
                `${dynamicText}\n\n` +
                `${bottomBar}\n\n` +
                `${particles}`;
            
            const embed = new EmbedBuilder()
                .setTitle('🍈 Devil Fruit Hunt in Progress...')
                .setDescription(animationContent)
                .setColor(embedColor)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
            metrics.frameSuccesses++;
            return true;
            
        } catch (error) {
            console.log(`Animation frame ${frame} attempt ${attempt} error: ${error.message.includes('timeout') ? 'Discord API timeout' : error.message}`);
            
            if (attempt === maxRetries) {
                return false;
            }
            
            await sleep(200 * attempt);
        }
    }
    return false;
}

async function updateProgressionFrame(interaction, progFrame, targetFruit, metrics) {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            metrics.frameAttempts++;
            
            // Calculate rainbow positions for 20-square bars
            const barLength = 20;
            const positions = [];
            
            // Calculate the rainbow pattern
            for (let i = 0; i < barLength; i++) {
                const colorIndex = (i - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
            
            // TOP and BOTTOM bars are IDENTICAL
            const topBar = positions.join(' ');
            const bottomBar = positions.join(' '); // Exact copy
            
            // EMBED COLOR: Sync with first square
            const firstSquareColorIndex = (0 - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
            const embedColor = rainbowEmbedColors[firstSquareColorIndex];
            
            // Get indicators (more locked as progression continues)
            const indicators = getChangingIndicators(18 + progFrame, targetFruit.rarity, targetFruit.type);
            
            const particles = generateParticles('intense');
            
            // Get dynamic progression text
            const dynamicText = getDynamicAnimationText(progFrame, targetFruit, 'progression');
            
            const progressContent = `${topBar}\n\n` +
                `🌊 **POWER CRYSTALLIZING** 🌊\n\n` +
                `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
                `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
                `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
                `${dynamicText}\n\n` +
                `${bottomBar}\n\n` +
                `${particles}`;
            
            const embed = new EmbedBuilder()
                .setTitle('🔮 Power Crystallization Phase')
                .setDescription(progressContent)
                .setColor(embedColor)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
            metrics.frameSuccesses++;
            return true;
            
        } catch (error) {
            if (attempt === maxRetries) {
                return false;
            }
            await sleep(300 * attempt);
        }
    }
    return false;
}

async function updateTransitionFrame(interaction, transFrame, targetFruit, metrics) {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            metrics.frameAttempts++;
            
            // FIXED: Perfect center-outward conversion for 20-square bars
            const barLength = 20;
            const radius = transFrame;
            const positions = [];
            
            for (let i = 0; i < barLength; i++) {
                let useRewardColor = false;
                
                // FIXED: Use integer center positions for perfect symmetry
                // For 20 positions (0-19), center positions are 9 and 10
                const distanceFromCenter9 = Math.abs(i - 9);
                const distanceFromCenter10 = Math.abs(i - 10);
                const minDistanceFromCenter = Math.min(distanceFromCenter9, distanceFromCenter10);
                
                // Convert if within radius from either center point
                if (minDistanceFromCenter <= radius) {
                    useRewardColor = true;
                }
                
                if (useRewardColor) {
                    // Use reward color
                    positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
                } else {
                    // Still rainbow
                    const colorIndex = (i - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
                    positions.push(rainbowColors[colorIndex]);
                }
            }
            
            // TOP and BOTTOM bars are IDENTICAL
            const topBar = positions.join(' ');
            const bottomBar = positions.join(' '); // Exact copy
            
            // EMBED COLOR: Sync with first square or transition to rarity color
            let embedColor;
            if (transFrame > 5) {
                // Transition to rarity color
                embedColor = rarityColors[targetFruit.rarity]?.embed || 0x8B4513;
            } else {
                // Sync with first square
                const firstSquareColorIndex = (0 - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
                embedColor = rainbowEmbedColors[firstSquareColorIndex];
            }
            
            const particles = generateParticles('crystallizing');
            
            // Get dynamic transition text
            const dynamicText = getDynamicAnimationText(transFrame, targetFruit, 'transition');
            
            const transitionContent = `${topBar}\n\n` +
                `⚡ **CRYSTALLIZING INTO REALITY** ⚡\n\n` +
                `${dynamicText}\n\n` +
                `${bottomBar}\n\n` +
                `${particles}`;
            
            const embed = new EmbedBuilder()
                .setTitle('⚡ Final Crystallization')
                .setDescription(transitionContent)
                .setColor(embedColor)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
            metrics.frameSuccesses++;
            return true;
            
        } catch (error) {
            if (attempt === maxRetries) {
                return false;
            }
            await sleep(400 * attempt);
        }
    }
    return false;
}

// BUTTON VERSIONS with same identical pattern

async function updateAnimationFrameButton(interaction, frame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;
        
        // Calculate rainbow positions and colors for 20-square bars
        const barLength = 20;
        const positions = [];
        
        // Calculate the rainbow pattern
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - frame + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        
        // TOP and BOTTOM bars are IDENTICAL
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' '); // Exact copy
        
        // EMBED COLOR: Sync with first square
        let embedColor;
        if (frame < 16) {
            const firstSquareColorIndex = (0 - frame + rainbowColors.length * 100) % rainbowColors.length;
            embedColor = rainbowEmbedColors[firstSquareColorIndex];
        } else if (frame < 17) {
            embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
        } else {
            embedColor = rarityColors[targetFruit.rarity]?.embed || rainbowEmbedColors[0];
        }
        
        // Get changing indicators
        const indicators = getChangingIndicators(frame, targetFruit.rarity, targetFruit.type);
        
        // Get particles
        const particles = generateParticles();
        
        // Get dynamic animation text
        const dynamicTexts = [
            "*A mysterious presence stirs in the depths of the Grand Line...*",
            "*Ancient powers awaken from their eternal slumber...*",
            "*The Devil Fruit's aura begins to manifest...*",
            "*Reality bends as the fruit's true nature emerges...*",
            "*Your destiny as a Devil Fruit user crystallizes...*",
            "*The fruit's power reaches critical mass...*"
        ];
        const textIndex = Math.min(Math.floor(frame / 3), dynamicTexts.length - 1);
        const dynamicText = dynamicTexts[textIndex];
        
        // Create animation content
        const animationContent = `${topBar}\n\n` +
            `🌊 **GRAND LINE EXPLORATION** 🌊\n\n` +
            `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
            `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('🍈 Devil Fruit Hunt in Progress...')
            .setDescription(animationContent)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;
        
    } catch (error) {
        console.log(`Animation frame ${frame} error:`, error.message);
    }
}

async function updateProgressionFrameButton(interaction, progFrame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;
        
        const barLength = 20;
        const positions = [];
        
        // Calculate the rainbow pattern
        for (let i = 0; i < barLength; i++) {
            const colorIndex = (i - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
            positions.push(rainbowColors[colorIndex]);
        }
        
        // TOP and BOTTOM bars are IDENTICAL
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' '); // Exact copy
        
        // EMBED COLOR: Sync with first square
        const firstSquareColorIndex = (0 - (18 + progFrame) + rainbowColors.length * 100) % rainbowColors.length;
        const embedColor = rainbowEmbedColors[firstSquareColorIndex];
        
        const indicators = getChangingIndicators(18 + progFrame, targetFruit.rarity, targetFruit.type);
        const particles = generateParticles('intense');
        
        const progressionTexts = [
            "*The fruit's essence takes physical form...*",
            "*Reality warps as the fruit breaches dimensional barriers...*",
            "*Your legend begins to write itself...*"
        ];
        const dynamicText = progressionTexts[Math.floor(Math.random() * progressionTexts.length)];
        
        const progressContent = `${topBar}\n\n` +
            `🌊 **POWER CRYSTALLIZING** 🌊\n\n` +
            `⚡ **FRUIT ENERGY:** ${indicators.aura}\n` +
            `🔮 **RARITY SENSE:** ${indicators.blessing}\n` +
            `🍈 **DEVIL FRUIT:** ${indicators.typeHint}\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('🔮 Power Crystallization Phase')
            .setDescription(progressContent)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;
        
    } catch (error) {
        console.log(`Progression frame ${progFrame} error:`, error.message);
    }
}

async function updateTransitionFrameButton(interaction, transFrame, targetFruit, metrics) {
    try {
        metrics.frameAttempts++;
        
        const barLength = 20;
        const radius = transFrame;
        const positions = [];
        
        for (let i = 0; i < barLength; i++) {
            // FIXED: Use integer center positions for perfect symmetry
            const distanceFromCenter9 = Math.abs(i - 9);
            const distanceFromCenter10 = Math.abs(i - 10);
            const minDistanceFromCenter = Math.min(distanceFromCenter9, distanceFromCenter10);
            
            if (minDistanceFromCenter <= radius) {
                // Use reward color
                positions.push(rarityColors[targetFruit.rarity]?.emoji || '🟫');
            } else {
                // Still rainbow
                const colorIndex = (i - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
                positions.push(rainbowColors[colorIndex]);
            }
        }
        
        // TOP and BOTTOM bars are IDENTICAL
        const topBar = positions.join(' ');
        const bottomBar = positions.join(' '); // Exact copy
        
        // EMBED COLOR: Sync with first square or transition to rarity
        let embedColor;
        if (transFrame > 5) {
            embedColor = rarityColors[targetFruit.rarity]?.embed || 0x8B4513;
        } else {
            const firstSquareColorIndex = (0 - (30 + transFrame) + rainbowColors.length * 100) % rainbowColors.length;
            embedColor = rainbowEmbedColors[firstSquareColorIndex];
        }
        
        const particles = generateParticles('crystallizing');
        
        const transitionTexts = [
            "*The Devil Fruit's power takes its final form...*",
            "*Your journey as a Devil Fruit user begins now...*",
            "*The ocean itself acknowledges your new power...*"
        ];
        const dynamicText = transitionTexts[Math.floor(Math.random() * transitionTexts.length)];
        
        const transitionContent = `${topBar}\n\n` +
            `⚡ **CRYSTALLIZING INTO REALITY** ⚡\n\n` +
            `${dynamicText}\n\n` +
            `${bottomBar}\n\n` +
            `${particles}`;
        
        const embed = new EmbedBuilder()
            .setTitle('⚡ Final Crystallization')
            .setDescription(transitionContent)
            .setColor(embedColor)
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
        metrics.frameSuccesses++;
        
    } catch (error) {
        console.log(`Transition frame ${transFrame} error:`, error.message);
    }
}
