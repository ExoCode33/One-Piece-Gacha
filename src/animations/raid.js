// Enhanced Raid Animation - Clean Right to Left Ship Movement
class RaidAnimation {
    constructor() {
        // Single ship design - facing left for right-to-left movement
        this.shipDesign = [
            '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀',
            '⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀',
            '⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
        ];
        
        // Canvas settings for Discord message area
        this.canvasWidth = 80;
        this.shipWidth = this.shipDesign[0].length;
        
        console.log(`🚢 Ship dimensions: width=${this.shipWidth}, canvas=${this.canvasWidth}`);
    }

    // Position ship at specific offset
    positionShip(offset) {
        return this.shipDesign.map(line => {
            // Create the canvas line with proper padding
            let canvasLine = ' '.repeat(this.canvasWidth);
            
            // Calculate ship position
            const shipStartPos = Math.max(0, offset);
            const shipEndPos = Math.min(this.canvasWidth, offset + this.shipWidth);
            
            // Only draw visible part of the ship
            if (shipStartPos < this.canvasWidth && shipEndPos > 0) {
                const shipStartChar = Math.max(0, -offset);
                const shipEndChar = Math.min(this.shipWidth, this.canvasWidth - offset);
                
                if (shipEndChar > shipStartChar) {
                    const shipPart = line.slice(shipStartChar, shipEndChar);
                    canvasLine = canvasLine.substring(0, shipStartPos) + 
                                shipPart + 
                                canvasLine.substring(shipStartPos + shipPart.length);
                }
            }
            
            return canvasLine;
        }).join('\n');
    }

    // Main animation: ship moves from RIGHT to LEFT
    async playQuickAnimation(interaction, animationType = 'combat') {
        const framesCount = 18;
        
        // RIGHT TO LEFT movement
        const startOffset = this.canvasWidth;  // Start at position 80 (right edge)
        const endOffset = -this.shipWidth;    // End at position -30 (left side, off-screen)
        
        console.log(`🎬 Starting raid animation: ${animationType}`);
        console.log(`📐 Canvas=${this.canvasWidth}, Ship=${this.shipWidth}`);
        console.log(`🎯 Movement: ${startOffset} → ${endOffset} (RIGHT to LEFT)`);

        for (let i = 0; i < framesCount; i++) {
            // Calculate movement from RIGHT to LEFT
            const progress = i / (framesCount - 1);
            const currentOffset = Math.round(startOffset + (endOffset - startOffset) * progress);
            
            console.log(`📍 Frame ${i + 1}/${framesCount}: offset=${currentOffset}, progress=${(progress * 100).toFixed(1)}%`);
            
            // Position the ship
            const shipDisplay = this.positionShip(currentOffset);
            
            // Animation titles based on progress
            let title, description;
            if (i === 0) {
                title = "🌊 **Ship Spotted on the Horizon!**";
                description = "A mighty battle ship approaches from the eastern seas...";
            } else if (i < framesCount / 4) {
                title = "⚔️ **Battle Ship Approaching Fast!**";
                description = "The vessel cuts through the waves with determination...";
            } else if (i < (framesCount * 3) / 4) {
                title = "🏴‍☠️ **Ship Sailing Past at Full Speed!**";
                description = "The mighty ship dominates the battlefield...";
            } else if (i === framesCount - 1) {
                title = "🌅 **Ship Disappears Beyond the Horizon!**";
                description = "The battle ship vanishes into the western seas...";
            } else {
                title = "🏴‍☠️ **Combat Ship in Motion!**";
                description = "The ship continues its powerful journey across the seas...";
            }

            // Create embed
            const embed = {
                title: title,
                description: description,
                color: this.getAnimationColor(animationType),
                footer: { 
                    text: `⚔️ ${animationType.charAt(0).toUpperCase() + animationType.slice(1)} Animation • Frame ${i + 1}/${framesCount}` 
                },
                timestamp: new Date().toISOString()
            };

            // Update Discord message
            await interaction.editReply({
                content: `\`\`\`\n${shipDisplay}\n\`\`\``,
                embeds: [embed],
                components: []
            });

            // Frame delay
            if (i < framesCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }
        
        console.log(`✅ Ship animation completed - moved from RIGHT to LEFT`);
    }

    // Full animation (same as quick)
    async playFullSailAnimation(interaction, animationType = 'combat') {
        await this.playQuickAnimation(interaction, animationType);
    }

    // Main entry point
    async playAnimation(interaction, animationType = 'combat') {
        await this.playFullSailAnimation(interaction, animationType);
    }

    // Victory animation - ship in center
    async playVictoryAnimation(interaction) {
        const victoryEmbed = {
            title: '🏆 **VICTORY ACHIEVED!**',
            description: 'Your ship sails triumphantly across the battlefield!',
            color: 0x00FF00,
            footer: { text: '🏆 Victory Animation' },
            timestamp: new Date().toISOString()
        };

        // Center the ship
        const centeredOffset = Math.floor((this.canvasWidth - this.shipWidth) / 2);
        const victoryShip = this.positionShip(centeredOffset);

        await interaction.editReply({
            content: `\`\`\`\n${victoryShip}\n\`\`\``,
            embeds: [victoryEmbed],
            components: []
        });

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Get animation color based on type
    getAnimationColor(type) {
        const colors = {
            combat: 0x1E90FF,    // Dodger Blue
            pvp: 0xFF1493,       // Deep Pink
            victory: 0x00FF00,   // Green
            defeat: 0xFF0000,    // Red
            strategic: 0x8A2BE2, // Blue Violet
            npc: 0x20B2AA        // Light Sea Green
        };
        return colors[type] || colors.combat;
    }

    // Static ship display
    getBattleReadyShip() {
        const centeredOffset = Math.floor((this.canvasWidth - this.shipWidth) / 2);
        return {
            title: '🏟️ **Battle Ship Deployed!**',
            content: this.positionShip(centeredOffset),
            embed: {
                title: '🏟️ **Battle Ship Ready for Combat!**',
                description: 'Your mighty vessel stands ready for battle!',
                color: 0x1E90FF,
                footer: { text: '⚔️ Battle Formation' },
                timestamp: new Date().toISOString()
            }
        };
    }

    // Test animation
    async testAnimation(interaction) {
        console.log('🧪 Testing raid animation...');
        
        const testEmbed = {
            title: '🧪 **Animation Test**',
            description: 'Testing ship movement from RIGHT to LEFT...',
            color: 0xFFFF00,
            footer: { text: '🧪 Test Mode' }
        };

        await interaction.editReply({ embeds: [testEmbed] });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.playQuickAnimation(interaction, 'combat');
    }

    // Animation info
    getAnimationInfo() {
        return {
            canvasWidth: this.canvasWidth,
            shipWidth: this.shipWidth,
            totalFrames: 18,
            animationDuration: '2.7 seconds',
            direction: 'Right to Left',
            frameDelay: '150ms',
            startPosition: this.canvasWidth,
            endPosition: -this.shipWidth,
            totalDistance: this.canvasWidth + this.shipWidth
        };
    }

    // Debug info
    debugPositions() {
        const info = this.getAnimationInfo();
        console.log('🔧 Animation Debug Info:');
        console.log(`   Canvas Width: ${info.canvasWidth} characters`);
        console.log(`   Ship Width: ${info.shipWidth} characters`);
        console.log(`   Start Position: ${info.startPosition} (right edge)`);
        console.log(`   End Position: ${info.endPosition} (left edge, off-screen)`);
        console.log(`   Movement Direction: RIGHT → LEFT`);
    }
}

module.exports = new RaidAnimation();
