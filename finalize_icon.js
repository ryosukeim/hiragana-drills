import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function finalizeIcon() {
    // We want the ORIGINAL full-bleed rocket icon which had stars/planets.
    // The artifact app_icon_fixed_1768155964623.png was generated to be full bleed.
    // Let's use that as the base, it has the nice background.
    const artifactPath = 'C:/Users/ir835/.gemini/antigravity/brain/90d879d0-9762-4f68-83a5-a6bed25e3547/app_icon_fixed_1768155964623.png';
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 1. Fill solid purple first
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, 0, size, size);

    // 2. Load the rocket+stars image
    const img = await loadImage(artifactPath);

    // Scale it slightly UP (1.05) and Crop to be 100% sure of full bleed edges
    const scale = 1.05;
    const scaledSize = size * scale;
    const offset = (size - scaledSize) / 2;
    ctx.drawImage(img, offset, offset, scaledSize, scaledSize);

    // 3. We need to overwrite "Kana Space Adventure" text at the bottom.
    // But we want to keep the stars/planets if they are not in the text area.
    // The text is at the very bottom.
    // We will paint over the bottom area with a gradient or solid color that blends.
    // Since background is complex, solid purple rect might look like a patch.
    // Let's try to be smart. The background is mostly dark purple space.

    const textHeight = 110;
    const textYStart = size - textHeight;

    // Gradient to blend the "patch"
    const gradient = ctx.createLinearGradient(0, textYStart - 20, 0, textYStart + 20);
    gradient.addColorStop(0, 'rgba(26, 11, 46, 0)'); // Transparent
    gradient.addColorStop(1, '#1a0b2e'); // Solid purple

    // Fill the bottom with solid purple
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(0, textYStart, size, textHeight);
    // Draw gradient on top edge of the rect to blend
    ctx.fillStyle = gradient;
    ctx.fillRect(0, textYStart - 20, size, 20);

    // 4. Write "Kana"
    ctx.font = 'bold 90px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFF8E7'; // Cream color
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fillText('Kana', size / 2, size - 55);

    // 5. Save as icon-final.jpg
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
    fs.writeFileSync('./public/icon-final.jpg', buffer);
    console.log('Created final icon: ./public/icon-final.jpg');
}

finalizeIcon().catch(console.error);
