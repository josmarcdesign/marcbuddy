/**
 * Importa um data.json local para a tabela mclients_data.
 * Uso:
 *   node scripts/import-mclients-json.js --user 1 --file ./data/mclients/josmarcdesign/data.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return null;
};

const userId = parseInt(getArg('--user') || '0', 10);
const filePathArg = getArg('--file');

if (!userId || !filePathArg) {
  console.error('Uso: node scripts/import-mclients-json.js --user <id> --file <caminho_do_json>');
  process.exit(1);
}

const filePath = path.resolve(__dirname, '..', filePathArg);

if (!fs.existsSync(filePath)) {
  console.error(`Arquivo não encontrado: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const run = async () => {
  try {
    await query(
      `
        INSERT INTO mclients_data (user_id, data, last_updated)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET data = EXCLUDED.data, last_updated = EXCLUDED.last_updated
      `,
      [userId, data]
    );
    console.log(`✅ Dados importados para user_id=${userId} a partir de ${filePath}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error);
    process.exit(1);
  }
};

run();

