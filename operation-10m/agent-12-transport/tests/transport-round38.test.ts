import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeDeepGeothermalExportByRegion,
  deepGeothermalExportProductivityMultiplier,
  nationalDeepGeothermalExportIndex,
} from '../network/deep-geothermal-export-index.ts';
import {
  coastalFloodEvacStagingProductivityMultiplier,
  computeCoastalFloodEvacStagingByRegion,
  computeCoastalFloodEvacStagingShare,
  nationalCoastalFloodEvacStagingIndex,
} from '../operations/coastal-flood-evac-staging-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';
import {
  computeWarehouseRobotSortationLogisticsShare,
  computeWarehouseRobotSortationLogisticsThroughputByRegion,
  nationalWarehouseRobotSortationLogisticsThroughputIndex,
  warehouseRobotSortationLogisticsProductivityMultiplier,
} from '../productivity/warehouse-robot-sortation-logistics-index.ts';

describe('Agent 12 round 38 catalog', () => {
  it('meets 520+ assets, 128+ corridors, 208+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 520);
    assert.ok(TRANSPORT_CORRIDORS.length >= 128);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 208);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 38 systems', () => {
  it('returns agent12/56 with geothermal, flood evac, robot sortation', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(350), {
      deepGeothermalExportPolicy: 'accelerate',
      coastalFloodEvacStagingPolicy: 'surge',
      warehouseRobotSortationLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/56');
    assert.ok(state.nationalDeepGeothermalExportIndex >= 5);
    assert.ok(state.nationalCoastalFloodEvacStagingIndex >= 6);
    assert.ok(state.warehouseRobotSortationLogisticsShare >= 0.03);
    assert.ok(state.deepGeothermalExportByRegion.WA > 3 || state.deepGeothermalExportByRegion.SA > 3);
  });

  it('activates WA–SA deep geothermal corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(351));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_deep_geothermal');
    assert.ok(corridor?.active);
  });

  it('reflects geothermal policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(352);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDeepGeothermalExportByRegion(ops);
    const national = nationalDeepGeothermalExportIndex(byRegion);
    assert.ok(
      deepGeothermalExportProductivityMultiplier(national, 'accelerate') >=
        deepGeothermalExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes coastal flood evac staging from levee hub assets', () => {
    const inputs = defaultInfrastructureInputs(353);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCoastalFloodEvacStagingByRegion(ops, 0.5);
    const national = nationalCoastalFloodEvacStagingIndex(byRegion);
    assert.ok(byRegion.QLD > 5.5 || byRegion.NSW >= 6);
    assert.ok(national >= 6);
    const share = computeCoastalFloodEvacStagingShare(ops, 'surge');
    assert.ok(share >= computeCoastalFloodEvacStagingShare(ops, 'baseline'));
    assert.ok(coastalFloodEvacStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes warehouse robot sortation from automated hub assets', () => {
    const inputs = defaultInfrastructureInputs(354);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeWarehouseRobotSortationLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.VIC > 0.2 || byRegion.NSW > 0.2);
    const share = computeWarehouseRobotSortationLogisticsShare(ops, 'expand');
    assert.ok(share >= computeWarehouseRobotSortationLogisticsShare(ops, 'baseline'));
    const national = nationalWarehouseRobotSortationLogisticsThroughputIndex(byRegion);
    assert.ok(warehouseRobotSortationLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-38 geothermal export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_geothermal_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
