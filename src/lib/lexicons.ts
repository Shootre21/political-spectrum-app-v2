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

// Precomputed structures for high-performance matching
const PRECOMPUTED_TOPICS = Object.entries(TOPIC_LEXICONS).map(([topic, lexicon]) => {
  return {
    topic,
    allTermsLower: [...lexicon.leftTerms, ...lexicon.rightTerms].map(t => t.toLowerCase())
  };
});

const PRECOMPUTED_FRAMING = Object.entries(TOPIC_LEXICONS).reduce((acc, [topic, lexicon]) => {
  acc[topic] = {
    leftTermsLower: lexicon.leftTerms.map(t => t.toLowerCase()),
    rightTermsLower: lexicon.rightTerms.map(t => t.toLowerCase())
  };
  return acc;
}, {} as Record<string, { leftTermsLower: string[], rightTermsLower: string[] }>);

const EMOTIONAL_HIGH_LOWER = EMOTIONAL_LEXICON.highEmotion.map(w => w.toLowerCase());
const PARTISAN_MARKERS_LOWER = EMOTIONAL_LEXICON.partisanMarkers.map(m => m.toLowerCase());
const AUTHORITARIAN_MARKERS_LOWER = EMOTIONAL_LEXICON.authoritarianMarkers.map(m => m.toLowerCase());
const SOCIALIST_MARKERS_LOWER = EMOTIONAL_LEXICON.socialistMarkers.map(m => m.toLowerCase());

const SOURCE_TYPE_INDICATORS_PRECOMPUTED = Object.entries(SOURCE_TYPE_INDICATORS).map(([type, indicators]) => ({
  type,
  indicators,
  indicatorsLower: indicators.map(i => i.toLowerCase())
}));

/**
 * Detect topic from text
 */
export function detectTopic(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const { topic, allTermsLower } of PRECOMPUTED_TOPICS) {
    for (let i = 0; i < allTermsLower.length; i++) {
      if (lowerText.includes(allTermsLower[i])) {
        topics.push(topic);
        break; // Only need one match per topic
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
  for (let i = 0; i < precomputed.leftTermsLower.length; i++) {
    const term = precomputed.leftTermsLower[i];
    let pos = lowerText.indexOf(term);
    while (pos !== -1) {
      score -= 0.5;
      pos = lowerText.indexOf(term, pos + term.length);
    }
  }
  
  // Count right-framing terms
  for (let i = 0; i < precomputed.rightTermsLower.length; i++) {
    const term = precomputed.rightTermsLower[i];
    let pos = lowerText.indexOf(term);
    while (pos !== -1) {
      score += 0.5;
      pos = lowerText.indexOf(term, pos + term.length);
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
  for (let i = 0; i < EMOTIONAL_HIGH_LOWER.length; i++) {
    const word = EMOTIONAL_HIGH_LOWER[i];
    let pos = lowerText.indexOf(word);
    while (pos !== -1) {
      score += 2;
      pos = lowerText.indexOf(word, pos + word.length);
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
  
  for (let i = 0; i < PARTISAN_MARKERS_LOWER.length; i++) {
    if (lowerText.includes(PARTISAN_MARKERS_LOWER[i])) {
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
  
  for (let i = 0; i < AUTHORITARIAN_MARKERS_LOWER.length; i++) {
    if (lowerText.includes(AUTHORITARIAN_MARKERS_LOWER[i])) {
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
  
  for (let i = 0; i < SOCIALIST_MARKERS_LOWER.length; i++) {
    if (lowerText.includes(SOCIALIST_MARKERS_LOWER[i])) {
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
  
  for (const group of SOURCE_TYPE_INDICATORS_PRECOMPUTED) {
    for (let i = 0; i < group.indicatorsLower.length; i++) {
      if (lowerText.includes(group.indicatorsLower[i])) {
        if (!types.includes(group.type)) {
          types.push(group.type);
        }
        details.push(group.indicators[i]);
      }
    }
  }
  
  return {
    types,
    count: details.length,
    details: [...new Set(details)],
  };
}
