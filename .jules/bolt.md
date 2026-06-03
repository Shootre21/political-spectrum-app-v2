## 2024-05-18 - Avoid large memory allocations in Prisma Analytical Operations
**Learning:** In Prisma (with SQLite), using `findMany` to pull an entire database into application memory for subsequent counting, mapping, or reducing operations causes O(N) memory scaling and is highly inefficient.
**Action:** Replace `findMany` queries used strictly for counting, averaging, and grouping with Prisma's native `count`, `aggregate`, and `groupBy` database primitives. Group independent database queries in `Promise.all` for highly-parallel concurrent execution.
