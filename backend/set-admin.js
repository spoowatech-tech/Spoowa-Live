import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

const [r] = await conn.execute(
  `UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'leoninja1912@gmail.com'`
);
console.log(`✅ Updated ${r.affectedRows} row(s)`);

const [u] = await conn.execute(
  `SELECT id, name, email, role, status FROM users WHERE email = 'leoninja1912@gmail.com'`
);
if (u.length > 0) {
  console.log('👤 User:', u[0]);
} else {
  console.log('⚠️  No user found with that email.');
}

await conn.end();
