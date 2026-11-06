
## 2024-05-18 - Optimized String Matching in Lexicons
**Learning:** In Node.js/Bun text analysis loops, instantiating `new RegExp(term, 'gi')` iteratively for each word in large lexicons causes significant GC and JIT overhead compared to native substring searches when term matching doesn't require regex features.
**Action:** Replace `new RegExp` and `.match()` with simple `indexOf` loops with `text.toLowerCase()` for string matching where regex syntax is not necessary.
