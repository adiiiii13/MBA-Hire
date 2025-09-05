import { pool, testConnection } from '../config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  try {
    // Create admins table
    const createAdminsTable = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Create applications table
    const createApplicationsTable = `
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        college VARCHAR(255) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        graduation_year INT NOT NULL,
        cgpa DECIMAL(3,2),
        skills TEXT,
        experience TEXT,
        motivation TEXT,
        resume_url VARCHAR(500),
        ai_prediction VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected', 'shortlisted') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_specialization (specialization),
        INDEX idx_created_at (created_at)
      )
    `;

    // Create application_files table for file uploads
    const createApplicationFilesTable = `
      CREATE TABLE IF NOT EXISTS application_files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        application_id VARCHAR(36) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
      )
    `;

    console.log('🔧 Creating database tables...');

    await pool.execute(createAdminsTable);
    console.log('✅ Admins table created/verified');

    await pool.execute(createApplicationsTable);
    console.log('✅ Applications table created/verified');

    await pool.execute(createApplicationFilesTable);
    console.log('✅ Application files table created/verified');

    // Create default admin user
    await createDefaultAdmin();

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yugayatra.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM admins WHERE email = ?',
      [adminEmail]
    );

    if ((existingAdmin as any[]).length > 0) {
      console.log('ℹ️  Default admin already exists');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Insert default admin
    await pool.execute(
      'INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)',
      [adminEmail, hashedPassword, 'System Administrator', 'super_admin']
    );

    console.log('✅ Default admin created');
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Starting database migration...');
      
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database. Please check your configuration.');
        process.exit(1);
      }

      await createTables();
      process.exit(0);
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  })();
}

export { createTables, createDefaultAdmin };
