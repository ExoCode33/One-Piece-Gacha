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

        this.canvasWidth = 70; // How wide the message is (Discord is ~80 safe)
    }

    // Ship position at frame: slides from right to left across the "canvas"
    positionShipAcross(frame, totalFrames) {
        // Compute the left offset for this frame
        const shipWidth = this.shipDesign[0].length;
        const startOffset = this.canvasWidth;
        const endOffset = -shipWidth;
        const range = startOffset - endOffset;
        const offset = Math.round(startOffset - (frame / (totalFrames - 1)) * range);

        // Draw each line at this offset
        return this.shipDesign.map(line => {
            if (offset >= 0) {
                // Add left padding (off-screen to the right)
                return ' '.repeat(offset) + line.slice(0, this.canvasWidth - offset);
            } else {
                // Clip left side as ship leaves screen to the left
                const abs = Math.abs(offset);
                return line.slice(abs, abs + this.canvasWidth);
            }
        }).join('\n');
    }

    // Main "sailing across" animation
    async playFullSailAnimation(interaction, animationType = 'combat') {
        const totalFrames = this.canvasWidth + this.shipDesign[0].length + 2; // enough for full pass
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
            await new Promise(res => setTimeout(res, 80)); // 80ms/frame = smooth, adjust as needed
        }
    }

    // Still works for any "single position" ship (for static or victory frames)
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

    getAnimationColor(type) {
        const colors = {
            combat: 0x1E90FF,
            pvp: 0xFF1493,
            victory: 0x00FF00,
            defeat: 0xFF0000
        };
        return colors[type] || colors.combat;
    }

    // You can keep the static ship if you want
    getBattleReadyShip() {
        return {
            title: '🏟️ **Battle Ship Deployed!**',
            content: this.positionShip(Math.floor(this.canvasWidth / 2 - this.shipDesign[0].length / 2))
        };
    }
}

module.exports = new RaidAnimation();
