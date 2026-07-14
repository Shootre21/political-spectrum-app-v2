
## 2024-07-14 - Fast String Matching Loops Override Inline Regex
**Learning:** In hot path string analysis loops (like lexicons/bias checking), using inline `new RegExp()` instantiations and `.match()` inside the loop is highly inefficient. Benchmarks show a custom `indexOf` while-loop that simply counts occurrences (`pos += term.length`) is ~5x faster than native Regex in this environment.
**Action:** When implementing counting of substring occurrences in text analysis pipelines, always replace inline regex with a custom `indexOf` counter to prevent unnecessary Regex compilation overhead.
