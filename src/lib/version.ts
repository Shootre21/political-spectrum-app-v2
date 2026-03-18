// App Version Configuration
export const APP_VERSION = {
  version: '2.2.0',
  versionName: 'SEO Optimized',
  releaseDate: '2025-01-18',
  buildNumber: 220,
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
        version: '2.2.0',
        date: '2025-01-18',
        changes: [
          'NEW: Complete SEO optimization with meta tags',
          'NEW: Open Graph & Twitter Card support',
          'NEW: Structured data (JSON-LD) for search engines',
          'NEW: Sitemap.xml for better crawling',
          'NEW: Web app manifest for PWA support',
          'IMPROVED: Repository tags for GitHub discoverability',
        ],
      },
      {
        version: '2.1.0',
        date: '2025-01-18',
        changes: [
          'NEW: Analytics Dashboard with bias distribution charts',
          'NEW: Author Political Leanings view with 18 journalists',
          'NEW: System Test endpoint to verify all functionality',
          'NEW: Article thumbnails with theme indicators',
          'IMPROVED: Static fallback data for offline operation',
        ],
      },
      {
        version: '2.0.0',
        date: '2025-01-18',
        changes: [
          'MAJOR: Algorithm-based 3-layer scoring pipeline',
          'NEW: Outlet baseline bias database',
          'NEW: Settings page for API key configuration',
        ],
      },
    ],
  };
}
