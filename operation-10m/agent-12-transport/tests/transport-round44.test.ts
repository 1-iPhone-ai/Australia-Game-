import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeMarineKelpExportByRegion,
  marineKelpExportProductivityMultiplier,
  nationalMarineKelpExportIndex,
} from '../network/marine-kelp-export-index.ts';
import {
  computeRemoteDialysisSupplyStagingByRegion,
  computeRemoteDialysisSupplyStagingShare,
  nationalRemoteDialysisSupplyStagingIndex,
  remoteDialysisSupplyStagingProductivityMultiplier,
} from '../operations/remote-dialysis-supply-staging-index.ts';
import {
  computeRailAutomatedInspectionLogisticsShare,
  computeRailAutomatedInspectionLogisticsThroughputByRegion,
  nationalRailAutomatedInspectionLogisticsThroughputIndex,
  railAutomatedInspectionLogisticsProductivityMultiplier,
} from '../productivity/rail-automated-inspection-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 44 catalog', () => {
  it('meets 599+ assets, 146+ corridors, 238+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 599);
    assert.ok(TRANSPORT_CORRIDORS.length >= 146);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 238);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 44 systems', () => {
  it('returns agent12/46 with kelp, dialysis, rail inspection', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(500), {
      marineKelpExportPolicy: 'accelerate',
      remoteDialysisSupplyStagingPolicy: 'surge',
      railAutomatedInspectionLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/46');
    assert.ok(state.nationalMarineKelpExportIndex >= 5);
    assert.ok(state.nationalRemoteDialysisSupplyStagingIndex >= 6);
    assert.ok(state.railAutomatedInspectionLogisticsShare >= 0.03);
    assert.ok(state.marineKelpExportByRegion.TAS > 3 || state.marineKelpExportByRegion.SA > 3);
  });

  it('activates TAS–SA marine kelp corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(501));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_tas_sa_marine_kelp');
    assert.ok(corridor?.active);
  });

  it('reflects kelp policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(502);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeMarineKelpExportByRegion(ops);
    const national = nationalMarineKelpExportIndex(byRegion);
    assert.ok(
      marineKelpExportProductivityMultiplier(national, 'accelerate') >=
        marineKelpExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes dialysis staging from renal health assets', () => {
    const inputs = defaultInfrastructureInputs(503);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteDialysisSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteDialysisSupplyStagingIndex(byRegion);
    assert.ok(byRegion.WA > 5.5 || byRegion.NT >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteDialysisSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteDialysisSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteDialysisSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes rail inspection from geometry scan assets', () => {
    const inputs = defaultInfrastructureInputs(504);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRailAutomatedInspectionLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.QLD > 0.2);
    const share = computeRailAutomatedInspectionLogisticsShare(ops, 'expand');
    assert.ok(share >= computeRailAutomatedInspectionLogisticsShare(ops, 'baseline'));
    const national = nationalRailAutomatedInspectionLogisticsThroughputIndex(byRegion);
    assert.ok(railAutomatedInspectionLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-44 kelp export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_tas_kelp_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'TAS');
  });
});
