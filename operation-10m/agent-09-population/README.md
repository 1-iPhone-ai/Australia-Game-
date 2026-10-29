# Agent 09 — Population, households & labor (V10.14)

**Owner:** Agent 09 (Population / labor)  
**Branch:** `op10m/agent-09-population`  
**Canonical merge:** Agent 25 only — do not edit `(V9.4) australia-game-with-ai.tsx` on this branch.

## Purpose

Modular **V10.14 Labor Market, Demographics, Employment, Wages & Migration** layer:

- Regional **demographic structure** bands (derived indices, never literal population counts)
- **Employment linkage** to V10.1 industry `effectiveOutput`
- **Wage pressure** from workforce strain + output momentum
- **Migration flow** bands from cross-regional employment attractiveness
- **Automation feedback** from V10.10 workforce automation shift into bounded labor adjustments (presentation + index deltas only)
- **Household budget detail** — affordability/resilience/essentials pressure indices (no currency) feeding wages and migration attractiveness
- **Migration shocks** — persisted episodic regional flow shocks with turn decay
- **Scale wave round 3** — integrated labor synthesis, scenario runner, migration corridors, turn audit, steward labor brief

## Layout

- `v10-14-labor-demographics/` — pure TypeScript modules + self-tests (inline-ready for Agent 25 tranche merge)
- `run-self-tests.ts` — standalone runner (`npm run test:agent09`)
- `scripts/build-chunk.mjs` — emits `operation-10m/modules/agent-09-population/chunk.tsx` (`npm run build:agent09-chunk`)

## Authority & boundaries

See `INTEGRATION.md` and `v10-14-labor-demographics/boundaries.ts`. Forbidden persisted keys: `population`, `unemploymentRate`, `workerAgents`, `payrollCost`, `wageBill`, `migrationQuota`.

## Tests

```bash
npm run test:agent09
```
