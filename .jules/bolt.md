## 2025-02-28 - Regex Compilations inside Loops
**Learning:** Instantiating `new RegExp(..., 'gi')` inside loop bodies for text analysis over a dictionary of terms incurs significant performance overhead.
**Action:** When implementing text analysis scoring on a per-term basis inside hot loops, replace `new RegExp` and `.match()` with a combination of `.toLowerCase()` caching and a `while ((pos = text.indexOf(term, pos)) !== -1)` loop, carefully advancing `pos += term.length` to replicate global match behavior safely.
