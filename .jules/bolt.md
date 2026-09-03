## 2024-06-25 - Caching lowercased arrays and using index matching in Node.js

**Learning:** When performing repeated string matching checks inside hot loops for text analysis, instantiating `new RegExp(..., 'gi')` and running `.match()` is significantly slower than using pre-lowercased string arrays combined with standard `indexOf()` operations inside a `while` loop to emulate global matching. Furthermore, applying `.toLowerCase()` inline during a loop (`array.map(x => x.toLowerCase())` or `string.includes(term.toLowerCase())`) adds unnecessary string allocation overhead when the terms array is static.

**Action:** For text analysis algorithms, cache static term lists in a pre-lowercased state at the module level. Instead of global RegExp matches, iterate through matches using `let pos = 0; while ((pos = lowerText.indexOf(term, pos)) !== -1) { pos += term.length; }` to count occurrences accurately without regex instantiation penalties.
