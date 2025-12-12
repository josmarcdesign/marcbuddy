import { exportPaletteSvg } from '../services/exporters/svgExporter';
import { exportPalettePng } from '../services/exporters/pngExporter';
import { exportPaletteTxt } from '../services/exporters/txtExporter';

const sanitizeFileName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\-_. ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    || 'paleta';

export const usePaletteExport = (colors) => {
  const exportPalette = async (format, customPaletteName = '') => {
    if (!colors || colors.length === 0) {
      alert('Nenhuma cor na paleta para exportar');
      return;
    }

    const name = customPaletteName || 'Paleta de Cores';
    const sanitizedName = sanitizeFileName(name);

    let content = '';
    let mimeType = '';
    let filename = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(
          {
            name: name,
            type: 'separate',
            colors: colors.map((c, i) => ({
              id: c.id || `color-${i + 1}`,
              name: c.name,
              hex: c.hex,
              rgb: c.rgb,
              cmyk: c.cmyk,
              dominant: c.dominant,
            })),
          },
          null,
          2,
        );
        mimeType = 'application/json';
        filename = `${sanitizedName}.json`;
        break;

      case 'css':
        content = `/* ${name} */\n:root {\n`;
        colors.forEach((c, i) => {
          const varName = (c.id || `color-${i + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-');
          content += `  --${varName}: ${c.hex};\n`;
          content += `  --${varName}-rgb: ${c.rgb.replace('rgb(', '').replace(')', '')};\n`;
        });
        content += '}';
        mimeType = 'text/css';
        filename = `${sanitizedName}.css`;
        break;

      case 'scss':
        content = `// ${name}\n`;
        content += '$colors: (\n';
        colors.forEach((c, i) => {
          const varName = (c.id || `color-${i + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-');
          content += `  ${varName}: ${c.hex}${i < colors.length - 1 ? ',' : ''}\n`;
        });
        content += ');';
        mimeType = 'text/scss';
        filename = `${sanitizedName}.scss`;
        break;

      case 'txt': {
        const result = exportPaletteTxt(colors, name, sanitizedName);
        content = result.content;
        mimeType = result.mimeType;
        filename = result.filename;
        break;
      }

      case 'xml':
        content = '<?xml version="1.0" encoding="UTF-8"?>\n';
        content += `<palette name="${name}" type="separate">\n`;
        colors.forEach((c, i) => {
          content += `  <color id="${c.id || `color-${i + 1}`}">\n`;
          content += `    <name>${c.name}</name>\n`;
          content += `    <hex>${c.hex}</hex>\n`;
          content += `    <rgb>${c.rgb}</rgb>\n`;
          content += `    <cmyk>${c.cmyk}</cmyk>\n`;
          if (c.dominant) content += `    <dominant>true</dominant>\n`;
          content += `  </color>\n`;
        });
        content += '</palette>';
        mimeType = 'application/xml';
        filename = `${sanitizedName}.xml`;
        break;

      case 'png': {
        const result = await exportPalettePng(colors, sanitizedName);
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      case 'svg': {
        const result = exportPaletteSvg(colors, name, sanitizedName);
        content = result.content;
        mimeType = result.mimeType;
        filename = result.filename;
        break;
      }

      case 'ase':
        alert('Exportação ASE requer biblioteca especializada. Use JSON ou outro formato.');
        return;

      default:
        alert('Formato não suportado');
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportPalette };
};


