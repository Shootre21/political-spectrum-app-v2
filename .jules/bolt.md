## 2025-03-01 - Fast database batch insertions
**Learning:** Replacing an N+1 `findFirst` query loop with a single deduplicated batch using `findMany` and `createMany` achieves a ~60x performance improvement in the restricted SQLite environment. It is crucial to manually handle duplicate exclusion within the batch (`Set`) before `createMany` because Prisma SQLite does not support `skipDuplicates`.
**Action:** When inserting large datasets (e.g., in fetchers), always deduplicate inputs, pre-fetch existing keys with the `in` operator, filter out overlaps, and insert using `createMany` wrapped in a robust try/catch with a sequential fallback to handle unexpected intra-batch constraint violations.

## 2025-03-01 - Avoid premature regex caching
**Learning:** Extracting inline `new RegExp(term, 'gi')` instantiations to a precompiled dictionary at the module level in hot loops yielded negligible real-world performance gains, as V8 already aggressively caches regular expression compilation under the hood.
**Action:** Do not sacrifice code readability to pre-compile dynamic regex strings unless an active bottleneck is scientifically proven to be related to garbage collection of regex objects.
