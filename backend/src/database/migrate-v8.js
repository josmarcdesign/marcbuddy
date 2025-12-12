import { query } from './connection.js';

/**
 * Migração V8 - Adicionar colunas de desconto para planos anuais e multi-anuais
 * Execute: npm run migrate:v8
 */
const migrateV8 = async () => {
  try {
    console.log('🔄 Iniciando migração V8 do banco de dados...');

    // Adicionar colunas de desconto
    const columnsToAdd = [
      {
        name: 'annual_discount_percentage',
        type: 'DECIMAL(5, 2)',
        defaultValue: null,
        comment: 'Percentual de desconto para plano anual (ex: 16.67 para 2 meses grátis)'
      },
      {
        name: 'biennial_discount_percentage',
        type: 'DECIMAL(5, 2)',
        defaultValue: null,
        comment: 'Percentual de desconto para plano de 2 anos'
      },
      {
        name: 'triennial_discount_percentage',
        type: 'DECIMAL(5, 2)',
        defaultValue: null,
        comment: 'Percentual de desconto para plano de 3 anos'
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

    // Calcular e atualizar descontos padrão baseados nos preços existentes
    await query(`
      UPDATE plans 
      SET 
        annual_discount_percentage = CASE 
          WHEN price > 0 AND price_annual > 0 THEN 
            ROUND(((price * 12 - price_annual) / (price * 12)) * 100, 2)
          ELSE NULL
        END
      WHERE annual_discount_percentage IS NULL
    `);
    console.log('✅ Descontos anuais calculados e atualizados');

    console.log('🎉 Migração V8 concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração V8:', error);
    process.exit(1);
  }
};

migrateV8();

