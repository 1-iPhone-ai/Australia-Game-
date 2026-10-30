# Technical change log — canonical rollup vs `main`

Base: `b3068451` (`main`). Canonical file: `(V9.4) australia-game-with-ai.tsx`.

Commits already on `op111/integration-canonical`, oldest first:

1. Fix turn ownership, day resets, and match-end rules
2. Stop false-success and unauthorized AI actions
3. Fix replay identity and load the V9.4 app
4. Seal every match ending and skip the turn hand-back
5. Apply adaptive AI, genome ranking, and Guardian automation gates
6. Keep economy actions on the cash and action-point books
7. Connect strategic capital and stop national toggle shocks
8. Route public finance and household shifts into world reactions
9. Keep replay hashes, draws, truncation, and seeds honest
10. Honor the modal focus setting and keep the release gate responsive
11. Initialize uiState before the command center memo
12. Stop the first render from reading handleEndTurn early
13. Reject amounts that mint cash or skip the fare
14. Reject the remaining wallet mints and shared match hashes
15. Fix the scenario menu dead zone and the inland expedition action
16. Stop refused actions from writing cash, ledger rows, or turns
17. Run Co-Pilot lifecycle checks as a live match
18. Honor the retreat, national-event, and emergency-treasury switches
19. Let a player click commit when Co-Pilot is off
20. Repay an advanced loan from its schedule and pay a contract once
21. Route a team what-if timeline through the canonical reducer
22. Wrap Tab inside a dialog when focus trapping is on
23. Pay the Work for Wages click when its cost estimate is zero
24. Add V9.4 save compatibility contract tests and vitest harness
25. Add dev helper to extract the V9.4 SECTION index
26. Agent 4: centralize live `actorsById` merge from React slices
27. Document canonical V9.4 integration policy
28. Add SECTION 1A architecture map and architecture gates
29. Agent 61: visual design token registry (20P-A61)
30. Agent 63: canonical intent navigation contract
31. Agent 62: dynamic PLAY moment classifier
32. Agent 6: verify pipeline (split typecheck, baseline, CI)
33. Merge batch B1 — save compatibility, actorsById, architecture index, verify pipeline, section index
34. B1 integration fixes (`@types/node`, config markers)
35. Merge / splice batch B2 UI (`#223`, `#233`, `#234`, `#268`, `#269`, `#226`, `#258`, `#271`)
36. Agent 64: Strategic PLAY dashboard
37. Agent 65: economic geography map layers and corridor utilization
38. Agent 57: wire legacy crisis stage effects
39. Bump game typecheck baseline to 102 after B2 UI
40. Agent 59: execute PRESET national crisis stage effects
41. Reconcile crisis overlap Agents 57 and 59
42. Agent 93 integration scripts and `o111-int` suite; baseline 107
43. V10.14 §20AG wiring, unified core, and full fragment restore; baseline 170
44. Batch B3 — commands, lifecycle, economy, idle (`#182`, `#252`, `#206`, `#202`, `#254`, `#187`, `#199`, `#228`, `#272`, `#267`)
45. Bump typecheck baseline to 187 after Batch B3
46. Batch B4a — Agent 81 state invariants (`#247`)

This rollup, on top of that branch:

- SECTION 20P-A8 transaction helpers and six self-tests, registered as release suite `o111-a8`. `applyLoadedState` documents that live loads go through the save transaction, not this helper.
- `runO111EndToEndGameplaySelfTests` (ten checks, release suite `o111-e2e`) and `scripts/run-e2e-gameplay-self-tests.mjs`.
- `scripts/run-transaction-safety-self-tests.mjs`. npm scripts `test:transactions` and `test:e2e-gameplay`.
- SECTION 21A `runSourceArchitectureSelfTests`, restored after the catalog referenced it without defining it.
- `SOURCE_FILE_SECTION_MARKER_COUNT` and `SOURCE_FILE_SECTION_HEADER_SNAPSHOT` regenerated to the 72 on-disk `// SECTION` markers, including the Operation 111 sections spliced after the original 60-marker snapshot.
- Typecheck baseline lowered 187 → 166. Twenty of those errors were references to `V1014_CORE_REGIONS`, which the §20AG layer used and never declared. Match start threw `ReferenceError` on that name and left a white screen. The constant is now the eight canonical state codes, same list as `V1013_CORE_REGIONS`.
- `computeNationalPublicFinance` treats a crisis with no `regionIds` as a Queensland commitment instead of reading `.length` on undefined.
- `runV1014UnifiedSelfTests` flattens each submodule's `{ results }` object and isolates a suite that throws. It previously spread those objects and crashed the release gate.

Agent 82 and Agent 97 were reimplemented against the current reducer and save APIs. Cherry-picking their patches onto this branch conflicted or called `undoSmartSettingsTransaction` and region-deposit fields that no longer match the canonical signatures (`proposedValue`, actor-id deposit keys, campaign timestamps minted during hydration).
