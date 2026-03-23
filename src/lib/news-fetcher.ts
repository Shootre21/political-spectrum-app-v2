/**
 * Real News Fetcher - NO AI REQUIRED
 * 
 * Fetches real headlines from RSS feeds and news APIs.
 * This is the PRIMARY method for loading articles into the database.
 * 
 * Sources:
 * - RSS feeds from major news outlets
 * - NewsAPI (if user provides API key)
 * - Direct web scraping as fallback
 */

import { db } from './db';
import { getOutletInfo, getOutletBias, type OutletInfo } from './outlets';

// RSS Feed URLs by political leaning
const RSS_FEEDS = {
  left: [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', source: 'New York Times', domain: 'nytimes.com' },
    { url: 'https://feeds.washingtonpost.com/rss/politics', source: 'Washington Post', domain: 'washingtonpost.com' },
    { url: 'https://www.huffpost.com/syndication/politics/index.xml', source: 'HuffPost', domain: 'huffpost.com' },
    { url: 'https://www.msnbc.com/feeds/rss/latest', source: 'MSNBC', domain: 'msnbc.com' },
    { url: 'https://www.vox.com/rss/politics/index.xml', source: 'Vox', domain: 'vox.com' },
  ],
  center: [
    { url: 'https://feeds.npr.org/1004/rss.xml', source: 'NPR', domain: 'npr.org' },
    { url: 'https://apnews.com/rss', source: 'Associated Press', domain: 'apnews.com' },
    { url: 'https://www.reuters.com/rssFeed/worldNews', source: 'Reuters', domain: 'reuters.com' },
    { url: 'https://www.politico.com/rss/politics.xml', source: 'Politico', domain: 'politico.com' },
    { url: 'https://api.axios.com/feed/', source: 'Axios', domain: 'axios.com' },
  ],
  right: [
    { url: 'https://feeds.foxnews.com/foxnews/politics', source: 'Fox News', domain: 'foxnews.com' },
    { url: 'https://www.dailywire.com/rss', source: 'Daily Wire', domain: 'dailywire.com' },
    { url: 'https://www.nationalreview.com/politics-political-news/feed/', source: 'National Review', domain: 'nationalreview.com' },
    { url: 'https://feeds.washingtontimes.com/rss/headlines/news/politics', source: 'Washington Times', domain: 'washingtontimes.com' },
    { url: 'https://townhall.com/xml/rss/', source: 'Townhall', domain: 'townhall.com' },
  ],
};

export interface RawArticle {
  title: string;
  url: string;
  source: string;
  domain: string;
  publishedAt: Date;
  description?: string;
  content?: string;
}

export interface FetchedHeadlines {
  left: RawArticle[];
  center: RawArticle[];
  right: RawArticle[];
  total: number;
  fetchedAt: Date;
}

/**
 * Decode HTML entities in text
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&#x27;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '...',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }
  
  // Decode numeric entities like &#39;
  decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
    return String.fromCharCode(parseInt(num, 10));
  });
  
  // Decode hex entities like &#x27;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  return decoded;
}

/**
 * Parse RSS XML feed
 */
function parseRSS(xml: string, feedInfo: { source: string; domain: string }): RawArticle[] {
  const articles: RawArticle[] = [];
  
  try {
    // Simple XML parsing without external dependencies
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      
      const titleMatch = item.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i);
      const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/i);
      const pubDateMatch = item.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i);
      const descMatch = item.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i);
      
      // Get title and decode HTML entities
      let title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
      title = decodeHTMLEntities(title);
      
      const url = linkMatch ? linkMatch[1].trim() : '';
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();
      
      // Get description and decode HTML entities
      let description = descMatch ? (descMatch[1] || descMatch[2] || '').trim() : '';
      description = decodeHTMLEntities(description);
      
      if (title && url) {
        articles.push({
          title: title.replace(/<[^>]*>/g, ''), // Strip HTML tags
          url,
          source: feedInfo.source,
          domain: feedInfo.domain,
          publishedAt: pubDate,
          description: description.replace(/<[^>]*>/g, ''),
        });
      }
    }
  } catch (error) {
    console.error(`Error parsing RSS for ${feedInfo.source}:`, error);
  }
  
  return articles;
}

/**
 * Fetch a single RSS feed
 */
async function fetchRSSFeed(feedInfo: { url: string; source: string; domain: string }): Promise<RawArticle[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(feedInfo.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Political-Spectrum-App/2.0 (News Aggregator)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`RSS fetch failed for ${feedInfo.source}: ${response.status}`);
      return [];
    }
    
    const xml = await response.text();
    return parseRSS(xml, feedInfo);
  } catch (error) {
    console.warn(`Error fetching RSS from ${feedInfo.source}:`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Fetch headlines from all RSS feeds
 */
export async function fetchHeadlinesFromRSS(): Promise<FetchedHeadlines> {
  const results = await Promise.all([
    // Fetch left-leaning sources
    Promise.all(RSS_FEEDS.left.map(fetchRSSFeed)),
    // Fetch center sources
    Promise.all(RSS_FEEDS.center.map(fetchRSSFeed)),
    // Fetch right-leaning sources
    Promise.all(RSS_FEEDS.right.map(fetchRSSFeed)),
  ]);
  
  const left = results[0].flat().slice(0, 10);
  const center = results[1].flat().slice(0, 10);
  const right = results[2].flat().slice(0, 10);
  
  return {
    left,
    center,
    right,
    total: left.length + center.length + right.length,
    fetchedAt: new Date(),
  };
}

/**
 * Store articles in database (ALWAYS happens regardless of AI)
 */
export async function storeArticlesInDatabase(articles: RawArticle[]): Promise<number> {
  let stored = 0;
  
  for (const article of articles) {
    try {
      // Check if article already exists
      const existing = await db.article.findFirst({
        where: {
          url: article.url,
        },
      });
      
      if (existing) {
        continue; // Skip duplicates
      }
      
      // Get outlet bias for initial categorization
      const outlet = getOutletInfo(article.domain);
      
      // Create article in database
      await db.article.create({
        data: {
          id: crypto.randomUUID(),
          title: article.title,
          url: article.url,
          source: article.source,
          publishedAt: article.publishedAt,
          category: 'Politics',
          spectrumScore: outlet?.biasScore || 0,
          popularityScore: 'Medium',
          aiProvider: 'RSS', // Indicates this was fetched, not AI-generated
          updatedAt: new Date(),
        },
      });
      
      stored++;
    } catch (error) {
      console.error(`Error storing article "${article.title}":`, error);
    }
  }
  
  return stored;
}

/**
 * Fetch and store headlines - MAIN ENTRY POINT
 * This is called by the headlines API
 */
export async function fetchAndStoreHeadlines(): Promise<{
  headlines: FetchedHeadlines;
  storedCount: number;
}> {
  // Fetch from RSS feeds
  const headlines = await fetchHeadlinesFromRSS();
  
  // Store ALL articles in database
  const allArticles = [...headlines.left, ...headlines.center, ...headlines.right];
  const storedCount = await storeArticlesInDatabase(allArticles);
  
  return {
    headlines,
    storedCount,
  };
}

/**
 * Get headlines formatted for frontend
 */
export async function getHeadlinesForFrontend(): Promise<{
  leftHeadlines: Array<{
    headline: string;
    source: string;
    url: string;
    emoji: string;
    publishedAt: string;
  }>;
  centerHeadlines: Array<{
    headline: string;
    source: string;
    url: string;
    emoji: string;
    publishedAt: string;
  }>;
  rightHeadlines: Array<{
    headline: string;
    source: string;
    url: string;
    emoji: string;
    publishedAt: string;
  }>;
  provider: string;
  model: string;
}> {
  try {
    // Try to fetch fresh headlines
    const { headlines } = await fetchAndStoreHeadlines();
    
    // Get emoji based on outlet bias
    const getEmoji = (domain: string): string => {
      const outlet = getOutletInfo(domain);
      const bias = outlet?.biasScore || 0;
      
      if (Math.abs(bias) >= 2) return '🔴'; // High bias
      if (Math.abs(bias) >= 1) return '🟠'; // Medium bias
      if (Math.abs(bias) >= 0.5) return '🟡'; // Low bias
      return '🟢'; // Center
    };
    
    return {
      leftHeadlines: headlines.left.slice(0, 4).map(a => ({
        headline: a.title,
        source: a.source,
        url: a.url,
        emoji: getEmoji(a.domain),
        publishedAt: a.publishedAt.toISOString(),
      })),
      centerHeadlines: headlines.center.slice(0, 4).map(a => ({
        headline: a.title,
        source: a.source,
        url: a.url,
        emoji: getEmoji(a.domain),
        publishedAt: a.publishedAt.toISOString(),
      })),
      rightHeadlines: headlines.right.slice(0, 4).map(a => ({
        headline: a.title,
        source: a.source,
        url: a.url,
        emoji: getEmoji(a.domain),
        publishedAt: a.publishedAt.toISOString(),
      })),
      provider: 'RSS Feeds',
      model: 'Real News Aggregator v2.0',
    };
  } catch (error) {
    console.error('Error fetching headlines:', error);
    
    // Return database cached articles as fallback
    const cachedArticles = await db.article.findMany({
      where: {
        leftWingSummary: { not: null },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 12,
    });
    
    const formatCached = (articles: typeof cachedArticles) => articles.map(a => ({
      headline: a.title,
      source: a.source,
      url: a.url,
      emoji: '📰',
      publishedAt: a.publishedAt.toISOString(),
    }));
    
    return {
      leftHeadlines: formatCached(cachedArticles.filter(a => (a.spectrumScore || 0) < -1).slice(0, 4)),
      centerHeadlines: formatCached(cachedArticles.filter(a => Math.abs(a.spectrumScore || 0) <= 1).slice(0, 4)),
      rightHeadlines: formatCached(cachedArticles.filter(a => (a.spectrumScore || 0) > 1).slice(0, 4)),
      provider: 'Database Cache',
      model: 'Cached Articles',
    };
  }
}

export default {
  fetchHeadlinesFromRSS,
  storeArticlesInDatabase,
  fetchAndStoreHeadlines,
  getHeadlinesForFrontend,
};
