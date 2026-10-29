import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeDesalinationBrineExportByRegion,
  desalinationBrineExportProductivityMultiplier,
  nationalDesalinationBrineExportIndex,
} from '../network/desalination-brine-export-index.ts';
import {
  computeWildlifeRescueAirliftStagingByRegion,
  computeWildlifeRescueAirliftStagingShare,
  nationalWildlifeRescueAirliftStagingIndex,
  wildlifeRescueAirliftStagingProductivityMultiplier,
} from '../operations/wildlife-rescue-airlift-staging-index.ts';
import {
  computeUrbanEvFreightChargingLogisticsShare,
  computeUrbanEvFreightChargingLogisticsThroughputByRegion,
  nationalUrbanEvFreightChargingLogisticsThroughputIndex,
  urbanEvFreightChargingLogisticsProductivityMultiplier,
} from '../productivity/urban-ev-freight-charging-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 40 catalog', () => {
  it('meets 547+ assets, 134+ corridors, 218+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 547);
    assert.ok(TRANSPORT_CORRIDORS.length >= 134);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 218);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 40 systems', () => {
  it('returns agent12/42 with desal brine, wildlife rescue, EV freight charging', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(370), {
      desalinationBrineExportPolicy: 'accelerate',
      wildlifeRescueAirliftStagingPolicy: 'surge',
      urbanEvFreightChargingLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/42');
    assert.ok(state.nationalDesalinationBrineExportIndex >= 5);
    assert.ok(state.nationalWildlifeRescueAirliftStagingIndex >= 6);
    assert.ok(state.urbanEvFreightChargingLogisticsShare >= 0.03);
    assert.ok(state.desalinationBrineExportByRegion.WA > 3 || state.desalinationBrineExportByRegion.SA > 3);
  });

  it('activates WA–SA desalination brine corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(371));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_desalination_brine');
    assert.ok(corridor?.active);
  });

  it('reflects desal brine policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(372);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDesalinationBrineExportByRegion(ops);
    const national = nationalDesalinationBrineExportIndex(byRegion);
    assert.ok(
      desalinationBrineExportProductivityMultiplier(national, 'accelerate') >=
        desalinationBrineExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes wildlife rescue staging from fauna medevac assets', () => {
    const inputs = defaultInfrastructureInputs(373);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeWildlifeRescueAirliftStagingByRegion(ops, 0.5);
    const national = nationalWildlifeRescueAirliftStagingIndex(byRegion);
    assert.ok(byRegion.VIC > 5.5 || byRegion.NSW >= 6);
    assert.ok(national >= 6);
    const share = computeWildlifeRescueAirliftStagingShare(ops, 'surge');
    assert.ok(share >= computeWildlifeRescueAirliftStagingShare(ops, 'baseline'));
    assert.ok(wildlifeRescueAirliftStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes urban EV freight charging from depot hub assets', () => {
    const inputs = defaultInfrastructureInputs(374);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeUrbanEvFreightChargingLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeUrbanEvFreightChargingLogisticsShare(ops, 'expand');
    assert.ok(share >= computeUrbanEvFreightChargingLogisticsShare(ops, 'baseline'));
    const national = nationalUrbanEvFreightChargingLogisticsThroughputIndex(byRegion);
    assert.ok(urbanEvFreightChargingLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-40 brine export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_brine_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
