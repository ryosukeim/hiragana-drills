import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function processRefinedIconWithChar() {
    // This is the simplified rocket icon
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/simple_rocket_icon_1768159084512.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill solid background
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Draw rocket image
    const img = await loadImage(artifactPath);
    const scale = 1.02; // Slight zoom for safety
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2;
    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // 3. Draw "あ" in the window
    // Based on the image, the window is blue/cyan circle in the middle-ish.
    // Let's estimate position. Center is roughly center of image.
    // The window seems to be exactly center or slightly above.
    // We'll place a white 'あ' right in the center.

    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add a slight shadow for contrast just in case
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;

    // Position adjustment might be needed. Let's aim for center first.
    // The generated rocket is seemingly diagonal.
    // Let's try placing it centrally.
    ctx.fillText('あ', size / 2, size / 2 - 20); // Slightly up to hit the body/window

    // 4. Save as icon-rocket-char.jpg
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
    fs.writeFileSync('./public/icon-rocket-char.jpg', buffer);
    console.log('Created character icon: ./public/icon-rocket-char.jpg');
}

processRefinedIconWithChar().catch(console.error);
