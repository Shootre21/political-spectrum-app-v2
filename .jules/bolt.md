## 2024-04-09 - [Performance Optimization] Refactor N+1 Prisma query in compareSources
**Learning:** Found an N+1 `Promise.all(db.article.findMany(...))` bottleneck in `compareSources` (`src/lib/analytics.ts`) that executes an individual database query for each source requested. Replaced it with a single batched query using Prisma's `OR` operator, which retrieves all relevant articles in one round trip.
**Action:** When mapping over items to fetch data, replace `Promise.all` + individual queries with a single batched `IN` or `OR` query, then partition the results in memory.
