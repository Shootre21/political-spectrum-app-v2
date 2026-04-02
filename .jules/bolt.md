
## 2025-02-21 - N+1 Array Filter Mapping
**Learning:** You can replace N+1 `.findMany` queries containing Prisma `contains` operators loops mapped over arrays by passing an `OR` array, but must ensure string matches reflect case-insensitivity using `toLowerCase` in the resulting `.filter` post-processing.
**Action:** Be mindful to convert dynamic matching array elements to lower-case outside of hot loops in memory when filtering result sets from single Prisma aggregate queries that replace N+1 loops.
