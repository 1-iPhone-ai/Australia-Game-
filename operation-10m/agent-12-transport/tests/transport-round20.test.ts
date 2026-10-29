import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeOffshoreCcsLogisticsByRegion,
  nationalOffshoreCcsLogisticsIndex,
  offshoreCcsLogisticsProductivityMultiplier,
} from '../network/offshore-ccs-logistics-index.ts';
import {
  computeHydrogenLngExportByRegion,
  hydrogenLngExportProductivityMultiplier,
  nationalHydrogenLngExportIndex,
} from '../operations/hydrogen-lng-export-index.ts';
import {
  computeUrbanMicrofreightHubShare,
  computeUrbanMicrofreightHubThroughputByRegion,
  nationalUrbanMicrofreightHubThroughputIndex,
  urbanMicrofreightHubProductivityMultiplier,
} from '../productivity/urban-microfreight-hub-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 20 catalog', () => {
  it('meets 285+ assets, 74+ corridors, 118+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 285);
    assert.ok(TRANSPORT_CORRIDORS.length >= 74);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 118);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 20 systems', () => {
  it('returns agent12/52 with offshore CCS, H2 LNG, urban microfreight', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(170), {
      offshoreCcsLogisticsPolicy: 'deploy',
      hydrogenLngExportPolicy: 'accelerate',
      urbanMicrofreightHubPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/52');
    assert.ok(state.nationalOffshoreCcsLogisticsIndex >= 5);
    assert.ok(state.nationalHydrogenLngExportIndex >= 11);
    assert.ok(state.urbanMicrofreightHubShare >= 0.035);
    assert.ok(state.offshoreCcsLogisticsByRegion.WA > 4);
  });

  it('activates QLD–NSW H2 LNG export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(171));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_qld_nsw_h2_lng_export');
    assert.ok(corridor?.active);
  });

  it('reflects offshore CCS policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(172);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeOffshoreCcsLogisticsByRegion(ops);
    const national = nationalOffshoreCcsLogisticsIndex(byRegion);
    assert.ok(
      offshoreCcsLogisticsProductivityMultiplier(national, 'deploy') >=
        offshoreCcsLogisticsProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes hydrogen LNG export from cryogenic assets', () => {
    const inputs = defaultInfrastructureInputs(173);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeHydrogenLngExportByRegion(ops, 0.5);
    const national = nationalHydrogenLngExportIndex(byRegion);
    assert.ok(byRegion.QLD > 11);
    assert.ok(national >= 11);
    assert.ok(hydrogenLngExportProductivityMultiplier(national, 'accelerate') >= 1);
  });

  it('computes urban microfreight from hub assets', () => {
    const inputs = defaultInfrastructureInputs(174);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeUrbanMicrofreightHubThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 2 || byRegion.VIC > 2);
    const share = computeUrbanMicrofreightHubShare(ops, 'expand');
    assert.ok(share >= computeUrbanMicrofreightHubShare(ops, 'baseline'));
    const national = nationalUrbanMicrofreightHubThroughputIndex(byRegion);
    assert.ok(urbanMicrofreightHubProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-20 CCS injection surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_ccs_injection_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
