@echo off
echo ======================================
echo Stopping OWASP Bootcamp Workshop
echo ======================================
echo.

docker compose down

if %errorlevel% equ 0 (
    echo.
    echo [OK] All containers stopped
    echo.
    echo To remove all data as well, run:
    echo   docker compose down -v
    echo.
    echo To restart the workshop, run:
    echo   start.bat
    echo.
) else (
    echo [X] Failed to stop containers
    echo Try: docker compose down
    pause
    exit /b 1
)

pause
