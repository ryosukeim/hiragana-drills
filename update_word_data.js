import fs from 'fs';
import path from 'path';

const wordDataPath = './src/data/word-data.js';
let content = fs.readFileSync(wordDataPath, 'utf8');

const imageMap = {
    // Animals
    'bear': 'bear.svg',
    'cow': 'cow.svg',
    'pig': 'pig.svg',
    'elephant': 'elephant.svg',
    'monkey': 'monkey.svg',
    'penguin': 'penguin.svg',
    'dolphin': 'dolphin.svg',
    'butterfly': 'butterfly.svg',
    'horse': 'horse.svg',
    'sheep': 'sheep.svg',
    'lion': 'lion.svg',
    'giraffe': 'giraffe.svg',
    'crocodile': 'crocodile.svg',
    'hamster': 'hamster.svg',
    'kangaroo': 'kangaroo.svg',
    'tiger': 'tiger.svg',

    // Food
    'water': 'water.svg',
    'egg': 'egg.svg',
    'vegetable': 'vegetable.svg',
    'banana': 'banana.svg',
    'orange': 'orange.svg',
    'chocolate': 'chocolate.svg',
    'hamburger': 'hamburger.svg',
    'ice cream': 'ice_cream.svg', // Watch out for space in key

    // Nature
    'rain': 'rain.svg',
    'river': 'river.svg',
    'sky': 'sky.svg',
    'sun': 'sun.svg',
    'moon': 'moon.svg',
    'mountain': 'mountain.svg',
    'star': 'star.svg',

    // Body
    'hand': 'hand.svg',
    'eye': 'eye.svg',
    'ear': 'ear.svg',
    'foot': 'foot.svg',
    'mouth': 'mouth.svg',

    // Everyday
    'book': 'book.svg',
    'car': 'car.svg',
    'house': 'house.svg',
    'flower': 'flower.svg',
    'umbella': 'umbrella.svg', // Typo in original file "umbella" -> umbrella.svg
    'umbrella': 'umbrella.svg',
    'shoes': 'shoes.svg',
    'computer': 'computer.svg',
    'television': 'television.svg',
    'camera': 'camera.svg',
    'chair': 'chair.svg',
    'desk': 'desk.svg',

    // Colors
    'red': 'red.svg',
    'blue': 'blue.svg',
    'white': 'white.svg'
};

// Replace logic
// Look for pattern: english: 'KEY', ... imageAsset: 'OLD'
// We can't rely on lines being adjascent.
// But we specifically want to update imageAsset for specific english words.

// Regex approach:
// Find the block for the word, then replace imageAsset inside it.
// Simpler: iterate object entries and regex replace globally?
// But imageAsset needs to be associated with that word.

// Let's split by object `},` ? No, unreliable.
// Let's use string indexes.

for (const [english, svgFile] of Object.entries(imageMap)) {
    // Regex to find the object containing this english word
    // english: 'bear', [^}]* imageAsset: '[^']*'

    const regex = new RegExp(`(english:\\s*'${english}',[\\s\\S]*?imageAsset:\\s*')([^']*)`, 'g');

    // Check if match exists
    if (regex.test(content)) {
        content = content.replace(regex, `$1${svgFile}`);
        console.log(`Updated ${english} -> ${svgFile}`);
    } else {
        console.warn(`Could not find entry for ${english}`);
    }
}

fs.writeFileSync(wordDataPath, content);
console.log('Update complete.');
