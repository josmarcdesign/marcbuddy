import bcrypt from 'bcryptjs';
import { query } from '../src/database/connection.js';

const email = process.argv[2] || 'josmarcdesign@gmail.com';
const password = process.argv[3] || '12345';
const name = process.argv[4] || 'José Márcio';

const run = async () => {
  try {
    console.log(`Removendo usuário ${email}...`);
    await query('DELETE FROM users WHERE email = $1', [email]);

    console.log(`Criando usuário ${email}...`);
    const hash = await bcrypt.hash(password, 10);
    const res = await query(
      `INSERT INTO users (name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role`,
      [name, email, hash, 'admin', true]
    );

    console.log('Usuário recriado:', res.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao recriar usuário:', error);
    process.exit(1);
  }
};

run();

