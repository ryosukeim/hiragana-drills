import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function modifyIconText() {
    // Load the original fixed artifact (full bleed one)
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';

    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill background with purple
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load original image
    const img = await loadImage(artifactPath);

    // 3. Draw image, but we need to cover the old text.
    // The old text is at the bottom.
    // Let's draw the image first.
    ctx.drawImage(img, 0, 0, size, size);

    // 4. Paint over the bottom text area with purple
    // Approximate height of text area based on previous images
    const textHeight = 120;
    ctx.fillRect(0, size - textHeight, size, textHeight);

    // 5. Draw new "Kana" text
    ctx.font = 'bold 80px "Outfit", sans-serif'; // Using a nice font if available, fallback to sans-serif
    // Since we don't have custom fonts loaded in node-canvas easily without registering, let's use Arial/sans-serif
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = '#FFD700'; // Gold/Yellowish color to match stars or cream like original text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text with a slight shadow/outline style if possible to match original look
    // Original had cream text. Let's use a light cream color.
    ctx.fillStyle = '#FFF8E7';
    ctx.fillText('Kana', size / 2, size - 60);

    // 6. Save as JPEG (icon-text-fix.jpg)
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync('./public/icon-text-fix.jpg', buffer);
    console.log('Created simplified text icon: ./public/icon-text-fix.jpg');
}

modifyIconText().catch(console.error);
