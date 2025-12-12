// Gera SVG com retângulos lado a lado (grid) contendo nome e códigos da cor
export const exportPaletteSvg = (colors, name, sanitizedName) => {
  const swWidth = 180;
  const swHeight = 120;
  const padding = 16;
  const textSize = 12;
  const textLine = 16;
  const cols = Math.min(colors.length, 4);
  const rows = Math.ceil(colors.length / cols);
  const widthSvg = cols * (swWidth + padding) + padding;
  const heightSvg = rows * (swHeight + padding + textLine * 4) + padding;

  let content = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  content += `<svg xmlns="http://www.w3.org/2000/svg" width="${widthSvg}" height="${heightSvg}" viewBox="0 0 ${widthSvg} ${heightSvg}" font-family="Arial, sans-serif">\n`;
  content += `<title>${name}</title>\n`;

  colors.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (swWidth + padding);
    const y = padding + row * (swHeight + padding + textLine * 4);
    const textY = y + swHeight + textLine;
    const id = c.id || `color-${i + 1}`;
    content += `  <g>\n`;
    content += `    <rect x="${x}" y="${y}" width="${swWidth}" height="${swHeight}" rx="8" ry="8" fill="${c.hex}" stroke="#111827" stroke-width="1.5"/>\n`;
    content += `    <text x="${x + 8}" y="${textY}" font-size="${textSize}" font-weight="700" fill="#111827">${id} — ${c.name}</text>\n`;
    content += `    <text x="${x + 8}" y="${textY + textLine}" font-size="${textSize}" fill="#111827">HEX: ${c.hex}</text>\n`;
    content += `    <text x="${x + 8}" y="${textY + textLine * 2}" font-size="${textSize}" fill="#111827">RGB: ${c.rgb.replace('rgb(', '').replace(')', '')}</text>\n`;
    content += `    <text x="${x + 8}" y="${textY + textLine * 3}" font-size="${textSize}" fill="#111827">CMYK: ${c.cmyk}</text>\n`;
    content += `  </g>\n`;
  });

  content += `</svg>`;

  return {
    content,
    mimeType: 'image/svg+xml',
    filename: `${sanitizedName}.svg`,
  };
};


