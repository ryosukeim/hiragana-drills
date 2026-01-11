import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function restoreOriginalWithText() {
    // The artifact that matches the user's uploaded image (Rocket + "Kana Space Adventure" text)
    // This file was generated early in the session and has the text baked in.
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill solid purple background (to prevent any transparency issues)
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the original image
    const img = await loadImage(artifactPath);

    // 3. Draw image centered.
    // To ensure text doesn't get cut off by rounded corners, we scale it down slightly (Safe Area).
    // iOS cuts off about 20% of the corners.
    // 85% scale should be safe and look good.
    const scale = 0.85;
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2;

    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // 4. Save as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
    fs.writeFileSync('./public/icon-text-final.jpg', buffer);
    console.log('Created icon with text: ./public/icon-text-final.jpg');
}

restoreOriginalWithText().catch(console.error);
