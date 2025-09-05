const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database');

    // First, let's see what tables currently exist
    console.log('\n📋 Current tables in database:');
    const [tables] = await connection.execute("SHOW TABLES");
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    // Required tables for YugaYatra application
    const requiredTables = [
      'applications',     // Main application data
      'admins',          // Admin users
      'application_files' // File uploads
    ];

    // Tables that might be unnecessary (we'll check these)
    const potentiallyUnnecessaryTables = [
      'admin_users',     // Duplicate of admins
      'students',        // Duplicate of applications  
      'views',           // Not used
      'stored_procedures', // Not used
      'functions'        // Not used
    ];

    console.log('\n✅ Required tables:');
    requiredTables.forEach(table => console.log(`   - ${table}`));

    console.log('\n❓ Checking for unnecessary tables...');
    
    for (const tableName of potentiallyUnnecessaryTables) {
      try {
        // Check if table exists
        const [result] = await connection.execute(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = ? AND table_name = ?
        `, [process.env.DB_NAME, tableName]);

        if (result[0].count > 0) {
          // Table exists, check if it has data
          const [dataCheck] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
          const rowCount = dataCheck[0].count;
          
          console.log(`   📊 Table '${tableName}' exists with ${rowCount} rows`);
          
          if (rowCount === 0) {
            console.log(`   🗑️  '${tableName}' is empty and can be safely deleted`);
          } else {
            console.log(`   ⚠️  '${tableName}' has data - review before deleting`);
          }
        }
      } catch (error) {
        // Table doesn't exist, which is fine
        console.log(`   ✓ Table '${tableName}' doesn't exist`);
      }
    }

    // Let's also check for any other tables that aren't in our required list
    console.log('\n🔍 Checking for other unexpected tables...');
    const allTables = tables.map(table => Object.values(table)[0]);
    const unexpectedTables = allTables.filter(table => 
      !requiredTables.includes(table) && 
      !potentiallyUnnecessaryTables.includes(table)
    );

    if (unexpectedTables.length > 0) {
      console.log('   ❓ Found unexpected tables:');
      for (const tableName of unexpectedTables) {
        try {
          const [dataCheck] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
          const rowCount = dataCheck[0].count;
          console.log(`   - '${tableName}' (${rowCount} rows)`);
        } catch (error) {
          console.log(`   - '${tableName}' (error checking: ${error.message})`);
        }
      }
    } else {
      console.log('   ✓ No unexpected tables found');
    }

    // Show summary
    console.log('\n📊 SUMMARY:');
    console.log(`✅ Required tables: ${requiredTables.length}`);
    console.log(`❓ Potentially unnecessary: ${potentiallyUnnecessaryTables.length}`);
    console.log(`🔍 Unexpected tables: ${unexpectedTables.length}`);

    await connection.end();
    console.log('\n✅ Database analysis complete!');

  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  }
}

// If you want to actually delete tables, uncomment this function
async function deleteUnnecessaryTables() {
  console.log('\n🗑️  DELETING UNNECESSARY TABLES...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Tables to delete (only if they exist and are empty/unnecessary)
    const tablesToDelete = [
      'admin_users',
      'students', 
      'views',
      'stored_procedures',
      'functions'
    ];

    for (const tableName of tablesToDelete) {
      try {
        // Check if table exists
        const [exists] = await connection.execute(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = ? AND table_name = ?
        `, [process.env.DB_NAME, tableName]);

        if (exists[0].count > 0) {
          console.log(`🗑️  Dropping table: ${tableName}`);
          await connection.execute(`DROP TABLE IF EXISTS ${tableName}`);
          console.log(`✅ Deleted: ${tableName}`);
        } else {
          console.log(`ℹ️  Table '${tableName}' doesn't exist`);
        }
      } catch (error) {
        console.error(`❌ Error deleting table '${tableName}':`, error.message);
      }
    }

    await connection.end();
    console.log('\n🎉 Cleanup complete!');

  } catch (error) {
    console.error('❌ Error during table deletion:', error);
  }
}

// Run analysis
cleanupDatabase();

// Uncomment the line below if you want to actually delete the tables
// deleteUnnecessaryTables();
