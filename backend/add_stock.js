import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'spoowa_db',
  port:     parseInt(process.env.DB_PORT || '3306', 10),
});

async function run() {
  // 1. Add stock column if it doesn't already exist
  try {
    await pool.query('ALTER TABLE products ADD COLUMN stock INT UNSIGNED NOT NULL DEFAULT 100');
    console.log('✅ stock column added to products table');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  stock column already exists — skipping ALTER TABLE');
    } else {
      throw e;
    }
  }

  // 2. Set stock = 100 for all 24 dummy products (dev / testing)
  const [res] = await pool.query('UPDATE products SET stock = 100');
  console.log(`✅ Set stock=100 on ${res.affectedRows} product(s)`);

  // 3. Verify
  const [rows] = await pool.query('SELECT id, name, stock FROM products ORDER BY id LIMIT 24');
  console.table(rows);

  await pool.end();
  process.exit(0);
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
