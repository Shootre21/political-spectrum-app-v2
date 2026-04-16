## 2025-02-23 - Batched Queries in Analytics

**Learning:** When dealing with functions fetching comparison data across multiple sources like `compareSources` in `src/lib/analytics.ts`, replacing an N+1 `Promise.all` + `findMany` mapping with a batched `OR` operator and handling in-memory `.filter` drastically reduces query time (from ~227ms to ~7ms for 10 items).
**Action:** Before writing loops using Prisma `findMany`, always check if it can be combined into a single batched query with `OR` or `in` operator, followed by in-memory grouping, while safely guarding against empty arrays to prevent full table scans.
