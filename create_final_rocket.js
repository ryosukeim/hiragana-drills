import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function createFinalRocketIcon() {
    // Determine the path to the original "good" artifact
    // app_icon_fixed_1768155964623.png is the one with the nice rocket and "あ" on it.
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill solid purple first
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the rocket+stars image
    const img = await loadImage(artifactPath);

    // Scale slightly UP and center to ensure full bleed
    const scale = 1.05;
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2;
    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // 3. Paint over the bottom text "Kana Space Adventure"
    // We want to erase it completely and blend with the background.
    const textHeight = 120; // Height to cover the text
    const textYStart = size - textHeight;

    // Create a gradient to mask the text area seamlessly
    const gradient = ctx.createLinearGradient(0, textYStart - 40, 0, size);
    gradient.addColorStop(0, 'rgba(26, 11, 46, 0)'); // Transparent top
    gradient.addColorStop(0.3, '#1a0b2e'); // Solid purple start
    gradient.addColorStop(1, '#1a0b2e'); // Solid purple end

    // Fill the bottom area
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, textYStart, size, textHeight); // Solid block

    // Draw gradient overlay to smooth the edge
    ctx.fillStyle = gradient;
    ctx.fillRect(0, textYStart - 40, size, textHeight + 40);

    // 4. Save as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
    fs.writeFileSync('./public/icon-final-rocket.jpg', buffer);
    console.log('Created final rocket icon: ./public/icon-final-rocket.jpg');
}

createFinalRocketIcon().catch(console.error);
