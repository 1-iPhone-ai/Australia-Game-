import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeMethanolBunkeringExportByRegion,
  methanolBunkeringExportProductivityMultiplier,
  nationalMethanolBunkeringExportIndex,
} from '../network/methanol-bunkering-export-index.ts';
import {
  antarcticResupplyLogisticsProductivityMultiplier,
  computeAntarcticResupplyLogisticsByRegion,
  computeAntarcticResupplyLogisticsShare,
  nationalAntarcticResupplyLogisticsIndex,
} from '../operations/antarctic-resupply-logistics-index.ts';
import {
  computeSmartBorderPreclearanceShare,
  computeSmartBorderPreclearanceThroughputByRegion,
  nationalSmartBorderPreclearanceThroughputIndex,
  smartBorderPreclearanceProductivityMultiplier,
} from '../productivity/smart-border-preclearance-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 24 catalog', () => {
  it('meets 338+ assets, 86+ corridors, 138+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 338);
    assert.ok(TRANSPORT_CORRIDORS.length >= 86);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 138);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 24 systems', () => {
  it('returns agent12/37 with methanol bunkering, Antarctic resupply, smart border', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(210), {
      methanolBunkeringExportPolicy: 'accelerate',
      antarcticResupplyLogisticsPolicy: 'surge',
      smartBorderPreclearancePolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/37');
    assert.ok(state.nationalMethanolBunkeringExportIndex >= 5);
    assert.ok(state.nationalAntarcticResupplyLogisticsIndex >= 6);
    assert.ok(state.smartBorderPreclearanceShare >= 0.03);
    assert.ok(state.methanolBunkeringExportByRegion.WA > 5);
  });

  it('activates WA–QLD methanol bunkering corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(211));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_methanol_bunkering');
    assert.ok(corridor?.active);
  });

  it('reflects methanol bunkering policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(212);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeMethanolBunkeringExportByRegion(ops);
    const national = nationalMethanolBunkeringExportIndex(byRegion);
    assert.ok(
      methanolBunkeringExportProductivityMultiplier(national, 'accelerate') >=
        methanolBunkeringExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes Antarctic resupply from polar staging assets', () => {
    const inputs = defaultInfrastructureInputs(213);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAntarcticResupplyLogisticsByRegion(ops, 0.5);
    const national = nationalAntarcticResupplyLogisticsIndex(byRegion);
    assert.ok(byRegion.TAS > 6 || byRegion.SA > 6);
    assert.ok(national >= 6);
    const share = computeAntarcticResupplyLogisticsShare(ops, 'surge');
    assert.ok(share >= computeAntarcticResupplyLogisticsShare(ops, 'baseline'));
    assert.ok(antarcticResupplyLogisticsProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes smart border preclear from digital gate assets', () => {
    const inputs = defaultInfrastructureInputs(214);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSmartBorderPreclearanceThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.15 || byRegion.VIC > 0.15);
    const share = computeSmartBorderPreclearanceShare(ops, 'deploy');
    assert.ok(share >= computeSmartBorderPreclearanceShare(ops, 'baseline'));
    const national = nationalSmartBorderPreclearanceThroughputIndex(byRegion);
    assert.ok(smartBorderPreclearanceProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-24 methanol bunker surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_methanol_bunker_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
