@echo off
REM PathAI Phase 2 - Windows Setup Batch File

echo 🚀 PathAI Phase 2 Backend Setup
echo ==================================

if not exist "backend\server.js" (
    echo ❌ Error: Run this from project root directory
    exit /b 1
)

echo ✅ Project structure verified

where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js not installed. Download from https://nodejs.org/
    exit /b 1
)

for /f %%i in ('node --version') do echo ✅ Node.js found: %%i

echo 📦 Installing backend dependencies...
cd backend
call npm install --production
cd ..
echo ✅ Dependencies installed

if not exist "backend\.env" (
    echo.
    echo ⚠️  IMPORTANT: Configure your credentials
    echo Copy backend\.env.example to backend\.env and add:
    echo   - MONGODB_URI: Your MongoDB Atlas connection string
    echo   - JWT_SECRET: Random secret key (32 chars minimum)
    echo   - POE_API_KEY: Your POE API key
    echo.
    echo Then run: cd backend && npm start
) else (
    echo ✅ .env file exists
)

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Edit backend\.env with your credentials
echo 2. Run: cd backend ^&^& npm start
echo 3. In another terminal: python -m http.server 3000
echo 4. Open browser: http://localhost:3000/PathAI-Agent-Phase2.html
echo.
pause
