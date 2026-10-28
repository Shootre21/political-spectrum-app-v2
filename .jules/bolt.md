## 2026-10-28 - RegExp instantiation vs indexOf in string analysis
**Learning:** In Bun/Node text analysis, instantiating new global Regular Expressions inside tight loops (like iterating over lexicons) is a major performance bottleneck compared to using a while-loop with `indexOf`.
**Action:** Replace dynamic `new RegExp` instantiation inside hot loops with `indexOf` counting to achieve > 10x speedup when doing string occurrence counting.
