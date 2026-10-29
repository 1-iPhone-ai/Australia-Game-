import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeGreenSteelExportByRegion,
  greenSteelExportProductivityMultiplier,
  nationalGreenSteelExportIndex,
} from '../network/green-steel-export-index.ts';
import {
  computeIndigenousCommunityAirliftByRegion,
  computeIndigenousCommunityAirliftShare,
  indigenousCommunityAirliftProductivityMultiplier,
  nationalIndigenousCommunityAirliftIndex,
} from '../operations/indigenous-community-airlift-index.ts';
import {
  computePortBerthSlotOptimizerShare,
  computePortBerthSlotOptimizerThroughputByRegion,
  nationalPortBerthSlotOptimizerThroughputIndex,
  portBerthSlotOptimizerProductivityMultiplier,
} from '../productivity/port-berth-slot-optimizer-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 26 catalog', () => {
  it('meets 364+ assets, 92+ corridors, 148+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 364);
    assert.ok(TRANSPORT_CORRIDORS.length >= 92);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 148);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 26 systems', () => {
  it('returns agent12/28 with green steel, indigenous airlift, berth slots', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(230), {
      greenSteelExportPolicy: 'accelerate',
      indigenousCommunityAirliftPolicy: 'expand',
      portBerthSlotOptimizerPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/28');
    assert.ok(state.nationalGreenSteelExportIndex >= 5);
    assert.ok(state.nationalIndigenousCommunityAirliftIndex >= 5);
    assert.ok(state.portBerthSlotOptimizerShare >= 0.03);
    assert.ok(state.greenSteelExportByRegion.WA > 3 || state.greenSteelExportByRegion.SA > 3);
  });

  it('activates WA–SA green steel export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(231));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_green_steel_export');
    assert.ok(corridor?.active);
  });

  it('reflects green steel export policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(232);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGreenSteelExportByRegion(ops);
    const national = nationalGreenSteelExportIndex(byRegion);
    assert.ok(
      greenSteelExportProductivityMultiplier(national, 'accelerate') >=
        greenSteelExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes indigenous airlift from bush runway assets', () => {
    const inputs = defaultInfrastructureInputs(233);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeIndigenousCommunityAirliftByRegion(ops, 0.5);
    const national = nationalIndigenousCommunityAirliftIndex(byRegion);
    assert.ok(byRegion.NT > 5 || byRegion.WA > 5);
    assert.ok(national >= 5);
    const share = computeIndigenousCommunityAirliftShare(ops, 'expand');
    assert.ok(share >= computeIndigenousCommunityAirliftShare(ops, 'baseline'));
    assert.ok(indigenousCommunityAirliftProductivityMultiplier(share, 'expand') >= 1);
  });

  it('computes berth slot optimizer from tidal window assets', () => {
    const inputs = defaultInfrastructureInputs(234);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortBerthSlotOptimizerThroughputByRegion(ops);
    assert.ok(byRegion.QLD > 0.2 || byRegion.NSW > 0.2);
    const share = computePortBerthSlotOptimizerShare(ops, 'deploy');
    assert.ok(share >= computePortBerthSlotOptimizerShare(ops, 'baseline'));
    const national = nationalPortBerthSlotOptimizerThroughputIndex(byRegion);
    assert.ok(portBerthSlotOptimizerProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-26 green steel export rush scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_green_steel_export_rush');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
