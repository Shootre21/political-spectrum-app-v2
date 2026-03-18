<#
.SYNOPSIS
    Political Spectrum App - Quick Start Script
.DESCRIPTION
    Starts the development server with health checks and error handling.
.VERSION
    2.3.0
#>

param(
    [switch]$Prod,
    [switch]$Studio,
    [int]$Port = 3000
)

Write-Host "Starting Political Spectrum App..." -ForegroundColor Cyan

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not found. Running setup..." -ForegroundColor Yellow
    .\setup.ps1
}

# Check if database exists
if (-not (Test-Path "prisma\dev.db")) {
    Write-Host "Database not found. Setting up database..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
}

# Start Prisma Studio if requested
if ($Studio) {
    Write-Host "Starting Prisma Studio on port 5555..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx prisma studio"
}

# Start the app
if ($Prod) {
    Write-Host "Starting production server..." -ForegroundColor Green
    npm run start
} else {
    Write-Host "Starting development server on port $Port..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor DarkGray
    Write-Host ""
    npx next dev --port $Port
}
