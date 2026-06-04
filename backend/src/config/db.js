import mysql from 'mysql2/promise';
import { getServerConfig } from './index.js';

let pool = null;

/**
 * Get or create the MySQL connection pool.
 */
export function getPool() {
  if (!pool) {
    const config = getServerConfig();
    pool = mysql.createPool({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      port: config.dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

/**
 * Test the database connection.
 */
export async function testConnection() {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
}
