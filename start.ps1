<#
.SYNOPSIS
    Political Spectrum App - Quick Start Script
.DESCRIPTION
    Starts the development server with health checks, error handling, real-time monitoring,
    and automatic git update detection.
.VERSION
    2.9.1
#>

param(
    [switch]$Prod,
    [switch]$Studio,
    [switch]$NoMonitor,
    [switch]$NoAutoUpdate,    # Disable auto-update checking
    [int]$Port = 3000,
    [int]$UpdateInterval = 10  # Check for updates every X seconds
)

# ============================================
# CONFIGURATION
# ============================================
$Config = @{
    AppName = "Political Spectrum App"
    Version = "2.9.1"
    GitRepo = "https://github.com/Shootre21/political-spectrum-app-v2"
}

# ============================================
# GLOBAL STATE
# ============================================
$Script:ServerProcess = $null
$Script:ServerLogPath = ".\server.log"
$Script:LastCommitHash = $null
$Script:UpdateAvailable = $false
$Script:Restarting = $false

# ============================================
# UTILITY FUNCTIONS
# ============================================
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

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $prefix = switch ($Level) {
        "UPDATE" { "[UPDATE]" }
        "ERROR" { "[ERROR]" }
        "WARN" { "[WARN]" }
        "SUCCESS" { "[OK]" }
        default { "[INFO]" }
    }
    
    $color = switch ($Level) {
        "UPDATE" { "Magenta" }
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "Gray" }
    }
    
    Write-Host "  [$timestamp] $prefix $Message" -ForegroundColor $color
}

function Test-CommandExists {
    param([string]$Command)
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# ============================================
# GIT UPDATE SYSTEM
# ============================================
function Get-GitCurrentBranch {
    try {
        # Check if we're in a git repo first
        $inRepo = git rev-parse --is-inside-work-tree 2>$null
        if ($inRepo -ne "true") {
            return $null
        }
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
        if ($branch) {
            return $branch.Trim()
        }
        return $null
    } catch {
        return $null
    }
}

function Get-GitLocalHash {
    try {
        # Check if we're in a git repo first
        $inRepo = git rev-parse --is-inside-work-tree 2>$null
        if ($inRepo -ne "true") {
            return $null
        }
        $hash = git rev-parse HEAD 2>$null
        if ($hash) {
            return $hash.Trim()
        }
        return $null
    } catch {
        return $null
    }
}

function Get-GitRemoteHash {
    param([string]$Branch = "master")
    
    try {
        # Check if we're in a git repo first
        $inRepo = git rev-parse --is-inside-work-tree 2>$null
        if ($inRepo -ne "true") {
            return $null
        }
        
        # Fetch latest from remote (quietly)
        git fetch origin $Branch 2>$null | Out-Null
        
        # Get remote HEAD hash
        $hash = git rev-parse "origin/$Branch" 2>$null
        if ($hash) {
            return $hash.Trim()
        }
        return $null
    } catch {
        return $null
    }
}

function Test-GitUpdates {
    $branch = Get-GitCurrentBranch
    if (-not $branch) {
        return @{
            HasUpdates = $false
            LocalHash = $null
            RemoteHash = $null
            Branch = $null
        }
    }
    
    $localHash = Get-GitLocalHash
    $remoteHash = Get-GitRemoteHash -Branch $branch
    
    if ($localHash -and $remoteHash -and $localHash -ne $remoteHash) {
        return @{
            HasUpdates = $true
            LocalHash = $localHash
            RemoteHash = $remoteHash
            Branch = $branch
        }
    }
    
    return @{
        HasUpdates = $false
        LocalHash = $localHash
        RemoteHash = $remoteHash
        Branch = $branch
    }
}

function Invoke-GitPull {
    param([string]$Branch = "master")
    
    Write-Log "Pulling latest changes from origin/$Branch..." -Level "UPDATE"
    
    try {
        # Stash any local changes
        $stashResult = git stash 2>&1
        $hasStash = $stashResult -notmatch "No local changes"
        
        # Pull changes
        $pullResult = git pull origin $Branch 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Successfully pulled updates!" -Level "SUCCESS"
            
            # Restore stashed changes if any
            if ($hasStash) {
                git stash pop 2>&1 | Out-Null
            }
            
            return $true
        } else {
            Write-Log "Pull failed: $pullResult" -Level "ERROR"
            
            # Restore stashed changes on failure
            if ($hasStash) {
                git stash pop 2>&1 | Out-Null
            }
            
            return $false
        }
    } catch {
        Write-Log "Git pull error: $_" -Level "ERROR"
        return $false
    }
}

function Invoke-AutoUpdate {
    param(
        [bool]$RestartServer = $true,
        [ref]$RequestCount,
        [ref]$ErrorCount
    )
    
    Write-Host ""
    Write-Host "  ============================================================" -ForegroundColor Magenta
    Write-Host "  GIT UPDATE DETECTED!" -ForegroundColor Magenta
    Write-Host "  ============================================================" -ForegroundColor Magenta
    Write-Host ""
    
    $branch = Get-GitCurrentBranch
    $updateInfo = Test-GitUpdates
    
    if ($updateInfo.HasUpdates) {
        Write-Log "Local:  $($updateInfo.LocalHash.Substring(0,7))" -Level "UPDATE"
        Write-Log "Remote: $($updateInfo.RemoteHash.Substring(0,7))" -Level "UPDATE"
        
        # Stop server
        if ($RestartServer -and $Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
            Write-Log "Stopping server for update..." -Level "UPDATE"
            Stop-DevServer
        }
        
        # Pull changes
        $success = Invoke-GitPull -Branch $branch
        
        if ($success) {
            # Check if dependencies need update
            if (Test-Path "package.json") {
                Write-Log "Checking for dependency updates..." -Level "UPDATE"
                
                $pkgMgr = if (Test-CommandExists "bun") { "bun" } else { "npm" }
                & $pkgMgr install 2>&1 | Out-Null
                
                Write-Log "Dependencies updated" -Level "SUCCESS"
            }
            
            # Regenerate Prisma client if schema changed
            if (Test-Path "prisma\schema.prisma") {
                Write-Log "Checking Prisma schema..." -Level "UPDATE"
                npx prisma generate 2>&1 | Out-Null
            }
            
            if ($RestartServer) {
                Write-Log "Restarting server..." -Level "UPDATE"
                $Script:Restarting = $true
                
                Start-Sleep -Seconds 2
                
                # Restart the server
                Start-DevServerInternal
                
                Write-Host ""
                Write-Host "  ============================================================" -ForegroundColor Green
                Write-Host "  UPDATE COMPLETE - Server restarted!" -ForegroundColor Green
                Write-Host "  ============================================================" -ForegroundColor Green
                Write-Host ""
                
                # Reset counters on restart
                if ($RequestCount) { $RequestCount.Value = 0 }
                if ($ErrorCount) { $ErrorCount.Value = 0 }
            }
        }
    }
    
    $Script:LastCommitHash = Get-GitLocalHash
    $Script:Restarting = $false
}

# ============================================
# SERVER MANAGEMENT
# ============================================
function Start-DevServer {
    param([switch]$WithMonitor)
    
    Write-Header "Starting Development Server"
    
    # Initialize git tracking
    if (-not $NoAutoUpdate) {
        $Script:LastCommitHash = Get-GitLocalHash
        Write-Log "Git tracking enabled (checking every $UpdateInterval seconds)" -Level "UPDATE"
        Write-Log "Current commit: $($Script:LastCommitHash.Substring(0,7))" -Level "UPDATE"
        Write-Host ""
    }
    
    Start-DevServerInternal
    
    if ($WithMonitor) {
        Start-ServerMonitor
    }
    
    return $true
}

function Start-DevServerInternal {
    # Check if port is already in use
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Log "Port $Port is already in use, stopping existing process..." -Level "WARN"
        
        try {
            $existingProcess = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
            if ($existingProcess) {
                Stop-Process -Id $existingProcess.Id -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
                Write-Log "Stopped existing process" -Level "SUCCESS"
            }
        } catch {
            Write-Log "Could not stop existing process" -Level "WARN"
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
    
    Write-Log "Starting: $startCmd" -Level "INFO"
    Write-Log "Port: $Port" -Level "INFO"
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
        Write-Log "Server started (PID: $($Script:ServerProcess.Id))" -Level "SUCCESS"
    } catch {
        Write-Log "Failed to start server: $_" -Level "ERROR"
        return $false
    }
    
    return $true
}

function Stop-DevServer {
    if ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        Write-Host ""
        Write-Log "Stopping server..." -Level "WARN"
        
        try {
            $Script:ServerProcess.Kill()
            $Script:ServerProcess.WaitForExit(5000)
            Write-Log "Server stopped" -Level "SUCCESS"
        } catch {
            Write-Log "Could not gracefully stop server" -Level "WARN"
        }
    }
}

function Start-ServerMonitor {
    $startTime = Get-Date
    $requestCount = 0
    $errorCount = 0
    $statusInterval = 30
    $updateCheckCounter = 0
    
    $statusTimer = [System.Diagnostics.Stopwatch]::StartNew()
    $updateTimer = [System.Diagnostics.Stopwatch]::StartNew()
    
    Write-Host ""
    Write-Host "  ============================================================" -ForegroundColor DarkCyan
    Write-Host "  SERVER RUNNING - Real-time logs below" -ForegroundColor Cyan
    if (-not $NoAutoUpdate) {
        Write-Host "  Auto-update: Checking every $UpdateInterval seconds" -ForegroundColor Magenta
    }
    Write-Host "  ============================================================" -ForegroundColor DarkCyan
    Write-Host ""
    
    while ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        # Check for git updates
        if (-not $NoAutoUpdate -and -not $Script:Restarting) {
            if ($updateTimer.Elapsed.TotalSeconds -ge $UpdateInterval) {
                $updateTimer.Restart()
                
                $updateInfo = Test-GitUpdates
                
                if ($updateInfo.HasUpdates) {
                    Invoke-AutoUpdate -RestartServer $true -RequestCount ([ref]$requestCount) -ErrorCount ([ref]$errorCount)
                }
            }
        }
        
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
    if ($Script:ServerProcess.HasExited -and -not $Script:Restarting) {
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
    
    # Get current git info
    $gitBranch = Get-GitCurrentBranch
    $gitHash = (Get-GitLocalHash)
    $gitHashShort = if ($gitHash) { $gitHash.Substring(0,7) } else { "N/A" }
    
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
    Write-Host "  | " -NoNewline -ForegroundColor DarkGray
    Write-Host "Git: " -NoNewline -ForegroundColor White
    Write-Host "$gitBranch" -NoNewline -ForegroundColor Magenta
    Write-Host " @ " -NoNewline -ForegroundColor Gray
    Write-Host "$gitHashShort" -NoNewline -ForegroundColor Magenta
    Write-Host "                               |" -ForegroundColor DarkGray
    Write-Host "  +------------------------------------------------------------+" -ForegroundColor DarkGray
    Write-Host ""
}

# ============================================
# MAIN
# ============================================
Write-Header "$($Config.AppName) v$($Config.Version)"

# Check if git is available
if (-not $NoAutoUpdate -and -not (Test-CommandExists "git")) {
    Write-Log "Git not found, disabling auto-update" -Level "WARN"
    $NoAutoUpdate = $true
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "  Dependencies not found. Running setup..." -ForegroundColor Yellow
    Write-Host ""
    .\setup.ps1
    exit
}

# Check if database exists
$dbPaths = @("prisma\dev.db", "prisma\prod.db", "db\custom.db", "dev.db")
$dbFound = $false
foreach ($dbPath in $dbPaths) {
    if (Test-Path $dbPath) {
        $dbFound = $true
        break
    }
}

if (-not $dbFound) {
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
