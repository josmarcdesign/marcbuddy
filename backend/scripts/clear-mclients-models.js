import { query } from '../src/database/connection.js';

/**
 * Remove followThroughs e followThroughModels de um usuário.
 * Uso: node scripts/clear-mclients-models.js --user 4
 */
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return null;
};

const userId = parseInt(getArg('--user') || '0', 10);

if (!userId) {
  console.error('Uso: node scripts/clear-mclients-models.js --user <id>');
  process.exit(1);
}

const run = async () => {
  try {
    await query('DELETE FROM mclients_follow_throughs WHERE user_id = $1', [userId]);
    await query('DELETE FROM mclients_follow_through_models WHERE user_id = $1', [userId]);
    console.log(`✅ Removidos followThroughs e modelos do user_id=${userId}`);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao remover modelos/FTs:', error);
    process.exit(1);
  }
};

run();

