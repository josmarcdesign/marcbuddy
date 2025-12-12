import { query } from '../src/database/connection.js';
import bcrypt from 'bcryptjs';

/**
 * Script para criar ou atualizar usuário admin
 * Execute: node scripts/create-admin-user.js
 */

const createAdminUser = async () => {
  try {
    const email = 'josmarcdesign@gmail.com';
    const name = 'José Márcio';
    const password = '12345'; // Senha padrão
    
    console.log(`🔄 Criando/atualizando usuário admin: ${email}...\n`);

    // Verificar se o usuário existe
    const userCheck = await query(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      const user = userCheck.rows[0];
      console.log(`📋 Usuário encontrado:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role atual: ${user.role}\n`);

      // Atualizar para admin se não for
      if (user.role !== 'admin') {
        await query(
          'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
          ['admin', email]
        );
        console.log('✅ Role atualizado para admin!');
      } else {
        console.log('✅ Usuário já é admin!');
      }

      // Atualizar senha se necessário
      const passwordHash = await bcrypt.hash(password, 10);
      await query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
        [passwordHash, email]
      );
      console.log('✅ Senha atualizada!');
      
    } else {
      // Criar novo usuário admin
      console.log('📋 Criando novo usuário admin...\n');
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const result = await query(
        `INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, name, email, role`,
        [name, email, passwordHash, 'admin', true]
      );

      const newUser = result.rows[0];
      console.log('✅ Usuário admin criado com sucesso!');
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Nome: ${newUser.name}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Role: ${newUser.role}`);
      console.log(`   Senha: ${password}`);
    }

    console.log('\n✅ Processo concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

createAdminUser();

