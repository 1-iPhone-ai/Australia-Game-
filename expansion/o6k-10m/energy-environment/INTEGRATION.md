# T6-4 — Energy, extraction & environmental coupling (depth pass)

**Branch:** `cursor/o6k-10m-energy-depth-7e57`  
**Band:** `SECTION 20AY`  
**Namespace:** `V1014_ENERGY_DEPTH_*`  
**LAB suite:** `v1014_energy_depth`  
**Agent:** 13 delta (#300) on **`SECTION 20AL`**

## Merge anchor

Inline the generated module exports from `expansion/o6k-10m/energy-environment/src/index.ts` (or the bundled shard Agent 25 chooses) **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Do **not** duplicate `SECTION 20AL`; `20AY` is the second-pass depth layer that **reads** industrial energy output and **writes** bounded sidecar modifiers only.

## Cross-wire (T6-4)

| Section | Adapter export | Direction |
|---------|----------------|-----------|
| **20AL** | `V1014_ENERGY_DEPTH_adaptIndustrialEnergy` | Reads `IndustrialEnergyEnvironmentalState` + persisted hysteresis → depth inputs |
| **20T** | `V1014_ENERGY_DEPTH_adaptIndustries` | Maps energy supply stress → capped `IndustriesInputs.modifiers` deltas |
| **20Y** | `V1014_ENERGY_DEPTH_adaptSystemicRisk` | Raises `energy` domain exposure when grid stability band ≥ `strained` |
| **20U** | `V1014_ENERGY_DEPTH_adaptInfrastructure` | Corridor headroom → reserve margin & intermittency absorption |
| **20AS** | `V1014_ENERGY_DEPTH_adaptCrisisTriggers` | Emits derived crisis trigger hints when carbon overshoot + grid critical |

## Persistence (§6)

| Key | Shape |
|-----|--------|
| `save.meta.v1014.energy_depth` | `V1014EnergyDepthPersisted` |
| `gameState.energyDepth` (runtime) | `V1014EnergyDepthState` |

Migration: if missing, `createInitialV1014EnergyDepthPersisted()`; if `schemaVersion !== V1014_ENERGY_DEPTH_SCHEMA_VERSION`, reset depth persisted but preserve turn counter in `initializedTurn`.

## Turn hook order (relative to §11A / Agent 02 pipeline)

1. V10.0 national energy networks (unchanged)  
2. **20T** industries recompute (pass 1)  
3. **20U** strategic infrastructure tick  
4. **20AL** `computeIndustrialEnergyEnvironmentalState`  
5. **`20AY`** `computeV1014EnergyDepthState` ← **this module**  
6. **20T** industries recompute (pass 2) with merged modifiers from 20AL + 20AY  
7. **20Y** systemic risk (consumes depth grid + carbon signals)  
8. **20AG** / **20AO** macro adapters (GDP/inflation interpretation — bounded)  
9. **20AS** crisis engine (may consume `V1014EnergyDepthCrisisHints`)  
10. Household / trade ticks per existing fleet order  

Register day-boundary hook: `V1014_ENERGY_DEPTH_turnHook` after step 4 and before step 6 in the Agent 25 orchestrator graph.

## LAB / §21B registration

Add to release self-test catalog (before §21B runner):

```typescript
{
  id: 'v1014_energy_depth',
  label: 'V10.14 Energy depth (grid, depletion, intermittency, carbon)',
  tier: 'quick',
  section: 'System Regression',
  severity: 'MAJOR',
  run: () => runV1014EnergyDepthSelfTests(),
},
```

## Regenerate

```bash
cd expansion/o6k-10m/energy-environment
python3 generate-energy-depth-module.py
npx --yes tsx run-self-tests.ts
```

## Invariants

- No wallet, AP, price, or turn-authority mutations.  
- Modifier caps align with **20AL** (`modifierCap` 12 / `modifierFloor` -18) for industry-facing outputs.  
- Deterministic: no `Math.random()` in compute or self-tests.
