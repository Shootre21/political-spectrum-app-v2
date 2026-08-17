
## 2024-05-18 - Fast Text Occurrences

**Learning:** When replacing `String.match(new RegExp(..., 'gi'))` inside hot loops with an allocation-free equivalent, combining `indexOf` with a `while` loop that advances by the length of the matched string exactly replicates global regex behavior (non-overlapping matches). This avoids all intermediate array allocations that happen with `String.match`.
**Action:** Use `indexOf` `while` loops instead of inline regex creation for counting substring occurrences in high-performance paths.
