## 2025-02-14 - Replace new RegExp inside loops with indexOf
**Learning:** Instantiating `new RegExp(..., 'gi')` inside loops for text analysis is significantly slower than using standard string `.indexOf` with a custom while-loop when we just need to count occurrences of static terms.
**Action:** When searching for literal strings (e.g. lexicons), prefer string methods (`indexOf`, `includes`) inside a while-loop instead of dynamically instantiating regexes.
