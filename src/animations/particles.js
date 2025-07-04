// One Piece themed particle effects for Devil Fruit animation

// One Piece themed particle emojis
const ONE_PIECE_PARTICLES = {
    // Ocean and Grand Line themed
    ocean: ['🌊', '💧', '🫧', '⚓', '🏴‍☠️', '🦈', '🐚', '🌀'],
    
    // Devil Fruit themed
    fruit: ['🍈', '🍎', '🍊', '🍋', '🍌', '🥭', '🍑', '🫐'],
    
    // Power and energy themed
    energy: ['⚡', '✨', '💫', '🌟', '⭐', '💥', '🔥', '❄️'],
    
    // Mystical and magical themed
    mystical: ['🔮', '🌙', '☄️', '🌌', '🎆', '🎇', '💎', '🗲'],
    
    // Pirate and adventure themed
    pirate: ['🏴‍☠️', '⚔️', '🗡️', '💰', '👑', '🦜', '🏝️', '🧭'],
    
    // Weather and natural forces
    nature: ['🌪️', '🌊', '🌋', '⛈️', '☀️', '🌈', '🌙', '⭐'],
    
    // Combat and battle themed
    combat: ['💥', '⚡', '🔥', '❄️', '💨', '🗲', '⚔️', '🛡️']
};

// Particle intensity levels
const PARTICLE_INTENSITIES = {
    minimal: 3,
    light: 5,
    moderate: 8,
    intense: 12,
    extreme: 16,
    overwhelming: 20
};

// Phase-specific particle configurations
const PARTICLE_PHASES = {
    // Standard animation phase
    default: {
        themes: ['ocean', 'mystical', 'energy'],
        intensity: 'moderate',
        spacing: ' '
    },
    
    // Intense moments (progression phase)
    intense: {
        themes: ['energy', 'mystical', 'combat'],
        intensity: 'intense',
        spacing: ' '
    },
    
    // Crystallization phase
    crystallizing: {
        themes: ['mystical', 'energy', 'nature'],
        intensity: 'extreme',
        spacing: ' '
    },
    
    // Final reveal
    reveal: {
        themes: ['fruit', 'mystical', 'pirate'],
        intensity: 'overwhelming',
        spacing: ' '
    },
    
    // Minimal for text-heavy sections
    subtle: {
        themes: ['ocean', 'mystical'],
        intensity: 'light',
        spacing: '  '
    }
};

/**
 * Get random particles from specified themes
 * @param {Array} themes - Array of theme names
 * @param {number} count - Number of particles to generate
 * @returns {Array} Array of particle emojis
 */
function getRandomParticles(themes, count) {
    const particles = [];
    const allParticles = [];
    
    // Collect all particles from specified themes
    themes.forEach(theme => {
        if (ONE_PIECE_PARTICLES[theme]) {
            allParticles.push(...ONE_PIECE_PARTICLES[theme]);
        }
    });
    
    // If no valid themes, fall back to mystical
    if (allParticles.length === 0) {
        allParticles.push(...ONE_PIECE_PARTICLES.mystical);
    }
    
    // Generate random particles
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allParticles.length);
        particles.push(allParticles[randomIndex]);
    }
    
    return particles;
}

/**
 * Generate particle effects for animation
 * @param {string} phase - Animation phase ('default', 'intense', 'crystallizing', 'reveal', 'subtle')
 * @param {Object} options - Optional configuration overrides
 * @returns {string} Formatted particle string
 */
function generateParticles(phase = 'default', options = {}) {
    // Get phase configuration
    const config = PARTICLE_PHASES[phase] || PARTICLE_PHASES.default;
    
    // Apply any option overrides
    const themes = options.themes || config.themes;
    const intensityKey = options.intensity || config.intensity;
    const spacing = options.spacing || config.spacing;
    
    // Get particle count from intensity
    const particleCount = PARTICLE_INTENSITIES[intensityKey] || PARTICLE_INTENSITIES.moderate;
    
    // Generate random particles
    const particles = getRandomParticles(themes, particleCount);
    
    // Format with spacing
    return particles.join(spacing);
}

/**
 * Generate particles for specific rarity levels
 * @param {string} rarity - Devil Fruit rarity
 * @returns {string} Rarity-appropriate particle effects
 */
function generateRarityParticles(rarity) {
    const rarityConfigs = {
        common: {
            themes: ['ocean', 'fruit'],
            intensity: 'light',
            spacing: '  '
        },
        uncommon: {
            themes: ['ocean', 'fruit', 'energy'],
            intensity: 'moderate',
            spacing: ' '
        },
        rare: {
            themes: ['energy', 'mystical', 'fruit'],
            intensity: 'moderate',
            spacing: ' '
        },
        epic: {
            themes: ['mystical', 'energy', 'combat'],
            intensity: 'intense',
            spacing: ' '
        },
        legendary: {
            themes: ['mystical', 'energy', 'pirate'],
            intensity: 'intense',
            spacing: ' '
        },
        mythical: {
            themes: ['mystical', 'nature', 'combat'],
            intensity: 'extreme',
            spacing: ' '
        },
        omnipotent: {
            themes: ['mystical', 'nature', 'energy'],
            intensity: 'overwhelming',
            spacing: ' '
        }
    };
    
    const config = rarityConfigs[rarity] || rarityConfigs.common;
    return generateParticles('default', config);
}

/**
 * Generate type-specific particles
 * @param {string} type - Devil Fruit type
 * @returns {string} Type-appropriate particle effects
 */
function generateTypeParticles(type) {
    const typeConfigs = {
        'Paramecia': {
            themes: ['mystical', 'energy', 'fruit'],
            intensity: 'moderate'
        },
        'Zoan': {
            themes: ['nature', 'energy', 'combat'],
            intensity: 'intense'
        },
        'Logia': {
            themes: ['nature', 'energy', 'mystical'],
            intensity: 'extreme'
        },
        'Ancient Zoan': {
            themes: ['nature', 'combat', 'mystical'],
            intensity: 'intense'
        },
        'Mythical Zoan': {
            themes: ['mystical', 'nature', 'energy'],
            intensity: 'extreme'
        },
        'Special Paramecia': {
            themes: ['mystical', 'energy', 'fruit'],
            intensity: 'intense'
        }
    };
    
    const config = typeConfigs[type] || typeConfigs['Paramecia'];
    return generateParticles('default', config);
}

/**
 * Generate progressive particles that increase over time
 * @param {number} frame - Current animation frame
 * @param {number} maxFrames - Total frames in animation
 * @returns {string} Progressive particle effects
 */
function generateProgressiveParticles(frame, maxFrames = 18) {
    const progress = frame / maxFrames;
    
    let phase;
    if (progress < 0.3) {
        phase = 'subtle';
    } else if (progress < 0.6) {
        phase = 'default';
    } else if (progress < 0.8) {
        phase = 'intense';
    } else {
        phase = 'crystallizing';
    }
    
    return generateParticles(phase);
}

/**
 * Get specific themed particles
 * @param {string} theme - Theme name
 * @param {number} count - Number of particles
 * @returns {string} Themed particles
 */
function getThemedParticles(theme, count = 8) {
    if (!ONE_PIECE_PARTICLES[theme]) {
        return generateParticles('default');
    }
    
    const particles = getRandomParticles([theme], count);
    return particles.join(' ');
}

/**
 * Generate celebration particles for successful pulls
 * @param {string} rarity - Rarity of the pulled fruit
 * @returns {string} Celebration particle effects
 */
function generateCelebrationParticles(rarity) {
    const celebrationBase = ['🎉', '🎊', '✨', '🌟', '💫', '🎆', '🎇'];
    const rarityParticles = generateRarityParticles(rarity);
    
    // Mix celebration with rarity particles
    const celebration = [];
    for (let i = 0; i < 6; i++) {
        celebration.push(celebrationBase[Math.floor(Math.random() * celebrationBase.length)]);
    }
    
    return [...celebration, ...rarityParticles.split(' ')].join(' ');
}

/**
 * Generate ambient background particles
 * @returns {string} Subtle background particle effects
 */
function generateAmbientParticles() {
    return generateParticles('subtle');
}

/**
 * Get all available themes
 * @returns {Array} Array of available theme names
 */
function getAvailableThemes() {
    return Object.keys(ONE_PIECE_PARTICLES);
}

/**
 * Get all available phases
 * @returns {Array} Array of available phase names
 */
function getAvailablePhases() {
    return Object.keys(PARTICLE_PHASES);
}

/**
 * Get particles for specific elements (for counter system integration)
 * @param {string} element - Element type
 * @returns {string} Element-appropriate particles
 */
function generateElementParticles(element) {
    const elementMappings = {
        fire: { themes: ['energy', 'combat'], intensity: 'intense' },
        ice: { themes: ['nature', 'mystical'], intensity: 'moderate' },
        lightning: { themes: ['energy', 'nature'], intensity: 'extreme' },
        earth: { themes: ['nature', 'combat'], intensity: 'moderate' },
        water: { themes: ['ocean', 'nature'], intensity: 'moderate' },
        wind: { themes: ['nature', 'energy'], intensity: 'intense' },
        light: { themes: ['mystical', 'energy'], intensity: 'extreme' },
        darkness: { themes: ['mystical', 'combat'], intensity: 'intense' },
        poison: { themes: ['mystical', 'combat'], intensity: 'moderate' },
        gravity: { themes: ['mystical', 'nature'], intensity: 'extreme' }
    };
    
    const config = elementMappings[element?.toLowerCase()] || { themes: ['mystical'], intensity: 'moderate' };
    return generateParticles('default', config);
}

// Export all functions and data
module.exports = {
    // Main particle generation
    generateParticles,
    
    // Specialized generators
    generateRarityParticles,
    generateTypeParticles,
    generateProgressiveParticles,
    generateCelebrationParticles,
    generateAmbientParticles,
    generateElementParticles,
    
    // Utility functions
    getRandomParticles,
    getThemedParticles,
    getAvailableThemes,
    getAvailablePhases,
    
    // Data exports
    ONE_PIECE_PARTICLES,
    PARTICLE_INTENSITIES,
    PARTICLE_PHASES
};
