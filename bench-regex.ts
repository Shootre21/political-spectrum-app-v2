import { EMOTIONAL_LEXICON } from './src/lib/lexicons.js';

const text = "This is a radical left agenda. They are trying to push universal healthcare and medicare for all, which will lead to socialized medicine and death panels. It's a shocking and devastating government takeover.".repeat(100);

const PRECOMPILED_HIGH_EMOTION_REGEX = EMOTIONAL_LEXICON.highEmotion.map(word => new RegExp(word, 'gi'));

function calculateEmotionalScoreRegexPrecompiled(text: string): number {
  let score = 0;
  for (let i = 0; i < PRECOMPILED_HIGH_EMOTION_REGEX.length; i++) {
    const matches = text.match(PRECOMPILED_HIGH_EMOTION_REGEX[i]);
    if (matches) {
      score += matches.length * 2;
    }
  }
  return Math.min(score / 10, 10);
}

function calculateEmotionalScore(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;

  // Count high-emotion words
  for (const word of EMOTIONAL_LEXICON.highEmotion) {
    const regex = new RegExp(word, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  }

  return Math.min(score / 10, 10);
}

console.time('calculateEmotionalScore (baseline)');
for (let i = 0; i < 2000; i++) calculateEmotionalScore(text);
console.timeEnd('calculateEmotionalScore (baseline)');

console.time('calculateEmotionalScoreRegexPrecompiled (optimized)');
for (let i = 0; i < 2000; i++) calculateEmotionalScoreRegexPrecompiled(text);
console.timeEnd('calculateEmotionalScoreRegexPrecompiled (optimized)');

// Now test with topics

import { TOPIC_LEXICONS } from './src/lib/lexicons.js';
const TOPICS = Object.keys(TOPIC_LEXICONS);
const PRECOMPILED_TOPICS: Record<string, { left: RegExp[], right: RegExp[] }> = {};
for (const [topic, lexicon] of Object.entries(TOPIC_LEXICONS)) {
  PRECOMPILED_TOPICS[topic] = {
    left: lexicon.leftTerms.map(t => new RegExp(t, 'gi')),
    right: lexicon.rightTerms.map(t => new RegExp(t, 'gi'))
  };
}

function optimizedFramingScore(text: string, topic: string): number {
  const lexicon = PRECOMPILED_TOPICS[topic];
  if (!lexicon) return 0;

  let score = 0;

  for (let i = 0; i < lexicon.left.length; i++) {
    const matches = text.match(lexicon.left[i]);
    if (matches) {
      score -= matches.length * 0.5;
    }
  }

  for (let i = 0; i < lexicon.right.length; i++) {
    const matches = text.match(lexicon.right[i]);
    if (matches) {
      score += matches.length * 0.5;
    }
  }

  return score;
}

import { calculateFramingScore } from './src/lib/lexicons.js';

console.time('calculateFramingScore (baseline)');
for (let i = 0; i < 2000; i++) calculateFramingScore(text, 'healthcare');
console.timeEnd('calculateFramingScore (baseline)');

console.time('optimizedFramingScore (precompiled regex)');
for (let i = 0; i < 2000; i++) optimizedFramingScore(text, 'healthcare');
console.timeEnd('optimizedFramingScore (precompiled regex)');
