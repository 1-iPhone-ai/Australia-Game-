# Verification — canonical rollup

Commands were run on this branch against `(V9.4) australia-game-with-ai.tsx`. Times are America/Chicago on 30 Oct 2026.

| Check | Result |
| --- | --- |
| `npx tsx scripts/run-transaction-safety-self-tests.mjs` | 6/6 passed |
| `npx tsx scripts/run-e2e-gameplay-self-tests.mjs` | 10/10 passed |
| `npx tsx scripts/run-o111-integration-tests.mjs` | 12/12 passed |
| `npx tsx scripts/run-agent-81-invariant-tests.ts` | 5/5 passed |
| `npx vitest run` | 2 files, 13 tests passed (save-compatibility 10, dev-infra 3) |
| `node tests/source-architecture.mjs` | passed (72 section markers, snapshot matches) |
| `runSourceArchitectureSelfTests()` | 5/5 passed |
| `npm run typecheck:game` | 166 errors, at the updated baseline. `evidence/typecheck-game.log` is the earlier run at 186, before `V1014_CORE_REGIONS` was declared. `evidence/typecheck-game-final.log` is the 166 result. |
| `npm run build` | passed. Production chunk about 8,062 kB (gzip about 2,178 kB) |
| `runV1014UnifiedSelfTests()` | 105 passed, 5 failed, 110 total. Failures are recorded below and do not throw out of the runner |

## Browser gameplay

Production preview at `http://127.0.0.1:4173/` (Vite preview of `dist/`).

- The menu renders: Aussie Adventure, character select, Single Player, AI Opponent, Grand Tour, Team, Scenario, Save / Load.
- The first production bundle crashed on AI Opponent → Easy with `ReferenceError: V1014_CORE_REGIONS is not defined` (minified name read from the console) and a white screen.
- After defining `V1014_CORE_REGIONS` and rebuilding, AI Opponent → Easy opens Day 1 on the player's turn with $1,000, Queensland, End Turn, Challenges, Contracts, and the strategic dashboard.
- One End Turn advances the match: the AI takes its turn and the HUD returns to the player on Day 2, with a Day 2 event and a Tasmania strategic decision.

## What the gameplay and save/load checks actually did

End-to-end smoke (`e2e_r4` through `e2e_r20`):

- `SET_GAME_MODE` moves a menu state into an active match without resetting the day.
- `RESET_GAME` restores the fresh turn counter and actor.
- `prepareSaveLoadTransaction` plus `applyLoadedState` keeps day 7, player cash 4321, and an intact integrity report.
- A custom `totalDays` survives that same save → load path.
- `end_turn` increments both the root turn counter and `gameState.turnCounter`.
- Smart Settings apply + undo restores `totalDays`.
- `region_deposit` of 500 deducts cash and adds 500 to the existing NSW player stake.
- `travel` to WA updates the canonical actor region.
- `buy_market` of 2 wool at 40 spends 80 and puts both units in inventory.
- Ten consecutive `end_turn` steps finish at turn counter 11.

Integration save/load (`o111_int_r5`, `o111_int_r6`, `o111_int_r7`, `o111_int_build_save_roundtrip`) and vitest `tests/save-compatibility` cover `LOAD_STATE`, match-scoped settings, legacy `gameVersion` migration, and `buildSaveData`.

Transaction safety confirms a refused deposit does not mutate the caller, a negative `transfer_cash` moves no money, a truncated save returns no candidate, and `verifySaveLoadCandidate({})` fails before hydration.
