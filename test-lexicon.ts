import { calculateFramingScore, calculateEmotionalScore } from './src/lib/lexicons.js';

const text = "This is a radical left agenda. They are trying to push universal healthcare and medicare for all, which will lead to socialized medicine and death panels. It's a shocking and devastating government takeover.";

console.log('Framing score (healthcare):', calculateFramingScore(text, 'healthcare'));
console.log('Emotional score:', calculateEmotionalScore(text));
