
## 2024-06-08 - String Matching Overhead
**Learning:** In hot loops for text analysis, instantiating `new RegExp(term, 'gi')` dynamically inside the loop causes massive performance overhead. Using module-scoped pre-lowercased arrays combined with `indexOf` loops provides an enormous speedup.
**Action:** When implementing text matching, pre-compute lowercased dictionaries and rely on literal string matching functions instead of building regex objects dynamically on the fly.

## 2024-06-08 - Patch File Artifacts
**Learning:** Using JS scripts to replace multi-line strings with regular expressions is safer and avoids generating `.bak` or `.rej` patch files, which pollute the repository and fail code review.
**Action:** Always verify git status and clean up any unintended backup/reject files, and revert unrequested lockfile modifications before completing a pre-commit step.
