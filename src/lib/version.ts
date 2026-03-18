// App Version Configuration
export const APP_VERSION = {
  version: '2.5.0',
  versionName: 'Multi-Provider AI System',
  releaseDate: '2025-01-18',
  buildNumber: 250,
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
        version: '2.5.0',
        date: '2025-01-18',
        changes: [
          'NEW: Provider-specific API handling for each AI model',
          'NEW: Comprehensive AI provider documentation',
          'NEW: API key format validation per provider',
          'NEW: Provider-specific error messages with solutions',
          'NEW: Enhanced round-robin with provider preference',
          'NEW: Model-specific request building',
          'NEW: Provider-specific response parsing',
          'IMPROVED: Better error handling with helpful links',
          'IMPROVED: Provider status with documentation links',
        ],
      },
      {
        version: '2.4.0',
        date: '2025-01-18',
        changes: [
          'NEW: Playwright demo script for automated screenshots',
          'NEW: Default demo credentials in setup',
          'NEW: Interactive API key configuration prompt',
          'NEW: Credentials change reminder system',
          'NEW: E2E test configuration with Playwright',
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
        ],
      },
    ],
  };
}
