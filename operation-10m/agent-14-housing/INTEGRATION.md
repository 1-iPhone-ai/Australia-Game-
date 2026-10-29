# Agent 14 — Integration contract (Agent 25)

## Assembly chunk (Operation 10M)

| Artifact | Path |
|----------|------|
| Source module | `operation-10m/agent-14-housing/` |
| **Assembly chunk** | `operation-10m/modules/agent-14-housing/chunk.tsx` |
| Markers | `OP10M_MODULE_BEGIN agent-14-housing` … `OP10M_MODULE_END agent-14-housing` |
| Regenerate | `npm run build:agent14-housing-chunk` |

Agent 25 inlines the chunk (or runs the assembly pipeline) — **do not** hand-edit generated `chunk.tsx`.

## Git branch

Integration branch: **`op10m/agent-14-housing`** (canonical worker branch for this module).

## Anchor (canonical TSX)

Inline before `// SECTION 21B:` in `(V9.4) australia-game-with-ai.tsx`, after existing `SECTION 20AP` public services KPI core (or merge exports into that section).

Suggested marker:

```tsx
// O10M_AGENT14_CAPACITY_DELAY_ANCHOR
```

## Boundaries

- **Owns:** public service *capacity* gating (program slots, fiscal absorption per turn, workforce utilization) and *delayed spending* memory (lag + ramp before KPI indices move).
- **Does not own:** player cash, V10.12 commitment ledger mutations, V10.13 household wallets, commodity prices (invariants PS-A/B/C).

## Wire-in steps

1. Inline `operation-10m/modules/agent-14-housing/chunk.tsx` at the anchor (or merge exports from source tree).
2. Extend `PublicServicesPersisted` (or parallel persisted blob on game state) with `delayedSpending: DelayedSpendingPersisted`.
3. At national turn boundary **before** `computeNationalPublicServices`:
   - Call `advancePublicServicesTurn({ inputs, spendingPersisted, newCommitments })`.
   - Spread `result.inputs` fields into `V1014PublicServicesInputs` (`fiscalLoadFromActivePrograms`, `completed*Projects`, `activeProgramCount`, optional `stateCapacityLoad` from V10.11).
4. Register `runAgent14WellbeingSelfTests` in dev lab quick tier (`id: v1014_agent14_capacity_delay`).

## Exported API (stable)

- `advancePublicServicesTurn`
- `computePublicServiceCapacity`
- `advanceDelayedSpendingEffects` / `commitSpendingProgram` / `makeSpendingCommitment`
- `runAgent14WellbeingSelfTests`
- `runAgent14HousingScenarioSweep` / `simulateAgent14HousingScenario`
- `AGENT14_WELLBEING_SCHEMA_VERSION` (`10.14.2-housing-depth`)

## Upstream inputs (read-only)

| Source | Field |
|--------|--------|
| V10.12 | `fiscalHeadroom` |
| V10.11 | `stateCapacityLoad` |
| V10.10 | `workforceReadiness`, `workforceSpecialistGap` |
| V10.14 programs | `SpendingCommitment` rows from `V1014_PROGRAM_CATALOG` |

## Verification

```bash
npm run test:agent-14-housing
npm run build:agent14-housing-chunk
```

All tests must pass before Agent 25 assembly.
