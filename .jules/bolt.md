## 2024-06-18 - Replacing Prisma Promise.all map loops with batched queries
**Learning:** Using Prisma's OR or IN conditions inside `findMany` is substantially faster and uses far less memory than mapping over `db.model.findMany` inside a `Promise.all()` block. Guard clauses must be added for empty arrays when utilizing these operators.
**Action:** Before writing `Promise.all()` loops with database queries, check if the query structure can be converted to an IN or OR statement mapped over an array.
