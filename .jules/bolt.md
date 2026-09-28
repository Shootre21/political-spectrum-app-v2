## 2025-02-28 - Avoid Inline RegExp in Hot Loops
**Learning:** Instantiating `new RegExp(..., 'gi')` inside text analysis loops creates significant memory allocation and compilation overhead in Node.js/Bun.
**Action:** When counting substring occurrences, use pre-lowercased terms and `indexOf` inside a `while` loop (advancing the index by the term's length) to achieve ~1.5x - 3x faster performance without sacrificing matching accuracy.
