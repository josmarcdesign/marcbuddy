import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');

// Configurações do Supabase
const supabaseConfig = `
# Configurações do Supabase
SUPABASE_URL=https://umydjofqoknbggwtwtqv.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_qxkUBDDgozx5sIEvTr28TA_aP1j_bLu
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres.umydjofqoknbggwtwtqv:GkJWkn13oFT9vd1C@aws-0-us-east-1.pooler.supabase.com:6543/postgres
`;

try {
  let envContent = '';
  
  // Ler .env existente se houver
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Remover configurações antigas do Supabase se existirem
    envContent = envContent.replace(/# Configurações do Supabase[\s\S]*?SUPABASE_DB_CONNECTION_STRING=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_URL=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_SERVICE_KEY=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_DB_CONNECTION_STRING=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_DB_HOST=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_DB_PORT=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_DB_NAME=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_DB_USER=.*\n/g, '');
    envContent = envContent.replace(/SUPABASE_DB_PASSWORD=.*\n/g, '');
  }
  
  // Adicionar novas configurações do Supabase
  envContent += supabaseConfig;
  
  // Escrever de volta
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  console.log('✅ Configurações do Supabase adicionadas ao .env com sucesso!');
  console.log('\n📝 Configurações adicionadas:');
  console.log('   - SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_KEY');
  console.log('   - SUPABASE_DB_CONNECTION_STRING');
  console.log('\n🔍 Você pode testar a conexão com: npm run test-supabase');
  
} catch (error) {
  console.error('❌ Erro ao atualizar .env:', error.message);
  console.error('\n📝 Por favor, adicione manualmente ao .env:');
  console.log(supabaseConfig);
  process.exit(1);
}

