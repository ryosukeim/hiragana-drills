import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function processRefinedIcon() {
    // This is the newly generated simple rocket icon
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/simple_rocket_icon_1768159084512.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill with solid background color from the image (deep purple)
    // Based on the generated image, it is solid dark purple.
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the image.
    const img = await loadImage(artifactPath);

    // 3. Draw image centered. 
    // The generated image is already square and full bleed prompt.
    // To be strictly safe against edge artifacts, we can scale it slightly up (1.02)
    const scale = 1.02;
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2;

    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // 4. Save as JPEG (icon-rocket.jpg)
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
    fs.writeFileSync('./public/icon-rocket.jpg', buffer);
    console.log('Created refined icon: ./public/icon-rocket.jpg');
}

processRefinedIcon().catch(console.error);
