## 2025-02-28 - Optimizing batched DB loops in TypeScript
**Learning:** Replacing an N+1 query vulnerability with a single optimized Prisma query using the `OR` operator requires accurately replicating the database matching behavior for in-memory post-processing.
**Action:** Always replicate case-insensitive match conditions (e.g. `mode: 'insensitive'`) from the DB locally with matching `.toLowerCase()` transforms on both sides when processing Prisma datasets in-memory.
