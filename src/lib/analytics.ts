/**
 * Analytics Service
 * Provides comprehensive analytics and insights for articles
 */

import { db } from './db';
import { getOutletInfo, getAllOutlets, getBiasLabel } from './outlets';
import { getAuthorInfo, getAllAuthors } from './authors';

// Types
export interface AnalyticsOverview {
  totalArticles: number;
  analyzedArticles: number;
  avgBiasScore: number;
  avgConfidence: number;
  topSources: { source: string; count: number; avgBias: number }[];
  biasDistribution: { left: number; center: number; right: number };
  topicDistribution: { topic: string; count: number }[];
  recentTrends: { date: string; count: number; avgBias: number }[];
}

export interface SourceAnalytics {
  source: string;
  articleCount: number;
  avgBias: number;
  avgReliability: number;
  sentimentTrend: 'improving' | 'declining' | 'stable';
  topTopics: string[];
  recentArticles: { title: string; date: string; bias: number }[];
}

export interface TopicAnalytics {
  topic: string;
  articleCount: number;
  avgBias: number;
  leftCoverage: number;
  rightCoverage: number;
  centerCoverage: number;
  sources: string[];
  keyTerms: string[];
}

export interface TimeSeriesData {
  date: string;
  articles: number;
  avgBias: number;
  leftCount: number;
  rightCount: number;
  centerCount: number;
}

/**
 * Get overall analytics overview
 */
export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  // Get all analyzed articles
  const articles = await db.article.findMany({
    where: {
      leftWingSummary: { not: null },
    },
    select: {
      id: true,
      source: true,
      spectrumScore: true,
      category: true,
      createdAt: true,
    },
  });

  const totalArticles = await db.article.count();
  const analyzedArticles = articles.length;

  // Calculate average bias
  const avgBiasScore = articles.reduce((sum, a) => sum + (a.spectrumScore || 0), 0) / (analyzedArticles || 1);

  // Source distribution
  const sourceCounts = new Map<string, { count: number; bias: number }>();
  articles.forEach(a => {
    const existing = sourceCounts.get(a.source) || { count: 0, bias: 0 };
    sourceCounts.set(a.source, {
      count: existing.count + 1,
      bias: existing.bias + (a.spectrumScore || 0),
    });
  });

  const topSources = Array.from(sourceCounts.entries())
    .map(([source, data]) => ({
      source,
      count: data.count,
      avgBias: data.bias / data.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Bias distribution
  const biasDistribution = {
    left: articles.filter(a => (a.spectrumScore || 0) < -1).length,
    center: articles.filter(a => Math.abs(a.spectrumScore || 0) <= 1).length,
    right: articles.filter(a => (a.spectrumScore || 0) > 1).length,
  };

  // Topic distribution
  const topicCounts = new Map<string, number>();
  articles.forEach(a => {
    if (a.category) {
      topicCounts.set(a.category, (topicCounts.get(a.category) || 0) + 1);
    }
  });

  const topicDistribution = Array.from(topicCounts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  // Recent trends (last 7 days)
  const recentTrends = await getRecentTrends();

  return {
    totalArticles,
    analyzedArticles,
    avgBiasScore,
    avgConfidence: 0.75, // Placeholder
    topSources,
    biasDistribution,
    topicDistribution,
    recentTrends,
  };
}

/**
 * Get recent trends
 */
async function getRecentTrends(): Promise<{ date: string; count: number; avgBias: number }[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const articles = await db.article.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      leftWingSummary: { not: null },
    },
    select: {
      createdAt: true,
      spectrumScore: true,
    },
  });

  // Group by date
  const byDate = new Map<string, { count: number; bias: number }>();
  articles.forEach(a => {
    const date = a.createdAt.toISOString().split('T')[0];
    const existing = byDate.get(date) || { count: 0, bias: 0 };
    byDate.set(date, {
      count: existing.count + 1,
      bias: existing.bias + (a.spectrumScore || 0),
    });
  });

  return Array.from(byDate.entries())
    .map(([date, data]) => ({
      date,
      count: data.count,
      avgBias: data.bias / data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get analytics for a specific source
 */
export async function getSourceAnalytics(source: string): Promise<SourceAnalytics | null> {
  const outlet = getOutletInfo(source);
  
  const articles = await db.article.findMany({
    where: {
      source: { contains: source, mode: 'insensitive' },
      leftWingSummary: { not: null },
    },
    select: {
      title: true,
      publishedAt: true,
      spectrumScore: true,
      category: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  if (articles.length === 0) {
    return null;
  }

  const avgBias = articles.reduce((sum, a) => sum + (a.spectrumScore || 0), 0) / articles.length;
  
  // Topic distribution
  const topicCounts = new Map<string, number>();
  articles.forEach(a => {
    if (a.category) {
      topicCounts.set(a.category, (topicCounts.get(a.category) || 0) + 1);
    }
  });
  const topTopics = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  return {
    source: outlet?.name || source,
    articleCount: articles.length,
    avgBias,
    avgReliability: outlet?.reliabilityScore || 50,
    sentimentTrend: 'stable',
    topTopics,
    recentArticles: articles.slice(0, 5).map(a => ({
      title: a.title,
      date: a.publishedAt.toISOString(),
      bias: a.spectrumScore || 0,
    })),
  };
}

/**
 * Get comparison data for multiple sources
 */
export async function compareSources(sources: string[]): Promise<{
  sources: { name: string; avgBias: number; count: number; reliability: number }[];
  commonTopics: string[];
  coverageGap: { topic: string; missing: string[] }[];
}> {
  const sourceData = await Promise.all(
    sources.map(async (source) => {
      const articles = await db.article.findMany({
        where: {
          source: { contains: source, mode: 'insensitive' },
          leftWingSummary: { not: null },
        },
        select: { spectrumScore: true, category: true },
      });

      const outlet = getOutletInfo(source);
      const avgBias = articles.reduce((sum, a) => sum + (a.spectrumScore || 0), 0) / (articles.length || 1);

      return {
        name: outlet?.name || source,
        avgBias,
        count: articles.length,
        reliability: outlet?.reliabilityScore || 50,
        topics: articles.map(a => a.category).filter(Boolean) as string[],
      };
    })
  );

  // Find common topics
  const allTopics = new Set<string>();
  sourceData.forEach(s => s.topics.forEach(t => allTopics.add(t)));
  const commonTopics = Array.from(allTopics).filter(topic => 
    sourceData.every(s => s.topics.includes(topic))
  );

  // Find coverage gaps
  const coverageGap = Array.from(allTopics)
    .map(topic => ({
      topic,
      missing: sourceData
        .filter(s => !s.topics.includes(topic))
        .map(s => s.name),
    }))
    .filter(g => g.missing.length > 0);

  return {
    sources: sourceData.map(s => ({
      name: s.name,
      avgBias: s.avgBias,
      count: s.count,
      reliability: s.reliability,
    })),
    commonTopics,
    coverageGap,
  };
}

/**
 * Get time series data
 */
export async function getTimeSeriesData(days: number = 30): Promise<TimeSeriesData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const articles = await db.article.findMany({
    where: {
      createdAt: { gte: startDate },
      leftWingSummary: { not: null },
    },
    select: {
      createdAt: true,
      spectrumScore: true,
    },
  });

  // Group by date
  const byDate = new Map<string, { 
    count: number; 
    bias: number; 
    left: number; 
    right: number; 
    center: number; 
  }>();

  articles.forEach(a => {
    const date = a.createdAt.toISOString().split('T')[0];
    const existing = byDate.get(date) || { count: 0, bias: 0, left: 0, right: 0, center: 0 };
    const bias = a.spectrumScore || 0;
    
    byDate.set(date, {
      count: existing.count + 1,
      bias: existing.bias + bias,
      left: existing.left + (bias < -1 ? 1 : 0),
      right: existing.right + (bias > 1 ? 1 : 0),
      center: existing.center + (Math.abs(bias) <= 1 ? 1 : 0),
    });
  });

  return Array.from(byDate.entries())
    .map(([date, data]) => ({
      date,
      articles: data.count,
      avgBias: data.bias / data.count,
      leftCount: data.left,
      rightCount: data.right,
      centerCount: data.center,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get author statistics
 */
export function getAuthorStatistics(): {
  left: { name: string; lean: number; reliability: number }[];
  center: { name: string; lean: number; reliability: number }[];
  right: { name: string; lean: number; reliability: number }[];
} {
  const authors = getAllAuthors();
  
  return {
    left: authors
      .filter(a => a.leanScore < -0.5)
      .map(a => ({ name: a.name, lean: a.leanScore, reliability: a.reliability }))
      .sort((a, b) => a.lean - b.lean),
    center: authors
      .filter(a => Math.abs(a.leanScore) <= 0.5)
      .map(a => ({ name: a.name, lean: a.leanScore, reliability: a.reliability })),
    right: authors
      .filter(a => a.leanScore > 0.5)
      .map(a => ({ name: a.name, lean: a.leanScore, reliability: a.reliability }))
      .sort((a, b) => b.lean - a.lean),
  };
}

/**
 * Get outlet statistics
 */
export function getOutletStatistics(): {
  left: { name: string; bias: number; reliability: number }[];
  center: { name: string; bias: number; reliability: number }[];
  right: { name: string; bias: number; reliability: number }[];
} {
  const outlets = getAllOutlets();
  
  return {
    left: outlets
      .filter(o => o.biasScore < -0.5)
      .map(o => ({ name: o.name, bias: o.biasScore, reliability: o.reliabilityScore }))
      .sort((a, b) => a.bias - b.bias),
    center: outlets
      .filter(o => Math.abs(o.biasScore) <= 0.5)
      .map(o => ({ name: o.name, bias: o.biasScore, reliability: o.reliabilityScore })),
    right: outlets
      .filter(o => o.biasScore > 0.5)
      .map(o => ({ name: o.name, bias: o.biasScore, reliability: o.reliabilityScore }))
      .sort((a, b) => b.bias - a.bias),
  };
}
