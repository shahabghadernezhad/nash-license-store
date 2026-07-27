@echo off
title Nash-Security License Store 🚀
cd /d "%~dp0"
cls

echo ==============================================
echo   🔐 Nash-Security License Store v1.0
echo   ==============================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] Python not installed!
    echo Download from: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)
for /f "delims=" %%i in ('python --version 2^>^&1') do echo [✓] %%i

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] Node.js not installed!
    echo Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f "delims=" %%i in ('node --version 2^>^&1') do echo [✓] %%i

echo.
echo [1/4] Installing Python packages...
cd backend
pip install -r requirements.txt -q -q
echo [OK] Backend dependencies ready

echo [2/4] Setting up database...
python manage.py migrate 2>nul
python manage.py createsuperuser --username admin --email admin@site.com --noinput 2>nul

:: Set default password
python -c "
import os
os.environ['DJANGO_SETTINGS_MODULE']='store.settings'
import django; django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@site.com', 'admin12345')
    print('[OK] Admin user created')
else:
    print('[OK] Admin user already exists')
" 2>nul
echo [OK] Database ready

echo [3/4] Starting backend server...
start "Nash-Backend" /min cmd /c "title Nash-Backend && cd /d %~dp0backend && python manage.py runserver 0.0.0.0:8000"

echo [4/4] Starting frontend...
cd ../frontend
if not exist "node_modules" (
    echo Installing Node packages (first time only)...
    call npm install --silent
)
start "Nash-Frontend" /min cmd /c "title Nash-Frontend && cd /d %~dp0frontend && npm run dev"

cd /d "%~dp0"
echo [OK] Frontend starting...

echo.
echo ==============================================
echo   ✅ Nash-Security License Store is LIVE!
echo   ==============================================
echo.
echo   🌐 Dashboard:   http://localhost:5173
echo   🔧 Admin Panel:  http://localhost:8000/admin/
echo   📝 Blog:         http://localhost:5173/blog
echo   🛒 Shop:         http://localhost:5173/shop
echo.
echo   👤 Login: admin / admin12345
echo.
echo   Stop:  close the windows or run stop.bat
echo ==============================================
echo.

start http://localhost:5173
