#!/bin/bash

echo "🚀 OpsMind AI - Quick Start Guide"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the OpsMind Ai root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check backend .env
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found"
    exit 1
fi
echo "✅ Backend .env found"

# Check frontend .env
if [ ! -f "frontend/.env.frontend" ]; then
    echo "❌ Error: frontend/.env.frontend not found"
    exit 1
fi
echo "✅ Frontend .env found"

echo ""
echo "📦 Checking dependencies..."
echo ""

# Check backend node_modules
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not installed. Installing..."
    cd backend && npm install && cd ..
else
    echo "✅ Backend dependencies installed"
fi

# Check frontend node_modules
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed. Installing..."
    cd frontend && npm install && cd ..
else
    echo "✅ Frontend dependencies installed"
fi

echo ""
echo "🎯 Ready to start!"
echo ""
echo "To run the application:"
echo ""
echo "1️⃣  Start Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2️⃣  Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  Open Browser:"
echo "   http://localhost:5173"
echo ""
echo "📝 Backend API: http://localhost:5002"
echo "🔐 Auth: Clerk (already configured)"
echo "💬 Chat: GROQ API (already configured)"
echo "🗄️  Database: MongoDB Atlas (already configured)"
echo ""
echo "✨ All upgrades completed!"
