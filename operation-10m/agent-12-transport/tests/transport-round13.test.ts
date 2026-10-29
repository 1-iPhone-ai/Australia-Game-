import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeGaugeInteroperabilityByRegion,
  gaugeInteroperabilityProductivityMultiplier,
  nationalGaugeInteroperabilityIndex,
} from '../network/gauge-interoperability-index.ts';
import {
  computeDisasterRecoveryStagingByRegion,
  disasterRecoveryStagingProductivityMultiplier,
  nationalDisasterRecoveryStagingIndex,
} from '../operations/disaster-recovery-staging-index.ts';
import {
  circularFreightProductivityMultiplier,
  computeCircularFreightShare,
  computeCircularFreightThroughputByRegion,
} from '../productivity/circular-freight-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 13 catalog', () => {
  it('meets 193+ assets, 53+ corridors, 83+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 193);
    assert.ok(TRANSPORT_CORRIDORS.length >= 53);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 83);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 13 systems', () => {
  it('returns agent12/56 with gauge interoperability, disaster staging, circular freight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(100), {
      gaugeInteroperabilityPolicy: 'harmonize',
      disasterRecoveryStagingPolicy: 'surge',
      circularFreightPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/56');
    assert.ok(state.nationalGaugeInteroperabilityIndex >= 12);
    assert.ok(state.nationalDisasterRecoveryStagingIndex >= 37);
    assert.ok(state.circularFreightShare >= 0.06);
    assert.ok(state.gaugeInteroperabilityByRegion.SA > 10);
  });

  it('activates Adelaide gauge interoperability corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(101));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_sa_adelaide_gauge_bridge');
    assert.ok(corridor?.active);
  });

  it('reflects gauge policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(102);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGaugeInteroperabilityByRegion(ops);
    const national = nationalGaugeInteroperabilityIndex(byRegion);
    assert.ok(
      gaugeInteroperabilityProductivityMultiplier(national, 'harmonize') >=
        gaugeInteroperabilityProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes disaster recovery staging from emergency yards', () => {
    const inputs = defaultInfrastructureInputs(103);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDisasterRecoveryStagingByRegion(ops, 0.52);
    const national = nationalDisasterRecoveryStagingIndex(byRegion);
    assert.ok(byRegion.NSW > 37);
    assert.ok(national >= 37);
    assert.ok(disasterRecoveryStagingProductivityMultiplier(national, 'surge') >= 1);
  });

  it('computes circular freight from waste logistics assets', () => {
    const inputs = defaultInfrastructureInputs(104);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCircularFreightThroughputByRegion(ops);
    assert.ok(byRegion.VIC > 2);
    const share = computeCircularFreightShare(ops, 'expand');
    assert.ok(share >= computeCircularFreightShare(ops, 'baseline'));
    assert.ok(circularFreightProductivityMultiplier(share, 'expand') >= 1);
  });

  it('registers round-13 SA gauge break delay scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_sa_gauge_break_delay');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'SA');
  });
});
