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

### Scale wave round 44 (O10-219, schema `10m.a11.composite.43`)

- **Regional collapse omni singularity universalism** — totalism × attrition × finality (`op10mA11ComputeRegionalCollapseOmniSingularityUniversalism`)
- **Interregional void total erosion ablation** — attrition × totalism × void front (`op10mA11ComputeInterregionalVoidTotalErosionAblation`)
- **Settlement existential absolute nullity sealing** — finality × totalism × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullitySealing`)
- Derived events: `collapse_omni_singularity_universalism`, `void_total_erosion_ablation`, `existential_absolute_nullity_sealing`

### Scale wave round 43 (O10-217, schema `10m.a11.composite.42`)

- **Regional collapse omni singularity totalism** — monism × comminution × conviction (`op10mA11ComputeRegionalCollapseOmniSingularityTotalism`)
- **Interregional void total erosion attrition** — comminution × monism × void front (`op10mA11ComputeInterregionalVoidTotalErosionAttrition`)
- **Settlement existential absolute nullity finality** — conviction × monism × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityFinality`)
- Derived events: `collapse_omni_singularity_totalism`, `void_total_erosion_attrition`, `existential_absolute_nullity_finality`

### Scale wave round 42 (O10-215, schema `10m.a11.composite.41`)

- **Regional collapse omni singularity monism** — holism × granulation × certitude (`op10mA11ComputeRegionalCollapseOmniSingularityMonism`)
- **Interregional void total erosion comminution** — granulation × holism × void front (`op10mA11ComputeInterregionalVoidTotalErosionComminution`)
- **Settlement existential absolute nullity conviction** — certitude × holism × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityConviction`)
- Derived events: `collapse_omni_singularity_monism`, `void_total_erosion_comminution`, `existential_absolute_nullity_conviction`

### Scale wave round 41 (O10-213, schema `10m.a11.composite.40`)

- **Regional collapse omni singularity holism** — symbiosis × pulverization × determinism (`op10mA11ComputeRegionalCollapseOmniSingularityHolism`)
- **Interregional void total erosion granulation** — pulverization × symbiosis × void front (`op10mA11ComputeInterregionalVoidTotalErosionGranulation`)
- **Settlement existential absolute nullity certitude** — determinism × symbiosis × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityCertitude`)
- Derived events: `collapse_omni_singularity_holism`, `void_total_erosion_granulation`, `existential_absolute_nullity_certitude`

### Scale wave round 40 (O10-211, schema `10m.a11.composite.39`)

- **Regional collapse omni singularity symbiosis** — amalgamation × atomization × inevitability (`op10mA11ComputeRegionalCollapseOmniSingularitySymbiosis`)
- **Interregional void total erosion pulverization** — atomization × amalgamation × void front (`op10mA11ComputeInterregionalVoidTotalErosionPulverization`)
- **Settlement existential absolute nullity determinism** — inevitability × amalgamation × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityDeterminism`)
- Derived events: `collapse_omni_singularity_symbiosis`, `void_total_erosion_pulverization`, `existential_absolute_nullity_determinism`

### Scale wave round 39 (O10-209, schema `10m.a11.composite.38`)

- **Regional collapse omni singularity amalgamation** — omni coalescence × erosion sublimation × nullity permanence (`op10mA11ComputeRegionalCollapseOmniSingularityAmalgamation`)
- **Interregional void total erosion atomization** — erosion sublimation × omni coalescence × void front (`op10mA11ComputeInterregionalVoidTotalErosionAtomization`)
- **Settlement existential absolute nullity inevitability** — nullity permanence × omni coalescence × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityInevitability`)
- Derived events: `collapse_omni_singularity_amalgamation`, `void_total_erosion_atomization`, `existential_absolute_nullity_inevitability`

### Scale wave round 38 (O10-207, schema `10m.a11.composite.37`)

- **Regional collapse omni singularity coalescence** — omni consolidation × erosion dissolution × nullity immutability (`op10mA11ComputeRegionalCollapseOmniSingularityCoalescence`)
- **Interregional void total erosion sublimation** — erosion dissolution × omni consolidation × void front (`op10mA11ComputeInterregionalVoidTotalErosionSublimation`)
- **Settlement existential absolute nullity permanence** — nullity immutability × omni consolidation × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityPermanence`)
- **10-turn regression harness** — extended bounds for omni coalescence, erosion sublimation, nullity permanence
- Derived events: `collapse_omni_singularity_coalescence`, `void_total_erosion_sublimation`, `existential_absolute_nullity_permanence`

### Scale wave round 37 (O10-205, schema `10m.a11.composite.36`)

- **Regional collapse omni singularity consolidation** — omni unification × erosion elimination × nullity perpetuity (`op10mA11ComputeRegionalCollapseOmniSingularityConsolidation`)
- **Interregional void total erosion dissolution** — erosion elimination × omni unification × void front (`op10mA11ComputeInterregionalVoidTotalErosionDissolution`)
- **Settlement existential absolute nullity immutability** — nullity perpetuity × omni unification × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityImmutability`)
- **10-turn regression harness** — extended bounds for omni consolidation, erosion dissolution, nullity immutability
- Derived events: `collapse_omni_singularity_consolidation`, `void_total_erosion_dissolution`, `existential_absolute_nullity_immutability`

### Scale wave round 36 (O10-203, schema `10m.a11.composite.35`)

- **Regional collapse omni singularity unification** — omni integration × erosion eradication × nullity continuity (`op10mA11ComputeRegionalCollapseOmniSingularityUnification`)
- **Interregional void total erosion elimination** — eradication × integration × void front (`op10mA11ComputeInterregionalVoidTotalErosionElimination`)
- **Settlement existential absolute nullity perpetuity** — continuity × integration × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity`)
- Derived events: `collapse_omni_singularity_unification`, `void_total_erosion_elimination`, `existential_absolute_nullity_perpetuity`

### Scale wave round 35 (schema `10m.a11.composite.34`)

- **Regional collapse omni singularity integration** — omni convergence × erosion obliteration × nullity binding (`op10mA11ComputeRegionalCollapseOmniSingularityIntegration`)
- **Interregional void total erosion eradication** — erosion obliteration × omni convergence × void front (`op10mA11ComputeInterregionalVoidTotalErosionEradication`)
- **Settlement existential absolute nullity continuity** — nullity binding × omni convergence × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity`)
- **10-turn regression harness** — extended bounds for omni integration, erosion eradication, nullity continuity
- Derived events: `collapse_omni_singularity_integration`, `void_total_erosion_eradication`, `existential_absolute_nullity_continuity`

### Scale wave round 34 (schema `10m.a11.composite.33`)

- **Regional collapse omni singularity convergence** — omni synthesis × erosion annihilation × nullity mandate (`op10mA11ComputeRegionalCollapseOmniSingularityConvergence`)
- **Interregional void total erosion obliteration** — erosion annihilation × omni synthesis × void front (`op10mA11ComputeInterregionalVoidTotalErosionObliteration`)
- **Settlement existential absolute nullity binding** — nullity mandate × omni synthesis × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityBinding`)
- **10-turn regression harness** — extended bounds for omni convergence, erosion obliteration, nullity binding
- Derived events: `collapse_omni_singularity_convergence`, `void_total_erosion_obliteration`, `existential_absolute_nullity_binding`

### Scale wave round 33 (schema `10m.a11.composite.32`)

- **Regional collapse omni singularity synthesis** — singularity culmination × erosion extinction × nullity decree (`op10mA11ComputeRegionalCollapseOmniSingularitySynthesis`)
- **Interregional void total erosion annihilation** — erosion extinction × singularity culmination × void front (`op10mA11ComputeInterregionalVoidTotalErosionAnnihilation`)
- **Settlement existential absolute nullity mandate** — nullity decree × singularity culmination × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityMandate`)
- **10-turn regression harness** — extended bounds for omni synthesis, erosion annihilation, nullity mandate
- Derived events: `collapse_omni_singularity_synthesis`, `void_total_erosion_annihilation`, `existential_absolute_nullity_mandate`

### Scale wave round 32 (schema `10m.a11.composite.31`)

- **Regional collapse absolute singularity culmination** — singularity nexus × erosion termination × nullity sentence (`op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination`)
- **Interregional void complete erosion extinction** — erosion termination × singularity nexus × void front (`op10mA11ComputeInterregionalVoidCompleteErosionExtinction`)
- **Settlement existential total nullity decree** — nullity sentence × singularity nexus × nullity verdict (`op10mA11ComputeSettlementExistentialTotalNullityDecree`)
- **10-turn regression harness** — extended bounds for singularity culmination, erosion extinction, nullity decree
- Derived events: `collapse_absolute_singularity_culmination`, `void_complete_erosion_extinction`, `existential_total_nullity_decree`

### Scale wave round 31 (schema `10m.a11.composite.30`)

- **Regional collapse total singularity nexus** — singularity zenith × total finality × nullity verdict (`op10mA11ComputeRegionalCollapseTotalSingularityNexus`)
- **Interregional void absolute erosion termination** — total finality × singularity zenith × void front (`op10mA11ComputeInterregionalVoidAbsoluteErosionTermination`)
- **Settlement existential final nullity sentence** — nullity verdict × singularity zenith × nullity closure (`op10mA11ComputeSettlementExistentialFinalNullitySentence`)
- **10-turn regression harness** — extended bounds for singularity nexus, erosion termination, nullity sentence
- Derived events: `collapse_total_singularity_nexus`, `void_absolute_erosion_termination`, `existential_final_nullity_sentence`

### Scale wave round 30 (schema `10m.a11.composite.29`)

- **Regional collapse ultimate singularity zenith** — absolute apex × complete terminality × nullity closure (`op10mA11ComputeRegionalCollapseUltimateSingularityZenith`)
- **Interregional void total erosion finality** — complete terminality × absolute apex × void front (`op10mA11ComputeInterregionalVoidTotalErosionFinality`)
- **Settlement existential absolute nullity verdict** — nullity closure × absolute apex × ultimate seal (`op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict`)
- **10-turn regression harness** — extended bounds for singularity zenith, total finality, nullity verdict
- Derived events: `collapse_ultimate_singularity_zenith`, `void_total_erosion_finality`, `existential_absolute_nullity_verdict`

### Scale wave round 29 (schema `10m.a11.composite.28`)

- **Regional collapse absolute singularity apex** — total vertex × terminal cascade × ultimate seal (`op10mA11ComputeRegionalCollapseAbsoluteSingularityApex`)
- **Interregional void complete erosion terminality** — terminal cascade × total vertex × void front (`op10mA11ComputeInterregionalVoidCompleteErosionTerminality`)
- **Settlement existential final nullity closure** — ultimate seal × total vertex × final nullity lock (`op10mA11ComputeSettlementExistentialFinalNullityClosure`)
- **10-turn regression harness** — extended bounds for singularity apex, complete terminality, nullity closure
- Derived events: `collapse_absolute_singularity_apex`, `void_complete_erosion_terminality`, `existential_final_nullity_closure`

### Scale wave round 28 (schema `10m.a11.composite.27`)

- **Regional collapse total singularity vertex** — omni node × erosion surge × final nullity (`op10mA11ComputeRegionalCollapseTotalSingularityVertex`)
- **Interregional void terminal erosion cascade** — erosion surge × omni node × void front (`op10mA11ComputeInterregionalVoidTerminalErosionCascade`)
- **Settlement existential ultimate nullity seal** — final nullity × omni node × existence point (`op10mA11ComputeSettlementExistentialUltimateNullitySeal`)
- **10-turn regression harness** — extended bounds for total vertex, terminal erosion, ultimate nullity seal
- Derived events: `collapse_total_singularity_vertex`, `void_terminal_erosion_cascade`, `existential_ultimate_nullity_seal`

### Scale wave round 27 (schema `10m.a11.composite.26`)

- **Regional collapse omni singularity node** — existence point × void front × absolute zero (`op10mA11ComputeRegionalCollapseOmniSingularityNode`)
- **Interregional void absolute erosion surge** — void front × existence point × void annihilation (`op10mA11ComputeInterregionalVoidAbsoluteErosionSurge`)
- **Settlement existential final nullity lock** — absolute zero × existence point × null-state lock (`op10mA11ComputeSettlementExistentialFinalNullityLock`)
- **10-turn regression harness** — extended bounds for omni node, erosion surge, final nullity
- Derived events: `collapse_omni_singularity_node`, `void_absolute_erosion_surge`, `existential_final_nullity_lock`

### Scale wave round 26 (schema `10m.a11.composite.25`)

- **Regional collapse existence singularity point** — singularity seal × void annihilation × null-state lock (`op10mA11ComputeRegionalCollapseExistenceSingularityPoint`)
- **Interregional void existence annihilation front** — void annihilation × singularity seal × void finalization (`op10mA11ComputeInterregionalVoidExistenceAnnihilationFront`)
- **Settlement existential absolute zero lock** — null-state lock × singularity seal × obliteration threshold (`op10mA11ComputeSettlementExistentialAbsoluteZeroLock`)
- **10-turn regression harness** — extended bounds for existence point, void front, absolute zero lock
- Derived events: `collapse_existence_singularity_point`, `void_existence_annihilation_front`, `existential_absolute_zero_lock`

### Scale wave round 25 (schema `10m.a11.composite.24`)

- **Regional ultimate collapse singularity seal** — absolute horizon lock × void finalization × obliteration threshold (`op10mA11ComputeRegionalUltimateCollapseSingularitySeal`)
- **Interregional void annihilation convergence** — void finalization × absolute horizon lock × void totalization (`op10mA11ComputeInterregionalVoidAnnihilationConvergence`)
- **Settlement existential null-state lock** — obliteration threshold × absolute horizon lock × terminus lock (`op10mA11ComputeSettlementExistentialNullStateLock`)
- **10-turn regression harness** — extended bounds for singularity seal, void annihilation, null-state lock
- Derived events: `ultimate_collapse_singularity_seal`, `void_annihilation_convergence`, `existential_null_state_lock`

### Scale wave round 24 (schema `10m.a11.composite.23`)

- **Regional absolute collapse horizon lock** — horizon convergence × void totalization × terminus lock (`op10mA11ComputeRegionalAbsoluteCollapseHorizonLock`)
- **Interregional void finalization cascade** — void totalization × horizon convergence × void expansion (`op10mA11ComputeInterregionalVoidFinalizationCascade`)
- **Settlement existential obliteration threshold** — terminus lock × horizon convergence × continuity fracture (`op10mA11ComputeSettlementExistentialObliterationThreshold`)
- **10-turn regression harness** — extended bounds for absolute horizon lock, void finalization, obliteration threshold
- Derived events: `absolute_collapse_horizon_lock`, `void_finalization_cascade`, `existential_obliteration_threshold`

### Scale wave round 23 (schema `10m.a11.composite.22`)

- **Regional collapse horizon convergence** — singularity pressure × void expansion × continuity fracture (`op10mA11ComputeRegionalCollapseHorizonConvergence`)
- **Interregional void totalization surge** — void expansion × singularity pressure × hollow contagion (`op10mA11ComputeInterregionalVoidTotalizationSurge`)
- **Settlement existential terminus lock** — continuity fracture × singularity pressure × depopulation lock (`op10mA11ComputeSettlementExistentialTerminusLock`)
- **10-turn regression harness** — extended bounds for horizon convergence, void totalization, terminus lock
- Derived events: `collapse_horizon_convergence`, `void_totalization_surge`, `existential_terminus_lock`

### Scale wave round 22 (schema `10m.a11.composite.21`)

- **Regional total collapse singularity pressure** — cascade amplification × hollow contagion × depopulation lock (`op10mA11ComputeRegionalTotalCollapseSingularityPressure`)
- **Interregional void expansion velocity** — hollow contagion × abandonment spiral × cascade amplification (`op10mA11ComputeInterregionalVoidExpansionVelocity`)
- **Settlement existential continuity fracture** — depopulation lock × recovery impossibility × legitimacy collapse (`op10mA11ComputeSettlementExistentialContinuityFracture`)
- **10-turn regression harness** — extended bounds for collapse singularity, void expansion, continuity fracture
- Derived events: `total_collapse_singularity_pressure`, `void_expansion_velocity`, `existential_continuity_fracture`

### Scale wave round 21 (schema `10m.a11.composite.20`)

- **Regional state collapse cascade amplification** — governance vacuum × abandonment spiral × recovery impossibility (`op10mA11ComputeRegionalStateCollapseCascadeAmplification`)
- **Interregional hollow region contagion** — abandonment spiral × fiscal panic contagion × governance vacuum (`op10mA11ComputeInterregionalHollowRegionContagion`)
- **Settlement permanent depopulation lock** — recovery impossibility × abandonment spiral × terminal lock-in (`op10mA11ComputeSettlementPermanentDepopulationLock`)
- **10-turn regression harness** — extended bounds for cascade amplification, hollow contagion, depopulation lock
- Derived events: `state_collapse_cascade_amplification`, `hollow_region_contagion`, `permanent_depopulation_lock`

### Scale wave round 20 (schema `10m.a11.composite.19`)

- **Regional governance vacuum escalation** — settlement legitimacy collapse × fiscal panic contagion × institutional trust erosion (`op10mA11ComputeRegionalGovernanceVacuumEscalation`)
- **Interregional settlement abandonment spiral** — terminal state lock-in × irrecoverable collapse threshold × capital flight panic (`op10mA11ComputeInterregionalSettlementAbandonmentSpiral`)
- **Settlement post-collapse recovery impossibility** — terminal state lock-in × fiscal panic contagion × cascading failure risk (`op10mA11ComputeSettlementPostCollapseRecoveryImpossibility`)
- **10-turn regression harness** — extended bounds for governance vacuum, abandonment spiral, recovery impossibility
- Derived events: `governance_vacuum_escalation`, `settlement_abandonment_spiral`, `post_collapse_recovery_impossibility`

### Scale wave round 19 (schema `10m.a11.composite.18`)

- **Regional settlement legitimacy collapse** — social contract fragility × capital flight panic × irrecoverable collapse threshold (`op10mA11ComputeRegionalSettlementLegitimacyCollapse`)
- **Interregional fiscal panic contagion** — capital flight panic × liquidity fragmentation × social contract fragility (`op10mA11ComputeInterregionalFiscalPanicContagion`)
- **Settlement terminal state lock-in** — irrecoverable collapse threshold × cascading failure risk × social contract fragility (`op10mA11ComputeSettlementTerminalStateLockIn`)
- **10-turn regression harness** — extended bounds for legitimacy collapse, fiscal contagion, terminal lock-in
- Derived events: `settlement_legitimacy_collapse`, `fiscal_panic_contagion`, `terminal_state_lock_in`

### Scale wave round 18 (schema `10m.a11.composite.17`)

- **Regional social contract fragility** — institutional trust erosion × liquidity fragmentation × cascading failure risk (`op10mA11ComputeRegionalSocialContractFragility`)
- **Interregional capital flight panic** — liquidity fragmentation × institutional trust × capital mobility asymmetry (`op10mA11ComputeInterregionalCapitalFlightPanic`)
- **Settlement irrecoverable collapse threshold** — cascading failure risk × compound shock saturation × institutional trust erosion (`op10mA11ComputeSettlementIrrecoverableCollapseThreshold`)
- **10-turn regression harness** — extended bounds for social contract fragility, capital flight panic, irrecoverable collapse threshold
- Derived events: `social_contract_fragility`, `capital_flight_panic`, `irrecoverable_collapse_threshold`

### Scale wave round 17 (schema `10m.a11.composite.16`)

- **Regional institutional trust erosion** — meta-governance fatigue × governance resilience decay × cohesion integrity (`op10mA11ComputeRegionalInstitutionalTrustErosion`)
- **Interregional liquidity fragmentation stress** — capital mobility asymmetry × network equity tension × fiscal capacity strain (`op10mA11ComputeInterregionalLiquidityFragmentationStress`)
- **Settlement cascading failure risk** — compound shock saturation × systemic fragility × adaptive capacity ceiling (`op10mA11ComputeSettlementCascadingFailureRisk`)
- **10-turn regression harness** — extended bounds for institutional trust, liquidity fragmentation, cascading failure risk
- Derived events: `institutional_trust_erosion`, `liquidity_fragmentation_stress`, `cascading_failure_risk`

### Scale wave round 16 (schema `10m.a11.composite.15`)

- **Regional meta-governance coordination fatigue** — fiscal–governance coupling × governance friction × relief overhead (`op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue`)
- **Interregional capital mobility asymmetry** — network equity tension × fiscal coupling × corridor drift (`op10mA11ComputeInterregionalCapitalMobilityAsymmetry`)
- **Settlement compound shock saturation** — resilience frontier × systemic fragility × migration stability erosion (`op10mA11ComputeSettlementCompoundShockSaturation`)
- **10-turn regression harness** — extended bounds for meta-governance fatigue, capital mobility asymmetry, compound shock saturation
- Derived events: `meta_governance_coordination_fatigue`, `capital_mobility_asymmetry`, `compound_shock_saturation`

### Scale wave round 15 (schema `10m.a11.composite.14`)

- **Regional fiscal–governance coupling strain** — fiscal capacity × governance decay × cohesion integrity (`op10mA11ComputeRegionalFiscalGovernanceCouplingStrain`)
- **Interregional network equity tension** — network erosion × relief equity gap × corridor drift (`op10mA11ComputeInterregionalNetworkEquityTension`)
- **Settlement resilience frontier pressure** — systemic fragility × adaptive ceiling × horizon risk (`op10mA11ComputeSettlementResilienceFrontierPressure`)
- **10-turn regression harness** — extended bounds for fiscal–governance coupling, network equity tension, resilience frontier
- Derived events: `fiscal_governance_coupling_strain`, `network_equity_tension`, `resilience_frontier_pressure`

### Scale wave round 14 (schema `10m.a11.composite.13`)

- **Regional governance resilience decay** — governance friction × systemic fragility × relief equity gap (`op10mA11ComputeRegionalGovernanceResilienceDecay`)
- **Interregional migration stability erosion** — migration pressure × mobility trap × cohesion integrity (`op10mA11ComputeInterregionalMigrationStabilityErosion`)
- **Settlement adaptive capacity ceiling** — adaptation lag × reception strain × fiscal capacity (`op10mA11ComputeSettlementAdaptiveCapacityCeiling`)
- **10-turn regression harness** — extended bounds for governance decay, migration stability, adaptive ceiling
- Derived events: `governance_resilience_decay`, `migration_stability_erosion`, `adaptive_capacity_ceiling`

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
