/**
 * Lexicon Datasets for Topic-Based Framing Analysis
 * Contains categorized terms for detecting political framing in articles
 */

// Topic-specific terminology for framing detection
export const TOPIC_LEXICONS = {
  immigration: {
    leftTerms: [
      'undocumented immigrant',
      'undocumented worker',
      'asylum seeker',
      'refugee',
      'immigrant community',
      'path to citizenship',
      'dreamer',
      'daca recipient',
      'mixed-status family',
      'sanctuary city',
      'comprehensive immigration reform',
      'family separation',
      'border humanitarian crisis',
      'immigrant rights',
    ],
    rightTerms: [
      'illegal alien',
      'illegal immigrant',
      'border invasion',
      'illegal crossing',
      'catch and release',
      'open border',
      'border crisis',
      'illegal entry',
      'amnesty',
      'chain migration',
      'anchor baby',
      'sanctuary city crackdown',
      'border security crisis',
      'illegal immigration crisis',
    ],
  },
  
  economy: {
    leftTerms: [
      'income inequality',
      'wealth gap',
      'living wage',
      'worker rights',
      'corporate greed',
      'fair share',
      'progressive taxation',
      'economic justice',
      'safety net',
      'social safety net',
      'working families',
      'middle class squeeze',
      'corporate profiteering',
      'price gouging',
    ],
    rightTerms: [
      'job creators',
      'free market',
      'regulatory burden',
      'government overreach',
      'fiscal responsibility',
      'tax burden',
      'government spending',
      'welfare state',
      'entitlement reform',
      'burdensome regulations',
      'small business',
      'economic freedom',
      'supply side',
      'trickle down',
    ],
  },
  
  healthcare: {
    leftTerms: [
      'universal healthcare',
      'medicare for all',
      'single payer',
      'healthcare as a right',
      'public option',
      'healthcare access',
      'prescription drug costs',
      'medical bankruptcy',
      'healthcare inequality',
      'reproductive rights',
      'reproductive healthcare',
    ],
    rightTerms: [
      'government takeover',
      'socialized medicine',
      'death panels',
      'repeal and replace',
      'healthcare mandate',
      'individual mandate',
      'job-killing',
      'market-based solution',
      'health savings account',
      'pro-life',
      'religious liberty',
    ],
  },
  
  climate: {
    leftTerms: [
      'climate crisis',
      'climate emergency',
      'existential threat',
      'climate justice',
      'renewable energy transition',
      'fossil fuel industry',
      'carbon emissions',
      'environmental racism',
      'sustainability',
      'green new deal',
      'climate denial',
    ],
    rightTerms: [
      'energy independence',
      'fossil fuels',
      'clean coal',
      'energy dominance',
      'job-killing regulations',
      'war on energy',
      'climate alarmism',
      'economic impact',
      'energy jobs',
      'drilling rights',
      'pipeline approval',
    ],
  },
  
  crime: {
    leftTerms: [
      'criminal justice reform',
      'mass incarceration',
      'systemic racism',
      'police brutality',
      'police accountability',
      'prison industrial complex',
      'sentencing reform',
      'restorative justice',
      'community policing',
      'defund the police',
      'police violence',
    ],
    rightTerms: [
      'law and order',
      'tough on crime',
      'violent crime wave',
      'soft on crime',
      'pro-police',
      'back the blue',
      'criminals',
      'border crime',
      'illegal alien crime',
      'urban crime',
      'prosecutor accountability',
    ],
  },
  
  elections: {
    leftTerms: [
      'voter suppression',
      'voting rights',
      'ballot access',
      'democratic norms',
      'electoral integrity',
      'gerrymandering',
      'voter purging',
      'polling place closure',
      'voting rights act',
      'fair maps',
    ],
    rightTerms: [
      'voter fraud',
      'election integrity',
      'ballot harvesting',
      'election security',
      'voter id',
      'illegal voting',
      'dead voters',
      'election interference',
      'stolen election',
      'rigged election',
    ],
  },
  
  lgbtq: {
    leftTerms: [
      'lgbtq rights',
      'transgender rights',
      'gender-affirming care',
      'lgbtq community',
      'pride',
      'equality act',
      'conversion therapy ban',
      'trans youth',
      'gender identity',
      'inclusive policies',
    ],
    rightTerms: [
      'biological sex',
      'women\'s sports',
      'parental rights',
      'traditional values',
      'family values',
      'religious exemption',
      'biological women',
      'trans agenda',
      'gender ideology',
      'protecting children',
    ],
  },
  
  foreign_policy: {
    leftTerms: [
      'diplomacy first',
      'military intervention',
      'endless wars',
      'diplomatic solution',
      'peace process',
      'international cooperation',
      'multilateral approach',
      'humanitarian aid',
      'refugee crisis',
      'war powers',
    ],
    rightTerms: [
      'america first',
      'military strength',
      'national sovereignty',
      'global leadership',
      'military readiness',
      'strong defense',
      'alliance commitment',
      'strategic interest',
      'terror threat',
      'national security',
    ],
  },
};

// Emotional/sensational language markers
export const EMOTIONAL_LEXICON = {
  highEmotion: [
    'shocking',
    'explosive',
    'bombshell',
    'devastating',
    'horrifying',
    'terrifying',
    'outrageous',
    'scandalous',
    'stunning',
    'unbelievable',
    'incredible',
    'extraordinary',
    'dramatic',
    'blistering',
    'scathing',
    'brutal',
    'savage',
    'destroyed',
    'demolished',
    'obliterated',
    'crushed',
    'decimated',
    'annihilated',
    'slammed',
    'ripped',
    'eviscerated',
    'destroyed',
    'humiliated',
    'destroyed',
  ],
  
  partisanMarkers: [
    'radical left',
    'far left',
    'leftist agenda',
    'liberal media',
    'mainstream media',
    'deep state',
    'radical right',
    'far right',
    'extremist',
    'extremism',
    'woke agenda',
    'cancel culture',
    'culture war',
    'war on',
    'attack on',
    'assault on',
    'threat to',
    'dangerous',
    'extreme',
    'radical',
    'socialist agenda',
    'communist',
    'fascist',
    'marxist',
  ],
  
  authoritarianMarkers: [
    'strongman',
    'authoritarian',
    'dictator',
    'tyrant',
    'regime',
    'strong leader',
    'iron fist',
    'law and order',
    'enemy of the people',
    'fake news',
    'rigged system',
    'corrupt media',
    'political persecution',
    'witch hunt',
    'deep state conspiracy',
  ],
  
  socialistMarkers: [
    'workers unite',
    'seize the means',
    'bourgeoisie',
    'proletariat',
    'class struggle',
    'capitalist exploitation',
    'late stage capitalism',
    'wealth redistribution',
    'collective ownership',
    'anti-capitalist',
    'class warfare',
  ],
};

// Source type indicators
export const SOURCE_TYPE_INDICATORS = {
  expert: ['professor', 'doctor', 'phd', 'researcher', 'scientist', 'analyst', 'expert', 'scholar'],
  government: ['white house', 'senator', 'congressman', 'congresswoman', 'representative', 'governor', 'mayor', 'official', 'administration', 'department of'],
  activist: ['activist', 'organizer', 'advocate', 'campaign', 'movement', 'coalition', 'alliance'],
  corporate: ['ceo', 'executive', 'spokesperson', 'company', 'corporation', 'industry'],
  victim: ['victim', 'survivor', 'family', 'witness'],
};

// --- Pre-computed optimization caches ---
const PRECOMPUTED_TOPICS = Object.entries(TOPIC_LEXICONS).map(([topic, lexicon]) => ({
  topic,
  terms: [...lexicon.leftTerms, ...lexicon.rightTerms].map(t => t.toLowerCase()),
}));

const PRECOMPUTED_FRAMING = Object.fromEntries(
  Object.entries(TOPIC_LEXICONS).map(([topic, lexicon]) => [
    topic,
    {
      leftRegexes: lexicon.leftTerms.map(term => new RegExp(term.toLowerCase(), 'gi')),
      rightRegexes: lexicon.rightTerms.map(term => new RegExp(term.toLowerCase(), 'gi')),
    }
  ])
);

const PRECOMPUTED_EMOTIONAL_REGEXES = EMOTIONAL_LEXICON.highEmotion.map(
  word => new RegExp(word, 'gi')
);

const PRECOMPUTED_PARTISAN_MARKERS = EMOTIONAL_LEXICON.partisanMarkers.map(m => m.toLowerCase());
const PRECOMPUTED_AUTHORITARIAN_MARKERS = EMOTIONAL_LEXICON.authoritarianMarkers.map(m => m.toLowerCase());
const PRECOMPUTED_SOCIALIST_MARKERS = EMOTIONAL_LEXICON.socialistMarkers.map(m => m.toLowerCase());

const PRECOMPUTED_SOURCES = Object.entries(SOURCE_TYPE_INDICATORS).map(([type, indicators]) => ({
  type,
  indicatorsLowerCase: indicators.map(i => i.toLowerCase()),
  originalIndicators: indicators
}));
// ----------------------------------------

/**
 * Detect topic from text
 */
export function detectTopic(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (let t = 0; t < PRECOMPUTED_TOPICS.length; t++) {
    const { topic, terms } = PRECOMPUTED_TOPICS[t];
    for (let i = 0; i < terms.length; i++) {
      if (lowerText.includes(terms[i])) {
        topics.push(topic);
        break;
      }
    }
  }
  
  return topics;
}

/**
 * Calculate framing score for a topic
 */
export function calculateFramingScore(text: string, topic: string): number {
  const precomputed = PRECOMPUTED_FRAMING[topic];
  if (!precomputed) return 0;
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Count left-framing terms
  for (let i = 0; i < precomputed.leftRegexes.length; i++) {
    const matches = lowerText.match(precomputed.leftRegexes[i]);
    if (matches) {
      score -= matches.length * 0.5;
    }
  }
  
  // Count right-framing terms
  for (let i = 0; i < precomputed.rightRegexes.length; i++) {
    const matches = lowerText.match(precomputed.rightRegexes[i]);
    if (matches) {
      score += matches.length * 0.5;
    }
  }
  
  return score;
}

/**
 * Calculate emotional intensity score
 */
export function calculateEmotionalScore(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Count high-emotion words
  for (let i = 0; i < PRECOMPUTED_EMOTIONAL_REGEXES.length; i++) {
    const matches = lowerText.match(PRECOMPUTED_EMOTIONAL_REGEXES[i]);
    if (matches) {
      score += matches.length * 2;
    }
  }
  
  return Math.min(score / 10, 10); // Normalize to 0-10
}

/**
 * Detect partisan markers
 */
export function detectPartisanMarkers(text: string): { markers: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const markers: string[] = [];
  
  for (let i = 0; i < PRECOMPUTED_PARTISAN_MARKERS.length; i++) {
    if (lowerText.includes(PRECOMPUTED_PARTISAN_MARKERS[i])) {
      markers.push(EMOTIONAL_LEXICON.partisanMarkers[i]);
    }
  }
  
  return {
    markers,
    score: Math.min(markers.length * 1.5, 10),
  };
}

/**
 * Detect authoritarian markers
 */
export function detectAuthoritarianMarkers(text: string): { markers: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const markers: string[] = [];
  
  for (let i = 0; i < PRECOMPUTED_AUTHORITARIAN_MARKERS.length; i++) {
    if (lowerText.includes(PRECOMPUTED_AUTHORITARIAN_MARKERS[i])) {
      markers.push(EMOTIONAL_LEXICON.authoritarianMarkers[i]);
    }
  }
  
  return {
    markers,
    score: Math.min(markers.length * 2, 10),
  };
}

/**
 * Detect socialist markers
 */
export function detectSocialistMarkers(text: string): { markers: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const markers: string[] = [];
  
  for (let i = 0; i < PRECOMPUTED_SOCIALIST_MARKERS.length; i++) {
    if (lowerText.includes(PRECOMPUTED_SOCIALIST_MARKERS[i])) {
      markers.push(EMOTIONAL_LEXICON.socialistMarkers[i]);
    }
  }
  
  return {
    markers,
    score: Math.min(markers.length * 2, 10),
  };
}

/**
 * Extract sources from text
 */
export function extractSources(text: string): { types: string[]; count: number; details: string[] } {
  const lowerText = text.toLowerCase();
  const types: string[] = [];
  const details: string[] = [];
  
  for (let i = 0; i < PRECOMPUTED_SOURCES.length; i++) {
    const { type, indicatorsLowerCase, originalIndicators } = PRECOMPUTED_SOURCES[i];
    for (let j = 0; j < indicatorsLowerCase.length; j++) {
      if (lowerText.includes(indicatorsLowerCase[j])) {
        if (!types.includes(type)) {
          types.push(type);
        }
        details.push(originalIndicators[j]);
      }
    }
  }
  
  return {
    types,
    count: details.length,
    details: [...new Set(details)],
  };
}
