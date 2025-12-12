import { query } from '../src/database/connection.js';

async function verifySchemaPermissions() {
  try {
    console.log('🔍 Verificando permissões e visibilidade do schema mclients...\n');

    // 1. Verificar se o schema está acessível
    console.log('1. Testando acesso ao schema mclients...');
    const testQuery = await query('SELECT COUNT(*) as total FROM mclients.mclients_clients');
    console.log(`✅ Schema mclients está acessível (${testQuery.rows[0].total} registros em mclients_clients)\n`);

    // 2. Verificar permissões do schema
    console.log('2. Verificando permissões do schema...');
    const permissionsResult = await query(`
      SELECT 
        nspname as schema_name,
        nspowner::regrole as owner
      FROM pg_namespace
      WHERE nspname = 'mclients'
    `);

    if (permissionsResult.rows.length > 0) {
      console.log(`✅ Schema mclients encontrado`);
      console.log(`   Owner: ${permissionsResult.rows[0].owner}\n`);
    }

    // 3. Verificar se o schema está no search_path
    console.log('3. Verificando search_path...');
    const searchPathResult = await query('SHOW search_path');
    console.log(`   search_path atual: ${searchPathResult.rows[0].search_path}\n`);

    // 4. Verificar grants no schema
    console.log('4. Verificando permissões de acesso...');
    const grantsResult = await query(`
      SELECT 
        grantee, 
        privilege_type
      FROM information_schema.schema_privileges
      WHERE schema_name = 'mclients'
    `);

    if (grantsResult.rows.length > 0) {
      console.log('Permissões encontradas:');
      grantsResult.rows.forEach(row => {
        console.log(`   - ${row.grantee}: ${row.privilege_type}`);
      });
    } else {
      console.log('⚠️  Nenhuma permissão explícita encontrada');
    }

    console.log('\n✅ Verificação concluída!');
    console.log('\n💡 Nota: Se o schema não aparece no Supabase UI:');
    console.log('   1. O schema existe e está funcionando (como visto acima)');
    console.log('   2. O Supabase UI pode não mostrar schemas customizados por padrão');
    console.log('   3. Use o SQL Editor do Supabase para verificar:');
    console.log('      SELECT schema_name FROM information_schema.schemata WHERE schema_name = \'mclients\';');
    console.log('   4. Ou use: SELECT * FROM mclients.mclients_clients;');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifySchemaPermissions();

