import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeOffshoreWindCableExportByRegion,
  nationalOffshoreWindCableExportIndex,
  offshoreWindCableExportProductivityMultiplier,
} from '../network/offshore-wind-cable-export-index.ts';
import {
  computeMedevacHelicopterStagingByRegion,
  computeMedevacHelicopterStagingShare,
  medevacHelicopterStagingProductivityMultiplier,
  nationalMedevacHelicopterStagingIndex,
} from '../operations/medevac-helicopter-staging-index.ts';
import {
  computeReefRestorationLogisticsShare,
  computeReefRestorationLogisticsThroughputByRegion,
  nationalReefRestorationLogisticsThroughputIndex,
  reefRestorationLogisticsProductivityMultiplier,
} from '../productivity/reef-restoration-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 36 catalog', () => {
  it('meets 494+ assets, 122+ corridors, 198+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 494);
    assert.ok(TRANSPORT_CORRIDORS.length >= 122);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 198);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 36 systems', () => {
  it('returns agent12/43 with wind cable, medevac heli, reef logistics', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(330), {
      offshoreWindCableExportPolicy: 'accelerate',
      medevacHelicopterStagingPolicy: 'surge',
      reefRestorationLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/43');
    assert.ok(state.nationalOffshoreWindCableExportIndex >= 5);
    assert.ok(state.nationalMedevacHelicopterStagingIndex >= 6);
    assert.ok(state.reefRestorationLogisticsShare >= 0.03);
    assert.ok(state.offshoreWindCableExportByRegion.TAS > 3 || state.offshoreWindCableExportByRegion.VIC > 3);
  });

  it('activates TAS–VIC offshore wind cable corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(331));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_tas_vic_offshore_wind_cable');
    assert.ok(corridor?.active);
  });

  it('reflects wind cable policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(332);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeOffshoreWindCableExportByRegion(ops);
    const national = nationalOffshoreWindCableExportIndex(byRegion);
    assert.ok(
      offshoreWindCableExportProductivityMultiplier(national, 'accelerate') >=
        offshoreWindCableExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes medevac staging from remote clinic assets', () => {
    const inputs = defaultInfrastructureInputs(333);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeMedevacHelicopterStagingByRegion(ops, 0.5);
    const national = nationalMedevacHelicopterStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.WA >= 6);
    assert.ok(national >= 6);
    const share = computeMedevacHelicopterStagingShare(ops, 'surge');
    assert.ok(share >= computeMedevacHelicopterStagingShare(ops, 'baseline'));
    assert.ok(medevacHelicopterStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes reef restoration from coastal eco assets', () => {
    const inputs = defaultInfrastructureInputs(334);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeReefRestorationLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.QLD > 0.2 || byRegion.TAS > 0.2);
    const share = computeReefRestorationLogisticsShare(ops, 'expand');
    assert.ok(share >= computeReefRestorationLogisticsShare(ops, 'baseline'));
    const national = nationalReefRestorationLogisticsThroughputIndex(byRegion);
    assert.ok(reefRestorationLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-36 cable export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_tas_cable_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'TAS');
  });
});
