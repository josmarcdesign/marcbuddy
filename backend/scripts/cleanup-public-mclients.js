import { query } from '../src/database/connection.js';

async function cleanupPublicMclients() {
  try {
    console.log('🧹 Limpando objetos mclients do schema public...\n');

    // 1. Verificar tabelas mclients no schema public
    console.log('1. Verificando tabelas mclients no schema public...');
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'mclients_%'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('✅ Nenhuma tabela mclients encontrada no schema public\n');
    } else {
      console.log(`⚠️  Encontradas ${tablesResult.rows.length} tabelas mclients no schema public:`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('\n🗑️  Removendo tabelas do schema public...');
      
      for (const row of tablesResult.rows) {
        try {
          await query(`DROP TABLE IF EXISTS public.${row.table_name} CASCADE`);
          console.log(`✅ Tabela public.${row.table_name} removida`);
        } catch (error) {
          console.error(`❌ Erro ao remover public.${row.table_name}:`, error.message);
        }
      }
    }

    // 2. Verificar índices mclients no schema public
    console.log('\n2. Verificando índices mclients no schema public...');
    const indexesResult = await query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname LIKE '%mclients%'
      ORDER BY indexname
    `);

    if (indexesResult.rows.length === 0) {
      console.log('✅ Nenhum índice mclients encontrado no schema public\n');
    } else {
      console.log(`⚠️  Encontrados ${indexesResult.rows.length} índices mclients no schema public:`);
      indexesResult.rows.forEach(row => {
        console.log(`   - ${row.indexname}`);
      });
      console.log('\n🗑️  Removendo índices do schema public...');
      
      for (const row of indexesResult.rows) {
        try {
          await query(`DROP INDEX IF EXISTS public.${row.indexname} CASCADE`);
          console.log(`✅ Índice public.${row.indexname} removido`);
        } catch (error) {
          console.error(`❌ Erro ao remover public.${row.indexname}:`, error.message);
        }
      }
    }

    // 3. Verificar sequências mclients no schema public
    console.log('\n3. Verificando sequências mclients no schema public...');
    const sequencesResult = await query(`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public' 
      AND sequence_name LIKE '%mclients%'
      ORDER BY sequence_name
    `);

    if (sequencesResult.rows.length === 0) {
      console.log('✅ Nenhuma sequência mclients encontrada no schema public\n');
    } else {
      console.log(`⚠️  Encontradas ${sequencesResult.rows.length} sequências mclients no schema public:`);
      sequencesResult.rows.forEach(row => {
        console.log(`   - ${row.sequence_name}`);
      });
      console.log('\n🗑️  Removendo sequências do schema public...');
      
      for (const row of sequencesResult.rows) {
        try {
          await query(`DROP SEQUENCE IF EXISTS public.${row.sequence_name} CASCADE`);
          console.log(`✅ Sequência public.${row.sequence_name} removida`);
        } catch (error) {
          console.error(`❌ Erro ao remover public.${row.sequence_name}:`, error.message);
        }
      }
    }

    // 4. Verificar tabela mclients_data (pode estar no public)
    console.log('\n4. Verificando tabela mclients_data...');
    const mclientsDataResult = await query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'mclients_data'
      ORDER BY table_schema
    `);

    if (mclientsDataResult.rows.length === 0) {
      console.log('✅ Tabela mclients_data não encontrada\n');
    } else {
      mclientsDataResult.rows.forEach(row => {
        console.log(`   - ${row.table_schema}.${row.table_name}`);
      });
      
      // Se estiver no public, perguntar se deve mover ou remover
      const inPublic = mclientsDataResult.rows.find(r => r.table_schema === 'public');
      if (inPublic) {
        console.log('\n⚠️  Tabela mclients_data encontrada no schema public');
        console.log('   Esta tabela pode ser movida para o schema mclients ou removida');
        console.log('   (Ela foi substituída pelas tabelas relacionais no schema mclients)');
        
        // Verificar se está vazia
        const countResult = await query('SELECT COUNT(*) as total FROM public.mclients_data');
        const total = parseInt(countResult.rows[0].total);
        
        if (total === 0) {
          console.log('   Tabela está vazia, removendo...');
          await query('DROP TABLE IF EXISTS public.mclients_data CASCADE');
          console.log('✅ Tabela public.mclients_data removida');
        } else {
          console.log(`   Tabela contém ${total} registros`);
          console.log('   ⚠️  Mantendo a tabela (você pode removê-la manualmente se não precisar mais)');
        }
      }
    }

    // 5. Verificar views mclients no schema public
    console.log('\n5. Verificando views mclients no schema public...');
    const viewsResult = await query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%mclients%'
      ORDER BY table_name
    `);

    if (viewsResult.rows.length === 0) {
      console.log('✅ Nenhuma view mclients encontrada no schema public\n');
    } else {
      console.log(`⚠️  Encontradas ${viewsResult.rows.length} views mclients no schema public:`);
      viewsResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('\n🗑️  Removendo views do schema public...');
      
      for (const row of viewsResult.rows) {
        try {
          await query(`DROP VIEW IF EXISTS public.${row.table_name} CASCADE`);
          console.log(`✅ View public.${row.table_name} removida`);
        } catch (error) {
          console.error(`❌ Erro ao remover public.${row.table_name}:`, error.message);
        }
      }
    }

    // 6. Verificação final
    console.log('\n6. Verificação final...');
    const finalCheck = await query(`
      SELECT 
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'mclients_%') as tables,
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE '%mclients%') as indexes,
        (SELECT COUNT(*) FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name LIKE '%mclients%') as sequences,
        (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name LIKE '%mclients%') as views
    `);

    const final = finalCheck.rows[0];
    console.log(`\n📊 Resumo final:`);
    console.log(`   - Tabelas mclients no public: ${final.tables}`);
    console.log(`   - Índices mclients no public: ${final.indexes}`);
    console.log(`   - Sequências mclients no public: ${final.sequences}`);
    console.log(`   - Views mclients no public: ${final.views}`);

    if (parseInt(final.tables) === 0 && 
        parseInt(final.indexes) === 0 && 
        parseInt(final.sequences) === 0 && 
        parseInt(final.views) === 0) {
      console.log('\n✅ Schema public limpo! Nenhum objeto mclients encontrado.');
    } else {
      console.log('\n⚠️  Ainda existem objetos mclients no schema public');
    }

    console.log('\n✅ Limpeza concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na limpeza:', error.message);
    console.error(error);
    process.exit(1);
  }
}

cleanupPublicMclients();

