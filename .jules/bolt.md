## 2024-07-20 - Performance optimization in string matching
**Learning:** In Node.js/Bun, replacing inline dynamic `new RegExp(..., "gi")` and `.match()` inside hot loops with module-scoped arrays and `indexOf()` while-loops yields significant execution speedups (~80% in microbenchmarks) and reduces garbage collection overhead.
**Action:** When implementing text analysis or search algorithms over arrays of terms, prefer `indexOf` loops over inline regular expression instantiations for performance.
