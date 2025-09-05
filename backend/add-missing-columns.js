const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yuga_yatra_mba',
  charset: 'utf8mb4'
};

async function addMissingColumns() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Check if location column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'applications'
    `, [dbConfig.database]);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    // Add location column if it doesn't exist
    if (!columnNames.includes('location')) {
      console.log('📍 Adding location column...');
      await connection.execute(`
        ALTER TABLE applications 
        ADD COLUMN location VARCHAR(255) NOT NULL DEFAULT 'Not provided'
      `);
      console.log('✅ Location column added successfully');
    } else {
      console.log('ℹ️  Location column already exists');
    }
    
    // Make phone column NOT NULL if it's currently nullable
    const [phoneColumn] = await connection.execute(`
      SELECT IS_NULLABLE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'phone'
    `, [dbConfig.database]);
    
    if (phoneColumn.length > 0 && phoneColumn[0].IS_NULLABLE === 'YES') {
      console.log('📞 Updating phone column to be NOT NULL...');
      
      // First, update any NULL phone values with a default
      await connection.execute(`
        UPDATE applications 
        SET phone = 'Not provided' 
        WHERE phone IS NULL OR phone = ''
      `);
      
      // Then modify the column to be NOT NULL
      await connection.execute(`
        ALTER TABLE applications 
        MODIFY COLUMN phone VARCHAR(20) NOT NULL
      `);
      console.log('✅ Phone column updated successfully');
    } else {
      console.log('ℹ️  Phone column is already NOT NULL');
    }
    
    console.log('🎉 Database update completed successfully!');
    
  } catch (error) {
    console.error('❌ Database update failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the update
if (require.main === module) {
  addMissingColumns()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { addMissingColumns };
