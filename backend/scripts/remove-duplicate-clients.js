import { query } from '../src/database/connection.js';

async function removeDuplicateClients() {
  try {
    console.log('🔍 Procurando clientes duplicados...\n');

    // Buscar todos os clientes agrupados por email e user_id
    const duplicatesResult = await query(`
      SELECT user_id, email, COUNT(*) as count, array_agg(id ORDER BY id) as ids
      FROM mclients.mclients_clients
      WHERE email IS NOT NULL AND email != ''
      GROUP BY user_id, email
      HAVING COUNT(*) > 1
      ORDER BY user_id, email
    `);

    if (duplicatesResult.rows.length === 0) {
      console.log('✅ Nenhum cliente duplicado encontrado');
      process.exit(0);
    }

    console.log(`📊 Encontrados ${duplicatesResult.rows.length} grupos de clientes duplicados:\n`);

    let totalRemoved = 0;

    for (const duplicate of duplicatesResult.rows) {
      const { user_id, email, count, ids } = duplicate;
      const idsArray = ids; // array_agg retorna array
      
      console.log(`👤 User ID: ${user_id} | Email: ${email} | Duplicatas: ${count}`);
      console.log(`   IDs: ${idsArray.join(', ')}`);
      
      // Manter o primeiro ID (mais antigo) e remover os demais
      const [keepId, ...removeIds] = idsArray;
      console.log(`   ✅ Mantendo ID: ${keepId}`);
      console.log(`   ❌ Removendo IDs: ${removeIds.join(', ')}\n`);

      // Remover duplicatas
      for (const removeId of removeIds) {
        await query(
          'DELETE FROM mclients.mclients_clients WHERE id = $1 AND user_id = $2',
          [removeId, user_id]
        );
        totalRemoved++;
      }
    }

    console.log(`\n✅ ${totalRemoved} cliente(s) duplicado(s) removido(s) com sucesso!`);

    // Verificação final
    const finalCheck = await query(`
      SELECT user_id, email, COUNT(*) as count
      FROM mclients.mclients_clients
      WHERE email IS NOT NULL AND email != ''
      GROUP BY user_id, email
      HAVING COUNT(*) > 1
    `);

    if (finalCheck.rows.length === 0) {
      console.log('✅ Verificação final: Nenhum duplicado restante');
    } else {
      console.log(`⚠️  Ainda existem ${finalCheck.rows.length} grupos de duplicados`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

removeDuplicateClients();

