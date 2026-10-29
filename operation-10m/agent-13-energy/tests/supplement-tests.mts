import assert from 'node:assert/strict';
import {
  V1014_CLIMATE_HAZARD_CATALOG,
  aggregateClimatePressure,
  detectClimateHazardsFromCrises,
} from '../modules/climate-hazards.ts';
import { computeRegionalGridStress } from '../modules/grid-coupling.ts';
import {
  computeRegionalExtractionEfficiency,
  computeRegionalGridRecovery,
} from '../modules/grid-recovery-extraction-efficiency.ts';
import { runV1014RegionalGridClimateScaleSelfTests } from '../modules/regional-grid-scenarios-climate-transition.ts';
import { runAgent13StoragePermitScaleSelfTests } from '../modules/storage-permit-lifecycle.ts';
import { runAgent13EmissionsWaterScaleSelfTests } from '../modules/emissions-water-credit-ledger.ts';
import { runAgent13BiodiversityCircularScaleSelfTests } from '../modules/biodiversity-circular-recovery-ledger.ts';
import { runAgent13HydrogenMineralsScaleSelfTests, runAgent13HydrogenMineralsTurnScenario, V1014_HYDROGEN_MINERALS_TURN_SCENARIOS } from '../modules/hydrogen-critical-minerals-ledger.ts';
import {
  runAgent13OffshoreDemandScaleSelfTests,
  runAgent13OffshoreDemandTurnScenario,
  V1014_OFFSHORE_DEMAND_TURN_SCENARIOS,
} from '../modules/offshore-marine-demand-response-ledger.ts';
import {
  runAgent13CcsFirmingScaleSelfTests,
  runAgent13CcsFirmingTurnScenario,
  V1014_CCS_FIRMING_TURN_SCENARIOS,
} from '../modules/carbon-capture-grid-firming-ledger.ts';
import {
  runAgent13RezBushfireScaleSelfTests,
  runAgent13RezBushfireTurnScenario,
  V1014_REZ_BUSHFIRE_TURN_SCENARIOS,
} from '../modules/rez-transmission-bushfire-resilience-ledger.ts';
import {
  runAgent13DerV2gScaleSelfTests,
  runAgent13DerV2gTurnScenario,
  V1014_DER_V2G_TURN_SCENARIOS,
} from '../modules/distributed-rooftop-ev-v2g-ledger.ts';
import {
  runAgent13AgriSoilScaleSelfTests,
  runAgent13AgriSoilTurnScenario,
  V1014_AGRI_SOIL_TURN_SCENARIOS,
} from '../modules/agrivoltaics-soil-carbon-land-ledger.ts';
import {
  runAgent13GeoHeatScaleSelfTests,
  runAgent13GeoHeatTurnScenario,
  V1014_GEO_HEAT_TURN_SCENARIOS,
} from '../modules/geothermal-industrial-heat-ledger.ts';
import {
  runAgent13BlueShoreScaleSelfTests,
  runAgent13BlueShoreTurnScenario,
  V1014_BLUE_SHORE_TURN_SCENARIOS,
} from '../modules/coastal-blue-carbon-shore-energy-ledger.ts';
import {
  runAgent13LandfillDistrictScaleSelfTests,
  runAgent13LandfillDistrictTurnScenario,
  V1014_LANDFILL_DISTRICT_TURN_SCENARIOS,
} from '../modules/landfill-waste-district-heat-ledger.ts';
import {
  runAgent13DesalNexusScaleSelfTests,
  runAgent13DesalNexusTurnScenario,
  V1014_DESAL_NEXUS_TURN_SCENARIOS,
} from '../modules/drought-desal-water-energy-ledger.ts';
import {
  runAgent13BioenergyFeedstockScaleSelfTests,
  runAgent13BioenergyFeedstockTurnScenario,
  V1014_BIOENERGY_FEEDSTOCK_TURN_SCENARIOS,
} from '../modules/bioenergy-sustainable-feedstock-ledger.ts';
import {
  runAgent13PumpedHydroSeasonalScaleSelfTests,
  runAgent13PumpedHydroSeasonalTurnScenario,
  V1014_PUMPED_HYDRO_SEASONAL_TURN_SCENARIOS,
} from '../modules/pumped-hydro-seasonal-storage-ledger.ts';
import {
  runAgent13MicrogridVppScaleSelfTests,
  runAgent13MicrogridVppTurnScenario,
  V1014_MICROGRID_VPP_TURN_SCENARIOS,
} from '../modules/community-microgrid-vpp-orchestration-ledger.ts';
import {
  runAgent13CspThermalScaleSelfTests,
  runAgent13CspThermalTurnScenario,
  V1014_CSP_THERMAL_TURN_SCENARIOS,
} from '../modules/csp-molten-salt-thermal-dispatch-ledger.ts';
import {
  runAgent13GridInertiaScaleSelfTests,
  runAgent13GridInertiaTurnScenario,
  V1014_GRID_INERTIA_TURN_SCENARIOS,
} from '../modules/grid-forming-inertia-orchestration-ledger.ts';
import {
  runAgent13BatterySecondLifeScaleSelfTests,
  runAgent13BatterySecondLifeTurnScenario,
  V1014_BATTERY_SECOND_LIFE_TURN_SCENARIOS,
} from '../modules/battery-recycling-second-life-storage-ledger.ts';
import {
  runAgent13CurtailmentFlexScaleSelfTests,
  runAgent13CurtailmentFlexTurnScenario,
  V1014_CURTAILMENT_FLEX_TURN_SCENARIOS,
} from '../modules/curtailment-recovery-flex-load-ledger.ts';
import {
  runAgent13PrecinctEmbeddedScaleSelfTests,
  runAgent13PrecinctEmbeddedTurnScenario,
  V1014_PRECINCT_EMBEDDED_TURN_SCENARIOS,
} from '../modules/precinct-zero-carbon-embedded-network-ledger.ts';
import {
  runAgent13TransmissionMerchantScaleSelfTests,
  runAgent13TransmissionMerchantTurnScenario,
  V1014_TRANSMISSION_MERCHANT_TURN_SCENARIOS,
} from '../modules/transmission-congestion-merchant-storage-ledger.ts';
import {
  runAgent13NatureCoexistenceScaleSelfTests,
  runAgent13NatureCoexistenceTurnScenario,
  V1014_NATURE_COEXISTENCE_TURN_SCENARIOS,
} from '../modules/nature-positive-siting-biodiversity-coexistence-ledger.ts';
import {
  runAgent13EnergyScenarioSimulation,
  runAgent13TurnSimulationDepthSelfTests,
  V1014_ENERGY_TURN_SCENARIOS,
} from '../modules/turn-simulation-depth.ts';
import {
  advanceIndustrialEnergyEnvironmentalTurn,
  createInitialIndustrialEnergyEnvironmentalPersisted,
} from '../modules/industrial-energy-environmental.tsx';
import { buildHouseholdEnergyHints } from '../modules/household-industry-links.ts';

export function runAgent13SupplementTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CLIMATE_HAZARD_CATALOG.length >= 6);
  const hazards = detectClimateHazardsFromCrises(
    [{ id: 'x', status: 'active', category: 'severe flood', affectedRegions: ['QLD'] }],
    'QLD',
  );
  ok(hazards.length === 1 && hazards[0].kind === 'flood');
  ok(aggregateClimatePressure(hazards) >= 10);

  const grid = computeRegionalGridStress(
    'NSW',
    { regions: { NSW: { networks: { energy: { condition: 'bottlenecked', utilization: 0.88 } } } } },
    40,
  );
  ok(grid.band === 'bottlenecked' && grid.stressPoints >= 12);

  const hints = buildHouseholdEnergyHints({
    regionId: 'WA',
    constraintBand: 'critical',
    environmentalPressure: 80,
    extractionBand: 'extreme',
    renewableBand: 'leading',
    energyIndustryModifier: -8,
  });
  ok(hints.length >= 2);
  ok(hints.every(h => Math.abs(h.relevanceDelta) <= 2));

  const recovery = computeRegionalGridRecovery({
    regionId: 'QLD',
    gridStressBand: 'critical',
    gridStressPoints: 20,
    renewableShareScore: 60,
    completedProjectTypes: ['renewable_grid', 'battery_grid'],
  });
  ok(recovery.band !== 'stalled' && recovery.pressureRelief > 0);

  const efficiency = computeRegionalExtractionEfficiency({
    regionId: 'WA',
    sites: [
      {
        environmentalRisk: 'low',
        waterIntensity: 0.2,
        emissionsIntensity: 0.15,
        requiresPermit: true,
        rehabilitationYears: 3,
      },
    ],
    renewableShareScore: 45,
  });
  ok(efficiency.score >= 50 && efficiency.band !== 'poor');

  const scale = runV1014RegionalGridClimateScaleSelfTests();
  ok(scale.failed === 0 && scale.passed >= 5);

  const depth = runAgent13TurnSimulationDepthSelfTests();
  ok(depth.failed === 0 && depth.passed >= 6);

  const scenario = V1014_ENERGY_TURN_SCENARIOS[0];
  let persisted = createInitialIndustrialEnergyEnvironmentalPersisted();
  let prev: ReturnType<typeof advanceIndustrialEnergyEnvironmentalTurn>['state'] | null = null;
  const sim = runAgent13EnergyScenarioSimulation(scenario, step => {
    const out = advanceIndustrialEnergyEnvironmentalTurn({
      turn: step.turn,
      enabled: true,
      gameState: { crises: step.crises },
      gameSettings: { industrialEnergyEnabled: true, nationalSystemsEnabled: true },
      livingRegions: step.livingRegions,
      nationalSystems: (step.nationalSystems as any) || null,
      industries: null,
      regionalFactions: null,
      persisted,
      prev,
    });
    persisted = out.persisted;
    prev = out.state;
    return {
      ok: true,
      turn: step.turn,
      interRegionalFlowCount: out.state.interRegionalFlows.length,
      turnSimulationDigest: out.state.turnSimulationDigest,
      state: {
        turn: out.state.turn,
        inputHash: out.state.inputHash,
        regions: out.state.regions,
        industryModifiers: out.state.industryModifiers,
        national: out.state.national,
        interRegionalFlows: out.state.interRegionalFlows,
        turnSimulationDigest: out.state.turnSimulationDigest,
      },
      persisted: out.persisted,
    };
  });
  ok(sim.passed);

  const storagePermit = runAgent13StoragePermitScaleSelfTests();
  ok(storagePermit.failed === 0 && storagePermit.passed >= 5);

  const emissionsWater = runAgent13EmissionsWaterScaleSelfTests();
  ok(emissionsWater.failed === 0 && emissionsWater.passed >= 5);

  const biodiversityCircular = runAgent13BiodiversityCircularScaleSelfTests();
  ok(biodiversityCircular.failed === 0 && biodiversityCircular.passed >= 5);

  const hydrogenMinerals = runAgent13HydrogenMineralsScaleSelfTests();
  ok(hydrogenMinerals.failed === 0 && hydrogenMinerals.passed >= 7);

  const h2Turn = runAgent13HydrogenMineralsTurnScenario(V1014_HYDROGEN_MINERALS_TURN_SCENARIOS[0]);
  ok(h2Turn.passed);

  const offshoreDemand = runAgent13OffshoreDemandScaleSelfTests();
  ok(offshoreDemand.failed === 0 && offshoreDemand.passed >= 7);

  const offTurn = runAgent13OffshoreDemandTurnScenario(V1014_OFFSHORE_DEMAND_TURN_SCENARIOS[0]);
  ok(offTurn.passed);

  const ccsFirming = runAgent13CcsFirmingScaleSelfTests();
  ok(ccsFirming.failed === 0 && ccsFirming.passed >= 7);

  const ccsTurn = runAgent13CcsFirmingTurnScenario(V1014_CCS_FIRMING_TURN_SCENARIOS[0]);
  ok(ccsTurn.passed);

  const rezBushfire = runAgent13RezBushfireScaleSelfTests();
  ok(rezBushfire.failed === 0 && rezBushfire.passed >= 7);

  const rezTurn = runAgent13RezBushfireTurnScenario(V1014_REZ_BUSHFIRE_TURN_SCENARIOS[0]);
  ok(rezTurn.passed);

  const derV2g = runAgent13DerV2gScaleSelfTests();
  ok(derV2g.failed === 0 && derV2g.passed >= 7);

  const derTurn = runAgent13DerV2gTurnScenario(V1014_DER_V2G_TURN_SCENARIOS[0]);
  ok(derTurn.passed);

  const agriSoil = runAgent13AgriSoilScaleSelfTests();
  ok(agriSoil.failed === 0 && agriSoil.passed >= 7);

  const agriTurn = runAgent13AgriSoilTurnScenario(V1014_AGRI_SOIL_TURN_SCENARIOS[0]);
  ok(agriTurn.passed);

  const geoHeat = runAgent13GeoHeatScaleSelfTests();
  ok(geoHeat.failed === 0 && geoHeat.passed >= 7);

  const geoTurn = runAgent13GeoHeatTurnScenario(V1014_GEO_HEAT_TURN_SCENARIOS[0]);
  ok(geoTurn.passed);

  const blueShore = runAgent13BlueShoreScaleSelfTests();
  ok(blueShore.failed === 0 && blueShore.passed >= 7);

  const blueTurn = runAgent13BlueShoreTurnScenario(V1014_BLUE_SHORE_TURN_SCENARIOS[0]);
  ok(blueTurn.passed);

  const landfillDistrict = runAgent13LandfillDistrictScaleSelfTests();
  ok(landfillDistrict.failed === 0 && landfillDistrict.passed >= 7);

  const lfTurn = runAgent13LandfillDistrictTurnScenario(V1014_LANDFILL_DISTRICT_TURN_SCENARIOS[0]);
  ok(lfTurn.passed);

  const desalNexus = runAgent13DesalNexusScaleSelfTests();
  ok(desalNexus.failed === 0 && desalNexus.passed >= 7);

  const desalTurn = runAgent13DesalNexusTurnScenario(V1014_DESAL_NEXUS_TURN_SCENARIOS[0]);
  ok(desalTurn.passed);

  const bioFeedstock = runAgent13BioenergyFeedstockScaleSelfTests();
  ok(bioFeedstock.failed === 0 && bioFeedstock.passed >= 7);

  const bioTurn = runAgent13BioenergyFeedstockTurnScenario(V1014_BIOENERGY_FEEDSTOCK_TURN_SCENARIOS[0]);
  ok(bioTurn.passed);

  const pumpedSeasonal = runAgent13PumpedHydroSeasonalScaleSelfTests();
  ok(pumpedSeasonal.failed === 0 && pumpedSeasonal.passed >= 7);

  const phesTurn = runAgent13PumpedHydroSeasonalTurnScenario(V1014_PUMPED_HYDRO_SEASONAL_TURN_SCENARIOS[0]);
  ok(phesTurn.passed);

  const microVpp = runAgent13MicrogridVppScaleSelfTests();
  ok(microVpp.failed === 0 && microVpp.passed >= 7);

  const mgTurn = runAgent13MicrogridVppTurnScenario(V1014_MICROGRID_VPP_TURN_SCENARIOS[0]);
  ok(mgTurn.passed);

  const cspThermal = runAgent13CspThermalScaleSelfTests();
  ok(cspThermal.failed === 0 && cspThermal.passed >= 7);

  const cspTurn = runAgent13CspThermalTurnScenario(V1014_CSP_THERMAL_TURN_SCENARIOS[0]);
  ok(cspTurn.passed);

  const gridInertia = runAgent13GridInertiaScaleSelfTests();
  ok(gridInertia.failed === 0 && gridInertia.passed >= 7);

  const gfTurn = runAgent13GridInertiaTurnScenario(V1014_GRID_INERTIA_TURN_SCENARIOS[0]);
  ok(gfTurn.passed);

  const batterySecondLife = runAgent13BatterySecondLifeScaleSelfTests();
  ok(batterySecondLife.failed === 0 && batterySecondLife.passed >= 7);

  const brTurn = runAgent13BatterySecondLifeTurnScenario(V1014_BATTERY_SECOND_LIFE_TURN_SCENARIOS[0]);
  ok(brTurn.passed);

  const curtailmentFlex = runAgent13CurtailmentFlexScaleSelfTests();
  ok(curtailmentFlex.failed === 0 && curtailmentFlex.passed >= 7);

  const cfTurn = runAgent13CurtailmentFlexTurnScenario(V1014_CURTAILMENT_FLEX_TURN_SCENARIOS[0]);
  ok(cfTurn.passed);

  const precinctEmbedded = runAgent13PrecinctEmbeddedScaleSelfTests();
  ok(precinctEmbedded.failed === 0 && precinctEmbedded.passed >= 7);

  const peTurn = runAgent13PrecinctEmbeddedTurnScenario(V1014_PRECINCT_EMBEDDED_TURN_SCENARIOS[0]);
  ok(peTurn.passed);

  const transmissionMerchant = runAgent13TransmissionMerchantScaleSelfTests();
  ok(transmissionMerchant.failed === 0 && transmissionMerchant.passed >= 7);

  const tmTurn = runAgent13TransmissionMerchantTurnScenario(V1014_TRANSMISSION_MERCHANT_TURN_SCENARIOS[0]);
  ok(tmTurn.passed);

  const natureCoexistence = runAgent13NatureCoexistenceScaleSelfTests();
  ok(natureCoexistence.failed === 0 && natureCoexistence.passed >= 7);

  const ncTurn = runAgent13NatureCoexistenceTurnScenario(V1014_NATURE_COEXISTENCE_TURN_SCENARIOS[0]);
  ok(ncTurn.passed);

  return { passed, failed, total: passed + failed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = runAgent13SupplementTests();
  console.log(`Agent 13 supplement tests: ${r.passed}/${r.total} passed`);
  if (r.failed) process.exit(1);
}
