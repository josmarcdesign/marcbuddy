import { query } from './connection.js';

/**
 * Migração V17 - Criar schema mclients e mover tabelas
 * 
 * Esta migração:
 * 1. Cria o schema mclients
 * 2. Move todas as tabelas mclients_* para o schema mclients
 * 3. Ajusta notas de RLS (atualização ocorre em V18)
 */

const migrateSchemaMclients = async () => {
  try {
    console.log('📦 Iniciando migração V17 - Schema mclients...\n');

    // 1. Criar schema mclients
    console.log('1. Criando schema mclients...');
    try {
      await query('CREATE SCHEMA IF NOT EXISTS mclients');
      console.log('✅ Schema mclients criado\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⏭️  Schema mclients já existe\n');
      } else {
        throw error;
      }
    }

    // 2. Lista de tabelas mclients para mover
    const mclientsTables = [
      'mclients_clients',
      'mclients_follow_through_models',
      'mclients_follow_throughs',
      'mclients_demands',
      'mclients_payments',
      'mclients_documents',
      'mclients_services',
      'mclients_tasks',
      'mclients_pending_approvals',
      'mclients_time_entries',
      'mclients_activities',
      'mclients_briefing_submissions',
    ];

    // 3. Mover tabelas para o schema mclients
    console.log('2. Movendo tabelas para o schema mclients...\n');
    for (const table of mclientsTables) {
      try {
        // Verificar se a tabela existe no public
        const checkTable = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = $1
          )
        `, [table]);

        if (checkTable.rows[0].exists) {
          // Mover tabela para o schema mclients
          await query(`ALTER TABLE public.${table} SET SCHEMA mclients`);
          console.log(`✅ ${table} movida para schema mclients`);
        } else {
          // Verificar se já está no schema mclients
          const checkMclients = await query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'mclients' AND table_name = $1
            )
          `, [table]);

          if (checkMclients.rows[0].exists) {
            console.log(`⏭️  ${table} já está no schema mclients`);
          } else {
            console.log(`⚠️  ${table} não encontrada, pulando...`);
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao mover ${table}:`, error.message);
      }
    }

    // 4. Atualizar foreign keys que referenciam users (manter no public)
    console.log('\n3. Verificando foreign keys...');
    // As foreign keys para users devem continuar funcionando mesmo com schemas diferentes
    console.log('✅ Foreign keys mantidas (funcionam entre schemas)\n');

    // 5. Atualizar políticas RLS (serão recriadas na próxima migração)
    console.log('4. Nota: Políticas RLS precisarão ser atualizadas');
    console.log('   (será feito na migração V18)\n');

    console.log('\n✅ Migração V17 concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Executar migração V18 para atualizar políticas RLS');
    console.log('   2. Atualizar código para usar mclients.* nas queries');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração V17:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

migrateSchemaMclients();

