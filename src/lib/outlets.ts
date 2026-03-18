/**
 * Outlet Baseline Database
 * Contains bias scores, reliability ratings, and factual reporting scores
 * for major news outlets. Bias scores range from -3 (very left) to +3 (very right).
 */

export interface OutletInfo {
  name: string;
  domain: string;
  biasScore: number;        // -3 (far left) to +3 (far right)
  reliabilityScore: number; // 0-100
  factualReporting: 'VERY HIGH' | 'HIGH' | 'MOSTLY FACTUAL' | 'MIXED' | 'LOW';
  traffic: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'news' | 'opinion' | 'satire' | 'government' | 'think_tank';
  country: string;
  language: string;
}

// Comprehensive outlet database
export const OUTLET_DATABASE: Record<string, OutletInfo> = {
  // LEFT-LEANING OUTLETS
  'msnbc.com': {
    name: 'MSNBC',
    domain: 'msnbc.com',
    biasScore: -2.5,
    reliabilityScore: 65,
    factualReporting: 'MIXED',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'cnn.com': {
    name: 'CNN',
    domain: 'cnn.com',
    biasScore: -1.5,
    reliabilityScore: 75,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'nytimes.com': {
    name: 'New York Times',
    domain: 'nytimes.com',
    biasScore: -1.2,
    reliabilityScore: 85,
    factualReporting: 'HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'washingtonpost.com': {
    name: 'Washington Post',
    domain: 'washingtonpost.com',
    biasScore: -1.3,
    reliabilityScore: 82,
    factualReporting: 'HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'huffpost.com': {
    name: 'HuffPost',
    domain: 'huffpost.com',
    biasScore: -2.2,
    reliabilityScore: 60,
    factualReporting: 'MIXED',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'vox.com': {
    name: 'Vox',
    domain: 'vox.com',
    biasScore: -2.0,
    reliabilityScore: 70,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'slate.com': {
    name: 'Slate',
    domain: 'slate.com',
    biasScore: -2.3,
    reliabilityScore: 65,
    factualReporting: 'MIXED',
    traffic: 'MEDIUM',
    type: 'opinion',
    country: 'US',
    language: 'en',
  },
  'theatlantic.com': {
    name: 'The Atlantic',
    domain: 'theatlantic.com',
    biasScore: -1.0,
    reliabilityScore: 85,
    factualReporting: 'HIGH',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'motherjones.com': {
    name: 'Mother Jones',
    domain: 'motherjones.com',
    biasScore: -2.8,
    reliabilityScore: 70,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'MEDIUM',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'jacobin.com': {
    name: 'Jacobin',
    domain: 'jacobin.com',
    biasScore: -3.0,
    reliabilityScore: 55,
    factualReporting: 'MIXED',
    traffic: 'MEDIUM',
    type: 'opinion',
    country: 'US',
    language: 'en',
  },
  'theguardian.com': {
    name: 'The Guardian',
    domain: 'theguardian.com',
    biasScore: -1.5,
    reliabilityScore: 80,
    factualReporting: 'HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'UK',
    language: 'en',
  },
  'npr.org': {
    name: 'NPR',
    domain: 'npr.org',
    biasScore: -0.8,
    reliabilityScore: 88,
    factualReporting: 'VERY HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'propublica.org': {
    name: 'ProPublica',
    domain: 'propublica.org',
    biasScore: -0.5,
    reliabilityScore: 95,
    factualReporting: 'VERY HIGH',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'apnews.com': {
    name: 'Associated Press',
    domain: 'apnews.com',
    biasScore: 0,
    reliabilityScore: 95,
    factualReporting: 'VERY HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'reuters.com': {
    name: 'Reuters',
    domain: 'reuters.com',
    biasScore: 0,
    reliabilityScore: 95,
    factualReporting: 'VERY HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'bbc.com': {
    name: 'BBC',
    domain: 'bbc.com',
    biasScore: -0.2,
    reliabilityScore: 90,
    factualReporting: 'VERY HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'UK',
    language: 'en',
  },
  'politico.com': {
    name: 'Politico',
    domain: 'politico.com',
    biasScore: -0.3,
    reliabilityScore: 85,
    factualReporting: 'HIGH',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'axios.com': {
    name: 'Axios',
    domain: 'axios.com',
    biasScore: -0.2,
    reliabilityScore: 82,
    factualReporting: 'HIGH',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'thehill.com': {
    name: 'The Hill',
    domain: 'thehill.com',
    biasScore: 0.2,
    reliabilityScore: 78,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'wsj.com': {
    name: 'Wall Street Journal',
    domain: 'wsj.com',
    biasScore: 0.8,
    reliabilityScore: 88,
    factualReporting: 'HIGH',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },

  // RIGHT-LEANING OUTLETS
  'foxnews.com': {
    name: 'Fox News',
    domain: 'foxnews.com',
    biasScore: 2.5,
    reliabilityScore: 55,
    factualReporting: 'MIXED',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'breitbart.com': {
    name: 'Breitbart',
    domain: 'breitbart.com',
    biasScore: 2.8,
    reliabilityScore: 45,
    factualReporting: 'LOW',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'dailywire.com': {
    name: 'Daily Wire',
    domain: 'dailywire.com',
    biasScore: 2.6,
    reliabilityScore: 50,
    factualReporting: 'MIXED',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'nypost.com': {
    name: 'New York Post',
    domain: 'nypost.com',
    biasScore: 1.8,
    reliabilityScore: 60,
    factualReporting: 'MIXED',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'washingtontimes.com': {
    name: 'Washington Times',
    domain: 'washingtontimes.com',
    biasScore: 2.0,
    reliabilityScore: 62,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'MEDIUM',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'nationalreview.com': {
    name: 'National Review',
    domain: 'nationalreview.com',
    biasScore: 2.2,
    reliabilityScore: 72,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'MEDIUM',
    type: 'opinion',
    country: 'US',
    language: 'en',
  },
  'theblaze.com': {
    name: 'The Blaze',
    domain: 'theblaze.com',
    biasScore: 2.7,
    reliabilityScore: 45,
    factualReporting: 'MIXED',
    traffic: 'MEDIUM',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'newsmax.com': {
    name: 'Newsmax',
    domain: 'newsmax.com',
    biasScore: 2.9,
    reliabilityScore: 40,
    factualReporting: 'LOW',
    traffic: 'HIGH',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'oann.com': {
    name: 'OANN',
    domain: 'oann.com',
    biasScore: 3.0,
    reliabilityScore: 35,
    factualReporting: 'LOW',
    traffic: 'MEDIUM',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'dailycaller.com': {
    name: 'Daily Caller',
    domain: 'dailycaller.com',
    biasScore: 2.5,
    reliabilityScore: 48,
    factualReporting: 'MIXED',
    traffic: 'MEDIUM',
    type: 'news',
    country: 'US',
    language: 'en',
  },
  'townhall.com': {
    name: 'Townhall',
    domain: 'townhall.com',
    biasScore: 2.4,
    reliabilityScore: 52,
    factualReporting: 'MIXED',
    traffic: 'MEDIUM',
    type: 'opinion',
    country: 'US',
    language: 'en',
  },
  'reason.com': {
    name: 'Reason',
    domain: 'reason.com',
    biasScore: 0.5,
    reliabilityScore: 78,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'MEDIUM',
    type: 'opinion',
    country: 'US',
    language: 'en',
  },
  'theamericanconservative.com': {
    name: 'The American Conservative',
    domain: 'theamericanconservative.com',
    biasScore: 1.8,
    reliabilityScore: 70,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'LOW',
    type: 'opinion',
    country: 'US',
    language: 'en',
  },
  'dailymail.co.uk': {
    name: 'Daily Mail',
    domain: 'dailymail.co.uk',
    biasScore: 1.5,
    reliabilityScore: 45,
    factualReporting: 'MIXED',
    traffic: 'VERY HIGH',
    type: 'news',
    country: 'UK',
    language: 'en',
  },
  'telegraph.co.uk': {
    name: 'The Telegraph',
    domain: 'telegraph.co.uk',
    biasScore: 1.2,
    reliabilityScore: 75,
    factualReporting: 'MOSTLY FACTUAL',
    traffic: 'HIGH',
    type: 'news',
    country: 'UK',
    language: 'en',
  },
};

/**
 * Get outlet info by domain
 */
export function getOutletInfo(domain: string): OutletInfo | null {
  // Normalize domain
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  // Direct lookup
  if (OUTLET_DATABASE[normalizedDomain]) {
    return OUTLET_DATABASE[normalizedDomain];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(OUTLET_DATABASE)) {
    if (normalizedDomain.includes(key) || key.includes(normalizedDomain)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get outlet bias by domain
 */
export function getOutletBias(domain: string): number {
  const outlet = getOutletInfo(domain);
  return outlet?.biasScore ?? 0; // Default to center if unknown
}

/**
 * Get bias label from score
 */
export function getBiasLabel(score: number): string {
  if (score <= -2.5) return 'Far Left';
  if (score <= -1.5) return 'Lean Left';
  if (score <= -0.5) return 'Center-Left';
  if (score < 0.5) return 'Center';
  if (score < 1.5) return 'Center-Right';
  if (score < 2.5) return 'Lean Right';
  return 'Far Right';
}

/**
 * Get all outlets sorted by bias
 */
export function getAllOutlets(): OutletInfo[] {
  return Object.values(OUTLET_DATABASE).sort((a, b) => a.biasScore - b.biasScore);
}

/**
 * Get outlets by bias range
 */
export function getOutletsByBias(minBias: number, maxBias: number): OutletInfo[] {
  return Object.values(OUTLET_DATABASE).filter(
    (outlet) => outlet.biasScore >= minBias && outlet.biasScore <= maxBias
  );
}
