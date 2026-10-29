import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeContainerThroughputByRegion,
  nationalContainerThroughputIndex,
} from '../network/container-throughput-index.ts';
import {
  computeColdChainReliabilityByRegion,
  nationalColdChainReliabilityIndex,
} from '../operations/cold-chain-reliability.ts';
import {
  computeGreenFreightShare,
  greenFreightProductivityMultiplier,
} from '../productivity/green-freight-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 6 catalog', () => {
  it('meets 100+ assets, 32+ corridors, 48+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 100);
    assert.ok(TRANSPORT_CORRIDORS.length >= 32);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 48);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 6 systems', () => {
  it('returns agent12/34 with throughput, cold chain, and green freight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(30), {
      greenFreightPolicy: 'accelerate',
    });
    assert.equal(state.schemaVersion, 'agent12/34');
    assert.ok(state.nationalContainerThroughputIndex >= 18);
    assert.ok(state.coldChainReliabilityIndex >= 0.4);
    assert.ok(state.greenFreightShare > 0.12);
    assert.ok(state.containerThroughputByRegion.NSW > 20);
  });

  it('activates Illawarra steel export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(31));
    const illawarra = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_illawarra_steel');
    assert.ok(illawarra?.active);
  });

  it('reflects green freight policy in share and multiplier', () => {
    const inputs = defaultInfrastructureInputs(32);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const baseline = computeGreenFreightShare(ops, 'baseline');
    const accelerate = computeGreenFreightShare(ops, 'accelerate');
    assert.ok(accelerate >= baseline);
    assert.ok(greenFreightProductivityMultiplier(accelerate, 'accelerate') >= 1);
  });

  it('computes container throughput from ports and intermodal logistics', () => {
    const inputs = defaultInfrastructureInputs(33);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeContainerThroughputByRegion(ops);
    const national = nationalContainerThroughputIndex(byRegion);
    assert.ok(byRegion.QLD > 15);
    assert.ok(national >= 18);
  });

  it('weights cold chain reliability from chilled DC nodes', () => {
    const inputs = defaultInfrastructureInputs(34);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeColdChainReliabilityByRegion(ops);
    const national = nationalColdChainReliabilityIndex(byRegion);
    assert.ok(byRegion.ACT > 0.45);
    assert.ok(national >= 0.4);
  });

  it('registers round-6 Geelong drayage peak scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_vic_geelong_drayage_peak');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'VIC');
  });
});
