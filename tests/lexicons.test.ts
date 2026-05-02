import { expect, test } from "bun:test";
import {
  detectTopic,
  calculateFramingScore,
  calculateEmotionalScore,
  detectPartisanMarkers,
  detectAuthoritarianMarkers,
  detectSocialistMarkers,
  extractSources
} from "../src/lib/lexicons";

test("lexicons logic", () => {
  const sampleText = "The radical left and the mainstream media are pushing a class warfare with their fake news. Undocumented immigrant issues are alarming and shocking. Professor Smith says otherwise.";

  const topics = detectTopic(sampleText);
  expect(topics).toContain("immigration");

  const framing = calculateFramingScore(sampleText, "immigration");
  expect(framing).toBeLessThan(0); // "undocumented immigrant" is left term (-0.5)

  const emotional = calculateEmotionalScore(sampleText);
  expect(emotional).toBeGreaterThan(0); // "shocking"

  const partisan = detectPartisanMarkers(sampleText);
  expect(partisan.markers).toContain("radical left");
  expect(partisan.markers).toContain("mainstream media");

  const authoritarian = detectAuthoritarianMarkers(sampleText);
  expect(authoritarian.markers).toContain("fake news");

  const socialist = detectSocialistMarkers(sampleText);
  expect(socialist.markers).toContain("class warfare");

  const sources = extractSources(sampleText);
  expect(sources.types).toContain("expert");
  expect(sources.details).toContain("professor");
});
