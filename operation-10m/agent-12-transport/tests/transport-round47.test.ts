import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeEWasteCriticalMineralsRecoveryExportByRegion,
  eWasteCriticalMineralsRecoveryExportProductivityMultiplier,
  nationalEWasteCriticalMineralsRecoveryExportIndex,
} from '../network/e-waste-critical-minerals-recovery-export-index.ts';
import {
  computeRegionalOncologyRadiotherapySupplyStagingByRegion,
  computeRegionalOncologyRadiotherapySupplyStagingShare,
  nationalRegionalOncologyRadiotherapySupplyStagingIndex,
  regionalOncologyRadiotherapySupplyStagingProductivityMultiplier,
} from '../operations/regional-oncology-radiotherapy-supply-staging-index.ts';
import {
  computePortAutonomousTugBerthingLogisticsShare,
  computePortAutonomousTugBerthingLogisticsThroughputByRegion,
  nationalPortAutonomousTugBerthingLogisticsThroughputIndex,
  portAutonomousTugBerthingLogisticsProductivityMultiplier,
} from '../productivity/port-autonomous-tug-berthing-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 47 catalog', () => {
  it('meets 638+ assets, 155+ corridors, 253+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 638);
    assert.ok(TRANSPORT_CORRIDORS.length >= 155);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 253);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 47 systems', () => {
  it('returns agent12/51 with e-waste, oncology, autonomous tug', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(710), {
      eWasteCriticalMineralsRecoveryExportPolicy: 'accelerate',
      regionalOncologyRadiotherapySupplyStagingPolicy: 'surge',
      portAutonomousTugBerthingLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/51');
    assert.ok(state.nationalEWasteCriticalMineralsRecoveryExportIndex >= 5);
    assert.ok(state.nationalRegionalOncologyRadiotherapySupplyStagingIndex >= 6);
    assert.ok(state.portAutonomousTugBerthingLogisticsShare >= 0.03);
    assert.ok(
      state.eWasteCriticalMineralsRecoveryExportByRegion.QLD > 3 ||
        state.eWasteCriticalMineralsRecoveryExportByRegion.NSW > 3,
    );
  });

  it('activates QLD–NSW e-waste corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(711));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_qld_nsw_e_waste');
    assert.ok(corridor?.active);
  });

  it('reflects e-waste policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(712);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeEWasteCriticalMineralsRecoveryExportByRegion(ops);
    const national = nationalEWasteCriticalMineralsRecoveryExportIndex(byRegion);
    assert.ok(
      eWasteCriticalMineralsRecoveryExportProductivityMultiplier(national, 'accelerate') >=
        eWasteCriticalMineralsRecoveryExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes oncology staging from cancer care assets', () => {
    const inputs = defaultInfrastructureInputs(713);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRegionalOncologyRadiotherapySupplyStagingByRegion(ops, 0.5);
    const national = nationalRegionalOncologyRadiotherapySupplyStagingIndex(byRegion);
    assert.ok(byRegion.WA > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRegionalOncologyRadiotherapySupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRegionalOncologyRadiotherapySupplyStagingShare(ops, 'baseline'));
    assert.ok(regionalOncologyRadiotherapySupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes autonomous tug from harbour robotics assets', () => {
    const inputs = defaultInfrastructureInputs(714);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortAutonomousTugBerthingLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.VIC > 0.2 || byRegion.TAS > 0.2);
    const share = computePortAutonomousTugBerthingLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortAutonomousTugBerthingLogisticsShare(ops, 'baseline'));
    const national = nationalPortAutonomousTugBerthingLogisticsThroughputIndex(byRegion);
    assert.ok(portAutonomousTugBerthingLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-47 e-waste export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_qld_e_waste_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'QLD');
  });
});
