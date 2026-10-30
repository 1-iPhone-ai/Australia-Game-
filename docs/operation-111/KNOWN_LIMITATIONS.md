# Known limitations

The pull request is not merged. Nothing here changes `main` until it is approved.

## Not integrated

- **Agent 90 diagnostics (`#278`)** stays out. The pull request's diff is a near-full rewrite of the canonical file against an older base. The previous integration pass deferred it because the cherry-pick broke the build. It is not reapplied here.
- **Operation 10M expansion shards** on `australia-game-upgrade` (Git LFS canonical blob and the `expansion/o6k-10m` trees) are not copied into this file. Those tranches were explicitly not promoted.
- **Open agent pull requests that only add contract tests on other branches** are not spliced again when their behavior is already covered by the integration, transaction, or end-to-end suites. GitHub will still show those pull requests as open.
- **`(Cursor) (V9.4) australia-game-with-ai.tsx`** is the pre-audit snapshot (blob identical to `(V9.4)` at `728b8c53`). It is not the running game. Older version files (`V4.9` through `V8.2`) are unchanged.

## Behavior that is real and bounded

- Two hydrations of the same save JSON match on gameplay fields, and they differ in `campaignState.startedAt` and `campaignState.lastSavedAt`. Those stamps are written during load. The transaction test treats that pair as the allowed drift.
- `SOURCE_FILE_SECTION_INDEX` still catalogs the original 61 sections (including reserved section 18). Newer Operation 111 headers are in `SOURCE_FILE_SECTION_HEADER_SNAPSHOT` and are checked against the file. They do not each have an index row.
- `tsc` on the game file still reports **166** errors. The baseline allows 166. Defining `V1014_CORE_REGIONS` removed the 20 errors that were bare references to that name. The rest of the type debt is unchanged.
- `runV1014UnifiedSelfTests` reports 105/110. The five failures are pre-existing expectation misses (corporate climate band, evidence and history caps, the analytics suite throwing inside a fixture, and a public-services climate score). The runner now records a thrown suite as a failed row instead of aborting the release gate.
- The production bundle is one chunk of about 8.1 MB (about 2.2 MB gzip). Vite warns that it is over 500 kB. The game remains one self-contained module, with no code-splitting.
- Browser evidence covers the menu, starting AI Opponent on Easy, and one End Turn through Day 2. Save and load were exercised by the headless suites, not by clicking Save / Load in the browser.
