## 2024-05-30 - High-Performance Text Analysis Pattern
**Learning:** In Node.js/Bun, replacing inline `new RegExp(..., 'gi')` instantiations inside hot loops with module-scoped, pre-lowercased arrays and custom `indexOf()` while-loops yields significant execution speedups (e.g. from ~28ms down to ~10ms for 10k iterations).
**Action:** When performing word/term occurrence counting or simple case-insensitive existence checks, always use `indexOf` on pre-lowercased strings rather than compiling regular expressions on the fly.
