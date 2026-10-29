import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  aluminaRefineryExportProductivityMultiplier,
  computeAluminaRefineryExportByRegion,
  nationalAluminaRefineryExportIndex,
} from '../network/alumina-refinery-export-index.ts';
import {
  computeDisasterReliefAirBridgeByRegion,
  computeDisasterReliefAirBridgeShare,
  disasterReliefAirBridgeProductivityMultiplier,
  nationalDisasterReliefAirBridgeIndex,
} from '../operations/disaster-relief-air-bridge-index.ts';
import {
  computeContainerYardAutomationShare,
  computeContainerYardAutomationThroughputByRegion,
  containerYardAutomationProductivityMultiplier,
  nationalContainerYardAutomationThroughputIndex,
} from '../productivity/container-yard-automation-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 29 catalog', () => {
  it('meets 403+ assets, 101+ corridors, 163+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 403);
    assert.ok(TRANSPORT_CORRIDORS.length >= 101);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 163);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 29 systems', () => {
  it('returns agent12/55 with alumina export, relief air bridge, yard automation', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(260), {
      aluminaRefineryExportPolicy: 'accelerate',
      disasterReliefAirBridgePolicy: 'surge',
      containerYardAutomationPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/55');
    assert.ok(state.nationalAluminaRefineryExportIndex >= 5);
    assert.ok(state.nationalDisasterReliefAirBridgeIndex >= 6);
    assert.ok(state.containerYardAutomationShare >= 0.03);
    assert.ok(state.aluminaRefineryExportByRegion.WA > 3 || state.aluminaRefineryExportByRegion.QLD > 3);
  });

  it('activates WA–QLD alumina export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(261));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_alumina_export');
    assert.ok(corridor?.active);
  });

  it('reflects alumina export policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(262);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAluminaRefineryExportByRegion(ops);
    const national = nationalAluminaRefineryExportIndex(byRegion);
    assert.ok(
      aluminaRefineryExportProductivityMultiplier(national, 'accelerate') >=
        aluminaRefineryExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes disaster relief air bridge from humanitarian assets', () => {
    const inputs = defaultInfrastructureInputs(263);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDisasterReliefAirBridgeByRegion(ops, 0.5);
    const national = nationalDisasterReliefAirBridgeIndex(byRegion);
    assert.ok(byRegion.QLD > 6 || byRegion.NSW > 6);
    assert.ok(national >= 6);
    const share = computeDisasterReliefAirBridgeShare(ops, 'surge');
    assert.ok(share >= computeDisasterReliefAirBridgeShare(ops, 'baseline'));
    assert.ok(disasterReliefAirBridgeProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes yard automation from straddle-crane assets', () => {
    const inputs = defaultInfrastructureInputs(264);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeContainerYardAutomationThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeContainerYardAutomationShare(ops, 'deploy');
    assert.ok(share >= computeContainerYardAutomationShare(ops, 'baseline'));
    const national = nationalContainerYardAutomationThroughputIndex(byRegion);
    assert.ok(containerYardAutomationProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-29 alumina export rush scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_alumina_export_rush');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
