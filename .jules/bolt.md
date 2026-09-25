
## 2024-05-30 - RegExp Instantiation in Hot Loops
**Learning:** Instantiating `new RegExp(..., 'gi')` dynamically inside loops (like iterating over lexicons) has significant parsing and compilation overhead compared to simple string matching, especially when checking against long texts.
**Action:** Always replace dynamic `new RegExp()` inside hot loops with module-scoped, pre-lowercased arrays and `indexOf()` while-loops for significant execution speedups (e.g., ~3x faster).
