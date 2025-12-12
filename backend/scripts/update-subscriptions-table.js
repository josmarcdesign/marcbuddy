import { query } from '../src/database/connection.js';

/**
 * Script para atualizar a tabela de subscriptions com campos adicionais
 * Execute: node backend/scripts/update-subscriptions-table.js
 */

const updateSubscriptionsTable = async () => {
  try {
    console.log('🔄 Atualizando tabela subscriptions...');

    // Verificar se as colunas já existem antes de adicionar
    const checkColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscriptions'
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);

    // Adicionar colunas se não existirem
    if (!existingColumns.includes('billing_period')) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN billing_period VARCHAR(20) DEFAULT 'monthly' 
        CHECK (billing_period IN ('monthly', 'annual'));
      `);
      console.log('✅ Coluna billing_period adicionada');
    }

    if (!existingColumns.includes('amount')) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN amount DECIMAL(10, 2);
      `);
      console.log('✅ Coluna amount adicionada');
    }

    if (!existingColumns.includes('currency')) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN currency VARCHAR(3) DEFAULT 'BRL';
      `);
      console.log('✅ Coluna currency adicionada');
    }

    if (!existingColumns.includes('auto_renew')) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN auto_renew BOOLEAN DEFAULT true;
      `);
      console.log('✅ Coluna auto_renew adicionada');
    }

    if (!existingColumns.includes('cancelled_at')) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN cancelled_at TIMESTAMP;
      `);
      console.log('✅ Coluna cancelled_at adicionada');
    }

    if (!existingColumns.includes('cancellation_reason')) {
      await query(`
        ALTER TABLE subscriptions 
        ADD COLUMN cancellation_reason TEXT;
      `);
      console.log('✅ Coluna cancellation_reason adicionada');
    }

    // Atualizar subscriptions existentes com valores padrão
    await query(`
      UPDATE subscriptions 
      SET 
        billing_period = COALESCE(billing_period, 'monthly'),
        currency = COALESCE(currency, 'BRL'),
        auto_renew = COALESCE(auto_renew, true)
      WHERE billing_period IS NULL OR currency IS NULL OR auto_renew IS NULL;
    `);

    console.log('✅ Tabela subscriptions atualizada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar tabela:', error);
    process.exit(1);
  }
};

updateSubscriptionsTable();

