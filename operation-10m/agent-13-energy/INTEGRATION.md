# Agent 13 integration — Industrial energy & environment

## Target section

`(V9.4) australia-game-with-ai.tsx` → **SECTION 20AL** (before SECTION 20AP).

## Source tree

```
operation-10m/agent-13-energy/
  chunk.tsx                                  # Agent 25 bundle (OP10M_MODULE_BEGIN/END)
  scripts/bundle-chunk.mjs                   # regenerates chunk.tsx from modules/
  modules/industrial-energy-environmental.tsx  # primary inline block
  modules/grid-coupling.ts
  modules/grid-recovery-extraction-efficiency.ts
  modules/regional-grid-scenarios-climate-transition.ts
  modules/turn-simulation-depth.ts
  modules/storage-permit-lifecycle.ts
  modules/emissions-water-credit-ledger.ts   # scale wave round 4
  modules/biodiversity-circular-recovery-ledger.ts  # scale wave round 5
  modules/hydrogen-critical-minerals-ledger.ts      # scale wave round 6
  modules/offshore-marine-demand-response-ledger.ts # scale wave round 7
  modules/carbon-capture-grid-firming-ledger.ts     # scale wave round 8
  modules/bioenergy-sustainable-feedstock-ledger.ts # scale wave round 16
  modules/pumped-hydro-seasonal-storage-ledger.ts   # scale wave round 17
  modules/community-microgrid-vpp-orchestration-ledger.ts  # scale wave round 18
  modules/csp-molten-salt-thermal-dispatch-ledger.ts  # scale wave round 19
  modules/grid-forming-inertia-orchestration-ledger.ts  # scale wave round 20
  modules/battery-recycling-second-life-storage-ledger.ts  # scale wave round 21
  modules/curtailment-recovery-flex-load-ledger.ts  # scale wave round 22
  modules/precinct-zero-carbon-embedded-network-ledger.ts  # scale wave round 23
  modules/transmission-congestion-merchant-storage-ledger.ts  # scale wave round 24
  modules/nature-positive-siting-biodiversity-coexistence-ledger.ts  # scale wave round 25
  modules/climate-adaptation-flood-heat-resilience-ledger.ts  # scale wave round 26 (O10-183)
  modules/industrial-symbiosis-waste-heat-recovery-ledger.ts  # scale wave round 27 (O10-185)
  modules/green-hydrogen-export-electrolyser-hub-ledger.ts  # scale wave round 28 (O10-187)
  modules/critical-minerals-circular-battery-supply-ledger.ts  # scale wave round 29 (O10-189)
  modules/offshore-shore-port-green-corridor-ledger.ts  # scale wave round 30 (O10-191)
  modules/national-decarbon-federation-relief-arbitration-ledger.ts  # scale wave round 31 (O10-193)
  modules/net-zero-pathway-export-carbon-intensity-ledger.ts  # scale wave round 32 (O10-195)
  modules/climate-hazards.ts
  modules/household-industry-links.ts
  modules/v94-type-stubs.ts                    # drop on merge
```

## Exports (wire in V9.4 turn pipeline)

- `computeIndustrialEnergyEnvironmentalState`
- `buildIndustrialEnergyEnvironmentalInputs`
- `buildIndustrialEnergyIndustryModifiers` / `mergeIndustryModifiers`
- `sanitizeIndustrialEnergyEnvironmentalPersisted` / `createInitialIndustrialEnergyEnvironmentalPersisted`
- `runV1014IndustrialEnergyEnvironmentalSelfTests`
- `IndustrialEnergyEnvironmentalInspector`
- `advanceIndustrialEnergyEnvironmentalTurn` (turn advance hook)
- `scoreAgent13EnergyEnvironmentGIAlignment` (GI ranking metadata)
- `executeAgent13IndustrialEnergyTurnHook` / `V1014_INTERREGIONAL_GRID_LINKS` / `V1014_ENERGY_TURN_SCENARIOS`
- Catalogs: `V1014_EXTRACTION_SITES`, `V1014_RENEWABLE_ASSETS`, `V1014_ENVIRONMENTAL_RULES`, `V1014_INDUSTRY_COUPLING`

## Game settings / persistence

- Setting: `industrialEnergyEnabled` (default true)
- Persisted key: `gameState.industrialEnergy`
- Round 4 slices: `regionalCarbonMemory`, `regionalWaterMemory` (with round 3 `regionalPermitMemory`)
- Round 5 slices: `regionalBiodiversityMemory`, `regionalCircularMemory`
- Round 6 slices: `regionalHydrogenMemory`, `regionalMineralsMemory`
- Round 7 slices: `regionalOffshoreMemory`, `regionalDemandResponseMemory`
- Round 8 slices: `regionalCcsMemory`, `regionalFirmingMemory`
- Round 17 slices: `regionalPumpedHydroMemory`, `regionalSeasonalArbitrageMemory` (with round 16 `regionalFeedstockMemory`, `regionalBioFlexMemory`)
- Round 18 slices: `regionalMicrogridMemory`, `regionalVppMemory`
- Round 19 slices: `regionalCspMemory`, `regionalThermalDispatchMemory`
- Round 20 slices: `regionalGridFormingMemory`, `regionalSyntheticInertiaMemory`
- Round 21 slices: `regionalBatteryRecyclingMemory`, `regionalSecondLifeMemory`
- Round 22 slices: `regionalCurtailmentMemory`, `regionalFlexLoadMemory`
- Round 23 slices: `regionalZeroCarbonPrecinctMemory`, `regionalEmbeddedNetworkMemory`
- Round 24 slices: `regionalTransmissionCongestionMemory`, `regionalMerchantStorageMemory`
- Round 25 slices: `regionalNaturePositiveSitingMemory`, `regionalBiodiversityCoexistenceMemory`
- Round 26 slices: `regionalClimateAdaptationHardeningMemory`, `regionalFloodHeatResilienceMemory`
- Round 27 slices: `regionalIndustrialSymbiosisMemory`, `regionalWasteHeatRecoveryMemory`
- Round 28 slices: `regionalGreenHydrogenExportMemory`, `regionalElectrolyserHubMemory`
- Round 29 slices: `regionalMineralsCircularRecoveryMemory`, `regionalBatterySupplyChainMemory`
- Round 30 slices: `regionalOffshoreShoreElectrificationMemory`, `regionalPortGreenCorridorMemory`
- Round 31 slices: `regionalDecarbonFederationMemory`, `regionalReliefArbitrationMemory`
- Round 32 slices: `regionalNetZeroPathwayMemory`, `regionalExportCarbonIntensityMemory`
- Regression id: `v1014_energy` → `runV1014IndustrialEnergyEnvironmentalSelfTests()`

## Boundaries

- Does **not** mutate canonical prices, wallets, AP, or V10.1 industry formulas.
- Supplies bounded `IndustriesInputs.modifiers` and diagnostic state.
- Household hints are **metadata only** (V10.13 remains authoritative).

## Agent id constant

`V1014_INDUSTRIAL_ENERGY_AGENT = 'op10m/agent-13-energy'`

## Agent 25 chunk

Regenerate before merge:

```bash
npm run build:agent-13-chunk
```

Output: `chunk.tsx` wrapped with `// OP10M_MODULE_BEGIN agent-13-energy` … `// OP10M_MODULE_END agent-13-energy`. No `import` lines; `React.useState` for inspector UI.
