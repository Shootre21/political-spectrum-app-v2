## 2024-06-03 - [Optimize detectTopic]
**Learning:** When checking for the existence of string matches across arrays in hot paths, prefer `Array.prototype.some()` instead of manual `for` loops with early `break` statements. `.some()` provides identical short-circuiting performance benefits while remaining highly readable and avoiding costly intermediate array allocations (like array spreading).
**Action:** Use `.some()` instead of verbose `for` loops when short-circuiting array searches to balance performance and readability.
