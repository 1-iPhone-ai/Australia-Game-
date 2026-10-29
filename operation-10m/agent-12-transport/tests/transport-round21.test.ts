import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeFloatingOffshoreWindStagingByRegion,
  floatingOffshoreWindStagingProductivityMultiplier,
  nationalFloatingOffshoreWindStagingIndex,
} from '../network/floating-offshore-wind-staging-index.ts';
import {
  computeCriticalMedicineAirliftByRegion,
  computeCriticalMedicineAirliftShare,
  criticalMedicineAirliftProductivityMultiplier,
  nationalCriticalMedicineAirliftIndex,
} from '../operations/critical-medicine-airlift-index.ts';
import {
  computeRegionalFreightDroneShare,
  computeRegionalFreightDroneThroughputByRegion,
  nationalRegionalFreightDroneThroughputIndex,
  regionalFreightDroneProductivityMultiplier,
} from '../productivity/regional-freight-drone-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 21 catalog', () => {
  it('meets 299+ assets, 77+ corridors, 123+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 299);
    assert.ok(TRANSPORT_CORRIDORS.length >= 77);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 123);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 21 systems', () => {
  it('returns agent12/43 with floating wind, medicine airlift, freight drone', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(180), {
      floatingOffshoreWindStagingPolicy: 'deploy',
      criticalMedicineAirliftPolicy: 'surge',
      regionalFreightDronePolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/43');
    assert.ok(state.nationalFloatingOffshoreWindStagingIndex >= 6);
    assert.ok(state.nationalCriticalMedicineAirliftIndex >= 8);
    assert.ok(state.regionalFreightDroneShare >= 0.03);
    assert.ok(state.floatingOffshoreWindStagingByRegion.WA > 5);
  });

  it('activates NT–QLD medicine airlift corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(181));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nt_qld_medicine_airlift');
    assert.ok(corridor?.active);
  });

  it('reflects floating wind policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(182);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeFloatingOffshoreWindStagingByRegion(ops);
    const national = nationalFloatingOffshoreWindStagingIndex(byRegion);
    assert.ok(
      floatingOffshoreWindStagingProductivityMultiplier(national, 'deploy') >=
        floatingOffshoreWindStagingProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes medicine airlift from pharma assets', () => {
    const inputs = defaultInfrastructureInputs(183);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCriticalMedicineAirliftByRegion(ops, 0.5);
    const national = nationalCriticalMedicineAirliftIndex(byRegion);
    assert.ok(byRegion.NT > 8);
    assert.ok(national >= 8);
    const share = computeCriticalMedicineAirliftShare(ops, 'surge');
    assert.ok(share >= computeCriticalMedicineAirliftShare(ops, 'baseline'));
    assert.ok(criticalMedicineAirliftProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes regional freight drone from UAV assets', () => {
    const inputs = defaultInfrastructureInputs(184);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRegionalFreightDroneThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 1.5 || byRegion.VIC > 1.5);
    const share = computeRegionalFreightDroneShare(ops, 'expand');
    assert.ok(share >= computeRegionalFreightDroneShare(ops, 'baseline'));
    const national = nationalRegionalFreightDroneThroughputIndex(byRegion);
    assert.ok(regionalFreightDroneProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 1.5);
  });

  it('registers round-21 floating wind laydown scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_floating_wind_laydown');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
