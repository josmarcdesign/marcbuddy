export const exportPaletteTxt = (colors, name, sanitizedName) => {
  let content = `${name}\n`;
  content += '='.repeat(30) + '\n\n';
  colors.forEach((c, i) => {
    content += `${c.id || `color-${i + 1}`} - ${c.name}\n`;
    content += `   HEX: ${c.hex}\n`;
    content += `   RGB: ${c.rgb}\n`;
    content += `   CMYK: ${c.cmyk}\n`;
    if (c.dominant) content += `   [Cor Dominante]\n`;
    content += '\n';
  });

  return {
    content,
    mimeType: 'text/plain',
    filename: `${sanitizedName}.txt`,
  };
};


