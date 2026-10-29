# Agent 02 — Turns, Time, and Delayed Consequences

Deterministic turn sequencing, scheduled obligations, multi-turn construction, fast-forward safety, and diagnostics for Operation 10M integration.

## Commands

```bash
cd operation-10m/agent-02-turns-time
npm install
npm run typecheck
npm test
npm run bundle:chunk
```

## Layout

| Path | Role |
|------|------|
| `src/turn-sequence.ts` | Monotonic turn/day clock and phased advance |
| `src/scheduled-obligations.ts` | Due-turn obligations with once-only firing |
| `src/multi-turn-construction.ts` | Labor-span projects tied to the clock |
| `src/fast-forward.ts` | Jump across turns without skipping or duplicating effects |
| `src/diagnostics.ts` | Trace ledger and integrity validation |
| `src/event-scheduling-queue.ts` | Phase-aware scheduled event queue |
| `src/pause-resume.ts` | Pause/resume state and blocked-advance diagnostics |
| `src/pipeline-stages.ts` | OP10M stage registry (XS-01) |
| `src/external-day-plan.ts` | Agent 05 narrative plan merge (XS-02) |
| `src/external-day-plan-window.ts` | Multi-turn XS-02 day plan window merge |
| `src/turn-pipeline-report.ts` | Pipeline digest + report for Agent 25 |
| `src/pipeline-stage-coverage.ts` | Registered vs observed pipeline stage hits |
| `src/batch-advance.ts` | Multi-step advance with budget cap |
| `src/batch-pipeline-report.ts` | Batch advance + pipeline digest rollup |
| `src/engine.ts` | Composed `TurnTimeEngine` API |
| `tests/` | Proves no duplicate or skipped scheduled effects |

Integration notes: `INTEGRATION.md`.
