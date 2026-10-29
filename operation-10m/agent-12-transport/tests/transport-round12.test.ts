import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeCriticalMineralsExportByRegion,
  criticalMineralsProductivityMultiplier,
  nationalCriticalMineralsExportIndex,
} from '../network/critical-minerals-export-index.ts';
import {
  channelMaintenanceProductivityMultiplier,
  computeChannelMaintenanceByRegion,
  nationalChannelMaintenanceIndex,
} from '../operations/channel-maintenance-index.ts';
import {
  computeIndigenousRemoteSupplyShare,
  computeIndigenousRemoteSupplyThroughputByRegion,
  indigenousRemoteSupplyProductivityMultiplier,
} from '../productivity/indigenous-remote-supply-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 12 catalog', () => {
  it('meets 180+ assets, 50+ corridors, 78+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 180);
    assert.ok(TRANSPORT_CORRIDORS.length >= 50);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 78);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 12 systems', () => {
  it('returns agent12/45 with critical minerals, channel maintenance, indigenous remote supply', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(90), {
      criticalMineralsPolicy: 'accelerate',
      channelMaintenancePolicy: 'dredge',
      indigenousRemoteSupplyPolicy: 'strengthen',
    });
    assert.equal(state.schemaVersion, 'agent12/45');
    assert.ok(state.nationalCriticalMineralsExportIndex >= 10);
    assert.ok(state.nationalChannelMaintenanceIndex >= 40);
    assert.ok(state.indigenousRemoteSupplyShare >= 0.08);
    assert.ok(state.criticalMineralsExportByRegion.WA > 8);
  });

  it('activates Pilbara critical minerals export corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(91));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_pilbara_critical_minerals');
    assert.ok(corridor?.active);
  });

  it('reflects critical minerals policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(92);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCriticalMineralsExportByRegion(ops);
    const national = nationalCriticalMineralsExportIndex(byRegion);
    assert.ok(
      criticalMineralsProductivityMultiplier(national, 'accelerate') >=
        criticalMineralsProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes channel maintenance from dredging and pilotage ports', () => {
    const inputs = defaultInfrastructureInputs(93);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeChannelMaintenanceByRegion(ops, 0.5);
    const national = nationalChannelMaintenanceIndex(byRegion);
    assert.ok(byRegion.QLD > 42);
    assert.ok(national >= 40);
    assert.ok(channelMaintenanceProductivityMultiplier(national, 'dredge') >= 1);
  });

  it('computes indigenous remote supply from community corridors', () => {
    const inputs = defaultInfrastructureInputs(94);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeIndigenousRemoteSupplyThroughputByRegion(ops);
    assert.ok(byRegion.NT > 2);
    const share = computeIndigenousRemoteSupplyShare(ops, 'strengthen');
    assert.ok(share >= computeIndigenousRemoteSupplyShare(ops, 'baseline'));
    assert.ok(indigenousRemoteSupplyProductivityMultiplier(share, 'strengthen') >= 1);
  });

  it('registers round-12 WA lithium export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_lithium_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
