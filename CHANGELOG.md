# Changelog

All notable changes to the Political News Spectrum app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0] - 2026-03-23

### Critical Fixes

#### Database Auto-Configuration
The app now **automatically configures the database** - no manual setup needed!

- **FIXED**: `DATABASE_URL not found` error that prevented articles from loading
- **FIXED**: App now starts successfully even without `.env` file
- **FIXED**: Database path defaults to `./db/custom.db` automatically

### Changed

- **Database Module** (`src/lib/db.ts`)
  - Added automatic DATABASE_URL fallback to `file:./db/custom.db`
  - Added `isDbAvailable()` function to check database status
  - Added `getDbError()` function to get last error
  - Added `getDbUrl()` function to get current database URL
  - Improved logging for troubleshooting

- **Environment Files** (`.env`, `.env.example`)
  - Updated with clearer instructions
  - Better organized sections
  - Clear indication that NO configuration is needed

### Why This Matters

Previously, users had to:
1. Create `.env` file manually
2. Add `DATABASE_URL="file:./db/custom.db"`
3. Run `prisma generate`
4. Hope it worked

Now:
1. Just run `bun run dev` - that's it!

The app handles all database configuration automatically.

---

## [3.1.0] - 2026-03-23

### Major Changes

#### Removed ZAI SDK Dependency
The app now runs **100% independently** without any external AI service dependency.

- **No more rate limits** - run the app as much as you want
- **No external API required** for core functionality
- **Privacy-first** - article text never leaves your machine

### Added

- **Real RSS Feed Fetching** (`src/lib/news-fetcher.ts`)
  - Fetches actual news from 15+ real news sources
  - Left-leaning: NYT, Washington Post, HuffPost, MSNBC, Vox
  - Center: NPR, Associated Press, Reuters, Politico, Axios
  - Right-leaning: Fox News, Daily Wire, National Review, Washington Times, Townhall
  - Articles stored in database automatically

### Changed

- **Algorithm Analysis is now PRIMARY** (default method)
  - Works 100% offline
  - No API keys needed
  - Uses outlet baselines, topic framing, source diversity

- **AI Analysis is now SECONDARY** (optional)
  - Only available if user configures their own API keys
  - Supports: OpenAI, Anthropic, Google Gemini, xAI Grok, Moonshot Kimi
  - Uses user's own API keys (no shared rate limits)

- **Headlines API** (`/api/headlines`)
  - Now uses RSS feeds instead of AI generation
  - Returns real news from real sources
  - Works without any configuration

- **Settings UI**
  - Removed ZAI API key option
  - Updated AI provider documentation

### Removed

- `z-ai-web-dev-sdk` dependency from package.json
- ZAI API key configuration option
- AI dependency from core article loading

### Technical Details

| Component | Before | After |
|-----------|--------|-------|
| Headlines | AI-generated (ZAI SDK) | Real RSS feeds |
| Analysis Primary | AI or Algorithm | Algorithm only |
| Analysis Secondary | AI (ZAI SDK) | AI (User's keys) |
| Rate Limits | Yes (ZAI) | None |
| External Dependency | Required | Optional |

### Migration Guide

If you were using AI features before:

1. Go to Settings
2. Add your own API key (OpenAI, Anthropic, etc.)
3. AI analysis will be available as an option

If you weren't using AI:

- No changes needed! The app works better than ever with RSS feeds.

---

## [3.0.2] - 2026-03-23

### Fixed

- Pinned Prisma to v6.11.1 (v7 has breaking changes)
- Removed Unix-only `tee` command from dev script
- setup.ps1 now installs correct Prisma version
- Database path corrected to `./db/custom.db`
- Prisma client generation now runs before build

### Improved

- Better error messages with version-specific solutions

---

## [3.0.0] - 2026-03-23

### Added

- Interactive management console with real-time commands
- `manage.ps1` - Standalone process manager & diagnostics tool
- `kill.ps1` - Quick process termination script
- Network info display (Local IP, App URL, Database status)
- Interactive commands while logs streaming
- Database status monitoring

---

## Version History

| Version | Name | Key Feature |
|---------|------|-------------|
| 3.2.0 | Database Auto-Config | Automatic database setup |
| 3.1.0 | Independent Operation | No external AI dependency |
| 3.0.2 | Windows Compatibility Fix | Prisma v6 pin |
| 3.0.0 | Management Console | Interactive tools |
| 2.0.0 | Algorithm Overhaul | 3-layer scoring |
| 1.0.0 | Initial Release | Basic analysis |

---

[3.2.0]: https://github.com/Shootre21/political-spectrum-app-v2/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/Shootre21/political-spectrum-app-v2/compare/v3.0.2...v3.1.0
