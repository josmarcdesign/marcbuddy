import { query } from '../src/database/connection.js';

/**
 * Script para verificar e corrigir a estrutura da tabela users
 */

async function fixUsersTable() {
  try {
    console.log('🔍 Verificando estrutura da tabela users...\n');

    // Verificar quantos registros existem
    const countResult = await query('SELECT COUNT(*) as total FROM public.users');
    console.log(`📊 Total de usuários: ${countResult.rows[0].total}\n`);

    // Listar usuários
    const usersResult = await query(`
      SELECT id, name, email, role, is_active, created_at 
      FROM public.users 
      ORDER BY id
    `);
    
    console.log('👥 Usuários encontrados:');
    usersResult.rows.forEach(user => {
      console.log(`   ID: ${user.id} | ${user.name} (${user.email}) | Role: ${user.role} | Ativo: ${user.is_active}`);
    });

    // Verificar se há coluna avatar_url
    const columnsResult = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'avatar_url'
    `);

    if (columnsResult.rows.length === 0) {
      console.log('\n⚠️  Coluna avatar_url não existe, adicionando...');
      await query('ALTER TABLE public.users ADD COLUMN avatar_url VARCHAR(500)');
      console.log('✅ Coluna avatar_url adicionada');
    } else {
      console.log('\n✅ Coluna avatar_url existe');
    }

    console.log('\n✅ Verificação concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixUsersTable();

