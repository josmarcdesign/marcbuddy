import { query } from './connection.js';

/**
 * Migração V9 - Atualizar descontos dos planos para valores baseados em pesquisa de mercado
 * Descontos ajustados: Anual 15%, Bienal 20%, Trienal 25%
 * Execute: npm run migrate:v9
 */
const migrateV9 = async () => {
  try {
    console.log('🔄 Iniciando migração V9 do banco de dados...');
    console.log('📊 Atualizando descontos dos planos baseado em pesquisa de mercado...');

    // Atualizar descontos para todos os planos ativos
    // Anual: 15%, Bienal: 20%, Trienal: 25%
    await query(`
      UPDATE plans 
      SET 
        annual_discount_percentage = 15.00,
        biennial_discount_percentage = 20.00,
        triennial_discount_percentage = 25.00,
        updated_at = CURRENT_TIMESTAMP
      WHERE is_active = true
    `);
    console.log('✅ Descontos atualizados para todos os planos ativos:');
    console.log('   - Anual: 15%');
    console.log('   - Bienal (2 anos): 20%');
    console.log('   - Trienal (3 anos): 25%');

    // Verificar os planos atualizados
    const result = await query(`
      SELECT id, name, annual_discount_percentage, biennial_discount_percentage, triennial_discount_percentage
      FROM plans
      WHERE is_active = true
      ORDER BY id
    `);

    console.log('\n📋 Planos atualizados:');
    result.rows.forEach(plan => {
      console.log(`   - ${plan.name} (${plan.id}):`);
      console.log(`     Anual: ${plan.annual_discount_percentage}%`);
      console.log(`     Bienal: ${plan.biennial_discount_percentage}%`);
      console.log(`     Trienal: ${plan.triennial_discount_percentage}%`);
    });

    console.log('\n🎉 Migração V9 concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração V9:', error);
    process.exit(1);
  }
};

migrateV9();
