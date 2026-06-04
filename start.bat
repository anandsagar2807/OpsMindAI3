@echo off
echo ==========================================
echo   OpsMind AI - Enterprise SOP RAG Platform
echo ==========================================
echo.

echo Starting Backend Server...
start "OpsMind Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Starting Frontend Dev Server...
start "OpsMind Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting...
echo   Backend:  http://localhost:5002
echo   Frontend: http://localhost:3000
echo.
echo Press any key to close this window (servers will keep running)...
pause >nul


