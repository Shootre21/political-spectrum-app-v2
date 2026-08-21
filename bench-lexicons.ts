import { EMOTIONAL_LEXICON } from './src/lib/lexicons.js';

const text = "This is a radical left agenda. They are trying to push universal healthcare and medicare for all, which will lead to socialized medicine and death panels. It's a shocking and devastating government takeover.".repeat(100);

const EMOTIONAL_LOWER = {
  highEmotion: EMOTIONAL_LEXICON.highEmotion.map(w => w.toLowerCase())
};

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

function optimizedEmotionalScore(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;

  for (let i = 0; i < EMOTIONAL_LOWER.highEmotion.length; i++) {
    const word = EMOTIONAL_LOWER.highEmotion[i];
    if (word.length === 0) continue;

    // We can use RegExp pre-compiled!
    // But since EMOTIONAL_LOWER only runs this once, let's see.
    let pos = 0;
    while ((pos = lowerText.indexOf(word, pos)) !== -1) {
      score += 2;
      pos += word.length;
    }
  }

  return Math.min(score / 10, 10);
}

function optimizedEmotionalScoreWithRegexGlobal(text: string): number {
  let score = 0;
  // precompile regexes?
  // ... this implies we'd pre-compile.
  return score;
}

// Another idea for detectTopic:
function detectTopicFast(text: string): string[] {
  // same as optimizedDetectTopic but use indexOf
  return [];
}

console.log(calculateEmotionalScore(text));
console.log(optimizedEmotionalScore(text));

console.time('calculateEmotionalScore');
for (let i = 0; i < 2000; i++) calculateEmotionalScore(text);
console.timeEnd('calculateEmotionalScore');

console.time('optimizedEmotionalScore');
for (let i = 0; i < 2000; i++) optimizedEmotionalScore(text);
console.timeEnd('optimizedEmotionalScore');
