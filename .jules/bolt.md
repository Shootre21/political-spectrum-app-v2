
## 2025-02-20 - RegExp vs indexOf for Lexicon Searching
**Learning:** In Bun/Node.js text analysis loops, dynamically instantiating `new RegExp()` inside tight inner loops (e.g., scoring text against large static arrays of framing/emotion terms) is significantly slower than using `indexOf()` in a `while` loop against a pre-lowercased target string. The overhead of regex compilation and execution dwarfs simple substring matching.
**Action:** When searching for literal strings (where no regex metacharacters are needed) across large arrays in hot paths, replace inline `new RegExp(term, 'gi')` with a custom non-overlapping `countOccurrences` helper utilizing `indexOf` and `.length` indexing.
