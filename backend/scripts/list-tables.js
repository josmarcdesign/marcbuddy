import { query } from '../src/database/connection.js';

async function listTables() {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`\n📊 Tabelas existentes no banco (${result.rows.length}):\n`);
    if (result.rows.length === 0) {
      console.log('   (nenhuma tabela encontrada)');
    } else {
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

listTables();

