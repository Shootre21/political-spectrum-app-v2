## 2024-05-24 - Lexicon String Search Optimization
**Learning:** In Node.js/Bun, repeatedly creating `new RegExp` and calling `String.prototype.match` inside hot loops for simple string existence counting is a major performance bottleneck compared to an `indexOf` while-loop.
**Action:** Replace inline dynamic regex instantiation with simple `indexOf` loops when counting literal string occurrences inside iterative algorithms like scoring or topic detection.
