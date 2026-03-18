'use client';

import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
}

/**
 * Dynamic SEO component for client-side meta tag updates
 * Use this for dynamic pages where metadata needs to change based on content
 */
export function SEOHead({
  title,
  description,
  keywords,
  image = '/og-image.png',
  url,
  type = 'website',
  article,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title if provided
    if (title) {
      document.title = `${title} | Political Spectrum App`;
    }

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update basic meta tags
    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, true);
      updateMeta('twitter:description', description);
    }

    if (keywords && keywords.length > 0) {
      updateMeta('keywords', keywords.join(', '));
    }

    if (title) {
      updateMeta('og:title', title, true);
      updateMeta('twitter:title', title);
    }

    if (image) {
      updateMeta('og:image', image, true);
      updateMeta('twitter:image', image);
    }

    if (url) {
      updateMeta('og:url', url, true);
      const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonical) {
        canonical.href = url;
      }
    }

    // Article specific meta tags
    if (type === 'article' && article) {
      updateMeta('og:type', 'article', true);
      
      if (article.publishedTime) {
        updateMeta('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        updateMeta('article:modified_time', article.modifiedTime, true);
      }
      if (article.authors) {
        article.authors.forEach((author, i) => {
          updateMeta(`article:author:${i}`, author, true);
        });
      }
      if (article.tags) {
        article.tags.forEach((tag, i) => {
          updateMeta(`article:tag:${i}`, tag, true);
        });
      }
    }
  }, [title, description, keywords, image, url, type, article]);

  return null;
}

/**
 * SEO presets for different pages
 */
export const seoPresets = {
  home: {
    title: 'AI-Powered Media Bias Analysis',
    description: 'Analyze media bias with AI-powered algorithms. Detect political leanings in news articles from 35+ outlets. Transparent, evidence-based analysis.',
    keywords: ['political spectrum', 'media bias', 'news analysis', 'AI'],
  },
  headlines: {
    title: 'News Headlines',
    description: 'Latest news headlines with real-time bias analysis. See political leanings of articles from major news outlets.',
    keywords: ['news headlines', 'bias analysis', 'real-time news', 'political news'],
  },
  analytics: {
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics dashboard showing bias distribution across news sources, topics, and authors.',
    keywords: ['analytics', 'bias distribution', 'media statistics', 'data visualization'],
  },
  authors: {
    title: 'Author Political Leanings',
    description: 'Database of journalists and their political leanings. Track bias patterns by author across articles.',
    keywords: ['journalists', 'authors', 'political leanings', 'reporter bias'],
  },
  settings: {
    title: 'Settings',
    description: 'Configure API keys for AI providers and customize your Political Spectrum App experience.',
    keywords: ['settings', 'API configuration', 'AI providers', 'customization'],
  },
};
