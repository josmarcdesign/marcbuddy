import { query } from '../src/database/connection.js';

/**
 * Script para testar a conexão com o banco de dados
 * Execute: node backend/scripts/test-connection.js
 */

const testConnection = async () => {
  try {
    console.log('🔄 Testando conexão com o banco de dados...');
    
    // Testar conexão básica
    const result = await query('SELECT version()');
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('📋 Versão do PostgreSQL:', result.rows[0].version);
    
    // Verificar tabelas
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tabelas no banco de dados:');
    tables.rows.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    // Verificar usuários
    const users = await query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5;
    `);
    
    console.log('\n👥 Últimos usuários cadastrados:');
    users.rows.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    process.exit(1);
  }
};

testConnection();

