import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function processIconV3() {
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_v3_fullbleed_1768158159356.png'; // Update with actual path if different

    // 1. Detect dominant background color from top-left pixel
    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    const img = await loadImage(artifactPath);
    tempCtx.drawImage(img, 0, 0);
    // Since we can't easily get pixel data without more setup, let's just pick the known purple #1a0b2e or #130026 based on the prompt.
    // However, the AI might have varied the color.
    // Let's assume deep purple. #1a0b2e.
    const bgColor = '#180a29'; // Slightly darker purple often from AI prompts, but let's stick to theme color #1a0b2e if possible.
    // Actually, looking at the previous failures, matching the color is key.
    // Let's rely on the image's own background if it's solid.

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fill with theme background color
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // Draw the generated image. 
    // If the generated image has rounded corners with transparency, the purple rect behind it will fill it.
    // If the generated image has rounded corners with WHITE, we need to crop.
    // AI usually makes rounded corners with alpha transparency or black/white background.
    // Let's scale it slightly down to be safe (90%) and center it.
    // This effectively adds padding.

    const scale = 0.9;
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2;

    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // Save as JPEG to force opaque
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync('./public/icon-v3.jpg', buffer);
    console.log('Created processed icon: ./public/icon-v3.jpg');
}

processIconV3().catch(console.error);
