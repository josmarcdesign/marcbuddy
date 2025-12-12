import { query } from './connection.js';

/**
 * Script de migração V2 - Atualizações de assinaturas e estrutura
 * Execute: npm run migrate:v2
 * 
 * Este script adiciona as colunas necessárias para o sistema de assinaturas completo:
 * - billing_period (monthly/annual)
 * - amount (valor pago)
 * - currency (moeda)
 * - auto_renew (renovação automática)
 * - cancelled_at (data de cancelamento)
 * - cancellation_reason (motivo do cancelamento)
 */

const migrateV2 = async () => {
  try {
    console.log('🔄 Iniciando migração V2 do banco de dados...');

    // Verificar se as colunas já existem antes de adicionar
    const checkColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions'
      ORDER BY column_name;
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);
    console.log('📋 Colunas existentes na tabela subscriptions:', existingColumns);

    // Adicionar colunas se não existirem
    const columnsToAdd = [
      {
        name: 'billing_period',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN billing_period VARCHAR(20) DEFAULT 'monthly' 
              CHECK (billing_period IN ('monthly', 'annual'));`,
        description: 'Período de cobrança (mensal ou anual)'
      },
      {
        name: 'amount',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN amount DECIMAL(10, 2);`,
        description: 'Valor pago pela assinatura'
      },
      {
        name: 'currency',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN currency VARCHAR(3) DEFAULT 'BRL';`,
        description: 'Moeda do pagamento'
      },
      {
        name: 'auto_renew',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN auto_renew BOOLEAN DEFAULT true;`,
        description: 'Renovação automática'
      },
      {
        name: 'cancelled_at',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN cancelled_at TIMESTAMP;`,
        description: 'Data de cancelamento'
      },
      {
        name: 'cancellation_reason',
        sql: `ALTER TABLE subscriptions 
              ADD COLUMN cancellation_reason TEXT;`,
        description: 'Motivo do cancelamento'
      }
    ];

    let addedCount = 0;
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        await query(column.sql);
        console.log(`✅ Coluna ${column.name} adicionada - ${column.description}`);
        addedCount++;
      } else {
        console.log(`⏭️  Coluna ${column.name} já existe, pulando...`);
      }
    }

    if (addedCount === 0) {
      console.log('ℹ️  Todas as colunas já existem. Nenhuma alteração necessária.');
    }

    // Atualizar subscriptions existentes com valores padrão
    const updateResult = await query(`
      UPDATE subscriptions 
      SET 
        billing_period = COALESCE(billing_period, 'monthly'),
        currency = COALESCE(currency, 'BRL'),
        auto_renew = COALESCE(auto_renew, true)
      WHERE billing_period IS NULL OR currency IS NULL OR auto_renew IS NULL;
    `);
    console.log(`✅ ${updateResult.rowCount} assinatura(s) atualizada(s) com valores padrão`);

    // Verificar estrutura final
    const finalCheck = await query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📊 Estrutura final da tabela subscriptions:');
    finalCheck.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    console.log('\n🎉 Migração V2 concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V2:', error);
    process.exit(1);
  }
};

migrateV2();

