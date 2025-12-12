import { query } from '../src/database/connection.js';

async function removeMarcbuddyTable() {
  try {
    console.log('🔍 Verificando tabela marcbuddy_mclientsdatabase...\n');

    // 1. Verificar se a tabela existe
    console.log('1. Verificando se a tabela existe...');
    const checkTable = await query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'marcbuddy_mclientsdatabase'
      ORDER BY table_schema
    `);

    if (checkTable.rows.length === 0) {
      console.log('✅ Tabela marcbuddy_mclientsdatabase não encontrada\n');
      process.exit(0);
    }

    console.log('Tabela encontrada em:');
    checkTable.rows.forEach(row => {
      console.log(`   - ${row.table_schema}.${row.table_name}`);
    });

    // 2. Verificar se está no schema public
    const inPublic = checkTable.rows.find(r => r.table_schema === 'public');
    if (!inPublic) {
      console.log('\n⚠️  Tabela não está no schema public, está em:', checkTable.rows[0].table_schema);
      console.log('   Removendo de todos os schemas encontrados...\n');
    } else {
      console.log('\n🗑️  Removendo tabela do schema public...\n');
    }

    // 3. Verificar estrutura da tabela antes de remover
    for (const row of checkTable.rows) {
      try {
        const structureResult = await query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = $1 AND table_name = $2
          ORDER BY ordinal_position
        `, [row.table_schema, row.table_name]);

        console.log(`📋 Estrutura da tabela ${row.table_schema}.${row.table_name}:`);
        console.log(`   ${structureResult.rows.length} colunas encontradas`);
        
        // Contar registros
        const countResult = await query(`SELECT COUNT(*) as total FROM ${row.table_schema}.${row.table_name}`);
        const total = parseInt(countResult.rows[0].total);
        console.log(`   ${total} registros na tabela`);

        if (total > 0) {
          console.log(`\n⚠️  ATENÇÃO: A tabela contém ${total} registros!`);
          console.log('   Removendo mesmo assim...');
        }
      } catch (error) {
        console.log(`   ⚠️  Não foi possível verificar estrutura: ${error.message}`);
      }

      // 4. Remover a tabela
      try {
        await query(`DROP TABLE IF EXISTS ${row.table_schema}.${row.table_name} CASCADE`);
        console.log(`\n✅ Tabela ${row.table_schema}.${row.table_name} removida com sucesso!`);
      } catch (error) {
        console.error(`\n❌ Erro ao remover ${row.table_schema}.${row.table_name}:`, error.message);
        throw error;
      }
    }

    // 5. Verificação final
    console.log('\n5. Verificação final...');
    const finalCheck = await query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'marcbuddy_mclientsdatabase'
    `);

    if (finalCheck.rows.length === 0) {
      console.log('✅ Tabela marcbuddy_mclientsdatabase removida completamente!');
    } else {
      console.log('⚠️  Ainda existem instâncias da tabela:');
      finalCheck.rows.forEach(r => {
        console.log(`   - ${r.table_schema}.${r.table_name}`);
      });
    }

    console.log('\n✅ Processo concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

removeMarcbuddyTable();

