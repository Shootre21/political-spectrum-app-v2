## 2025-03-26 - [Backend] Fixing N+1 Queries in Analytics Module

**Learning:** When fetching data dynamically for arrays of parameters (e.g. comparing multiple sources in `analytics.ts`), using `Promise.all` with individual `db.article.findMany` calls creates significant N+1 query bottlenecks. Prisma's `OR` operator combined with an in-memory filter post-fetch provides a much faster, single-query alternative.

**Action:** Always map array inputs to Prisma's `OR` or `in` operator combined with an empty-array guard clause (e.g., `if (!array || array.length === 0) return []`) to avoid unnecessary database connections and slow concurrent query execution.
