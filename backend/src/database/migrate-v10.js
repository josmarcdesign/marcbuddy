import { query } from './connection.js';

/**
 * Migração V10 - Adicionar campo avatar_url na tabela users
 * Execute: npm run migrate:v10
 */
const migrateV10 = async () => {
  try {
    console.log('🔄 Iniciando migração V10 do banco de dados...');
    console.log('📸 Adicionando campo avatar_url na tabela users...');

    // Verificar se a coluna já existe
    const checkColumn = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'avatar_url'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Coluna avatar_url já existe na tabela users');
      process.exit(0);
    }

    // Adicionar coluna avatar_url
    await query(`
      ALTER TABLE users 
      ADD COLUMN avatar_url VARCHAR(500) NULL
    `);
    console.log('✅ Coluna avatar_url adicionada com sucesso');

    console.log('\n🎉 Migração V10 concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V10:', error);
    process.exit(1);
  }
};

migrateV10();

