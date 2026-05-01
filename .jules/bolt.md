
## 2024-05-01 - N+1 Query in compareSources
**Learning:** `compareSources` uses `Promise.all` mapping over array of sources and queries the database for each source inside the loop causing an N+1 problem. Also, SQLite does not support `mode: 'insensitive'` for string contains in Prisma so we need to rely on in-memory filtering.
**Action:** Replace N+1 queries with a single batched query using Prisma's `OR` operator or by fetching all required fields and grouping in memory.
