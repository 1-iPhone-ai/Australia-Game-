import assert from 'node:assert/strict';
import {
  V1014_CLIMATE_HAZARD_CATALOG,
  aggregateClimatePressure,
  detectClimateHazardsFromCrises,
} from '../modules/climate-hazards.ts';
import { computeRegionalGridStress } from '../modules/grid-coupling.ts';
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

  return { passed, failed, total: passed + failed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = runAgent13SupplementTests();
  console.log(`Agent 13 supplement tests: ${r.passed}/${r.total} passed`);
  if (r.failed) process.exit(1);
}
