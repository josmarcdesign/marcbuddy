// Script para converter logo SVG para PNG usando Sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Caminho para a logo SVG
const svgPath = path.join(__dirname, 'frontend/src/assets/logos/Isotipo+tipografia.svg');
const pngPath = path.join(__dirname, 'logo.png');

async function convertSvgToPng() {
  try {
    console.log('🔄 Convertendo logo SVG para PNG...');

    // Ler o arquivo SVG
    const svgBuffer = fs.readFileSync(svgPath);

    // Converter para PNG usando Sharp
    await sharp(svgBuffer)
      .png({
        quality: 90,
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Fundo transparente
      })
      .resize(200, null, { // Largura máxima de 200px, manter proporção
        withoutEnlargement: true
      })
      .toFile(pngPath);

    console.log('✅ Logo convertida com sucesso!');
    console.log(`📁 Arquivo salvo em: ${pngPath}`);

    // Verificar o tamanho do arquivo
    const stats = fs.statSync(pngPath);
    console.log(`📊 Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Erro ao converter logo:', error);
  }
}

// Executar a conversão
convertSvgToPng();