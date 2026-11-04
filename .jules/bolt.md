## 2024-11-04 - SQLite N+1 Insertions Check
**Learning:** In the `storeArticlesInDatabase` function, replacing a sequential `findFirst` check and `create` call with batched `findMany` and `createMany` operations prevents N+1 query patterns for large RSS updates, heavily improving DB ingestion times in SQLite.
**Action:** Replace sequential inserts in `news-fetcher.ts` with batched unique checks and inserts, keeping in mind that SQLite does not support `skipDuplicates` in `createMany`, so manual deduplication via Map before inserting is required.
