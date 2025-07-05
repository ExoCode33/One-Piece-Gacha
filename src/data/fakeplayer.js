// FAKE PLAYER SYSTEM
// Test NPC with realistic stats for raid testing

const BerryEconomySystem = require('../systems/economy');

class FakePlayerSystem {
    constructor() {
        this.fakePlayer = {
            id: 'fake_player_npc',
            username: 'Monkey D. Tester',
            level: 25,
            berries: 75000,
            
            // Diverse Devil Fruit collection with different elements
            fruits: [
                {
                    id: 'fruit_026',
                    name: 'Mera Mera no Mi',
                    type: 'Logia',
                    rarity: 'rare',
                    power: 'Can create, control, and become fire.',
                    previousUser: 'Portgas D. Ace',
                    combatPower: 580,
                    duplicateCount: 2, // 2% bonus = 591 effective CP
                    effectiveCP: 591,
                    source: 'canon'
                },
                {
                    id: 'fruit_089',
                    name: 'Zushi Zushi no Mi',
                    type: 'Paramecia',
                    rarity: 'epic',
                    power: 'Can create and manipulate gravitational forces.',
                    previousUser: 'Fujitora',
                    combatPower: 950,
                    duplicateCount: 4, // 4% bonus = 988 effective CP
                    effectiveCP: 988,
                    source: 'canon'
                },
                {
                    id: 'fruit_052',
                    name: 'Hana Hana no Mi',
                    type: 'Paramecia',
                    rarity: 'uncommon',
                    power: 'Can sprout body parts from any surface.',
                    previousUser: 'Nico Robin',
                    combatPower: 370,
                    duplicateCount: 6, // 6% bonus = 392 effective CP
                    effectiveCP: 392,
                    source: 'canon'
                },
                {
                    id: 'fruit_078',
                    name: 'Yomi Yomi no Mi',
                    type: 'Paramecia',
                    rarity: 'uncommon',
                    power: 'Allows the user to return to life after death once.',
                    previousUser: 'Brook',
                    combatPower: 180,
                    duplicateCount: 6, // 6% bonus = 191 effective CP
                    effectiveCP: 191,
                    source: 'canon'
                }
            ],
            
            // Calculated stats
            totalCP: 2162, // Sum of effective CPs
            totalFruits: 4,
            winRate: 49, // 49% defense win rate (balanced for testing)
            
            // Battle history for realism
            battlesWon: 127,
            battlesLost: 132,
            totalBattles: 259,
            
            // Income calculation
            hourlyIncome: 316, // Will be calculated properly
            lastIncomeCollection: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        };
        
        // Calculate proper hourly income
        this.calculateStats();
    }
    
    calculateStats() {
        // Calculate total effective CP
        this.fakePlayer.totalCP = this.fakePlayer.fruits.reduce((total, fruit) => {
            return total + fruit.effectiveCP;
        }, 0);
        
        // Calculate hourly income using the economy system
        // Note: We'll calculate this manually to avoid circular dependency
        const baseRate = 100;
        const cpMultiplier = 0.1;
        const scalingThreshold = 1000;
        const scalingBonus = 0.05;
        
        let income = baseRate + (this.fakePlayer.totalCP * cpMultiplier);
        
        // Apply scaling bonus for high CP
        if (this.fakePlayer.totalCP > scalingThreshold) {
            const bonus = (this.fakePlayer.totalCP - scalingThreshold) * scalingBonus;
            income += bonus;
        }
        
        this.fakePlayer.hourlyIncome = Math.floor(income);
        
        // Update win rate calculation
        this.fakePlayer.winRate = Math.floor((this.fakePlayer.battlesWon / this.fakePlayer.totalBattles) * 100);
    }
    
    getFakePlayer() {
        return { ...this.fakePlayer };
    }
    
    // Get random fruit from NPC collection
    getRandomFruit() {
        const fruits = this.fakePlayer.fruits;
        return fruits[Math.floor(Math.random() * fruits.length)];
    }
    
    // Get strongest fruit (for strategic combat)
    getStrongestFruit() {
        return this.fakePlayer.fruits.reduce((strongest, current) => {
            return current.effectiveCP > strongest.effectiveCP ? current : strongest;
        });
    }
    
    // Get fruit by element type
    getFruitByElement(element) {
        const elementMap = {
            'fire': ['Mera Mera no Mi'],
            'gravity': ['Zushi Zushi no Mi'],
            'plant': ['Hana Hana no Mi'],
            'soul': ['Yomi Yomi no Mi']
        };
        
        const fruitNames = elementMap[element] || [];
        const matchingFruit = this.fakePlayer.fruits.find(fruit => 
            fruitNames.includes(fruit.name)
        );
        
        return matchingFruit || this.getRandomFruit();
    }
    
    // Simulate berry spending (for testing)
    spendBerries(amount) {
        this.fakePlayer.berries = Math.max(0, this.fakePlayer.berries - amount);
        return this.fakePlayer.berries;
    }
    
    // Add berries (for raid rewards)
    addBerries(amount) {
        this.fakePlayer.berries += amount;
        return this.fakePlayer.berries;
    }
    
    // Get detailed stats for display
    getDetailedStats() {
        return {
            profile: {
                username: this.fakePlayer.username,
                level: this.fakePlayer.level,
                berries: this.fakePlayer.berries,
                hourlyIncome: this.fakePlayer.hourlyIncome
            },
            collection: {
                totalFruits: this.fakePlayer.totalFruits,
                totalCP: this.fakePlayer.totalCP,
                averageCP: Math.floor(this.fakePlayer.totalCP / this.fakePlayer.totalFruits),
                rarityBreakdown: this.getRarityBreakdown()
            },
            combat: {
                winRate: this.fakePlayer.winRate,
                battlesWon: this.fakePlayer.battlesWon,
                battlesLost: this.fakePlayer.battlesLost,
                totalBattles: this.fakePlayer.totalBattles,
                strongestFruit: this.getStrongestFruit()
            }
        };
    }
    
    getRarityBreakdown() {
        const breakdown = {};
        this.fakePlayer.fruits.forEach(fruit => {
            breakdown[fruit.rarity] = (breakdown[fruit.rarity] || 0) + 1;
        });
        return breakdown;
    }
    
    // Update battle stats after combat
    updateBattleStats(won) {
        if (won) {
            this.fakePlayer.battlesWon++;
        } else {
            this.fakePlayer.battlesLost++;
        }
        this.fakePlayer.totalBattles++;
        this.calculateStats(); // Recalculate win rate
    }
}

module.exports = new FakePlayerSystem();
