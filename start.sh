#!/bin/bash
# Nash-Security License Store - Quick Start Script

clear
echo "=============================================="
echo "  🔐 Nash-Security License Store v1.0"
echo "=============================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[✗] Python3 not found!"
    echo "Install: sudo apt install python3 python3-pip"
    exit 1
fi
echo "[✓] $(python3 --version)"

# Check Node
if ! command -v node &> /dev/null; then
    echo "[✗] Node.js not found!"
    echo "Install: sudo apt install nodejs npm"
    exit 1
fi
echo "[✓] $(node --version)"

# Backend setup
echo ""
echo "[1/4] Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt -q 2>/dev/null
echo "[OK] Backend ready"

echo "[2/4] Setting up database..."
python3 manage.py migrate 2>/dev/null
python3 -c "
import os
os.environ['DJANGO_SETTINGS_MODULE']='store.settings'
import django; django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@site.com', 'admin12345')
    print('[OK] Admin created')
else:
    print('[OK] Admin exists')
" 2>/dev/null

# Frontend setup
echo "[3/4] Setting up frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install --silent 2>/dev/null
fi
echo "[OK] Frontend ready"

# Start servers
echo "[4/4] Starting servers..."
cd ../backend
python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=============================================="
echo "  ✅ Nash-Security License Store is LIVE!"
echo "=============================================="
echo ""
echo "  🌐 Dashboard:   http://localhost:5173"
echo "  🔧 Admin:       http://localhost:8000/admin/"
echo "  📝 Blog:        http://localhost:5173/blog"
echo "  🛒 Shop:        http://localhost:5173/shop"
echo ""
echo "  👤 Login: admin / admin12345"
echo ""
echo "  Press Ctrl+C to stop all servers"
echo "=============================================="
echo ""

# Wait for Ctrl+C
wait
