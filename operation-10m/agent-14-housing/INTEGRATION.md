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

## Scale wave 16 (assembly merge trajectory & inline readiness)

| Module | Purpose |
|--------|---------|
| `assembly-merge-trajectory.ts` | Cross-turn EMA of Agent 25 assembly merge readiness (`AssemblyMergeTrajectoryPersisted`) |
| `chunk-anchor-alignment-monitor.ts` | OP10M anchor alignment vs wire-in band and core trajectory coverage |
| `agent25-inline-readiness-brief.ts` | GI signal when Agent 25 may inline chunk at canonical anchor |

Turn advance attaches `assemblyMergeTrajectory`, `chunkAnchorAlignmentMonitor`, `agent25InlineReadinessBrief`, `inlineMergeTrajectory`, `inlineActivationMonitor`, `agent25Wave17ProjectionHandoffBrief`, and returns `assemblyMergeTrajectoryPersisted` plus `inlineMergeTrajectoryPersisted`.

Assembly stubs (`ps_xp_QLD_chunk_anchor`, `ps_xp_WA_assembly_merge`); scenarios `assembly_merge_trajectory_arc`, `chunk_anchor_alignment_stress`.

## Scale wave 15 (wire-in trajectory & Agent 25 handoff)

| Module | Purpose |
|--------|---------|
| `wire-in-trajectory.ts` | Cross-turn EMA of national wire-in activation (`WireInTrajectoryPersisted`) |
| `turn-boundary-activation-monitor.ts` | Turn-boundary activation vs schedule, wire-in, and capacity |
| `agent25-assembly-handoff-brief.ts` | GI signal when Agent 25 may merge chunk at anchor |

Turn advance attaches `wireInTrajectory`, `turnBoundaryActivationMonitor`, `agent25AssemblyHandoffBrief`, and returns `wireInTrajectoryPersisted`.

Boundary stubs (`ps_xp_NSW_turn_boundary`, `ps_xp_SA_agent25_handoff`); scenarios `wire_in_trajectory_arc`, `turn_boundary_activation_stress`.

## Scale wave 14 (integration trajectory & schedule readiness)

| Module | Purpose |
|--------|---------|
| `integration-trajectory.ts` | Cross-turn EMA of national integration publish readiness (`IntegrationTrajectoryPersisted`) |
| `schedule-readiness-monitor.ts` | Due/deferred gated commits vs current turn |
| `national-wire-in-readiness-brief.ts` | GI signal when Agent 25 may wire enriched inputs at turn boundary |

Turn advance attaches `integrationTrajectory`, `scheduleReadinessMonitor`, `nationalWireInReadinessBrief`, and returns `integrationTrajectoryPersisted`.

Wire-in stubs (`ps_xp_VIC_national_wire_in`, `ps_xp_NT_schedule_readiness`); scenarios `integration_trajectory_arc`, `schedule_readiness_stress`.

## Scale wave 13 (handoff trajectory & gated commit schedule)

| Module | Purpose |
|--------|---------|
| `handoff-trajectory.ts` | Cross-turn EMA of portfolio handoff readiness with trajectory band |
| `gated-commit-scheduler.ts` | Deferred/allowed commit schedule from gating and resumption actions |
| `wellbeing-integration-handoff-brief.ts` | GI signal when national integration publish preconditions clear |

Turn advance attaches `handoffTrajectory`, `gatedCommitSchedule`, `wellbeingIntegrationHandoffBrief`, and returns `handoffTrajectoryPersisted`.

Integration stubs (`ps_xp_NSW_integration_handoff`, `ps_xp_SA_gated_commit_wave`); scenarios `handoff_trajectory_arc`, `gated_commit_scheduler_stress`.

## Scale wave 12 (resumption trajectory & commit gating)

| Module | Purpose |
|--------|---------|
| `resumption-trajectory.ts` | Cross-turn EMA of portfolio resumption friction with trajectory band |
| `commit-gating-advisor.ts` | Allowed/blocked new commits from resumption plan and capacity |
| `portfolio-handoff-brief.ts` | GI handoff signal when gating clears and resumption actions queue |

Turn advance attaches `resumptionTrajectory`, `commitGatingAdvice`, `portfolioHandoffBrief`, and returns `resumptionTrajectoryPersisted`.

Handoff stubs (`ps_xp_TAS_handoff_alignment`, `ps_xp_QLD_commit_gating`); scenarios `resumption_trajectory_arc`, `commit_gating_stress`.

## Scale wave 11 (readiness trajectory & portfolio resumption)

| Module | Purpose |
|--------|---------|
| `readiness-trajectory.ts` | Cross-turn EMA of recovery readiness gap with trajectory band |
| `fulfillment-aging-monitor.ts` | Overdue open relief actions and aging pressure |
| `portfolio-resumption-plan.ts` | Hold/resume commit plan tied to readiness and intervention queue |

Turn advance attaches `readinessTrajectory`, `fulfillmentAgingMonitor`, `portfolioResumptionPlan`, and returns `readinessTrajectoryPersisted`.

Cohesion stubs (`ps_xp_WA_resumption_planning`, `ps_xp_ACT_readiness_cohesion`); scenarios `readiness_trajectory_arc`, `fulfillment_aging_stress`.

## Scale wave 10 (stabilization trajectory & relief fulfillment)

| Module | Purpose |
|--------|---------|
| `stabilization-trajectory.ts` | Cross-turn EMA of portfolio stabilization stress with trajectory band |
| `relief-fulfillment-tracker.ts` | Persisted open relief actions and per-turn fulfillment against capacity |
| `wellbeing-recovery-readiness-brief.ts` | GI brief for resuming portfolio growth when fulfillment clears |

Turn advance attaches `stabilizationTrajectory`, `reliefFulfillment`, `wellbeingRecoveryReadinessBrief`, and returns `stabilizationTrajectoryPersisted` + `reliefFulfillmentPersisted`.

Recovery stubs (`ps_xp_NT_recovery_readiness`, `ps_xp_VIC_fulfillment_coordination`); scenarios `stabilization_recovery_arc`, `relief_fulfillment_backlog_stress`.

## Scale wave 9 (coordination trajectory & relief execution)

| Module | Purpose |
|--------|---------|
| `coordination-trajectory.ts` | Cross-turn EMA of stakeholder engagement pressure with trajectory band |
| `relief-execution-monitor.ts` | Tracks immediate/deferred relief dispatch backlog and escalation |
| `portfolio-stabilization-brief.ts` | GI brief for portfolio pause/clear path when execution + coordination align |

Turn advance attaches `coordinationTrajectory`, `reliefExecutionMonitor`, `portfolioStabilizationBrief`, and returns `coordinationTrajectoryPersisted`.

Stabilization stubs (`ps_xp_QLD_stakeholder_alignment`, `ps_xp_SA_portfolio_stabilization`); scenarios `coordination_trajectory_arc`, `relief_execution_stress`.

## Scale wave 8 (governance trajectory & relief dispatch)

| Module | Purpose |
|--------|---------|
| `governance-trajectory.ts` | Cross-turn EMA of governance panel score with trajectory band |
| `relief-dispatch-planner.ts` | Actionable dispatch plan from capacity relief schedule + intervention queue |
| `stakeholder-coordination-brief.ts` | GI brief for stakeholder engagement when governance/relief stress |

Turn advance attaches `governanceTrajectory`, `reliefDispatchPlan`, `stakeholderCoordinationBrief`, and returns `governanceTrajectoryPersisted`.

Governance/relief stubs (`ps_xp_NSW_governance_reform`, `ps_xp_VIC_relief_coordination`); scenarios `governance_trajectory_arc`, `relief_dispatch_coordination_stress`.

## Scale wave 7 (resilience trajectory & governance panel)

| Module | Purpose |
|--------|---------|
| `resilience-trajectory.ts` | Cross-turn EMA of wellbeing resilience index with trajectory band |
| `capacity-relief-scheduler.ts` | Deferral / relief windows when capacity binds intervention queue |
| `wellbeing-governance-panel.ts` | Composite governance score from accountability + resilience signals |
| `program-stub-commitments.ts` | Shared commitment factory (breaks scenario ↔ intervention cycle for chunk bundling) |

Turn advance attaches `resilienceTrajectory`, `capacityReliefSchedule`, `wellbeingGovernancePanel`, and returns `resilienceTrajectoryPersisted`.

Coordination stubs (`ps_xp_SA_integrated_housing_health`, `ps_xp_ACT_wellbeing_coordination`); scenarios `resilience_recovery_arc`, `capacity_relief_governance_stress`.

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
- `AGENT14_WELLBEING_SCHEMA_VERSION` (`10.14.42-scale-wave-42`)

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
