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
  const queries = [
    "ALTER TABLE orders ADD COLUMN payment_method ENUM('cod', 'razorpay') DEFAULT 'cod'",
    "ALTER TABLE orders ADD COLUMN payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending'",
    "ALTER TABLE orders ADD COLUMN payment_id VARCHAR(255) DEFAULT NULL",
    "ALTER TABLE orders ADD COLUMN razorpay_order_id VARCHAR(255) DEFAULT NULL",
    "ALTER TABLE orders ADD COLUMN donation_amount DECIMAL(10,2) DEFAULT 0",
    "ALTER TABLE orders ADD COLUMN gifting_amount DECIMAL(10,2) DEFAULT 0",
    "ALTER TABLE orders ADD COLUMN gifting_message VARCHAR(500) DEFAULT NULL"
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
      console.log(`✅ Success: ${query}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`ℹ️  Skipped (already exists): ${query}`);
      } else {
        console.error(`❌ Error on: ${query}\n`, e.message);
      }
    }
  }

  await pool.end();
  process.exit(0);
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
