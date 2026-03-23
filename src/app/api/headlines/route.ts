import { NextResponse } from 'next/server';
import { getHeadlinesForFrontend, fetchHeadlinesFromRSS } from '@/lib/news-fetcher';

/**
 * Headlines API - NO AI REQUIRED, NO DATABASE REQUIRED
 * 
 * Fetches REAL headlines from RSS feeds.
 * This is the PRIMARY method for loading articles - works completely locally.
 * 
 * Flow:
 * 1. Fetch from RSS feeds (NYT, Fox, NPR, etc.)
 * 2. Try to store in database (optional)
 * 3. Return formatted headlines for frontend
 * 
 * AI is NOT used here - articles are real news from real sources.
 * Database is OPTIONAL - headlines still return even if not configured.
 */
export async function GET() {
  try {
    console.log('[Headlines] Fetching real headlines from RSS feeds...');
    
    // Fetch headlines directly from RSS feeds
    const headlines = await fetchHeadlinesFromRSS();
    
    // Try to store in database (optional)
    try {
      const { storeArticlesInDatabase } = await import('@/lib/news-fetcher');
      const allArticles = [...headlines.left, ...headlines.center, ...headlines.right];
      await storeArticlesInDatabase(allArticles);
      console.log(`[Headlines] Articles stored in database`);
    } catch (dbError) {
      console.log('[Headlines] Database not available, skipping storage');
    }
    
    // Get emoji based on outlet bias
    const { getOutletInfo } = await import('@/lib/outlets');
    const getEmoji = (domain: string): string => {
      try {
        const outlet = getOutletInfo(domain);
        const bias = outlet?.biasScore || 0;
        
        if (Math.abs(bias) >= 2) return '🔴'; // High bias
        if (Math.abs(bias) >= 1) return '🟠'; // Medium bias
        if (Math.abs(bias) >= 0.5) return '🟡'; // Low bias
        return '🟢'; // Center
      } catch {
        return '📰'; // Default
      }
    };
    
    const result = {
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
    
    console.log(`[Headlines] Successfully fetched ${result.leftHeadlines.length + result.centerHeadlines.length + result.rightHeadlines.length} headlines`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Headlines] Error fetching headlines:', error);
    
    // Return empty headlines instead of error - app still works
    return NextResponse.json({
      leftHeadlines: [],
      centerHeadlines: [],
      rightHeadlines: [],
      provider: 'RSS Feeds',
      model: 'Real News Aggregator v2.0',
      error: 'Could not fetch headlines. Please try again.',
    });
  }
}
