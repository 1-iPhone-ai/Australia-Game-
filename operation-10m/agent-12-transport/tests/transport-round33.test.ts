import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeGreenIronPelletExportByRegion,
  greenIronPelletExportProductivityMultiplier,
  nationalGreenIronPelletExportIndex,
} from '../network/green-iron-pellet-export-index.ts';
import {
  computeFloodLeveeRailProtectionByRegion,
  computeFloodLeveeRailProtectionShare,
  floodLeveeRailProtectionProductivityMultiplier,
  nationalFloodLeveeRailProtectionIndex,
} from '../operations/flood-levee-rail-protection-index.ts';
import {
  computePortZeroEmissionDrayageShare,
  computePortZeroEmissionDrayageThroughputByRegion,
  nationalPortZeroEmissionDrayageThroughputIndex,
  portZeroEmissionDrayageProductivityMultiplier,
} from '../productivity/port-zero-emission-drayage-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 33 catalog', () => {
  it('meets 455+ assets, 113+ corridors, 183+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 455);
    assert.ok(TRANSPORT_CORRIDORS.length >= 113);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 183);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 33 systems', () => {
  it('returns agent12/50 with green pellet, flood levee, zero drayage', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(300), {
      greenIronPelletExportPolicy: 'accelerate',
      floodLeveeRailProtectionPolicy: 'harden',
      portZeroEmissionDrayagePolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/50');
    assert.ok(state.nationalGreenIronPelletExportIndex >= 5);
    assert.ok(state.nationalFloodLeveeRailProtectionIndex >= 6);
    assert.ok(state.portZeroEmissionDrayageShare >= 0.03);
    assert.ok(state.greenIronPelletExportByRegion.WA > 3 || state.greenIronPelletExportByRegion.QLD > 3);
  });

  it('activates WA–QLD green pellet corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(301));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_green_pellet');
    assert.ok(corridor?.active);
  });

  it('reflects green pellet policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(302);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGreenIronPelletExportByRegion(ops);
    const national = nationalGreenIronPelletExportIndex(byRegion);
    assert.ok(
      greenIronPelletExportProductivityMultiplier(national, 'accelerate') >=
        greenIronPelletExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes flood levee protection from hardened assets', () => {
    const inputs = defaultInfrastructureInputs(303);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeFloodLeveeRailProtectionByRegion(ops, 0.5);
    const national = nationalFloodLeveeRailProtectionIndex(byRegion);
    assert.ok(byRegion.NSW > 5.5 || byRegion.QLD >= 6);
    assert.ok(national >= 6);
    const share = computeFloodLeveeRailProtectionShare(ops, 'harden');
    assert.ok(share >= computeFloodLeveeRailProtectionShare(ops, 'baseline'));
    assert.ok(floodLeveeRailProtectionProductivityMultiplier(share, 'harden') >= 1);
  });

  it('computes zero-emission drayage from port gate assets', () => {
    const inputs = defaultInfrastructureInputs(304);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortZeroEmissionDrayageThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computePortZeroEmissionDrayageShare(ops, 'expand');
    assert.ok(share >= computePortZeroEmissionDrayageShare(ops, 'baseline'));
    const national = nationalPortZeroEmissionDrayageThroughputIndex(byRegion);
    assert.ok(portZeroEmissionDrayageProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-33 green pellet surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_green_pellet_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
