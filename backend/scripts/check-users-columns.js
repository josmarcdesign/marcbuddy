import { query } from '../src/database/connection.js';

async function checkColumns() {
  try {
    const result = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas da tabela users:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // Verificar se avatar_url existe
    const hasAvatarUrl = result.rows.some(row => row.column_name === 'avatar_url');
    if (!hasAvatarUrl) {
      console.log('\n⚠️  Coluna avatar_url não existe!');
      console.log('Adicionando coluna avatar_url...');
      
      await query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
      `);
      
      console.log('✅ Coluna avatar_url adicionada!');
    } else {
      console.log('\n✅ Coluna avatar_url existe');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkColumns();

