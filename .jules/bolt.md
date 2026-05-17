## 2024-05-17 - Temporary Files and PR Pollution
**Learning:** During development, I created temporary ad-hoc test scripts (`test-batch.ts`, etc.) to run quick tests. However, leaving them in the repository caused the PR review to flag them as unused artifacts polluting the codebase, even though the primary code change was highly effective.
**Action:** Always clean up any temporary scripts, scratchpads, or diagnostic files created during execution before finalizing the PR submission.
