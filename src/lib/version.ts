// App Version Configuration
export const APP_VERSION = {
  version: '3.5.0',
  versionName: 'Share & Misc Pages',
  releaseDate: '2026-03-24',
  buildNumber: 350,
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
        version: '3.5.0',
        date: '2026-03-24',
        changes: [
          'NEW: Share Page (/share) - Social sharing with Twitter, Facebook, LinkedIn, etc.',
          'NEW: Misc Page (/misc) - FAQ, resources, support, and contact information',
          'NEW: Enhanced footer with three-column layout (PRODUCT, COMPANY, CONNECT)',
          'NEW: QR code section for mobile sharing',
          'NEW: Embed options for widgets and badges',
          'NEW: Community impact stats showing share counts',
          'IMPROVED: Consistent dark footer styling throughout the app',
        ],
      },
      {
        version: '3.4.2',
        date: '2026-03-24',
        changes: [
          'NEW: Blindspot Alert - Shows coverage disparity between political leanings',
          'NEW: Visual warning when one side has 20%+ more coverage than the other',
          'NEW: Mini coverage distribution chart within alert',
          'NEW: Color-coded alerts (red for right undercoverage, blue for left undercoverage)',
          'IMPROVED: Better awareness of media bias and coverage gaps',
          'IMPROVED: Encourages exploring diverse sources for balanced perspective',
        ],
      },
      {
        version: '3.4.1',
        date: '2026-03-24',
        changes: [
          'NEW: Validation utilities for all numeric values',
          'NEW: validateBiasScore (-3 to +3), validateSpectrumScore (-10 to +10)',
          'NEW: validateReliabilityScore (0-100), validateConfidence (0-1)',
          'NEW: validatePercentage, validateCount for safe display',
          'NEW: URL and date validation helpers',
          'IMPROVED: All displayed numbers are properly clamped and validated',
          'IMPROVED: EnhancedHeadlineCard with validated bias scores and reliability',
          'IMPROVED: CoverageDetailsSidebar with validated percentages',
          'FIX: Prevents NaN and undefined values in UI',
        ],
      },
      {
        version: '3.4.0',
        date: '2026-03-24',
        changes: [
          'NEW: Enhanced headline cards with source dates and bias indicators',
          'NEW: Coverage Details sidebar with bias distribution visualization',
          'NEW: Similar Topics section with expandable topic chips',
          'NEW: Other News Sources section showing related articles',
          'IMPROVED: Visual design with dark mode support',
          'IMPROVED: Responsive grid layout (1 column mobile → 4 columns desktop)',
        ],
      },
      {
        version: '3.3.1',
        date: '2026-03-23',
        changes: [
          'FIX: Prisma CLI now works on Windows with DATABASE_URL set automatically',
          'FIX: db:push, db:migrate, db:reset scripts now use cross-env for cross-platform support',
          'FIX: Cross-origin access blocked error - added allowedDevOrigins config',
          'ADDED: postinstall script to auto-generate Prisma client',
          'ADDED: cross-env dev dependency for Windows/Linux/Mac compatibility',
        ],
      },
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
