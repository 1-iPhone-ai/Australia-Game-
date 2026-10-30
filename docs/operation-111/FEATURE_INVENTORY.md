# Feature inventory — canonical `(V9.4) australia-game-with-ai.tsx`

This is the set of agent work now present on the canonical game file, measured from `main` (`b3068451`) through this rollup. The canonical file is the only gameplay source the app mounts (`@standalone/game`). `(Cursor) (V9.4) australia-game-with-ai.tsx` stays the pre-audit snapshot and is not mounted.

## Match rules and reliability (already on the integration branch)

- Playable final day, sealed match endings, and turn hand-off that does not skip the human.
- Refused actions no longer write cash, ledger rows, or turns. Wallet mints and a zero-fare skip are rejected.
- Replay identity, hashes, draws, truncation, and seeds stay on the recorded stream.
- Co-Pilot lifecycle checks run as a live match. Commit stays available when Co-Pilot is off. Work-for-wages pays when its cost estimate is zero.
- Advanced-loan repayment follows the schedule. A contract pays once.
- Adaptive AI, genome ranking, and Guardian automation gates stay on the existing settings.
- Strategic capital and public-finance / household shifts feed world reactions without national toggle shocks.
- Scenario menu dead zone and the inland expedition action are wired. Modal focus trapping wraps Tab inside the dialog.
- Team what-if timelines go through the canonical reducer.

## Operation 111 batches spliced into the canonical file

| Batch | What landed |
| --- | --- |
| B1 | Section index tool, architecture map (SECTION 1A), live `actorsById` merge from React slices, save-compatibility vitest harness, verify pipeline (split typecheck, baseline, CI). |
| B2 UI | Visual design tokens (20P-A61), dynamic PLAY moment classifier (20P-A62), responsive viewport bands (20P-A69), chart primitives (20P-A66), contextual PLAY snippets (20P-A67), accessibility profile (20P-A68), interaction feedback for blocked taps (20P-A70). |
| Play surfaces | Strategic PLAY dashboard (20G-A64). Economic geography map layers and corridor utilization. |
| Crises | Legacy crisis stage effects on `activeEvents` (Agent 57) reconciled with PRESET national crisis executors (Agent 59, 20F-A59). |
| Integration harness | Agent 93 cross-system suite (`runO111IntegrationSelfTests`, 12 checks) covering save/load, settings, migration, turn order, partial load, travel, work, and Guardian notify-only. |
| V10.14 §20AG | Unified national layer wired from Agents 21, 25, 29, 30, 36, 40, 55, and 109: macroeconomy, inflation, corporate sector, analytics, population, public services, national policy, national wellbeing. `V1014_CORE_REGIONS` is declared so match start can compute that layer. |
| B3 | Command, lifecycle, economy, and idle gameplay checks from the cherry-picked agent set `#182`, `#252`, `#206`, `#202`, `#254`, `#187`, `#199`, `#228`, `#272`, `#267`. |
| B4a | Agent 81 state invariants, including the F15 nesting regression (canonical actions do not deepen `gameState.gameState`). |
| B4b (this rollup) | Agent 82 transaction safety (SECTION 20P-A8): failed gameplay actions leave the caller tree intact, non-positive transfers fail closed, save preview is pure, Smart Settings undo restores match length. Agent 97 end-to-end gameplay smoke: menu start, reset, save/load, settings persistence, end turn, settings undo, region deposit, travel, market buy, and ten consecutive turns. |

## Release-suite entries added on the canonical file

`o111-a8` (transaction safety), `o111-e2e` (gameplay smoke), plus the earlier `src_arch`, `progression`, `idle76`, and `o111_i81` entries in `V95_EXISTING_SUITES`.

## Dev harnesses (not gameplay, required to prove the file)

- `npm run test:integration`, `test:integration:gate-b2`, `test:integration:gate-final`
- `npm run test:state-invariants`
- `npm run test:transactions`
- `npm run test:e2e-gameplay`
- `npm run test` (save-compatibility and dev-infra vitest)
- `npm run test:architecture`
- `npm run typecheck:game` against `scripts/game-typecheck-baseline.json`
- `npm run build` (Vite production bundle of the canonical module)
