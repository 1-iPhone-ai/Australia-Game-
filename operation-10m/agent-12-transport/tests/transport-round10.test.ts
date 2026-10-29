import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeDeepSeaGatewayThroughputByRegion,
  deepSeaGatewayProductivityMultiplier,
  nationalDeepSeaGatewayThroughputIndex,
} from '../network/deep-sea-gateway-throughput-index.ts';
import {
  computeInfrastructurePermittingByRegion,
  infrastructurePermittingProductivityMultiplier,
  nationalInfrastructurePermittingIndex,
} from '../operations/infrastructure-permitting-index.ts';
import {
  computeElectricCorridorThroughputByRegion,
  computeElectricFreightShare,
  electricFreightProductivityMultiplier,
} from '../productivity/electric-freight-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 10 catalog', () => {
  it('meets 154+ assets, 44+ corridors, 68+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 154);
    assert.ok(TRANSPORT_CORRIDORS.length >= 44);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 68);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 10 systems', () => {
  it('returns agent12/33 with deep-sea gateway, permitting, and electric freight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(70), {
      deepSeaGatewayPolicy: 'expand',
      permittingStreamlinePolicy: 'fast_track',
      electricFreightPolicy: 'accelerate',
    });
    assert.equal(state.schemaVersion, 'agent12/33');
    assert.ok(state.nationalDeepSeaGatewayThroughputIndex >= 12);
    assert.ok(state.nationalInfrastructurePermittingIndex >= 38);
    assert.ok(state.electricFreightShare >= 0.06);
    assert.ok(state.deepSeaGatewayThroughputByRegion.NSW > 10);
  });

  it('activates Sydney–Melbourne deep-sea gateway corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(71));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_melbourne_deep_sea');
    assert.ok(corridor?.active);
  });

  it('reflects deep-sea gateway policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(72);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDeepSeaGatewayThroughputByRegion(ops);
    const national = nationalDeepSeaGatewayThroughputIndex(byRegion);
    assert.ok(
      deepSeaGatewayProductivityMultiplier(national, 'expand') >=
        deepSeaGatewayProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes infrastructure permitting from approval hubs', () => {
    const inputs = defaultInfrastructureInputs(73);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeInfrastructurePermittingByRegion(ops, 0.48);
    const national = nationalInfrastructurePermittingIndex(byRegion);
    assert.ok(byRegion.NSW > 40);
    assert.ok(national >= 38);
    assert.ok(infrastructurePermittingProductivityMultiplier(national, 'fast_track') >= 1);
  });

  it('computes electric corridor throughput from BEV assets', () => {
    const inputs = defaultInfrastructureInputs(74);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeElectricCorridorThroughputByRegion(ops);
    assert.ok(byRegion.VIC > 1.4);
    const share = computeElectricFreightShare(ops, 'accelerate');
    assert.ok(share >= computeElectricFreightShare(ops, 'baseline'));
    assert.ok(electricFreightProductivityMultiplier(share, 'accelerate') >= 1);
  });

  it('registers round-10 NSW deep-sea berth queue scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_deep_sea_berth_queue');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
