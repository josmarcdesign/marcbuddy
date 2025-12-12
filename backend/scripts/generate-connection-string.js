// Script para gerar connection string do Supabase
const projectRef = 'umydjofqoknbggwtwtqv';
const password = 'GkJWkn13oFT9vd1C';

// Formato 1: Pooler (recomendado para produção)
const poolerString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

// Formato 2: Direto (alternativa)
const directString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.supabase.com:5432/postgres`;

console.log('=== Connection Strings do Supabase ===\n');
console.log('1. Pooler (recomendado):');
console.log(poolerString);
console.log('\n2. Direto (alternativa):');
console.log(directString);
console.log('\n=== Adicione uma delas no .env como SUPABASE_DB_CONNECTION_STRING ===');

