// FAKE PLAYER SYSTEM
// Test NPC with realistic stats for raid testing

const BerryEconomySystem = require('../systems/economy');

class FakePlayerSystem {
    constructor() {
        this.fakePlayer = {
            id: 'fake_player_npc',
            username: 'Monkey D. Tester',
            displayName: 'Monkey D. Tester (NPC)',
            level: 25,
            berries: 75000, // Substantial amount for testing
            lastCollection: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
            
            // Fake player's Devil Fruit collection (Level 25 appropriate)
            devilFruits: [
                {
                    id: 'fruit_052',
                    name: 'Hana Hana no Mi',
                    type: 'Paramecia',
                    rarity: 'uncommon',
                    element: 'neutral',
                    combatPower: 380,
                    duplicates: 3, // +3% CP bonus
                    resistance: {
                        physical: 0.2,
                        elemental: 0.1,
                        special: 0.15
                    },
                    abilities: ['Bloom: Hundred Hands', 'Gigantesco Mano', 'Mil Fleur']
                },
                {
                    id: 'fruit_077',
                    name: 'Mera Mera no Mi',
                    type: 'Logia',
                    rarity: 'rare',
                    element: 'fire',
                    combatPower: 620,
                    duplicates: 1,
                    resistance: {
                        physical: 0.8, // Logia immunity
                        fire: 0.9, // Strong fire resistance
                        ice: -0.3, // Weak to ice
                        water: -0.2 // Weak to water
                    },
                    abilities: ['Fire Fist', 'Flame Spear', 'Fire Pillar']
                },
                {
                    id: 'fruit_093',
                    name: 'Zushi Zushi no Mi',
                    type: 'Paramecia',
                    rarity: 'epic',
                    element: 'gravity',
                    combatPower: 980,
                    duplicates: 1,
                    resistance: {
                        physical: 0.3,
                        elemental: 0.25,
                        gravity: 0.9,
                        special: 0.4
                    },
                    abilities: ['Gravity Blade', 'Meteor Pull', 'Gravity Well']
                },
                {
                    id: 'fruit_015',
                    name: 'Yomi Yomi no Mi',
                    type: 'Paramecia',
                    rarity: 'common',
                    element: 'soul',
                    combatPower: 182,
                    duplicates: 5, // +5% CP bonus
                    resistance: {
                        physical: 0.1,
                        soul: 0.8,
                        death: 0.95,
                        ice: 0.3
                    },
                    abilities: ['Soul Solid', 'Kasuriuta Fubuki Giri', 'Ice Arrow']
                }
            ],

            // Combat stats
            baseHP: 100,
            currentHP: 100,
            
            // Raid protection status
            protected: false,
            protectionEnd: null,
            
            // Raid history
            raidStats: {
                totalDefenses: 47,
                successfulDefenses: 23,
                defenseWinRate: 49,
                lastRaided: Date.now() - (30 * 60 * 1000), // 30 minutes ago
                defeatedBy: ['Captain Usopp', 'Iron Fist Garp', 'Red Hair Luffy']
            }
        };
    }

    // Get fake player data
    getFakePlayer() {
        // Calculate total combat power with duplicates
        let totalCP = 0;
        this.fakePlayer.devilFruits.forEach(fruit => {
            const duplicateBonus = 1 + (fruit.duplicates - 1) * 0.01;
            totalCP += Math.floor(fruit.combatPower * duplicateBonus);
        });

        // Calculate hourly income
        const hourlyIncome = BerryEconomySystem.calculateHourlyIncome(totalCP);
        const dailyIncome = hourlyIncome * 24;

        return {
            ...this.fakePlayer,
            totalCombatPower: totalCP,
            hourlyIncome: hourlyIncome,
            dailyIncome: dailyIncome,
            estimatedNetWorth: this.fakePlayer.berries + (dailyIncome * 7) // Week's worth
        };
    }

    // Get fake player's strongest fruits for combat
    getStrongestFruits(limit = 3) {
        return this.fakePlayer.devilFruits
            .map(fruit => ({
                ...fruit,
                effectiveCP: Math.floor(fruit.combatPower * (1 + (fruit.duplicates - 1) * 0.01))
            }))
            .sort((a, b) => b.effectiveCP - a.effectiveCP)
            .slice(0, limit);
    }

    // Calculate damage resistance against specific attack type
    calculateResistance(attackElement, attackType = 'physical') {
        let totalResistance = 0;
        let fruitsUsed = 0;

        this.fakePlayer.devilFruits.forEach(fruit => {
            if (fruit.resistance[attackElement]) {
                totalResistance += fruit.resistance[attackElement];
                fruitsUsed++;
            } else if (fruit.resistance[attackType]) {
                totalResistance += fruit.resistance[attackType];
                fruitsUsed++;
            }
        });

        // Average resistance across all fruits, capped at 90%
        const avgResistance = fruitsUsed > 0 ? totalResistance / fruitsUsed : 0;
        return Math.min(0.9, Math.max(-0.5, avgResistance));
    }

    // Get random combat ability for fake player
    getRandomAbility() {
        const allAbilities = this.fakePlayer.devilFruits.flatMap(fruit => 
            fruit.abilities.map(ability => ({
                name: ability,
                fruitName: fruit.name,
                element: fruit.element,
                power: fruit.effectiveCP || fruit.combatPower
            }))
        );

        return allAbilities[Math.floor(Math.random() * allAbilities.length)];
    }

    // Simulate taking damage
    takeDamage(damage) {
        this.fakePlayer.currentHP = Math.max(0, this.fakePlayer.currentHP - damage);
        return this.fakePlayer.currentHP;
    }

    // Heal to full (for next combat)
    heal() {
        this.fakePlayer.currentHP = this.fakePlayer.baseHP;
    }

    // Update fake player's berries after raid
    adjustBerries(amount) {
        this.fakePlayer.berries = Math.max(0, this.fakePlayer.berries + amount);
        return this.fakePlayer.berries;
    }

    // Remove a random fruit (for raid losses)
    loseRandomFruit() {
        if (this.fakePlayer.devilFruits.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * this.fakePlayer.devilFruits.length);
        const lostFruit = this.fakePlayer.devilFruits[randomIndex];
        
        // Remove the fruit
        this.fakePlayer.devilFruits.splice(randomIndex, 1);
        
        return {
            fruit_id: lostFruit.id,
            name: lostFruit.name,
            type: lostFruit.type,
            rarity: lostFruit.rarity,
            combat_power: lostFruit.combatPower,
            power: `Can use ${lostFruit.abilities.join(', ')}`,
            previousUser: this.fakePlayer.username
        };
    }

    // Get element effectiveness chart
    getElementChart() {
        return {
            fire: {
                strong_against: ['ice', 'plant', 'paper'],
                weak_against: ['water', 'earth', 'gravity'],
                neutral: ['fire', 'lightning', 'wind', 'soul', 'neutral']
            },
            ice: {
                strong_against: ['water', 'plant', 'soul'],
                weak_against: ['fire', 'lightning', 'light'],
                neutral: ['ice', 'earth', 'wind', 'gravity', 'neutral']
            },
            water: {
                strong_against: ['fire', 'earth', 'sand'],
                weak_against: ['ice', 'lightning', 'plant'],
                neutral: ['water', 'wind', 'gravity', 'soul', 'neutral']
            },
            lightning: {
                strong_against: ['water', 'metal', 'wind'],
                weak_against: ['earth', 'gravity', 'rubber'],
                neutral: ['lightning', 'fire', 'ice', 'soul', 'neutral']
            },
            earth: {
                strong_against: ['lightning', 'fire', 'wind'],
                weak_against: ['water', 'plant', 'gravity'],
                neutral: ['earth', 'ice', 'metal', 'soul', 'neutral']
            },
            gravity: {
                strong_against: ['all'], // Gravity affects everything
                weak_against: [],
                neutral: ['gravity']
            },
            soul: {
                strong_against: ['neutral', 'physical'],
                weak_against: ['light', 'holy'],
                neutral: ['soul', 'fire', 'ice', 'water', 'earth']
            },
            neutral: {
                strong_against: [],
                weak_against: ['all_elements'],
                neutral: ['neutral']
            }
        };
    }

    // Calculate elemental advantage
    calculateElementalAdvantage(attackerElement, defenderElement) {
        const chart = this.getElementChart();
        const attackerChart = chart[attackerElement] || chart.neutral;
        
        if (attackerChart.strong_against.includes(defenderElement)) {
            return 1.5; // 50% more damage
        } else if (attackerChart.weak_against.includes(defenderElement)) {
            return 0.7; // 30% less damage
        } else {
            return 1.0; // Normal damage
        }
    }

    // Get combat description based on elements
    getCombatDescription(attackerElement, defenderElement, advantage) {
        if (advantage > 1.0) {
            return `🔥 **ELEMENTAL ADVANTAGE!** ${attackerElement} is super effective against ${defenderElement}!`;
        } else if (advantage < 1.0) {
            return `🛡️ **ELEMENTAL RESISTANCE!** ${defenderElement} resists ${attackerElement} attacks!`;
        } else {
            return `⚔️ **NEUTRAL DAMAGE** - No elemental advantage`;
        }
    }

    // Get fake player's current status for display
    getDisplayStatus() {
        const player = this.getFakePlayer();
        return {
            name: player.displayName,
            level: player.level,
            berries: player.berries.toLocaleString(),
            totalCP: player.totalCombatPower.toLocaleString(),
            fruitCount: player.devilFruits.length,
            hourlyIncome: player.hourlyIncome.toLocaleString(),
            hp: `${player.currentHP}/${player.baseHP}`,
            winRate: `${player.raidStats.defenseWinRate}% (${player.raidStats.successfulDefenses}W/${player.raidStats.totalDefenses - player.raidStats.successfulDefenses}L)`,
            topFruits: this.getStrongestFruits(3).map(f => `${f.name} (${f.effectiveCP} CP)`).join(', ')
        };
    }
}

module.exports = new FakePlayerSystem();
