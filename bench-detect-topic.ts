import { detectTopic, TOPIC_LEXICONS } from './src/lib/lexicons.js';

const text = "This is a radical left agenda. They are trying to push universal healthcare and medicare for all, which will lead to socialized medicine and death panels. It's a shocking and devastating government takeover.".repeat(100);

// Detect topic pre-lowercased
const TOPIC_TERMS_LOWER_FLAT: { topic: string, terms: string[] }[] = [];
for (const [topic, lexicon] of Object.entries(TOPIC_LEXICONS)) {
  TOPIC_TERMS_LOWER_FLAT.push({
    topic,
    terms: [...lexicon.leftTerms, ...lexicon.rightTerms].map(t => t.toLowerCase())
  });
}

function detectTopicOptimized(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();

  for (let t = 0; t < TOPIC_TERMS_LOWER_FLAT.length; t++) {
    const { topic, terms } = TOPIC_TERMS_LOWER_FLAT[t];
    for (let i = 0; i < terms.length; i++) {
      if (lowerText.includes(terms[i])) {
        topics.push(topic);
        break;
      }
    }
  }

  return topics;
}

console.time('detectTopic (baseline)');
for (let i = 0; i < 2000; i++) detectTopic(text);
console.timeEnd('detectTopic (baseline)');

console.time('detectTopicOptimized (pre-lowercased + early return)');
for (let i = 0; i < 2000; i++) detectTopicOptimized(text);
console.timeEnd('detectTopicOptimized (pre-lowercased + early return)');

// Test framing score with indexOf instead of regex (we saw it was faster)
// Let's re-verify indexOf vs regex
const TOPIC_LOWER: Record<string, { left: string[], right: string[] }> = {};
for (const [topic, lexicon] of Object.entries(TOPIC_LEXICONS)) {
  TOPIC_LOWER[topic] = {
    left: lexicon.leftTerms.map(t => t.toLowerCase()),
    right: lexicon.rightTerms.map(t => t.toLowerCase())
  };
}

function optimizedFramingScoreIndexOf(text: string, topic: string): number {
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
      pos += term.length; // Advance by length to mimic non-overlapping match
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

import { calculateFramingScore } from './src/lib/lexicons.js';
console.time('calculateFramingScore (baseline)');
for (let i = 0; i < 2000; i++) calculateFramingScore(text, 'healthcare');
console.timeEnd('calculateFramingScore (baseline)');

console.time('optimizedFramingScoreIndexOf');
for (let i = 0; i < 2000; i++) optimizedFramingScoreIndexOf(text, 'healthcare');
console.timeEnd('optimizedFramingScoreIndexOf');
