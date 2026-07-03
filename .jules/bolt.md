## 2024-05-24 - Pre-computation Casing Regression
**Learning:** When replacing runtime `.toLowerCase()` checks on arrays containing mixed-case constants, directly iterating and pushing the optimized lowercased elements can silently change the output casing of the API.
**Action:** When extracting substrings based on pre-computed lowercased arrays, always use indexed standard `for` loops to match against the lowercased dictionary but return/push values from the original non-lowercased source arrays to preserve expected application formatting.
