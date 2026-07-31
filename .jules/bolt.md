## 2024-06-03 - Optimized Regex Compilation in Hot Loops
**Learning:** Instantiating `new RegExp(..., 'gi')` inside text processing loops (`calculateFramingScore`, `calculateEmotionalScore`) causes massive performance overhead due to repeated regex compilation.
**Action:** When counting occurrences of known, static text terms without regex special characters, use a custom `indexOf` loop helper function. This entirely eliminates regex compilation overhead and resolves subtle bugs involving regex special characters within dictionary terms.
