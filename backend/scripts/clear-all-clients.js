import { query } from '../src/database/connection.js';

async function clearAllClients() {
  try {
    console.log('🗑️  Removendo todos os clientes do banco de dados...\n');

    // Verificar quantos clientes existem
    const countResult = await query('SELECT COUNT(*) as total FROM mclients.mclients_clients');
    const total = parseInt(countResult.rows[0].total);
    
    console.log(`📊 Total de clientes encontrados: ${total}\n`);

    if (total === 0) {
      console.log('✅ Nenhum cliente encontrado para remover');
      process.exit(0);
    }

    // Listar clientes antes de remover
    const clientsResult = await query(`
      SELECT id, name, email, user_id 
      FROM mclients.mclients_clients 
      ORDER BY id
    `);

    console.log('👥 Clientes que serão removidos:');
    clientsResult.rows.forEach(client => {
      console.log(`   - ID: ${client.id} | ${client.name} (${client.email}) | User ID: ${client.user_id}`);
    });

    // Remover todos os clientes (CASCADE vai remover demandas, pagamentos, etc.)
    console.log('\n🗑️  Removendo clientes...');
    const deleteResult = await query('DELETE FROM mclients.mclients_clients');
    
    console.log(`✅ ${deleteResult.rowCount} cliente(s) removido(s) com sucesso!`);
    console.log('\n⚠️  Nota: Demandas, pagamentos e documentos relacionados também foram removidos (CASCADE)');

    // Verificação final
    const finalCount = await query('SELECT COUNT(*) as total FROM mclients.mclients_clients');
    console.log(`\n📊 Clientes restantes: ${finalCount.rows[0].total}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

clearAllClients();

