## 2024-05-18 - Avoid array allocation in hot paths using .some()
**Learning:** Using `[...a, ...b].filter()` inside hot paths like text classification loops causes significant unnecessary array allocation and forces scanning of all elements even when a match is found.
**Action:** Use `.some()` on the individual arrays directly (`a.some(...) || b.some(...)`) to achieve short-circuit evaluation and prevent intermediate garbage collection, leading to measurable execution speedups.
