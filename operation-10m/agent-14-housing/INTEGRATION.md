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

Integration branch: **`op10m/agent-14-housing`** (canonical worker branch for this module). Scale wave round 4 workers may push **`op10m/agent-14-housing-wellbeing`** for PR #331 head sync.

## Scale wave 6 (resilience & intervention queue)

| Module | Purpose |
|--------|---------|
| `accountability-trajectory.ts` | Cross-turn EMA of accountability scorecard with trajectory band |
| `intervention-priority-queue.ts` | Merged equity + sequencing priority queue with expedite flag |
| `wellbeing-resilience-index.ts` | Composite stress/resilience snapshot for GI surfacing |

Turn advance attaches `accountabilityTrajectory`, `interventionPriorityQueue`, `wellbeingResilience`, and returns `accountabilityTrajectoryPersisted`.

Community lifecycle stubs (`ps_xp_TAS_community_wellbeing`, `ps_xp_WA_remote_lifecycle`); scenarios `accountability_slip_arc`, `intervention_priority_stress`.

## Scale wave 5 (accountability & equity)

| Module | Purpose |
|--------|---------|
| `coupling-trajectory.ts` | Cross-turn EMA of national coupling index with trajectory band |
| `wellbeing-accountability-scorecard.ts` | Multi-dimension GI scorecard (delivery, equity, warnings, coupling, portfolio) |
| `equity-rebalancing-advisor.ts` | Regional deficit ranking with suggested program stubs |

Turn advance attaches `couplingTrajectory`, `accountabilityScorecard`, `equityRebalancing`, and returns `couplingTrajectoryPersisted`.

Cross-pillar wellness stubs (`ps_xp_*`); scenarios `coupling_stress_escalation`, `equity_rebalance_push`.

## Scale wave 4 (persisted memory)

| Module | Purpose |
|--------|---------|
| `cross-pillar-coupling.ts` | Housing backlog / equity spillover into healthcare & education coupling indices |
| `regional-wellbeing-memory.ts` | Cross-turn EMA of regional affordability & access (`RegionalWellbeingMemoryPersisted`) |
| `wellbeing-executive-brief.ts` | Single-turn GI headline synthesizing warnings, coupling, sequencing |

Turn advance attaches `crossPillarCoupling`, `regionalWellbeingMemory`, `executiveBrief`, and returns `wellbeingMemoryPersisted` for Agent 25 wire-up.

Health/education program stubs live in `AGENT14_HEALTH_ED_PROGRAM_STUBS`; scenarios `health_education_surge`, `persisted_recovery_arc`.

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
2. Extend `PublicServicesPersisted` (or parallel persisted blob on game state) with `delayedSpending: DelayedSpendingPersisted`, optional `regionalWellbeingMemory: RegionalWellbeingMemoryPersisted`, optional `couplingTrajectory: CouplingTrajectoryPersisted`, and optional `accountabilityTrajectory: AccountabilityTrajectoryPersisted`.
3. At national turn boundary **before** `computeNationalPublicServices`:
   - Call `advancePublicServicesTurn({ inputs, spendingPersisted, wellbeingMemoryPersisted, couplingTrajectoryPersisted, accountabilityTrajectoryPersisted, newCommitments })`.
   - Spread `result.inputs` fields into `V1014PublicServicesInputs` (`fiscalLoadFromActivePrograms`, `completed*Projects`, `activeProgramCount`, optional `stateCapacityLoad` from V10.11).
4. Register `runAgent14WellbeingSelfTests` in dev lab quick tier (`id: v1014_agent14_capacity_delay`).

## Exported API (stable)

- `advancePublicServicesTurn`
- `computePublicServiceCapacity`
- `advanceDelayedSpendingEffects` / `commitSpendingProgram` / `makeSpendingCommitment`
- `runAgent14WellbeingSelfTests`
- `runAgent14HousingScenarioSweep` / `simulateAgent14HousingScenario`
- `AGENT14_WELLBEING_SCHEMA_VERSION` (`10.14.6-scale-wave-6`)

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
