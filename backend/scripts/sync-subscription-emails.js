import { query } from '../src/database/connection.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script para sincronizar emails na tabela subscriptions
 * Preenche o email de todas as assinaturas que não têm email
 */

const syncSubscriptionEmails = async () => {
  try {
    console.log('🔄 Sincronizando emails na tabela subscriptions...');

    // Atualizar todas as assinaturas que não têm email
    const result = await query(`
      UPDATE subscriptions s
      SET email = u.email
      FROM users u
      WHERE s.user_id = u.id AND (s.email IS NULL OR s.email = '');
    `);

    console.log(`✅ ${result.rowCount} assinatura(s) atualizada(s) com email`);

    // Verificar quantas ainda estão sem email
    const checkResult = await query(`
      SELECT COUNT(*) as total
      FROM subscriptions
      WHERE email IS NULL OR email = '';
    `);

    const remaining = parseInt(checkResult.rows[0].total);
    if (remaining > 0) {
      console.log(`⚠️  Ainda há ${remaining} assinatura(s) sem email (provavelmente sem usuário associado)`);
    } else {
      console.log('✅ Todas as assinaturas têm email preenchido');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar emails:', error);
    process.exit(1);
  }
};

syncSubscriptionEmails();

