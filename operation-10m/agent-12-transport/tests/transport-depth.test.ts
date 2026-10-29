import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import { getAgent12TransportCatalog, getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { conditionFromMaintenanceBacklog } from '../operations/maintenance-backlog.ts';
import { evaluateAllCorridors } from '../network/evaluate-corridors.ts';
import { listScenarioIds, enrichInputsWithScenarios } from '../scenarios/apply-transport-scenarios.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';
import { computeIntermodalSynergyByRegion } from '../productivity/intermodal-synergy.ts';

describe('Agent 12 scale wave catalogs', () => {
  it('expands asset catalog beyond baseline 37', () => {
    const report = getCatalogIntegrityReport();
    assert.ok(report.totalAssets >= 71);
    assert.equal(report.duplicateIds.length, 0);
  });

  it('defines corridors and scenarios libraries', () => {
    assert.ok(TRANSPORT_CORRIDORS.length >= 10);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 14);
    assert.equal(listScenarioIds().length, TRANSPORT_STRESS_SCENARIOS.length);
  });
});

describe('Agent 12 maintenance and scenarios', () => {
  it('maps maintenance backlog to conditions', () => {
    assert.equal(conditionFromMaintenanceBacklog(5), 'excellent');
    assert.equal(conditionFromMaintenanceBacklog(40), 'fair');
    assert.equal(conditionFromMaintenanceBacklog(90), 'closed');
  });

  it('applies flood scenario to NSW road utilization', () => {
    const base = defaultInfrastructureInputs(20);
    const { inputs, appliedScenarioIds } = enrichInputsWithScenarios(
      base,
      new Set(['scn_nsw_flood_m1']),
    );
    assert.deepEqual(appliedScenarioIds, ['scn_nsw_flood_m1']);
    assert.ok((inputs.networkUtilization?.freight ?? 0) >= 0.2);
  });

  it('reduces productivity under deferred maintenance wave', () => {
    const baseline = computeTransportInfrastructureState(defaultInfrastructureInputs(1));
    const stressed = computeTransportInfrastructureState(defaultInfrastructureInputs(1), {
      activeScenarioIds: new Set(['scn_deferred_maintenance_wave']),
    });
    assert.ok(stressed.productivity.nationalProductivityIndexBonus < baseline.productivity.nationalProductivityIndexBonus);
  });
});

describe('Agent 12 corridors and intermodal synergy', () => {
  it('activates east coast freight corridor on full catalog', () => {
    const ops = getAgent12TransportCatalog();
    const activations = evaluateAllCorridors(ops);
    const east = activations.find((a) => a.corridorId === 'corr_east_coast_freight');
    assert.ok(east);
    assert.equal(east.active, true);
  });

  it('awards intermodal synergy when four categories present in region', () => {
    const ops = getAgent12TransportCatalog().filter((a) => a.hostRegion === 'NSW');
    const synergy = computeIntermodalSynergyByRegion(ops);
    assert.ok(synergy.NSW >= 3);
  });

  it('returns infrastructure state schema agent12/2 with corridor synergy', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(3));
    assert.equal(state.schemaVersion, 'agent12/6');
    assert.ok(state.corridorSynergyPoints > 0);
    assert.ok(state.activeCorridors.some((c) => c.active));
    assert.ok(state.productivity.nationalProductivityIndexBonus > 100);
  });
});

describe('Agent 12 bottleneck detection', () => {
  it('flags critical maintenance backlog assets', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(4), {
      maintenanceBacklogByAssetId: new Map([['road_nt_stuart', 85]]),
    });
    assert.ok(state.maintenanceWarnings.some((w) => w.includes('road_nt_stuart')));
    assert.ok(state.bottleneckAssetIds.includes('road_nt_stuart'));
  });
});
