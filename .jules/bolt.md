
## 2023-10-20 - [Lexicons String Matching Bottleneck]
**Learning:** In Bun/Node text analysis, caching arrays of pre-compiled global regular expressions can sometimes perform worse than inline regex due to iterative search overhead on large strings. However, replacing dynamic `new RegExp` instantiations inside hot loops with a fast `indexOf` while-loop for occurrence counting yields significant speedups (~2x-3x) when the terms are simple strings without special regex characters.
**Action:** When performing substring counting for scoring algorithms where terms are static simple strings, implement a custom `indexOf` while-loop helper instead of relying on `String.prototype.match(new RegExp(...))` in hot paths.
