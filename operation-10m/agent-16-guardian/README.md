# Agent 16 — Guardian AI & Human Co-Pilot Advisory Ops

Modular **recommendations-only** layer for Operation 10M. Observes Guardian + Co-Pilot context; never executes actions or mutates game state.

## Guarantees

| Concern | Mechanism |
|--------|-----------|
| Grounded advice | Every advisory carries `grounding[]` evidence tied to snapshot fields; `verifyAdvisoryGrounding` rejects stale copy |
| Suggestions ≠ execution | `ADVISORY_OPS_POLICY`, `assertAdvisoryRecommendationOnly`, `stripExecutionFromCoPilotCandidate`, `evaluateSuggestedActionGate` |
| State-verified warnings | `verifyStateVerifiedWarning` re-runs the monitor rule against the snapshot before surfacing |

## Layout

- `types.ts` — shared interfaces
- `policy.ts` — non-negotiable advisory mandate
- `grounding.ts` — evidence attachment + verification
- `suggestion-gate.ts` — Co-Pilot suggested-action gate (approval path)
- `monitor-rules.ts` — 22 core monitor/advise/alert rules
- `monitor-rules-expansion.ts` — 11 objective-aware + extended Guardian rules
- `objective-context.ts` — mission/objective parsing and advice hints
- `advisory-cycle.ts` — cycle, dedupe, Co-Pilot candidate → advisory mapping
- `snapshot.ts` — monitor snapshot builder from game slice
- `scenarios.ts` — deterministic scenario catalog for regression
- `self-tests.ts` — LAB-ready self-test suite
- `index.ts` — public exports

## Tests

```bash
npm run test:agent16
npm run build:agent16-chunk
```

Assembly output: `operation-10m/modules/agent-16-guardian/chunk.tsx` (`OP10M_MODULE_BEGIN agent-16-guardian`).

## Agent 25 assembly

Bundle paths (in order): `types.ts`, `policy.ts`, `grounding.ts`, `suggestion-gate.ts`, `monitor-rules.ts`, `advisory-cycle.ts`, `snapshot.ts`, `scenarios.ts`, `self-tests.ts`, `index.ts`.

Wire `runAgent16GuardianCoPilotSelfTests()` into LAB **System Regression**. Do **not** pipe advisory output into `executeCoPilotAction`. Keep `evaluateGuardianRiskPipeline` as the enforcement layer.

Anchor: canonical V9.4 `SECTION 20PA` (Guardian & Human Co-Pilot Advisory Ops).

## Scale wave round 4

- **Interlock metrics:** `compositePressureIndex`, `automationReadinessScore`, `actionBurnPressure`; `buildGuardianDepthInterlockReport()`
- **`monitor-rules-scale-wave-4.ts`** — 12 rules (**82** monitor rules total)
- **139/139** self-tests; regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 5

- **Stability lattice metrics:** `advisorySaturationIndex`, `escalationLatchScore`, `governanceCoherenceScore`; `buildGuardianDepthStabilityReport()`
- **`monitor-rules-scale-wave-5.ts`** — 12 rules (**94** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 6

- **Resilience envelope metrics:** `containmentBurdenIndex`, `humanRelayPressure`, `recoveryHeadroomScore`; `buildGuardianDepthResilienceReport()`
- **`monitor-rules-scale-wave-6.ts`** — 12 rules (**106** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 7

- **Continuity envelope metrics:** `advisoryDepletionIndex`, `operatorBandwidthScore`, `continuityMarginScore`; `buildGuardianDepthContinuityReport()`
- **`monitor-rules-scale-wave-7.ts`** — 12 rules (**118** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 8

- **Stewardship envelope metrics:** `stewardshipLoadIndex`, `oversightCommitmentScore`, `sustainabilityMarginScore`; `buildGuardianDepthStewardshipReport()`
- **`monitor-rules-scale-wave-8.ts`** — 12 rules (**130** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 9

- **Accountability envelope metrics:** `accountabilityLoadIndex`, `delegationFidelityScore`, `governanceEnduranceScore`; `buildGuardianDepthAccountabilityReport()`
- **`monitor-rules-scale-wave-9.ts`** — 12 rules (**142** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 10

- **Fiduciary envelope metrics:** `fiduciaryBurdenIndex`, `trustAssuranceScore`, `governanceDurabilityScore`; `buildGuardianDepthFiduciaryReport()`
- **`monitor-rules-scale-wave-10.ts`** — 12 rules (**154** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`
