import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  agriculturalExportProductivityMultiplier,
  computeAgriculturalExportThroughputByRegion,
  nationalAgriculturalExportThroughputIndex,
} from '../network/agricultural-export-throughput-index.ts';
import {
  computeTrackPossessionEfficiencyByRegion,
  nationalTrackPossessionEfficiencyIndex,
  trackPossessionProductivityMultiplier,
} from '../operations/track-possession-efficiency-index.ts';
import {
  computeGreenBunkeringShare,
  computeGreenBunkeringThroughputByRegion,
  greenBunkeringProductivityMultiplier,
} from '../productivity/green-bunkering-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 14 catalog', () => {
  it('meets 207+ assets, 56+ corridors, 88+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 207);
    assert.ok(TRANSPORT_CORRIDORS.length >= 56);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 88);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 14 systems', () => {
  it('returns agent12/41 with agricultural export, track possession, green bunkering', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(110), {
      agriculturalExportPolicy: 'accelerate',
      trackPossessionPolicy: 'optimize',
      greenBunkeringPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/41');
    assert.ok(state.nationalAgriculturalExportThroughputIndex >= 9);
    assert.ok(state.nationalTrackPossessionEfficiencyIndex >= 38);
    assert.ok(state.greenBunkeringShare >= 0.05);
    assert.ok(state.agriculturalExportThroughputByRegion.SA > 6);
  });

  it('activates SA grain export belt corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(111));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_sa_grain_export_belt');
    assert.ok(corridor?.active);
  });

  it('reflects agricultural export policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(112);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAgriculturalExportThroughputByRegion(ops);
    const national = nationalAgriculturalExportThroughputIndex(byRegion);
    assert.ok(
      agriculturalExportProductivityMultiplier(national, 'accelerate') >=
        agriculturalExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes track possession efficiency from maintenance mesh assets', () => {
    const inputs = defaultInfrastructureInputs(113);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeTrackPossessionEfficiencyByRegion(ops, 0.48);
    const national = nationalTrackPossessionEfficiencyIndex(byRegion);
    assert.ok(byRegion.NSW > 38);
    assert.ok(national >= 38);
    assert.ok(trackPossessionProductivityMultiplier(national, 'optimize') >= 1);
  });

  it('computes green bunkering from ammonia and shore-power assets', () => {
    const inputs = defaultInfrastructureInputs(114);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGreenBunkeringThroughputByRegion(ops);
    assert.ok(byRegion.QLD > 3);
    const share = computeGreenBunkeringShare(ops, 'expand');
    assert.ok(share >= computeGreenBunkeringShare(ops, 'baseline'));
    assert.ok(greenBunkeringProductivityMultiplier(share, 'expand') >= 1);
  });

  it('registers round-14 SA harvest export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_sa_harvest_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'SA');
  });
});
