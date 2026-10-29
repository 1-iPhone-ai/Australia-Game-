import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeBulkExportThroughputByRegion,
  nationalBulkExportThroughputIndex,
} from '../network/bulk-export-throughput-index.ts';
import {
  computeIntermodalDwellByRegion,
  nationalIntermodalDwellMedian,
} from '../operations/intermodal-dwell-index.ts';
import {
  computeUrbanCongestionByRegion,
  congestionReliefMultiplier,
  nationalUrbanCongestionIndex,
} from '../productivity/congestion-relief-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 7 catalog', () => {
  it('meets 115+ assets, 35+ corridors, 53+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 115);
    assert.ok(TRANSPORT_CORRIDORS.length >= 35);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 53);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 7 systems', () => {
  it('returns agent12/37 with bulk export, dwell, and congestion relief', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(40), {
      congestionReliefPolicy: 'invest',
    });
    assert.equal(state.schemaVersion, 'agent12/37');
    assert.ok(state.nationalBulkExportThroughputIndex >= 20);
    assert.ok(state.nationalIntermodalDwellMedian >= 12 && state.nationalIntermodalDwellMedian <= 60);
    assert.ok(state.nationalUrbanCongestionIndex >= 18);
    assert.ok(state.bulkExportThroughputByRegion.WA > 25);
  });

  it('activates Pilbara lithium bulk export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(41));
    const pilbara = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_pilbara_lithium_bulk');
    assert.ok(pilbara?.active);
  });

  it('reflects congestion relief policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(42);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeUrbanCongestionByRegion(ops, 0.55);
    const index = nationalUrbanCongestionIndex(byRegion);
    const baseline = congestionReliefMultiplier(index, 'baseline');
    const priority = congestionReliefMultiplier(index, 'priority_freight');
    assert.ok(priority >= baseline);
  });

  it('computes bulk export from Hedland and heavy haul rail', () => {
    const inputs = defaultInfrastructureInputs(43);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeBulkExportThroughputByRegion(ops);
    const national = nationalBulkExportThroughputIndex(byRegion);
    assert.ok(byRegion.WA > 30);
    assert.ok(national >= 20);
  });

  it('weights intermodal dwell from gateway logistics hubs', () => {
    const inputs = defaultInfrastructureInputs(44);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeIntermodalDwellByRegion(ops, 0.6);
    const median = nationalIntermodalDwellMedian(byRegion);
    assert.ok(byRegion.NT > 10);
    assert.ok(median >= 12);
  });

  it('registers round-7 West Gate dwell crisis scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_vic_westgate_dwell_crisis');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'VIC');
  });
});
