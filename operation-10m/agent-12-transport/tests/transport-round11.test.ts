import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeDefenceLogisticsReadinessByRegion,
  defenceLogisticsProductivityMultiplier,
  nationalDefenceLogisticsReadinessIndex,
} from '../network/defence-logistics-readiness-index.ts';
import {
  computeWeatherResilienceRoutingByRegion,
  nationalWeatherResilienceRoutingIndex,
  weatherResilienceProductivityMultiplier,
} from '../operations/weather-resilience-routing-index.ts';
import {
  computeDigitalFreightThroughputByRegion,
  computeDigitalFreightVisibilityShare,
  digitalFreightProductivityMultiplier,
} from '../productivity/digital-freight-visibility-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 11 catalog', () => {
  it('meets 167+ assets, 47+ corridors, 73+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 167);
    assert.ok(TRANSPORT_CORRIDORS.length >= 47);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 73);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 11 systems', () => {
  it('returns agent12/25 with defence readiness, weather routing, and digital freight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(80), {
      defenceMobilityPolicy: 'mobilize',
      weatherResiliencePolicy: 'harden',
      digitalFreightPolicy: 'integrate',
    });
    assert.equal(state.schemaVersion, 'agent12/25');
    assert.ok(state.nationalDefenceLogisticsReadinessIndex >= 8);
    assert.ok(state.nationalWeatherResilienceRoutingIndex >= 38);
    assert.ok(state.digitalFreightVisibilityShare >= 0.07);
    assert.ok(state.defenceLogisticsReadinessByRegion.NT > 5);
  });

  it('activates northern defence mobility corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(81));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nt_defence_northern_mobility');
    assert.ok(corridor?.active);
  });

  it('reflects defence mobility policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(82);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDefenceLogisticsReadinessByRegion(ops);
    const national = nationalDefenceLogisticsReadinessIndex(byRegion);
    assert.ok(
      defenceLogisticsProductivityMultiplier(national, 'mobilize') >=
        defenceLogisticsProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes weather resilience routing from bypass assets', () => {
    const inputs = defaultInfrastructureInputs(83);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeWeatherResilienceRoutingByRegion(ops, 0.55);
    const national = nationalWeatherResilienceRoutingIndex(byRegion);
    assert.ok(byRegion.NSW > 40);
    assert.ok(national >= 38);
    assert.ok(weatherResilienceProductivityMultiplier(national, 'harden') >= 1);
  });

  it('computes digital freight visibility from telemetry hubs', () => {
    const inputs = defaultInfrastructureInputs(84);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDigitalFreightThroughputByRegion(ops);
    assert.ok(byRegion.VIC > 3);
    const share = computeDigitalFreightVisibilityShare(ops, 'integrate');
    assert.ok(share >= computeDigitalFreightVisibilityShare(ops, 'baseline'));
    assert.ok(digitalFreightProductivityMultiplier(share, 'integrate') >= 1);
  });

  it('registers round-11 NT defence mobility surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nt_defence_mobility_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NT');
  });
});
