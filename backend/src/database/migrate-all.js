import { query } from './connection.js';

/**
 * Script de migração completa - Executa todas as migrações em ordem
 * Execute: npm run migrate:all
 * 
 * Este script garante que todas as tabelas e colunas necessárias existam
 */

const migrateAll = async () => {
  try {
    console.log('🔄 Iniciando migração completa do banco de dados...\n');

    // ============================================
    // MIGRAÇÃO V1 - Tabelas básicas
    // ============================================
    console.log('📦 Executando migração V1 (tabelas básicas)...');

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
    console.log('✅ Tabela users criada/verificada');

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
    console.log('✅ Tabela subscriptions criada/verificada');

    // Criar índices
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    `);
    console.log('✅ Índices criados/verificados');

    // ============================================
    // MIGRAÇÃO V2 - Colunas adicionais de assinaturas
    // ============================================
    console.log('\n📦 Executando migração V2 (colunas adicionais)...');

    // Verificar colunas existentes
    const checkColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions';
    `);
    const existingColumns = checkColumns.rows.map(row => row.column_name);

    // Adicionar colunas se não existirem
    const columnsToAdd = [
      {
        name: 'billing_period',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN IF NOT EXISTS billing_period VARCHAR(20) DEFAULT 'monthly' 
              CHECK (billing_period IN ('monthly', 'annual'));`,
        description: 'Período de cobrança'
      },
      {
        name: 'amount',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2);`,
        description: 'Valor pago'
      },
      {
        name: 'currency',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'BRL';`,
        description: 'Moeda'
      },
      {
        name: 'auto_renew',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;`,
        description: 'Renovação automática'
      },
      {
        name: 'cancelled_at',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;`,
        description: 'Data de cancelamento'
      },
      {
        name: 'cancellation_reason',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;`,
        description: 'Motivo do cancelamento'
      }
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        // PostgreSQL não suporta IF NOT EXISTS em ALTER TABLE ADD COLUMN diretamente
        // Então vamos usar um bloco DO para verificar
        // Remover IF NOT EXISTS e ponto e vírgula final do SQL
        const sqlWithoutIfNotExists = column.sql
          .replace('IF NOT EXISTS', '')
          .replace(/;\s*$/, ''); // Remove ponto e vírgula final
        
        await query(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'subscriptions' AND column_name = '${column.name}'
            ) THEN
              EXECUTE '${sqlWithoutIfNotExists.replace(/'/g, "''")}';
            END IF;
          END $$;
        `);
        console.log(`✅ Coluna ${column.name} adicionada`);
      } else {
        console.log(`⏭️  Coluna ${column.name} já existe`);
      }
    }

    // Atualizar valores padrão
    await query(`
      UPDATE subscriptions 
      SET 
        billing_period = COALESCE(billing_period, 'monthly'),
        currency = COALESCE(currency, 'BRL'),
        auto_renew = COALESCE(auto_renew, true)
      WHERE billing_period IS NULL OR currency IS NULL OR auto_renew IS NULL;
    `);
    console.log('✅ Valores padrão atualizados');

    // ============================================
    // MIGRAÇÃO V3 - Coluna email em subscriptions
    // ============================================
    console.log('\n📦 Executando migração V3 (coluna email)...');

    const checkEmailColumn = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions' AND column_name = 'email';
    `);

    if (checkEmailColumn.rows.length === 0) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN email VARCHAR(255);
      `);
      console.log('✅ Coluna email adicionada');

      // Preencher com emails dos usuários
      await query(`
        UPDATE subscriptions s
        SET email = u.email
        FROM users u
        WHERE s.user_id = u.id AND s.email IS NULL;
      `);
      console.log('✅ Coluna email preenchida');

      // Criar índice
      await query(`
        CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
      `);
      console.log('✅ Índice criado na coluna email');
    } else {
      console.log('⏭️  Coluna email já existe');
    }

    // ============================================
    // MIGRAÇÃO V4 - Tabela de formas de pagamento
    // ============================================
    console.log('\n📦 Executando migração V4 (formas de pagamento)...');

    await query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        icon VARCHAR(10),
        description TEXT,
        max_installments INTEGER DEFAULT 1,
        min_installment_value DECIMAL(10, 2),
        fee_percentage DECIMAL(5, 2) DEFAULT 0,
        fee_fixed DECIMAL(10, 2) DEFAULT 0,
        accepts_credit BOOLEAN DEFAULT false,
        accepts_debit BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela payment_methods criada/verificada');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_payment_methods_code ON payment_methods(code);
      CREATE INDEX IF NOT EXISTS idx_payment_methods_enabled ON payment_methods(enabled);
    `);
    console.log('✅ Índices criados/verificados');

    // Inserir formas de pagamento padrão
    const existingMethods = await query('SELECT code FROM payment_methods');
    const existingCodes = existingMethods.rows.map(row => row.code);

    const defaultMethods = [
      {
        code: 'pix',
        name: 'PIX',
        enabled: true,
        icon: '💳',
        description: 'Pagamento instantâneo via PIX',
        max_installments: 1,
        min_installment_value: 0,
        fee_percentage: 0,
        fee_fixed: 0,
        accepts_credit: false,
        accepts_debit: false
      },
      {
        code: 'credit_card',
        name: 'Cartão de Crédito',
        enabled: false,
        icon: '💳',
        description: 'Pagamento com cartão de crédito',
        max_installments: 12,
        min_installment_value: 5.00,
        fee_percentage: 2.99,
        fee_fixed: 0,
        accepts_credit: true,
        accepts_debit: false
      },
      {
        code: 'debit_card',
        name: 'Cartão de Débito',
        enabled: false,
        icon: '💳',
        description: 'Pagamento com cartão de débito',
        max_installments: 1,
        min_installment_value: 0,
        fee_percentage: 1.99,
        fee_fixed: 0,
        accepts_credit: false,
        accepts_debit: true
      },
      {
        code: 'boleto',
        name: 'Boleto Bancário',
        enabled: false,
        icon: '📄',
        description: 'Pagamento via boleto bancário',
        max_installments: 1,
        min_installment_value: 0,
        fee_percentage: 0,
        fee_fixed: 2.50,
        accepts_credit: false,
        accepts_debit: false
      },
      {
        code: 'paypal',
        name: 'PayPal',
        enabled: false,
        icon: '🌐',
        description: 'Pagamento via PayPal',
        max_installments: 1,
        min_installment_value: 0,
        fee_percentage: 3.49,
        fee_fixed: 0,
        accepts_credit: false,
        accepts_debit: false
      }
    ];

    for (const method of defaultMethods) {
      if (!existingCodes.includes(method.code)) {
        await query(`
          INSERT INTO payment_methods 
          (code, name, enabled, icon, description, max_installments, min_installment_value, 
           fee_percentage, fee_fixed, accepts_credit, accepts_debit)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          method.code, method.name, method.enabled, method.icon, method.description,
          method.max_installments, method.min_installment_value,
          method.fee_percentage, method.fee_fixed,
          method.accepts_credit, method.accepts_debit
        ]);
        console.log(`✅ Forma de pagamento ${method.name} inserida`);
      }
    }

    // ============================================
    // MIGRAÇÃO V5 - Tabela de cupons
    // ============================================
    console.log('\n📦 Executando migração V5 (cupons de desconto)...');
    
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

    await query(`
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
      CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
      CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_subscription_id ON coupon_usage(subscription_id);
    `);
    console.log('✅ Índices criados/verificados');

    // ============================================
    // MIGRAÇÃO V6 - Tabela de planos
    // ============================================
    console.log('\n📦 Executando migração V6 (planos)...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS plans (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        price_annual DECIMAL(10, 2),
        price_annual_monthly DECIMAL(10, 2),
        features TEXT[] DEFAULT ARRAY[]::TEXT[],
        popular BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        free_trial BOOLEAN DEFAULT false,
        free_trial_days INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela plans criada/verificada');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
    `);
    console.log('✅ Índices criados/verificados');

    // Verificar se já existem planos
    const existingPlans = await query('SELECT id FROM plans');
    
    if (existingPlans.rows.length === 0) {
      // Inserir planos padrão
      const defaultPlans = [
        {
          id: 'basic',
          name: 'MBuddy Classic',
          description: 'Para profissionais',
          price: 29.90,
          price_annual: 299.00,
          price_annual_monthly: 24.92,
          features: [
            'Acesso completo às ferramentas básicas',
            'Uso ilimitado',
            'Suporte por email',
            'Projetos ilimitados',
            'Exportação de dados'
          ],
          popular: false,
          featured: false,
          free_trial: true,
          free_trial_days: 7,
          is_active: true
        },
        {
          id: 'premium',
          name: 'MBuddy Pro',
          description: 'Para profissionais avançados',
          price: 59.90,
          price_annual: 599.00,
          price_annual_monthly: 49.92,
          features: [
            'Todas as ferramentas',
            'Recursos avançados',
            'Suporte prioritário',
            'API access',
            'Integrações',
            'Análises avançadas'
          ],
          popular: false,
          featured: true,
          free_trial: false,
          free_trial_days: null,
          is_active: true
        },
        {
          id: 'enterprise',
          name: 'MBuddy Team',
          description: 'Para equipes',
          price: 149.90,
          price_annual: 1499.00,
          price_annual_monthly: 124.92,
          features: [
            'Tudo do MBuddy Pro',
            'Suporte dedicado',
            'Customizações',
            'SLA garantido',
            'Treinamento da equipe',
            'Gerente de conta'
          ],
          popular: false,
          featured: false,
          free_trial: false,
          free_trial_days: null,
          is_active: true
        }
      ];

      for (const plan of defaultPlans) {
        await query(`
          INSERT INTO plans 
          (id, name, description, price, price_annual, price_annual_monthly, features, 
           popular, featured, free_trial, free_trial_days, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          plan.id,
          plan.name,
          plan.description,
          plan.price,
          plan.price_annual,
          plan.price_annual_monthly,
          plan.features,
          plan.popular,
          plan.featured,
          plan.free_trial,
          plan.free_trial_days,
          plan.is_active
        ]);
        console.log(`✅ Plano ${plan.name} inserido`);
      }
    } else {
      console.log('⏭️  Planos já existem no banco');
    }

    // ============================================
    // MIGRAÇÃO V7 - Colunas adicionais de planos
    // ============================================
    console.log('\n📦 Executando migração V7 (colunas adicionais de planos)...');
    
    const planColumnsToAdd = [
      { name: 'max_users', type: 'INTEGER', defaultValue: null },
      { name: 'current_users', type: 'INTEGER', defaultValue: 0 },
      { name: 'is_available', type: 'BOOLEAN', defaultValue: true },
      { name: 'sort_order', type: 'INTEGER', defaultValue: 0 },
      { name: 'currency', type: "VARCHAR(10)", defaultValue: "'BRL'" },
      { name: 'billing_cycle_days', type: 'INTEGER', defaultValue: 30 },
      { name: 'max_projects', type: 'INTEGER', defaultValue: null },
      { name: 'max_storage_gb', type: 'DECIMAL(10, 2)', defaultValue: null },
      { name: 'support_level', type: "VARCHAR(50)", defaultValue: "'community'" },
      { name: 'api_access', type: 'BOOLEAN', defaultValue: false },
      { name: 'custom_domain', type: 'BOOLEAN', defaultValue: false },
      { name: 'white_label', type: 'BOOLEAN', defaultValue: false }
    ];

    for (const column of columnsToAdd) {
      const checkColumn = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'plans' AND column_name = $1
      `, [column.name]);

      if (checkColumn.rows.length === 0) {
        const defaultValue = column.defaultValue !== null 
          ? `DEFAULT ${column.defaultValue}` 
          : '';
        
        await query(`
          ALTER TABLE plans 
          ADD COLUMN ${column.name} ${column.type} ${defaultValue}
        `);
        console.log(`✅ Coluna ${column.name} adicionada`);
      }
    }

    // Atualizar valores padrão
    await query(`
      UPDATE plans 
      SET 
        sort_order = CASE id
          WHEN 'basic' THEN 1
          WHEN 'premium' THEN 2
          WHEN 'enterprise' THEN 3
          ELSE 0
        END,
        currency = 'BRL',
        billing_cycle_days = 30,
        support_level = CASE id
          WHEN 'basic' THEN 'email'
          WHEN 'premium' THEN 'priority'
          WHEN 'enterprise' THEN 'dedicated'
          ELSE 'community'
        END,
        api_access = CASE id
          WHEN 'premium' THEN true
          WHEN 'enterprise' THEN true
          ELSE false
        END
      WHERE sort_order = 0 OR sort_order IS NULL
    `);
    console.log('✅ Valores padrão atualizados');

    // Criar função e trigger para atualizar contagem de usuários
    await query(`
      CREATE OR REPLACE FUNCTION update_plan_user_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
          UPDATE plans 
          SET current_users = (
            SELECT COUNT(*) 
            FROM subscriptions 
            WHERE plan_type = NEW.plan_type 
            AND status = 'active'
          )
          WHERE id = NEW.plan_type;
        END IF;
        
        IF TG_OP = 'DELETE' THEN
          UPDATE plans 
          SET current_users = (
            SELECT COUNT(*) 
            FROM subscriptions 
            WHERE plan_type = OLD.plan_type 
            AND status = 'active'
          )
          WHERE id = OLD.plan_type;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Função update_plan_user_count criada');

    await query(`
      DROP TRIGGER IF EXISTS trigger_update_plan_user_count ON subscriptions;
      CREATE TRIGGER trigger_update_plan_user_count
      AFTER INSERT OR UPDATE OR DELETE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_plan_user_count();
    `);
    console.log('✅ Trigger criado');

    // Atualizar contagem inicial
    await query(`
      UPDATE plans p
      SET current_users = (
        SELECT COUNT(*) 
        FROM subscriptions s
        WHERE s.plan_type = p.id 
        AND s.status = 'active'
      )
    `);
    console.log('✅ Contagem inicial atualizada');

    // ============================================
    // NOTA: Schema mclients removido completamente
    // ============================================
    console.log('\n📦 Schema mclients foi removido - pulando migração V11-V17');


    // ============================================
    // RESUMO FINAL
    // ============================================
    console.log('\n📊 Verificando estrutura final...');
    
    const usersColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    const subscriptionsColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions'
      ORDER BY ordinal_position;
    `);

    console.log(`\n✅ Tabela users: ${usersColumns.rows.length} colunas`);
    console.log(`✅ Tabela subscriptions: ${subscriptionsColumns.rows.length} colunas`);

    console.log('\n🎉 Migração completa concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrateAll();

