# Agent 20 — Integration contract (Operation 10M)

Module: `operation-10m/agent-20-automation`

Canonical mirror: **SECTION 20AN** in `(V9.4) australia-game-with-ai.tsx` (`V1014_*`, `runAgent20IntegrationSelfTests`).

## Assembly anchor

Insert module exports at:

```tsx
// O10_AGENT20_INTEGRATION_ANCHOR — Operation 10M idle/automation/autonomous ops (Agent 20)
```

Agent 25 may either:

1. **Re-export** from inlined copy (600K tranche already inlined core 20AN), wiring new O10 helpers next to the anchor, or
2. **Replace** duplicated pure helpers with imports from this module during a later assembly pass.

## New exports to wire (O10 additions)

| Export | Use |
|--------|-----|
| `evaluateConditionalAutomationAction` | Human automation turn-start preview + run gate |
| `evaluateHumanAutomationExecutionEligibility` | Shared limits before trigger evaluation |
| `checkHumanAutomationSafetyLimits` | Spendable-cash safety floor |
| `appendAutomationRunHistory` / `buildAutomationDailyDigest` | `automationRunHistoryEnabled` + daily digest |
| `evaluateSafeTimeAdvance` / `canAdvanceDay` / `canEndTurn` | `advanceDay`, end-turn handlers, idle steward ticks |
| `runO10Agent20ModuleSelfTests` | Dev lab tier `o10_agent20` (alongside `v1014_agent20`) |

## Safe time advance call sites

1. **`advanceDay`** — call `canAdvanceDay(ctx)`; if blocked, surface `reason` and return early (invariant F).
2. **`handleEndTurn` / keyboard end turn** — call `canEndTurn(ctx)`.
3. **Co-Pilot `executeCoPilotEndTurn`** — merge pending approval counts into ctx before allowing day roll.
4. **Idle steward national tick** — use `evaluateSafeTimeAdvance(ctx, 'wait_tick')` before scheduling AP spend.

## Persistence

- `autonomousIdleNational` — already sanitized via `sanitizeAutonomousIdleNationalPersisted` in canonical TSX; O10 module uses compatible schema `10.14.0-agent20`.
- Run history remains on each `HumanAutomation` rule (`runHistory`); O10 log helpers are pure and safe to call from `applyHumanAutomationRunResult`.

## Tests

```bash
cd operation-10m/agent-20-automation && npm install && npm test
```

Expected: all `runO10Agent20ModuleSelfTests` cases pass (national steward + bridge + conditional + limits + logs + safe time advance).

## Assembly chunk

Regenerate the Agent 25 inline bundle:

```bash
npm run build:agent20-chunk
```

Output: `operation-10m/modules/agent-20-automation/chunk.tsx` between `OP10M_MODULE_BEGIN agent-20-automation` and `OP10M_MODULE_END agent-20-automation` (no top-level `import` lines). Manifest: `operation-10m/modules/agent-20-automation/module.manifest.json`.
