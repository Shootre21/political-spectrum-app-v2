# Changelog

All notable changes to the Political News Spectrum app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.4.2] - 2026-03-24

### New Features

#### Blindspot Alert
A new feature that alerts users when there's significant coverage disparity between political leanings.

- **Blindspot Alert Component**
  - Automatically calculates coverage disparity between Left and Right outlets
  - Shows alert when one side has 20%+ more coverage than the other
  - Color-coded alerts: Red border for Right undercoverage, Blue for Left undercoverage
  - Mini coverage distribution chart within the alert

- **Alert Display**
  - Shows percentage difference in coverage
  - Displays article counts for each leaning
  - Visual progress bars for Left/Center/Right distribution
  - Encourages exploring diverse sources

### Technical Details

| Component | Change |
|-----------|--------|
| BlindspotAlert | NEW - Coverage disparity detection and alert |
| Headlines View | Updated - Added Blindspot Alert before articles |

### User Benefit

This feature helps users understand potential media blindspots and encourages them to:
- Seek out diverse perspectives
- Understand coverage gaps in current news
- Make more informed decisions about their news consumption

---

## [3.4.1] - 2026-03-24

### New Features

#### Validation & Data Integrity
- **Validation Utilities** for all numeric values
  - `validateBiasScore()` - Clamps values to -3 to +3 range
  - `validateSpectrumScore()` - Clamps values to -10 to +10 range
  - `validateReliabilityScore()` - Clamps values to 0-100 range
  - `validateConfidence()` - Clamps values to 0-1 range
  - `validatePercentage()` - Ensures valid percentages (0-100)
  - `validateCount()` - Ensures non-negative integers
- **URL and Date Validation** helpers
- **Spectrum Label Helper** - Converts scores to readable labels

### Changed

- **Enhanced Headline Cards** with validated data
  - All bias scores validated before display
  - Reliability percentages properly clamped
  - Prevents NaN and undefined values in UI
- **Coverage Details Sidebar** with validated percentages
  - All counts validated as non-negative integers
  - Percentages calculated with proper guards
- **Source Grid** with validated outlet data
  - Each outlet's bias and reliability validated
  - Tooltip shows validated scores

### Technical Details

| Component | Change |
|-----------|--------|
| Validation Utils | NEW - validateBiasScore, validateSpectrumScore, etc. |
| EnhancedHeadlineCard | Updated with validation for all numeric props |
| CoverageDetailsSidebar | Updated with validated counts and percentages |

---

## [3.4.0] - 2026-03-24

### New Features

#### Enhanced UI & Visual Design
- **Enhanced Headline Cards** with source dates, publication info, and bias indicators
  - Source avatar with bias-colored initials
  - Publication time with relative formatting (e.g., "3 hours ago")
  - Country/location indicator
  - Reliability badge (Very High/High/Medium/Low/Very Low)
  - Bias indicator bar with gradient and position marker

- **Coverage Details Sidebar**
  - Total article count badge
  - Left/Center/Right breakdown with counts and percentages
  - Last Updated timestamp
  - Visual bias distribution bar (blue-gray-red segments)
  - News source logo grid with bias-colored avatars

- **Similar Topics Section**
  - Collapsible panel with expand/collapse functionality
  - Topic chips with icons (US Politics, Democratic Party, Donald Trump, etc.)
  - Article counts displayed for each topic
  - Clickable to filter articles

- **Other News Sources Section**
  - Scrollable list of related articles from different outlets
  - Shows outlet name, headline, bias score, and publication time
  - Clickable items to analyze specific articles

### Changed

- **Visual Design Improvements**
  - Full dark mode support with proper contrast
  - Color-coded border indicators on cards
  - Gradient bias bars throughout (blue = left, gray = center, red = right)
  - Modern hover effects and shadows
  - Responsive grid layout (1 column mobile → 4 columns desktop)

### Technical Details

| Component | Change |
|-----------|--------|
| Headline Cards | Enhanced with bias indicators, dates, reliability badges |
| Coverage Sidebar | NEW - Shows coverage statistics and source distribution |
| Similar Topics | NEW - Expandable topic filtering section |
| Other Sources | NEW - Related articles from different outlets |
| Helper Functions | formatTimeAgo, getBiasColor, getReliabilityBadge, getOutletInitials |

---

## [3.3.1] - 2026-03-23

### Fixed

#### Windows Compatibility
- **FIXED**: Prisma CLI now works on Windows with `DATABASE_URL` set automatically
- **FIXED**: `db:push`, `db:migrate`, `db:reset` scripts now use cross-env for cross-platform support
- **FIXED**: Cross-origin access blocked error - added `allowedDevOrigins` config

### Changed

- **Package Scripts**
  - Added `postinstall` script to auto-generate Prisma client
  - All db scripts now use `cross-env` for Windows/Linux/Mac compatibility
  - DATABASE_URL is set inline for Prisma CLI commands

- **Next.js Config**
  - Added `allowedDevOrigins` for network access in development
  - Allows access from local network IPs (e.g., 10.30.1.26)

### Technical Details

| Component | Change |
|-----------|--------|
| package.json | Added cross-env to db scripts |
| package.json | Added postinstall script |
| next.config.ts | Added allowedDevOrigins |
| Dependencies | Added cross-env dev dependency |

---

## [3.3.0] - 2026-03-23

### New Features

#### Article Content Reader
- **Read Article button** - Fetch and display full article content (when available)
- **Paywall detection** - Warns when articles may be paywalled
- **Content extraction** - Uses cheerio to extract readable content from URLs
- **Works independently** - No external AI dependencies

#### Article Archiving
- **Archive button** - Save articles for later reading
- **Full content storage** - Archived articles include full text
- **Analysis preservation** - All bias analysis data is preserved
- **Easy retrieval** - View archived articles from the Archive tab

### Changed

- **Enhanced Signal Analysis Display**
  - Progress bars for each signal metric
  - Better visual representation of scores
  - More intuitive 0-10 scale display

- **Database Schema**
  - Added `isArchived` field to Article model
  - Added `fullContent` field for article text storage

### Technical Details

| Component | Change |
|-----------|--------|
| Article Fetcher | NEW - `src/lib/article-fetcher.ts` |
| Content API | NEW - `src/app/api/content/route.ts` |
| Archive API | NEW - `src/app/api/archive/route.ts` |
| Signal Display | Enhanced with progress bars |
| Prisma Schema | Added isArchived, fullContent |

---

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
| 3.4.2 | Blindspot Alert | Coverage disparity detection & alerts |
| 3.4.1 | Validation & Data Integrity | All numbers validated and clamped |
| 3.4.0 | Enhanced UI & Coverage | New headline cards, coverage sidebar, topics |
| 3.3.1 | Windows Fix | Cross-platform Prisma scripts |
| 3.3.0 | Archive & Content Reader | Article fetching & archiving |
| 3.2.0 | Database Auto-Config | Automatic database setup |
| 3.1.0 | Independent Operation | No external AI dependency |
| 3.0.2 | Windows Compatibility Fix | Prisma v6 pin |
| 3.0.0 | Management Console | Interactive tools |
| 2.0.0 | Algorithm Overhaul | 3-layer scoring |
| 1.0.0 | Initial Release | Basic analysis |

---

[3.4.2]: https://github.com/Shootre21/political-spectrum-app-v2/compare/v3.4.1...v3.4.2
[3.4.1]: https://github.com/Shootre21/political-spectrum-app-v2/compare/v3.4.0...v3.4.1
[3.4.0]: https://github.com/Shootre21/political-spectrum-app-v2/compare/v3.3.1...v3.4.0
[3.3.1]: https://github.com/Shootre21/political-spectrum-app-v2/compare/v3.3.0...v3.3.1
