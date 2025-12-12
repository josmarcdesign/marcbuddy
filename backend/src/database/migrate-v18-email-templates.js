import { query } from './connection.js';

/**
 * Migração V18 - Criar tabela de templates de email
 *
 * Esta migração cria a tabela email_templates no schema public para armazenar
 * templates de email personalizáveis para notificações, confirmações, etc.
 */

const migrateEmailTemplates = async () => {
  try {
    console.log('📧 Iniciando migração V18 - Templates de Email...\n');

    // 1. Criar tabela email_templates
    console.log('1. Criando tabela email_templates...');
    await query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('welcome', 'confirmation', 'reset', 'newsletter', 'notification')),
        subject VARCHAR(500) NOT NULL,
        html_content TEXT NOT NULL,
        variables JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES marcbuddy.accounts(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Tabela email_templates criada\n');

    // 2. Criar índices para melhor performance
    console.log('2. Criando índices...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
      CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
      CREATE INDEX IF NOT EXISTS idx_email_templates_created_by ON email_templates(created_by);
    `);
    console.log('✅ Índices criados\n');

    // 3. Inserir templates padrão
    console.log('3. Inserindo templates padrão...');

    // Verificar se já existem templates
    const existingCount = await query('SELECT COUNT(*) as count FROM email_templates');
    if (existingCount.rows[0].count > 0) {
      console.log(`⏭️  Já existem ${existingCount.rows[0].count} templates. Pulando inserção.`);
    } else {

    // Template de boas-vindas
    await query(`
      INSERT INTO email_templates (name, type, subject, variables)
      VALUES (
        'Bem-vindo à MarcBuddy',
        'welcome',
        'Bem-vindo! Sua conta foi criada com sucesso',
        '["{{user_name}}", "{{dashboard_url}}", "{{support_url}}", "{{privacy_url}}", "{{terms_url}}"]'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    // Template de confirmação de email
    await query(`
      INSERT INTO email_templates (name, type, subject, variables)
      VALUES (
        'Confirmação de Email',
        'confirmation',
        'Confirme seu email na MarcBuddy',
        '["{{user_name}}", "{{confirmation_url}}", "{{support_url}}", "{{privacy_url}}"]'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    // Template de reset de senha
    await query(`
      INSERT INTO email_templates (name, type, subject, variables)
      VALUES (
        'Reset de Senha',
        'reset',
        'Redefina sua senha - MarcBuddy',
        '["{{user_name}}", "{{reset_url}}", "{{support_url}}", "{{privacy_url}}"]'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Templates padrão inseridos\n');
    }

    // 4. Criar função para atualizar updated_at automaticamente
    console.log('4. Criando trigger para updated_at...');
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Criar trigger apenas se não existir
    const triggerExists = await query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'update_email_templates_updated_at'
      )
    `);

    if (!triggerExists.rows[0].exists) {
      await query(`
        CREATE TRIGGER update_email_templates_updated_at
          BEFORE UPDATE ON email_templates
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('✅ Trigger criado\n');
    } else {
      console.log('⏭️  Trigger já existe\n');
    }

    // 5. Nota sobre RLS
    console.log('5. Row Level Security será controlado via aplicação (backend)');
    console.log('   - Controle de acesso admin implementado nos controllers\n');

    console.log('🎉 Migração V18 concluída com sucesso!');
    if (existingCount.rows[0].count > 0) {
      console.log(`\n📧 Mantidos ${existingCount.rows[0].count} templates existentes.`);
    } else {
      console.log('\n📧 Templates de email criados:');
      console.log('   - Bem-vindo à MarcBuddy');
      console.log('   - Confirmação de Email');
      console.log('   - Reset de Senha');
    }
    console.log('\n📁 Templates HTML criados em: backend/templates/emails/');
    console.log('   - welcome.html');
    console.log('   - confirmation.html');
    console.log('   - reset.html');
    console.log('\n📝 Você pode criar mais templates através do painel admin.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V18:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

migrateEmailTemplates();