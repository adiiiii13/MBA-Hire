const fs = require('fs');
const path = require('path');

console.log('🚀 YugaYatra Backend Setup Script');
console.log('==================================\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create a basic .env file
    const defaultEnv = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yugayatra_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex_${Math.random().toString(36).substring(2, 15)}
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Admin Configuration
ADMIN_EMAIL=admin@yugayatra.com
ADMIN_PASSWORD=admin123

# CORS Configuration
FRONTEND_URL=http://localhost:5173
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Created .env file with default values');
  }
} else {
  console.log('ℹ️  .env file already exists');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('ℹ️  Uploads directory already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Update your .env file with the correct database credentials');
console.log('2. Make sure your MySQL database is running');
console.log('3. Run: npm install');
console.log('4. Run: npm run migrate');
console.log('5. Run: npm run dev');

console.log('\n🔧 Environment Configuration:');
console.log(`📁 Environment file: ${envPath}`);
console.log(`📁 Uploads directory: ${uploadsPath}`);

console.log('\n🌐 Default URLs:');
console.log('🖥️  Backend API: http://localhost:5000');
console.log('🌍 Frontend: http://localhost:5173');
console.log('❤️  Health Check: http://localhost:5000/health');

console.log('\n👤 Default Admin Credentials:');
console.log('📧 Email: admin@yugayatra.com');
console.log('🔑 Password: admin123');

console.log('\n⚠️  IMPORTANT: Update your database credentials in the .env file!');
