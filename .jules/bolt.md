## 2024-03-29 - SQLite N+1 Optimization
**Learning:** The codebase has a history of using Promise.all with db.article.findMany inside loops (e.g., analytics), causing N+1 query bottlenecks.
**Action:** Replaced these with single queries using Prisma's OR/in operators, always including a guard clause for empty arrays to prevent full table scans.
