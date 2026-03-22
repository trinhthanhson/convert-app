# ============================================
# Thiên Mộng PDF - Full Auto Installation
# ============================================
# Script này sẽ:
# 1. Cài Python (nếu chưa có)
# 2. Cài Python packages
# 3. Chạy ứng dụng

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Write-Host "======================================"
Write-Host "Thiên Mộng PDF - Auto Setup"
Write-Host "======================================"
Write-Host ""

# ============================================
# Bước 1: Kiểm tra Python
# ============================================

Write-Host "[1/3] Checking Python installation..."
$pythonExists = $false
$pythonPath = ""

try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Python found: $pythonVersion" -ForegroundColor Green
        $pythonExists = $true
        $pythonPath = (Get-Command python).Source
        $pythonPath | Out-File -FilePath "python_path.txt" -Encoding UTF8
        Write-Host "[OK] Python path saved: $pythonPath" -ForegroundColor Green
    }
}
catch {
    Write-Host "[INFO] Python not found in PATH" -ForegroundColor Yellow
}

# Nếu không tìm thấy Python, try cài
if (-not $pythonExists) {
    Write-Host "[!] Python is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Do you want to install Python 3.11? (y/n)"
    $response = Read-Host
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "[*] Downloading Python 3.11..."
        
        # Download Python installer
        $pythonInstallerUrl = "https://www.python.org/ftp/python/3.11.8/python-3.11.8-amd64.exe"
        $pythonInstallerPath = "$env:TEMP\python-installer.exe"
        
        try {
            (New-Object System.Net.WebClient).DownloadFile($pythonInstallerUrl, $pythonInstallerPath)
            Write-Host "[OK] Python downloaded" -ForegroundColor Green
            
            Write-Host "[*] Installing Python (please wait)..."
            # Cài Python với flags: PrependPath=1 (add to PATH)
            & $pythonInstallerPath /quiet PrependPath=1 InstallAllUsers=0 DefaultJustForMeRegistry=1
            
            Write-Host "[OK] Python installed" -ForegroundColor Green
            
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            # Kiểm tra lại
            Start-Sleep -Seconds 2
            $pythonVersion = python --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Python verified: $pythonVersion" -ForegroundColor Green
                $pythonExists = $true
                $pythonPath = (Get-Command python).Source
                $pythonPath | Out-File -FilePath "python_path.txt" -Encoding UTF8
                Write-Host "[OK] Python path saved: $pythonPath" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "[ERROR] Failed to download/install Python: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "Manual installation required:"
            Write-Host "1. Go to: https://www.python.org/downloads/"
            Write-Host "2. Download Python 3.11"
            Write-Host "3. Run installer and CHECK 'Add Python to PATH'"
            Write-Host "4. Restart this script"
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
    else {
        Write-Host "[ERROR] Python is required to run this application" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# ============================================
# Bước 2: Cài Python Packages
# ============================================

Write-Host ""
Write-Host "[2/3] Installing Python packages..."

$requirementsFile = Join-Path (Get-Location) "requirements.txt"

if (-not (Test-Path $requirementsFile)) {
    Write-Host "[ERROR] requirements.txt not found!" -ForegroundColor Red
    Write-Host "Please ensure requirements.txt exists in: $(Get-Location)"
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    Write-Host "[*] Running: pip install -r requirements.txt"
    pip install -r $requirementsFile -q
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Python packages installed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Failed to install packages" -ForegroundColor Red
        Write-Host "Trying with upgrade..."
        pip install --upgrade -r $requirementsFile -q
    }
}
catch {
    Write-Host "[ERROR] Installation failed: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# ============================================
# Bước 3: Chạy ứng dụng
# ============================================

Write-Host ""
Write-Host "[3/3] Launching application..."

$appPath = Join-Path (Get-Location) "ThienMongConvert.exe"

if (-not (Test-Path $appPath)) {
    Write-Host "[ERROR] ThienMongConvert.exe not found!" -ForegroundColor Red
    Write-Host "Expected path: $appPath"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Starting application..." -ForegroundColor Green
Write-Host ""

# Chạy ứng dụng trong background
Start-Process -FilePath $appPath

Write-Host "======================================"
Write-Host "Setup completed successfully!"
Write-Host "Application is now running..."
Write-Host "======================================"
Write-Host ""
Write-Host "This window will close in 5 seconds..."

Start-Sleep -Seconds 5
