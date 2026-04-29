
## 2024-05-23 - Analytics N+1 Query Resolution
**Learning:** `Promise.all` with multiple `db.article.findMany` queries creates an N+1 problem that can be significantly optimized into a single batch query using Prisma's `OR` and mapping over the conditions.
**Action:** When working on loops fetching aggregated or related data across multiple items, combine the fetches into a single `findMany` using `OR` or `in`, then distribute the data in memory.
