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

    // 15-frame smooth sail animation
    async playQuickAnimation(interaction, animationType = 'combat') {
        const framesCount = 15;
        const shipWidth = this.shipDesign[0].length;
        const canvasWidth = this.canvasWidth;
        const startOffset = canvasWidth;
        const endOffset = -shipWidth;

        for (let i = 0; i < framesCount; i++) {
            const offset = Math.round(
                startOffset + (endOffset - startOffset) * (i / (framesCount - 1))
            );

            const content = this.positionShip(offset);

            const embed = {
                title:
                    i === 0
                        ? "🌊 **Ship Appears on the Horizon...**"
                        : i === framesCount - 1
                            ? "🌅 **Ship Disappears on the Left!**"
                            : "🏴‍☠️ **Ship Sailing Across!**",
                color: this.getAnimationColor(animationType),
                footer: { text: `⚔️ Combat Animation • Frame ${i + 1}/${framesCount}` },
                timestamp: new Date().toISOString()
            };

            await interaction.editReply({
                content: `\`\`\`\n${content}\n\`\`\``,
                embeds: [embed]
            });

            if (i < framesCount - 1) await new Promise(res => setTimeout(res, 120));
        }
    }

    async playFullSailAnimation(interaction, animationType = 'combat') {
        // Optional: you can just call playQuickAnimation with more frames if you wish!
        await this.playQuickAnimation(interaction, animationType);
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
