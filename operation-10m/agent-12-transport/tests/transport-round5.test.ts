import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  connectivityBonusByRegion,
  computeIntercapitalConnectivityIndex,
} from '../network/intercapital-connectivity.ts';
import {
  computeLastMileCoverageByRegion,
  nationalLastMileCoverage,
} from '../operations/last-mile-coverage.ts';
import {
  computeElectrifiedFreightShare,
  computeModalBalanceIndex,
} from '../productivity/modal-balance-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 5 catalog', () => {
  it('meets 90+ assets, 29+ corridors, 43+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 90);
    assert.ok(TRANSPORT_CORRIDORS.length >= 29);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 43);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 5 systems', () => {
  it('returns agent12/11 with connectivity, modal balance, and last mile', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(25), {
      modalShiftPolicy: 'balanced',
    });
    assert.equal(state.schemaVersion, 'agent12/11');
    assert.ok(state.intercapitalConnectivityIndex >= 0.15);
    assert.ok(state.modalBalanceIndex >= 0.25);
    assert.ok(state.electrifiedFreightShare > 0.1);
    assert.ok(state.nationalLastMileCoverage >= 50);
  });

  it('activates Hunter Valley export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(26));
    const hunter = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_hunter_export');
    assert.ok(hunter?.active);
  });

  it('reflects modal shift policy in balance index', () => {
    const inputs = defaultInfrastructureInputs(27);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const balanced = computeModalBalanceIndex(ops, 'balanced');
    const road = computeModalBalanceIndex(ops, 'road');
    const rail = computeModalBalanceIndex(ops, 'rail');
    assert.ok(balanced > 0.2);
    assert.notEqual(road, rail);
    assert.ok(Math.max(road, rail, balanced) <= 1);
  });

  it('computes intercapital connectivity from multi-region corridors', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(28));
    const idx = computeIntercapitalConnectivityIndex(state.activeCorridors, TRANSPORT_CORRIDORS);
    assert.ok(idx >= state.intercapitalConnectivityIndex * 0.99);
    const bonus = connectivityBonusByRegion(state.activeCorridors, TRANSPORT_CORRIDORS);
    assert.ok(bonus.NSW >= 0);
  });

  it('weights last mile from logistics warehouse coverage', () => {
    const inputs = defaultInfrastructureInputs(1);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeLastMileCoverageByRegion(ops);
    assert.ok(byRegion.VIC >= 55);
    assert.ok(nationalLastMileCoverage(byRegion) >= 50);
  });

  it('registers round-5 Dandenong peak scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_vic_dandenong_peak');
    assert.ok(scenario);
    assert.ok(scenario!.targetRegions.includes('VIC'));
  });

  it('tracks electrified freight share on national rail', () => {
    const inputs = defaultInfrastructureInputs(1);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const share = computeElectrifiedFreightShare(ops);
    assert.ok(share > 0.08 && share < 1);
  });
});
