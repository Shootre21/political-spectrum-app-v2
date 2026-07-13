## 2024-05-18 - Fast String Searching and Counting
**Learning:** For high-performance text analysis in Node.js/Bun, replacing inline `new RegExp(..., 'gi')` instantiations inside hot loops with module-scoped, pre-lowercased arrays and `indexOf()` while-loops yields significant execution speedups.
**Action:** Replace `match` and `new RegExp` with `indexOf` in a while-loop when simply counting occurrences of static strings.
