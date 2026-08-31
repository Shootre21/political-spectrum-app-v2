## 2025-02-23 - Optimize score calculation
**Learning:** In text parsing hot paths, dynamically instantiating `new RegExp(..., 'gi')` inside loops is a massive performance bottleneck. The `String.prototype.match()` behavior can be exactly mimicked for static substrings using `String.prototype.indexOf()` inside a while loop, as long as `pos` is advanced by `term.length` and empty string edge cases are handled.
**Action:** Always prefer pre-compiling regular expressions or using `indexOf` loops when searching for literal substrings in hot loops to significantly boost performance.
