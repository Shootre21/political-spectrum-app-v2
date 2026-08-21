1. Modify `src/lib/lexicons.ts` to implement performance optimizations.
   - Pre-lowercase `EMOTIONAL_LEXICON.highEmotion` and terms in `TOPIC_LEXICONS` at the module scope so we don't repeatedly lowercase them or construct `new RegExp(..., 'gi')` inside loops.
   - Refactor `detectTopic`: use standard `for` loops with early breaks instead of `.filter()` mapping and allocating new arrays in hot paths.
   - Refactor `calculateFramingScore` and `calculateEmotionalScore`: use `indexOf()` in a `while` loop instead of `new RegExp(term, 'gi')` and `match()`. This eliminates the expensive creation of Regex objects during every check.
2. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
3. Submit the change using the `submit` tool, including performance impact analysis in the PR description, and using the `⚡ Bolt: ` title format.
