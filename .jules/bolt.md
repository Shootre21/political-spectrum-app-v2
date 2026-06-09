## 2024-06-09 - Optimize Text Processing Hot Loops
**Learning:** In Node.js/Bun, replacing inline `new RegExp(..., 'gi')` inside hot loops with module-scoped pre-lowercased arrays and `indexOf()` while-loops yields significant execution speedups for text analysis.
**Action:** When implementing text matching, precompute arrays containing the lowercased terms at module scope. If the matching doesn't strictly require regex specific features (like word boundaries), standard `indexOf` looping over lowercased strings is much faster than dynamic regex evaluation.
