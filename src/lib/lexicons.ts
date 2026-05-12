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

// --- Pre-compiled Optimizations ---
// Pre-compiling arrays of RegExp objects and lowercased terms at the module scope
// avoids recreating them during each function call in hot loops.

export const TOPIC_LOWERCASE_TERMS: Record<string, string[]> = {};
export const TOPIC_REGEXPS: Record<string, { left: RegExp[], right: RegExp[] }> = {};

for (const [topic, lexicon] of Object.entries(TOPIC_LEXICONS)) {
  TOPIC_LOWERCASE_TERMS[topic] = [
    ...lexicon.leftTerms.map(t => t.toLowerCase()),
    ...lexicon.rightTerms.map(t => t.toLowerCase())
  ];

  TOPIC_REGEXPS[topic] = {
    left: lexicon.leftTerms.map(term => new RegExp(term.toLowerCase(), 'gi')),
    right: lexicon.rightTerms.map(term => new RegExp(term.toLowerCase(), 'gi'))
  };
}

export const EMOTIONAL_HIGH_REGEXPS = EMOTIONAL_LEXICON.highEmotion.map(word => new RegExp(word, 'gi'));
export const PARTISAN_MARKERS_LOWERCASE = EMOTIONAL_LEXICON.partisanMarkers.map(m => m.toLowerCase());
export const AUTHORITARIAN_MARKERS_LOWERCASE = EMOTIONAL_LEXICON.authoritarianMarkers.map(m => m.toLowerCase());
export const SOCIALIST_MARKERS_LOWERCASE = EMOTIONAL_LEXICON.socialistMarkers.map(m => m.toLowerCase());

export const SOURCE_TYPE_LOWERCASE: Record<string, string[]> = {};
for (const [type, indicators] of Object.entries(SOURCE_TYPE_INDICATORS)) {
  SOURCE_TYPE_LOWERCASE[type] = indicators.map(i => i.toLowerCase());
}

/**
 * Detect topic from text
 */
export function detectTopic(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [topic, terms] of Object.entries(TOPIC_LOWERCASE_TERMS)) {
    for (let i = 0; i < terms.length; i++) {
      if (lowerText.includes(terms[i])) {
        topics.push(topic);
        break; // Early exit on first match
      }
    }
  }
  
  return topics;
}

/**
 * Calculate framing score for a topic
 */
export function calculateFramingScore(text: string, topic: string): number {
  const regexps = TOPIC_REGEXPS[topic];
  if (!regexps) return 0;
  
  let score = 0;
  
  // Count left-framing terms
  for (let i = 0; i < regexps.left.length; i++) {
    const matches = text.match(regexps.left[i]);
    if (matches) {
      score -= matches.length * 0.5;
    }
  }
  
  // Count right-framing terms
  for (let i = 0; i < regexps.right.length; i++) {
    const matches = text.match(regexps.right[i]);
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
  let score = 0;
  
  // Count high-emotion words
  for (let i = 0; i < EMOTIONAL_HIGH_REGEXPS.length; i++) {
    const matches = text.match(EMOTIONAL_HIGH_REGEXPS[i]);
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
  
  for (let i = 0; i < PARTISAN_MARKERS_LOWERCASE.length; i++) {
    if (lowerText.includes(PARTISAN_MARKERS_LOWERCASE[i])) {
      // Use original array to maintain output casing behavior
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
  
  for (let i = 0; i < AUTHORITARIAN_MARKERS_LOWERCASE.length; i++) {
    if (lowerText.includes(AUTHORITARIAN_MARKERS_LOWERCASE[i])) {
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
  
  for (let i = 0; i < SOCIALIST_MARKERS_LOWERCASE.length; i++) {
    if (lowerText.includes(SOCIALIST_MARKERS_LOWERCASE[i])) {
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
  
  for (const [type, indicators] of Object.entries(SOURCE_TYPE_LOWERCASE)) {
    let typeAdded = false;
    for (let i = 0; i < indicators.length; i++) {
      if (lowerText.includes(indicators[i])) {
        if (!typeAdded) {
          types.push(type);
          typeAdded = true;
        }
        details.push(SOURCE_TYPE_INDICATORS[type as keyof typeof SOURCE_TYPE_INDICATORS][i]);
      }
    }
  }
  
  return {
    types,
    count: details.length,
    details: [...new Set(details)],
  };
}
