import dotenv from 'dotenv';
dotenv.config();

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,

    // MySQL
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'spoowa_db',
    dbPort: parseInt(process.env.DB_PORT || '3306', 10),

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'spoowa_fallback_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
}
