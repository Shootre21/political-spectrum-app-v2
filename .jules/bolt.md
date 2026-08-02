## 2024-05-15 - Fast text analysis in Node.js
**Learning:** Instantiating `new RegExp(..., 'gi')` inside loops for dictionary-based text matching creates a massive performance bottleneck due to regex compilation overhead.
**Action:** When searching for large arrays of static terms in Node.js/Bun hot loops, write custom `indexOf`-based while-loops over pre-lowercased target text. This reliably outperforms inline regex compilation by 2x-3x.
