import { query } from './connection.js';

/**
 * Migração V12 - Tabelas relacionais para MClients
 * Substitui a coluna JSONB por tabelas relacionais normalizadas
 */

const migrateV12 = async () => {
  try {
    console.log('📦 Migração V12 - Tabelas relacionais MClients');
    console.log('✅ Conectado ao banco de dados PostgreSQL\n');

    // ============================================
    // 1. Tabela de Clientes
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        address TEXT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'active',
        lead_source VARCHAR(100),
        lead_source_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_clients criada');

    // ============================================
    // 2. Tabela de Modelos de Follow Through
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_follow_through_models (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        questions JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_follow_through_models criada');

    // ============================================
    // 3. Tabela de Follow Throughs (Instâncias)
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_follow_throughs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id INTEGER REFERENCES mclients_clients(id) ON DELETE SET NULL,
        model_id INTEGER NOT NULL REFERENCES mclients_follow_through_models(id) ON DELETE CASCADE,
        demand_type VARCHAR(100) DEFAULT 'other',
        briefing_url TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        is_new_client BOOLEAN DEFAULT false,
        answers JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        expires_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_follow_throughs criada');

    // ============================================
    // 4. Tabela de Demandas
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_demands (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES mclients_clients(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_demands criada');

    // ============================================
    // 5. Tabela de Pagamentos
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES mclients_clients(id) ON DELETE CASCADE,
        demand_id INTEGER REFERENCES mclients_demands(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        due_date DATE,
        paid_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        description TEXT,
        payment_method VARCHAR(50) DEFAULT 'pix',
        sender_name VARCHAR(255),
        receiver_name VARCHAR(255),
        sender_bank VARCHAR(255),
        receiver_bank VARCHAR(255),
        payment_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_payments criada');

    // ============================================
    // 6. Tabela de Documentos
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES mclients_clients(id) ON DELETE CASCADE,
        demand_id INTEGER REFERENCES mclients_demands(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        size VARCHAR(50),
        category VARCHAR(100),
        content TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_documents criada');

    // ============================================
    // 7. Tabela de Serviços
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_services (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        category VARCHAR(100),
        duration VARCHAR(100),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_services criada');

    // ============================================
    // 8. Tabela de Tarefas
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        demand_id INTEGER NOT NULL REFERENCES mclients_demands(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_tasks criada');

    // ============================================
    // 9. Tabela de Aprovações Pendentes
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_pending_approvals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        follow_through_id INTEGER NOT NULL REFERENCES mclients_follow_throughs(id) ON DELETE CASCADE,
        model_id INTEGER NOT NULL REFERENCES mclients_follow_through_models(id) ON DELETE CASCADE,
        demand_type VARCHAR(100) DEFAULT 'other',
        client_data JSONB,
        answers JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_pending_approvals criada');

    // ============================================
    // 10. Tabela de Registros de Tempo
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_time_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        demand_id INTEGER NOT NULL REFERENCES mclients_demands(id) ON DELETE CASCADE,
        description TEXT,
        hours DECIMAL(5, 2),
        date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_time_entries criada');

    // ============================================
    // 11. Tabela de Atividades
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        demand_id INTEGER REFERENCES mclients_demands(id) ON DELETE SET NULL,
        client_id INTEGER REFERENCES mclients_clients(id) ON DELETE SET NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_activities criada');

    // ============================================
    // 12. Tabela de Submissões de Briefing
    // ============================================
    await query(`
      CREATE TABLE IF NOT EXISTS mclients_briefing_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        follow_through_id INTEGER NOT NULL REFERENCES mclients_follow_throughs(id) ON DELETE CASCADE,
        submission_data JSONB NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela mclients_briefing_submissions criada');

    // ============================================
    // Criar Índices para Performance
    // ============================================
    console.log('\n📊 Criando índices...');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_mclients_clients_user_id ON mclients_clients(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_follow_through_models_user_id ON mclients_follow_through_models(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_follow_throughs_user_id ON mclients_follow_throughs(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_follow_throughs_client_id ON mclients_follow_throughs(client_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_follow_throughs_model_id ON mclients_follow_throughs(model_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_follow_throughs_briefing_url ON mclients_follow_throughs(briefing_url);
      CREATE INDEX IF NOT EXISTS idx_mclients_demands_user_id ON mclients_demands(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_demands_client_id ON mclients_demands(client_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_payments_user_id ON mclients_payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_payments_client_id ON mclients_payments(client_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_documents_user_id ON mclients_documents(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_documents_client_id ON mclients_documents(client_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_services_user_id ON mclients_services(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_tasks_user_id ON mclients_tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_tasks_demand_id ON mclients_tasks(demand_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_pending_approvals_user_id ON mclients_pending_approvals(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_pending_approvals_follow_through_id ON mclients_pending_approvals(follow_through_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_time_entries_user_id ON mclients_time_entries(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_time_entries_demand_id ON mclients_time_entries(demand_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_activities_user_id ON mclients_activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_briefing_submissions_user_id ON mclients_briefing_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_mclients_briefing_submissions_follow_through_id ON mclients_briefing_submissions(follow_through_id);
    `);
    console.log('✅ Índices criados');

    console.log('\n🎉 Migração V12 concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V12:', error);
    process.exit(1);
  }
};

migrateV12();

