
## 2025-04-01 - [Refactoring loop queries to batch queries]
**Learning:** In Prisma setups, it's a common anti-pattern to map over an array and execute `db.table.findMany()` for each element using `Promise.all()`. This leads to an N+1 query problem, especially in hot paths like `src/lib/analytics.ts` where multiple sources are compared.
**Action:** Always refactor multiple `findMany` queries mapped inside a `Promise.all` into a single batch query utilizing Prisma's `OR` or `in` operator combined with an in-memory aggregation. Ensure to include a guard clause to prevent full table scans when the array is empty.
