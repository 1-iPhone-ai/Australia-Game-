# Operation 10M — Integration (Agent 05 slice)

Agent 05 owns **state-triggered narrative chains** outside canonical V9.4 until Agent 25 assembly.

## Module root

`operation-10m/agent-05-events/`

## Public surface (assembly targets)

| Export | Role |
|--------|------|
| `OP10M_AGENT05_MODULE_ID` | Stable integrator key |
| `OP10M_AGENT05_CHAIN_CATALOG` | 1800 chain descriptors (600 + 240 + 360 + 320 + 280 compute-turn) |
| `createDefaultOp10mSimulationSlice` | Minimal mutable sim slice for hooks |
| `createDefaultOp10mNarrativeEngineState` | Persistent narrative runtime state |
| `sanitizeOp10mNarrativeEngineState` | Save/load hygiene |
| `executeOp10mNarrativeComputeTurnHook` | Agent 02 turn/compute alignment: deferred drain → depth → narrative tick → digest |
| `evaluateOp10mNarrativeTick` | Turn/day advance: eligibility, cooldowns, passive modifiers, pending UI |
| `resolveOp10mNarrativeResponse` | Player choice → **real** money/stability/flags/crisis counters |
| `OP10M_AGENT05_REGIONAL_HOOK_CATALOG` | 120 rupture-triggered cross-region hooks (contagion + deep follow-up arming) |
| `evaluateRegionalNarrativeHooks` | Standalone regional pass (also wired via `regionalHooks` tick option) |
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
2. After day/turn simulation step, call `executeOp10mNarrativeComputeTurnHook({ turn, day, simulation, narrative, catalog, regionalHooks })` **or** `evaluateOp10mNarrativeTick` when only the narrative slice is needed.
3. Write back **both** returned `simulation` fields (money, stability, flags, crises) and `narrative` sub-state.
4. UI routes pending `pendingResponses` to dilemma/crisis modals; resolve via `resolveOp10mNarrativeResponse`.

## Assembly chunk (Agent 25)

- Path: `operation-10m/agent-05-events/chunk.tsx`
- Markers: `// OP10M_MODULE_BEGIN agent-05-events` … `// OP10M_MODULE_END agent-05-events`
- Regenerate: `npm run bundle:agent05` (concatenates `src/` + generated catalogs; strips imports)
- Inline self-test: `runOp10mAgent05EventsAssemblySelfTests()`

## Regeneration

```bash
npm run generate:agent05
npm run generate:agent05-regional
```

## Verification

```bash
npm run test:agent05
```
