import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function processGenV5() {
    // The newly generated icon with "Kana" text
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/k_icon_v5_kana_1768160039709.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill solid background (matches the generation prompt #1a0b2e)
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the generated image
    const img = await loadImage(artifactPath);

    // 3. Draw image centered
    // To be safe against edge transparency artifacts from generation, 
    // we can draw it at 100% or slightly larger.
    // The generated image should already be square and full bleed.
    // Let's use 100% to preserve the safe area composition.
    ctx.drawImage(img, 0, 0, size, size);

    // 4. Save as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
    fs.writeFileSync('./public/icon-kana-v5.jpg', buffer);
    console.log('Created v5 icon: ./public/icon-kana-v5.jpg');
}

processGenV5().catch(console.error);
