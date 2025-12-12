import { query } from './connection.js';

/**
 * Migração V7 - Adicionar colunas adicionais à tabela de planos
 * Execute: npm run migrate:v7
 */
const migrateV7 = async () => {
  try {
    console.log('🔄 Iniciando migração V7 do banco de dados...');

    // Adicionar colunas à tabela plans
    const columnsToAdd = [
      {
        name: 'max_users',
        type: 'INTEGER',
        defaultValue: null,
        comment: 'Limite máximo de usuários que podem ter este plano (NULL = ilimitado)'
      },
      {
        name: 'current_users',
        type: 'INTEGER',
        defaultValue: 0,
        comment: 'Número atual de usuários com este plano'
      },
      {
        name: 'is_available',
        type: 'BOOLEAN',
        defaultValue: true,
        comment: 'Se o plano está disponível para novos usuários'
      },
      {
        name: 'sort_order',
        type: 'INTEGER',
        defaultValue: 0,
        comment: 'Ordem de exibição dos planos'
      },
      {
        name: 'currency',
        type: 'VARCHAR(10)',
        defaultValue: "'BRL'",
        comment: 'Moeda do plano'
      },
      {
        name: 'billing_cycle_days',
        type: 'INTEGER',
        defaultValue: 30,
        comment: 'Dias do ciclo de cobrança (30 para mensal, 365 para anual)'
      },
      {
        name: 'max_projects',
        type: 'INTEGER',
        defaultValue: null,
        comment: 'Limite máximo de projetos (NULL = ilimitado)'
      },
      {
        name: 'max_storage_gb',
        type: 'DECIMAL(10, 2)',
        defaultValue: null,
        comment: 'Limite máximo de armazenamento em GB (NULL = ilimitado)'
      },
      {
        name: 'support_level',
        type: 'VARCHAR(50)',
        defaultValue: "'community'",
        comment: 'Nível de suporte: community, email, priority, dedicated'
      },
      {
        name: 'api_access',
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Se o plano inclui acesso à API'
      },
      {
        name: 'custom_domain',
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Se o plano permite domínio customizado'
      },
      {
        name: 'white_label',
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Se o plano permite white label'
      }
    ];

    // Verificar e adicionar colunas que não existem
    for (const column of columnsToAdd) {
      try {
        // Verificar se a coluna já existe
        const checkColumn = await query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'plans' AND column_name = $1
        `, [column.name]);

        if (checkColumn.rows.length === 0) {
          // Adicionar coluna
          const defaultValue = column.defaultValue !== null 
            ? `DEFAULT ${column.defaultValue}` 
            : '';
          
          await query(`
            ALTER TABLE plans 
            ADD COLUMN ${column.name} ${column.type} ${defaultValue}
          `);
          console.log(`✅ Coluna ${column.name} adicionada`);
        } else {
          console.log(`⏭️  Coluna ${column.name} já existe`);
        }
      } catch (error) {
        console.error(`❌ Erro ao adicionar coluna ${column.name}:`, error.message);
      }
    }

    // Atualizar valores padrão para planos existentes
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

    // Criar função para atualizar current_users automaticamente
    await query(`
      CREATE OR REPLACE FUNCTION update_plan_user_count()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Atualizar contagem quando uma assinatura é criada ou atualizada
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

    // Criar trigger para atualizar contagem automaticamente
    await query(`
      DROP TRIGGER IF EXISTS trigger_update_plan_user_count ON subscriptions;
      CREATE TRIGGER trigger_update_plan_user_count
      AFTER INSERT OR UPDATE OR DELETE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_plan_user_count();
    `);
    console.log('✅ Trigger criado para atualizar contagem de usuários');

    // Atualizar contagem inicial de usuários
    await query(`
      UPDATE plans p
      SET current_users = (
        SELECT COUNT(*) 
        FROM subscriptions s
        WHERE s.plan_type = p.id 
        AND s.status = 'active'
      )
    `);
    console.log('✅ Contagem inicial de usuários atualizada');

    console.log('🎉 Migração V7 concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração V7:', error);
    process.exit(1);
  }
};

migrateV7();

