import dotenv from 'dotenv';
import { query } from '../src/database/connection.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...\n');
    
    // Teste simples: listar tabelas
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'mclients%'
      ORDER BY table_name;
    `);
    
    console.log('✅ Conexão estabelecida com sucesso!\n');
    console.log(`📊 Tabelas encontradas (${result.rows.length}):`);
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Teste de query simples
    const testQuery = await query('SELECT NOW() as current_time');
    console.log(`\n⏰ Hora do servidor: ${testQuery.rows[0].current_time}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    console.error('\n📝 Verifique:');
    console.error('   1. Se a connection string está correta no .env');
    console.error('   2. Se o banco de dados está acessível');
    console.error('   3. Se as credenciais estão corretas\n');
    process.exit(1);
  }
}

testConnection();

