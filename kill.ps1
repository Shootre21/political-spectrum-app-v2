#!/usr/bin/env pwsh
#Requires -Version 5.1
<#
.SYNOPSIS
    Kill all Political Spectrum App processes
.DESCRIPTION
    Forcefully terminates all Node.js, Bun, and Next.js processes
    associated with the Political Spectrum App.
.EXAMPLE
    .\kill.ps1
    Kill all app processes
.EXAMPLE
    .\kill.ps1 -Port 3000
    Kill process on specific port
.PARAMETER Port
    Port number to kill (default: 3000)
.PARAMETER Force
    Force kill without confirmation
#>

param(
    [int]$Port = 3000,
    [switch]$Force
)

$ScriptName = "Political Spectrum App - Process Killer"

# Colors
function Write-ColorText {
    param([string]$Text, [string]$Color = 'White')
    Write-Host $Text -ForegroundColor $Color
}

Write-Host ""
Write-ColorText "============================================" "Red"
Write-ColorText "  $ScriptName" "Red"
Write-ColorText "============================================" "Red"
Write-Host ""

$killed = 0
$errors = @()

# Function to get process on port
function Get-ProcessOnPort {
    param([int]$Port)
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($conn) {
            return $conn.OwningProcess
        }
    } catch {}
    return $null
}

# Kill by port
Write-ColorText "Checking port $Port..." "Cyan"
$portPid = Get-ProcessOnPort -Port $Port
if ($portPid) {
    try {
        $proc = Get-Process -Id $portPid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-ColorText "  Found: $($proc.ProcessName) (PID: $portPid) on port $Port" "Yellow"
            if ($Force -or (Read-Host "  Kill it? (Y/n)") -ne 'n') {
                Stop-Process -Id $portPid -Force -ErrorAction SilentlyContinue
                Write-ColorText "  KILLED" "Green"
                $killed++
            }
        }
    } catch {
        $errors += "Failed to kill PID $portPid: $($_.Exception.Message)"
    }
} else {
    Write-ColorText "  No process on port $Port" "DarkGray"
}

# Kill Node.js processes
Write-Host ""
Write-ColorText "Checking Node.js processes..." "Cyan"
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-ColorText "  Found: $($_.ProcessName) (PID: $($_.Id))" "Yellow"
    if ($Force -or (Read-Host "  Kill it? (Y/n)") -ne 'n') {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-ColorText "  KILLED" "Green"
            $killed++
        } catch {
            $errors += "Failed to kill PID $($_.Id): $($_.Exception.Message)"
        }
    }
}

# Kill Bun processes
Write-Host ""
Write-ColorText "Checking Bun processes..." "Cyan"
Get-Process -Name "bun" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-ColorText "  Found: $($_.ProcessName) (PID: $($_.Id))" "Yellow"
    if ($Force -or (Read-Host "  Kill it? (Y/n)") -ne 'n') {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-ColorText "  KILLED" "Green"
            $killed++
        } catch {
            $errors += "Failed to kill PID $($_.Id): $($_.Exception.Message)"
        }
    }
}

# Kill Next.js processes
Write-Host ""
Write-ColorText "Checking Next.js processes..." "Cyan"
Get-Process -Name "next" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-ColorText "  Found: $($_.ProcessName) (PID: $($_.Id))" "Yellow"
    if ($Force -or (Read-Host "  Kill it? (Y/n)") -ne 'n') {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-ColorText "  KILLED" "Green"
            $killed++
        } catch {
            $errors += "Failed to kill PID $($_.Id): $($_.Exception.Message)"
        }
    }
}

# Summary
Write-Host ""
Write-ColorText "============================================" "Red"
Write-ColorText "  Summary: $killed process(es) killed" "White"
if ($errors.Count -gt 0) {
    Write-ColorText "  Errors: $($errors.Count)" "Red"
    $errors | ForEach-Object { Write-ColorText "    - $_" "Red" }
}
Write-ColorText "============================================" "Red"

# Verify port is free
Write-Host ""
Write-ColorText "Verifying port $Port..." "Cyan"
Start-Sleep -Milliseconds 500
$stillRunning = Get-ProcessOnPort -Port $Port
if ($stillRunning) {
    Write-ColorText "  WARNING: Port $Port still in use by PID $stillRunning" "Red"
} else {
    Write-ColorText "  Port $Port is now free" "Green"
}
