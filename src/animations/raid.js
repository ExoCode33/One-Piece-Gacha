// src/animations/raid.js - FULL SAIL-ACROSS ANIMATION, with legacy methods restored!

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

        this.canvasWidth = 70; // How wide the Discord message box is (80 or less for safety)
    }

    // Ship position for a given frame, as it "sails" from right to left
    positionShipAcross(frame, totalFrames) {
        const shipWidth = this.shipDesign[0].length;
        const startOffset = this.canvasWidth;
        const endOffset = -shipWidth;
        const range = startOffset - endOffset;
        const offset = Math.round(startOffset - (frame / (totalFrames - 1)) * range);

        return this.shipDesign.map(line => {
            if (offset >= 0) {
                // Ship is entering or within view, pad left
                return ' '.repeat(offset) + line.slice(0, this.canvasWidth - offset);
            } else {
                // Ship is leaving left, clip left side
                const abs = Math.abs(offset);
                return line.slice(abs, abs + this.canvasWidth);
            }
        }).join('\n');
    }

    // The classic full sail animation (from right to left)
    async playFullSailAnimation(interaction, animationType = 'combat') {
        const totalFrames = this.canvasWidth + this.shipDesign[0].length + 2;
        for (let i = 0; i < totalFrames; i++) {
            const content = this.positionShipAcross(i, totalFrames);
            const embed = {
                title: i === 0
                    ? "🌊 **Ship Appears on the Horizon...**"
                    : (i === totalFrames - 1
                        ? "🌅 **Ship Disappears on the Left!**"
                        : "🏴‍☠️ **Ship Sailing Across!**"),
                color: this.getAnimationColor(animationType),
                footer: { text: `Frame ${i + 1}/${totalFrames}` },
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({
                content: `\`\`\`\n${content}\n\`\`\``,
                embeds: [embed]
            });
            await new Promise(res => setTimeout(res, 80)); // Adjust for speed!
        }
    }

    // For static ship display (centered or at any offset)
    positionShip(offset) {
        return this.shipDesign.map(line => {
            if (offset >= 0) {
                return ' '.repeat(offset) + line.slice(0, this.canvasWidth - offset);
            } else {
                const abs = Math.abs(offset);
                return line.slice(abs, abs + this.canvasWidth);
            }
        }).join('\n');
    }

    // Classic quick animation: 3 frames only, like your old bot
    async playQuickAnimation(interaction, animationType = 'combat') {
        const totalFrames = 3;
        for (let i = 0; i < totalFrames; i++) {
            const content = this.positionShipAcross(
                // Space the 3 frames across the full animation for effect
                Math.floor((i / (totalFrames - 1)) * (this.canvasWidth + this.shipDesign[0].length)),
                this.canvasWidth + this.shipDesign[0].length + 2
            );
            const embed = {
                title: i === 0
                    ? "🌊 **Ship Approaching...**"
                    : (i === totalFrames - 1
                        ? "🏴‍☠️ **Battle Begins!**"
                        : "⚔️ **Ship Ready for Battle!**"),
                color: this.getAnimationColor(animationType),
                footer: { text: `⚔️ Combat Animation • Frame ${i + 1}/${totalFrames}` },
                timestamp: new Date().toISOString()
            };
            await interaction.editReply({
                content: `\`\`\`\n${content}\n\`\`\``,
                embeds: [embed]
            });
            if (i < totalFrames - 1) await new Promise(res => setTimeout(res, 800));
        }
    }

    // Classic full animation (legacy): just call the new full sail method
    async playAnimation(interaction, animationType = 'combat') {
        await this.playFullSailAnimation(interaction, animationType);
    }

    // Colors for different animation types
    getAnimationColor(type) {
        const colors = {
            combat: 0x1E90FF,
            pvp: 0xFF1493,
            victory: 0x00FF00,
            defeat: 0xFF0000
        };
        return colors[type] || colors.combat;
    }

    // For static "ready" display
    getBattleReadyShip() {
        return {
            title: '🏟️ **Battle Ship Deployed!**',
            content: this.positionShip(Math.floor(this.canvasWidth / 2 - this.shipDesign[0].length / 2))
        };
    }
}

module.exports = new RaidAnimation();
