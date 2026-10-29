import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  autonomousHeavyHaulProductivityMultiplier,
  computeAutonomousHeavyHaulByRegion,
  nationalAutonomousHeavyHaulIndex,
} from '../network/autonomous-heavy-haul-index.ts';
import {
  computeGbrBiosecurityLogisticsByRegion,
  computeGbrBiosecurityLogisticsShare,
  gbrBiosecurityLogisticsProductivityMultiplier,
  nationalGbrBiosecurityLogisticsIndex,
} from '../operations/gbr-biosecurity-logistics-index.ts';
import {
  computeNightUrbanFreightWindowShare,
  computeNightUrbanFreightWindowThroughputByRegion,
  nationalNightUrbanFreightWindowThroughputIndex,
  nightUrbanFreightWindowProductivityMultiplier,
} from '../productivity/night-urban-freight-window-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 23 catalog', () => {
  it('meets 325+ assets, 83+ corridors, 133+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 325);
    assert.ok(TRANSPORT_CORRIDORS.length >= 83);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 133);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 23 systems', () => {
  it('returns agent12/53 with auto haul, GBR biosecurity, night freight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(200), {
      autonomousHeavyHaulPolicy: 'deploy',
      gbrBiosecurityLogisticsPolicy: 'harden',
      nightUrbanFreightWindowPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/53');
    assert.ok(state.nationalAutonomousHeavyHaulIndex >= 6);
    assert.ok(state.nationalGbrBiosecurityLogisticsIndex >= 8);
    assert.ok(state.nightUrbanFreightWindowShare >= 0.03);
    assert.ok(state.autonomousHeavyHaulByRegion.WA > 8);
  });

  it('activates NSW–VIC night freight corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(201));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_night_freight_window');
    assert.ok(corridor?.active);
  });

  it('reflects autonomous haul policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(202);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAutonomousHeavyHaulByRegion(ops);
    const national = nationalAutonomousHeavyHaulIndex(byRegion);
    assert.ok(
      autonomousHeavyHaulProductivityMultiplier(national, 'deploy') >=
        autonomousHeavyHaulProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes GBR biosecurity from reef guard assets', () => {
    const inputs = defaultInfrastructureInputs(203);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGbrBiosecurityLogisticsByRegion(ops, 0.5);
    const national = nationalGbrBiosecurityLogisticsIndex(byRegion);
    assert.ok(byRegion.QLD > 8);
    assert.ok(national >= 8);
    const share = computeGbrBiosecurityLogisticsShare(ops, 'harden');
    assert.ok(share >= computeGbrBiosecurityLogisticsShare(ops, 'baseline'));
    assert.ok(gbrBiosecurityLogisticsProductivityMultiplier(share, 'harden') >= 1);
  });

  it('computes night urban freight from curfew assets', () => {
    const inputs = defaultInfrastructureInputs(204);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeNightUrbanFreightWindowThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.5);
    const share = computeNightUrbanFreightWindowShare(ops, 'expand');
    assert.ok(share >= computeNightUrbanFreightWindowShare(ops, 'baseline'));
    const national = nationalNightUrbanFreightWindowThroughputIndex(byRegion);
    assert.ok(nightUrbanFreightWindowProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 1.5);
  });

  it('registers round-23 autonomous haul surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_auto_haul_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
