
## 2023-10-22 - Replacing Array allocations and inline RegExp with Array.some() and indexOf() in Lexicon matching
**Learning:** In Bun/Node.js, array filtering operations inside hot loops (`allTerms.filter(...)`) for string matching, and dynamic inline `new RegExp(..., 'gi')` instantiations in text analysis scoring functions (`calculateFramingScore`), are surprisingly slow because they cause repetitive memory allocations and engine-level regex recompilations.
**Action:** Replace `Array.prototype.filter()` with `Array.prototype.some()` when only existence checks are needed, and replace inline `RegExp.match()` with `indexOf` inside while-loops for simple substring occurrence counting. Pre-compiling or flattening static lexicons at module scope provides an additional ~3x speedup.
