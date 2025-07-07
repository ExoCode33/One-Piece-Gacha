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
        this.canvasWidth = 70;
    }

    positionShipAcross(frame, totalFrames) {
        const shipWidth = this.shipDesign[0].length;
        const startOffset = this.canvasWidth;
        const endOffset = -shipWidth;
        const range = startOffset - endOffset;
        const offset = Math.round(startOffset - (frame / (totalFrames - 1)) * range);
        return this.shipDesign.map(line => {
            if (offset >= 0) {
                return ' '.repeat(offset) + line.slice(0, this.canvasWidth - offset);
            } else {
                const abs = Math.abs(offset);
                return line.slice(abs, abs + this.canvasWidth);
            }
        }).join('\n');
    }

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
            await new Promise(res => setTimeout(res, 80));
        }
    }

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

    // CORRECTED QUICK ANIMATION: Offscreen right, center, offscreen left
    async playQuickAnimation(interaction, animationType = 'combat') {
        const totalFrames = 3;
        const shipWidth = this.shipDesign[0].length;
        const canvasWidth = this.canvasWidth;
        const frames = [
            // Ship completely offscreen right (invisible)
            this.positionShipAcross(0, totalFrames + 1), 
            // Ship perfectly centered
            this.positionShip(Math.floor((canvasWidth - shipWidth) / 2)),
            // Ship completely offscreen left (invisible)
            this.positionShipAcross(totalFrames + 1, totalFrames + 1)
        ];
        const titles = [
            "🌊 **Ship Approaching...**",
            "⚔️ **Ship Ready for Battle!**",
            "🏴‍☠️ **Battle Begins!**"
        ];
        for (let i = 0; i < totalFrames; i++) {
            const embed = {
                title: titles[i],
                color: this.getAnimationColor(animationType),
                footer: { text: `⚔️ Combat Animation • Frame ${i + 1}/${totalFrames}` },
                timestamp: new Date().toISOString()
            };
            await interaction.editReply({
                content: `\`\`\`\n${frames[i]}\n\`\`\``,
                embeds: [embed]
            });
            if (i < totalFrames - 1) await new Promise(res => setTimeout(res, 800));
        }
    }

    async playAnimation(interaction, animationType = 'combat') {
        await this.playFullSailAnimation(interaction, animationType);
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

    getBattleReadyShip() {
        return {
            title: '🏟️ **Battle Ship Deployed!**',
            content: this.positionShip(Math.floor(this.canvasWidth / 2 - this.shipDesign[0].length / 2))
        };
    }
}

module.exports = new RaidAnimation();
