import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão PostgreSQL direta (para manter compatibilidade com código existente)
// O Supabase permite conexão direta via PostgreSQL usando connection string ou variáveis
const { Pool } = pg;

// Se tiver connection string do Supabase, usar ela
let pool;

if (process.env.SUPABASE_DB_CONNECTION_STRING) {
  // Usar connection string do Supabase
  // IMPORTANTE: Se usar pooler (porta 6543), pode ter problemas com schemas customizados
  // Para schemas customizados como 'marcbuddy', use a connection string direta (porta 5432)
  let connectionString = process.env.SUPABASE_DB_CONNECTION_STRING;
  
  // Se for pooler (porta 6543), tentar converter para direta (porta 5432)
  if (connectionString.includes(':6543/')) {
    console.warn('⚠️  Usando pooler (porta 6543). Para schemas customizados, considere usar connection string direta (porta 5432)');
    // Tentar converter para porta direta
    connectionString = connectionString.replace(':6543/', ':5432/');
  }
  
  pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} else if (process.env.SUPABASE_DB_HOST) {
  // Usar variáveis individuais do Supabase
  pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 5432,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} else {
  // Fallback para configuração local (desenvolvimento)
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'marcbuddy_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: process.env.DB_HOST === 'localhost' ? 2000 : 10000,
    ssl: process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1' 
      ? { rejectUnauthorized: false }
      : false,
  });
}

// Configurar search_path quando uma conexão é criada
pool.on('connect', async (client) => {
  try {
    // Definir search_path para incluir marcbuddy e public
    await client.query('SET search_path TO marcbuddy, public');
    console.log('✅ Conectado ao banco de dados PostgreSQL (search_path: marcbuddy, public)');
  } catch (error) {
    console.warn('⚠️  Não foi possível configurar search_path:', error.message);
    console.log('✅ Conectado ao banco de dados PostgreSQL');
  }
  if (process.env.SUPABASE_DB_HOST || process.env.SUPABASE_DB_CONNECTION_STRING) {
    console.log('📦 Conexão usando variáveis SUPABASE_* (connection string ou host)');
  }
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões:', err);
  process.exit(-1);
});

// Função para executar queries (mantém compatibilidade com código existente)
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    const previewSql = text.trim().replace(/\s+/g, ' ').slice(0, 200);
    const paramsLabel = params && params.length ? ` params=${JSON.stringify(params).slice(0, 200)}` : '';
    console.log(`[DB] ${duration}ms rows=${res.rowCount} sql="${previewSql}"${paramsLabel}`);
    return res;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para obter um cliente do pool para transações
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;

