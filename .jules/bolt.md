
## 2024-03-20 - Pre-compiling RegExp for Performance
**Learning:** Recreating `RegExp` objects inside tight loops or frequently called functions (like `calculateFramingScore` and `calculateEmotionalScore`) causes significant performance degradation due to compilation overhead, especially when analyzing large texts or multiple articles.
**Action:** Always pre-compile static `RegExp` objects outside of functions at the module or class level to avoid recreating them on every call.
