import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHUNK = path.join(ROOT, 'chunk.tsx');

const REQUIRED_EXPORTS = [
  'computeIndustrialEnergyEnvironmentalState',
  'runV1014IndustrialEnergyEnvironmentalSelfTests',
  'V1014_INDUSTRIAL_ENERGY_AGENT',
  'V1014_STORAGE_FLEXIBILITY_CATALOG',
  'V1014_EMISSIONS_CREDIT_CATALOG',
  'V1014_BIODIVERSITY_OFFSET_CATALOG',
  'V1014_CIRCULAR_RECOVERY_CATALOG',
  'V1014_HYDROGEN_PATHWAY_CATALOG',
  'V1014_CRITICAL_MINERALS_CATALOG',
  'V1014_OFFSHORE_MARINE_CATALOG',
  'V1014_DEMAND_RESPONSE_CATALOG',
  'V1014_CCS_HUB_CATALOG',
  'V1014_GRID_FIRMING_CATALOG',
  'V1014_REZ_TRANSMISSION_CATALOG',
  'V1014_BUSHFIRE_RESILIENCE_CATALOG',
  'V1014_ROOFTOP_DER_CATALOG',
  'V1014_EV_V2G_CATALOG',
  'V1014_AGRIVOLTAICS_CATALOG',
  'V1014_SOIL_CARBON_LAND_CATALOG',
  'V1014_GEOTHERMAL_CATALOG',
  'V1014_INDUSTRIAL_HEAT_DECARB_CATALOG',
  'V1014_BLUE_CARBON_COASTAL_CATALOG',
  'V1014_SHORE_MARINE_ENERGY_CATALOG',
  'V1014_LANDFILL_WASTE_ENERGY_CATALOG',
  'V1014_DISTRICT_RENEWABLE_HEAT_CATALOG',
  'V1014_DROUGHT_DESAL_CATALOG',
  'V1014_WATER_ENERGY_NEXUS_CATALOG',
  'V1014_SUSTAINABLE_FEEDSTOCK_CATALOG',
  'V1014_BIOENERGY_GRID_FLEX_CATALOG',
  'V1014_PUMPED_HYDRO_EXPANSION_CATALOG',
  'V1014_SEASONAL_ARBITRAGE_CATALOG',
  'V1014_COMMUNITY_MICROGRID_CATALOG',
  'V1014_VPP_ORCHESTRATION_CATALOG',
  'V1014_CSP_MOLTEN_SALT_CATALOG',
  'V1014_THERMAL_STORAGE_DISPATCH_CATALOG',
  'V1014_GRID_FORMING_INVERTER_CATALOG',
  'V1014_SYNTHETIC_INERTIA_CATALOG',
  'V1014_BATTERY_RECYCLING_CATALOG',
  'V1014_SECOND_LIFE_STORAGE_CATALOG',
  'V1014_CURTAILMENT_RECOVERY_CATALOG',
  'V1014_FLEXIBLE_LOAD_ORCHESTRATION_CATALOG',
  'V1014_ZERO_CARBON_PRECINCT_CATALOG',
  'V1014_EMBEDDED_NETWORK_CATALOG',
  'runAgent13StoragePermitScaleSelfTests',
  'runAgent13EmissionsWaterScaleSelfTests',
  'runAgent13BiodiversityCircularScaleSelfTests',
  'runAgent13HydrogenMineralsScaleSelfTests',
  'runAgent13HydrogenMineralsTurnScenario',
  'V1014_HYDROGEN_MINERALS_TURN_SCENARIOS',
  'runAgent13OffshoreDemandScaleSelfTests',
  'runAgent13OffshoreDemandTurnScenario',
  'V1014_OFFSHORE_DEMAND_TURN_SCENARIOS',
  'runAgent13CcsFirmingScaleSelfTests',
  'runAgent13CcsFirmingTurnScenario',
  'V1014_CCS_FIRMING_TURN_SCENARIOS',
  'runAgent13RezBushfireScaleSelfTests',
  'runAgent13RezBushfireTurnScenario',
  'V1014_REZ_BUSHFIRE_TURN_SCENARIOS',
  'runAgent13DerV2gScaleSelfTests',
  'runAgent13DerV2gTurnScenario',
  'V1014_DER_V2G_TURN_SCENARIOS',
  'runAgent13AgriSoilScaleSelfTests',
  'runAgent13AgriSoilTurnScenario',
  'V1014_AGRI_SOIL_TURN_SCENARIOS',
  'runAgent13GeoHeatScaleSelfTests',
  'runAgent13GeoHeatTurnScenario',
  'V1014_GEO_HEAT_TURN_SCENARIOS',
  'runAgent13BlueShoreScaleSelfTests',
  'runAgent13BlueShoreTurnScenario',
  'V1014_BLUE_SHORE_TURN_SCENARIOS',
  'runAgent13LandfillDistrictScaleSelfTests',
  'runAgent13LandfillDistrictTurnScenario',
  'V1014_LANDFILL_DISTRICT_TURN_SCENARIOS',
  'runAgent13DesalNexusScaleSelfTests',
  'runAgent13DesalNexusTurnScenario',
  'V1014_DESAL_NEXUS_TURN_SCENARIOS',
  'runAgent13BioenergyFeedstockScaleSelfTests',
  'runAgent13BioenergyFeedstockTurnScenario',
  'V1014_BIOENERGY_FEEDSTOCK_TURN_SCENARIOS',
  'runAgent13PumpedHydroSeasonalScaleSelfTests',
  'runAgent13PumpedHydroSeasonalTurnScenario',
  'V1014_PUMPED_HYDRO_SEASONAL_TURN_SCENARIOS',
  'runAgent13MicrogridVppScaleSelfTests',
  'runAgent13MicrogridVppTurnScenario',
  'V1014_MICROGRID_VPP_TURN_SCENARIOS',
  'runAgent13CspThermalScaleSelfTests',
  'runAgent13CspThermalTurnScenario',
  'V1014_CSP_THERMAL_TURN_SCENARIOS',
  'runAgent13GridInertiaScaleSelfTests',
  'runAgent13GridInertiaTurnScenario',
  'V1014_GRID_INERTIA_TURN_SCENARIOS',
  'runAgent13BatterySecondLifeScaleSelfTests',
  'runAgent13BatterySecondLifeTurnScenario',
  'V1014_BATTERY_SECOND_LIFE_TURN_SCENARIOS',
  'runAgent13CurtailmentFlexScaleSelfTests',
  'runAgent13CurtailmentFlexTurnScenario',
  'V1014_CURTAILMENT_FLEX_TURN_SCENARIOS',
  'runAgent13PrecinctEmbeddedScaleSelfTests',
  'runAgent13PrecinctEmbeddedTurnScenario',
  'V1014_PRECINCT_EMBEDDED_TURN_SCENARIOS',
  'executeAgent13IndustrialEnergyTurnHook',
  'V1014_INTERREGIONAL_GRID_LINKS',
  'V1014_REGIONAL_GRID_SCENARIOS',
  'runAgent13TurnSimulationDepthSelfTests',
  'OP10M_MODULE_BEGIN agent-13-energy',
  'OP10M_MODULE_END agent-13-energy',
];

export function runAgent13ChunkManifestTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(fs.existsSync(CHUNK));
  const text = fs.readFileSync(CHUNK, 'utf8');
  ok(!/^import\s/m.test(text));
  ok(!/from '\.\//.test(text));
  for (const sym of REQUIRED_EXPORTS) {
    ok(text.includes(sym));
  }
  ok(text.indexOf('OP10M_MODULE_BEGIN agent-13-energy') < text.indexOf('OP10M_MODULE_END agent-13-energy'));
  ok(text.includes('content-sha256:'));

  return { passed, failed, total: passed + failed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = runAgent13ChunkManifestTests();
  console.log(`Agent 13 chunk manifest tests: ${r.passed}/${r.total} passed`);
  if (r.failed) process.exit(1);
}
