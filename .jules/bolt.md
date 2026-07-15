## 2025-03-05 - Avoid inline Regex instantiation in hot loops
**Learning:** Instantiating `new RegExp(..., 'gi')` inside text-processing loops (like the framing and emotionality scorers in `lexicons.ts`) creates massive overhead due to engine compilation and match array allocations. Single-word lookups are heavily penalized compared to plain string searching.
**Action:** Replace dynamic regexes inside loops with custom `indexOf` accumulators (e.g., `countOccurrences(text, term)`) to bypass regex engine allocation completely while still achieving functionally equivalent sub-string counting.
