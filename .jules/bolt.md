## 2024-05-30 - Lexicons Precompilation
**Learning:** In hot loops like text analysis, recreating RegExp objects inside functions and doing array.map/filter causes significant garbage collection and parsing overhead. Using the `gi` flag allows avoiding the `text.toLowerCase()` conversion beforehand as well.
**Action:** Always pre-compile RegExp arrays at module level and pre-lowercase static arrays for `includes` checks while preserving exact casing output via array indices.
