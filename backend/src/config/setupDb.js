/**
 * SPOOWA Database Setup Script
 * Creates the database, tables, and seeds initial data.
 *
 * Usage: node src/config/setupDb.js
 */

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true,
  };

  let connection;

  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    // --- Run Schema ---
    console.log('📋 Running schema.sql...');
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await connection.query(schema);
    console.log('✅ Schema created successfully\n');

    // --- Run Seed ---
    console.log('🌱 Running seed.sql...');
    const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
    await connection.query(seed);
    console.log('✅ Seed data inserted successfully\n');

    // --- Verify ---
    const [products] = await connection.query('SELECT COUNT(*) as count FROM spoowa_db.products');
    const [coupons] = await connection.query('SELECT COUNT(*) as count FROM spoowa_db.coupons');
    const [sizes] = await connection.query('SELECT COUNT(*) as count FROM spoowa_db.product_sizes');

    console.log('📊 Database Summary:');
    console.log(`   Products:      ${products[0].count}`);
    console.log(`   Product Sizes:  ${sizes[0].count}`);
    console.log(`   Coupons:        ${coupons[0].count}`);
    console.log('\n🎉 Database setup complete!');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\n💡 Seed data already exists. If you want to re-seed, drop the database first:');
      console.log('   DROP DATABASE spoowa_db;');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
