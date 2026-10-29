import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeSustainableAviationFuelSupplyByRegion,
  nationalSustainableAviationFuelSupplyIndex,
  sustainableAviationFuelSupplyProductivityMultiplier,
} from '../network/sustainable-aviation-fuel-supply-index.ts';
import {
  computeOutbackDieselSecurityByRegion,
  computeOutbackDieselSecurityShare,
  nationalOutbackDieselSecurityIndex,
  outbackDieselSecurityProductivityMultiplier,
} from '../operations/outback-diesel-security-logistics-index.ts';
import {
  computeRailDoubleStackContainerShare,
  computeRailDoubleStackContainerThroughputByRegion,
  nationalRailDoubleStackContainerThroughputIndex,
  railDoubleStackContainerProductivityMultiplier,
} from '../productivity/rail-double-stack-container-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 25 catalog', () => {
  it('meets 351+ assets, 89+ corridors, 143+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 351);
    assert.ok(TRANSPORT_CORRIDORS.length >= 89);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 143);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 25 systems', () => {
  it('returns agent12/28 with SAF supply, outback diesel, double-stack rail', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(220), {
      sustainableAviationFuelSupplyPolicy: 'expand',
      outbackDieselSecurityPolicy: 'harden',
      railDoubleStackContainerPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/28');
    assert.ok(state.nationalSustainableAviationFuelSupplyIndex >= 5);
    assert.ok(state.nationalOutbackDieselSecurityIndex >= 5);
    assert.ok(state.railDoubleStackContainerShare >= 0.03);
    assert.ok(state.sustainableAviationFuelSupplyByRegion.QLD > 3 || state.sustainableAviationFuelSupplyByRegion.NSW > 3);
  });

  it('activates QLD–NSW SAF blending corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(221));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_qld_nsw_saf_blending');
    assert.ok(corridor?.active);
  });

  it('reflects SAF supply policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(222);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSustainableAviationFuelSupplyByRegion(ops);
    const national = nationalSustainableAviationFuelSupplyIndex(byRegion);
    assert.ok(
      sustainableAviationFuelSupplyProductivityMultiplier(national, 'expand') >=
        sustainableAviationFuelSupplyProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes outback diesel security from haul-road assets', () => {
    const inputs = defaultInfrastructureInputs(223);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeOutbackDieselSecurityByRegion(ops, 0.5);
    const national = nationalOutbackDieselSecurityIndex(byRegion);
    assert.ok(byRegion.NT > 5 || byRegion.WA > 5);
    assert.ok(national >= 5);
    const share = computeOutbackDieselSecurityShare(ops, 'harden');
    assert.ok(share >= computeOutbackDieselSecurityShare(ops, 'baseline'));
    assert.ok(outbackDieselSecurityProductivityMultiplier(share, 'harden') >= 1);
  });

  it('computes double-stack container from clearance-gauge assets', () => {
    const inputs = defaultInfrastructureInputs(224);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRailDoubleStackContainerThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeRailDoubleStackContainerShare(ops, 'deploy');
    assert.ok(share >= computeRailDoubleStackContainerShare(ops, 'baseline'));
    const national = nationalRailDoubleStackContainerThroughputIndex(byRegion);
    assert.ok(railDoubleStackContainerProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 1.8);
  });

  it('registers round-25 SAF blending rush scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_qld_saf_blending_rush');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'QLD');
  });
});
