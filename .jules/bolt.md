## 2024-05-15 - [Analytics Endpoint Memory Optimization]
**Learning:** Using `findMany` to pull all database records into memory for simple analytical operations like counting arrays, grouping elements, and averaging scores results in an O(N) memory bottleneck, which slows down significantly over time.
**Action:** Always utilize Prisma's native database aggregation operations like `aggregate`, `groupBy`, and parallel `count` queries to achieve O(1) memory consumption and drastically reduce data transfer overhead.
