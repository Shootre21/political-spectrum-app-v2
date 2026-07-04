## 2026-07-04 - Optimizing Text Analysis Lexicons
**Learning:** In Node.js/Bun, replacing inline 'new RegExp(..., 'gi')' and array creations (like '.filter()') inside hot loops with pre-lowercased, module-scoped arrays and a custom 'indexOf' based counter yields significant performance improvements (2x-4x speedup) and reduces memory allocation.
**Action:** Always consider pre-computing and flattening static dictionary arrays for text analysis and use string 'indexOf' loops instead of dynamic Regex generation on hot paths.
