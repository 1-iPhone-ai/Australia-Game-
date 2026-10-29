import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  coastalShippingProductivityMultiplier,
  computeCoastalShippingThroughputByRegion,
  nationalCoastalShippingThroughputIndex,
} from '../network/coastal-shipping-throughput-index.ts';
import {
  biosecurityClearanceProductivityMultiplier,
  computeBiosecurityClearanceByRegion,
  nationalBiosecurityClearanceIndex,
} from '../operations/biosecurity-clearance-index.ts';
import {
  autonomousFreightProductivityMultiplier,
  computeAutonomousCorridorThroughputByRegion,
  computeAutonomousFreightShare,
} from '../productivity/autonomous-freight-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 9 catalog', () => {
  it('meets 141+ assets, 41+ corridors, 63+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 141);
    assert.ok(TRANSPORT_CORRIDORS.length >= 41);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 63);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 9 systems', () => {
  it('returns agent12/16 with coastal shipping, biosecurity, and autonomous freight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(60), {
      coastalShippingPolicy: 'short_sea_boost',
      biosecurityStreamlinePolicy: 'preclear',
      autonomousFreightPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/16');
    assert.ok(state.nationalCoastalShippingThroughputIndex >= 10);
    assert.ok(state.nationalBiosecurityClearanceIndex >= 38);
    assert.ok(state.autonomousFreightShare >= 0.05);
    assert.ok(state.coastalShippingThroughputByRegion.TAS > 8);
  });

  it('activates Bass Strait short-sea corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(61));
    const bass = state.activeCorridors.find((c) => c.corridorId === 'corr_tas_bass_short_sea');
    assert.ok(bass?.active);
  });

  it('reflects coastal shipping policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(62);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCoastalShippingThroughputByRegion(ops);
    const national = nationalCoastalShippingThroughputIndex(byRegion);
    assert.ok(
      coastalShippingProductivityMultiplier(national, 'short_sea_boost') >=
        coastalShippingProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes biosecurity clearance from quarantine hubs', () => {
    const inputs = defaultInfrastructureInputs(63);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeBiosecurityClearanceByRegion(ops, 0.52);
    const national = nationalBiosecurityClearanceIndex(byRegion);
    assert.ok(byRegion.QLD > 42);
    assert.ok(national >= 38);
    assert.ok(biosecurityClearanceProductivityMultiplier(national, 'preclear') >= 1);
  });

  it('computes autonomous corridor throughput from smart freight assets', () => {
    const inputs = defaultInfrastructureInputs(64);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAutonomousCorridorThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 3);
    const share = computeAutonomousFreightShare(ops, 'deploy');
    assert.ok(share >= computeAutonomousFreightShare(ops, 'baseline'));
    assert.ok(autonomousFreightProductivityMultiplier(share, 'deploy') >= 1);
  });

  it('registers round-9 Bass Strait short-sea delay scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_tas_bass_short_sea_delay');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'TAS');
  });
});
