## 2025-03-01 - Prisma O(N) memory fetching bottleneck
**Learning:** Using Prisma's `findMany` without pagination to extract large datasets into Node.js server memory merely to calculate mathematical aggregations causes O(N) memory allocation and processing overhead, making it prone to crash on large DBs.
**Action:** Always replace application-side math on unpaginated DB records with O(1) DB aggregation functions like `count`, `aggregate`, and `groupBy`.

## 2025-03-01 - Standalone script failures with missing Prisma Client
**Learning:** Ad-hoc standalone execution scripts (e.g. `bun run test.ts`) that import Prisma client directly may fail with module resolution errors (`Cannot find module '@prisma/client'`) due to the incomplete dependency cache in the network-restricted environment.
**Action:** Rely on `node -c` for syntax checking, or structure tests to run within the existing Next.js framework/environment if integration testing is necessary.
