const { CombatSystem, DEVIL_FRUIT_ELEMENTS } = require('./counter-system');

// Devil Fruit database with detailed information
const DEVIL_FRUITS = {
    // LOGIA FRUITS (Most Powerful)
    'magu_magu_001': {
        id: 'magu_magu_001',
        name: 'Magu Magu no Mi',
        type: 'Logia',
        rarity: 'mythical',
        power: 'Absolute control over magma and volcanic forces',
        previousUser: 'Admiral Akainu',
        description: 'The ultimate offensive Logia fruit. Grants the user the ability to create, control, and become magma. The magma is so hot it can even burn fire itself, making it superior to most other Logia fruits.',
        awakening: 'Can permanently alter the landscape into volcanic terrain and create massive magma constructs.',
        weakness: 'Standard Devil Fruit weaknesses: sea water and Haki. Extremely vulnerable to cooling attacks.'
    },
    'pika_pika_001': {
        id: 'pika_pika_001',
        name: 'Pika Pika no Mi',
        type: 'Logia',
        rarity: 'mythical',
        power: 'Light manipulation and light-speed movement',
        previousUser: 'Admiral Kizaru',
        description: 'Grants the user the power to create, control, and become light. Allows for light-speed attacks and movement, making the user nearly untouchable.',
        awakening: 'Can bend light to create illusions and manipulate gravity through photons.',
        weakness: 'Reflective surfaces can redirect attacks. Sea water and Haki.'
    },
    'hie_hie_001': {
        id: 'hie_hie_001',
        name: 'Hie Hie no Mi',
        type: 'Logia',
        rarity: 'legendary',
        power: 'Ice creation and manipulation',
        previousUser: 'Former Admiral Aokiji',
        description: 'Allows the user to create, control, and become ice. Can freeze large bodies of water and create massive ice structures.',
        awakening: 'Can permanently change the climate of entire islands to frozen wastelands.',
        weakness: 'Fire and heat-based attacks. Sea water and Haki.'
    },
    'mera_mera_001': {
        id: 'mera_mera_001',
        name: 'Mera Mera no Mi',
        type: 'Logia',
        rarity: 'legendary',
        power: 'Fire creation and manipulation',
        previousUser: 'Portgas D. Ace',
        description: 'Grants the user the ability to create, control, and become fire. One of the most destructive Logia fruits with incredible offensive capabilities.',
        awakening: 'Can create self-sustaining fires and manipulate the temperature of the environment.',
        weakness: 'Magma-based attacks, water, and sea water. Haki can also bypass the fire body.'
    },
    'goro_goro_001': {
        id: 'goro_goro_001',
        name: 'Goro Goro no Mi',
        type: 'Logia',
        rarity: 'legendary',
        power: 'Lightning generation and control',
        previousUser: 'Eneru (Enel)',
        description: 'Allows the user to create, control, and become lightning. Grants incredible speed and destructive electrical attacks.',
        awakening: 'Can manipulate electromagnetic fields and control electronic devices.',
        weakness: 'Rubber completely nullifies electrical attacks. Sea water and Haki.'
    },
    'suna_suna_001': {
        id: 'suna_suna_001',
        name: 'Suna Suna no Mi',
        type: 'Logia',
        rarity: 'epic',
        power: 'Sand manipulation and desiccation',
        previousUser: 'Sir Crocodile',
        description: 'Grants the ability to create, control, and become sand. Can absorb moisture from anything touched.',
        awakening: 'Can turn entire landscapes into desert and control sandstorms on a massive scale.',
        weakness: 'Water negates sand powers temporarily. Sea water and Haki.'
    },
    'yami_yami_001': {
        id: 'yami_yami_001',
        name: 'Yami Yami no Mi',
        type: 'Logia',
        rarity: 'omnipotent',
        power: 'Darkness manipulation and Devil Fruit nullification',
        previousUser: 'Marshall D. Teach (Blackbeard)',
        description: 'The most dangerous Logia fruit. Grants control over darkness and gravity, and can nullify other Devil Fruit powers upon contact.',
        awakening: 'Can create black holes and completely absorb light and matter.',
        weakness: 'User takes increased damage from physical attacks. Cannot become intangible like other Logias.'
    },

    // MYTHICAL ZOAN FRUITS
    'hito_hito_001': {
        id: 'hito_hito_001',
        name: 'Hito Hito no Mi, Model: Nika',
        type: 'Mythical Zoan',
        rarity: 'omnipotent',
        power: 'Rubber body with reality-bending properties',
        previousUser: 'Monkey D. Luffy',
        description: 'The legendary Sun God Nika fruit. Grants a rubber body with the most ridiculous power in the world - the ability to fight with complete freedom and bring joy to others.',
        awakening: 'Can turn the environment into rubber and grant rubber properties to other objects and people.',
        weakness: 'Sharp objects can still cut through rubber. Sea water and Haki.'
    },
    'uo_uo_001': {
        id: 'uo_uo_001',
        name: 'Uo Uo no Mi, Model: Seiryu',
        type: 'Mythical Zoan',
        rarity: 'omnipotent',
        power: 'Azure Dragon transformation',
        previousUser: 'Kaido of the Hundred Beasts',
        description: 'Transforms the user into a massive Azure Dragon. Grants incredible physical strength, the ability to fly, and control over wind and lightning.',
        awakening: 'Can manipulate weather patterns and create devastating natural disasters.',
        weakness: 'Large size makes user an easier target. Sea water and Haki.'
    },
    'tori_tori_002': {
        id: 'tori_tori_002',
        name: 'Tori Tori no Mi, Model: Phoenix',
        type: 'Mythical Zoan',
        rarity: 'mythical',
        power: 'Phoenix transformation with regeneration',
        previousUser: 'Marco the Phoenix',
        description: 'Allows transformation into a phoenix. Grants flight and the ability to heal from any injury with blue flames.',
        awakening: 'Can resurrect from death once per year and heal others with phoenix flames.',
        weakness: 'Regeneration has limits against overwhelming damage. Sea water and Haki.'
    },
    'inu_inu_003': {
        id: 'inu_inu_003',
        name: 'Inu Inu no Mi, Model: Okuchi no Makami',
        type: 'Mythical Zoan',
        rarity: 'mythical',
        power: 'Great Wolf deity transformation',
        previousUser: 'Yamato',
        description: 'Transforms the user into the legendary wolf deity. Grants ice powers and incredible physical abilities.',
        awakening: 'Can command other wolves and manipulate ice on a massive scale.',
        weakness: 'Fire-based attacks are particularly effective. Sea water and Haki.'
    },

    // ANCIENT ZOAN FRUITS
    'ryu_ryu_001': {
        id: 'ryu_ryu_001',
        name: 'Ryu Ryu no Mi, Model: Allosaurus',
        type: 'Ancient Zoan',
        rarity: 'epic',
        power: 'Allosaurus transformation',
        previousUser: 'X-Drake',
        description: 'Allows transformation into an Allosaurus. Grants immense physical strength and predatory instincts.',
        awakening: 'Enhanced durability and the ability to track prey across vast distances.',
        weakness: 'Slower movement in full transformation. Sea water and Haki.'
    },
    'zou_zou_001': {
        id: 'zou_zou_001',
        name: 'Zou Zou no Mi, Model: Mammoth',
        type: 'Ancient Zoan',
        rarity: 'epic',
        power: 'Mammoth transformation',
        previousUser: 'Jack the Drought',
        description: 'Transforms the user into a massive mammoth. Provides incredible physical strength and durability.',
        awakening: 'Can cause earthquakes with footsteps and enhanced cold resistance.',
        weakness: 'Extremely large target. Vulnerable to fire attacks. Sea water and Haki.'
    },
    'ryu_ryu_002': {
        id: 'ryu_ryu_002',
        name: 'Ryu Ryu no Mi, Model: Spinosaurus',
        type: 'Ancient Zoan',
        rarity: 'epic',
        power: 'Spinosaurus transformation',
        previousUser: 'Page One',
        description: 'Allows transformation into a Spinosaurus. Grants aquatic abilities and powerful jaw strength.',
        awakening: 'Can breathe underwater in hybrid form and enhanced swimming speed.',
        weakness: 'Requires water for optimal performance. Sea water and Haki.'
    },

    // REGULAR ZOAN FRUITS
    'hito_hito_002': {
        id: 'hito_hito_002',
        name: 'Hito Hito no Mi',
        type: 'Zoan',
        rarity: 'uncommon',
        power: 'Human transformation and intelligence',
        previousUser: 'Tony Tony Chopper',
        description: 'Grants human-like intelligence and the ability to walk upright. For animals, provides human transformation.',
        awakening: 'Enhanced learning ability and can understand all languages.',
        weakness: 'Minimal combat enhancement for humans. Sea water and Haki.'
    },
    'inu_inu_001': {
        id: 'inu_inu_001',
        name: 'Inu Inu no Mi, Model: Wolf',
        type: 'Zoan',
        rarity: 'rare',
        power: 'Wolf transformation',
        previousUser: 'Jabra',
        description: 'Allows transformation into a wolf. Grants enhanced speed, agility, and pack hunting instincts.',
        awakening: 'Can communicate with and command other canines.',
        weakness: 'Vulnerable to loud noises. Sea water and Haki.'
    },
    'neko_neko_001': {
        id: 'neko_neko_001',
        name: 'Neko Neko no Mi, Model: Leopard',
        type: 'Zoan',
        rarity: 'rare',
        power: 'Leopard transformation',
        previousUser: 'Rob Lucci',
        description: 'Transforms the user into a leopard. Provides incredible speed, agility, and predatory instincts.',
        awakening: 'Enhanced night vision and the ability to move completely silently.',
        weakness: 'Overconfidence in predatory instincts. Sea water and Haki.'
    },
    'zou_zou_002': {
        id: 'zou_zou_002',
        name: 'Zou Zou no Mi',
        type: 'Zoan',
        rarity: 'uncommon',
        power: 'Elephant transformation',
        previousUser: 'Spandam\'s sword Funkfreed',
        description: 'Grants elephant transformation. Provides immense physical strength and a powerful trunk.',
        awakening: 'Enhanced memory and the ability to communicate with elephants.',
        weakness: 'Large size makes user slow. Sea water and Haki.'
    },

    // SPECIAL PARAMECIA FRUITS
    'mochi_mochi_001': {
        id: 'mochi_mochi_001',
        name: 'Mochi Mochi no Mi',
        type: 'Special Paramecia',
        rarity: 'legendary',
        power: 'Mochi creation and manipulation',
        previousUser: 'Charlotte Katakuri',
        description: 'A Special Paramecia that acts like a Logia. Allows the user to create, control, and become mochi. Can see slightly into the future.',
        awakening: 'Can turn the environment into mochi and predict enemy movements.',
        weakness: 'Liquid attacks can make mochi soggy and unusable. Sea water and Haki.'
    },

    // PARAMECIA FRUITS
    'gura_gura_001': {
        id: 'gura_gura_001',
        name: 'Gura Gura no Mi',
        type: 'Paramecia',
        rarity: 'omnipotent',
        power: 'Earthquake generation',
        previousUser: 'Edward Newgate (Whitebeard)',
        description: 'The strongest Paramecia fruit. Grants the power to create earthquakes and destroy the world itself.',
        awakening: 'Can create permanent tectonic changes and control seismic activity globally.',
        weakness: 'Vibrations can be countered by opposing frequencies. Sea water and Haki.'
    },
    'ope_ope_001': {
        id: 'ope_ope_001',
        name: 'Ope Ope no Mi',
        type: 'Paramecia',
        rarity: 'mythical',
        power: 'Operating room creation and spatial manipulation',
        previousUser: 'Trafalgar D. Water Law',
        description: 'Creates a spherical operating room where the user can manipulate anything within. Can perform impossible surgical procedures.',
        awakening: 'Can extend the Room to cover entire islands and grant eternal life to others.',
        weakness: 'Requires stamina to maintain large Rooms. Sea water and Haki.'
    },
    'nikyu_nikyu_001': {
        id: 'nikyu_nikyu_001',
        name: 'Nikyu Nikyu no Mi',
        type: 'Paramecia',
        rarity: 'legendary',
        power: 'Paw pad creation and repulsion',
        previousUser: 'Bartholomew Kuma',
        description: 'Creates paw pads that can repel anything, including physical attacks, pain, and even abstract concepts.',
        awakening: 'Can repel time itself and travel to any location instantly.',
        weakness: 'Requires precise timing and positioning. Sea water and Haki.'
    },
    'doku_doku_001': {
        id: 'doku_doku_001',
        name: 'Doku Doku no Mi',
        type: 'Paramecia',
        rarity: 'epic',
        power: 'Poison generation and immunity',
        previousUser: 'Magellan',
        description: 'Grants the ability to generate various types of poison and complete immunity to all toxins.',
        awakening: 'Can create airborne toxins and poison that affects the soul itself.',
        weakness: 'Wax can contain poison. Antidotes exist for some poisons. Sea water and Haki.'
    },
    'mera_mera_002': {
        id: 'mera_mera_002',
        name: 'Gomu Gomu no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Rubber body properties',
        previousUser: 'Unknown',
        description: 'Grants the user a rubber body, providing immunity to blunt attacks and electrical attacks.',
        awakening: 'Can turn the environment into rubber and affect other people with rubber properties.',
        weakness: 'Sharp objects can cut through rubber. Fire can burn rubber. Sea water and Haki.'
    },
    'bari_bari_001': {
        id: 'bari_bari_001',
        name: 'Bari Bari no Mi',
        type: 'Paramecia',
        rarity: 'epic',
        power: 'Barrier creation',
        previousUser: 'Bartolomeo',
        description: 'Creates invisible barriers that are virtually indestructible. Can be shaped into various forms.',
        awakening: 'Barriers can reflect attacks back at enemies and become permanently placed.',
        weakness: 'Limited number of barriers at once. Can be bypassed by going around. Sea water and Haki.'
    },
    'hana_hana_001': {
        id: 'hana_hana_001',
        name: 'Hana Hana no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Body part replication',
        previousUser: 'Nico Robin',
        description: 'Allows the user to sprout copies of their body parts from any surface.',
        awakening: 'Can create full-body clones and sprout body parts of other people.',
        weakness: 'Damage to sprouted parts affects the real body. Sea water and Haki.'
    },
    'sube_sube_001': {
        id: 'sube_sube_001',
        name: 'Sube Sube no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Smooth skin and attack deflection',
        previousUser: 'Alvida',
        description: 'Makes the user\'s skin perfectly smooth, causing attacks to slip off harmlessly.',
        awakening: 'Can make other objects and people smooth, and control friction.',
        weakness: 'Targeted attacks can still hit. Sea water and Haki affect the smoothness.'
    },
    'bomu_bomu_001': {
        id: 'bomu_bomu_001',
        name: 'Bomu Bomu no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Explosion generation',
        previousUser: 'Mr. 5',
        description: 'Allows the user to make any part of their body explode, including breath and bodily waste.',
        awakening: 'Can create delayed explosions and make other objects explosive.',
        weakness: 'User is not immune to other explosions. Sea water and Haki.'
    },
    'kilo_kilo_001': {
        id: 'kilo_kilo_001',
        name: 'Kilo Kilo no Mi',
        type: 'Paramecia',
        rarity: 'common',
        power: 'Weight manipulation',
        previousUser: 'Miss Valentine',
        description: 'Allows the user to change their body weight from 1 kilogram to 10,000 kilograms.',
        awakening: 'Can affect the weight of other objects and people.',
        weakness: 'Cannot become lighter than 1kg or heavier than 10,000kg. Sea water and Haki.'
    },
    'supa_supa_001': {
        id: 'supa_supa_001',
        name: 'Supa Supa no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Blade body transformation',
        previousUser: 'Daz Bonez (Mr. 1)',
        description: 'Turns any part of the user\'s body into steel blades.',
        awakening: 'Can turn other objects into blades and extend blade length.',
        weakness: 'Rust can affect the blades. Strong enough force can break the blades. Sea water and Haki.'
    },
    'toge_toge_001': {
        id: 'toge_toge_001',
        name: 'Toge Toge no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Spike generation',
        previousUser: 'Miss Doublefinger',
        description: 'Allows the user to grow spikes from any part of their body.',
        awakening: 'Can create spikes from the environment and control their size and sharpness.',
        weakness: 'Spikes can be broken with enough force. Sea water and Haki.'
    },
    'ori_ori_001': {
        id: 'ori_ori_001',
        name: 'Ori Ori no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Cage and binding creation',
        previousUser: 'Hina',
        description: 'Allows the user to create iron restraints and cages that pass through the target\'s body.',
        awakening: 'Can create permanent restraints and manipulate existing metal.',
        weakness: 'Strong enough individuals can break the restraints. Sea water and Haki.'
    },
    'noro_noro_001': {
        id: 'noro_noro_001',
        name: 'Noro Noro no Mi',
        type: 'Paramecia',
        rarity: 'epic',
        power: 'Slowness beam projection',
        previousUser: 'Foxy',
        description: 'Emits beams that slow down anything they hit for 30 seconds.',
        awakening: 'Can create areas of permanent slowness and affect time flow.',
        weakness: 'Beams can be reflected by mirrors. Effect is temporary. Sea water and Haki.'
    },
    'door_door_001': {
        id: 'door_door_001',
        name: 'Doa Doa no Mi',
        type: 'Paramecia',
        rarity: 'epic',
        power: 'Door creation anywhere',
        previousUser: 'Blueno',
        description: 'Allows the user to create doors on any surface, including the air itself.',
        awakening: 'Can create permanent doorways and access pocket dimensions.',
        weakness: 'Doors can be locked from the other side. Sea water and Haki.'
    },
    'awa_awa_001': {
        id: 'awa_awa_001',
        name: 'Awa Awa no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Soap bubble creation',
        previousUser: 'Kalifa',
        description: 'Creates soap bubbles that can clean the strength out of people and make surfaces slippery.',
        awakening: 'Can create acidic bubbles and control cleanliness of the environment.',
        weakness: 'Water washes away the soap. Wind can blow bubbles away. Sea water and Haki.'
    },
    'berry_berry_001': {
        id: 'berry_berry_001',
        name: 'Beri Beri no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Body separation into berry-like spheres',
        previousUser: 'Very Good',
        description: 'Allows the user to split their body into small berry-like spheres.',
        awakening: 'Can control the spheres remotely and split other objects.',
        weakness: 'Spheres can be scattered or lost. Sea water and Haki.'
    },
    'shari_shari_001': {
        id: 'shari_shari_001',
        name: 'Shari Shari no Mi',
        type: 'Paramecia',
        rarity: 'uncommon',
        power: 'Wheel transformation',
        previousUser: 'Sharinguru',
        description: 'Allows the user to turn their limbs into wheels for high-speed movement.',
        awakening: 'Can turn other objects into wheels and control their rotation.',
        weakness: 'Vulnerable when wheels are stuck or damaged. Sea water and Haki.'
    },
    'yomi_yomi_001': {
        id: 'yomi_yomi_001',
        name: 'Yomi Yomi no Mi',
        type: 'Paramecia',
        rarity: 'mythical',
        power: 'Soul revival and manipulation',
        previousUser: 'Brook',
        description: 'Grants a second life after death and the ability to interact with souls.',
        awakening: 'Can see and manipulate the souls of living beings and travel to the afterlife.',
        weakness: 'Only works once for revival. Soul can be exorcised. Sea water and Haki.'
    },
    'kage_kage_001': {
        id: 'kage_kage_001',
        name: 'Kage Kage no Mi',
        type: 'Paramecia',
        rarity: 'legendary',
        power: 'Shadow manipulation',
        previousUser: 'Gecko Moria',
        description: 'Allows the user to steal and manipulate shadows, creating zombie armies.',
        awakening: 'Can manipulate shadows globally and create permanent shadow constructs.',
        weakness: 'Salt purifies shadows. Sunlight weakens shadow powers. Sea water and Haki.'
    },
    'horo_horo_001': {
        id: 'horo_horo_001',
        name: 'Horo Horo no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Ghost creation',
        previousUser: 'Perona',
        description: 'Creates ghosts that can pass through objects and induce negative emotions.',
        awakening: 'Can possess living beings and create permanent haunted areas.',
        weakness: 'Already negative people are immune. Physical body is vulnerable. Sea water and Haki.'
    },
    'suke_suke_001': {
        id: 'suke_suke_001',
        name: 'Suke Suke no Mi',
        type: 'Paramecia',
        rarity: 'epic',
        power: 'Invisibility',
        previousUser: 'Absalom',
        description: 'Grants invisibility to the user and anything they touch.',
        awakening: 'Can make large areas invisible and create permanent invisible objects.',
        weakness: 'Observation Haki can detect invisible users. Sea water and Haki.'
    },
    'nikyu_nikyu_002': {
        id: 'nikyu_nikyu_002',
        name: 'Kuma Kuma no Mi',
        type: 'Paramecia',
        rarity: 'rare',
        power: 'Bear transformation and strength',
        previousUser: 'Unknown',
        description: 'Grants bear-like strength and the ability to enter a berserker rage.',
        awakening: 'Enhanced hibernation abilities and can communicate with bears.',
        weakness: 'Berserker rage reduces tactical thinking. Sea water and Haki.'
    },
    'memo_memo_001': {
        id: 'memo_memo_001',
        name: 'Memo Memo no Mi',
        type: 'Paramecia',
        rarity: 'epic',
        power: 'Memory manipulation',
        previousUser: 'Charlotte Pudding',
        description: 'Allows the user to extract, edit, and replace memories of other people.',
        awakening: 'Can create false realities through mass memory manipulation.',
        weakness: 'Strong-willed individuals can resist. Physical contact required. Sea water and Haki.'
    },
    'tama_tama_001': {
        id: 'tama_tama_001',
        name: 'Tama Tama no Mi',
        type: 'Paramecia',
        rarity: 'common',
        power: 'Egg body with regeneration',
        previousUser: 'Tamago',
        description: 'Grants an egg-like body that can regenerate by cracking and reforming.',
        awakening: 'Can lay eggs that hatch into various creatures.',
        weakness: 'Vulnerable while regenerating. Sea water and Haki.'
    }
};

// Rarity probabilities (must add up to 100)
const RARITY_RATES = {
    'common': 35,      // 35%
    'uncommon': 25,    // 25%
    'rare': 20,        // 20%
    'epic': 12,        // 12%
    'legendary': 6,    // 6%
    'mythical': 1.8,   // 1.8%
    'omnipotent': 0.2  // 0.2%
};

// Get fruits by rarity
function getFruitsByRarity(rarity) {
    return Object.values(DEVIL_FRUITS).filter(fruit => fruit.rarity === rarity);
}

// Generate a random Devil Fruit based on rarity rates
function generateRandomDevilFruit() {
    // Generate random number between 0-100
    const roll = Math.random() * 100;
    
    // Determine rarity based on probabilities
    let cumulativeRate = 0;
    let selectedRarity = 'common';
    
    for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
        cumulativeRate += rate;
        if (roll <= cumulativeRate) {
            selectedRarity = rarity;
            break;
        }
    }
    
    // Get all fruits of the selected rarity
    const availableFruits = getFruitsByRarity(selectedRarity);
    
    if (availableFruits.length === 0) {
        // Fallback to common if no fruits found
        const commonFruits = getFruitsByRarity('common');
        const randomIndex = Math.floor(Math.random() * commonFruits.length);
        return { ...commonFruits[randomIndex] };
    }
    
    // Select random fruit from the rarity tier
    const randomIndex = Math.floor(Math.random() * availableFruits.length);
    const selectedFruit = availableFruits[randomIndex];
    
    // Return a copy to avoid modifying the original
    return { ...selectedFruit };
}

// Get fruit by ID
function getDevilFruitById(id) {
    return DEVIL_FRUITS[id] ? { ...DEVIL_FRUITS[id] } : null;
}

// Get all fruits of a specific type
function getFruitsByType(type) {
    return Object.values(DEVIL_FRUITS).filter(fruit => fruit.type === type);
}

// Get rarity information
function getRarityInfo() {
    return { ...RARITY_RATES };
}

// Get total number of fruits
function getTotalFruits() {
    return Object.keys(DEVIL_FRUITS).length;
}

// Get fruits by element (using counter system)
function getFruitsByElement(element) {
    return Object.values(DEVIL_FRUITS).filter(fruit => {
        const fruitElement = DEVIL_FRUIT_ELEMENTS[fruit.id];
        return fruitElement === element;
    });
}

// Statistics
function getTypeDistribution() {
    const distribution = {};
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        distribution[fruit.type] = (distribution[fruit.type] || 0) + 1;
    });
    return distribution;
}

function getRarityDistribution() {
    const distribution = {};
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        distribution[fruit.rarity] = (distribution[fruit.rarity] || 0) + 1;
    });
    return distribution;
}

// Search functions
function searchFruitsByName(query) {
    const lowercaseQuery = query.toLowerCase();
    return Object.values(DEVIL_FRUITS).filter(fruit =>
        fruit.name.toLowerCase().includes(lowercaseQuery)
    );
}

function searchFruitsByUser(query) {
    const lowercaseQuery = query.toLowerCase();
    return Object.values(DEVIL_FRUITS).filter(fruit =>
        fruit.previousUser.toLowerCase().includes(lowercaseQuery)
    );
}

// Utility functions
function isValidRarity(rarity) {
    return Object.keys(RARITY_RATES).includes(rarity);
}

function getAllTypes() {
    const types = new Set();
    Object.values(DEVIL_FRUITS).forEach(fruit => {
        types.add(fruit.type);
    });
    return Array.from(types);
}

function getAllRarities() {
    return Object.keys(RARITY_RATES);
}

// Export all functions and data
module.exports = {
    // Main data
    DEVIL_FRUITS,
    RARITY_RATES,
    
    // Core functions
    generateRandomDevilFruit,
    getDevilFruitById,
    getFruitsByRarity,
    getFruitsByType,
    getFruitsByElement,
    
    // Search functions
    searchFruitsByName,
    searchFruitsByUser,
    
    // Statistics
    getRarityInfo,
    getTotalFruits,
    getTypeDistribution,
    getRarityDistribution,
    
    // Utility functions
    isValidRarity,
    getAllTypes,
    getAllRarities
};
