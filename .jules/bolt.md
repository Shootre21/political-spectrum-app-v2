## 2025-04-27 - [Prisma _count Behavior]
**Learning:** Using `_count: true` inside `Prisma.aggregate` fails in newer Prisma versions where it expects an object like `_count: { _all: true }`.
**Action:** Always use `_count: { _all: true }` or count specific fields when doing Prisma aggregations to prevent compilation/runtime errors.
