import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeLithiumBrineExportByRegion,
  lithiumBrineExportProductivityMultiplier,
  nationalLithiumBrineExportIndex,
} from '../network/lithium-brine-export-index.ts';
import {
  computeInlandRailExpressByRegion,
  computeInlandRailExpressShare,
  inlandRailExpressProductivityMultiplier,
  nationalInlandRailExpressIndex,
} from '../operations/inland-rail-express-index.ts';
import {
  computeSpaceLaunchLogisticsShare,
  computeSpaceLaunchLogisticsThroughputByRegion,
  nationalSpaceLaunchLogisticsThroughputIndex,
  spaceLaunchLogisticsProductivityMultiplier,
} from '../productivity/space-launch-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 18 catalog', () => {
  it('meets 259+ assets, 68+ corridors, 108+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 259);
    assert.ok(TRANSPORT_CORRIDORS.length >= 68);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 108);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 18 systems', () => {
  it('returns agent12/22 with lithium brine, inland express, space launch', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(150), {
      lithiumBrineExportPolicy: 'accelerate',
      inlandRailExpressPolicy: 'deploy',
      spaceLaunchLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/22');
    assert.ok(state.nationalLithiumBrineExportIndex >= 6);
    assert.ok(state.nationalInlandRailExpressIndex >= 10);
    assert.ok(state.spaceLaunchLogisticsShare >= 0.03);
    assert.ok(state.lithiumBrineExportByRegion.WA > 5);
  });

  it('activates WA–SA lithium brine corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(151));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_lithium_brine_chain');
    assert.ok(corridor?.active);
  });

  it('reflects lithium brine policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(152);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeLithiumBrineExportByRegion(ops);
    const national = nationalLithiumBrineExportIndex(byRegion);
    assert.ok(
      lithiumBrineExportProductivityMultiplier(national, 'accelerate') >=
        lithiumBrineExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes inland rail express from express assets', () => {
    const inputs = defaultInfrastructureInputs(153);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeInlandRailExpressByRegion(ops, 0.5);
    const national = nationalInlandRailExpressIndex(byRegion);
    assert.ok(byRegion.NSW > 10);
    assert.ok(national >= 10);
    const share = computeInlandRailExpressShare(ops, 'deploy');
    assert.ok(share >= computeInlandRailExpressShare(ops, 'baseline'));
    assert.ok(inlandRailExpressProductivityMultiplier(share, 'deploy') >= 1);
  });

  it('computes space launch logistics from orbital assets', () => {
    const inputs = defaultInfrastructureInputs(154);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSpaceLaunchLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NT > 1);
    const share = computeSpaceLaunchLogisticsShare(ops, 'expand');
    assert.ok(share >= computeSpaceLaunchLogisticsShare(ops, 'baseline'));
    const national = nationalSpaceLaunchLogisticsThroughputIndex(byRegion);
    assert.ok(spaceLaunchLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 1.5);
  });

  it('registers round-18 lithium brine surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_lithium_brine_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
