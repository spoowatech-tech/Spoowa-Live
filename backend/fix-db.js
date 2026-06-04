import { getPool } from './src/config/db.js';

async function fixDb() {
  const pool = getPool();
  try {
    console.log("Altering otp_codes table to support hashed OTPs (VARCHAR(255))...");
    await pool.execute('ALTER TABLE otp_codes MODIFY code VARCHAR(255) NOT NULL');
    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

fixDb();
