# Assembly notes (Agent 25)

Inline order at `O6K_AGENT24_INTEGRATION_ANCHOR`:

1. `src/history-replay-analytics.ts` (core — no JSX)
2. `src/historical-analytics-dashboard.tsx` (React dashboard)
3. New helpers: `causal-records.ts`, `timeline-registry.ts`, `late-game-replay.ts`, `replay-determinism.ts` (or re-export block)

Pre-inline validation: `npm test` and `npm run build:chunk` in parent module directory.

Published assembly artifact: `operation-10m/modules/agent-24-history/chunk.tsx` (`OP10M_MODULE_BEGIN agent-24-history`).
