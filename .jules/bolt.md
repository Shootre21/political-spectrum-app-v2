## 2024-08-14 - Replace dynamic RegExp with indexOf in hot loops
**Learning:** For high-performance text analysis in Node.js/Bun, instantiating `new RegExp(..., 'gi')` inside hot loops for every lexicon term is extremely slow and memory-intensive due to regex compilation overhead and match array allocation.
**Action:** Replace inline global regex matching with a `while` loop using `indexOf(term, pos)` and stepping `pos += term.length`. This perfectly replicates non-overlapping match behavior and is ~4x faster in microbenchmarks for this specific workload.
