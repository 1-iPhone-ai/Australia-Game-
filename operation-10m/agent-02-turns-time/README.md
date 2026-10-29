# Agent 02 — Turns, Time, and Delayed Consequences

Deterministic turn sequencing, scheduled obligations, multi-turn construction, fast-forward safety, and diagnostics for Operation 10M integration.

## Commands

```bash
cd operation-10m/agent-02-turns-time
npm install
npm run typecheck
npm test
```

## Layout

| Path | Role |
|------|------|
| `src/turn-sequence.ts` | Monotonic turn/day clock and phased advance |
| `src/scheduled-obligations.ts` | Due-turn obligations with once-only firing |
| `src/multi-turn-construction.ts` | Labor-span projects tied to the clock |
| `src/fast-forward.ts` | Jump across turns without skipping or duplicating effects |
| `src/diagnostics.ts` | Trace ledger and integrity validation |
| `src/engine.ts` | Composed `TurnTimeEngine` API |
| `tests/` | Proves no duplicate or skipped scheduled effects |

Integration notes: `INTEGRATION.md`.
