@echo off
echo Testing Backend Connection...
echo.

curl -s http://127.0.0.1:5000/health
echo.
echo.

curl -s http://localhost:5000/health
echo.
echo.

echo If you see JSON responses above, the backend is working.
echo If you see errors, the backend is not accessible.
echo.
pause
