import { query } from './connection.js';

/**
 * Script de migração V20 - Adicionar suporte ao Stripe
 * Execute: npm run migrate:v20
 * 
 * Este script adiciona a coluna stripe_subscription_id na tabela de assinaturas
 * para armazenar o ID da assinatura no Stripe
 */

const migrateV20 = async () => {
  try {
    console.log('🔄 Iniciando migração V20 - Suporte ao Stripe...');

    // Verificar se a coluna já existe
    const checkColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'marcbuddy' 
      AND table_name = 'account_subscriptions' 
      AND column_name = 'stripe_subscription_id';
    `);

    if (checkColumns.rows.length > 0) {
      console.log('⏭️  Coluna stripe_subscription_id já existe na tabela account_subscriptions');
      process.exit(0);
    }

    // Adicionar coluna stripe_subscription_id
    await query(`
      ALTER TABLE marcbuddy.account_subscriptions 
      ADD COLUMN stripe_subscription_id VARCHAR(255);
    `);
    console.log('✅ Coluna stripe_subscription_id adicionada à tabela account_subscriptions');

    // Adicionar índice para melhor performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id 
      ON marcbuddy.account_subscriptions(stripe_subscription_id);
    `);
    console.log('✅ Índice criado na coluna stripe_subscription_id');

    // Verificar estrutura final
    const finalCheck = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'marcbuddy' 
      AND table_name = 'account_subscriptions' 
      AND column_name = 'stripe_subscription_id';
    `);
    
    if (finalCheck.rows.length > 0) {
      const col = finalCheck.rows[0];
      console.log(`\n📊 Coluna stripe_subscription_id: ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    }

    console.log('\n🎉 Migração V20 concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V20:', error);
    process.exit(1);
  }
};

migrateV20();
