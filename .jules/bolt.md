## 2023-11-20 - [Fix N+1 Query in News Fetcher]
**Learning:** Using Prisma's `findFirst` and `create` inside a loop creates significant overhead for batched insertion, resulting in an N+1 query problem. Also, replacing it with `createMany` requires explicit UUID generation and filtering out intra-batch duplicates beforehand to avoid unique constraint violations on SQLite.
**Action:** Always batch existence checks using a single `findMany` query with the `in` operator and use `createMany` for insertions, ensuring to maintain a local `Set` of seen keys to prevent intra-batch duplicates.
