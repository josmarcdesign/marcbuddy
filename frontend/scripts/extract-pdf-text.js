const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

/**
 * Extrai texto do PDF do Manual de Marca
 */
async function extractPDFText() {
  try {
    // Caminho do PDF (relativo ao diretório do script)
    const pdfPath = path.join(__dirname, '../../Arquivos REF/MarcBuddy-Manual-Marca.pdf');
    
    // Verifica se o arquivo existe
    if (!fs.existsSync(pdfPath)) {
      console.error('❌ Arquivo PDF não encontrado em:', pdfPath);
      return;
    }

    console.log('📄 Lendo PDF:', pdfPath);
    
    // Lê o arquivo PDF como buffer
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // Extrai o texto usando a nova API do pdf-parse v2.x
    console.log('⏳ Extraindo texto...');
    
    // Cria uma instância do parser com o buffer
    const parser = new PDFParse({ data: dataBuffer });
    
    // Extrai o texto
    const result = await parser.getText();
    
    // Exibe informações
    console.log('\n✅ Extração concluída!\n');
    console.log('📊 Informações do PDF:');
    console.log('   - Páginas:', result.numpages || 'N/A');
    console.log('   - Tamanho do texto:', result.text.length, 'caracteres');
    
    // Tenta obter informações adicionais
    try {
      const info = await parser.getInfo();
      if (info) {
        console.log('   - Metadados:', JSON.stringify(info, null, 2));
      }
    } catch (e) {
      // Ignora se não conseguir obter info
    }
    
    // Salva o texto em um arquivo
    const outputPath = path.join(__dirname, '../../Arquivos REF/MarcBuddy-Manual-Marca-extracted.txt');
    fs.writeFileSync(outputPath, result.text, 'utf-8');
    console.log('\n💾 Texto salvo em:', outputPath);
    
    // Exibe uma prévia do texto (primeiros 500 caracteres)
    console.log('\n📝 Prévia do texto (primeiros 500 caracteres):');
    console.log('─'.repeat(60));
    console.log(result.text.substring(0, 500));
    console.log('─'.repeat(60));
    console.log('...\n');
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao extrair texto do PDF:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

// Executa a função
if (require.main === module) {
  extractPDFText()
    .then(() => {
      console.log('\n✨ Processo finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { extractPDFText };
