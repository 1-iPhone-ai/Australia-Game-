import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeGridBatteryLogisticsByRegion,
  gridBatteryLogisticsProductivityMultiplier,
  nationalGridBatteryLogisticsIndex,
} from '../network/grid-battery-logistics-index.ts';
import {
  computePacificHumanitarianSealiftByRegion,
  computePacificHumanitarianSealiftShare,
  nationalPacificHumanitarianSealiftIndex,
  pacificHumanitarianSealiftProductivityMultiplier,
} from '../operations/pacific-humanitarian-sealift-index.ts';
import {
  autonomousPortTractorProductivityMultiplier,
  computeAutonomousPortTractorShare,
  computeAutonomousPortTractorThroughputByRegion,
  nationalAutonomousPortTractorThroughputIndex,
} from '../productivity/autonomous-port-tractor-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 22 catalog', () => {
  it('meets 312+ assets, 80+ corridors, 128+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 312);
    assert.ok(TRANSPORT_CORRIDORS.length >= 80);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 128);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 22 systems', () => {
  it('returns agent12/24 with grid BESS, Pacific sealift, port tractors', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(190), {
      gridBatteryLogisticsPolicy: 'accelerate',
      pacificHumanitarianSealiftPolicy: 'surge',
      autonomousPortTractorPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/24');
    assert.ok(state.nationalGridBatteryLogisticsIndex >= 5);
    assert.ok(state.nationalPacificHumanitarianSealiftIndex >= 8);
    assert.ok(state.autonomousPortTractorShare >= 0.033);
    assert.ok(state.gridBatteryLogisticsByRegion.SA > 4);
  });

  it('activates QLD–NT Pacific sealift corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(191));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_qld_nt_pacific_sealift');
    assert.ok(corridor?.active);
  });

  it('reflects grid BESS policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(192);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGridBatteryLogisticsByRegion(ops);
    const national = nationalGridBatteryLogisticsIndex(byRegion);
    assert.ok(
      gridBatteryLogisticsProductivityMultiplier(national, 'accelerate') >=
        gridBatteryLogisticsProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes Pacific sealift from humanitarian assets', () => {
    const inputs = defaultInfrastructureInputs(193);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePacificHumanitarianSealiftByRegion(ops, 0.5);
    const national = nationalPacificHumanitarianSealiftIndex(byRegion);
    assert.ok(byRegion.QLD > 8);
    assert.ok(national >= 8);
    const share = computePacificHumanitarianSealiftShare(ops, 'surge');
    assert.ok(share >= computePacificHumanitarianSealiftShare(ops, 'baseline'));
    assert.ok(pacificHumanitarianSealiftProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes autonomous port tractor from terminal assets', () => {
    const inputs = defaultInfrastructureInputs(194);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAutonomousPortTractorThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 2 || byRegion.VIC > 2);
    const share = computeAutonomousPortTractorShare(ops, 'deploy');
    assert.ok(share >= computeAutonomousPortTractorShare(ops, 'baseline'));
    const national = nationalAutonomousPortTractorThroughputIndex(byRegion);
    assert.ok(autonomousPortTractorProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-22 BESS export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_sa_bess_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'SA');
  });
});
