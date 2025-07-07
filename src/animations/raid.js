// src/animations/raid.js - YOUR EXACT Ship Design Fixed
class RaidAnimation {
    constructor() {
        // YOUR EXACT ship design as provided - unchanged
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
    }

    // Position the ship at a specific horizontal offset
    positionShip(offset) {
        const positioned = [];
        
        for (let line of this.shipDesign) {
            if (offset >= 0) {
                // Use regular spaces for padding to avoid character mixing
                const padding = ' '.repeat(Math.max(0, offset));
                positioned.push(padding + line);
            } else {
                // For negative offset, clip the left side
                const clippedLine = line.substring(Math.abs(offset));
                positioned.push(clippedLine);
            }
        }
        
        return positioned.join('\n');
    }

    // Generate complete animation frames - WITHOUT code blocks
    getAnimationFrames() {
        const frames = [];
        
        frames.push({
            title: '🌊 **Ship Approaching from the Horizon...**',
            content: this.positionShip(40) // NO code block wrapper
        });
        
        frames.push({
            title: '🚢 **Battle Ship Entering Combat Zone...**',
            content: this.positionShip(30)
        });
        
        frames.push({
            title: '⚔️ **Ship Sailing Into Position...**',
            content: this.positionShip(20)
        });
        
        frames.push({
            title: '🏴‍☠️ **Ship Ready for Battle!**',
            content: this.positionShip(10)
        });
        
        frames.push({
            title: '💨 **Ship Continuing Across Battlefield...**',
            content: this.positionShip(0)
        });
        
        frames.push({
            title: '🌪️ **Ship Exiting Combat Zone!**',
            content: this.positionShip(-10)
        });
        
        return frames;
    }

    // Quick 3-frame animation for combat - FIXED: No code blocks
    async playQuickAnimation(interaction, animationType = 'combat') {
        const quickFrames = [
            {
                title: '🌊 **Ship Approaching...**',
                content: this.positionShip(25) // Raw text, no ```
            },
            {
                title: '⚔️ **Ship Ready for Battle!**',
                content: this.positionShip(10)
            },
            {
                title: '🏴‍☠️ **Battle Begins!**',
                content: this.positionShip(0)
            }
        ];
        
        for (let i = 0; i < quickFrames.length; i++) {
            const frame = quickFrames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content, // Direct text, no code block
                color: this.getAnimationColor(animationType),
                footer: {
                    text: `⚔️ Combat Animation • Frame ${i + 1}/${quickFrames.length}`
                },
                timestamp: new Date().toISOString()
            };
            
            await interaction.editReply({ embeds: [embed] });
            
            // Don't delay after the last frame
            if (i < quickFrames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    }

    // Play the complete animation - FIXED: No code blocks
    async playAnimation(interaction, animationType = 'combat') {
        const frames = this.getAnimationFrames();
        
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content, // Direct text, no code block
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

    // Victory animation - FIXED: No code blocks
    async playVictoryAnimation(interaction) {
        const victoryFrames = [
            {
                title: '🏆 **Victory! Ship Departing...**',
                content: this.positionShip(0)
            },
            {
                title: '⛵ **Sailing Into the Sunset...**',
                content: this.positionShip(-15)
            },
            {
                title: '🌅 **Until Next Adventure!**',
                content: this.positionShip(-30)
            }
        ];
        
        for (let i = 0; i < victoryFrames.length; i++) {
            const frame = victoryFrames[i];
            
            const embed = {
                title: frame.title,
                description: frame.content, // Direct text, no code block
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
            content: this.positionShip(5)
        };
    }
}

// Export as singleton instance
module.exports = new RaidAnimation();
