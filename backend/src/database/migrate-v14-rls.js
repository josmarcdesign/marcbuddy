import { query } from './connection.js';

/**
 * Migração V14 - Habilitar Row Level Security (RLS) e criar políticas de segurança
 * 
 * Esta migração:
 * 1. Habilita RLS em todas as tabelas públicas
 * 2. Cria políticas básicas de segurança
 * 3. Garante que usuários só acessem seus próprios dados
 * 4. Permite acesso do service_role (backend)
 */

const migrateRLS = async () => {
  try {
    console.log('🔒 Iniciando migração V14 - Row Level Security (RLS)...\n');

    // Lista de tabelas que precisam de RLS
    const tables = [
      'users',
      'subscriptions',
      'plans',
      'payment_methods',
      'coupons',
      'coupon_usage',
      'mclients_clients',
      'mclients_follow_through_models',
      'mclients_follow_throughs',
      'mclients_demands',
      'mclients_payments',
      'mclients_documents',
      'mclients_services',
      'mclients_tasks',
      'mclients_pending_approvals',
      'mclients_time_entries',
      'mclients_activities',
      'mclients_briefing_submissions',
    ];

    // 1. Habilitar RLS em todas as tabelas
    console.log('📋 Habilitando RLS em todas as tabelas...\n');
    for (const table of tables) {
      try {
        await query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
        console.log(`✅ RLS habilitado em: ${table}`);
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`⏭️  Tabela ${table} não existe, pulando...`);
        } else {
          console.error(`❌ Erro ao habilitar RLS em ${table}:`, error.message);
        }
      }
    }

    console.log('\n📋 Criando políticas de segurança...\n');

    // 2. Políticas para tabela users
    console.log('🔐 Criando políticas para users...');
    try {
      // Service role tem acesso total (para o backend)
      await query(`
        DROP POLICY IF EXISTS "users_service_role_all" ON users;
        CREATE POLICY "users_service_role_all" ON users
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
      `);
      console.log('  ✅ Política service_role criada');

      // Usuários autenticados podem ler seu próprio registro
      await query(`
        DROP POLICY IF EXISTS "users_select_own" ON users;
        CREATE POLICY "users_select_own" ON users
          FOR SELECT
          TO authenticated
          USING (id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
      `);
      console.log('  ✅ Política SELECT própria criada');

      // Usuários autenticados podem atualizar seu próprio registro
      await query(`
        DROP POLICY IF EXISTS "users_update_own" ON users;
        CREATE POLICY "users_update_own" ON users
          FOR UPDATE
          TO authenticated
          USING (id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'))
          WITH CHECK (id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
      `);
      console.log('  ✅ Política UPDATE própria criada');
    } catch (error) {
      console.error('  ❌ Erro ao criar políticas para users:', error.message);
    }

    // 3. Políticas para tabelas com user_id (padrão: usuário só acessa seus próprios dados)
    const userOwnedTables = [
      'subscriptions',
      'mclients_clients',
      'mclients_follow_through_models',
      'mclients_follow_throughs',
      'mclients_demands',
      'mclients_payments',
      'mclients_documents',
      'mclients_services',
      'mclients_tasks',
      'mclients_pending_approvals',
      'mclients_time_entries',
      'mclients_activities',
      'mclients_briefing_submissions',
    ];

    for (const table of userOwnedTables) {
      try {
        console.log(`🔐 Criando políticas para ${table}...`);

        // Service role tem acesso total
        await query(`
          DROP POLICY IF EXISTS "${table}_service_role_all" ON ${table};
          CREATE POLICY "${table}_service_role_all" ON ${table}
            FOR ALL
            TO service_role
            USING (true)
            WITH CHECK (true);
        `);

        // Usuários autenticados podem fazer SELECT apenas de seus próprios dados
        await query(`
          DROP POLICY IF EXISTS "${table}_select_own" ON ${table};
          CREATE POLICY "${table}_select_own" ON ${table}
            FOR SELECT
            TO authenticated
            USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
        `);

        // Usuários autenticados podem fazer INSERT apenas em seus próprios dados
        await query(`
          DROP POLICY IF EXISTS "${table}_insert_own" ON ${table};
          CREATE POLICY "${table}_insert_own" ON ${table}
            FOR INSERT
            TO authenticated
            WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
        `);

        // Usuários autenticados podem fazer UPDATE apenas em seus próprios dados
        await query(`
          DROP POLICY IF EXISTS "${table}_update_own" ON ${table};
          CREATE POLICY "${table}_update_own" ON ${table}
            FOR UPDATE
            TO authenticated
            USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'))
            WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
        `);

        // Usuários autenticados podem fazer DELETE apenas em seus próprios dados
        await query(`
          DROP POLICY IF EXISTS "${table}_delete_own" ON ${table};
          CREATE POLICY "${table}_delete_own" ON ${table}
            FOR DELETE
            TO authenticated
            USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
        `);

        console.log(`  ✅ Políticas criadas para ${table}`);
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`  ⏭️  Tabela ${table} não existe, pulando...`);
        } else {
          console.error(`  ❌ Erro ao criar políticas para ${table}:`, error.message);
        }
      }
    }

    // 4. Políticas para tabelas públicas (plans, payment_methods, coupons)
    console.log('\n🔐 Criando políticas para tabelas públicas...');

    // Plans - leitura pública, escrita apenas para service_role
    try {
      await query(`
        DROP POLICY IF EXISTS "plans_select_public" ON plans;
        CREATE POLICY "plans_select_public" ON plans
          FOR SELECT
          TO anon, authenticated
          USING (true);
      `);

      await query(`
        DROP POLICY IF EXISTS "plans_service_role_all" ON plans;
        CREATE POLICY "plans_service_role_all" ON plans
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
      `);
      console.log('  ✅ Políticas criadas para plans');
    } catch (error) {
      console.error('  ❌ Erro ao criar políticas para plans:', error.message);
    }

    // Payment methods - leitura pública, escrita apenas para service_role
    try {
      await query(`
        DROP POLICY IF EXISTS "payment_methods_select_public" ON payment_methods;
        CREATE POLICY "payment_methods_select_public" ON payment_methods
          FOR SELECT
          TO anon, authenticated
          USING (enabled = true);
      `);

      await query(`
        DROP POLICY IF EXISTS "payment_methods_service_role_all" ON payment_methods;
        CREATE POLICY "payment_methods_service_role_all" ON payment_methods
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
      `);
      console.log('  ✅ Políticas criadas para payment_methods');
    } catch (error) {
      console.error('  ❌ Erro ao criar políticas para payment_methods:', error.message);
    }

    // Coupons - leitura pública, escrita apenas para service_role
    try {
      await query(`
        DROP POLICY IF EXISTS "coupons_select_public" ON coupons;
        CREATE POLICY "coupons_select_public" ON coupons
          FOR SELECT
          TO anon, authenticated
          USING (is_active = true);
      `);

      await query(`
        DROP POLICY IF EXISTS "coupons_service_role_all" ON coupons;
        CREATE POLICY "coupons_service_role_all" ON coupons
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
      `);
      console.log('  ✅ Políticas criadas para coupons');
    } catch (error) {
      console.error('  ❌ Erro ao criar políticas para coupons:', error.message);
    }

    // Coupon usage - usuários só veem seus próprios usos
    try {
      await query(`
        DROP POLICY IF EXISTS "coupon_usage_select_own" ON coupon_usage;
        CREATE POLICY "coupon_usage_select_own" ON coupon_usage
          FOR SELECT
          TO authenticated
          USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
      `);

      await query(`
        DROP POLICY IF EXISTS "coupon_usage_service_role_all" ON coupon_usage;
        CREATE POLICY "coupon_usage_service_role_all" ON coupon_usage
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
      `);
      console.log('  ✅ Políticas criadas para coupon_usage');
    } catch (error) {
      console.error('  ❌ Erro ao criar políticas para coupon_usage:', error.message);
    }

    console.log('\n✅ Migração V14 (RLS) concluída com sucesso!');
    console.log('\n📝 Notas importantes:');
    console.log('   - Service role (backend) tem acesso total a todas as tabelas');
    console.log('   - Usuários autenticados só acessam seus próprios dados');
    console.log('   - Tabelas públicas (plans, payment_methods) têm leitura pública');
    console.log('   - O backend usa service_role, então não será afetado pelas políticas');

  } catch (error) {
    console.error('❌ Erro na migração V14:', error);
    throw error;
  }
};

migrateRLS();

