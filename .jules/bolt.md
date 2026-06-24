
## 2026-06-24 - Optimizing Hot-Loop Text Analysis via IndexOf
**Learning:** In Node.js/V8, inline `new RegExp(..., 'gi')` instantiations inside hot text-parsing loops (like bias detection) are surprisingly slow, even with internal engine caching. Relying on `.toLowerCase()` conversion and iterating with `indexOf()` using while-loops is substantially faster (often 2-3x faster) for simple substring counting, provided the term strings are also pre-lowercased at module initialization to prevent duplicate allocations.
**Action:** Always prefer pre-lowercasing static lookup arrays at the module level and using standard `indexOf()` while-loops (with early exit `if (term.length === 0) return;` checks) instead of `new RegExp` for static string occurrence counting in hot application paths.
