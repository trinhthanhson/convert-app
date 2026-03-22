@echo off
setlocal enabledelayedexpansion

echo ============================================
echo  Thien Mong PDF - Full Setup
echo ============================================
echo.

REM Check PowerShell is available
powershell -Command "Write-Host 'ok'" >nul 2>&1
if errorlevel 1 (
    echo ERROR: PowerShell not found!
    pause
    exit /b 1
)

REM Run PowerShell script
echo [*] Starting installation script...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-full.ps1"

if errorlevel 1 (
    echo.
    echo [ERROR] Setup failed!
    pause
    exit /b 1
)

exit /b 0
