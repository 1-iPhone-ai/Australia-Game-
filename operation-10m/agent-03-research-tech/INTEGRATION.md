# Agent 03 — Integration Contract (Research / Technology / Progression)

**Module root:** `operation-10m/agent-03-research-tech/`  
**Schema version:** `op10m-agent03-v1`  
**Owner:** Agent 03 (content + pure engine). **Assembly:** Agent 25 only.

## Purpose

Provides a **strategic research-branch overlay** aligned with V10.5 Innovation & Emerging Capabilities:

- No science-point tech tree and no research progress bar (consistent with V10.5 design in V9.4 §20X).
- Branch nodes unlock when **existing** game signals satisfy prerequisite graphs (projects, contracts, capabilities, megaprojects, faction standing, sector strength).
- **Regional diffusion** spreads branch influence (cap `0.85`, aligned with `V105_THRESHOLDS.diffusionCap`).
- **Strategy hooks** expose late-game priorities mapped to real V9.4 identifiers for UI, copilot, and national strategy panels.

## Assembly surface (Agent 25)

### Import path (post-merge target)

```typescript
import {
  buildResearchProgressInputs,
  computeResearchProgress,
  createEmptyResearchProgressState,
  getStrategyHooksForState,
  sanitizeResearchProgressPersisted, // to be wired at assembly
} from './operation-10m/agent-03-research-tech';
```

### Persisted field (proposed on `gameState`)

```typescript
gameState.researchProgress: ResearchProgressState | null;
```

Serialization: JSON-compatible; recompute each turn from snapshots (same pattern as `innovation`).

### Input wiring

| Agent 03 input | V9.4 source |
|----------------|-------------|
| `regions[].sectors` | `LivingRegionsState.regions[code].sectors` |
| `capabilities` | `InnovationCapabilitiesState.capabilities` (maturity + `activeRegionIds`) |
| `projects` | Canonical infrastructure / project records |
| `completedContracts` | Completed contract list (`contractType`, `regionId`) |
| `megaprojects` | `MegaprojectsPersisted.programs[*]` stage counts |
| `factionStanding` | Player standing vs `csiro_ai_directorate`, `vic_technology_council`, etc. |

Use `buildResearchProgressInputs()` at assembly boundary.

### Output consumers

| Consumer | Field |
|----------|--------|
| Strategy / endgame UI | `activeHookIds` → `getStrategyHooksForState()` |
| Regional LAB / map overlays | `diffusion[]` (`level`, `score`, `sourceNodeIds`) |
| Branch panel | `readinessByBranch`, `unlockedNodes` |
| Copilot / GI | Hook `targets.*` literals matching V9.4 catalogs |

### Feature flag (proposed)

`researchProgressionEnabled: boolean` — default off until assembly tranche lands; when off, skip compute and hide UI.

## Identifier parity

All capability, megaproject, contract, project, and faction strings are duplicated in `src/v94-ids.ts`.  
Self-test `integration_contract_capability_ids` validates node definitions against those unions.  
Agent 25 must run parity diff against V9.4 exports when merging.

## Tests

```bash
npm run test:agent-03
```

Exit code 0 required in CI for Operation 10M worker gates.

## Files

| Path | Role |
|------|------|
| `src/branches.ts` | 6 branches × 4 tiers (24 nodes) |
| `src/institutions.ts` | Research institutions + diffusion neighbors |
| `src/prerequisites.ts` | DAG evaluation |
| `src/diffusion.ts` | Regional diffusion grid |
| `src/strategy-hooks.ts` | 24 late/mid/endgame hooks |
| `src/compute.ts` | Turn recompute + input hash |
| `tests/agent03-self-tests.ts` | Self-tests + contract checks |

## Non-goals (this module)

- Does not modify V10.5 capability formulas or thresholds.
- Does not grant cash, AP, or inventory.
- Does not edit `(V9.4) australia-game-with-ai.tsx` directly.
