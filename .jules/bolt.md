## 2025-05-18 - Optimize analytical database queries to O(1) memory
**Learning:** Using Prisma's `findMany` to pull all database records into memory for analytical operations (counting, grouping, averaging) creates an O(N) memory bottleneck, which can severely impact application stability as the database grows.
**Action:** Always utilize native database aggregations (`aggregate`, `groupBy`, and parallel `count` queries via `Promise.all`) to achieve O(1) memory consumption and reduce data transfer overhead from the database to the Node process.
