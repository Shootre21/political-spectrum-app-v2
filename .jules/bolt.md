
## $(date +%Y-%m-%d) - Analytics Source Comparison Optimization
**Learning:** `Promise.all` around `db.article.findMany` is a common anti-pattern that creates N+1 query bottlenecks in analytics aggregations.
**Action:** When gathering data for multiple distinct string inputs, utilize a batched Prisma query with an `OR` operator combined with an early-return guard for empty arrays. Map the database `contains: { mode: 'insensitive' }` logic in memory using `.toLowerCase().includes()` against the consolidated results list.
