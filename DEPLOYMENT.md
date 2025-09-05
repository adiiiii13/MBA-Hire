# YugaYatra Deployment Guide

This guide will help you deploy the YugaYatra MBA application system with a hosted MySQL database.

## 🗄️ Database Setup

### Step 1: Update Database Configuration

1. **Navigate to the backend directory**:
   ```bash
   cd "C:\Users\ADITYA\Desktop\Yuga Yatra\MBA 2\backend"
   ```

2. **Run the setup script**:
   ```bash
   npm run setup
   ```

3. **Update `.env` file with your hosted database details**:
   ```env
   # Database Configuration (Update these with your hosted database details)
   DB_HOST=your-database-host.com
   DB_PORT=3306
   DB_NAME=yugayatra_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # If your database requires SSL (common for hosted databases)
   DB_SSL=true
   ```

### Step 2: Common Hosted Database Providers

#### For cPanel/Shared Hosting:
```env
DB_HOST=localhost  # or your server's hostname
DB_PORT=3306
DB_NAME=your_cpanel_username_yugayatra
DB_USER=your_cpanel_username_dbuser
DB_PASSWORD=your_database_password
```

#### For AWS RDS:
```env
DB_HOST=your-rds-instance.xyz.rds.amazonaws.com
DB_PORT=3306
DB_NAME=yugayatra_db
DB_USER=admin
DB_PASSWORD=your_password
```

#### For Google Cloud SQL:
```env
DB_HOST=your-instance-ip
DB_PORT=3306
DB_NAME=yugayatra_db
DB_USER=root
DB_PASSWORD=your_password
```

#### For DigitalOcean Managed Database:
```env
DB_HOST=your-cluster-name-do-user-xyz-0.db.ondigitalocean.com
DB_PORT=25060
DB_NAME=yugayatra_db
DB_USER=doadmin
DB_PASSWORD=your_password
```

## 🚀 Backend Deployment

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Test Database Connection
```bash
# This will test the connection and create tables
npm run migrate
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Build for Production
```bash
npm run build
npm start
```

## 🌐 Frontend Deployment

### Step 1: Update API Configuration
Create a `.env` file in the frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

For production, update with your backend URL:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Step 2: Install Dependencies and Start
```bash
cd "C:\Users\ADITYA\Desktop\Yuga Yatra\MBA 2"
npm install
npm run dev
```

## 🔧 Database Configuration Examples

### MySQL Workbench Connection
If you're using MySQL Workbench, your connection parameters would be:
- **Hostname**: `your-database-host`
- **Port**: `3306` (or your custom port)
- **Username**: `your-username`
- **Password**: `your-password`
- **Default Schema**: `yugayatra_db`

### Connection String Format
```
mysql://username:password@hostname:port/database_name
```

## 🛠️ Troubleshooting

### Common Database Connection Issues:

1. **"Access denied for user"**
   - Verify username and password are correct
   - Check if the user has proper permissions
   - Ensure the user can connect from your IP address

2. **"Unknown database"**
   - Create the database first: `CREATE DATABASE yugayatra_db;`
   - Verify the database name is correct

3. **"Connection timeout"**
   - Check if the hostname/IP is correct
   - Verify the port is correct
   - Check firewall settings

4. **SSL/TLS Issues**
   - Add `DB_SSL=true` to your .env file
   - Some providers require specific SSL certificates

### Testing Database Connection
```bash
# Test connection without running migrations
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ Database connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
"
```

## 📋 Deployment Checklist

### Backend:
- [ ] Database credentials updated in `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Database connection tested
- [ ] Migrations run successfully (`npm run migrate`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] API endpoints accessible (test `/health` endpoint)

### Frontend:
- [ ] Backend API URL configured
- [ ] Dependencies installed
- [ ] Application loads successfully
- [ ] Forms can submit to backend
- [ ] Admin login works
- [ ] File uploads work (if applicable)

### Database:
- [ ] Database created
- [ ] User has proper permissions
- [ ] Tables created (applications, admins, application_files)
- [ ] Default admin user created
- [ ] Indexes are in place

## 🔐 Security Considerations

1. **Change default admin password**
2. **Use strong JWT secret**
3. **Enable HTTPS in production**
4. **Use environment variables for sensitive data**
5. **Implement rate limiting**
6. **Regular database backups**

## 📞 Support

If you encounter issues:
1. Check the console/terminal for error messages
2. Verify all environment variables are set correctly
3. Test database connection separately
4. Check firewall and network settings
5. Review hosting provider documentation

## 🎯 Quick Start Commands

```bash
# Backend setup
cd backend
npm run setup
# Update .env with your database details
npm install
npm run migrate
npm run dev

# Frontend setup (in new terminal)
cd "C:\Users\ADITYA\Desktop\Yuga Yatra\MBA 2"
npm run dev
```

Your application should now be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

**Please share your database hosting details (hostname, port, username, etc.) so I can help you configure the connection properly!**
