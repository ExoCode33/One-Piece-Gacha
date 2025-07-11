// debug-syntax.js - Find syntax errors without bash
const fs = require('fs');
const path = require('path');

console.log('🔍 SYNTAX ERROR DETECTIVE\n');
console.log('Checking each file individually...\n');

// List of files to check
const filesToCheck = [
    'src/commands/economy-admin.js',
    'src/commands/bank.js',
    'src/commands/pull.js',
    'src/commands/raid.js',
    'src/commands/income.js',
    'src/commands/gacha-admin.js',
    'src/systems/economy.js',
    'src/systems/automatic-income.js',
    'src/database/manager.js',
    'src/data/devilfruit.js',
    'src/config/combat.js',
    'src/animations/gacha.js'
];

function checkFile(filePath) {
    try {
        console.log(`Checking: ${filePath}`);
        
        // First check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`❌ FILE NOT FOUND: ${filePath}\n`);
            return false;
        }
        
        // Try to require the file
        delete require.cache[require.resolve('./' + filePath)];
        require('./' + filePath);
        
        console.log(`✅ GOOD: ${filePath}\n`);
        return true;
        
    } catch (error) {
        console.log(`❌ ERROR in ${filePath}:`);
        console.log(`   ${error.message}`);
        console.log(`   Line: ${error.stack.split('\n')[1] || 'Unknown'}\n`);
        return false;
    }
}

// Check each file
let errorCount = 0;
let goodCount = 0;

for (const file of filesToCheck) {
    const isGood = checkFile(file);
    if (isGood) {
        goodCount++;
    } else {
        errorCount++;
    }
}

console.log('📊 RESULTS:');
console.log(`✅ Good files: ${goodCount}`);
console.log(`❌ Files with errors: ${errorCount}`);

if (errorCount === 0) {
    console.log('\n🎉 All files are syntactically correct!');
    console.log('The error might be a deeper Node.js issue.');
} else {
    console.log('\n🔧 Fix the files with errors listed above.');
}
