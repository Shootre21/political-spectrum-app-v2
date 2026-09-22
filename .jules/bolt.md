## 2024-05-18 - Lexicon Pattern Micro-Optimizations

**Learning:** In string intensive tasks doing term matching, `String.prototype.match()` with an inline global `new RegExp(term, 'gi')` performs comparably to or sometimes worse than a custom string `indexOf` loop with pre-lowercased terms, primarily depending on payload size and JS engine (V8/JSC) optimizations. In the current engine (Bun/V8), a simple loop using `indexOf` combined with a pre-lowercased search string proved significantly faster than instantiating inline Regexps globally, reducing times by ~20-30% on average text blocks.
However, in `detectTopic`, allocating arrays on the fly using `[...lexicon.leftTerms, ...lexicon.rightTerms]` inside a hot loop and mapping it with `.filter` incurs significant GC/allocation overhead for large sets of inputs compared to standard `for` loops with early `break` and no heap allocations.

**Action:** Replace inline `[...array1, ...array2]` array spreads and `.filter().length > 0` checks in hot topic detection paths with simple explicit `for` loops that `break` early. This provides an easy performance win with low complexity.
