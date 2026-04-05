
## 2024-05-24 - Prisma Data Aggregation over In-Memory Operations
**Learning:** Functions that aggregate large sets of database records using `findMany` followed by JS array methods (like `.map()`, `.reduce()`, or `.filter()`) create an O(N) memory bottleneck and can lead to OOM errors as tables grow. This was encountered in `src/lib/analytics.ts` (`getAnalyticsOverview`).
**Action:** Use Prisma's native `aggregate`, `groupBy`, and `count` features whenever calculating analytics, counts, or sums. It offloads processing to the database, ensuring memory usage stays O(1) in the Node app.
