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
