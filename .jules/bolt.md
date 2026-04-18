## 2025-03-02 - Batched Prisma Queries in Analytics
**Learning:** Using `Promise.all` mapping over array items with `db.article.findMany` (N+1 queries) is a performance anti-pattern. While Prisma might batch some operations internally under perfect conditions, explicitly using `OR` or `in` clauses is guaranteed to collapse database trips into a single query.
**Action:** When pulling analytics for multiple sources, tags, or authors, use a single query with an `OR`/`in` array and reconstruct the per-item grouped data in-memory locally.
