import { query } from '../src/database/connection.js';

/**
 * Script para definir um usuário como admin
 * Execute: node backend/scripts/set-admin.js
 */

const setUserAsAdmin = async () => {
  try {
    const email = 'josmarcdesign@gmail.com';
    
    console.log(`🔄 Atualizando usuário ${email} para admin...`);

    // Verificar se o usuário existe
    const userCheck = await query(
      'SELECT id, name, email, role FROM marcbuddy.accounts WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length === 0) {
      console.log('❌ Usuário não encontrado com este email.');
      process.exit(1);
    }

    const user = userCheck.rows[0];
    console.log(`📋 Usuário encontrado: ${user.name} (${user.email})`);
    console.log(`📋 Role atual: ${user.role}`);

    if (user.role === 'admin') {
      console.log('✅ Usuário já é admin!');
      process.exit(0);
    }

    // Atualizar role para admin
    await query(
      'UPDATE marcbuddy.accounts SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
      ['admin', email]
    );

    console.log('✅ Usuário atualizado para admin com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    process.exit(1);
  }
};

setUserAsAdmin();

