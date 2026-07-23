
## 2024-07-23 - Optimize Text Analysis Lexicon Checks
**Learning:** Instantiating `new RegExp(term, 'gi')` dynamically inside hot loops for every text analysis operation (like calculating framing/emotional scores) incurs a significant garbage collection overhead and cpu penalty in Node/Bun compared to `String.indexOf` on pre-lowercased strings.
**Action:** When implementing complex text analysis or counting logic over static term lists, pre-compute lowercased maps at module load time and use a custom `indexOf` `while`-loop helper instead of dynamic regular expressions. Always test arrays for emptiness to avoid infinite loops in the custom helper.
