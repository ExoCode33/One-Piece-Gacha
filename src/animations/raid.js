// src/animations/raid.js - Your Exact Ship Design with Proper Encoding
class RaidAnimation {
    constructor() {
        // Your exact ship design as provided
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
        
        this.frameWidth = 70;
        this.emptyChar = '⠀'; // Your original Braille empty character
    }

    // Create padding for positioning the ship
    createPadding(amount) {
        return this.emptyChar.repeat(Math.max(0, amount));
    }

    // Position the ship at a specific horizontal offset
    positionShip(offset) {
        const positioned = [];
        
        for (let line of this.shipDesign) {
            if (offset >= 0) {
                // Ship moving from right - add padding at the beginning
                positioned.push(this.createPadding(offset) + line);
            } else {
                // Ship moving to left - clip the left side
                const clippedLine = line.substring(-offset);
                positioned.push(clippedLine);
            }
        }
        
        return positioned.join('\n');
    }

    // Generate complete right-to-left animation frames
    getAnimationFrames() {
        const frames = [];
        
        // Frame 1: Ship entering from far right
        frames.push({
            title: '🌊 **Ship Approaching from the Horizon...**',
            content: `\`\`\`\n${this.positionShip(40)}\n\`\`\``
        });
        
        // Frame 2: Ship entering visible area
        frames.push({
            title: '🚢 **Battle Ship Entering Combat Zone...**',
            content: `\`\`\`\n${this.positionShip(30)}\n\`\`\``
        });
        
        // Frame 3: Ship in right side of screen
        frames.push({
            title: '⚔️ **Ship Sailing Into Position...**',
            content: `\`\`\`\n${this.positionShip(20)}\n\`\`\``
        });
        
        // Frame 4: Ship in center
        frames.push({
            title: '🏴‍☠️ **Ship Ready for Battle!**',
            content: `\`\`\`\n${this.positionShip(10)}\n\`\`\``
        });
        
        // Frame 5: Ship moving left
        frames.push({
            title: '💨 **Ship Continuing Across Battlefield...**',
            content: `\`\`\`\n${this.positionShip(0)}\n\`\`\``
        });
        
        // Frame 6: Ship exiting left
        frames.push({
            title: '🌪️ **Ship Exiting Combat Zone!**',
            content: `\`\`\`\n${this.positionShip(-10)}\n\`\`\``
        });
        
        return frames;
    }

    // Quick 3-frame animation for faster combat (NEEDED BY COMBAT SYSTEM)
    async playQuickAnimation(interaction, animationType = 'combat') {
        const quickFrames = [
            {
                title: '🌊 **Ship Approaching...**',
                content: `\`\`\`\n${this.positionShip(25)}\n\`\`\``
            },
            {
                title: '⚔️ **Ship Ready for Battle!**',
                content: `\`\`\`\n${this.positionShip(10)}\n\`\`\``
            },
            {
                title: '🏴‍☠️ **Battle Begins!**',
                content: `\`\`\`\n${this.positionShip(0)}\n\`\`\``
            }
        ];
        
        for (let i = 0; i < quickFrames.length; i++) {
            const frame = quickFrames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content,
                color: this.getAnimationColor(animationType),
                footer: {
                    text: `⚔️ Combat Animation • Frame ${i + 1}/${quickFrames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            // Don't delay after the last frame
            if (i < quickFrames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 800)); // 0.8 second delay
            }
        }
    }

    // Play the complete animation
    async playAnimation(interaction, animationType = 'combat') {
        const frames = this.getAnimationFrames();
        
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content,
                color: this.getAnimationColor(animationType),
                footer: {
                    text: `Animation Frame ${i + 1}/${frames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 second delay
        }
    }

    // Get color based on animation type
    getAnimationColor(type) {
        const colors = {
            combat: 0x1E90FF,    // Blue for combat
            pvp: 0xFF1493,       // Pink for PvP
            victory: 0x00FF00,   // Green for victory
            defeat: 0xFF0000     // Red for defeat
        };
        return colors[type] || colors.combat;
    }

    // Static ship position for battle setup
    getBattleReadyShip() {
        return {
            title: '🏟️ **Battle Ship Deployed!**',
            content: `\`\`\`\n${this.positionShip(5)}\n\`\`\``
        };
    }

    // Victory animation - ship sailing away (NEEDED BY COMBAT SYSTEM)
    async playVictoryAnimation(interaction) {
        const victoryFrames = [
            {
                title: '🏆 **Victory! Ship Departing...**',
                content: `\`\`\`\n${this.positionShip(0)}\n\`\`\``
            },
            {
                title: '⛵ **Sailing Into the Sunset...**',
                content: `\`\`\`\n${this.positionShip(-15)}\n\`\`\``
            },
            {
                title: '🌅 **Until Next Adventure!**',
                content: `\`\`\`\n${this.positionShip(-30)}\n\`\`\``
            }
        ];
        
        for (let i = 0; i < victoryFrames.length; i++) {
            const frame = victoryFrames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content,
                color: 0x00FF00, // Victory green
                footer: {
                    text: `Victory Animation • Frame ${i + 1}/${victoryFrames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            // Don't delay after the last frame
            if (i < victoryFrames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Enhanced ship animation with customizable frames
    async playCustomAnimation(interaction, frameCount = 4, animationType = 'combat') {
        const frames = this.getAnimationFrames().slice(0, frameCount);
        
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content,
                color: this.getAnimationColor(animationType),
                footer: {
                    text: `Custom Animation • Frame ${i + 1}/${frames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            if (i < frames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Test animation method for debugging
    async testAnimation(interaction) {
        try {
            await this.playQuickAnimation(interaction, 'combat');
            console.log('✅ Raid animation test successful');
            return true;
        } catch (error) {
            console.error('❌ Raid animation test failed:', error);
            return false;
        }
    }
}

// Export as singleton instance
module.exports = new RaidAnimation();
