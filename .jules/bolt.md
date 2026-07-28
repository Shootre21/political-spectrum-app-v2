## 2026-07-28 - sed Syntax for Targeted Reading
**Learning:** When using `sed -n` to read targeted lines, passing the filename inside the single quotes (e.g., `sed -n '353,375p filename'`) causes a syntax error.
**Action:** Always separate the sed script and the filename with a space: `sed -n '353,375p' filename`.
