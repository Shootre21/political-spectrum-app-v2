## 2024-07-10 - Fast string matching over inline regex creation
**Learning:** For high-performance text analysis in Node.js/Bun, replacing inline `new RegExp(..., 'gi')` instantiations inside hot loops with module-scoped, pre-lowercased arrays and `indexOf()` while-loops yields significant execution speedups.
**Action:** When implementing keyword scoring or framing detection that relies on counting non-overlapping occurrences from predefined lexicons, use `indexOf()` while loops instead of dynamically parsing and allocating new Regular Expressions.
