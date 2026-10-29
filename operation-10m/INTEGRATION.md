# Operation 10M — Integration (Agent 05 slice)

Agent 05 owns **state-triggered narrative chains** outside canonical V9.4 until Agent 25 assembly.

## Module root

`operation-10m/agent-05-events/`

## Public surface (assembly targets)

| Export | Role |
|--------|------|
| `OP10M_AGENT05_MODULE_ID` | Stable integrator key |
| `OP10M_AGENT05_CHAIN_CATALOG` | 600 gated chain descriptors (8 regions × 15 themes × 5 variants) |
| `createDefaultOp10mSimulationSlice` | Minimal mutable sim slice for hooks |
| `createDefaultOp10mNarrativeEngineState` | Persistent narrative runtime state |
| `sanitizeOp10mNarrativeEngineState` | Save/load hygiene |
| `evaluateOp10mNarrativeTick` | Turn/day advance: eligibility, cooldowns, passive modifiers, pending UI |
| `resolveOp10mNarrativeResponse` | Player choice → **real** money/stability/flags/crisis counters |
| `runOp10mNarrativeSelfTests` | Lightweight integrity harness |

## V9.4 alignment (read-only contract)

Maps to existing concepts without editing V9.4:

- `Op10mSimulationSlice.flags` ↔ scenario/campaign flags & content flags
- `activeCrisisCount` ↔ `crisisChainState` active chains
- `nationalStability` / `regionalStability` ↔ `publicStabilityState`
- Chain phases ↔ Agent 05 `signal → pressure → rupture → recovery` narrative beats
- Cooldown entries ↔ per-template / per-chain cooldown fields in crisis content

## Assembly hook (Agent 25)

1. Mount `agent05NarrativeState` on game save (default via `createDefaultOp10mNarrativeEngineState`).
2. After day/turn simulation step, call `evaluateOp10mNarrativeTick(mappedSim, state, OP10M_AGENT05_CHAIN_CATALOG, { enabled: gameSettings.dynamicCrisisChainsEnabled })`.
3. Write back **both** returned `simulation` fields (money, stability, flags, crises) and `narrative` sub-state.
4. UI routes pending `pendingResponses` to dilemma/crisis modals; resolve via `resolveOp10mNarrativeResponse`.

## Regeneration

```bash
npm run generate:agent05
```

## Verification

```bash
npm run test:agent05
```
