#!/usr/bin/env pwsh
#Requires -Version 5.1
<#
.SYNOPSIS
    Political Spectrum App - Process Manager & Diagnostics Tool
.DESCRIPTION
    Interactive tool for managing processes, checking health, and viewing diagnostics.
    Shows network info, database status, and provides real-time monitoring.
.VERSION
    1.0.0
.EXAMPLE
    .\manage.ps1
    Start interactive management console
.EXAMPLE
    .\manage.ps1 -Action kill
    Kill all related processes
.EXAMPLE
    .\manage.ps1 -Action health
    Run health check
.EXAMPLE
    .\manage.ps1 -Action diagnostics
    Run full diagnostics
.PARAMETER Action
    Quick action: kill, health, diagnostics, status
.PARAMETER Port
    App port (default: 3000)
#>

param(
    [ValidateSet('kill', 'health', 'diagnostics', 'status', 'monitor')]
    [string]$Action,
    [int]$Port = 3000
)

$ScriptVersion = "1.0.0"
$ScriptName = "Political Spectrum App Manager"

# Colors
$Colors = @{
    Error    = 'Red'
    Warning  = 'Yellow'
    Success  = 'Green'
    Info     = 'Cyan'
    Header   = 'Magenta'
    Dim      = 'DarkGray'
    Highlight = 'White'
}

# ============================================
# HELPER FUNCTIONS
# ============================================

function Write-ColorText {
    param([string]$Text, [string]$Color = 'White')
    Write-Host $Text -ForegroundColor $Colors[$Color]
}

function Write-Header {
    param([string]$Title)
    $width = 70
    Write-Host ""
    Write-ColorText ("=" * $width) "Header"
    Write-ColorText "  $Title" "Header"
    Write-ColorText ("=" * $width) "Header"
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-ColorText "--- $Title ---" "Info"
}

# ============================================
# NETWORK FUNCTIONS
# ============================================

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
        return "Unknown"
    }
}

function Get-AllLocalIPAddresses {
    $ips = @()
    try {
        $adapters = Get-NetIPAddress -AddressFamily IPv4 | 
                    Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" }
        
        foreach ($adapter in $adapters) {
            $ips += [PSCustomObject]@{
                Interface = $adapter.InterfaceAlias
                IP        = $adapter.IPAddress
                Type      = $adapter.PrefixOrigin
            }
        }
    } catch {}
    return $ips
}

function Test-PortListening {
    param([int]$Port)
    try {
        $listener = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties()
        $connections = $listener.GetActiveTcpListeners()
        return $connections | Where-Object { $_.Port -eq $Port }
    } catch {
        return $null
    }
}

function Get-PortProcess {
    param([int]$Port)
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            return [PSCustomObject]@{
                ProcessId   = $conn.OwningProcess
                ProcessName = $proc.ProcessName
                State       = $conn.State
            }
        }
    } catch {}
    return $null
}

# ============================================
# PROCESS FUNCTIONS
# ============================================

function Get-AppProcesses {
    $processes = @()
    
    # Find by port
    $portProc = Get-PortProcess -Port $Port
    if ($portProc) {
        $processes += $portProc
    }
    
    # Find Node.js processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
        if ($processes.ProcessId -notcontains $_.Id) {
            $processes += [PSCustomObject]@{
                ProcessId   = $_.Id
                ProcessName = $_.ProcessName
                State       = "Running"
            }
        }
    }
    
    # Find Bun processes
    Get-Process -Name "bun" -ErrorAction SilentlyContinue | ForEach-Object {
        if ($processes.ProcessId -notcontains $_.Id) {
            $processes += [PSCustomObject]@{
                ProcessId   = $_.Id
                ProcessName = $_.ProcessName
                State       = "Running"
            }
        }
    }
    
    # Find Next.js processes
    Get-Process -Name "next" -ErrorAction SilentlyContinue | ForEach-Object {
        if ($processes.ProcessId -notcontains $_.Id) {
            $processes += [PSCustomObject]@{
                ProcessId   = $_.Id
                ProcessName = $_.ProcessName
                State       = "Running"
            }
        }
    }
    
    # Find by command line containing our app
    Get-WmiObject Win32_Process -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*next*" -or $_.CommandLine -like "*political-spectrum*"
    } | ForEach-Object {
        if ($processes.ProcessId -notcontains $_.ProcessId) {
            $processes += [PSCustomObject]@{
                ProcessId   = $_.ProcessId
                ProcessName = $_.Name
                State       = "Running"
            }
        }
    }
    
    return $processes | Sort-Object ProcessId -Unique
}

function Get-AllListeningPorts {
    param([int[]]$Ports = @(3000, 3001, 5555, 5432, 27017, 8080, 8000))
    
    $results = @()
    
    foreach ($p in $Ports) {
        $listener = Test-PortListening -Port $p
        if ($listener) {
            $proc = Get-PortProcess -Port $p
            $results += [PSCustomObject]@{
                Port       = $p
                Status     = "LISTENING"
                ProcessId  = if ($proc) { $proc.ProcessId } else { "N/A" }
                ProcessName = if ($proc) { $proc.ProcessName } else { "Unknown" }
                Purpose    = Get-PortPurpose $p
            }
        } else {
            $results += [PSCustomObject]@{
                Port       = $p
                Status     = "NOT IN USE"
                ProcessId  = "-"
                ProcessName = "-"
                Purpose    = Get-PortPurpose $p
            }
        }
    }
    
    # Also scan for any listening ports in range 3000-3010
    3000..3010 | ForEach-Object {
        $p = $_
        if ($Ports -notcontains $p) {
            $listener = Test-PortListening -Port $p
            if ($listener) {
                $proc = Get-PortProcess -Port $p
                $results += [PSCustomObject]@{
                    Port       = $p
                    Status     = "LISTENING"
                    ProcessId  = if ($proc) { $proc.ProcessId } else { "N/A" }
                    ProcessName = if ($proc) { $proc.ProcessName } else { "Unknown" }
                    Purpose    = "Dynamic"
                }
            }
        }
    }
    
    return $results | Sort-Object Port
}

function Get-PortPurpose {
    param([int]$Port)
    switch ($Port) {
        3000 { "Next.js App" }
        3001 { "Next.js Alt" }
        5555 { "Prisma Studio" }
        5432 { "PostgreSQL" }
        27017 { "MongoDB" }
        8080 { "HTTP Alt" }
        8000 { "HTTP Alt" }
        default { "Unknown" }
    }
}

function Stop-AppProcesses {
    Write-Header "Killing All App Processes"
    
    $processes = Get-AppProcesses
    
    if ($processes.Count -eq 0) {
        Write-ColorText "No app processes found running." "Warning"
        return
    }
    
    Write-ColorText "Found $($processes.Count) process(es) to terminate:" "Info"
    $processes | Format-Table -AutoSize
    
    foreach ($proc in $processes) {
        try {
            Write-ColorText "  Stopping PID $($proc.ProcessId) ($($proc.ProcessName))..." "Warning" -NoNewline
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Milliseconds 100
            if (Get-Process -Id $proc.ProcessId -ErrorAction SilentlyContinue) {
                Write-ColorText " FAILED" "Error"
            } else {
                Write-ColorText " OK" "Success"
            }
        } catch {
            Write-ColorText " ERROR: $($_.Exception.Message)" "Error"
        }
    }
    
    # Verify ports are free
    Start-Sleep -Milliseconds 500
    Write-Section "Port Status After Kill"
    $ports = Get-AllListeningPorts -Ports @(3000, 3001, 5555)
    $ports | Format-Table -AutoSize
}

# ============================================
# DATABASE FUNCTIONS
# ============================================

function Get-DatabaseStatus {
    $dbPath = Join-Path $PSScriptRoot "db\custom.db"
    $prismaDbPath = Join-Path $PSScriptRoot "prisma\dev.db"
    
    $status = @{
        Type     = "SQLite"
        Location = $null
        Exists   = $false
        Size     = 0
        Live     = $false
        Tables   = @()
        Error    = $null
    }
    
    # Check for database file
    if (Test-Path $dbPath) {
        $status.Location = $dbPath
        $status.Exists = $true
        $fileInfo = Get-Item $dbPath
        $status.Size = $fileInfo.Length
    } elseif (Test-Path $prismaDbPath) {
        $status.Location = $prismaDbPath
        $status.Exists = $true
        $fileInfo = Get-Item $prismaDbPath
        $status.Size = $fileInfo.Length
    }
    
    # Test database connection via API
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/analytics?type=overview" -TimeoutSec 5 -ErrorAction Stop
        $status.Live = $true
        $status.Tables = @("Article", "RequestLog", "AIProvider", "AuthorHistory", "AnalyticsSnapshot")
    } catch {
        $status.Error = $_.Exception.Message
    }
    
    return [PSCustomObject]$status
}

function Show-DatabaseInfo {
    Write-Section "Database Status"
    
    $db = Get-DatabaseStatus
    
    Write-ColorText "  Type:       " "Dim" -NoNewline
    Write-ColorText $db.Type "Highlight"
    
    Write-ColorText "  Location:   " "Dim" -NoNewline
    if ($db.Location) {
        Write-ColorText $db.Location "Highlight"
    } else {
        Write-ColorText "Not found" "Error"
    }
    
    Write-ColorText "  Exists:     " "Dim" -NoNewline
    if ($db.Exists) {
        Write-ColorText "Yes" "Success"
    } else {
        Write-ColorText "No" "Error"
    }
    
    Write-ColorText "  Size:       " "Dim" -NoNewline
    if ($db.Size -gt 0) {
        $sizeKB = [math]::Round($db.Size / 1KB, 2)
        Write-ColorText "$sizeKB KB" "Highlight"
    } else {
        Write-ColorText "N/A" "Dim"
    }
    
    Write-ColorText "  Live:       " "Dim" -NoNewline
    if ($db.Live) {
        Write-ColorText "YES - Connected" "Success"
    } else {
        Write-ColorText "NO - Not accessible" "Error"
    }
    
    if ($db.Tables.Count -gt 0) {
        Write-ColorText "  Tables:     " "Dim" -NoNewline
        Write-ColorText ($db.Tables -join ", ") "Highlight"
    }
    
    if ($db.Error) {
        Write-ColorText "  Error:      " "Dim" -NoNewline
        Write-ColorText $db.Error "Error"
    }
}

# ============================================
# HEALTH CHECK FUNCTIONS
# ============================================

function Test-AppHealth {
    Write-Header "Health Check"
    
    $health = @{
        App       = $false
        Database  = $false
        API       = $false
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    # Test App
    Write-ColorText "  Testing App (localhost:$Port)... " "Info" -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $health.App = $true
            Write-ColorText "OK" "Success"
        } else {
            Write-ColorText "FAILED (Status: $($response.StatusCode))" "Error"
        }
    } catch {
        Write-ColorText "FAILED - $($_.Exception.Message)" "Error"
    }
    
    # Test API
    Write-ColorText "  Testing API (/api/version)... " "Info" -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/version" -TimeoutSec 10
        $health.API = $true
        Write-ColorText "OK (v$($response.version))" "Success"
    } catch {
        Write-ColorText "FAILED - $($_.Exception.Message)" "Error"
    }
    
    # Test Database
    Write-ColorText "  Testing Database... " "Info" -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/analytics?type=overview" -TimeoutSec 10
        $health.Database = $true
        Write-ColorText "OK ($($response.totalArticles) articles)" "Success"
    } catch {
        Write-ColorText "FAILED - $($_.Exception.Message)" "Error"
    }
    
    # Summary
    Write-Section "Health Summary"
    $allHealthy = $health.App -and $health.Database -and $health.API
    
    if ($allHealthy) {
        Write-ColorText "  Status: ALL SYSTEMS HEALTHY" "Success"
    } else {
        Write-ColorText "  Status: ISSUES DETECTED" "Error"
    }
    
    Write-ColorText "  Timestamp: $($health.Timestamp)" "Dim"
    
    return $health
}

# ============================================
# DIAGNOSTICS FUNCTIONS
# ============================================

function Show-Diagnostics {
    Write-Header "Full Diagnostics"
    
    # System Info
    Write-Section "System Information"
    $os = Get-CimInstance Win32_OperatingSystem
    Write-ColorText "  OS:              " "Dim" -NoNewline
    Write-ColorText $os.Caption "Highlight"
    Write-ColorText "  Memory (Free):   " "Dim" -NoNewline
    Write-ColorText "$([math]::Round($os.FreePhysicalMemory / 1MB, 2)) GB" "Highlight"
    Write-ColorText "  CPU:             " "Dim" -NoNewline
    $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
    Write-ColorText "$($cpu.Name)" "Highlight"
    
    # Network Info
    Write-Section "Network Information"
    $localIP = Get-LocalIPAddress
    Write-ColorText "  Local IP:        " "Dim" -NoNewline
    Write-ColorText $localIP "Highlight"
    
    Write-ColorText "  App URL:         " "Dim" -NoNewline
    Write-ColorText "http://${localIP}:$Port" "Success"
    
    Write-ColorText "  Local URL:       " "Dim" -NoNewline
    Write-ColorText "http://localhost:$Port" "Success"
    
    # All IPs
    Write-ColorText "`n  All Network Interfaces:" "Info"
    Get-AllLocalIPAddresses | Format-Table @{L='Interface';E={$_.Interface}}, @{L='IP Address';E={$_.IP}}, @{L='Type';E={$_.Type}} -AutoSize
    
    # Port Status
    Write-Section "Port Status"
    $ports = Get-AllListeningPorts
    $ports | Format-Table @{L='Port';E={$_.Port}}, @{L='Status';E={$_.Status}}, @{L='Process';E={$_.ProcessName}}, @{L='PID';E={$_.ProcessId}}, @{L='Purpose';E={$_.Purpose}} -AutoSize
    
    # Process Status
    Write-Section "App Processes"
    $processes = Get-AppProcesses
    if ($processes.Count -gt 0) {
        $processes | Format-Table -AutoSize
    } else {
        Write-ColorText "  No app processes running" "Warning"
    }
    
    # Database Status
    Show-DatabaseInfo
    
    # Dependencies
    Write-Section "Dependencies"
    
    # Node.js
    Write-ColorText "  Node.js:    " "Dim" -NoNewline
    try {
        $nodeVersion = (node --version 2>$null).Trim()
        if ($nodeVersion) {
            Write-ColorText $nodeVersion "Success"
        } else {
            Write-ColorText "Not installed" "Warning"
        }
    } catch {
        Write-ColorText "Not installed" "Warning"
    }
    
    # Bun
    Write-ColorText "  Bun:        " "Dim" -NoNewline
    try {
        $bunVersion = (bun --version 2>$null).Trim()
        if ($bunVersion) {
            Write-ColorText $bunVersion "Success"
        } else {
            Write-ColorText "Not installed" "Warning"
        }
    } catch {
        Write-ColorText "Not installed" "Warning"
    }
    
    # Git
    Write-ColorText "  Git:        " "Dim" -NoNewline
    try {
        $gitVersion = (git --version 2>$null).Trim() -replace "git version ", ""
        if ($gitVersion) {
            Write-ColorText $gitVersion "Success"
        } else {
            Write-ColorText "Not installed" "Warning"
        }
    } catch {
        Write-ColorText "Not installed" "Warning"
    }
    
    # Prisma
    Write-ColorText "  Prisma:     " "Dim" -NoNewline
    try {
        $prismaPath = Join-Path $PSScriptRoot "node_modules\.bin\prisma.cmd"
        if (Test-Path $prismaPath) {
            $prismaVersion = (& $prismaPath --version 2>$null | Select-String "prisma" | Select-Object -First 1) -replace ".*?(\d+\.\d+\.\d+).*", '$1'
            Write-ColorText $prismaVersion "Success"
        } else {
            Write-ColorText "Not installed (run setup)" "Warning"
        }
    } catch {
        Write-ColorText "Not installed" "Warning"
    }
    
    # Environment
    Write-Section "Environment"
    $envPath = Join-Path $PSScriptRoot ".env"
    Write-ColorText "  .env file:  " "Dim" -NoNewline
    if (Test-Path $envPath) {
        Write-ColorText "Exists" "Success"
        $envContent = Get-Content $envPath -ErrorAction SilentlyContinue
        $dbUrl = $envContent | Where-Object { $_ -like "DATABASE_URL*" }
        if ($dbUrl) {
            Write-ColorText "  DATABASE_URL: " "Dim" -NoNewline
            # Mask sensitive parts
            $maskedDbUrl = $dbUrl -replace "(file:).*", '$1***'
            Write-ColorText $maskedDbUrl "Highlight"
        }
    } else {
        Write-ColorText "Not found" "Error"
    }
}

function Show-Status {
    Write-Header "Quick Status"
    
    # Get local IP
    $localIP = Get-LocalIPAddress
    
    # App Status
    Write-Section "App Status"
    $portListening = Test-PortListening -Port $Port
    if ($portListening) {
        $proc = Get-PortProcess -Port $Port
        Write-ColorText "  Status:     " "Dim" -NoNewline
        Write-ColorText "RUNNING" "Success"
        Write-ColorText "  Local URL:  " "Dim" -NoNewline
        Write-ColorText "http://localhost:$Port" "Highlight"
        Write-ColorText "  Network URL:" "Dim" -NoNewline
        Write-ColorText "http://${localIP}:$Port" "Highlight"
        if ($proc) {
            Write-ColorText "  Process:    " "Dim" -NoNewline
            Write-ColorText "$($proc.ProcessName) (PID: $($proc.ProcessId))" "Highlight"
        }
    } else {
        Write-ColorText "  Status:     " "Dim" -NoNewline
        Write-ColorText "NOT RUNNING" "Error"
    }
    
    # Database Status
    Write-Section "Database Status"
    $db = Get-DatabaseStatus
    Write-ColorText "  Type:       " "Dim" -NoNewline
    Write-ColorText $db.Type "Highlight"
    Write-ColorText "  Location:   " "Dim" -NoNewline
    Write-ColorText $db.Location "Highlight"
    Write-ColorText "  Live:       " "Dim" -NoNewline
    if ($db.Live) {
        Write-ColorText "YES" "Success"
    } else {
        Write-ColorText "NO" "Error"
    }
    
    # Quick Health
    Write-Section "Quick Health"
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$Port/api/version" -TimeoutSec 5 -ErrorAction Stop
        Write-ColorText "  Version:    " "Dim" -NoNewline
        Write-ColorText $response.version "Highlight"
        Write-ColorText "  API:        " "Dim" -NoNewline
        Write-ColorText "OK" "Success"
    } catch {
        Write-ColorText "  API:        " "Dim" -NoNewline
        Write-ColorText "ERROR" "Error"
    }
}

# ============================================
# INTERACTIVE MENU
# ============================================

function Show-Menu {
    Clear-Host
    Write-ColorText @"

  ╔═══════════════════════════════════════════════════════════════╗
  ║     $ScriptName v$ScriptVersion                         ║
  ╠═══════════════════════════════════════════════════════════════╣
  ║                                                               ║
  ║   [1] Status        - Quick status overview                   ║
  ║   [2] Health        - Run health check                        ║
  ║   [3] Diagnostics   - Full system diagnostics                 ║
  ║   [4] Kill          - Kill all app processes                  ║
  ║   [5] Logs          - View recent logs                        ║
  ║   [Q] Quit          - Exit this tool                          ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝

"@ "Header"
}

function Show-Logs {
    Write-Header "Recent Logs"
    
    $logFiles = @(
        Join-Path $PSScriptRoot "dev.log"
        Join-Path $PSScriptRoot "server.log"
    )
    
    foreach ($logFile in $logFiles) {
        if (Test-Path $logFile) {
            Write-ColorText "`n  Log: $logFile" "Info"
            Write-ColorText "  " + ("-" * 60) "Dim"
            $content = Get-Content $logFile -Tail 30 -ErrorAction SilentlyContinue
            foreach ($line in $content) {
                if ($line -match "error|Error|ERROR|fail|Fail|FAIL") {
                    Write-ColorText "  $line" "Error"
                } elseif ($line -match "warn|Warn|WARN") {
                    Write-ColorText "  $line" "Warning"
                } elseif ($line -match "success|Success|SUCCESS|ready|Ready|READY") {
                    Write-ColorText "  $line" "Success"
                } else {
                    Write-ColorText "  $line" "Dim"
                }
            }
        }
    }
    
    if (-not (Test-Path $logFiles[0]) -and -not (Test-Path $logFiles[1])) {
        Write-ColorText "  No log files found" "Warning"
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function Start-InteractiveMenu {
    do {
        Show-Menu
        
        # Show quick status at bottom
        $localIP = Get-LocalIPAddress
        $portListening = Test-PortListening -Port $Port
        if ($portListening) {
            Write-ColorText "  App: " "Dim" -NoNewline
            Write-ColorText "RUNNING" "Success" -NoNewline
            Write-ColorText " | " "Dim" -NoNewline
            Write-ColorText "http://${localIP}:$Port" "Highlight"
        } else {
            Write-ColorText "  App: " "Dim" -NoNewline
            Write-ColorText "NOT RUNNING" "Error"
        }
        
        Write-Host ""
        $choice = Read-Host "  Select option"
        
        switch ($choice.ToUpper()) {
            '1' { 
                Show-Status
                Read-Host "`n  Press Enter to continue"
            }
            '2' { 
                Test-AppHealth
                Read-Host "`n  Press Enter to continue"
            }
            '3' { 
                Show-Diagnostics
                Read-Host "`n  Press Enter to continue"
            }
            '4' { 
                Stop-AppProcesses
                Read-Host "`n  Press Enter to continue"
            }
            '5' { 
                Show-Logs
            }
            'Q' { 
                Write-ColorText "`n  Goodbye!`n" "Info"
                return
            }
            default {
                Write-ColorText "`n  Invalid option" "Error"
                Start-Sleep -Seconds 1
            }
        }
    } while ($true)
}

# ============================================
# MAIN
# ============================================

# Handle direct action
if ($Action) {
    switch ($Action) {
        'kill' { Stop-AppProcesses }
        'health' { Test-AppHealth }
        'diagnostics' { Show-Diagnostics }
        'status' { Show-Status }
        'monitor' { Start-InteractiveMenu }
    }
} else {
    # Start interactive menu
    Start-InteractiveMenu
}
