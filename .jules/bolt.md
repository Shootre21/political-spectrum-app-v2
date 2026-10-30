
## 2024-03-01 - Lexicon RegExp to IndexOf Array Matching
**Learning:** In hot loops checking large static lexicons, pre-compiling arrays of global `RegExp` objects incurs unexpected runtime overhead versus using standard `String.prototype.indexOf()`. Additionally, replacing intermediate array map/filter allocations with `Array.prototype.some()` provides extreme short-circuiting advantages that bypass allocation penalties entirely.
**Action:** When searching text for large arrays of known literal terms (not dynamic patterns), cache lowercased strings at module scope (filtering empty strings to prevent infinite loops) and prefer `.some()` or `indexOf()` while-loops. Avoid on-the-fly `RegExp` instantiation inside iterative processing flows.
