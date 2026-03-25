## 2025-02-24 - Initial setup
## 2025-02-24 - Optimize N+1 queries in Prisma
**Learning:** `Promise.all` calling multiple `.findMany` functions to fetch information in a loop creates an N+1 query bottleneck.
**Action:** Replaced `Promise.all` logic inside loops fetching database models with single Prisma database queries by making use of `OR` array conditionals in `where` clauses, and filtering rows in memory.