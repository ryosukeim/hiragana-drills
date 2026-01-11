import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function createSafeAreaIcon() {
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill ENTIRE canvas with solid purple (this will show at rounded corners)
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the original image
    const img = await loadImage(artifactPath);

    // 3. Draw image SCALED DOWN to 80% and centered
    // iOS safe area is the center 80% of the icon
    const safeSize = size * 0.80;
    const offset = (size - safeSize) / 2;

    ctx.drawImage(img, offset, offset, safeSize, safeSize);

    // 4. Save as JPEG with new filename
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync('./public/icon-safe.jpg', buffer);
    console.log('Created safe area icon: ./public/icon-safe.jpg');
}

createSafeAreaIcon().catch(console.error);
