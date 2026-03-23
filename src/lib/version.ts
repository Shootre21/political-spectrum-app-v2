// App Version Configuration
export const APP_VERSION = {
  version: '3.0.0',
  versionName: 'Interactive Management & Network Tools',
  releaseDate: '2026-03-23',
  buildNumber: 300,
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
      {
        version: '2.5.0',
        date: '2025-01-18',
        changes: [
          'NEW: Provider-specific API handling for each AI model',
          'NEW: Comprehensive AI provider documentation',
          'NEW: API key format validation per provider',
          'NEW: Provider-specific error messages with solutions',
        ],
      },
      {
        version: '2.4.0',
        date: '2025-01-18',
        changes: [
          'NEW: Playwright demo script for automated screenshots',
          'NEW: Default demo credentials in setup',
          'NEW: Interactive API key configuration prompt',
        ],
      },
    ],
  };
}
