import { query } from './connection.js';

/**
 * Migração V5 - Tabela de Cupons de Desconto
 * Execute: npm run migrate:v5
 */
const migrateV5 = async () => {
  try {
    console.log('🔄 Iniciando migração V5 do banco de dados...');

    // Criar tabela de cupons
    await query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10, 2) NOT NULL,
        min_purchase_value DECIMAL(10, 2) DEFAULT 0,
        max_discount_value DECIMAL(10, 2),
        applicable_plans VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
        applicable_to_all_plans BOOLEAN DEFAULT true,
        usage_limit INTEGER,
        usage_count INTEGER DEFAULT 0,
        usage_limit_per_user INTEGER DEFAULT 1,
        valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_until TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela coupons criada/verificada');

    // Criar tabela de uso de cupons
    await query(`
      CREATE TABLE IF NOT EXISTS coupon_usage (
        id SERIAL PRIMARY KEY,
        coupon_id INTEGER NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
        discount_applied DECIMAL(10, 2) NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(coupon_id, user_id, subscription_id)
      );
    `);
    console.log('✅ Tabela coupon_usage criada/verificada');

    // Criar índices
    await query(`
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
      CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
      CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_subscription_id ON coupon_usage(subscription_id);
    `);
    console.log('✅ Índices criados/verificados');

    console.log('🎉 Migração V5 concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração V5:', error);
    process.exit(1);
  }
};

migrateV5();

