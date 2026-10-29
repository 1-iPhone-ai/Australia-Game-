import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeOffshoreWindTowInstallByRegion,
  nationalOffshoreWindTowInstallIndex,
  offshoreWindTowInstallProductivityMultiplier,
} from '../network/offshore-wind-tow-install-index.ts';
import {
  computeEvBatteryRecyclingLogisticsByRegion,
  computeEvBatteryRecyclingLogisticsShare,
  evBatteryRecyclingLogisticsProductivityMultiplier,
  nationalEvBatteryRecyclingLogisticsIndex,
} from '../operations/ev-battery-recycling-logistics-index.ts';
import {
  computeUrbanCourierMicrohubShare,
  computeUrbanCourierMicrohubThroughputByRegion,
  nationalUrbanCourierMicrohubThroughputIndex,
  urbanCourierMicrohubProductivityMultiplier,
} from '../productivity/urban-courier-microhub-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 27 catalog', () => {
  it('meets 377+ assets, 95+ corridors, 153+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 377);
    assert.ok(TRANSPORT_CORRIDORS.length >= 95);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 153);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 27 systems', () => {
  it('returns agent12/44 with wind tow, battery recycle, courier microhub', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(240), {
      offshoreWindTowInstallPolicy: 'deploy',
      evBatteryRecyclingLogisticsPolicy: 'accelerate',
      urbanCourierMicrohubPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/44');
    assert.ok(state.nationalOffshoreWindTowInstallIndex >= 5);
    assert.ok(state.nationalEvBatteryRecyclingLogisticsIndex >= 5);
    assert.ok(state.urbanCourierMicrohubShare >= 0.03);
    assert.ok(state.offshoreWindTowInstallByRegion.WA > 3 || state.offshoreWindTowInstallByRegion.VIC > 3);
  });

  it('activates WA–VIC offshore wind tow corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(241));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_vic_offshore_wind_tow');
    assert.ok(corridor?.active);
  });

  it('reflects wind tow install policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(242);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeOffshoreWindTowInstallByRegion(ops);
    const national = nationalOffshoreWindTowInstallIndex(byRegion);
    assert.ok(
      offshoreWindTowInstallProductivityMultiplier(national, 'deploy') >=
        offshoreWindTowInstallProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes EV battery recycling from circular logistics assets', () => {
    const inputs = defaultInfrastructureInputs(243);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeEvBatteryRecyclingLogisticsByRegion(ops, 0.5);
    const national = nationalEvBatteryRecyclingLogisticsIndex(byRegion);
    assert.ok(byRegion.NSW > 5 || byRegion.QLD > 5);
    assert.ok(national >= 5);
    const share = computeEvBatteryRecyclingLogisticsShare(ops, 'accelerate');
    assert.ok(share >= computeEvBatteryRecyclingLogisticsShare(ops, 'baseline'));
    assert.ok(evBatteryRecyclingLogisticsProductivityMultiplier(share, 'accelerate') >= 1);
  });

  it('computes courier microhub from same-day urban assets', () => {
    const inputs = defaultInfrastructureInputs(244);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeUrbanCourierMicrohubThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.15 || byRegion.VIC > 0.15);
    const share = computeUrbanCourierMicrohubShare(ops, 'expand');
    assert.ok(share >= computeUrbanCourierMicrohubShare(ops, 'baseline'));
    const national = nationalUrbanCourierMicrohubThroughputIndex(byRegion);
    assert.ok(urbanCourierMicrohubProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 1.6);
  });

  it('registers round-27 wind tow weather hold scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_wind_tow_weather_hold');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
