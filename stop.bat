@echo off
echo ============================================
echo   Stopping Nash-Security servers...
echo ============================================
taskkill /F /FI "WINDOWTITLE eq Nash-Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Nash-Frontend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq node*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq python*" >nul 2>&1
echo.
echo [OK] All servers stopped!
echo.
timeout /t 3 >nul
