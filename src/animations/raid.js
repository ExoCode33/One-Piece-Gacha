// Enhanced Raid Animation - Ship enters completely from right side
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
        
        // Increased canvas width to ensure ship enters completely from right
        this.canvasWidth = 120; // Increased from 80 to 120 for wider view
        this.shipWidth = this.shipDesign[0].length; // Should be around 40 characters
        
        console.log(`🚢 Ship dimensions: width=${this.shipWidth}, canvas=${this.canvasWidth}`);
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

    // Enhanced animation with ship starting completely off-screen right
    async playQuickAnimation(interaction, animationType = 'combat') {
        const framesCount = 20; // Increased frames for smoother animation
        
        // FIXED: Start position completely off-screen to the right
        // Ship should start with its leftmost pixel just outside the right edge
        const startOffset = this.canvasWidth + 5; // Start 5 characters beyond the right edge
        
        // FIXED: End position completely off-screen to the left  
        // Ship should end with its rightmost pixel just outside the left edge
        const endOffset = -(this.shipWidth + 5); // End 5 characters beyond the left edge
        
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
                await new Promise(resolve => setTimeout(resolve, 120)); // Slightly faster for smoother movement
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

    // Victory animation - ship sailing triumphantly in center
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

    // Get animation statistics and debug info
    getAnimationInfo() {
        return {
            canvasWidth: this.canvasWidth,
            shipWidth: this.shipWidth,
            totalFrames: 20,
            animationDuration: '2.4 seconds',
            direction: 'Right to Left',
            frameDelay: '120ms',
            startPosition: this.canvasWidth + 5,
            endPosition: -(this.shipWidth + 5),
            totalDistance: (this.canvasWidth + 5) + (this.shipWidth + 5)
        };
    }

    // Debug function to show ship positions
    debugPositions() {
        const info = this.getAnimationInfo();
        console.log('🔧 Animation Debug Info:');
        console.log(`   Canvas Width: ${info.canvasWidth} characters`);
        console.log(`   Ship Width: ${info.shipWidth} characters`);
        console.log(`   Start Position: ${info.startPosition} (completely off-screen right)`);
        console.log(`   End Position: ${info.endPosition} (completely off-screen left)`);
        console.log(`   Total Travel Distance: ${info.totalDistance} characters`);
        console.log(`   Animation ensures ship enters from completely outside the message area`);
    }
}

module.exports = new RaidAnimation();
