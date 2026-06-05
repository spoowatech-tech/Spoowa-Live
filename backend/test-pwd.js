import mysql from 'mysql2/promise';

const passwords = [
  '',
  'root',
  'admin',
  '123456',
  '12345678',
  'password',
  'mysql',
  'root123',
  'spoowa',
  'admin123',
  '1234',
  'Welcome@123',
  'Root@123',
  'Mysql@123',
  'admin@123',
  'spoowa_db',
  'spoowa123'
];

async function testPasswords() {
  for (const pwd of passwords) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pwd
      });
      console.log(`\n🎉 Success! Password is: "${pwd}"`);
      await connection.end();
      process.exit(0);
    } catch (err) {
      console.log(`Failed with password: "${pwd}" - ${err.message}`);
    }
  }
  console.log('\n❌ All common passwords failed.');
  process.exit(1);
}

testPasswords();
