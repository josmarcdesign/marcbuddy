#!/usr/bin/env node

/**
 * Script de Pre-build - Verificação de Assets
 * Executado automaticamente antes de cada build
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando assets antes do build...');

// Lista de arquivos críticos que devem existir
const criticalAssets = [
  'src/assets/fonts/Nunito/static/Nunito-Regular.ttf',
  'src/assets/fonts/Nunito/static/Nunito-Bold.ttf',
  'src/assets/fonts/Poppins/Poppins-Regular.ttf',
  'src/assets/fonts/Poppins/Poppins-Medium.ttf',
  'src/assets/cursor/cursor-normal.svg',
  'src/assets/cursor/cursor-click.svg',
  'src/assets/icons/Loader.svg',
  'src/assets/ilustrations/hero-ilustration.svg',
  'src/assets/logos/isotipo.svg'
];

let hasErrors = false;

// Verificar se arquivos críticos existem
criticalAssets.forEach(asset => {
  const fullPath = path.join(__dirname, '..', asset);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Asset crítico não encontrado: ${asset}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${asset}`);
  }
});

// Verificar se o diretório public existe
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  console.warn('⚠️  Diretório public não encontrado - criando...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Verificar se há arquivos na pasta public
const publicFiles = fs.readdirSync(publicDir);
if (publicFiles.length === 0) {
  console.warn('⚠️  Diretório public está vazio');
} else {
  console.log(`✅ ${publicFiles.length} arquivos encontrados em public/`);
}

if (hasErrors) {
  console.error('\n❌ Build cancelado devido a assets faltando!');
  process.exit(1);
} else {
  console.log('\n✅ Todos os assets críticos verificados com sucesso!');
  console.log('🚀 Prosseguindo com o build...\n');
}