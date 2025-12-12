import { query } from '../src/database/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    const email = 'josmarcdesign@gmail.com';
    const password = '12345';

    console.log('🧪 Testando login...\n');
    console.log(`Email: ${email}`);
    console.log(`Senha: ${password}\n`);

    // Buscar usuário
    console.log('1. Buscando usuário no banco...');
    const result = await query(
      'SELECT id, name, email, password_hash, role, is_active FROM public.users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      process.exit(1);
    }

    const user = result.rows[0];
    console.log(`✅ Usuário encontrado: ${user.name} (ID: ${user.id})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Ativo: ${user.is_active}\n`);

    // Verificar senha
    console.log('2. Verificando senha...');
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      console.log('❌ Senha inválida');
      process.exit(1);
    }
    console.log('✅ Senha válida\n');

    // Gerar token
    console.log('3. Gerando token JWT...');
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET não configurado');
      process.exit(1);
    }
    
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    console.log(`✅ Token gerado: ${token.substring(0, 50)}...\n`);

    // Buscar avatar_url
    console.log('4. Buscando avatar_url...');
    try {
      const avatarResult = await query(
        'SELECT avatar_url FROM public.users WHERE id = $1',
        [user.id]
      );
      const avatarUrl = avatarResult.rows[0]?.avatar_url || null;
      console.log(`✅ Avatar URL: ${avatarUrl || 'null'}\n`);
    } catch (error) {
      console.log(`⚠️  Erro ao buscar avatar: ${error.message}\n`);
    }

    console.log('✅ Login testado com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`   - Usuário: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Token: ${token.substring(0, 30)}...`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testLogin();

