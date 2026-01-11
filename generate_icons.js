import fs from 'fs';
import path from 'path';

const outputDir = './public/images';

const icons = {
    // Animals
    'bear.svg': '🐻',
    'cow.svg': '🐮',
    'pig.svg': '🐷',
    'elephant.svg': '🐘',
    'monkey.svg': '🐵',
    'penguin.svg': '🐧',
    'dolphin.svg': '🐬',
    'butterfly.svg': '🦋',
    'horse.svg': '🐴',
    'sheep.svg': '🐑',
    'lion.svg': '🦁',
    'giraffe.svg': '🦒',
    'crocodile.svg': '🐊',
    'hamster.svg': '🐹',
    'kangaroo.svg': '🦘',
    'tiger.svg': '🐯',
    // New Animals (Expansion)
    'ant.svg': '🐜',
    'bee.svg': '🐝',
    'turtle.svg': '🐢',
    'snake.svg': '🐍',
    'frog.svg': '🐸',
    'crab.svg': '🦀',
    'octopus.svg': '🐙',
    'squid.svg': '🦑',

    // Food
    'water.svg': '💧',
    'egg.svg': '🥚',
    'vegetable.svg': '🥦',
    'banana.svg': '🍌',
    'orange.svg': '🍊',
    'chocolate.svg': '🍫',
    'hamburger.svg': '🍔',
    'ice_cream.svg': '🍦', // underscore in filename usually
    // New Food (Expansion)
    'pear.svg': '🍐',
    'peach.svg': '🍑',
    'candy.svg': '🍬',
    'rice_cake.svg': '🍡',
    'grapes.svg': '🍇',

    // Nature
    'rain.svg': '☔',
    'river.svg': '🏞️',
    'sky.svg': '☁️',
    'sun.svg': '☀️',
    'moon.svg': '🌙',
    'mountain.svg': '⛰️',
    'star.svg': '⭐',
    // New Nature (Expansion)
    'sea.svg': '🌊',
    'snow.svg': '❄️',
    'cloud.svg': '☁️',
    'stone.svg': '🪨',
    'tree.svg': '🌳',
    'leaf.svg': '🍃',

    // Body
    'hand.svg': '✋',
    'eye.svg': '👁️',
    'ear.svg': '👂',
    'foot.svg': '🦶',
    'mouth.svg': '👄',
    // New Body (Expansion)
    'face.svg': '👱',
    'nose.svg': '👃',
    'tooth.svg': '🦷',
    'hair.svg': '💇',

    // Everyday
    'book.svg': '📚',
    'car.svg': '🚗',
    'house.svg': '🏠',
    'flower.svg': '🌼',
    'umbrella.svg': '☂️',
    'shoes.svg': '👟',
    'computer.svg': '💻',
    'television.svg': '📺',
    'camera.svg': '📷',
    'chair.svg': '🪑',
    'desk.svg': '✍️', // Using writing hand/desk concept
    // New Everyday (Expansion)
    'bag.svg': '👜',
    'hat.svg': '🎩',
    'clock.svg': '⏰',
    'key.svg': '🔑',
    'glasses.svg': '👓',
    'clothes.svg': '👕',
    'window.svg': '🪟',
    'door.svg': '🚪',
    'boat.svg': '🚢',
    'train.svg': '🚃',

    // Colors
    'red.svg': '🔴',
    'blue.svg': '🔵',
    'white.svg': '⚪',
    // New Colors/Numbers (Expansion)
    'black.svg': '⚫',
    'yellow.svg': '🟡',
    'green.svg': '🟢',
    'one.svg': '1️⃣',
    'two.svg': '2️⃣',
};

// Simple SVG template
const createSvg = (emoji) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text x="50" y="65" font-size="70" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
</svg>`;

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate files
Object.entries(icons).forEach(([filename, emoji]) => {
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, createSvg(emoji));
    console.log(`Generated ${filename}`);
});
