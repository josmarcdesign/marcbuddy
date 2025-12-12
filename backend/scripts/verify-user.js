import { query } from '../src/database/connection.js';

async function verifyUser() {
  try {
    const email = 'josmarcdesign@gmail.com';
    
    console.log('🔍 Verificando usuário no banco...\n');
    
    const result = await query(
      'SELECT id, name, email, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('✅ Usuário encontrado:');
    console.log(JSON.stringify(user, null, 2));
    console.log('\n📋 Status:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Nome: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Ativo: ${user.is_active ? 'Sim' : 'Não'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

verifyUser();

