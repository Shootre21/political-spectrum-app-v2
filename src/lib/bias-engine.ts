/**
 * Algorithm-Based Bias Detection Engine
 * 
 * This implements a 3-layer scoring pipeline:
 * 1. OUTLET BASELINE - Get the inherent bias of the publishing outlet
 * 2. ARTICLE DELTA - Calculate deviation from baseline based on framing
 * 3. FINAL DISPLAY + EVIDENCE - Combine scores and generate transparent output
 */

import { 
  getOutletInfo, 
  getOutletBias, 
  getBiasLabel,
  type OutletInfo 
} from './outlets';
import {
  detectTopic,
  calculateFramingScore,
  calculateEmotionalScore,
  detectPartisanMarkers,
  detectAuthoritarianMarkers,
  detectSocialistMarkers,
  extractSources,
  TOPIC_LEXICONS,
} from './lexicons';

// Type definitions
export interface BiasAnalysisResult {
  // Core scores
  outletBias: number;
  articleDelta: number;
  finalBias: number;
  
  // Labels
  outletLabel: string;
  finalLabel: string;
  
  // Detailed signals
  signals: {
    headlineEmotionality: number;
    topicFraming: Record<string, number>;
    sourceDiversity: number;
    partisanRhetoric: number;
    authoritarianRhetoric: number;
    socialistRhetoric: number;
  };
  
  // Evidence for transparency
  evidence: {
    headlineTerms: string[];
    framingTerms: { term: string; leaning: 'left' | 'right' }[];
    partisanMarkers: string[];
    authoritarianMarkers: string[];
    socialistMarkers: string[];
    sources: { types: string[]; count: number; details: string[] };
    topics: string[];
    opposingViews: boolean;
  };
  
  // Tags instead of hard labels
  tags: string[];
  
  // Metadata
  outlet: OutletInfo | null;
  confidence: number;
  method: 'algorithm';
}

export interface HeadlineData {
  headline: string;
  source: string;
  url: string;
  content?: string;
  publishedAt?: string;
}

// Weighting configuration
const WEIGHTS = {
  outletBaseline: 0.4,      // 40% weight to outlet baseline
  topicFraming: 0.25,       // 25% weight to topic framing
  emotionalLanguage: 0.15,  // 15% weight to emotional language
  sourceDiversity: 0.1,     // 10% weight to source diversity
  partisanRhetoric: 0.1,    // 10% weight to partisan rhetoric
};

/**
 * Main analysis function
 */
export function analyzeArticle(data: HeadlineData): BiasAnalysisResult {
  const { headline, source, url, content } = data;
  
  // Combine headline and content for analysis
  const fullText = `${headline} ${content || ''}`;
  
  // Step 1: Get outlet baseline
  const outlet = getOutletInfo(extractDomain(source) || source);
  const outletBias = outlet?.biasScore ?? 0;
  
  // Step 2: Calculate article delta
  const articleDelta = calculateArticleDelta(fullText, headline);
  
  // Step 3: Combine for final score
  const finalBias = combineScores(outletBias, articleDelta);
  
  // Generate evidence
  const evidence = generateEvidence(fullText, headline);
  
  // Generate tags
  const tags = generateTags(finalBias, evidence);
  
  // Calculate confidence
  const confidence = calculateConfidence(outlet, evidence);
  
  return {
    outletBias,
    articleDelta,
    finalBias,
    outletLabel: getBiasLabel(outletBias),
    finalLabel: getBiasLabel(finalBias),
    signals: {
      headlineEmotionality: calculateEmotionalScore(headline),
      topicFraming: calculateAllTopicFraming(fullText),
      sourceDiversity: calculateSourceDiversityScore(fullText),
      partisanRhetoric: detectPartisanMarkers(fullText).score,
      authoritarianRhetoric: detectAuthoritarianMarkers(fullText).score,
      socialistRhetoric: detectSocialistMarkers(fullText).score,
    },
    evidence,
    tags,
    outlet,
    confidence,
    method: 'algorithm',
  };
}

/**
 * Calculate article delta (deviation from outlet baseline)
 */
function calculateArticleDelta(text: string, headline: string): number {
  let delta = 0;
  
  // Topic framing
  const topics = detectTopic(text);
  for (const topic of topics) {
    delta += calculateFramingScore(text, topic) * WEIGHTS.topicFraming;
  }
  
  // Emotional language in headline (high impact)
  const headlineEmotion = calculateEmotionalScore(headline);
  delta += (headlineEmotion > 5 ? 0.3 : 0) * (Math.random() > 0.5 ? 1 : -1); // Emotional = more polarized
  
  // Partisan rhetoric
  const partisanScore = detectPartisanMarkers(text).score;
  delta += (partisanScore / 10) * (partisanScore > 0 ? 0.5 : 0);
  
  // Normalize delta
  return Math.max(-2, Math.min(2, delta));
}

/**
 * Combine outlet baseline and article delta
 */
function combineScores(outletBias: number, articleDelta: number): number {
  // Weighted combination
  const final = (outletBias * WEIGHTS.outletBaseline) + 
                (articleDelta * (1 - WEIGHTS.outletBaseline));
  
  // Clamp to -3 to +3 range
  return Math.max(-3, Math.min(3, final));
}

/**
 * Generate evidence for transparency
 */
function generateEvidence(text: string, headline: string): BiasAnalysisResult['evidence'] {
  const topics = detectTopic(text);
  
  // Extract framing terms
  const framingTerms: { term: string; leaning: 'left' | 'right' }[] = [];
  for (const topic of topics) {
    const lexicon = TOPIC_LEXICONS[topic as keyof typeof TOPIC_LEXICONS];
    if (lexicon) {
      const lowerText = text.toLowerCase();
      for (const term of lexicon.leftTerms) {
        if (lowerText.includes(term.toLowerCase())) {
          framingTerms.push({ term, leaning: 'left' });
        }
      }
      for (const term of lexicon.rightTerms) {
        if (lowerText.includes(term.toLowerCase())) {
          framingTerms.push({ term, leaning: 'right' });
        }
      }
    }
  }
  
  // Extract headline emotional terms
  const headlineTerms: string[] = [];
  const lowerHeadline = headline.toLowerCase();
  const emotionalWords = ['shocking', 'explosive', 'bombshell', 'devastating', 'slams', 'destroys', 'crushed'];
  for (const word of emotionalWords) {
    if (lowerHeadline.includes(word)) {
      headlineTerms.push(word);
    }
  }
  
  // Get markers
  const partisanMarkers = detectPartisanMarkers(text).markers;
  const authoritarianMarkers = detectAuthoritarianMarkers(text).markers;
  const socialistMarkers = detectSocialistMarkers(text).markers;
  
  // Extract sources
  const sources = extractSources(text);
  
  // Check for opposing views (simplified heuristic)
  const opposingViewIndicators = ['however', 'but', 'on the other hand', 'critics say', 'opponents argue', 'some say', 'others contend'];
  const opposingViews = opposingViewIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  );
  
  return {
    headlineTerms,
    framingTerms: framingTerms.slice(0, 10), // Limit to top 10
    partisanMarkers,
    authoritarianMarkers,
    socialistMarkers,
    sources,
    topics,
    opposingViews,
  };
}

/**
 * Generate descriptive tags
 */
function generateTags(finalBias: number, evidence: BiasAnalysisResult['evidence']): string[] {
  const tags: string[] = [];
  
  // Bias-based tags
  if (finalBias <= -2) {
    tags.push('Left-Leaning Coverage');
  } else if (finalBias >= 2) {
    tags.push('Right-Leaning Coverage');
  } else if (finalBias >= -0.5 && finalBias <= 0.5) {
    tags.push('Balanced Coverage');
  }
  
  // Signal-based tags
  if (evidence.headlineTerms.length > 0) {
    tags.push('Emotional Headline');
  }
  
  if (evidence.authoritarianMarkers.length >= 2) {
    tags.push('High Authoritarian Rhetoric');
  } else if (evidence.authoritarianMarkers.length === 1) {
    tags.push('Authoritarian Language Detected');
  }
  
  if (evidence.socialistMarkers.length >= 2) {
    tags.push('Anti-Capital Framing');
  } else if (evidence.socialistMarkers.length === 1) {
    tags.push('Socialist Language Detected');
  }
  
  if (evidence.partisanMarkers.length >= 3) {
    tags.push('Highly Partisan Language');
  } else if (evidence.partisanMarkers.length >= 1) {
    tags.push('Partisan Language Present');
  }
  
  if (evidence.sources.count >= 3) {
    tags.push('Multiple Sources Cited');
  } else if (evidence.sources.count === 0) {
    tags.push('No Named Sources');
  }
  
  if (!evidence.opposingViews && evidence.sources.count > 0) {
    tags.push('No Opposing Viewpoint');
  }
  
  if (evidence.opposingViews) {
    tags.push('Includes Opposing View');
  }
  
  // Topic tags
  if (evidence.topics.length > 0) {
    tags.push(`Topics: ${evidence.topics.slice(0, 3).join(', ')}`);
  }
  
  return tags;
}

/**
 * Calculate confidence in the analysis
 */
function calculateConfidence(outlet: OutletInfo | null, evidence: BiasAnalysisResult['evidence']): number {
  let confidence = 0.5; // Base confidence
  
  // More confidence if outlet is in database
  if (outlet) {
    confidence += 0.2;
  }
  
  // More confidence with more evidence
  if (evidence.framingTerms.length > 0) {
    confidence += 0.1;
  }
  
  if (evidence.sources.count > 0) {
    confidence += 0.1;
  }
  
  if (evidence.topics.length > 0) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1);
}

/**
 * Calculate all topic framing scores
 */
function calculateAllTopicFraming(text: string): Record<string, number> {
  const topics = detectTopic(text);
  const scores: Record<string, number> = {};
  
  for (const topic of topics) {
    scores[topic] = calculateFramingScore(text, topic);
  }
  
  return scores;
}

/**
 * Calculate source diversity score
 */
function calculateSourceDiversityScore(text: string): number {
  const sources = extractSources(text);
  
  let score = 0;
  
  // More source types = higher diversity
  score += sources.types.length * 2;
  
  // More individual sources = higher diversity
  score += Math.min(sources.count, 5);
  
  return Math.min(score, 10);
}

/**
 * Extract domain from URL or source name
 */
function extractDomain(source: string): string {
  // Try to extract domain from URL
  try {
    if (source.startsWith('http')) {
      const url = new URL(source);
      return url.hostname.replace('www.', '');
    }
  } catch {
    // Not a URL
  }
  
  // Try to match source name
  const sourceLower = source.toLowerCase();
  
  // Common source name mappings
  const mappings: Record<string, string> = {
    'cnn': 'cnn.com',
    'fox news': 'foxnews.com',
    'fox': 'foxnews.com',
    'npr': 'npr.org',
    'new york times': 'nytimes.com',
    'nytimes': 'nytimes.com',
    'washington post': 'washingtonpost.com',
    'msnbc': 'msnbc.com',
    'wall street journal': 'wsj.com',
    'wsj': 'wsj.com',
    'breitbart': 'breitbart.com',
    'daily wire': 'dailywire.com',
    'politico': 'politico.com',
    'the hill': 'thehill.com',
    'bbc': 'bbc.com',
    'associated press': 'apnews.com',
    'ap': 'apnews.com',
    'reuters': 'reuters.com',
    'guardian': 'theguardian.com',
    'huffpost': 'huffpost.com',
    'vox': 'vox.com',
    'national review': 'nationalreview.com',
    'new york post': 'nypost.com',
    'axios': 'axios.com',
    'the atlantic': 'theatlantic.com',
  };
  
  for (const [name, domain] of Object.entries(mappings)) {
    if (sourceLower.includes(name)) {
      return domain;
    }
  }
  
  return sourceLower.replace(/\s+/g, '') + '.com';
}

/**
 * Generate comparison view for story coverage
 */
export function compareStoryCoverage(articles: HeadlineData[]): {
  coverage: { left: number; center: number; right: number };
  blindSpots: string[];
  avgBias: number;
} {
  let leftCount = 0;
  let centerCount = 0;
  let rightCount = 0;
  let totalBias = 0;
  
  for (const article of articles) {
    const analysis = analyzeArticle(article);
    totalBias += analysis.finalBias;
    
    if (analysis.finalBias <= -1) {
      leftCount++;
    } else if (analysis.finalBias >= 1) {
      rightCount++;
    } else {
      centerCount++;
    }
  }
  
  // Identify blind spots
  const blindSpots: string[] = [];
  const total = articles.length;
  
  if (leftCount === 0 && total > 2) {
    blindSpots.push('Underreported by Left-Leaning Sources');
  }
  if (rightCount === 0 && total > 2) {
    blindSpots.push('Underreported by Right-Leaning Sources');
  }
  if (centerCount === 0 && total > 2) {
    blindSpots.push('Underreported by Center Sources');
  }
  
  return {
    coverage: {
      left: leftCount,
      center: centerCount,
      right: rightCount,
    },
    blindSpots,
    avgBias: total / articles.length || 0,
  };
}

export default analyzeArticle;
