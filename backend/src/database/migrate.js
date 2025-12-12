import pool, { query } from './connection.js';

/**
 * Script de migração para criar as tabelas básicas do banco de dados
 * Execute: npm run migrate
 */

const createTables = async () => {
  try {
    console.log('🔄 Iniciando migração do banco de dados...');

    // Criar tabela de usuários
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela users criada');

    // Criar tabela de assinaturas
    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'basic', 'premium', 'enterprise')),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
        license_key VARCHAR(255) UNIQUE,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        renewal_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela subscriptions criada');

    // Criar índices para melhor performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    `);
    console.log('✅ Índices criados');

    console.log('🎉 Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

createTables();

