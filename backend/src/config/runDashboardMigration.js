import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool, testConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🔧 Running dashboard migration...');
  
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to database.');
    process.exit(1);
  }

  const pool = getPool();
  const sqlPath = path.join(__dirname, 'migration_dashboard.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const statements = sql.split(';').filter(s => s.trim());

  for (const statement of statements) {
    try {
      await pool.execute(statement);
      console.log('✅ Executed:', statement.trim().substring(0, 60) + '...');
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⏭️  Table already exists, skipping.');
      } else {
        console.error('❌ Error:', err.message);
      }
    }
  }

  console.log('✅ Dashboard migration complete!');
  process.exit(0);
}

runMigration();
