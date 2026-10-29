# Agent 03 — Integration Contract (Research / Technology / Progression)

**Module root:** `operation-10m/agent-03-research-tech/`  
**Schema version:** `op10m-agent03-v9` (synergy threshold log + synergy snapshot persisted; portfolio stabilization outlook derived, v8 migration)  
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
gameState.researchProgress: ResearchProgressPersistedCore | null;
```

Use `prepareResearchProgressForSave(state)` before write; on load `applyResearchProgressSavePipeline(inputs, raw)` or `computeResearchProgressFromSave`.

**v9 persisted core** adds bounded `synergyThresholdLog` and `synergySnapshot` on top of v8 (`integrationRiskLog`, `scaleWaveSnapshot`, v7 readiness digest, v6 emphasis/institution digest, v5 unlock audit). Derived `portfolioBalance`, `diffusionForecast`, `synergyOutlook`, `integrationRiskOutlook`, `adoptionHorizonOutlook`, and `portfolioStabilizationOutlook` recomputed each turn.

Legacy `op10m-agent03-v8`, `op10m-agent03-v7`, `op10m-agent03-v6`, `op10m-agent03-v5`, `op10m-agent03-v4`, `op10m-agent03-v3`, `op10m-agent03-v2`, and `op10m-agent03-v1` migrate via `migrateResearchProgressSave()`.

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
| Institution panel (slice 2) | `institutionUpgrades[]` (`tier`, multipliers, `reasons`) |
| Endgame map cascade (slice 2) | `lateGameDiffusion` (`active`, `pulses`, `nationalPenetration`) |

### Slice 2 — institution upgrades + late-game diffusion

- **`institutionUpgrades`**: tiers `dormant → affiliate → partner → strategic → national_integration` from faction standing, preferred projects/contracts, and unlocked branch tiers. Tiers are **monotonic** across turns (persisted state merged on recompute).
- **`lateGameDiffusion`**: neighbor-graph cascade from integrated regions when **any tier-4 branch node** is unlocked and/or an institution reaches **national_integration**. Adds bounded `cascadeBoost` on `diffusion[]` (still capped at 0.85).

Pure helpers: `computeInstitutionUpgrades`, `applyLateGameDiffusionCascade` (also invoked inside `computeResearchProgress`).

### Slice 3 — scale wave (tier 5 + cross-branch synergy)

- **6 tier-5 nodes** with `branch_progress` gates linking branches
- `scaleWave` report on state: synergy score, technology transfer links, dominant capability cluster
- Readiness/diffusion bounded bonuses via `scale-wave.ts`

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

## Agent 25 assembly chunk

| Path | Role |
|------|------|
| `operation-10m/modules/agent-03-research-tech/chunk.tsx` | `OP10M_MODULE_BEGIN/END agent-03-research-tech` bundled body |
| `operation-10m/modules/agent-03-research-tech/module.manifest.json` | Slot `post-v10z`, `contentSha256`, save-field hint |

Regenerate after `src/` changes:

```bash
npm run bundle:agent-03-chunk
```

Assembly entrypoints in chunk: `computeResearchProgress`, `buildResearchProgressInputs`, `sanitizeResearchProgressPersisted`, `runAgent03ResearchTechSelfTests`, `OP10M_AGENT03_MODULE_META`.

## Files

| Path | Role |
|------|------|
| `src/branches.ts` | 6 branches × 4 tiers (24 nodes) |
| `src/institutions.ts` | Research institutions + diffusion neighbors |
| `src/prerequisites.ts` | DAG evaluation |
| `src/diffusion.ts` | Regional diffusion grid (+ institution boost fields) |
| `src/institution-upgrades.ts` | Institution tier evaluation (slice 2) |
| `src/late-game-diffusion.ts` | Endgame cascade (slice 2) |
| `src/strategy-hooks.ts` | 24 late/mid/endgame hooks |
| `src/compute.ts` | Turn recompute + input hash |
| `tests/agent03-self-tests.ts` | Self-tests + contract checks |

## Non-goals (this module)

- Does not modify V10.5 capability formulas or thresholds.
- Does not grant cash, AP, or inventory.
- Does not edit `(V9.4) australia-game-with-ai.tsx` directly.
