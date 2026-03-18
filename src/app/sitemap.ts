import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://political-spectrum-app.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      description: 'Political Spectrum App - AI-powered media bias analysis tool',
    },
    {
      url: `${baseUrl}/?tab=headlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      description: 'Latest news headlines with bias analysis',
    },
    {
      url: `${baseUrl}/?tab=analytics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      description: 'Analytics dashboard with bias distribution charts',
    },
    {
      url: `${baseUrl}/?tab=authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      description: 'Author political leanings database',
    },
    {
      url: `${baseUrl}/?tab=settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      description: 'App settings and API key configuration',
    },
    {
      url: `${baseUrl}/api/headlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.6,
      description: 'Headlines API endpoint',
    },
    {
      url: `${baseUrl}/api/analytics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
      description: 'Analytics API endpoint',
    },
    {
      url: `${baseUrl}/api/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
      description: 'Articles database API endpoint',
    },
  ];
}
