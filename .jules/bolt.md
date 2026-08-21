
## 2025-02-23 - Lexicon Optimization in Node.js
**Learning:** In Node.js/Bun, repeatedly creating `new RegExp()` in a hot loop for large static lexicons creates a significant performance bottleneck (e.g., 2-3x slower) compared to pre-caching lowercased text and using `indexOf()`.
**Action:** When implementing text detection algorithms against static dictionaries, map the dictionaries to lowercased terms at module initialization, and loop with `text.indexOf(term, pos)` rather than instantiating dynamic RegExps on the fly.
