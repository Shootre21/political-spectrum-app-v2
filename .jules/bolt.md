## 2024-05-24 - indexOf vs RegExp for Simple String Counts
**Learning:** In Node.js/Bun, repeatedly instantiating `new RegExp()` inside a loop for simple string matching is extremely slow. Replacing it with a custom `indexOf` while-loop (advancing by `term.length` for non-overlapping counts) yields significant performance gains.
**Action:** Replace `new RegExp(term, 'gi')` inside loops with `indexOf` when matching simple string terms from lexicons. Always pre-lowercase the text and terms to replicate case-insensitivity, and guard against empty strings (`term.length === 0`).
