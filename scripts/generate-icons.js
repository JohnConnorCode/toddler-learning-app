const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG template for the icon
const iconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFB800;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad1)" rx="100"/>
  <text x="50%" y="55%" font-size="320" font-weight="bold" font-family="Arial, sans-serif" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" style="text-shadow: 0 4px 8px rgba(0,0,0,0.3);">L</text>
  <circle cx="400" cy="400" r="70" fill="#FFF9F0"/>
  <text x="400" y="415" font-size="65" font-weight="bold" font-family="Arial, sans-serif" fill="#FFB800" text-anchor="middle" dominant-baseline="middle">★</text>
</svg>
`;

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate PNG files for each size
async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    try {
      await sharp(Buffer.from(iconSVG))
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size} icon:`, error.message);
    }
  }

  console.log('\n✓ All icon files generated successfully!');
}

generateIcons().catch(console.error);
