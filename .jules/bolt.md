## 2024-05-24 - Fast Lexicon Matching
**Learning:** In Node.js/Bun text analysis, dynamic global `new RegExp(..., 'gi')` instantiations inside hot loops for simple string terms are a significant performance bottleneck.
**Action:** Use `.toLowerCase()` on the source text and pre-lowercased terms with a custom `indexOf` while-loop instead of dynamic `RegExp` matching when processing large text against lexicons.
