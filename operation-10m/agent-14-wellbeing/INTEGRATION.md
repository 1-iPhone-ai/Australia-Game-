# Agent 14 — Integration contract (Agent 25)

## Anchor

Inline before `// SECTION 21B:` in `(V9.4) australia-game-with-ai.tsx`, after existing `SECTION 20AP` public services KPI core (or merge exports into that section).

Suggested marker:

```tsx
// O10M_AGENT14_CAPACITY_DELAY_ANCHOR
```

## Boundaries

- **Owns:** public service *capacity* gating (program slots, fiscal absorption per turn, workforce utilization) and *delayed spending* memory (lag + ramp before KPI indices move).
- **Does not own:** player cash, V10.12 commitment ledger mutations, V10.13 household wallets, commodity prices (invariants PS-A/B/C).

## Wire-in steps

1. Import or paste exports from `operation-10m/agent-14-wellbeing/` (or inlined copy).
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
- `AGENT14_WELLBEING_SCHEMA_VERSION`

## Upstream inputs (read-only)

| Source | Field |
|--------|--------|
| V10.12 | `fiscalHeadroom` |
| V10.11 | `stateCapacityLoad` |
| V10.10 | `workforceReadiness`, `workforceSpecialistGap` |
| V10.14 programs | `SpendingCommitment` rows from `V1014_PROGRAM_CATALOG` |

## Verification

```bash
npm run test:agent-14-wellbeing
```

All tests must pass before Agent 25 assembly.
