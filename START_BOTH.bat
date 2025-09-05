@echo off
echo 🚀 Starting YugaYatra MBA Application System
echo.
echo ✅ Backend: Connected to MySQL Database
echo ✅ Frontend: React Application
echo.

REM Start backend in a new window
echo 🔧 Starting Backend Server...
start "YugaYatra Backend" cmd /k "cd /d backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo 🌐 Starting Frontend Application...
echo.
echo 📍 Your application will open at: http://localhost:5174
echo 👤 Admin Login: admin@yugayatra.com / admin123
echo.
npm run dev

pause
