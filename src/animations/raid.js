// Enhanced Raid Animation - Fixed Ship Movement from Right to Left
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
        this.canvasWidth = 80;
        this.shipWidth = this.shipDesign[0].length; // Should be 30 characters
        
        console.log(`🔧 Raid Animation initialized: Canvas=${this.canvasWidth}, Ship=${this.shipWidth}`);
    }

    // FIXED: Position ship at specific offset with proper boundary checking
    positionShip(offset) {
        return this.shipDesign.map(line => {
            // Create empty canvas line
            let canvasLine = ' '.repeat(this.canvasWidth);
            
            // Calculate visible portion of ship
            const shipStartPos = Math.max(0, offset);
            const shipEndPos = Math.min(this.canvasWidth, offset + this.shipWidth);
            
            // Only draw if ship intersects with canvas
            if (offset < this.canvasWidth && offset + this.shipWidth > 0) {
                // Calculate which part of the ship to show
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

    // FIXED: Enhanced animation with proper edge positioning
    async playQuickAnimation(interaction, animationType = 'combat') {
        const framesCount = 18;
        
        // OPTION 1: Ship enters from right edge and exits at left edge
        const edgeOffset = 1; // 1 character offset from edge
        const startOffset = this.canvasWidth - edgeOffset;  // Ship just entering from right
        const endOffset = -this.shipWidth + edgeOffset;    // Ship just exiting on left
        
        // OPTION 2: If you want completely off-screen, uncomment these lines:
        // const startOffset = this.canvasWidth + edgeOffset;  // Completely off-screen right
        // const endOffset = -this.shipWidth - edgeOffset;    // Completely off-screen left
        
        console.log(`🎬 Starting raid animation: ${animationType}`);
        console.log(`📐 Canvas: ${this.canvasWidth} chars, Ship: ${this.shipWidth} chars`);
        console.log(`🚀 Movement: ${startOffset} → ${endOffset} over ${framesCount} frames`);
        console.log(`📏 Total distance: ${startOffset - endOffset} characters`);
        console.log(`🎯 Start: Ship ${edgeOffset} char(s) from right edge`);
        console.log(`🎯 End: Ship ${edgeOffset} char(s) from left edge`);

        for (let i = 0; i < framesCount; i++) {
            // Calculate smooth linear movement
            const progress = i / (framesCount - 1);
            const currentOffset = Math.round(startOffset + (endOffset - startOffset) * progress);
            
            console.log(`📍 Frame ${i + 1}/${framesCount}: offset=${currentOffset}, progress=${(progress * 100).toFixed(1)}%`);
            
            // Position the ship at current offset
            const shipDisplay = this.positionShip(currentOffset);
            
            // Determine animation phase and content
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
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }
        
        console.log(`✅ Raid animation completed - ship traveled from position ${startOffset} to ${endOffset}`);
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
        console.log('🧪 Testing raid animation positioning...');
        
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
        
        // Test specific positions
        console.log('🔍 Testing key positions:');
        
        // Test 1: Ship completely off-screen right
        const offScreenRight = this.canvasWidth + 10;
        console.log(`Position ${offScreenRight} (off-screen right):`, this.positionShip(offScreenRight).split('\n')[0]);
        
        // Test 2: Ship just entering from right
        const enteringRight = this.canvasWidth - 5;
        console.log(`Position ${enteringRight} (entering right):`, this.positionShip(enteringRight).split('\n')[0]);
        
        // Test 3: Ship centered
        const centered = Math.floor((this.canvasWidth - this.shipWidth) / 2);
        console.log(`Position ${centered} (centered):`, this.positionShip(centered).split('\n')[0]);
        
        // Test 4: Ship exiting left
        const exitingLeft = -5;
        console.log(`Position ${exitingLeft} (exiting left):`, this.positionShip(exitingLeft).split('\n')[0]);
        
        // Test 5: Ship completely off-screen left
        const offScreenLeft = -this.shipWidth - 10;
        console.log(`Position ${offScreenLeft} (off-screen left):`, this.positionShip(offScreenLeft).split('\n')[0]);
        
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
            startPosition: this.canvasWidth - 1,  // Just entering from right
            endPosition: -this.shipWidth + 1, // Just exiting on left
            totalDistance: (this.canvasWidth + 5) - (-this.shipWidth - 5),
            
            // Debug positions
            debugPositions: {
                justEnteringRight: this.canvasWidth - 1,      // Ship just visible on right
                centered: Math.floor((this.canvasWidth - this.shipWidth) / 2),
                justExitingLeft: -this.shipWidth + 1,         // Ship just visible on left
                completelyOffRight: this.canvasWidth + 5,     // Completely hidden right
                completelyOffLeft: -this.shipWidth - 5        // Completely hidden left
            }
        };
    }

    // Enhanced debugging method
    debugPositioning() {
        console.log('🔧 DEBUG: Raid Animation Positioning');
        console.log('=====================================');
        
        const info = this.getAnimationInfo();
        console.log(`Canvas Width: ${info.canvasWidth}`);
        console.log(`Ship Width: ${info.shipWidth}`);
        console.log(`Start Position: ${info.startPosition}`);
        console.log(`End Position: ${info.endPosition}`);
        console.log(`Total Distance: ${info.totalDistance}`);
        
        console.log('\n🎯 Key Positions:');
        Object.entries(info.debugPositions).forEach(([name, pos]) => {
            const line = this.positionShip(pos).split('\n')[0];
            const shipVisible = line.trim().length > 0;
            console.log(`${name}: ${pos} (${shipVisible ? 'VISIBLE' : 'HIDDEN'})`);
        });
        
        return info;
    }
}

module.exports = new RaidAnimation();
