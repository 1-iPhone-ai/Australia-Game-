# V9.4 Playtest Report — AI competence, progression and feedback

All changes are in `(V9.4) australia-game-with-ai.tsx` (still one self-contained TSX file, no new
dependencies, no save-format changes: no new persisted fields, no renamed keys).

## How it was tested

- **Runtime playtesting (tested):** the real file was bundled and run in headless Chromium. Full matches
  were played through the game's own code paths: the human side was driven by a scripted player calling
  the game's own handlers (`takeChallenge`, `travelToRegion`, `sellResource`, `handleEndTurn`, confirm
  dialogs clicked). Seeds were fixed (`worldRngSeed`, `aiDeterministicSeed` and `Math.random`) and timers
  were sped up. The same scenarios were run on the original (`HEAD~1`) and on the fixed file.
- **Coverage:** AI Opponent at Easy, Medium, Hard and Expert; money, net worth, regions and challenges win
  conditions; Grand Tour; Team Mode AI+AI vs AI+AI; a passive human; human as Tourist and as Scientist
  (which changes the AI's character); an "all features on" set (investments, equipment, sabotage,
  specials, cash-out). In total about 45 solo matches and 16 team matches per build.
- **Regression checks (tested):** all 67 built-in self-test suites, 1,683 tests. Both builds give the same
  result: 30 failures that were already there, and one difference that is only a timing figure in a perf
  test. `tsc --noEmit` reports the same 60 errors that were already there and no new ones.

## Problems found → root cause → fix

| # | Symptom seen in play | Root cause | Type | Fix |
|---|---|---|---|---|
| 1 | Solo AI bankrupt by day 5-7 in 4/10 baseline matches (repeated all-in losses, then forced loans) | `enumerateLegalActions` staked `min(cash, $500)` and estimated odds with a formula that ignores weather/season/events/equipment (e.g. physical challenges in a storm looked +EV) | Defect + AI logic | Live games pass the executor's own `calculateAiSuccessChance`; stakes are a fraction of the Kelly bet scaled by risk tolerance; no-edge bets are skipped |
| 2 | Regions win condition: 26 AI deposit attempts, 0 succeeded, whole turns lost | AI deposited $200, below `REGION_MIN_CONTROL_STAKE` ($300), and `chooseAction` ignored the "already failed this turn" filter so it re-proposed the same failure | Defect | Deposit the stake that actually wins control (+$25); no deposits into a region already held safely; travel toward affordable captures; rejected candidates are filtered |
| 3 | AI paid $500/$750 for extra actions while nearly broke | Override bought whenever the AI was behind, with no value or reserve check | AI logic | Buy only if the best available challenge's EV exceeds the cost and a reserve remains |
| 4 | Challenges win condition: AI's tally fell to 0 every 7 days, human's never did | Season change cleared `challengesCompleted` in the projected AI (applied) and human (never dispatched) state | Defect (asymmetric) | Season change only refreshes `completedThisSeason` (solo and team) |
| 5 | Grand Tour: AI never attempted the finale; a cash ratio mercy rule handed the race to the richer side; result text "AI beat You … (1 vs 8)" | AI engine had no finale/stamp awareness; mercy rule ignored mode; message printed player-value first | Defect + UI | Finale candidate, stamp-driven travel (finish the current stamp first), no money mercy rule in Grand Tour, winner's value printed first |
| 6 | Team regions: all 4 AIs bid one region up by $1 until both teams went bankrupt (day 7-8) | Region targeting used a formula from the old $1 stake (contested region outranked every empty one); turn loop read stale `gameState` deposits, causing repeat deposits | Defect + AI logic | Live deposits, price-aware targeting, capture buffer, no top-ups when safe, escalation cap when an empty region is open, cash reserve, no travel to captures it can't fund |
| 7 | Forced emergency loans charged $125/day to match end | No AI path ever repaid simple loans (human has a 0-AP repay) | Missing behaviour | AI repays when it can keep a reserve, same repayment cost as the human |
| 8 | AI never got streak reward tiers | AI payout copy omitted `STREAK_BONUSES` used by `computeChallengeRewardCore` | Defect (asymmetric) | Same tiers applied to the AI |
| 9 | "Low liquidity" warning on turn 1 of every match | Threshold $1,500 is above every character's starting cash | UI | Threshold is the game's working reserve ($600) |
| 10 | Co-Pilot said "challenge succeeded and earned $0" when it failed | Negative cash delta was clamped to 0 | UI | Failed challenges reported as failures with the amount lost |

## Before / after (same seeds, same scripted human)

Solo, human = Tourist (AI = Scientist):

| Scenario | Before | After |
|---|---|---|
| Expert seed 2, money | AI bankrupt, mercy loss day 7 | Plays to day 13 (mercy loss) |
| Hard seed 3, money | AI $0, mercy loss day 6 | Full 30 days |
| Expert seed 4, net worth | AI net worth −$2,625, day 14 | Mercy loss day 9 (variance remains, see below) |
| Hard seed 5, regions | 0 regions each, decided on money | Full 30 days, AI deposits succeed |
| Medium seed 6, challenges | AI challenge tally reset to 0 (3 at end) | Tally kept through the match |
| Grand Tour (4 seeds) | Ended by money mercy rule or tie-break | AI wins outright by finale on days 8-18 |

Solo, human = Scientist (AI = Explorer): Expert matches become close (AI wins seeds 1 and 12, narrowly
loses seed 2); Easy < Medium < Expert ordering holds (e.g. seed 1: $12.7k / $28.1k / $52.2k).

Team AI+AI vs AI+AI (8 seeds):

| Metric | Before | After |
|---|---|---|
| Regions matches reaching a region decision (vs bankruptcy) | 0/4 (all bankrupt days 7-8) | 3/4 (mercy on regions days 10-23) |
| Regions contested per match | 1-2 | 5-8 |
| Highest single-region stake | $2,046-$3,499 | $601-$1,507 |
| Identical back-to-back deposits | 24-81 per match | 0 |
| Challenges completed (all actors, 30-day matches) | 18-24 | 286-362 |

## Remaining / untested issues

- **Team regions vs the bankruptcy rule (balance, not changed):** team cash for bankruptcy is net of loans
  and excludes region deposits, so heavy region spending can still trip the 3-day rule (1 of 4 regions
  seeds ended on day 6). Whether deposits should count as assets is a design decision.
- **Score gap with the scripted human (balance, partly intended):** a Tourist human outearns the AI by
  about 1.2-3×. Part of this is intended character asymmetry. The AI's 500 wager cap vs the human's
  dynamic wager when enabled may also contribute. Not changed.
- **Unused solo AI code (not changed):** since V8.2 `makeAiDecision` returns early, so its loan, contract,
  infrastructure, market-buy, expedition and V10.x scoring block never runs. Re-enabling it is a larger,
  separately testable change.
- **Recommendation card (not changed):** the Co-Pilot candidate generator has no challenge candidate, so
  "Recommended action" never suggests the main income action.
- **Easy AI in Grand Tour** can unlock the finale and still run out of cash before winning (seen once).
  Treated as intended Easy weakness.
- **Not playtested:** Human+AI vs AI+AI with a live human, Scenario mode, save/load mid-match after these
  changes (no persisted fields changed), and very long matches over 30 days.
