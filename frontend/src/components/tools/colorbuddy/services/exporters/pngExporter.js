// Gera PNG simples em grid quadrado (swatches lado a lado)
export const exportPalettePng = (colors, sanitizedName) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const size = Math.ceil(Math.sqrt(colors.length));
    const swatchSize = 100;
    canvas.width = size * swatchSize;
    canvas.height = size * swatchSize;
    const ctx = canvas.getContext('2d');

    colors.forEach((c, i) => {
      const x = (i % size) * swatchSize;
      const y = Math.floor(i / size) * swatchSize;
      ctx.fillStyle = c.hex;
      ctx.fillRect(x, y, swatchSize, swatchSize);
    });

    canvas.toBlob((blob) => {
      resolve({
        blob,
        filename: `${sanitizedName}.png`,
        mimeType: 'image/png',
      });
    });
  });


