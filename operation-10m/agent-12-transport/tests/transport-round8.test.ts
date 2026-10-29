import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeAviationCargoThroughputByRegion,
  nationalAviationCargoThroughputIndex,
} from '../network/aviation-cargo-throughput-index.ts';
import {
  computeCustomsClearanceByRegion,
  customsClearanceProductivityMultiplier,
  nationalCustomsClearanceIndex,
} from '../operations/customs-clearance-index.ts';
import {
  computeHydrogenCorridorThroughputByRegion,
  computeHydrogenFreightShare,
  hydrogenFreightProductivityMultiplier,
} from '../productivity/hydrogen-freight-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 8 catalog', () => {
  it('meets 128+ assets, 38+ corridors, 58+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 128);
    assert.ok(TRANSPORT_CORRIDORS.length >= 38);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 58);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 8 systems', () => {
  it('returns agent12/15 with aviation cargo, customs clearance, and hydrogen corridors', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(50), {
      hydrogenFreightPolicy: 'pipeline',
      customsModernizationPolicy: 'digitize',
    });
    assert.equal(state.schemaVersion, 'agent12/15');
    assert.ok(state.nationalAviationCargoThroughputIndex >= 9);
    assert.ok(state.nationalCustomsClearanceIndex >= 38);
    assert.ok(state.hydrogenFreightShare >= 0.04);
    assert.ok(state.aviationCargoThroughputByRegion.QLD > 8);
  });

  it('activates Kwinana hydrogen export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(51));
    const kwinana = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_kwinana_hydrogen_export');
    assert.ok(kwinana?.active);
  });

  it('reflects hydrogen freight policy in share and multiplier', () => {
    const inputs = defaultInfrastructureInputs(52);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const baseline = computeHydrogenFreightShare(ops, 'baseline');
    const pipeline = computeHydrogenFreightShare(ops, 'pipeline');
    assert.ok(pipeline >= baseline);
    assert.ok(hydrogenFreightProductivityMultiplier(pipeline, 'pipeline') >= 1);
  });

  it('computes aviation cargo from air freight hubs and gateways', () => {
    const inputs = defaultInfrastructureInputs(53);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAviationCargoThroughputByRegion(ops);
    const national = nationalAviationCargoThroughputIndex(byRegion);
    assert.ok(byRegion.NSW >= 9);
    assert.ok(national >= 9);
  });

  it('weights customs clearance from gateway ports and bond hubs', () => {
    const inputs = defaultInfrastructureInputs(54);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCustomsClearanceByRegion(ops, 0.55);
    const national = nationalCustomsClearanceIndex(byRegion);
    assert.ok(byRegion.QLD > 40);
    assert.ok(national >= 38);
    assert.ok(customsClearanceProductivityMultiplier(national, 'digitize') >= 1);
  });

  it('computes hydrogen corridor throughput from export chain assets', () => {
    const inputs = defaultInfrastructureInputs(55);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeHydrogenCorridorThroughputByRegion(ops);
    assert.ok(byRegion.WA > 5);
  });

  it('registers round-8 Brisbane air cargo backlog scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_qld_brisbane_air_cargo_backlog');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'QLD');
  });
});
