import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function createSolidIconV2() {
    // Load the original fixed artifact (full bleed one)
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fil with solid purple
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load image
    const img = await loadImage(artifactPath);

    // 3. Draw image SCALED UP by 2% to crop out any potential edge borders
    // Target size: 512 * 1.02 = ~522
    const scale = 1.05; // 5% scale up to be absolutely sure
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2; // Center it

    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // 4. Save as NEW FILENAME to bust cache
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync('./public/icon-v2.jpg', buffer);
    console.log('Created solid JPEG icon: ./public/icon-v2.jpg');
}

createSolidIconV2().catch(console.error);
