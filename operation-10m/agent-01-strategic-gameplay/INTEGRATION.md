# Agent 01 — Strategic Gameplay (integration slice)

Module path: `operation-10m/agent-01-strategic-gameplay/`  
Module id: `operation-10m/agent-01-strategic-gameplay` · version `1.0.0`

## Purpose

Consequential player actions with **validation**, **multi-stage choices**, **national priority alignment**, and **delayed trade-offs**, expressed as domain patches over five integration contracts (economy, government, population, tech, UI). No React; canonical V9.4 owns rendering and save state.

## Contract boundaries

| Contract | Canonical owner (V9.4) | Agent 01 consumes | Agent 01 emits |
|----------|------------------------|-------------------|----------------|
| `EconomyContract` | Treasury, markets, net worth | `snapshot()`, `canAfford()` | `EconomyPatch` |
| `GovernmentContract` | Approval, directives | `snapshot()`, `canIssueDirective()` | `GovernancePatch` |
| `PopulationContract` | Households, stability | `snapshot()`, `stressBand()` | `PopulationPatch` |
| `TechContract` | Research tracks | `snapshot()`, `meetsPrerequisite()` | `TechPatch` |
| `UiContract` | Intent HUD, toasts | — | `presentChoice`, `pushToast`, `setActionHudSummary` |

Type definitions live under `src/contracts/`. Assembly must map V9.4 `NationalPriorityId` and `NationalPriorityActionAlignment` to `src/types/national-priority.ts` (same id union as V9.4 lines ~146128+).

## Runtime hook points (assembly)

1. **Turn action pipeline** — after legality checks in canonical code, call `validateAction` / `executeStrategicAction` for registered strategic actions (catalog ids prefixed `sga_`).
2. **Multi-stage modals** — drive `beginMultiStageChoice` → `advanceMultiStageChoice` → optional `executeStrategicAction` when `resolvedActionId` is set; use `presentActiveChoiceStage` to populate intent UI.
3. **Day advance** — call `advanceDayAndResolveDelayed(state, contracts, nextDay)` before economy tick so delayed trade-offs apply in deterministic order (sorted by `firesOnDay`).
4. **Ranking metadata** — `scoreNationalPriorityAlignment` mirrors V10.7 ranking-only behavior; must not gate legality in canonical game.

## Public entry

```ts
import {
  createInitialStrategicState,
  executeStrategicAction,
  advanceDayAndResolveDelayed,
  beginMultiStageChoice,
  advanceMultiStageChoice,
  getStrategicAction,
  MULTI_STAGE_CHOICE_CATALOG,
} from './operation-10m/agent-01-strategic-gameplay/src/index.ts';
```

Assembly supplies `StrategicGameplayContracts` implementations (see `createMemoryStrategicContracts` for test double shape).

## Catalog (initial)

| Action id | Multi-stage choice | Primary priorities |
|-----------|-------------------|-------------------|
| `sga_water_grid_upgrade` | `msc_water_commitment` | water_security, energy_resilience |
| `sga_supply_chain_buffer` | — | supply_chain_security |
| `sga_tech_accelerator` | — | technology_competitiveness |

Each action defines `immediateEffects` and zero or more `delayedTradeOffs` (default delay 3 days, overridable via `executeStrategicAction` options).

## State ownership

| State | Owner |
|-------|--------|
| `StrategicGameplayState` (pending delayed queue, active choice, completed ids) | Agent 01 slice — persist in player/team save blob `strategicGameplayV1` |
| Domain numbers | Canonical V9.4 — patches only via contracts |

## Verification

From module root:

```bash
npm install
npm test
npm run typecheck
npm run bundle:chunk
```

Produces `chunk.tsx` with `OP10M_MODULE_BEGIN agent-01-strategic-gameplay` markers for Agent 25 assembly (see repo `operation-10m/INTEGRATION.md` on `op10m/agent-25-integration`).

## Parent integration doc

When `operation-10m/INTEGRATION.md` exists (Agent 25), register this slice under **Agent 01 — Strategic Gameplay** with the hook points above and contract table.
