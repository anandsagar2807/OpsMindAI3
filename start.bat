@echo off
echo 🚀 OpsMind AI - Quick Start Guide
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: backend folder not found
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Error: frontend folder not found
    exit /b 1
)

echo ✅ Project structure verified
echo.

REM Check backend .env
if not exist "backend\.env" (
    echo ❌ Error: backend\.env not found
    exit /b 1
)
echo ✅ Backend .env found

REM Check frontend .env
if not exist "frontend\.env.frontend" (
    echo ❌ Error: frontend\.env.frontend not found
    exit /b 1
)
echo ✅ Frontend .env found

echo.
echo 📦 Checking dependencies...
echo.

REM Check backend node_modules
if not exist "backend\node_modules" (
    echo ⚠️  Backend dependencies not installed. Installing...
    cd backend
    call npm install
    cd ..
) else (
    echo ✅ Backend dependencies installed
)

REM Check frontend node_modules
if not exist "frontend\node_modules" (
    echo ⚠️  Frontend dependencies not installed. Installing...
    cd frontend
    call npm install
    cd ..
) else (
    echo ✅ Frontend dependencies installed
)

echo.
echo 🎯 Ready to start!
echo.
echo To run the application:
echo.
echo 1️⃣  Start Backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 2️⃣  Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3️⃣  Open Browser:
echo    http://localhost:5173
echo.
echo 📝 Backend API: http://localhost:5002
echo 🔐 Auth: Clerk (already configured)
echo 💬 Chat: GROQ API (already configured)
echo 🗄️  Database: MongoDB Atlas (already configured)
echo.
echo ✨ All upgrades completed!
pause
