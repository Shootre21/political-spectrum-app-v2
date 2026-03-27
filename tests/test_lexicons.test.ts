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

test("detectTopic detects correct topics", () => {
  const text = "We need comprehensive immigration reform and a living wage.";
  const topics = detectTopic(text);
  expect(topics).toContain("immigration");
  expect(topics).toContain("economy");
});

test("calculateFramingScore returns accurate scores", () => {
  const text = "undocumented immigrant living wage job creators illegal alien";
  const immigrationScore = calculateFramingScore(text, "immigration");
  expect(immigrationScore).toBe(0); // 1 left, 1 right -> -0.5 + 0.5 = 0

  const economyScore = calculateFramingScore(text, "economy");
  expect(economyScore).toBe(0); // 1 left, 1 right -> -0.5 + 0.5 = 0

  const climateScore = calculateFramingScore(text, "climate");
  expect(climateScore).toBe(0);
});

test("calculateEmotionalScore returns accurate scores", () => {
  const text = "This is a devastating and shocking report.";
  const score = calculateEmotionalScore(text);
  expect(score).toBeGreaterThan(0);
});

test("detectPartisanMarkers finds correct markers", () => {
  const text = "The radical left and the radical right are extremes.";
  const result = detectPartisanMarkers(text);
  expect(result.markers).toContain("radical left");
  expect(result.markers).toContain("radical right");
  expect(result.score).toBeGreaterThan(0);
});

test("detectAuthoritarianMarkers finds correct markers", () => {
  const text = "He rules with an iron fist like a dictator.";
  const result = detectAuthoritarianMarkers(text);
  expect(result.markers).toContain("iron fist");
  expect(result.markers).toContain("dictator");
});

test("detectSocialistMarkers finds correct markers", () => {
  const text = "class struggle and wealth redistribution";
  const result = detectSocialistMarkers(text);
  expect(result.markers).toContain("class struggle");
  expect(result.markers).toContain("wealth redistribution");
});

test("extractSources identifies sources", () => {
  const text = "The professor and the CEO agreed with the senator.";
  const result = extractSources(text);
  expect(result.types).toContain("expert");
  expect(result.types).toContain("corporate");
  expect(result.types).toContain("government");
  expect(result.details.length).toBeGreaterThan(0);
});
