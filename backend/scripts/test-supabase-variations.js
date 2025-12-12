import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const projectRef = 'umydjofqoknbggwtwtqv';
const password = 'GkJWkn13oFT9vd1C';
const encodedPassword = encodeURIComponent(password);

// Variações de connection strings para testar
const variations = [
  {
    name: 'Pooler com postgres.[ref]',
    string: `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
  },
  {
    name: 'Pooler com postgres apenas',
    string: `postgresql://postgres:${encodedPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
  },
  {
    name: 'Direto com postgres.[ref]',
    string: `postgresql://postgres.${projectRef}:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`
  },
  {
    name: 'Direto com postgres apenas',
    string: `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`
  },
  {
    name: 'Pooler sem encoding na senha',
    string: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
  },
];

async function testConnection(connectionString, name) {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    const result = await pool.query('SELECT NOW() as current_time');
    console.log(`✅ ${name}: FUNCIONOU!`);
    console.log(`   Hora do servidor: ${result.rows[0].current_time}\n`);
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}\n`);
    await pool.end();
    return false;
  }
}

async function testAll() {
  console.log('🔍 Testando diferentes formatos de connection string...\n');
  
  for (const variation of variations) {
    const success = await testConnection(variation.string, variation.name);
    if (success) {
      console.log(`\n✅ CONEXÃO BEM-SUCEDIDA!\n`);
      console.log(`Use esta connection string no .env:`);
      console.log(`SUPABASE_DB_CONNECTION_STRING=${variation.string}\n`);
      return;
    }
  }
  
  console.log('\n❌ Nenhuma variação funcionou.');
  console.log('📝 Verifique:');
  console.log('   1. Se a senha está correta');
  console.log('   2. Se o projeto está ativo no Supabase');
  console.log('   3. Se o banco de dados está acessível');
  console.log('\n💡 Dica: Obtenha a connection string correta em:');
  console.log('   Settings > Database > Connection string > URI');
}

testAll().then(() => process.exit(0)).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});

