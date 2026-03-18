# Political Spectrum App - FAQ & Troubleshooting Guide

**Version:** 2.3.0  
**Author:** Shootre21  
**Repository:** https://github.com/Shootre21/political-spectrum-app-v2

---

## 🚀 Quick Start

### How do I set up the app?

**One-Click Setup (Windows):**
```powershell
.\setup.ps1
```

**Manual Setup:**
```bash
# Install dependencies
bun install

# Setup database
npx prisma migrate dev --name init

# Start development server
bun run dev
```

### What are the system requirements?

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.0.0 | 20.x LTS |
| Bun | 1.0.0 | Latest |
| RAM | 512MB | 2GB |
| Disk Space | 500MB | 1GB |
| OS | Windows 10, macOS 10.15, Ubuntu 18.04 | Latest |

---

## 🔧 Common Errors & Solutions

### Error E001: Node.js is not installed

**Symptoms:**
- `'node' is not recognized as an internal or external command`
- Setup script fails at prerequisites check

**Solutions:**
```powershell
# Option 1: Using winget (Windows 11+)
winget install OpenJS.NodeJS.LTS

# Option 2: Using Chocolatey
choco install nodejs-lts

# Option 3: Manual install
# Download from https://nodejs.org
```

**After installation, restart PowerShell and verify:**
```powershell
node --version  # Should show v18.x.x or higher
```

---

### Error E002: Node.js version is too old

**Symptoms:**
- `Node.js version is too old (Current: 16.x, Required: 18.0.0)`

**Solutions:**
```powershell
# Check current version
node --version

# Update using nvm (recommended)
nvm install 20
nvm use 20

# Or download latest LTS from https://nodejs.org
```

---

### Error E003: Bun is not installed

**Symptoms:**
- `'bun' is not recognized`
- Warning during setup

**Solutions:**
```powershell
# Install Bun (Windows)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version

# If Bun fails, npm will be used automatically
```

**Note:** Bun is optional but recommended for faster performance. The app works with npm too.

---

### Error E004: Port 3000 is already in use

**Symptoms:**
- `Error: listen EADDRINUSE: address already in use :::3000`
- Development server fails to start

**Solutions:**
```powershell
# Find and kill process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use a different port
.\start.ps1 -Port 3001

# Or modify package.json:
# "dev": "next dev --port 3001"
```

---

### Error E005: Package installation failed

**Symptoms:**
- `npm ERR! code ERESOLVE`
- `bun install failed`
- `node_modules` incomplete

**Solutions:**
```powershell
# Solution 1: Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item bun.lock -ErrorAction SilentlyContinue
bun install

# Solution 2: Use npm with legacy peer deps
Remove-Item node_modules -Recurse -Force
npm install --legacy-peer-deps

# Solution 3: Clear caches
bun pm cache rm
npm cache clean --force
bun install

# Solution 4: Check for network/proxy issues
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
```

---

### Error E006: Database migration failed

**Symptoms:**
- `Prisma Migrate could not create the database`
- `SQLite database file not found`

**Solutions:**
```powershell
# Solution 1: Reset database
npx prisma migrate reset --force

# Solution 2: Push schema directly
npx prisma db push

# Solution 3: Create database manually
New-Item -ItemType Directory -Path prisma -Force
npx prisma migrate dev --name init

# Solution 4: Check database URL
# Ensure .env contains:
# DATABASE_URL="file:./dev.db"
```

---

### Error E007: Prisma client generation failed

**Symptoms:**
- `PrismaClient is not defined`
- `Cannot find module '@prisma/client'`

**Solutions:**
```powershell
# Generate Prisma client
npx prisma generate

# If that fails, reinstall Prisma
bun add prisma @prisma/client
npx prisma generate

# Check schema for errors
npx prisma validate
```

---

### Error E008: Environment file creation failed

**Symptoms:**
- `DATABASE_URL is not defined`
- Setup creates .env but app doesn't see it

**Solutions:**
```powershell
# Create .env manually
@"
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
"@ | Out-File -FilePath .env -Encoding utf8

# Verify file exists
Get-Content .env

# Restart development server
```

---

### Error E009: Build failed

**Symptoms:**
- `Build failed with errors`
- TypeScript compilation errors

**Solutions:**
```powershell
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npx eslint src --ext .ts,.tsx

# Clean build cache
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
bun run build

# Check for missing imports
bun install
```

---

### Error E010: Git is not installed

**Symptoms:**
- `'git' is not recognized`
- Cannot clone repository

**Solutions:**
```powershell
# Install Git
winget install Git.Git

# Or using Chocolatey
choco install git

# Verify installation
git --version
```

---

### Error E011: Insufficient disk space

**Symptoms:**
- Setup fails silently
- `ENOSPC: no space left on device`

**Solutions:**
```powershell
# Check disk space
Get-PSDrive -Name C

# Clean up caches
npm cache clean --force
Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue

# Remove unnecessary node_modules
Remove-Item node_modules -Recurse -Force
bun install  # Reinstall
```

---

### Error E012: Permission denied

**Symptoms:**
- `EACCES: permission denied`
- Cannot write to directory

**Solutions:**
```powershell
# Run PowerShell as Administrator

# Or fix folder permissions
icacls . /grant:r "Users:(OI)(CI)F" /T

# Or use a different directory
cd $env:USERPROFILE
git clone https://github.com/Shootre21/political-spectrum-app-v2
```

---

### Error E013: Network connection failed

**Symptoms:**
- `network request failed`
- `ETIMEDOUT`

**Solutions:**
```powershell
# Check internet connection
Test-Connection google.com -Count 1

# Configure npm proxy (if behind corporate firewall)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or disable proxy
npm config delete proxy
npm config delete https-proxy

# Use different registry
npm config set registry https://registry.npmmirror.com
```

---

### Error E014: Prisma CLI not found

**Symptoms:**
- `'prisma' is not recognized`
- `npx prisma` fails

**Solutions:**
```powershell
# Install Prisma globally
npm install -g prisma

# Or use npx
npx prisma generate

# Or add to devDependencies
bun add -d prisma
```

---

### Error E015: SQLite database locked

**Symptoms:**
- `database is locked`
- Cannot run migrations

**Solutions:**
```powershell
# Close all connections
Get-Process | Where-Object { $_.Name -like "*node*" -or $_.Name -like "*next*" } | Stop-Process -Force

# Delete lock file
Remove-Item prisma\dev.db-journal -ErrorAction SilentlyContinue

# Restart development server
```

---

## ❓ Frequently Asked Questions

### General Questions

**Q: What AI providers are supported?**

A: The app supports 6 AI providers:
- OpenAI (ChatGPT)
- Anthropic (Claude)
- Moonshot (Kimi)
- Z.ai
- xAI (Grok)
- Google (Gemini)

Configure API keys in the Settings page.

---

**Q: Do I need API keys to use the app?**

A: **No!** The app uses an algorithm-based analysis by default. AI analysis is optional and can be triggered with the "Analyze with AI" button. API keys are only needed for AI-powered analysis.

---

**Q: How does the bias detection algorithm work?**

A: The 3-layer scoring pipeline:
1. **Outlet Baseline**: Inherited bias from the news source (35+ outlets database)
2. **Article Delta**: Deviation from baseline based on framing, language, sources
3. **Final Score**: Combined score with evidence and confidence

---

**Q: Can I add new news outlets?**

A: Yes! Edit `/src/lib/outlets.ts` to add new outlets:

```typescript
{
  name: "New Outlet",
  domain: "newoutlet.com",
  biasScore: 0, // -3 (left) to +3 (right)
  reliabilityScore: 75, // 0-100
  category: "center"
}
```

---

**Q: Is my data stored locally or sent to servers?**

A: All data is stored locally in SQLite. API keys are saved locally and never sent to our servers. AI analysis sends article text to the configured AI provider.

---

### Technical Questions

**Q: How do I reset the database?**

```powershell
npx prisma migrate reset --force
```

---

**Q: How do I view the database?**

```powershell
# Start Prisma Studio
npx prisma studio

# Opens at http://localhost:5555
```

---

**Q: How do I change the default port?**

```powershell
# Option 1: Use start script
.\start.ps1 -Port 3001

# Option 2: Environment variable
$env:PORT=3001; bun run dev

# Option 3: Modify package.json
# "dev": "next dev --port 3001"
```

---

**Q: How do I deploy to production?**

**Vercel (Recommended):**
1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

**Docker:**
```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

**Manual:**
```bash
bun run build
bun run start
```

---

**Q: How do I update the app?**

```powershell
# Pull latest changes
git pull origin master

# Update dependencies
bun install

# Run migrations if any
npx prisma migrate dev

# Restart server
```

---

**Q: How do I contribute?**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

### Troubleshooting Tips

**1. Check Logs:**
```powershell
# View setup log
Get-Content setup.log

# View Next.js logs
# Check terminal output
```

**2. Clear Caches:**
```powershell
# Clear all caches
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue
bun pm cache rm
```

**3. Fresh Install:**
```powershell
# Complete reset
Remove-Item node_modules -Recurse -Force
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item prisma\dev.db -ErrorAction SilentlyContinue
.\setup.ps1 -Force
```

**4. System Test:**
```
Visit: http://localhost:3000/api/test?type=all
```

---

## 📞 Getting Help

1. **Check this FAQ** - Most common issues are documented above
2. **Check GitHub Issues** - https://github.com/Shootre21/political-spectrum-app-v2/issues
3. **Create New Issue** - Include error logs and system info
4. **Discussion Board** - For general questions

When reporting issues, include:
- PowerShell version: `$PSVersionTable.PSVersion`
- Node.js version: `node --version`
- Bun/npm version: `bun --version` or `npm --version`
- Operating system
- Error message and logs
- Steps to reproduce

---

*Last Updated: v2.3.0 - 2025-01-18*
