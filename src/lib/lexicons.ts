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

// --- PERFORMANCE OPTIMIZATIONS ---
// Pre-lower case the arrays at module scope to avoid string conversions during hot loops.
// This significantly reduces memory allocations and CPU overhead during text analysis.

const PRECOMPUTED_TOPICS = Object.fromEntries(
  Object.entries(TOPIC_LEXICONS).map(([topic, lexicon]) => [
    topic,
    {
      leftTerms: lexicon.leftTerms.map(t => t.toLowerCase()),
      rightTerms: lexicon.rightTerms.map(t => t.toLowerCase()),
      allTerms: [...lexicon.leftTerms, ...lexicon.rightTerms].map(t => t.toLowerCase())
    }
  ])
);

const PRECOMPUTED_EMOTIONS = {
  highEmotion: EMOTIONAL_LEXICON.highEmotion.map(w => w.toLowerCase()),
  partisanMarkers: EMOTIONAL_LEXICON.partisanMarkers.map(w => w.toLowerCase()),
  authoritarianMarkers: EMOTIONAL_LEXICON.authoritarianMarkers.map(w => w.toLowerCase()),
  socialistMarkers: EMOTIONAL_LEXICON.socialistMarkers.map(w => w.toLowerCase()),
};

const PRECOMPUTED_SOURCES = Object.fromEntries(
  Object.entries(SOURCE_TYPE_INDICATORS).map(([type, indicators]) => [
    type,
    indicators.map(i => i.toLowerCase())
  ])
);

// Pre-extract entries for faster iteration
const PRECOMPUTED_TOPICS_ENTRIES = Object.entries(PRECOMPUTED_TOPICS);
const PRECOMPUTED_SOURCES_ENTRIES = Object.entries(PRECOMPUTED_SOURCES);

/**
 * Fast occurrence counting using indexOf loops instead of regex.
 * Avoids the overhead of regular expression compilation and matching in hot paths.
 */
function countOccurrences(text: string, term: string): number {
  if (term.length === 0) return 0;
  let count = 0;
  let pos = 0;
  while (true) {
    pos = text.indexOf(term, pos);
    if (pos === -1) break;
    count++;
    pos += term.length;
  }
  return count;
}
// ---------------------------------

/**
 * Detect topic from text
 */
export function detectTopic(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Use precomputed lowercased arrays and indexOf for fast matching
  for (let i = 0; i < PRECOMPUTED_TOPICS_ENTRIES.length; i++) {
    const topic = PRECOMPUTED_TOPICS_ENTRIES[i][0];
    const terms = PRECOMPUTED_TOPICS_ENTRIES[i][1].allTerms;
    for (let j = 0; j < terms.length; j++) {
      if (lowerText.indexOf(terms[j]) !== -1) {
        topics.push(topic);
        break; // Match found, no need to check other terms for this topic
      }
    }
  }
  
  return topics;
}

/**
 * Calculate framing score for a topic
 */
export function calculateFramingScore(text: string, topic: string): number {
  const lexicon = PRECOMPUTED_TOPICS[topic];
  if (!lexicon) return 0;
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Use custom fast indexOf loop instead of inline new RegExp(term, 'gi')
  const leftTerms = lexicon.leftTerms;
  for (let i = 0; i < leftTerms.length; i++) {
    score -= countOccurrences(lowerText, leftTerms[i]) * 0.5;
  }
  
  const rightTerms = lexicon.rightTerms;
  for (let i = 0; i < rightTerms.length; i++) {
    score += countOccurrences(lowerText, rightTerms[i]) * 0.5;
  }
  
  return score;
}

/**
 * Calculate emotional intensity score
 */
export function calculateEmotionalScore(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Use custom fast indexOf loop instead of inline RegExp
  const terms = PRECOMPUTED_EMOTIONS.highEmotion;
  for (let i = 0; i < terms.length; i++) {
    score += countOccurrences(lowerText, terms[i]) * 2;
  }
  
  return Math.min(score / 10, 10); // Normalize to 0-10
}

/**
 * Detect partisan markers
 */
export function detectPartisanMarkers(text: string): { markers: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const markers: string[] = [];
  
  const terms = PRECOMPUTED_EMOTIONS.partisanMarkers;
  const original = EMOTIONAL_LEXICON.partisanMarkers;

  // Use indexOf on pre-lowercased terms, preserving original application output casing
  for (let i = 0; i < terms.length; i++) {
    if (lowerText.indexOf(terms[i]) !== -1) {
      markers.push(original[i]);
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
  
  const terms = PRECOMPUTED_EMOTIONS.authoritarianMarkers;
  const original = EMOTIONAL_LEXICON.authoritarianMarkers;

  // Use indexOf on pre-lowercased terms, preserving original application output casing
  for (let i = 0; i < terms.length; i++) {
    if (lowerText.indexOf(terms[i]) !== -1) {
      markers.push(original[i]);
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
  
  const terms = PRECOMPUTED_EMOTIONS.socialistMarkers;
  const original = EMOTIONAL_LEXICON.socialistMarkers;

  // Use indexOf on pre-lowercased terms, preserving original application output casing
  for (let i = 0; i < terms.length; i++) {
    if (lowerText.indexOf(terms[i]) !== -1) {
      markers.push(original[i]);
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
  
  // Use precomputed lowercased arrays and indexOf
  for (let j = 0; j < PRECOMPUTED_SOURCES_ENTRIES.length; j++) {
    const type = PRECOMPUTED_SOURCES_ENTRIES[j][0];
    const indicators = PRECOMPUTED_SOURCES_ENTRIES[j][1];
    const original = SOURCE_TYPE_INDICATORS[type as keyof typeof SOURCE_TYPE_INDICATORS];

    let typeAdded = false;
    for (let i = 0; i < indicators.length; i++) {
      if (lowerText.indexOf(indicators[i]) !== -1) {
        if (!typeAdded) {
          types.push(type);
          typeAdded = true;
        }
        details.push(original[i]); // preserve original case
      }
    }
  }
  
  return {
    types,
    count: details.length,
    details: [...new Set(details)],
  };
}
