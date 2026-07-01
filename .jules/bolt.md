
## 2024-05-30 - Optimize Regex Instantiations in Text Analysis
**Learning:** In Node.js/Bun, replacing inline `new RegExp(..., 'gi')` instantiations inside hot loops with module-scoped, pre-lowercased arrays and custom `indexOf()` while-loops yields significant execution speedups (e.g., >2x faster for calculateFramingScore) for basic string counting.
**Action:** When performing high-frequency text analysis, avoid allocating Regex objects in loops and prefer precomputed lowercase arrays and fast `indexOf()` loops.
