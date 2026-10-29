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

### Scale wave round 13 (schema `10m.a11.composite.12`)

- **Regional cohesion integrity pressure** — cohesion index × network erosion × fiscal strain (`op10mA11ComputeRegionalCohesionIntegrityPressure`)
- **Interregional relief delivery equity gap** — relief overhead × corridor drift × service equity (`op10mA11ComputeInterregionalReliefDeliveryEquityGap`)
- **Settlement systemic fragility composite** — horizon risk × land-use gridlock × relocation burden (`op10mA11ComputeSettlementSystemicFragilityComposite`)
- **10-turn regression harness** — extended bounds for cohesion integrity, relief equity gap, systemic fragility
- Derived events: `cohesion_integrity_stress`, `relief_delivery_equity_gap`, `systemic_settlement_fragility`

### Scale wave round 12 (schema `10m.a11.composite.11`)

- **Regional fiscal capacity strain** — fiscal coupling × relief overhead × governance (`op10mA11ComputeRegionalFiscalCapacityStrain`)
- **Interregional network resilience erosion** — linkage hubs × corridor drift × infra backlog (`op10mA11ComputeInterregionalNetworkResilienceErosion`)
- **Settlement long-horizon capacity risk** — adaptation lag × mobility trap × convergence (`op10mA11ComputeSettlementLongHorizonCapacityRisk`)
- **10-turn regression harness** — extended bounds for fiscal strain, network erosion, horizon risk
- Derived events: `fiscal_capacity_strain`, `network_resilience_erosion`, `long_horizon_capacity_risk`

### Scale wave round 11 (schema `10m.a11.composite.10`)

- **Regional relief coordination overhead** — relief playbook × governance × reception strain (`op10mA11ComputeRegionalReliefCoordinationOverhead`)
- **Interregional corridor equity drift** — corridor flows × service equity × commute wedge (`op10mA11ComputeInterregionalCorridorEquityDrift`)
- **Settlement climate adaptation lag** — climate displacement × absorption gap × infra backlog (`op10mA11ComputeSettlementClimateAdaptationLag`)
- **10-turn regression harness** — extended bounds for relief overhead, corridor drift, adaptation lag
- Derived events: `relief_coordination_overhead`, `corridor_equity_drift`, `climate_adaptation_lag`

### Scale wave round 10 (schema `10m.a11.composite.9`)

- **Regional land-use regulatory gridlock** — governance friction × peri-urban × housing spillover (`op10mA11ComputeRegionalLandUseRegulatoryGridlock`)
- **Interregional mobility affordability trap** — commute wedge × migration × amenity cost (`op10mA11ComputeInterregionalMobilityAffordabilityTrap`)
- **Settlement infrastructure absorption gap** — infra backlog × reception strain × absorption (`op10mA11ComputeSettlementInfrastructureAbsorptionGap`)
- **10-turn regression harness** — extended bounds for land-use gridlock, mobility trap, absorption gap
- Derived events: `land_use_regulatory_gridlock`, `mobility_affordability_trap`, `infrastructure_absorption_gap`

### Scale wave round 9 (schema `10m.a11.composite.8`)

- **Regional employment anchor stress** — decentralization × talent retention × hub isolation (`op10mA11ComputeRegionalEmploymentAnchorStress`)
- **Interregional commute affordability wedge** — amenity cost × peri-urban × corridor flows (`op10mA11ComputeInterregionalCommuteAffordabilityWedge`)
- **Settlement reception capacity strain** — relocation burden × absorption × service equity (`op10mA11ComputeSettlementReceptionCapacityStrain`)
- **10-turn regression harness** — extended bounds for employment anchor, commute wedge, reception strain
- Derived events: `employment_anchor_fragility`, `commute_affordability_wedge`, `settlement_reception_strain`

### Scale wave round 8 (schema `10m.a11.composite.7`)

- **Regional amenity cost pressure** — housing spillover × talent drain × fiscal coupling (`op10mA11ComputeRegionalAmenityCostPressure`)
- **Digital connectivity decentralization shift** — network digital × migration × hierarchy (`op10mA11ComputeDigitalConnectivityDecentralizationShift`)
- **Settlement relocation burden** — climate displacement × governance × housing reception (`op10mA11ComputeSettlementRelocationBurden`)
- **10-turn regression harness** — extended bounds for amenity + relocation indices
- Derived events: `amenity_cost_spiral`, `digital_decentralization_pulse`, `settlement_relocation_burden`

### Scale wave round 6 (schema `10m.a11.composite.5`)

- **Peri-urban expansion pressure** — corridor pull × metro growth bands (`op10mA11ComputePeriUrbanExpansionPressure`, `nationalPeriUrbanPressureIndex`)
- **Regional infrastructure backlog** — bottlenecks × absorption × corridor stress (`op10mA11ComputeRegionalInfrastructureBacklog`)
- **Multi-tier governance friction** — relief playbook × service equity × national distribution (`op10mA11ComputeMultiTierGovernanceFriction`)
- **10-turn regression harness** — extended `runOP10M_A11_RegionalRegressionHarness`
- Derived events: `peri_urban_sprawl_pressure`, `infrastructure_backlog_critical`, `governance_coordination_breakdown`

### Scale wave round 5 (schema `10m.a11.composite.4`)

- **Metropolitan absorption stress** — growth load vs headroom by region (`op10mA11ComputeMetropolitanAbsorptionStress`, `metropolitanSaturationIndex`)
- **Regional service equity** — settlement vulnerability × fiscal coupling (`op10mA11ComputeRegionalServiceEquity`)
- **Convergence velocity** — standing spread and catch-up momentum (`op10mA11ComputeRegionalConvergence`)
- **8-turn regression harness** — extended `runOP10M_A11_RegionalRegressionHarness`
- Derived events: `absorption_capacity_breach`, `service_equity_gap`, `convergence_stall`

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
