# YugaYatra Backend API

A Node.js/Express backend API for the YugaYatra MBA application system with MySQL database integration.

## Features

- 🔐 JWT-based admin authentication
- 📝 Application form submission with file uploads
- 📊 Admin dashboard with statistics
- 🗃️ MySQL database with proper indexing
- ✅ Input validation with Joi
- 🛡️ Security middleware (helmet, rate limiting, CORS)
- 📁 File upload support for resumes (PDF, DOC, DOCX)
- 📈 Analytics and reporting endpoints
- 🔄 Database migrations

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd "C:\Users\ADITYA\Desktop\Yuga Yatra\MBA 2\backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   copy .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your MySQL database credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=yugayatra_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

5. **Create MySQL database**
   ```sql
   CREATE DATABASE yugayatra_db;
   ```

6. **Run database migrations**
   ```bash
   npm run migrate
   ```

7. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout  
- `GET /api/auth/me` - Get current admin info
- `POST /api/auth/refresh` - Refresh JWT token

### Applications
- `POST /api/applications` - Submit new application (with file upload)
- `GET /api/applications` - Get applications (with filters & pagination)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Delete application

### Admin Dashboard
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/applications/recent` - Recent applications
- `GET /api/admin/export` - Export applications (JSON/CSV)
- `PUT /api/admin/applications/:id/status` - Update status (admin)
- `DELETE /api/admin/applications/:id` - Delete application (admin)
- `GET /api/admin/applications/analytics` - Detailed analytics

### Health Check
- `GET /health` - Server health status

## Default Admin Credentials

- **Email**: `admin@yugayatra.com`
- **Password**: `admin123`

## Database Schema

### Applications Table
```sql
id (VARCHAR 36, PRIMARY KEY)
name (VARCHAR 255, NOT NULL)
email (VARCHAR 255, NOT NULL) 
phone (VARCHAR 20)
college (VARCHAR 255, NOT NULL)
specialization (VARCHAR 100, NOT NULL)
graduation_year (INT, NOT NULL)
cgpa (DECIMAL 3,2)
skills (TEXT)
experience (TEXT)
motivation (TEXT)
resume_url (VARCHAR 500)
ai_prediction (VARCHAR 255)
status (ENUM: pending, approved, rejected, shortlisted)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Admins Table  
```sql
id (INT, PRIMARY KEY, AUTO_INCREMENT)
email (VARCHAR 255, UNIQUE, NOT NULL)
password (VARCHAR 255, NOT NULL)
name (VARCHAR 255, NOT NULL)
role (ENUM: admin, super_admin)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Application Files Table
```sql
id (INT, PRIMARY KEY, AUTO_INCREMENT)
application_id (VARCHAR 36, FOREIGN KEY)
file_name (VARCHAR 255, NOT NULL)
file_path (VARCHAR 500, NOT NULL)
file_type (VARCHAR 50, NOT NULL)
file_size (INT, NOT NULL)
uploaded_at (TIMESTAMP)
```

## File Upload

- **Supported formats**: PDF, DOC, DOCX
- **Max file size**: 10MB
- **Storage location**: `./uploads/` directory
- **URL format**: `/uploads/filename`

## Security Features

- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File type validation

## Development Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run migrate     # Run database migrations
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `yugayatra_db` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiry | `24h` |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `INVALID_CREDENTIALS` | Login failed |
| `FILE_TOO_LARGE` | Upload size exceeded |
| `INVALID_FILE_TYPE` | Unsupported file format |

## Testing the API

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Test health endpoint**
   ```bash
   curl http://localhost:5000/health
   ```

3. **Login as admin**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@yugayatra.com", "password": "admin123"}'
   ```

4. **Submit an application**
   ```bash
   curl -X POST http://localhost:5000/api/applications \
     -F "name=John Doe" \
     -F "email=john@example.com" \
     -F "college=Harvard Business School" \
     -F "specialization=Finance" \
     -F "graduation_year=2024" \
     -F "cgpa=8.5" \
     -F "skills=Financial Modeling, Excel, SQL" \
     -F "experience=2 years of experience in investment banking..."
   ```

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set strong JWT secret
4. Use process manager (PM2)
5. Set up reverse proxy (nginx)
6. Configure SSL certificate

## Support

For issues or questions, please contact the YugaYatra development team.
