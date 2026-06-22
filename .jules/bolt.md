## 2024-06-22 - Replacing dynamic RegExp loops with indexOf in V8
**Learning:** Instantiating `new RegExp()` inside a hot loop (like lexicon parsing across arrays of strings) causes a significant performance overhead (~3x slower) compared to an equivalent `indexOf()` while-loop.
**Action:** When performing simple substring counts across a list of terms, prefer `indexOf()` over inline regex creation for hot paths, especially when regex metacharacters or complex matching are not strictly required.
