const mysql = require('mysql2/promise');
require('dotenv').config();

async function safeCleanup() {
  console.log('🧹 Safe Database Cleanup - YugaYatra MBA Application');
  console.log('=====================================================\n');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database\n');

    // 1. Check admin_users vs admins
    console.log('👤 Checking admin_users vs admins...');
    
    try {
      const [adminUsers] = await connection.execute('SELECT * FROM admin_users');
      const [admins] = await connection.execute('SELECT * FROM admins');
      
      console.log(`   admin_users: ${adminUsers.length} rows`);
      console.log(`   admins: ${admins.length} rows`);
      
      if (adminUsers.length > 0) {
        console.log('   📊 admin_users data:');
        adminUsers.forEach((user, index) => {
          console.log(`      ${index + 1}. Email: ${user.email || 'N/A'}, Name: ${user.name || 'N/A'}`);
        });
      }
      
      if (admins.length > 0) {
        console.log('   📊 admins data:');
        admins.forEach((admin, index) => {
          console.log(`      ${index + 1}. Email: ${admin.email || 'N/A'}, Name: ${admin.name || 'N/A'}`);
        });
      }

      // Check if admin data exists in both tables
      let canDeleteAdminUsers = true;
      if (admins.length === 0) {
        console.log('   ⚠️  admins table is empty - should migrate data first');
        canDeleteAdminUsers = false;
      }

      console.log(`   🗑️  admin_users can be deleted: ${canDeleteAdminUsers ? 'YES' : 'NO'}\n`);
      
    } catch (error) {
      console.log(`   ❌ Error checking admin tables: ${error.message}\n`);
    }

    // 2. Check students vs applications
    console.log('🎓 Checking students vs applications...');
    
    try {
      const [students] = await connection.execute('SELECT * FROM students LIMIT 5');
      const [applications] = await connection.execute('SELECT * FROM applications LIMIT 5');
      
      console.log(`   students: ${students.length} rows (showing first 5)`);
      console.log(`   applications: ${applications.length} rows (showing first 5)`);
      
      if (students.length > 0) {
        console.log('   📊 students sample data:');
        students.forEach((student, index) => {
          console.log(`      ${index + 1}. Name: ${student.name || 'N/A'}, Email: ${student.email || 'N/A'}`);
        });
      }
      
      if (applications.length > 0) {
        console.log('   📊 applications sample data:');
        applications.forEach((app, index) => {
          console.log(`      ${index + 1}. Name: ${app.name || 'N/A'}, Email: ${app.email || 'N/A'}`);
        });
      }

      // Check if application data exists
      let canDeleteStudents = true;
      if (applications.length === 0) {
        console.log('   ⚠️  applications table is empty - should migrate data first');
        canDeleteStudents = false;
      }

      console.log(`   🗑️  students can be deleted: ${canDeleteStudents ? 'YES' : 'NO'}\n`);
      
    } catch (error) {
      console.log(`   ❌ Error checking student tables: ${error.message}\n`);
    }

    await connection.end();
    console.log('✅ Analysis complete!\n');

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

async function performCleanup() {
  console.log('🗑️  PERFORMING SAFE CLEANUP...\n');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Check if we have proper data in main tables
    const [admins] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    const [applications] = await connection.execute('SELECT COUNT(*) as count FROM applications');

    console.log(`Current data:`);
    console.log(`   - admins: ${admins[0].count} rows`);
    console.log(`   - applications: ${applications[0].count} rows\n`);

    if (admins[0].count > 0) {
      console.log('🗑️  Dropping admin_users table...');
      await connection.execute('DROP TABLE IF EXISTS admin_users');
      console.log('✅ admin_users table deleted');
    } else {
      console.log('⚠️  Skipping admin_users deletion - no data in admins table');
    }

    if (applications[0].count > 0) {
      console.log('🗑️  Dropping students table...');
      await connection.execute('DROP TABLE IF EXISTS students');
      console.log('✅ students table deleted');
    } else {
      console.log('⚠️  Skipping students deletion - no data in applications table');
    }

    // Show final table list
    console.log('\n📋 Final table list:');
    const [tables] = await connection.execute("SHOW TABLES");
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   ✅ ${tableName}`);
    });

    await connection.end();
    console.log('\n🎉 Database cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run analysis first
safeCleanup().then(() => {
  console.log('🤔 Do you want to proceed with cleanup?');
  console.log('If yes, uncomment the line at the end of this script and run again.\n');
});

// Uncomment the line below to actually perform the cleanup
performCleanup();
