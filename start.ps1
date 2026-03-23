<#
.SYNOPSIS
    Political Spectrum App - Quick Start Script
.DESCRIPTION
    Starts the development server with health checks, error handling, real-time monitoring,
    automatic git update detection, and interactive management commands.
.VERSION
    3.0.0
#>

param(
    [switch]$Prod,
    [switch]$Studio,
    [switch]$NoMonitor,
    [switch]$NoAutoUpdate,
    [int]$Port = 3000,
    [int]$UpdateInterval = 10
)

# ============================================
# CONFIGURATION
# ============================================
$Config = @{
    AppName = "Political Spectrum App"
    Version = "3.0.0"
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
$Script:LocalIP = $null
$Script:RequestCount = 0
$Script:ErrorCount = 0
$Script:StartTime = $null

# ============================================
# UTILITY FUNCTIONS
# ============================================
function Write-Header {
    param([string]$Title)
    
    $width = 70
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
        "MENU" { "[MENU]" }
        default { "[INFO]" }
    }
    
    $color = switch ($Level) {
        "UPDATE" { "Magenta" }
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        "MENU" { "Cyan" }
        default { "Gray" }
    }
    
    Write-Host "  [$timestamp] $prefix $Message" -ForegroundColor $color
}

function Test-CommandExists {
    param([string]$Command)
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Get-LocalIPAddress {
    try {
        $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi","Ethernet","Ethernet*","Wi-Fi*" -ErrorAction SilentlyContinue | 
               Where-Object { $_.IPAddress -notlike "127.*" } | 
               Select-Object -First 1).IPAddress
        
        if (-not $ip) {
            $ip = (Get-NetIPAddress -AddressFamily IPv4 | 
                   Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -eq "Dhcp" } | 
                   Select-Object -First 1).IPAddress
        }
        
        return $ip
    } catch {
        try {
            $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" }).IPAddress
            return $ip
        } catch {
            return "Unknown"
        }
    }
}

# ============================================
# DATABASE FUNCTIONS
# ============================================
function Get-DatabaseStatus {
    $dbPaths = @(
        Join-Path $PWD "db\custom.db"
        Join-Path $PWD "prisma\dev.db"
        Join-Path $PWD "dev.db"
    )
    
    $status = @{
        Type     = "SQLite"
        Location = $null
        Exists   = $false
        Size     = 0
        Live     = $false
        Port     = "N/A (file-based)"
        Error    = $null
    }
    
    foreach ($dbPath in $dbPaths) {
        if (Test-Path $dbPath) {
            $status.Location = $dbPath
            $status.Exists = $true
            $fileInfo = Get-Item $dbPath
            $status.Size = $fileInfo.Length
            break
        }
    }
    
    # Test database connection via API
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/analytics?type=overview" -TimeoutSec 3 -ErrorAction Stop
        $status.Live = $true
    } catch {
        $status.Error = $_.Exception.Message
    }
    
    return [PSCustomObject]$status
}

# ============================================
# GIT UPDATE SYSTEM
# ============================================
function Get-GitCurrentBranch {
    try {
        $inRepo = git rev-parse --is-inside-work-tree 2>$null
        if ($inRepo -ne "true") { return $null }
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
        if ($branch) { return $branch.Trim() }
        return $null
    } catch {
        return $null
    }
}

function Get-GitLocalHash {
    try {
        $inRepo = git rev-parse --is-inside-work-tree 2>$null
        if ($inRepo -ne "true") { return $null }
        $hash = git rev-parse HEAD 2>$null
        if ($hash) { return $hash.Trim() }
        return $null
    } catch {
        return $null
    }
}

function Get-GitRemoteHash {
    param([string]$Branch = "master")
    try {
        $inRepo = git rev-parse --is-inside-work-tree 2>$null
        if ($inRepo -ne "true") { return $null }
        git fetch origin $Branch 2>$null | Out-Null
        $hash = git rev-parse "origin/$Branch" 2>$null
        if ($hash) { return $hash.Trim() }
        return $null
    } catch {
        return $null
    }
}

function Test-GitUpdates {
    $branch = Get-GitCurrentBranch
    if (-not $branch) {
        return @{ HasUpdates = $false; LocalHash = $null; RemoteHash = $null; Branch = $null }
    }
    
    $localHash = Get-GitLocalHash
    $remoteHash = Get-GitRemoteHash -Branch $branch
    
    if ($localHash -and $remoteHash -and $localHash -ne $remoteHash) {
        return @{ HasUpdates = $true; LocalHash = $localHash; RemoteHash = $remoteHash; Branch = $branch }
    }
    
    return @{ HasUpdates = $false; LocalHash = $localHash; RemoteHash = $remoteHash; Branch = $branch }
}

function Invoke-GitPull {
    param([string]$Branch = "master")
    
    Write-Log "Pulling latest changes from origin/$Branch..." -Level "UPDATE"
    
    try {
        $stashResult = git stash 2>&1
        $hasStash = $stashResult -notmatch "No local changes"
        $pullResult = git pull origin $Branch 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Successfully pulled updates!" -Level "SUCCESS"
            if ($hasStash) { git stash pop 2>&1 | Out-Null }
            return $true
        } else {
            Write-Log "Pull failed: $pullResult" -Level "ERROR"
            if ($hasStash) { git stash pop 2>&1 | Out-Null }
            return $false
        }
    } catch {
        Write-Log "Git pull error: $_" -Level "ERROR"
        return $false
    }
}

function Invoke-AutoUpdate {
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
        
        if ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
            Write-Log "Stopping server for update..." -Level "UPDATE"
            Stop-DevServer
        }
        
        $success = Invoke-GitPull -Branch $branch
        
        if ($success) {
            if (Test-Path "package.json") {
                Write-Log "Checking for dependency updates..." -Level "UPDATE"
                $pkgMgr = if (Test-CommandExists "bun") { "bun" } else { "npm" }
                & $pkgMgr install 2>&1 | Out-Null
                Write-Log "Dependencies updated" -Level "SUCCESS"
            }
            
            if (Test-Path "prisma\schema.prisma") {
                Write-Log "Checking Prisma schema..." -Level "UPDATE"
                npx prisma generate 2>&1 | Out-Null
            }
            
            Write-Log "Restarting server..." -Level "UPDATE"
            $Script:Restarting = $true
            Start-Sleep -Seconds 2
            Start-DevServerInternal
            
            Write-Host ""
            Write-Host "  ============================================================" -ForegroundColor Green
            Write-Host "  UPDATE COMPLETE - Server restarted!" -ForegroundColor Green
            Write-Host "  ============================================================" -ForegroundColor Green
            Write-Host ""
            
            $Script:RequestCount = 0
            $Script:ErrorCount = 0
        }
    }
    
    $Script:LastCommitHash = Get-GitLocalHash
    $Script:Restarting = $false
}

# ============================================
# HEALTH & DIAGNOSTICS
# ============================================
function Test-AppHealth {
    Write-Header "Health Check"
    
    $health = @{
        App       = $false
        Database  = $false
        API       = $false
    }
    
    Write-ColorText "  Testing App (localhost:$Port)... " "Cyan" -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $health.App = $true
            Write-ColorText "OK" "Green"
        } else {
            Write-ColorText "FAILED (Status: $($response.StatusCode))" "Red"
        }
    } catch {
        Write-ColorText "FAILED - $($_.Exception.Message)" "Red"
    }
    
    Write-ColorText "  Testing API (/api/version)... " "Cyan" -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/version" -TimeoutSec 5
        $health.API = $true
        Write-ColorText "OK (v$($response.version))" "Green"
    } catch {
        Write-ColorText "FAILED" "Red"
    }
    
    Write-ColorText "  Testing Database... " "Cyan" -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/analytics?type=overview" -TimeoutSec 5
        $health.Database = $true
        Write-ColorText "OK ($($response.totalArticles) articles)" "Green"
    } catch {
        Write-ColorText "FAILED" "Red"
    }
    
    Write-Host ""
    $allHealthy = $health.App -and $health.Database -and $health.API
    if ($allHealthy) {
        Write-ColorText "  Status: ALL SYSTEMS HEALTHY" "Green"
    } else {
        Write-ColorText "  Status: ISSUES DETECTED" "Red"
    }
    
    return $health
}

function Show-Diagnostics {
    Write-Header "Full Diagnostics"
    
    # Network Info
    Write-Section "Network Information"
    Write-ColorText "  Local IP:        " "Gray" -NoNewline
    Write-ColorText $Script:LocalIP "White"
    Write-ColorText "  App URL:         " "Gray" -NoNewline
    Write-ColorText "http://$($Script:LocalIP):$Port" "Green"
    Write-ColorText "  Local URL:       " "Gray" -NoNewline
    Write-ColorText "http://localhost:$Port" "Green"
    
    # Port Status
    Write-Section "Port Status"
    $portStatus = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portStatus) {
        Write-ColorText "  Port $Port`:       LISTENING" "Green"
        $proc = Get-Process -Id $portStatus.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Write-ColorText "  Process:         " "Gray" -NoNewline
            Write-ColorText "$($proc.ProcessName) (PID: $($proc.Id))" "White"
        }
    } else {
        Write-ColorText "  Port $Port`:       NOT IN USE" "Red"
    }
    
    # Database Status
    Write-Section "Database Status"
    $db = Get-DatabaseStatus
    Write-ColorText "  Type:            " "Gray" -NoNewline
    Write-ColorText $db.Type "White"
    Write-ColorText "  Location:        " "Gray" -NoNewline
    if ($db.Location) {
        Write-ColorText $db.Location "White"
    } else {
        Write-ColorText "Not found" "Red"
    }
    Write-ColorText "  Size:            " "Gray" -NoNewline
    if ($db.Size -gt 0) {
        Write-ColorText "$([math]::Round($db.Size / 1KB, 2)) KB" "White"
    } else {
        Write-ColorText "N/A" "Gray"
    }
    Write-ColorText "  Live:            " "Gray" -NoNewline
    if ($db.Live) {
        Write-ColorText "YES - Connected" "Green"
    } else {
        Write-ColorText "NO" "Red"
    }
    
    # Session Stats
    if ($Script:StartTime) {
        Write-Section "Session Statistics"
        $uptime = ((Get-Date) - $Script:StartTime).ToString("hh\:mm\:ss")
        Write-ColorText "  Uptime:          " "Gray" -NoNewline
        Write-ColorText $uptime "White"
        Write-ColorText "  Requests:        " "Gray" -NoNewline
        Write-ColorText $Script:RequestCount "White"
        Write-ColorText "  Errors:          " "Gray" -NoNewline
        Write-ColorText $Script:ErrorCount $(if ($Script:ErrorCount -gt 0) { "Red" } else { "White" })
    }
}

function Write-ColorText {
    param([string]$Text, [string]$Color = 'White', [switch]$NoNewline)
    if ($NoNewline) {
        Write-Host $Text -ForegroundColor $Color -NoNewline
    } else {
        Write-Host $Text -ForegroundColor $Color
    }
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-ColorText "--- $Title ---" "Cyan"
}

# ============================================
# PROCESS MANAGEMENT
# ============================================
function Stop-AllProcesses {
    Write-Header "Killing All App Processes"
    
    $killed = 0
    
    # Kill by port
    $portProc = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portProc) {
        try {
            $proc = Get-Process -Id $portProc.OwningProcess -ErrorAction SilentlyContinue
            if ($proc) {
                Write-ColorText "  Killing PID $($proc.Id) ($($proc.ProcessName)) on port $Port..." "Yellow"
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                $killed++
            }
        } catch {}
    }
    
    # Kill Node processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-ColorText "  Killing PID $($_.Id) (node)..." "Yellow"
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        $killed++
    }
    
    # Kill Bun processes
    Get-Process -Name "bun" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-ColorText "  Killing PID $($_.Id) (bun)..." "Yellow"
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        $killed++
    }
    
    # Kill Next processes
    Get-Process -Name "next" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-ColorText "  Killing PID $($_.Id) (next)..." "Yellow"
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        $killed++
    }
    
    Write-Host ""
    Write-ColorText "  Total processes killed: $killed" $(if ($killed -gt 0) { "Green" } else { "Gray" })
    
    return $killed
}

# ============================================
# SERVER MANAGEMENT
# ============================================
function Start-DevServer {
    param([switch]$WithMonitor)
    
    Write-Header "Starting Development Server"
    
    # Get local IP
    $Script:LocalIP = Get-LocalIPAddress
    
    # Show network info
    Write-Section "Network Information"
    Write-ColorText "  Local IP:     " "Gray" -NoNewline
    Write-ColorText $Script:LocalIP "Green"
    Write-ColorText "  App URL:      " "Gray" -NoNewline
    Write-ColorText "http://$($Script:LocalIP):$Port" "Cyan"
    Write-ColorText "  Local URL:    " "Gray" -NoNewline
    Write-ColorText "http://localhost:$Port" "Cyan"
    
    # Show database info
    Write-Section "Database Information"
    $db = Get-DatabaseStatus
    Write-ColorText "  Type:         " "Gray" -NoNewline
    Write-ColorText $db.Type "White"
    Write-ColorText "  Location:     " "Gray" -NoNewline
    if ($db.Location) {
        Write-ColorText $db.Location "White"
    } else {
        Write-ColorText "Not found - will be created" "Yellow"
    }
    Write-ColorText "  Status:       " "Gray" -NoNewline
    if ($db.Exists) {
        Write-ColorText "Found ($([math]::Round($db.Size / 1KB, 2)) KB)" "Green"
    } else {
        Write-ColorText "Will be created on first run" "Yellow"
    }
    
    # Initialize git tracking
    if (-not $NoAutoUpdate) {
        $Script:LastCommitHash = Get-GitLocalHash
        Write-Section "Git Tracking"
        if ($Script:LastCommitHash) {
            Write-Log "Auto-update enabled (checking every $UpdateInterval seconds)" -Level "UPDATE"
            Write-Log "Current commit: $($Script:LastCommitHash.Substring(0,7))" -Level "UPDATE"
        } else {
            Write-Log "Not in a git repository - auto-update disabled" -Level "WARN"
        }
    }
    
    Write-Host ""
    
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
    $startCmd = if (Test-CommandExists "bun") { "bun run dev" } else { "npm run dev" }
    
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
    try {
        [Console]::TreatControlCAsInput = $false
        [Console]::CancelKeyPress.Add_Handler({
            param($sender, $e)
            $e.Cancel = $true
            Write-Host ""
            Write-Log "Ctrl+C pressed - shutting down..." -Level "WARN"
            Stop-DevServer
            exit 0
        }.GetNewClosure()) | Out-Null
    } catch {}
    
    Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
        Stop-DevServer
    } -ErrorAction SilentlyContinue | Out-Null
    
    try {
        $null = $Script:ServerProcess.Start()
        $Script:StartTime = Get-Date
        Write-Log "Server started (PID: $($Script:ServerProcess.Id))" -Level "SUCCESS"
    } catch {
        Write-Log "Failed to start server: $_" -Level "ERROR"
        return $false
    }
    
    return $true
}

function Stop-DevServer {
    if ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
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

function Show-ServerStatus {
    $uptime = if ($Script:StartTime) { ((Get-Date) - $Script:StartTime).ToString("hh\:mm\:ss") } else { "00:00:00" }
    
    $portStatus = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    $connections = ($portStatus | Where-Object { $_.State -eq "Established" } | Measure-Object).Count
    
    $memoryStr = if ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        try {
            $proc = Get-Process -Id $Script:ServerProcess.Id -ErrorAction SilentlyContinue
            if ($proc) { "{0:N0} MB" -f ($proc.WorkingSet64 / 1MB) } else { "N/A" }
        } catch { "N/A" }
    } else { "N/A" }
    
    $gitBranch = Get-GitCurrentBranch
    $gitHash = Get-GitLocalHash
    $gitHashShort = if ($gitHash) { $gitHash.Substring(0,7) } else { "N/A" }
    
    $db = Get-DatabaseStatus
    $dbStatus = if ($db.Live) { "LIVE" } else { "OFFLINE" }
    $dbColor = if ($db.Live) { "Green" } else { "Red" }
    
    Write-Host ""
    Write-Host "  ╔════════════════════════════════════════════════════════════════╗" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "SERVER STATUS                                    " -NoNewline -ForegroundColor Cyan
    Write-Host "║" -ForegroundColor DarkGray
    Write-Host "  ╠════════════════════════════════════════════════════════════════╣" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "Local:  " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:$Port".PadRight(20) -NoNewline -ForegroundColor Green
    Write-Host "Uptime: " -NoNewline -ForegroundColor White
    Write-Host "$uptime".PadRight(10) -NoNewline -ForegroundColor Yellow
    Write-Host "║" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "Network:" -NoNewline -ForegroundColor White
    Write-Host " http://$($Script:LocalIP):$Port".PadRight(20) -NoNewline -ForegroundColor Green
    Write-Host "Memory: " -NoNewline -ForegroundColor White
    Write-Host "$memoryStr".PadRight(10) -NoNewline -ForegroundColor Yellow
    Write-Host "║" -ForegroundColor DarkGray
    Write-Host "  ╠════════════════════════════════════════════════════════════════╣" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "Database: " -NoNewline -ForegroundColor White
    Write-Host "$dbStatus".PadRight(10) -NoNewline -ForegroundColor $dbColor
    Write-Host "  Connections: " -NoNewline -ForegroundColor White
    Write-Host "$connections".PadRight(4) -NoNewline -ForegroundColor Cyan
    Write-Host "                ║" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "Requests: " -NoNewline -ForegroundColor White
    Write-Host "$($Script:RequestCount)".PadRight(7) -NoNewline -ForegroundColor Cyan
NoNewline
    Write-Host "  Errors: " -NoNewline -ForegroundColor White
    $errColor = if ($Script:ErrorCount -gt 0) { "Red" } else { "Green" }
    Write-Host "$($Script:ErrorCount)".PadRight(5) -NoNewline -ForegroundColor $errColor
    Write-Host "                      ║" -ForegroundColor DarkGray
    Write-Host "  ╠════════════════════════════════════════════════════════════════╣" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "Git: " -NoNewline -ForegroundColor White
    Write-Host "$gitBranch" -NoNewline -ForegroundColor Magenta
    Write-Host " @ " -NoNewline -ForegroundColor Gray
    Write-Host "$gitHashShort" -NoNewline -ForegroundColor Magenta
    Write-Host "                                         ║" -ForegroundColor DarkGray
    Write-Host "  ╠════════════════════════════════════════════════════════════════╣" -ForegroundColor DarkGray
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkGray
    Write-Host "Commands: [H]ealth [D]iagnostics [K]ill [Q]uit          " -NoNewline -ForegroundColor DarkCyan
    Write-Host "║" -ForegroundColor DarkGray
    Write-Host "  ╚════════════════════════════════════════════════════════════════╝" -ForegroundColor DarkGray
    Write-Host ""
}

function Start-ServerMonitor {
    $statusInterval = 30
    $statusTimer = [System.Diagnostics.Stopwatch]::StartNew()
    $updateTimer = [System.Diagnostics.Stopwatch]::StartNew()
    $menuCheckInterval = 500  # ms
    
    Write-Host ""
    Write-Host "  ╔════════════════════════════════════════════════════════════════╗" -ForegroundColor DarkCyan
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkCyan
    Write-Host "SERVER RUNNING - Real-time logs" -NoNewline -ForegroundColor Cyan
    Write-Host "                             ║" -ForegroundColor DarkCyan
    Write-Host "  ║ " -NoNewline -ForegroundColor DarkCyan
    Write-Host "Commands: [H]ealth [D]iagnostics [K]ill [Q]uit" -NoNewline -ForegroundColor DarkGray
    Write-Host "              ║" -ForegroundColor DarkCyan
    Write-Host "  ╚════════════════════════════════════════════════════════════════╝" -ForegroundColor DarkCyan
    Write-Host ""
    
    while ($Script:ServerProcess -and -not $Script:ServerProcess.HasExited) {
        # Check for git updates
        if (-not $NoAutoUpdate -and -not $Script:Restarting) {
            if ($updateTimer.Elapsed.TotalSeconds -ge $UpdateInterval) {
                $updateTimer.Restart()
                $updateInfo = Test-GitUpdates
                if ($updateInfo.HasUpdates) {
                    Invoke-AutoUpdate
                }
            }
        }
        
        # Read standard output (non-blocking)
        $outputRead = $false
        while (-not $Script:ServerProcess.StandardOutput.EndOfStream) {
            $line = $Script:ServerProcess.StandardOutput.ReadLine()
            if ($line) {
                $outputRead = $true
                $timestamp = Get-Date -Format "HH:mm:ss"
                
                if ($line -match "error|Error|ERROR|failed|Failed") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Red
                    $Script:ErrorCount++
                } elseif ($line -match "warn|Warn|WARN") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Yellow
                } elseif ($line -match "ready|Ready|compiled|Compiled|started|Started") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Green
                } elseif ($line -match "GET|POST|PUT|DELETE|PATCH") {
                    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                    Write-Host $line -ForegroundColor Cyan
                    $Script:RequestCount++
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
                $outputRead = $true
                $timestamp = Get-Date -Format "HH:mm:ss"
                Write-Host "  [$timestamp] " -NoNewline -ForegroundColor Gray
                Write-Host $line -ForegroundColor Red
                $Script:ErrorCount++
                Add-Content -Path $Script:ServerLogPath -Value "[$timestamp] [ERROR] $line" -ErrorAction SilentlyContinue
            }
        }
        
        # Check for keyboard input (non-blocking)
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            $keyChar = $key.KeyChar.ToString().ToUpper()
            
            switch ($keyChar) {
                'H' { 
                    Write-Host ""
                    Test-AppHealth
                    Write-Host ""
                    Read-Host "Press Enter to continue"
                }
                'D' { 
                    Write-Host ""
                    Show-Diagnostics
                    Write-Host ""
                    Read-Host "Press Enter to continue"
                }
                'K' { 
                    Write-Host ""
                    Stop-AllProcesses
                    Write-Host ""
                    Read-Host "Press Enter to exit"
                    exit 0
                }
                'Q' { 
                    Write-Host ""
                    Write-Log "Quit requested - shutting down..." -Level "WARN"
                    Stop-DevServer
                    Write-Host ""
                    exit 0
                }
            }
        }
        
        # Show periodic status
        if ($statusTimer.Elapsed.TotalSeconds -ge $statusInterval) {
            $statusTimer.Restart()
            Show-ServerStatus
        }
        
        Start-Sleep -Milliseconds $menuCheckInterval
    }
    
    # Process exited
    if ($Script:ServerProcess.HasExited -and -not $Script:Restarting) {
        Write-Host ""
        Write-Host "  ╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Red
        Write-Host "  ║ " -NoNewline -ForegroundColor Red
        Write-Host "SERVER STOPPED" -NoNewline -ForegroundColor Red
        Write-Host "                                             ║" -ForegroundColor Red
        Write-Host "  ║ " -NoNewline -ForegroundColor Red
        Write-Host "Exit Code: $($Script:ServerProcess.ExitCode)" -NoNewline -ForegroundColor Yellow
        Write-Host "                                        ║" -ForegroundColor Red
        Write-Host "  ╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Red
        
        $uptime = if ($Script:StartTime) { ((Get-Date) - $Script:StartTime).ToString("hh\:mm\:ss") } else { "00:00:00" }
        Write-Host ""
        Write-Host "  Session Statistics:" -ForegroundColor Cyan
        Write-Host "  - Uptime: $uptime" -ForegroundColor Gray
        Write-Host "  - Total Requests: $($Script:RequestCount)" -ForegroundColor Gray
        Write-Host "  - Errors: $($Script:ErrorCount)" -ForegroundColor $(if ($Script:ErrorCount -gt 0) { "Red" } else { "Gray" })
        Write-Host "  - Log file: $Script:ServerLogPath" -ForegroundColor Gray
    }
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
