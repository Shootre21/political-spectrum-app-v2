## 2024-05-24 - [Pre-compile RegExp for Static Lexicons]
**Learning:** The text analysis engine relies heavily on regex matching against static arrays of lexicon terms. Instantiating `RegExp` objects inside hot loops caused significant processing overhead.
**Action:** Pre-compile `RegExp` arrays at the module level (e.g., `PRECOMPILED_TOPIC_REGEXES`) so they are compiled once at load time, improving performance.

## 2024-05-24 - [Stateful Global RegExp]
**Learning:** A critical issue was discovered regarding `RegExp.prototype.test()`. When a pre-compiled regular expression object contains the global (`g`) flag, it maintains its `lastIndex` state across independent `test()` calls. If reused across entirely different text segments or requests, subsequent matches start from this non-zero index, causing intermittent false negatives.
**Action:** When evaluating regex using `test()`, explicitly drop the `g` flag (using `i` instead of `gi`) to ensure the regex acts statelessly.
