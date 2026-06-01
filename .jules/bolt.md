## 2024-06-01 - Prisma O(N) memory bottleneck in analytics
**Learning:** Using Prisma's `findMany` to pull all database records into memory for analytical operations (counting, grouping, averaging) creates an O(N) memory bottleneck and transfers excess data from the DB to the Node process.
**Action:** Always utilize native database aggregations (`aggregate`, `groupBy`, and parallel `count` queries) to achieve O(1) memory consumption and reduce data transfer overhead, specifically in endpoints like `getAnalyticsOverview`.
