## 2024-05-30 - Performance Bottleneck in Text Analysis

**Learning:** When doing text analysis and checking for string occurrences across arrays of static terms in a hot path, dynamically instantiating `new RegExp(term, 'gi')` inside a loop (and doing `.match(regex)`) is very expensive. Furthermore, using `term.toLowerCase()` inside hot loops over static arrays causes unnecessary memory allocations and CPU cycles, especially since terms in `TOPIC_LEXICONS` and `EMOTIONAL_LEXICON` are already mostly lowercase.

**Action:** Replace dynamic regex instantiation with a fast `indexOf` while-loop for counting occurrences, and pre-lowercase static term arrays at module scope for `.includes()` checks where case-insensitivity is desired without the overhead of repeated string conversions.
