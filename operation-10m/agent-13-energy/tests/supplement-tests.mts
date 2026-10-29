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

  return { passed, failed, total: passed + failed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = runAgent13SupplementTests();
  console.log(`Agent 13 supplement tests: ${r.passed}/${r.total} passed`);
  if (r.failed) process.exit(1);
}
