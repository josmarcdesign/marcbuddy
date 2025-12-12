import { query } from '../src/database/connection.js';

async function checkPlansColumns() {
  try {
    console.log('🔍 Verificando colunas da tabela public.plans...\n');

    const result = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'plans'
      ORDER BY ordinal_position
    `);

    if (result.rows.length === 0) {
      console.log('❌ Tabela public.plans não encontrada');
      process.exit(1);
    }

    console.log('✅ Colunas da tabela public.plans:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    result.rows.forEach((col, i) => {
      console.log(`${(i + 1).toString().padStart(2)}. ${col.column_name.padEnd(30)} | ${col.data_type.padEnd(20)} | ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkPlansColumns();

