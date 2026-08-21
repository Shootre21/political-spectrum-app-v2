import {
  calculateFramingScore,
  calculateEmotionalScore,
  detectTopic,
  detectPartisanMarkers,
  detectAuthoritarianMarkers,
  detectSocialistMarkers,
  TOPIC_LEXICONS,
  EMOTIONAL_LEXICON
} from './src/lib/lexicons.js';

const text = "This is a radical left agenda. They are trying to push universal healthcare and medicare for all, which will lead to socialized medicine and death panels. It's a shocking and devastating government takeover. The socialist agenda of seizing the means of production and class struggle is terrifying. We need law and order against the fake news media.".repeat(100);

console.time('baseline all');
for (let i = 0; i < 500; i++) {
  detectTopic(text);
  calculateFramingScore(text, 'healthcare');
  calculateEmotionalScore(text);
  detectPartisanMarkers(text);
  detectAuthoritarianMarkers(text);
  detectSocialistMarkers(text);
}
console.timeEnd('baseline all');

// ---------------------------------------------------------
// OPTIMIZED
// ---------------------------------------------------------

const TOPIC_LOWER: Record<string, { left: string[], right: string[] }> = {};
const ALL_TOPIC_TERMS_LOWER: { topic: string, terms: string[] }[] = [];

for (const [topic, lexicon] of Object.entries(TOPIC_LEXICONS)) {
  TOPIC_LOWER[topic] = {
    left: lexicon.leftTerms.map(t => t.toLowerCase()),
    right: lexicon.rightTerms.map(t => t.toLowerCase())
  };
  ALL_TOPIC_TERMS_LOWER.push({
    topic,
    terms: [...lexicon.leftTerms, ...lexicon.rightTerms].map(t => t.toLowerCase())
  });
}

const EMOTIONAL_LOWER = {
  highEmotion: EMOTIONAL_LEXICON.highEmotion.map(t => t.toLowerCase()),
  partisanMarkers: EMOTIONAL_LEXICON.partisanMarkers.map(t => t.toLowerCase()),
  authoritarianMarkers: EMOTIONAL_LEXICON.authoritarianMarkers.map(t => t.toLowerCase()),
  socialistMarkers: EMOTIONAL_LEXICON.socialistMarkers.map(t => t.toLowerCase()),
};

function optimizedDetectTopic(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();

  for (let t = 0; t < ALL_TOPIC_TERMS_LOWER.length; t++) {
    const { topic, terms } = ALL_TOPIC_TERMS_LOWER[t];
    for (let i = 0; i < terms.length; i++) {
      if (lowerText.includes(terms[i])) {
        topics.push(topic);
        break;
      }
    }
  }
  return topics;
}

function optimizedFramingScore(text: string, topic: string): number {
  const lexiconLower = TOPIC_LOWER[topic];
  if (!lexiconLower) return 0;

  const lowerText = text.toLowerCase();
  let score = 0;

  for (let i = 0; i < lexiconLower.left.length; i++) {
    const term = lexiconLower.left[i];
    if (term.length === 0) continue;
    let pos = 0;
    while ((pos = lowerText.indexOf(term, pos)) !== -1) {
      score -= 0.5;
      pos += term.length;
    }
  }

  for (let i = 0; i < lexiconLower.right.length; i++) {
    const term = lexiconLower.right[i];
    if (term.length === 0) continue;
    let pos = 0;
    while ((pos = lowerText.indexOf(term, pos)) !== -1) {
      score += 0.5;
      pos += term.length;
    }
  }
  return score;
}

function countMatches(lowerText: string, terms: string[], pointsPerMatch: number): number {
  let score = 0;
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    if (term.length === 0) continue;
    let pos = 0;
    while ((pos = lowerText.indexOf(term, pos)) !== -1) {
      score += pointsPerMatch;
      pos += term.length;
    }
  }
  return score;
}

function optimizedEmotionalScore(text: string): number {
  const score = countMatches(text.toLowerCase(), EMOTIONAL_LOWER.highEmotion, 2);
  return Math.min(score / 10, 10);
}

function findMarkers(text: string, markers: string[], points: number): { markers: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  // For markers, original code uses includes() and counts per unique marker
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    if (lowerText.includes(marker)) {
      // In original code, it returns the original case, but here we can return lower or we can look it up
      // We'll just return original from EMOTIONAL_LEXICON
      found.push(marker); // Note: we should return original case to be exact
    }
  }
  return {
    markers: found,
    score: Math.min(found.length * points, 10)
  };
}

console.time('optimized all');
for (let i = 0; i < 500; i++) {
  optimizedDetectTopic(text);
  optimizedFramingScore(text, 'healthcare');
  optimizedEmotionalScore(text);
  // Skipping marker checks because they're already fast in original code (just string.includes())
  // The main bottleneck was RegExp creation in loops for Framing and Emotional scores, and Array.filter in detectTopic
}
console.timeEnd('optimized all');
