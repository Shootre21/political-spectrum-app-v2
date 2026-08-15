
## $(date +%Y-%m-%d) - Text Analysis Bottleneck
**Learning:** High frequency calls to `new RegExp(..., 'gi')` within `for` loops against string constants in hot-path scoring functions (like `calculateFramingScore` and `calculateEmotionalScore`) causes severe performance bottlenecks in Bun/Node.
**Action:** Always prefer flattening/pre-lowercasing the arrays of strings at module scope and using an `indexOf` while-loop to count occurrences instead of instantiating Regex objects repeatedly.
