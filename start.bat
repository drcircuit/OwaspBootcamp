@echo off
echo ======================================
echo OWASP Bootcamp Workshop
echo ======================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [X] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Build and start containers
echo Building and starting containers...
echo This may take a few minutes on first run...
echo.

docker compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ======================================
    echo [OK] Workshop is ready!
    echo ======================================
    echo.
    echo Access the labs at:
    echo   Citadel Main App:  http://localhost:3000
    echo   Lab A01:           http://localhost:3001
    echo   Lab A02:           http://localhost:3002
    echo   Lab A03:           http://localhost:3003
    echo   Lab A04:           http://localhost:3004
    echo   Lab A05:           http://localhost:3005
    echo   Lab A06:           http://localhost:3006
    echo   Lab A07:           http://localhost:3007
    echo   Lab A08:           http://localhost:3008
    echo   Lab A09:           http://localhost:3009
    echo   Lab A10:           http://localhost:3010
    echo.
    echo To stop the workshop, run: stop.bat
    echo Or: docker compose down
    echo.
    echo View logs: docker compose logs -f
    echo.
) else (
    echo [X] Failed to start containers
    echo Check the error messages above
    pause
    exit /b 1
)

pause
