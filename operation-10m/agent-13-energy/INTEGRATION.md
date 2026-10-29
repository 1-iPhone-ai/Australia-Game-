# Agent 13 integration — Industrial energy & environment

## Target section

`(V9.4) australia-game-with-ai.tsx` → **SECTION 20AL** (before SECTION 20AP).

## Source tree

```
operation-10m/agent-13-energy/
  modules/industrial-energy-environmental.tsx  # primary inline block
  modules/grid-coupling.ts
  modules/grid-recovery-extraction-efficiency.ts
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
- Catalogs: `V1014_EXTRACTION_SITES`, `V1014_RENEWABLE_ASSETS`, `V1014_ENVIRONMENTAL_RULES`, `V1014_INDUSTRY_COUPLING`

## Game settings / persistence

- Setting: `industrialEnergyEnabled` (default true)
- Persisted key: `gameState.industrialEnergy`
- Regression id: `v1014_energy` → `runV1014IndustrialEnergyEnvironmentalSelfTests()`

## Boundaries

- Does **not** mutate canonical prices, wallets, AP, or V10.1 industry formulas.
- Supplies bounded `IndustriesInputs.modifiers` and diagnostic state.
- Household hints are **metadata only** (V10.13 remains authoritative).

## Agent id constant

`V1014_INDUSTRIAL_ENERGY_AGENT = 'op10m/agent-13-energy'`
