// App Version Configuration
export const APP_VERSION = {
  version: '2.4.0',
  versionName: 'Playwright Demo & Credentials',
  releaseDate: '2025-01-18',
  buildNumber: 240,
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
        version: '2.4.0',
        date: '2025-01-18',
        changes: [
          'NEW: Playwright demo script for automated screenshots',
          'NEW: Default demo credentials in setup',
          'NEW: Interactive API key configuration prompt',
          'NEW: Credentials change reminder system',
          'NEW: E2E test configuration with Playwright',
          'IMPROVED: Setup script with credential warnings',
          'IMPROVED: Environment file with API key documentation',
        ],
      },
      {
        version: '2.3.0',
        date: '2025-01-18',
        changes: [
          'NEW: One-click PowerShell setup script (setup.ps1)',
          'NEW: Progress bar with real-time status updates',
          'NEW: Comprehensive logging system (setup.log)',
          'NEW: Error handling with 15 error codes and solutions',
          'NEW: Playwright error screenshot capture tool',
          'NEW: FAQ & Troubleshooting documentation',
          'NEW: Quick start script (start.ps1)',
        ],
      },
      {
        version: '2.2.0',
        date: '2025-01-18',
        changes: [
          'NEW: Complete SEO optimization with meta tags',
          'NEW: Open Graph & Twitter Card support',
          'NEW: Structured data (JSON-LD) for search engines',
          'NEW: Sitemap.xml for better crawling',
          'NEW: Web app manifest for PWA support',
        ],
      },
    ],
  };
}
