## 2024-05-19 - Regex to IndexOf Optimization
**Learning:** In Node.js/Bun, replacing inline `new RegExp(..., 'gi')` instantiations inside hot loops with `indexOf()` while-loops yields significant execution speedups (~60% faster) for simple text occurrence counting.
**Action:** When searching for literal strings from lexicons, prefer `indexOf` over dynamic `new RegExp()` instantiations. Remember to advance the index by `term.length` to replicate regex's non-overlapping match behavior.
