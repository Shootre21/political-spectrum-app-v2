## 2026-03-24 - N+1 Query in compareSources
**Learning:** Found an N+1 query bottleneck in `src/lib/analytics.ts` where `compareSources` ran `db.article.findMany` inside a `Promise.all(sources.map(...))` loop. This codebase pattern frequently occurs where multiple similar aggregation/filtering operations are grouped.
**Action:** Replace `Promise.all(findMany)` with a single `findMany` query using Prisma's `OR` operator, then group the results in-memory. This significantly reduces database roundtrips and CPU overhead.
