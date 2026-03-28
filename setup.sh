#!/bin/bash
# PathAI Phase 2 - Automated Setup Script
# Run this to set up everything automatically

echo "🚀 PathAI Phase 2 Backend Setup"
echo "=================================="

# Check if in correct directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: Run this script from project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production
cd ..
echo "✅ Dependencies installed"

# Create .env if not exists
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "⚠️  IMPORTANT: Configure your credentials"
    echo "Copy backend/.env.example to backend/.env and add:"
    echo "  - MONGODB_URI: Your MongoDB Atlas connection string"
    echo "  - JWT_SECRET: Random secret key (32 chars minimum)"
    echo "  - POE_API_KEY: Your POE API key"
    echo ""
    echo "Then run: npm start"
else
    echo "✅ .env file exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit backend/.env with your credentials"
echo "2. Run: cd backend && npm start"
echo "3. In another terminal: python -m http.server 3000"
echo "4. Open: http://localhost:3000/PathAI-Agent-Phase2.html"
