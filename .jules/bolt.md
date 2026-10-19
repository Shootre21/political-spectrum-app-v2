## 2024-05-30 - indexOf vs Regex for Text Analysis Optimization
**Learning:** In Node.js/Bun, repeatedly calling `new RegExp(..., 'gi')` inside hot loops for simple string term counting is highly inefficient compared to a while-loop using `indexOf`. The `TOPIC_LEXICONS` and `EMOTIONAL_LEXICON` strings are static dictionary terms without special regex syntax.
**Action:** Replace dynamic regex instantiations with `indexOf` loops inside text analysis functions. Use `pos += term.length` to safely mimic non-overlapping `.match()` behavior.
