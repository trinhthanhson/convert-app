@echo off
setlocal enabledelayedexpansion

echo ============================================
echo  Package Creator for Distribution
echo ============================================
echo.

REM Check if executable exists
if not exist "build\bin\ThienMongConvert.exe" (
    echo ERROR: build\bin\ThienMongConvert.exe not found!
    echo Please run: wails build -nsis
    pause
    exit /b 1
)

echo Preparing distribution package...
echo.

REM Create distribution folder
set DIST_FOLDER=dist_package
if exist %DIST_FOLDER% (
    echo Removing old distribution folder...
    rmdir /s /q %DIST_FOLDER%
)

mkdir %DIST_FOLDER%
cd %DIST_FOLDER%

REM Create version subfolder
set VERSION_FOLDER=ThienMongPDF-v2.0
mkdir %VERSION_FOLDER%
cd %VERSION_FOLDER%

REM Copy files
echo Copying executable...
copy "..\..\build\bin\ThienMongConvert.exe" .

echo Copying requirements...
copy "..\..\requirements.txt" .

echo Copying setup scripts...
copy "..\..\setup.bat" .
copy "..\..\setup-silent.vbs" .
copy "..\..\install-full.ps1" .

echo Copying guides...
copy "..\..\QUICK_START.md" .
copy "..\..\INSTALL.md" .
if exist "..\..\README.md" copy "..\..\README.md" .

REM Optional: Copy Poppler
echo.
set INCLUDE_POPPLER=y
if /i "%INCLUDE_POPPLER%"=="y" (
    echo Copying Poppler (this may take a minute)...
    mkdir temp
    xcopy "..\..\temp\poppler-23.11.0" "temp\poppler-23.11.0\" /E /I /Y >nul
)

cd ..\..

echo.
echo ============================================
echo [OK] Package created: %DIST_FOLDER%\%VERSION_FOLDER%
echo ============================================
echo.
echo Files ready to distribute:
echo  ✓ ThienMongConvert.exe
echo  ✓ setup.bat (for auto installation)
echo  ✓ setup-silent.vbs (silent mode)
echo  ✓ install-full.ps1 (PowerShell script)
echo  ✓ requirements.txt
echo  ✓ QUICK_START.md (instructions)
echo  ✓ INSTALL.md (detailed guide)
echo.
echo Next steps:
echo 1. Open folder: %DIST_FOLDER%\%VERSION_FOLDER%
echo 2. Zip the folder: ThienMongPDF-v2.0.zip
echo 3. Send to users
echo.
start %DIST_FOLDER%

pause
