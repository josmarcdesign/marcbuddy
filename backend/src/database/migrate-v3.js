import { query } from './connection.js';

/**
 * Script de migração V3 - Adicionar coluna email na tabela subscriptions
 * Execute: npm run migrate:v3
 */

const migrateV3 = async () => {
  try {
    console.log('🔄 Iniciando migração V3 do banco de dados...');

    // Verificar se a coluna já existe
    const checkColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' AND column_name = 'email';
    `);

    if (checkColumns.rows.length > 0) {
      console.log('⏭️  Coluna email já existe na tabela subscriptions');
      process.exit(0);
    }

    // Adicionar coluna email
    await query(`
      ALTER TABLE subscriptions 
      ADD COLUMN email VARCHAR(255);
    `);
    console.log('✅ Coluna email adicionada à tabela subscriptions');

    // Preencher a coluna email com os emails dos usuários relacionados
    await query(`
      UPDATE subscriptions s
      SET email = u.email
      FROM users u
      WHERE s.user_id = u.id AND s.email IS NULL;
    `);
    console.log('✅ Coluna email preenchida com os emails dos usuários');

    // Adicionar índice para melhor performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
    `);
    console.log('✅ Índice criado na coluna email');

    // Verificar estrutura final
    const finalCheck = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' AND column_name = 'email';
    `);
    
    if (finalCheck.rows.length > 0) {
      const col = finalCheck.rows[0];
      console.log(`\n📊 Coluna email: ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    }

    console.log('\n🎉 Migração V3 concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V3:', error);
    process.exit(1);
  }
};

migrateV3();

