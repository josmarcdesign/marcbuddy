import pg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Forçar IPv4 primeiro para evitar erro ENETUNREACH com IPv6 no Render
// Isso é necessário porque o Render pode não ter suporte IPv6 completo
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
  console.log('✅ DNS configurado para priorizar IPv4');
}

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
  
  // Se for pooler (porta 6543 OU hostname pooler), converter automaticamente para direta (porta 5432)
  // O pooler não acessa schemas customizados como 'marcbuddy'
  // IMPORTANTE: O hostname do pooler é diferente do direto
  const isPooler = connectionString.includes(':6543/') || connectionString.includes('pooler.supabase.com');
  if (isPooler) {
    console.warn('⚠️  Pooler detectado. Convertendo para connection direta (porta 5432) para acessar schema marcbuddy');
    // Extrair project ref da connection string (ex: umydjofqoknbggwtwtqv)
    const projectRefMatch = connectionString.match(/postgres\.([^.]+)\./);
    if (projectRefMatch && projectRefMatch[1]) {
      const projectRef = projectRefMatch[1];
      // Construir connection string direta usando o hostname correto
      // Formato: postgresql://postgres.PROJECT_REF:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
      const passwordMatch = connectionString.match(/:(.+?)@/);
      const password = passwordMatch ? passwordMatch[1] : '';
      connectionString = `postgresql://postgres.${projectRef}:${password}@db.${projectRef}.supabase.co:5432/postgres`;
      console.log('✅ Connection string atualizada para porta direta (db.*.supabase.co)');
    } else {
      // Fallback: tentar converter hostname e porta
      console.warn('⚠️  Não foi possível extrair project ref, tentando converter hostname');
      connectionString = connectionString
        .replace(':6543/', ':5432/')
        .replace(/pooler\.supabase\.com/g, 'db.umydjofqoknbggwtwtqv.supabase.co')
        .replace(/aws-[0-9]-[a-z0-9-]+\.pooler\.supabase\.com/g, 'db.umydjofqoknbggwtwtqv.supabase.co');
    }
  }
  
  // Fazer parse da connection string para usar opções individuais
  // Isso permite usar family: 4 que não funciona com connectionString diretamente
  try {
    const url = new URL(connectionString);
    // Extrair usuário e senha do formato postgres.umydjofqoknbggwtwtqv:senha@host
    const authPart = url.username || '';
    const authParts = authPart.split(':');
    const user = authParts[0] || '';
    const password = authParts[1] || url.password || '';
    
    pool = new Pool({
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || 'postgres',
      user: user,
      password: password,
      ssl: { rejectUnauthorized: false },
      family: 4, // Forçar IPv4 (evita erro ENETUNREACH com IPv6 no Render)
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    console.log('✅ Pool configurado com opções individuais (family: 4 forçado)');
  } catch (parseError) {
    // Fallback: usar connectionString se o parse falhar
    console.warn('⚠️  Erro ao fazer parse da connection string, usando connectionString diretamente:', parseError.message);
    pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
} else if (process.env.SUPABASE_DB_HOST) {
  // Usar variáveis individuais do Supabase
  pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 5432,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    family: 4, // Forçar IPv4 (evita erro ENETUNREACH com IPv6 no Render)
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
  const client = await pool.connect();
  try {
    // Sempre configurar search_path antes de executar queries (importante para schemas customizados)
    // Isso garante que tabelas do schema marcbuddy sejam encontradas
    try {
      await client.query('SET search_path TO marcbuddy, public');
    } catch (pathError) {
      // Se não conseguir configurar search_path, continuar mesmo assim
      console.warn('⚠️  Não foi possível configurar search_path:', pathError.message);
    }
    
    // Executar a query
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    const previewSql = text.trim().replace(/\s+/g, ' ').slice(0, 200);
    const paramsLabel = params && params.length ? ` params=${JSON.stringify(params).slice(0, 200)}` : '';
    console.log(`[DB] ${duration}ms rows=${res.rowCount} sql="${previewSql}"${paramsLabel}`);
    return res;
  } catch (error) {
    console.error('❌ Erro na query:', error.message);
    console.error('Query:', text.substring(0, 200));
    console.error('Connection String (oculto):', process.env.SUPABASE_DB_CONNECTION_STRING ? 
      process.env.SUPABASE_DB_CONNECTION_STRING.replace(/:[^:@]+@/, ':****@') : 'não configurado');
    
    if (error.message.includes('Tenant or user not found')) {
      console.error('💡 Erro "Tenant or user not found" indica:');
      console.error('   1. Connection string usando pooler (porta 6543) ao invés de direta (5432)');
      console.error('   2. Hostname incorreto (deve ser db.*.supabase.co, não pooler.supabase.com)');
      console.error('   3. Schema marcbuddy não acessível via pooler');
      console.error('💡 Solução: Use connection string direta do Supabase Dashboard');
    }
    throw error;
  } finally {
    client.release();
  }
};

// Função para obter um cliente do pool para transações
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;

