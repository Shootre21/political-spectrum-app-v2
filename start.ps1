<#
.SYNOPSIS
    Political Spectrum App - Quick Start Script
.DESCRIPTION
    Starts the development server with health checks, error handling, and real-time monitoring.
.VERSION
    2.8.1
#>

param(
    [switch]$Prod,
    [switch]$Studio,
    [switch]$NoMonitor,
    [int]$Port = 3000
)

# ============================================
# CONFIGURATION
# ============================================
$Config = @{
    AppName = "Political Spectrum App"
    Version = "2.8.1"
}

# ============================================
# SERVER MANAGEMENT
# ============================================
$Script:ServerProcess = $null
$Script:ServerLogPath = ".\server.log"

function Write-Header {
    param([string]$Title)
    
    $width = 60
    $padding = [Math]::Max(0, ($width - $Title.Length) / 2)
    
    Write-Host ""
    Write-Host ("=" * $width) -ForegroundColor DarkCyan
    Write-Host (" " * [Math]::Floor($padding) + $Title) -ForegroundColor Cyan
    Write-Host ("=" * $width) -ForegroundColor DarkCyan
    Write-Host ""
}

function Start-DevServer {
    param([switch]$WithMonitor)
    
    Write-Header "Starting Development Server"
    
    # Check if port is already in use
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host ""
        Write-Host "  [!] Port $Port is already in use!" -ForegroundColor Yellow
        Write-Host "  Attempting to stop existing process..." -ForegroundColor Yellow
        
        try {
            $existingProcess = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
            if ($existingProcess) {
                Stop-Process -Id $existingProcess.Id -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
                Write-Host "  [OK] Stopped existing process" -ForegroundColor Green
            }
        } catch {
            Write-Host "  [WARN] Could not stop existing process" -ForegroundColor Yellow
        }
    }
    
    # Clear old server log
    if (Test-Path $Script:ServerLogPath) {
        Remove-Item $Script:ServerLogPath -Force -ErrorAction SilentlyContinue
    }
    
    # Determine command
    $startCmd = if (Test-CommandExists "bun") {
        "bun run dev"
    } else {
        "npm run dev"
    }
    
    Write-Host ""
    Write-Host "  Starting: $startCmd" -ForegroundColor Cyan
    Write-Host "  Port: $Port" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    
    # Start the server process
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = if (Test-CommandExists "bun") { "bun" } else { "npm" }
    $psi.Arguments = "run dev"
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.WorkingDirectory = $PWD
    $psi.CreateNoWindow = $true
    
    $Script:ServerProcess = New-Object System.Diagnostics.Process
    $Script:ServerProcess.StartInfo = $psi
    
    # Register cleanup on exit
    [Console]::TreatControlCAsInput = $false
    [Console]::CancelKeyPress.Add_Handler({
        param($sender, $e)
        $e.Cancel = $true
        Stop-DevServer
        exit 0
    }.GetNewClosure())
    
    # Also register for PowerShell engine shutdown
    Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
        Stop-DevServer
    } -ErrorAction SilentlyContinue
    
    try {
        $null = $Script:ServerProcess.Start()
        Write-Host "  [OK] Server started (PID: $($Script:ServerProcess.Id))" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] Failed to start server: $_" -ForegroundColor Red
        return $false
    }
    
    Write-Host ""
    Write-Host "  ============================================================" -ForegroundColor DarkCyan
    Write-Host "  SERVER RUNNING - Real-time logs below" -ForegroundColor Cyan
    Write-Host "  ============================================================" -ForegroundColor DarkCyan
    Write-Host ""
    
    if ($WithMonitor) {
        Start-ServerMonitor
    }
    
    return $true
}

function Stop-DevServer {
    if ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        Write-Host ""
        Write-Host "  Stopping server..." -ForegroundColor Yellow
        
        try {
            $Script:ServerProcess.Kill()
            $Script:ServerProcess.WaitForExit(5000)
            Write-Host "  [OK] Server stopped" -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] Could not gracefully stop server" -ForegroundColor Yellow
        }
    }
}

function Start-ServerMonitor {
    $startTime = Get-Date
    $requestCount = 0
    $errorCount = 0
    $statusInterval = 30
    
    $statusTimer = [System.Diagnostics.Stopwatch]::StartNew()
    
    while ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        # Read standard output
        while (-not $Script:ServerProcess.StandardOutput.EndOfStream) {
            $line = $Script:ServerProcess.StandardOutput.ReadLine()
            if ($line) {
                $timestamp = Get-Date -Format "HH:mm:ss"
                
                # Color code different log types
                if ($line -match "error|Error|ERROR|failed|Failed") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Red
                    $errorCount++
                } elseif ($line -match "warn|Warn|WARN") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Yellow
                } elseif ($line -match "ready|Ready|compiled|Compiled|started|Started") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Green
                } elseif ($line -match "GET|POST|PUT|DELETE|PATCH") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Cyan
                    $requestCount++
                } elseif ($line -match "localhost:$Port|http://") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Green
                } else {
                    Write-Host "  [$timestamp] $line" -ForegroundColor Gray
                }
                
                Add-Content -Path $Script:ServerLogPath -Value "[$timestamp] $line" -ErrorAction SilentlyContinue
            }
        }
        
        # Read error output
        while (-not $Script:ServerProcess.StandardError.EndOfStream) {
            $line = $Script:ServerProcess.StandardError.ReadLine()
            if ($line) {
                $timestamp = Get-Date -Format "HH:mm:ss"
                Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                Write-Host $line -ForegroundColor Red
                $errorCount++
                Add-Content -Path $Script:ServerLogPath -Value "[$timestamp] [ERROR] $line" -ErrorAction SilentlyContinue
            }
        }
        
        # Show periodic status
        if ($statusTimer.Elapsed.TotalSeconds -ge $statusInterval) {
            $statusTimer.Restart()
            Show-ServerStatus -RequestCount $requestCount -ErrorCount $errorCount -StartTime $startTime
        }
        
        Start-Sleep -Milliseconds 100
    }
    
    # Process exited
    if ($Script:ServerProcess.HasExited) {
        Write-Host ""
        Write-Host "  ============================================================" -ForegroundColor Red
        Write-Host "  SERVER STOPPED" -ForegroundColor Red
        Write-Host "  Exit Code: $($Script:ServerProcess.ExitCode)" -ForegroundColor Yellow
        Write-Host "  ============================================================" -ForegroundColor Red
        
        $uptime = ((Get-Date) - $startTime).ToString("hh\:mm\:ss")
        Write-Host ""
        Write-Host "  Session Statistics:" -ForegroundColor Cyan
        Write-Host "  - Uptime: $uptime" -ForegroundColor Gray
        Write-Host "  - Total Requests: $requestCount" -ForegroundColor Gray
        Write-Host "  - Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
        Write-Host "  - Log file: $Script:ServerLogPath" -ForegroundColor Gray
    }
}

function Show-ServerStatus {
    param(
        [int]$RequestCount,
        [int]$ErrorCount,
        [datetime]$StartTime
    )
    
    $uptime = ((Get-Date) - $StartTime).ToString("hh\:mm\:ss")
    
    $portStatus = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    $connections = ($portStatus | Measure-Object).Count
    
    $memoryStr = if ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        try {
            $proc = Get-Process -Id $Script:ServerProcess.Id -ErrorAction SilentlyContinue
            if ($proc) {
                "{0:N0} MB" -f ($proc.WorkingSet64 / 1MB)
            } else { "N/A" }
        } catch { "N/A" }
    } else { "N/A" }
    
    Write-Host ""
    Write-Host "  +------------------------------------------------------------+" -ForegroundColor DarkGray
    Write-Host "  | " -NoNewline -ForegroundColor DarkGray
    Write-Host "SERVER STATUS" -NoNewline -ForegroundColor Cyan
    Write-Host "                                              |" -ForegroundColor DarkGray
    Write-Host "  +------------------------------------------------------------+" -ForegroundColor DarkGray
    Write-Host "  | " -NoNewline -ForegroundColor DarkGray
    Write-Host "URL: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:$Port" -NoNewline -ForegroundColor Green
    if ($Port -eq 3000) {
        Write-Host "                          |" -ForegroundColor DarkGray
    } else {
        Write-Host "                        |" -ForegroundColor DarkGray
    }
    Write-Host "  | " -NoNewline -ForegroundColor DarkGray
    Write-Host "Uptime: " -NoNewline -ForegroundColor White
    Write-Host "$uptime".PadRight(8) -NoNewline -ForegroundColor Cyan
    Write-Host "  Memory: " -NoNewline -ForegroundColor White
    Write-Host "$memoryStr".PadLeft(10) -NoNewline -ForegroundColor Yellow
    Write-Host "       |" -ForegroundColor DarkGray
    Write-Host "  | " -NoNewline -ForegroundColor DarkGray
    Write-Host "Active Connections: " -NoNewline -ForegroundColor White
    Write-Host "$connections".PadLeft(2) -NoNewline -ForegroundColor Green
    Write-Host "   Total Requests: " -NoNewline -ForegroundColor White
    Write-Host "$requestCount".PadLeft(5) -NoNewline -ForegroundColor Cyan
    Write-Host "   |" -ForegroundColor DarkGray
    Write-Host "  | " -NoNewline -ForegroundColor DarkGray
    Write-Host "Errors: " -NoNewline -ForegroundColor White
    $errorColor = if ($ErrorCount -gt 0) { "Red" } else { "Green" }
    Write-Host "$ErrorCount".PadLeft(3) -NoNewline -ForegroundColor $errorColor
    Write-Host "                                                  |" -ForegroundColor DarkGray
    Write-Host "  +------------------------------------------------------------+" -ForegroundColor DarkGray
    Write-Host ""
}

function Test-CommandExists {
    param([string]$Command)
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# ============================================
# MAIN
# ============================================
Write-Header "$($Config.AppName) v$($Config.Version)"

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "  Dependencies not found. Running setup..." -ForegroundColor Yellow
    Write-Host ""
    .\setup.ps1
    exit
}

# Check if database exists
if (-not (Test-Path "prisma\dev.db")) {
    Write-Host "  Database not found. Setting up database..." -ForegroundColor Yellow
    npx prisma migrate dev --name init 2>&1 | Out-Null
    Write-Host "  [OK] Database created" -ForegroundColor Green
}

# Start Prisma Studio if requested
if ($Studio) {
    Write-Host "  Starting Prisma Studio on port 5555..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx prisma studio"
}

# Start the app
if ($Prod) {
    Write-Host "  Starting production server..." -ForegroundColor Green
    
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = if (Test-CommandExists "bun") { "bun" } else { "npm" }
    $psi.Arguments = "run start"
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.WorkingDirectory = $PWD
    $psi.CreateNoWindow = $true
    
    $Script:ServerProcess = New-Object System.Diagnostics.Process
    $Script:ServerProcess.StartInfo = $psi
    
    $null = $Script:ServerProcess.Start()
    Start-ServerMonitor
} else {
    Start-DevServer -WithMonitor
}
