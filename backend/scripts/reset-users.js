import { query } from '../src/database/connection.js';
import bcrypt from 'bcryptjs';

/**
 * Script para limpar e recriar usuário admin
 * Execute: node scripts/reset-users.js
 */

const resetUsers = async () => {
  try {
    console.log('🔄 Limpando tabela users...\n');

    // Deletar todos os usuários
    await query('DELETE FROM users');
    console.log('✅ Todos os usuários deletados\n');

    // Criar usuário admin
    const email = 'josmarcdesign@gmail.com';
    const name = 'José Márcio';
    const password = '12345';
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('📋 Criando usuário admin...');
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, name, email, role`,
      [name, email, passwordHash, 'admin', true]
    );

    const user = result.rows[0];
    console.log('\n✅ Usuário admin criado com sucesso!');
    console.log('📋 Detalhes:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Senha: ${password}`);
    console.log('\n✅ Processo concluído!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
};

resetUsers();

