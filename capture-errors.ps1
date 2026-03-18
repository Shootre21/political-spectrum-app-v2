<#
.SYNOPSIS
    Error Screenshot Capture Tool using Playwright
.DESCRIPTION
    Captures screenshots of common error states for documentation.
.VERSION
    2.3.0
#>

param(
    [string]$OutputDir = ".\docs\errors",
    [switch]$Generate,
    [switch]$Install
)

$ErrorPages = @(
    @{
        Name = "404-Not-Found"
        Url = "http://localhost:3000/nonexistent-page"
        Description = "Page not found error"
    },
    @{
        Name = "500-Server-Error"
        Url = "http://localhost:3000/api/error-test"
        Description = "Internal server error"
    },
    @{
        Name = "Database-Error"
        Url = "http://localhost:3000/api/articles?error=true"
        Description = "Database connection error"
    },
    @{
        Name = "API-Key-Missing"
        Url = "http://localhost:3000/?error=apikey"
        Description = "API key configuration missing"
    },
    @{
        Name = "Network-Timeout"
        Url = "http://localhost:3000/?timeout=true"
        Description = "Network timeout error"
    }
)

if ($Install) {
    Write-Host "Installing Playwright..." -ForegroundColor Cyan
    npm install -D @playwright/test
    npx playwright install chromium
    Write-Host "Playwright installed successfully!" -ForegroundColor Green
    exit 0
}

if ($Generate) {
    Write-Host "Generating error screenshots..." -ForegroundColor Cyan
    
    # Create output directory
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    # Check if Playwright is installed
    if (-not (Test-Path "node_modules\@playwright")) {
        Write-Host "Playwright not found. Run with -Install first." -ForegroundColor Yellow
        exit 1
    }
    
    # Create temporary Playwright script
    $playwrightScript = @'
const { chromium } = require('playwright');
const errors = require('./error-config.json');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  
  for (const error of errors) {
    try {
      console.log(`Capturing: ${error.name}`);
      await page.goto(error.url, { waitUntil: 'networkidle' }).catch(() => {});
      await page.screenshot({ 
        path: `docs/errors/${error.name}.png`,
        fullPage: true 
      });
      console.log(`  Saved: ${error.name}.png`);
    } catch (e) {
      console.log(`  Skipped: ${error.name} (${e.message})`);
    }
  }
  
  await browser.close();
  console.log('Done!');
})();
'@
    
    # Save config
    $ErrorPages | ConvertTo-Json | Out-File "error-config.json" -Encoding utf8
    $playwrightScript | Out-File "capture-errors.cjs" -Encoding utf8
    
    # Run capture
    node capture-errors.cjs
    
    # Cleanup
    Remove-Item "error-config.json" -ErrorAction SilentlyContinue
    Remove-Item "capture-errors.cjs" -ErrorAction SilentlyContinue
    
    Write-Host "Screenshots saved to $OutputDir" -ForegroundColor Green
    exit 0
}

# Default: Show help
Write-Host @"

Error Screenshot Capture Tool
=============================

Usage:
  .\capture-errors.ps1 -Install     Install Playwright
  .\capture-errors.ps1 -Generate    Generate error screenshots

Output: $OutputDir

Error Pages:
$($ErrorPages | ForEach-Object { "  - $($_.Name): $($_.Description)" } | Out-String)

"@ -ForegroundColor Cyan
