// App Version Configuration
export const APP_VERSION = {
  version: '3.2.0',
  versionName: 'Database Auto-Config',
  releaseDate: '2026-03-23',
  buildNumber: 320,
};

export type UpdateStatus = 'up-to-date' | 'update-available' | 'unknown';

export interface VersionInfo {
  version: string;
  versionName: string;
  releaseDate: string;
  changelog: {
    version: string;
    date: string;
    changes: string[];
  }[];
}

export function getVersionInfo(): VersionInfo {
  return {
    version: APP_VERSION.version,
    versionName: APP_VERSION.versionName,
    releaseDate: APP_VERSION.releaseDate,
    changelog: [
      {
        version: '3.2.0',
        date: '2026-03-23',
        changes: [
          'CRITICAL FIX: Database now auto-configures - no manual setup needed',
          'FIX: DATABASE_URL environment variable now has automatic fallback',
          'FIX: App starts successfully even without .env file',
          'IMPROVED: Better database initialization with detailed logging',
          'IMPROVED: Added isDbAvailable(), getDbError(), getDbUrl() helper functions',
          'UPDATED: .env file with clearer instructions',
          'UPDATED: FAQ with current version info and database troubleshooting',
        ],
      },
      {
        version: '3.1.0',
        date: '2026-03-23',
        changes: [
          'MAJOR: Removed ZAI SDK dependency - app now runs 100% independently',
          'NEW: Real RSS feed fetching from 15+ news sources (NYT, Fox, NPR, etc.)',
          'NEW: news-fetcher.ts module for parsing RSS feeds without AI',
          'CHANGED: Algorithm analysis is now the PRIMARY method (always works)',
          'CHANGED: AI analysis is now SECONDARY and optional (requires user\'s own API keys)',
          'CHANGED: Headlines API now uses RSS feeds instead of AI generation',
          'IMPROVED: No rate limits - run as much as you want',
          'IMPROVED: No external dependencies for core functionality',
          'IMPROVED: Privacy-first - article text never leaves your machine',
          'REMOVED: ZAI SDK from package.json',
          'REMOVED: ZAI API key option from settings',
          'UPDATED: Documentation to reflect independent operation',
        ],
      },
      {
        version: '3.0.2',
        date: '2026-03-23',
        changes: [
          'FIX: Pinned Prisma to v6.11.1 (v7 has breaking changes)',
          'FIX: Removed Unix-only "tee" command from dev script',
          'FIX: setup.ps1 now installs correct Prisma version',
          'FIX: Database path corrected to ./db/custom.db',
          'FIX: Prisma client generation now runs before build',
          'IMPROVED: Better error messages with version-specific solutions',
        ],
      },
      {
        version: '3.0.0',
        date: '2026-03-23',
        changes: [
          'NEW: Interactive management console with real-time commands',
          'NEW: manage.ps1 - Standalone process manager & diagnostics tool',
          'NEW: kill.ps1 - Quick process termination script',
          'NEW: Network info display (Local IP, App URL, Database status)',
          'NEW: Interactive commands while logs streaming: [H]ealth [D]iagnostics [K]ill [Q]uit',
          'NEW: Database status monitoring (SQLite file location, size, live status)',
          'IMPROVED: Enhanced status dashboard with network and database info',
          'FIX: Database connection issues (added .env file, Prisma client generation)',
        ],
      },
      {
        version: '2.6.0',
        date: '2025-01-18',
        changes: [
          'NEW: Enhanced political spectrum with Communism/Fascism labels',
          'NEW: Full ideology spectrum from -10 to +10',
          'NEW: Theme settings with Light/Dark/System modes',
          'NEW: Environment variables tab in Settings',
          'NEW: API key status with demo key detection',
          'IMPROVED: Better spectrum score visualization',
          'IMPROVED: Color-coded score categories',
        ],
      },
    ],
  };
}
