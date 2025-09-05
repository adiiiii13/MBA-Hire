const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('Database:', process.env.DB_NAME);
  console.log('Username:', process.env.DB_USER);
  console.log('Password length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000
    });
    
    console.log('✅ Database connection successful!');
    console.log('🎉 Ready to create tables and run migrations!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test query successful:', rows);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 This usually means:');
      console.log('   - Wrong username or password');
      console.log('   - Check your database credentials');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 This usually means:');
      console.log('   - Wrong hostname');
      console.log('   - Network connection issue');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 This usually means:');
      console.log('   - Database name is incorrect');
      console.log('   - Database does not exist');
    }
    
    return false;
  }
}

testConnection();
