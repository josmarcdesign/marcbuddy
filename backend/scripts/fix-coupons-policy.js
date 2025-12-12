import { query } from '../src/database/connection.js';

async function fixCouponsPolicy() {
  try {
    await query(`
      DROP POLICY IF EXISTS "coupons_select_public" ON coupons;
      CREATE POLICY "coupons_select_public" ON coupons
        FOR SELECT
        TO anon, authenticated
        USING (is_active = true);
    `);
    console.log('✅ Política de coupons corrigida!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

fixCouponsPolicy();

