## 2025-02-21 - Optimizing Text Lexicon Matching
**Learning:** For high-performance text analysis in Node.js/Bun, replacing inline `new RegExp(..., 'gi')` instantiations inside hot loops with module-scoped, pre-lowercased arrays and `indexOf()` while-loops yields significant execution speedups (measured ~50% faster in microbenchmarks).
**Action:** When implementing word counting or occurrence checks, prioritize static string functions like `indexOf` combined with statically pre-lowercased cache arrays over regex generation when case-insensitive term matching is needed on static lexicons.
