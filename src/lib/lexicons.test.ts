import { test, expect } from 'bun:test';
import {
  detectTopic,
  calculateFramingScore,
  calculateEmotionalScore,
  detectPartisanMarkers,
  detectAuthoritarianMarkers,
  detectSocialistMarkers,
  extractSources
} from './lexicons';

test('detectTopic correctly identifies topics with early exits', () => {
  const text1 = "We need comprehensive immigration reform and a path to citizenship.";
  expect(detectTopic(text1)).toEqual(["immigration"]);

  const text2 = "The border invasion by illegal aliens must stop. The climate crisis is a hoax.";
  expect(detectTopic(text2)).toEqual(["immigration", "climate"]);

  const text3 = "No relevant topics here.";
  expect(detectTopic(text3)).toEqual([]);
});

test('calculateFramingScore calculates scores accurately with pre-compiled regex', () => {
  const textLeft = "undocumented immigrant and asylum seeker";
  expect(calculateFramingScore(textLeft, "immigration")).toBe(-1.0); // 2 terms * -0.5

  const textRight = "illegal alien and border invasion";
  expect(calculateFramingScore(textRight, "immigration")).toBe(1.0); // 2 terms * 0.5

  const textMixed = "undocumented worker vs illegal immigrant";
  expect(calculateFramingScore(textMixed, "immigration")).toBe(0); // -0.5 + 0.5

  // Test case-insensitivity
  const textCaps = "ILLEGAL ALIEN";
  expect(calculateFramingScore(textCaps, "immigration")).toBe(0.5);

  expect(calculateFramingScore("random text", "immigration")).toBe(0);
});

test('calculateEmotionalScore calculates scores accurately with pre-compiled regex', () => {
  const text = "This is a shocking and devastating bombshell!";
  expect(calculateEmotionalScore(text)).toBe(0.6); // 3 terms * 2 = 6, 6/10 = 0.6

  // Test case-insensitivity
  const textCaps = "SHOCKING BOMBSHELL";
  expect(calculateEmotionalScore(textCaps)).toBe(0.4);

  expect(calculateEmotionalScore("normal text without emotional words")).toBe(0);
});

test('marker detection functions accurately identify markers without redundant toLowerCase', () => {
  const text = "The radical left and far right both agree that the deep state is a threat to the socialist agenda.";

  const partisan = detectPartisanMarkers(text);
  // Sort the arrays to ignore order since it depends on the iteration order of the markers list
  expect(partisan.markers.sort()).toEqual(["radical left", "far right", "deep state", "threat to", "radical", "socialist agenda"].sort());
  expect(partisan.score).toBe(9); // 6 markers * 1.5 = 9

  const authoritarian = detectAuthoritarianMarkers(text);
  expect(authoritarian.markers).toEqual([]);
  expect(authoritarian.score).toBe(0);

  const textAuth = "The dictator rules with an iron fist.";
  const authoritarian2 = detectAuthoritarianMarkers(textAuth);
  expect(authoritarian2.markers.sort()).toEqual(["dictator", "iron fist"].sort());
  expect(authoritarian2.score).toBe(4); // 2 markers * 2 = 4

  const textSoc = "Workers unite against capitalist exploitation!";
  const socialist = detectSocialistMarkers(textSoc);
  expect(socialist.markers.sort()).toEqual(["workers unite", "capitalist exploitation"].sort());
  expect(socialist.score).toBe(4); // 2 markers * 2 = 4
});

test('extractSources correctly extracts sources', () => {
  const text = "The professor and the CEO met at the white house with an activist.";
  const sources = extractSources(text);

  expect(sources.types.sort()).toEqual(["expert", "government", "activist", "corporate"].sort());
  expect(sources.count).toBe(4);
  expect(sources.details.sort()).toEqual(["professor", "white house", "activist", "ceo"].sort()); // Only the words actually found in the text
});
