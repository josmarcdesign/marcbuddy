import { query } from '../src/database/connection.js';

async function checkSchemas() {
  try {
    console.log('🔍 Verificando schemas e tabelas...\n');

    // 1. Verificar se o schema mclients existe
    console.log('1. Verificando schemas...');
    const schemasResult = await query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('public', 'mclients')
      ORDER BY schema_name
    `);
    
    console.log('Schemas encontrados:');
    schemasResult.rows.forEach(row => {
      console.log(`  ✅ ${row.schema_name}`);
    });

    if (!schemasResult.rows.find(r => r.schema_name === 'mclients')) {
      console.log('\n⚠️  Schema mclients NÃO existe!');
    }

    // 2. Verificar onde estão as tabelas mclients
    console.log('\n2. Verificando localização das tabelas mclients...');
    const tablesResult = await query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE 'mclients_%'
      ORDER BY table_schema, table_name
    `);

    console.log('\nTabelas encontradas:');
    const bySchema = {};
    tablesResult.rows.forEach(row => {
      if (!bySchema[row.table_schema]) {
        bySchema[row.table_schema] = [];
      }
      bySchema[row.table_schema].push(row.table_name);
    });

    Object.keys(bySchema).forEach(schema => {
      console.log(`\n📦 Schema: ${schema}`);
      bySchema[schema].forEach(table => {
        console.log(`   - ${table}`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkSchemas();

