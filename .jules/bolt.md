## 2026-09-14 - Playwright missing on tests

**Learning:** `bun test` fails due to `@playwright/test` missing in `tests/screenshots.spec.ts`. There are no `src/` unit tests. This matches the known environment limitations detailed in memory.
**Action:** Proceed despite the test error since the error is a known environmental limitation and not caused by the logic change in `src/lib/lexicons.ts`.
