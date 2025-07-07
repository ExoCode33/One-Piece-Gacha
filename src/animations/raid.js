// src/animations/raid.js - Fixed Ship with Better Positioning
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
        this.brailleSpace = '⠀'; // Braille space character
        this.regularSpace = ' ';  // Regular space for padding
    }

    // FIXED: Better positioning logic that doesn't mix character types
    positionShip(offset) {
        const positioned = [];
        
        for (let line of this.shipDesign) {
            if (offset >= 0) {
                // Use REGULAR spaces for padding, not Braille spaces
                // This prevents character encoding conflicts
                const padding = this.regularSpace.repeat(Math.max(0, offset));
                positioned.push(padding + line);
            } else {
                // For negative offset, just clip the line
                const clippedLine = line.substring(Math.abs(offset));
                positioned.push(clippedLine);
            }
        }
        
        return positioned.join('\n');
    }

    // Alternative positioning method using only regular spaces
    positionShipSafe(offset) {
        // Convert Braille spaces to regular spaces for consistent rendering
        const safeShip = this.shipDesign.map(line => 
            line.replace(/⠀/g, ' ') // Replace all Braille spaces with regular spaces
        );
        
        const positioned = [];
        for (let line of safeShip) {
            if (offset >= 0) {
                positioned.push(this.regularSpace.repeat(offset) + line);
            } else {
                positioned.push(line.substring(Math.abs(offset)));
            }
        }
        
        return positioned.join('\n');
    }

    // Quick 3-frame animation with improved first frame handling
    async playQuickAnimation(interaction, animationType = 'combat') {
        // Add a small delay before first frame to let Discord load fonts
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const quickFrames = [
            {
                title: '🌊 **Ship Approaching...**',
                content: `\`\`\`\n${this.positionShip(25)}\n\`\`\``,
                delay: 1000 // Longer delay for first frame
            },
            {
                title: '⚔️ **Ship Ready for Battle!**',
                content: `\`\`\`\n${this.positionShip(10)}\n\`\`\``,
                delay: 800
            },
            {
                title: '🏴‍☠️ **Battle Begins!**',
                content: `\`\`\`\n${this.positionShip(0)}\n\`\`\``,
                delay: 0 // No delay after last frame
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
            
            // Apply the frame-specific delay
            if (frame.delay > 0) {
                await new Promise(resolve => setTimeout(resolve, frame.delay));
            }
        }
    }

    // Alternative quick animation using safe positioning if issues persist
    async playQuickAnimationSafe(interaction, animationType = 'combat') {
        const quickFrames = [
            {
                title: '🌊 **Ship Approaching...**',
                content: `\`\`\`\n${this.positionShipSafe(25)}\n\`\`\``
            },
            {
                title: '⚔️ **Ship Ready for Battle!**',
                content: `\`\`\`\n${this.positionShipSafe(10)}\n\`\`\``
            },
            {
                title: '🏴‍☠️ **Battle Begins!**',
                content: `\`\`\`\n${this.positionShipSafe(0)}\n\`\`\``
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
            
            if (i < quickFrames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    }

    // Generate complete right-to-left animation frames
    getAnimationFrames() {
        const frames = [];
        
        frames.push({
            title: '🌊 **Ship Approaching from the Horizon...**',
            content: `\`\`\`\n${this.positionShip(40)}\n\`\`\``
        });
        
        frames.push({
            title: '🚢 **Battle Ship Entering Combat Zone...**',
            content: `\`\`\`\n${this.positionShip(30)}\n\`\`\``
        });
        
        frames.push({
            title: '⚔️ **Ship Sailing Into Position...**',
            content: `\`\`\`\n${this.positionShip(20)}\n\`\`\``
        });
        
        frames.push({
            title: '🏴‍☠️ **Ship Ready for Battle!**',
            content: `\`\`\`\n${this.positionShip(10)}\n\`\`\``
        });
        
        frames.push({
            title: '💨 **Ship Continuing Across Battlefield...**',
            content: `\`\`\`\n${this.positionShip(0)}\n\`\`\``
        });
        
        frames.push({
            title: '🌪️ **Ship Exiting Combat Zone!**',
            content: `\`\`\`\n${this.positionShip(-10)}\n\`\`\``
        });
        
        return frames;
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
            await new Promise(resolve => setTimeout(resolve, 1200));
        }
    }

    // Get color based on animation type
    getAnimationColor(type) {
        const colors = {
            combat: 0x1E90FF,
            pvp: 0xFF1493,
            victory: 0x00FF00,
            defeat: 0xFF0000
        };
        return colors[type] || colors.combat;
    }

    // Victory animation - ship sailing away
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
                color: 0x00FF00,
                footer: {
                    text: `Victory Animation • Frame ${i + 1}/${victoryFrames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            if (i < victoryFrames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Static ship position for battle setup
    getBattleReadyShip() {
        return {
            title: '🏟️ **Battle Ship Deployed!**',
            content: `\`\`\`\n${this.positionShip(5)}\n\`\`\``
        };
    }

    // Test method to debug positioning
    async testPositioning(interaction) {
        console.log('Testing ship positioning...');
        
        // Test with original method
        const original = this.positionShip(25);
        console.log('Original positioning length:', original.length);
        
        // Test with safe method  
        const safe = this.positionShipSafe(25);
        console.log('Safe positioning length:', safe.length);
        
        await interaction.editReply({
            content: `\`\`\`\nOriginal:\n${original}\n\nSafe:\n${safe}\n\`\`\``
        });
    }
}

// Export as singleton instance
module.exports = new RaidAnimation();
