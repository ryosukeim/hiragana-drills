import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function createSolidIcon() {
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill completely with solid purple. No transparency.
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the original fixed image
    const img = await loadImage(artifactPath);

    // 3. Draw image covering everything.
    ctx.drawImage(img, 0, 0, size, size);

    // 4. Save as JPEG to ensure NO TRANSPARENCY
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync('./public/icon-solid.jpg', buffer);
    console.log('Created solid JPEG icon: ./public/icon-solid.jpg');
}

createSolidIcon().catch(console.error);
