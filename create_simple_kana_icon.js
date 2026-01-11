import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function createSimpleKanaIcon() {
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill ENTIRE canvas with solid purple
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Draw rocket emoji in center (scaled to fit safe area)
    ctx.font = 'bold 280px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀', size / 2, size / 2 - 30);

    // 3. Draw 'あ' on the rocket
    ctx.font = 'bold 120px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1a0b2e';
    ctx.lineWidth = 8;
    ctx.strokeText('あ', size / 2, size / 2 - 30);
    ctx.fillText('あ', size / 2, size / 2 - 30);

    // 4. Draw "Kana" text at bottom
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Kana', size / 2, size - 80);

    // 5. Add some stars
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(100, 100, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(400, 80, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(420, 420, 7, 0, Math.PI * 2);
    ctx.fill();

    // 6. Save as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync('./public/kana-icon.jpg', buffer);
    console.log('Created simplified Kana icon: ./public/kana-icon.jpg');
}

createSimpleKanaIcon().catch(console.error);
