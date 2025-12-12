import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
const password = 'GkJWkn13oFT9vd1C';
const encodedPassword = encodeURIComponent(password);

// Connection string correta com região us-west-2
const connectionString = `postgresql://postgres.umydjofqoknbggwtwtqv:${encodedPassword}@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true`;

try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Atualizar SUPABASE_DB_CONNECTION_STRING
  if (envContent.includes('SUPABASE_DB_CONNECTION_STRING=')) {
    envContent = envContent.replace(
      /SUPABASE_DB_CONNECTION_STRING=.*/,
      `SUPABASE_DB_CONNECTION_STRING=${connectionString}`
    );
  } else {
    envContent += `\nSUPABASE_DB_CONNECTION_STRING=${connectionString}`;
  }
  
  // Atualizar SUPABASE_ANON_KEY se necessário
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteWRqb2Zxb2tuYmdnd3R3dHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTIwMjEsImV4cCI6MjA4MDg2ODAyMX0.rPu2RyeQzCalpT8KM4_Y92cZvS40PS_F63TRr7Lz_Y4';
  
  if (envContent.includes('SUPABASE_ANON_KEY=')) {
    envContent = envContent.replace(
      /SUPABASE_ANON_KEY=.*/,
      `SUPABASE_ANON_KEY=${anonKey}`
    );
  } else {
    envContent += `\nSUPABASE_ANON_KEY=${anonKey}`;
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  console.log('✅ Connection string atualizada com sucesso!');
  console.log('\n📝 Configurações atualizadas:');
  console.log(`   - SUPABASE_DB_CONNECTION_STRING (região: us-west-2)`);
  console.log(`   - SUPABASE_ANON_KEY`);
  console.log('\n🔍 Testando conexão...\n');
  
} catch (error) {
  console.error('❌ Erro ao atualizar .env:', error.message);
  console.error('\n📝 Por favor, adicione manualmente ao .env:');
  console.log(`SUPABASE_DB_CONNECTION_STRING=${connectionString}`);
  process.exit(1);
}

