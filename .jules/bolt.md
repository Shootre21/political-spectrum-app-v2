## 2025-05-16 - [Prisma CreateMany Missing SkipDuplicates on SQLite]
**Learning:** Prisma's `createMany` method on SQLite does not support `skipDuplicates`. The `in` query existence check coupled with local `Set` deduplication is the optimal path for batch database loading in this environment. Attempting to use ad-hoc execution scripts requiring Prisma client fails due to network-restricted caching of dependencies.
**Action:** Use `findMany` with the `in` operator combined with an in-memory `Set` for deduplicating batched insert lists prior to executing `createMany` on SQLite.
