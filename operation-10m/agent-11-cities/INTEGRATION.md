# Agent 11 — Cities, regional inequality, national–local links

## Scope

Operation 10M modular slice for **urban growth dynamics**, **regional inequality**, and **local↔national coupling**. Complements canonical V10.14 §20AK (`V1014_CITIES_*`) which owns city snapshots and intercity corridors.

## Upstream inputs (read-only at assembly)

| Source | Fields used |
|--------|-------------|
| V10.14 cities | `V1014_CITIES_CityRegionalState.cities`, `.links`, `.turn` |
| Living Regions | Per-region `economyScore`, `momentumBand`, `developmentTier`, `infrastructureQuality` |
| National macro (optional) | `nationalGrowthBand`, `distributionBand`, corridor network scores |

## Downstream exports (this module)

All symbols are prefixed `OP10M_A11_` for grep-safe assembly.

| Export | Role |
|--------|------|
| `recomputeOP10M_A11_RegionalUrbanLayer` | Turn tick: inequality indices, spillovers, derived events |
| `recomputeOP10M_A11_IntercityInfraLayer` | Turn tick: regional bottlenecks + intercity dependency/choke analysis |
| `recomputeOP10M_A11_CitiesRegionsComposite` | Full depth tick: urban + infra + hierarchy + linkage matrix + relief playbook |
| `validateOP10M_A11_State` | Save/load guard |
| `validateOP10M_A11_InfraState` | Infra slice save/load guard |
| `runOP10M_A11_SelfTests` | Regression gate |

## Assembly notes (Agent 25)

1. Insert types + functions after §20AK self-tests block (before duplicate AI patterns if deduping).
2. Wire turn processor: call `recomputeOP10M_A11_RegionalUrbanLayer` immediately after `recomputeV1014_CITIES_CityRegionalState`.
3. Persist under `gameState.op10mAgent11RegionalUrban` (new key; migrate empty → `createEmptyOP10M_A11_Persisted()`).
4. Persist infra slice under `gameState.op10mAgent11IntercityInfra` (`createEmptyOP10M_A11_InfraPersisted()`).
5. Register `runOP10M_A11_SelfTests` in quick regression suite beside `runV1014_CITIES_CityRegionalIntercitySelfTests`.

### Scale wave round 4 (schema `10m.a11.composite.3`)

- **Regional migration pressure** — pull/push from growth gaps, bottlenecks, corridor surges (`op10mA11ComputeMigrationPressure`)
- **Settlement vulnerability** — composite exposure from inequality, bottlenecks, isolation (`op10mA11ComputeSettlementVulnerability`)
- **Fiscal–urban coupling** — national distribution band vs regional catch-up (`op10mA11ComputeFiscalUrbanCoupling`, `regionalCohesionIndex`)
- **Multi-turn regression harness** — `runOP10M_A11_RegionalRegressionHarness`
- Derived events: `migration_pressure_spike`, `settlement_vulnerability_critical`, `fiscal_coupling_mismatch`

## Tests

```bash
npm run test:agent-11-cities
npm run build:agent11-chunk
```

Assembly-ready inline module: `operation-10m/modules/agent-11-cities/chunk.tsx` (`OP10M_MODULE_BEGIN agent-11-cities`).
