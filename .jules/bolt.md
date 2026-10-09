## 2024-05-18 - Replacing RegExp with indexOf for String Counting Performance
**Learning:** In Bun/Node text analysis, dynamic `new RegExp(term, 'gi')` instantiations inside loops can be up to 2.5x slower than a standard `while(pos !== -1)` loop using `indexOf` for simple substrings counting.
**Action:** When finding matches of literal strings where regex control characters are not needed, always prefer an `indexOf` loop while advancing by `term.length` for non-overlapping matches.
