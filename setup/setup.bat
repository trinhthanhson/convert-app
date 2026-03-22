@echo off
echo ============================================
echo  Thien Mong PDF Converter - Setup
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is NOT installed!
    echo.
    echo Please install Python 3.8 or higher from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo [OK] Python is installed
python --version
echo.

REM Install required Python packages
echo Installing required Python packages...
pip install -r requirements.txt

if errorlevel 1 (
    echo ERROR: Failed to install Python packages!
    pause
    exit /b 1
)

echo.
echo ============================================
echo [OK] Setup completed successfully!
echo [OK] You can now run ThienMongConvert.exe
echo ============================================
echo.
pause
