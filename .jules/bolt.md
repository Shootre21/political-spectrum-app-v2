
## 2024-06-19 - Fast array checks in hot loops
**Learning:** Using `Array.prototype.some()` instead of array spreading `[...a, ...b]` and `.filter()` provides a massive performance boost (~30% faster in benchmarks) by avoiding intermediate allocations and enabling early exits when checking text against multiple term arrays.
**Action:** When searching for term matches across multiple static arrays, prioritize `some()` for early-exit evaluation over `.filter().length > 0` and avoid array spread allocations inside loop bodies.
