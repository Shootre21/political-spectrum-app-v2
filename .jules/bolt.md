## 2024-05-12 - RegExp inside Loops
**Learning:** Instantiating `new RegExp()` inside a loop for text analysis functions in `src/lib/lexicons.ts` creates significant overhead.
**Action:** Pre-compile `RegExp` objects at the module scope when they depend purely on static configuration lexicons.

## 2024-05-12 - Case-Insensitivity with Static Lexicons
**Learning:** Removing `.toLowerCase()` from string-matching checks against predefined static lexicons introduces case-insensitivity bugs if uppercase characters are ever added or expected in the lexicons, even if the lexicons are fully lowercase right now.
**Action:** Retain `.toLowerCase()` calls on loop terms, or map `.toLowerCase()` across the static lexicons at module load, to preserve correct case-insensitive behavior without unexpected failures later.
