## 2024-06-03 - Avoid inline regex instantiation in hot loops
**Learning:** In Node.js/Bun, repeatedly creating `new RegExp()` and converting strings to lower case inside tight loops is a major performance bottleneck for text processing. `indexOf` operations with pre-lowercased caches are roughly 2-3x faster.
**Action:** When implementing text analysis logic, pre-compute lowercased versions of static lexicons at the module scope and use `indexOf` combined with a `while` loop (or manual occurrence counting) instead of `String.prototype.match(new RegExp(..., 'gi'))`.
