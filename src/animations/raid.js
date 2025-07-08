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
        
        // Optimized canvas width for Discord message area
        this.canvasWidth = 80; // Keep original 80 - Discord limits display width
        this.shipWidth = this.shipDesign[0].length; // Should be around 30 characters
        
        console.log(`🚢 Ship dimensions: width=${this.shipWidth}, canvas=${this.canvasWidth}`);
    }'⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀',
            '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
        ];
        
        // Optimized canvas width for Discord message area
        this.canvasWidth = 80; // Keep original 80 - Discord limits display width
        this.shipWidth = this.shipDesign[0].length; // Should be around 30 characters
        
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

    // Enhanced animation with ship starting just off-screen right
    async playQuickAnimation(interaction, animationType = 'combat') {
        const framesCount = 18; // Reduced frames for better pacing
        
        // FIXED: Start position off-screen to the RIGHT (higher number)
        // Ship should start with its left edge just outside the right edge of visible area
        const startOffset = this.canvasWidth; // Start at position 80 (right side)
        
        // FIXED: End position off-screen to the LEFT (lower/negative number)  
        // Ship should end with its right edge just outside the left edge
        const endOffset = -this.shipWidth; // End at position -30 (left side)
        
        console.log(`🎬 Starting raid animation: ${animationType}`);
        console.log(`📐 Animation setup: Canvas=${this.canvasWidth}, Ship=${this.shipWidth}`);
        console.log(`🎯 Movement: ${startOffset} → ${endOffset} over ${framesCount} frames`);
        console.log(`🔄 Total distance: ${startOffset - endOffset} characters`);

        for (let i = 0; i < framesCount; i++) {
            // Calculate smooth movement from RIGHT to LEFT
            const progress = i / (framesCount - 1);
            
            // RIGHT to LEFT movement: start=80, end=-30
            // progress=0: position=80 (right side)  
            // progress=1: position=-30 (left side)
            const currentOffset = Math.round(startOffset + (endOffset - startOffset) * progress);
            
            console.log(`📍 Frame ${i + 1}/${framesCount}: offset=${currentOffset}, progress=${(progress * 100).toFixed(1)}%`);
            console.log(`   Expected: start=${startOffset} → current=${currentOffset} → end=${endOffset}`);
            
            // Position the ship at current offset
            const shipDisplay = this.positionShip(currentOffset);
            
            // Debug: Show first few characters of the first line to see ship position
            const firstLine = shipDisplay.split('\n')[0];
            const visiblePart = firstLine.substring(0, 80);
            console.log(`   Ship line preview: "${visiblePart.substring(0, 20)}...${visiblePart.substring(60)}"`);
            
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
            totalFrames: 18,
            animationDuration: '2.7 seconds',
            direction: 'Right to Left',
            frameDelay: '150ms',
            startPosition: this.canvasWidth,
            endPosition: -this.shipWidth,
            totalDistance: this.canvasWidth + this.shipWidth
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
