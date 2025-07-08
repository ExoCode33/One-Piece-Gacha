// Enhanced Raid Animation - Smooth Right to Left Ship Movement
class RaidAnimation {
    constructor() {
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
        this.canvasWidth = 80; // Increased canvas width for smoother animation
        this.shipWidth = this.shipDesign[0].length;
    }

    // Position ship at specific offset (positive = move right, negative = move left)
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

    // Enhanced animation with smooth right-to-left movement starting completely off-screen
    async playQuickAnimation(interaction, animationType = 'combat') {
        const framesCount = 18; // Reduced frames for better pacing
        
        // FIXED: Ship starts completely off-screen to the right and ends completely off-screen to the left
        const startOffset = this.canvasWidth + this.shipWidth + 20;  // Start at position 130 (completely off-screen right)
        const endOffset = -this.shipWidth - 10;                      // End at position -40 (completely off-screen left)
        
        console.log(`🎬 Starting raid animation: ${animationType}`);
        console.log(`📐 Animation setup: Canvas=${this.canvasWidth}, Ship=${this.shipWidth}`);
        console.log(`🎯 Movement: ${startOffset} → ${endOffset} over ${framesCount} frames`);
        console.log(`🔄 Total distance: ${startOffset - endOffset} characters`);

        for (let i = 0; i < framesCount; i++) {
            // Calculate smooth movement across the screen
            const progress = i / (framesCount - 1);
            const currentOffset = Math.round(startOffset + (endOffset - startOffset) * progress);
            
            console.log(`📍 Frame ${i + 1}/${framesCount}: offset=${currentOffset}, progress=${(progress * 100).toFixed(1)}%`);
            
            // Position the ship at current offset
            const shipDisplay = this.positionShip(currentOffset);
            
            // Determine animation phase and title
            let title, description;
            
            if (i === 0) {
                title = "🌊 **Ship Spotted on the Horizon!**";
                description = "A battle ship approaches from the eastern seas...";
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

            // Create embed based on animation type
            const embed = {
                title: title,
                description: description,
                color: this.getAnimationColor(animationType),
                footer: { 
                    text: `⚔️ ${animationType.charAt(0).toUpperCase() + animationType.slice(1)} Animation • Frame ${i + 1}/${framesCount}` 
                },
                timestamp: new Date().toISOString()
            };

            // Update the interaction with ship animation
            await interaction.editReply({
                content: `\`\`\`\n${shipDisplay}\n\`\`\``,
                embeds: [embed],
                components: [] // Clear any previous components during animation
            });

            // Add delay between frames (except for the last frame)
            if (i < framesCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 150)); // Balanced timing
            }
        }
        
        console.log(`✅ Raid animation completed successfully - ship traveled from right to left`);
    }

    // Full animation (same as quick for now, but can be extended)
    async playFullSailAnimation(interaction, animationType = 'combat') {
        await this.playQuickAnimation(interaction, animationType);
    }

    // Main animation entry point
    async playAnimation(interaction, animationType = 'combat') {
        await this.playFullSailAnimation(interaction, animationType);
    }

    // Victory animation - ship sailing triumphantly
    async playVictoryAnimation(interaction) {
        const victoryEmbed = {
            title: '🏆 **VICTORY ACHIEVED!**',
            description: 'Your ship sails triumphantly across the battlefield!',
            color: 0x00FF00,
            footer: { text: '🏆 Victory Animation' },
            timestamp: new Date().toISOString()
        };

        // Show centered victory ship
        const centeredOffset = Math.floor((this.canvasWidth - this.shipWidth) / 2);
        const victoryShip = this.positionShip(centeredOffset);

        await interaction.editReply({
            content: `\`\`\`\n${victoryShip}\n\`\`\``,
            embeds: [victoryEmbed],
            components: []
        });

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Get color based on animation type
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

    // Get battle-ready ship for static display
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

    // Test animation for debugging
    async testAnimation(interaction) {
        console.log('🧪 Testing raid animation...');
        
        const testEmbed = {
            title: '🧪 **Animation Test**',
            description: 'Testing ship movement from right to left...',
            color: 0xFFFF00,
            footer: { text: '🧪 Test Mode' }
        };

        await interaction.editReply({
            embeds: [testEmbed]
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.playQuickAnimation(interaction, 'combat');
    }

    // Get animation statistics
    getAnimationInfo() {
        return {
            canvasWidth: this.canvasWidth,
            shipWidth: this.shipWidth,
            totalFrames: 18,
            animationDuration: '2.7 seconds',
            direction: 'Right to Left',
            frameDelay: '150ms',
            startPosition: this.canvasWidth + this.shipWidth + 20,
            endPosition: -this.shipWidth - 10,
            totalDistance: (this.canvasWidth + this.shipWidth + 20) + (this.shipWidth + 10)
        };
    }
}

module.exports = new RaidAnimation();
