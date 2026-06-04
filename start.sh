#!/bin/bash
echo "=========================================="
echo "  OpsMind AI - Enterprise SOP RAG Platform"
echo "=========================================="
echo ""

# Start backend
echo "Starting Backend Server..."
(cd backend && npm run dev) &
BACKEND_PID=$!

# Start frontend
echo "Starting Frontend Dev Server..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "  Backend:  http://localhost:5002"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
