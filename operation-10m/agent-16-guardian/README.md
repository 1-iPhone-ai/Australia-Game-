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
- `monitor-rules.ts` — 22 monitor/advise/alert rules
- `advisory-cycle.ts` — cycle, dedupe, Co-Pilot candidate → advisory mapping
- `snapshot.ts` — monitor snapshot builder from game slice
- `scenarios.ts` — deterministic scenario catalog for regression
- `self-tests.ts` — LAB-ready self-test suite
- `index.ts` — public exports

## Tests

```bash
npm run test:agent16
```

## Agent 25 assembly

Bundle paths (in order): `types.ts`, `policy.ts`, `grounding.ts`, `suggestion-gate.ts`, `monitor-rules.ts`, `advisory-cycle.ts`, `snapshot.ts`, `scenarios.ts`, `self-tests.ts`, `index.ts`.

Wire `runAgent16GuardianCoPilotSelfTests()` into LAB **System Regression**. Do **not** pipe advisory output into `executeCoPilotAction`. Keep `evaluateGuardianRiskPipeline` as the enforcement layer.

Anchor: canonical V9.4 `SECTION 20PA` (Guardian & Human Co-Pilot Advisory Ops).
