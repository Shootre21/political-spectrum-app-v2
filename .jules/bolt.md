## 2024-07-19 - Pre-lowercasing Lexicons and Fast Custom indexOf
**Learning:** In text analysis hot loops (`src/lib/lexicons.ts`), recreating regex objects (`new RegExp(..., 'gi')`) inline and mapping arrays for lowercasing per function call causes massive overhead in Node.js/Bun.
**Action:** Replace inline `new RegExp(..., 'gi')` instantiations inside hot loops with module-scoped, pre-lowercased arrays and `indexOf()` while-loops. This yields significant execution speedups.
