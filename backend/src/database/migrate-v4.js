import { query } from './connection.js';

/**
 * Script de migração V4 - Tabela de formas de pagamento
 * Execute: npm run migrate:v4
 */

const migrateV4 = async () => {
  try {
    console.log('🔄 Iniciando migração V4 do banco de dados...');

    // Criar tabela de formas de pagamento
    await query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        icon VARCHAR(10),
        description TEXT,
        -- Configurações específicas
        max_installments INTEGER DEFAULT 1,
        min_installment_value DECIMAL(10, 2),
        fee_percentage DECIMAL(5, 2) DEFAULT 0,
        fee_fixed DECIMAL(10, 2) DEFAULT 0,
        accepts_credit BOOLEAN DEFAULT false,
        accepts_debit BOOLEAN DEFAULT false,
        -- Metadados
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela payment_methods criada');

    // Criar índices
    await query(`
      CREATE INDEX IF NOT EXISTS idx_payment_methods_code ON payment_methods(code);
      CREATE INDEX IF NOT EXISTS idx_payment_methods_enabled ON payment_methods(enabled);
    `);
    console.log('✅ Índices criados');

    // Inserir formas de pagamento padrão se não existirem
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

    let inserted = 0;
    for (const method of defaultMethods) {
      if (!existingCodes.includes(method.code)) {
        await query(`
          INSERT INTO payment_methods 
          (code, name, enabled, icon, description, max_installments, min_installment_value, 
           fee_percentage, fee_fixed, accepts_credit, accepts_debit)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          method.code,
          method.name,
          method.enabled,
          method.icon,
          method.description,
          method.max_installments,
          method.min_installment_value,
          method.fee_percentage,
          method.fee_fixed,
          method.accepts_credit,
          method.accepts_debit
        ]);
        inserted++;
        console.log(`✅ Forma de pagamento ${method.name} inserida`);
      } else {
        console.log(`⏭️  Forma de pagamento ${method.code} já existe`);
      }
    }

    if (inserted === 0) {
      console.log('ℹ️  Todas as formas de pagamento já existem');
    }

    console.log('\n🎉 Migração V4 concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V4:', error);
    process.exit(1);
  }
};

migrateV4();

