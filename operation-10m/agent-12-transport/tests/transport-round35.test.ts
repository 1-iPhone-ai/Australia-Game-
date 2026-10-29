import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeSiliconSolarWaferExportByRegion,
  nationalSiliconSolarWaferExportIndex,
  siliconSolarWaferExportProductivityMultiplier,
} from '../network/silicon-solar-wafer-export-index.ts';
import {
  computeRailCoalPhaseoutStagingByRegion,
  computeRailCoalPhaseoutStagingShare,
  nationalRailCoalPhaseoutStagingIndex,
  railCoalPhaseoutStagingProductivityMultiplier,
} from '../operations/rail-coal-phaseout-staging-index.ts';
import {
  airportBaggageRobotLogisticsProductivityMultiplier,
  computeAirportBaggageRobotLogisticsShare,
  computeAirportBaggageRobotLogisticsThroughputByRegion,
  nationalAirportBaggageRobotLogisticsThroughputIndex,
} from '../productivity/airport-baggage-robot-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 35 catalog', () => {
  it('meets 481+ assets, 119+ corridors, 193+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 481);
    assert.ok(TRANSPORT_CORRIDORS.length >= 119);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 193);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 35 systems', () => {
  it('returns agent12/42 with silicon wafer, coal phaseout, baggage robot', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(320), {
      siliconSolarWaferExportPolicy: 'accelerate',
      railCoalPhaseoutStagingPolicy: 'accelerate',
      airportBaggageRobotLogisticsPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/42');
    assert.ok(state.nationalSiliconSolarWaferExportIndex >= 5);
    assert.ok(state.nationalRailCoalPhaseoutStagingIndex >= 6);
    assert.ok(state.airportBaggageRobotLogisticsShare >= 0.03);
    assert.ok(state.siliconSolarWaferExportByRegion.NSW > 3 || state.siliconSolarWaferExportByRegion.VIC > 3);
  });

  it('activates NSW–VIC silicon wafer corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(321));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_silicon_wafer');
    assert.ok(corridor?.active);
  });

  it('reflects silicon wafer policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(322);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSiliconSolarWaferExportByRegion(ops);
    const national = nationalSiliconSolarWaferExportIndex(byRegion);
    assert.ok(
      siliconSolarWaferExportProductivityMultiplier(national, 'accelerate') >=
        siliconSolarWaferExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes coal phaseout staging from transition assets', () => {
    const inputs = defaultInfrastructureInputs(323);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRailCoalPhaseoutStagingByRegion(ops, 0.5);
    const national = nationalRailCoalPhaseoutStagingIndex(byRegion);
    assert.ok(byRegion.QLD > 5.5 || byRegion.NSW >= 6);
    assert.ok(national >= 6);
    const share = computeRailCoalPhaseoutStagingShare(ops, 'accelerate');
    assert.ok(share >= computeRailCoalPhaseoutStagingShare(ops, 'baseline'));
    assert.ok(railCoalPhaseoutStagingProductivityMultiplier(share, 'accelerate') >= 1);
  });

  it('computes baggage robot logistics from airport assets', () => {
    const inputs = defaultInfrastructureInputs(324);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAirportBaggageRobotLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeAirportBaggageRobotLogisticsShare(ops, 'deploy');
    assert.ok(share >= computeAirportBaggageRobotLogisticsShare(ops, 'baseline'));
    const national = nationalAirportBaggageRobotLogisticsThroughputIndex(byRegion);
    assert.ok(airportBaggageRobotLogisticsProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-35 wafer export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_wafer_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
