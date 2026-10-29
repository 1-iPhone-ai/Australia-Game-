import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeNickelCobaltBatteryPrecursorByRegion,
  nationalNickelCobaltBatteryPrecursorIndex,
  nickelCobaltBatteryPrecursorProductivityMultiplier,
} from '../network/nickel-cobalt-battery-precursor-index.ts';
import {
  computeRemoteIslandSealiftByRegion,
  computeRemoteIslandSealiftShare,
  nationalRemoteIslandSealiftIndex,
  remoteIslandSealiftProductivityMultiplier,
} from '../operations/remote-island-sealift-index.ts';
import {
  computeRailInlandTerminalAutomationShare,
  computeRailInlandTerminalAutomationThroughputByRegion,
  nationalRailInlandTerminalAutomationThroughputIndex,
  railInlandTerminalAutomationProductivityMultiplier,
} from '../productivity/rail-inland-terminal-automation-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 30 catalog', () => {
  it('meets 416+ assets, 104+ corridors, 168+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 416);
    assert.ok(TRANSPORT_CORRIDORS.length >= 104);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 168);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 30 systems', () => {
  it('returns agent12/42 with nickel precursor, island sealift, inland terminal auto', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(270), {
      nickelCobaltBatteryPrecursorPolicy: 'accelerate',
      remoteIslandSealiftPolicy: 'surge',
      railInlandTerminalAutomationPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/42');
    assert.ok(state.nationalNickelCobaltBatteryPrecursorIndex >= 5);
    assert.ok(state.nationalRemoteIslandSealiftIndex >= 6);
    assert.ok(state.railInlandTerminalAutomationShare >= 0.03);
    assert.ok(state.nickelCobaltBatteryPrecursorByRegion.WA > 3 || state.nickelCobaltBatteryPrecursorByRegion.NSW > 3);
  });

  it('activates WA–NSW nickel precursor corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(271));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_nsw_nickel_precursor');
    assert.ok(corridor?.active);
  });

  it('reflects nickel precursor policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(272);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeNickelCobaltBatteryPrecursorByRegion(ops);
    const national = nationalNickelCobaltBatteryPrecursorIndex(byRegion);
    assert.ok(
      nickelCobaltBatteryPrecursorProductivityMultiplier(national, 'accelerate') >=
        nickelCobaltBatteryPrecursorProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes remote island sealift from Pacific staging assets', () => {
    const inputs = defaultInfrastructureInputs(273);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteIslandSealiftByRegion(ops, 0.5);
    const national = nationalRemoteIslandSealiftIndex(byRegion);
    assert.ok(byRegion.QLD > 6 || byRegion.TAS > 6);
    assert.ok(national >= 6);
    const share = computeRemoteIslandSealiftShare(ops, 'surge');
    assert.ok(share >= computeRemoteIslandSealiftShare(ops, 'baseline'));
    assert.ok(remoteIslandSealiftProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes inland terminal automation from gantry assets', () => {
    const inputs = defaultInfrastructureInputs(274);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRailInlandTerminalAutomationThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeRailInlandTerminalAutomationShare(ops, 'deploy');
    assert.ok(share >= computeRailInlandTerminalAutomationShare(ops, 'baseline'));
    const national = nationalRailInlandTerminalAutomationThroughputIndex(byRegion);
    assert.ok(railInlandTerminalAutomationProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 1.8);
  });

  it('registers round-30 nickel precursor surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_nickel_precursor_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
