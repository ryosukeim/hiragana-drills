import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function addPaddingToIcon() {
    // Load the original icon
    const originalPath = './public/icon-512.png';
    const outputPath = './public/icon-512-padded.png';

    // Create a larger canvas (we'll shrink content to 80% and fill edges with purple)
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fill entire canvas with deep purple background
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // Load and draw the original image scaled to 80% in the center
    const img = await loadImage(originalPath);
    const scaledSize = size * 0.8;
    const offset = (size - scaledSize) / 2;

    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // Save the result
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log('Created padded icon:', outputPath);

    // Also create 192 version
    const canvas192 = createCanvas(192, 192);
    const ctx192 = canvas192.getContext('2d');
    ctx192.fillStyle = '#1a0b2e';
    ctx192.fillRect(0, 0, 192, 192);
    const scaledSize192 = 192 * 0.8;
    const offset192 = (192 - scaledSize192) / 2;
    ctx192.drawImage(img, offset192, offset192, scaledSize192, scaledSize192);
    fs.writeFileSync('./public/icon-192-padded.png', canvas192.toBuffer('image/png'));
    console.log('Created padded icon: icon-192-padded.png');
}

addPaddingToIcon().catch(console.error);
