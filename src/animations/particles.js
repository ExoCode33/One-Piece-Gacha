// ═══════════════════════════════════════════════════════════════════
//                 ONE PIECE THEMED PARTICLE SYSTEMS
// ═══════════════════════════════════════════════════════════════════

const ParticlesSystem = {
    createOnePieceParticles(intensity, type = 'energy', rarity = 'common') {
        const onePieceParticleSystems = {
            energy: {
                common: ['⚓', '🌊', '💨'],
                uncommon: ['⚓', '🌊', '💨', '⚡'],
                rare: ['⚓', '🌊', '💨', '⚡', '🔥'],
                legendary: ['⚓', '🌊', '💨', '⚡', '🔥', '⭐', '💎'],
                mythical: ['⚓', '🌊', '💨', '⚡', '🔥', '⭐', '💎', '👑'],
                omnipotent: ['⚓', '🌊', '💨', '⚡', '🔥', '⭐', '💎', '👑', '🏴‍☠️']
            },
            ocean: {
                common: ['🌊', '💧', '🌀'],
                uncommon: ['🌊', '💧', '🌀', '⚓'],
                rare: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️'],
                legendary: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️', '⭐'],
                mythical: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️', '⭐', '👑'],
                omnipotent: ['🌊', '💧', '🌀', '⚓', '🏴‍☠️', '⭐', '👑', '💎', '🔥']
            },
            grandline: {
                common: ['🏴‍☠️', '⚓'],
                uncommon: ['🏴‍☠️', '⚓', '🌊'],
                rare: ['🏴‍☠️', '⚓', '🌊', '💎'],
                legendary: ['🏴‍☠️', '⚓', '🌊', '💎', '👑', '⭐'],
                mythical: ['🏴‍☠️', '⚓', '🌊', '💎', '👑', '⭐', '🔥'],
                omnipotent: ['🏴‍☠️', '⚓', '🌊', '💎', '👑', '⭐', '🔥', '⚡', '🌀']
            },
            celebration: {
                common: ['🎉', '⚓'],
                uncommon: ['🎉', '⚓', '🌊'],
                rare: ['🎉', '⚓', '🌊', '🏴‍☠️'],
                legendary: ['🎉', '⚓', '🌊', '🏴‍☠️', '💎', '👑'],
                mythical: ['🎉', '⚓', '🌊', '🏴‍☠️', '💎', '👑', '⭐'],
                omnipotent: ['🎉', '⚓', '🌊', '🏴‍☠️', '💎', '👑', '⭐', '🔥', '⚡']
            }
        };
        
        const particles = onePieceParticleSystems[type]?.[rarity] || onePieceParticleSystems.energy.common;
        
        // CONTROLLED LENGTH - max 15 emojis to prevent line wrapping
        const maxCount = 15;
        const rarityMultipliers = { common: 0.6, uncommon: 0.7, rare: 0.8, legendary: 0.9, mythical: 1.0, omnipotent: 1.0 };
        const baseCount = Math.min(intensity + 6, maxCount);
        const count = Math.floor(baseCount * (rarityMultipliers[rarity] || 0.6));
        
        // Create controlled One Piece particle pattern
        let particleString = '';
        for (let i = 0; i < Math.min(count, maxCount); i++) {
            particleString += particles[i % particles.length];
        }
        
        return particleString;
    }
};

module.exports = { ParticlesSystem };
