import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeVanadiumFlowBatteryExportByRegion,
  nationalVanadiumFlowBatteryExportIndex,
  vanadiumFlowBatteryExportProductivityMultiplier,
} from '../network/vanadium-flow-battery-export-index.ts';
import {
  computeBushfireEvacuationRailBridgeByRegion,
  computeBushfireEvacuationRailBridgeShare,
  bushfireEvacuationRailBridgeProductivityMultiplier,
  nationalBushfireEvacuationRailBridgeIndex,
} from '../operations/bushfire-evacuation-rail-bridge-index.ts';
import {
  computeAutomatedGrainSiloRailLoadoutShare,
  computeAutomatedGrainSiloRailLoadoutThroughputByRegion,
  automatedGrainSiloRailLoadoutProductivityMultiplier,
  nationalAutomatedGrainSiloRailLoadoutThroughputIndex,
} from '../productivity/automated-grain-silo-rail-loadout-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 32 catalog', () => {
  it('meets 442+ assets, 110+ corridors, 178+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 442);
    assert.ok(TRANSPORT_CORRIDORS.length >= 110);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 178);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 32 systems', () => {
  it('returns agent12/42 with vanadium flow, bushfire evac, grain silo auto', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(290), {
      vanadiumFlowBatteryExportPolicy: 'accelerate',
      bushfireEvacuationRailBridgePolicy: 'surge',
      automatedGrainSiloRailLoadoutPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/42');
    assert.ok(state.nationalVanadiumFlowBatteryExportIndex >= 5);
    assert.ok(state.nationalBushfireEvacuationRailBridgeIndex >= 6);
    assert.ok(state.automatedGrainSiloRailLoadoutShare >= 0.03);
    assert.ok(state.vanadiumFlowBatteryExportByRegion.WA > 3 || state.vanadiumFlowBatteryExportByRegion.SA > 3);
  });

  it('activates WA–SA vanadium flow corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(291));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_vanadium_flow');
    assert.ok(corridor?.active);
  });

  it('reflects vanadium export policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(292);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeVanadiumFlowBatteryExportByRegion(ops);
    const national = nationalVanadiumFlowBatteryExportIndex(byRegion);
    assert.ok(
      vanadiumFlowBatteryExportProductivityMultiplier(national, 'accelerate') >=
        vanadiumFlowBatteryExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes bushfire evac rail from emergency assets', () => {
    const inputs = defaultInfrastructureInputs(293);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeBushfireEvacuationRailBridgeByRegion(ops, 0.5);
    const national = nationalBushfireEvacuationRailBridgeIndex(byRegion);
    assert.ok(byRegion.NSW > 6 || byRegion.VIC > 6);
    assert.ok(national >= 6);
    const share = computeBushfireEvacuationRailBridgeShare(ops, 'surge');
    assert.ok(share >= computeBushfireEvacuationRailBridgeShare(ops, 'baseline'));
    assert.ok(bushfireEvacuationRailBridgeProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes grain silo loadout from harvest staging assets', () => {
    const inputs = defaultInfrastructureInputs(294);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAutomatedGrainSiloRailLoadoutThroughputByRegion(ops);
    assert.ok(byRegion.SA > 0.2 || byRegion.VIC > 0.2);
    const share = computeAutomatedGrainSiloRailLoadoutShare(ops, 'deploy');
    assert.ok(share >= computeAutomatedGrainSiloRailLoadoutShare(ops, 'baseline'));
    const national = nationalAutomatedGrainSiloRailLoadoutThroughputIndex(byRegion);
    assert.ok(automatedGrainSiloRailLoadoutProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 1.9);
  });

  it('registers round-32 vanadium export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_vanadium_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
