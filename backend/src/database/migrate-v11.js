import { query } from './connection.js';

const migrate = async () => {
  try {
    console.log('📦 Migração V11 - mclients_data (json por usuário)');

    await query(`
      CREATE TABLE IF NOT EXISTS mclients_data (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_data criada/verificada');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_mclients_data_user_id ON mclients_data(user_id);
    `);
    console.log('✅ Índice criado');

    console.log('🎉 Migração V11 concluída');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V11:', error);
    process.exit(1);
  }
};

migrate();

