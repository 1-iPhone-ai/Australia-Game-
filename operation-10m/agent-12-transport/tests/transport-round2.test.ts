import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import { computePortRailCouplingByRegion } from '../network/port-rail-coupling.ts';
import { computeResilienceScoreByRegion, nationalResilienceIndex } from '../network/resilience-score.ts';
import { evaluateAllCorridors } from '../network/evaluate-corridors.ts';
import { projectMaintenanceBacklogNextTurn } from '../operations/maintenance-decay.ts';
import { computeScenarioStackFactor } from '../scenarios/scenario-stack-policy.ts';
import { resolveActiveScenarios } from '../scenarios/apply-transport-scenarios.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';
import { tierProductivityMultiplier } from '../productivity/regional-investment-tiers.ts';

describe('Agent 12 round 2 catalog growth', () => {
  it('reaches 61+ assets and 17+ corridors / 24+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 71);
    assert.ok(TRANSPORT_CORRIDORS.length >= 17);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 24);
  });
});

describe('Agent 12 round 2 analytics', () => {
  it('computes port–rail coupling for gateway regions', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(7));
    assert.ok(state.portRailCouplingByRegion.NSW > 20);
    assert.ok(state.portRailCouplingByRegion.VIC > 20);
  });

  it('assigns investment tiers with gateway uplift', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(8));
    assert.equal(state.investmentTierByRegion.NSW, 'national_gateway');
    assert.ok(tierProductivityMultiplier(state.investmentTierByRegion.WA) >= 1.02);
  });

  it('stacks multiple scenarios with factor > 1', () => {
    const scenarios = resolveActiveScenarios(
      new Set(['scn_nsw_flood_m1', 'scn_vic_port_strike', 'scn_qld_cyclone_coast']),
    );
    assert.ok(computeScenarioStackFactor(scenarios) > 1.1);
  });

  it('projects maintenance backlog drift and spend relief', () => {
    const ids = defaultInfrastructureInputs(1).operationalAssetIds;
    const highStress = projectMaintenanceBacklogNextTurn(new Map([['road_nsw_hume', 40]]), ids, {
      networkStress: 0.9,
      maintenanceSpendIndex: 10,
    });
    const lowStress = projectMaintenanceBacklogNextTurn(new Map([['road_nsw_hume', 40]]), ids, {
      networkStress: 0.1,
      maintenanceSpendIndex: 90,
    });
    assert.ok(highStress['road_nsw_hume'] > lowStress['road_nsw_hume']);
  });

  it('returns agent12/3 state with resilience and stack metadata', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(9), {
      activeScenarioIds: new Set(['scn_multi_coastal_compound', 'scn_national_fuel_spike']),
      maintenanceSpendIndex: 55,
    });
    assert.equal(state.schemaVersion, 'agent12/27');
    assert.ok(state.scenarioStackFactor > 1);
    assert.ok(nationalResilienceIndex(state.resilienceScoreByRegion) > 50);
    assert.ok(Object.keys(state.projectedBacklogNextTurn).length > 50);
  });

  it('activates round-2 hunter export corridor when assets present', () => {
    const ops = defaultInfrastructureInputs(1).assets;
    const activations = evaluateAllCorridors(ops);
    const hunter = activations.find((a) => a.corridorId === 'corr_hunter_export_chain');
    assert.ok(hunter?.active);
  });

  it('computes resilience scores from corridor coverage', () => {
    const ops = defaultInfrastructureInputs(1).assets.filter((a) => a.hostRegion === 'NSW');
    const corridors = evaluateAllCorridors(defaultInfrastructureInputs(1).assets);
    const scores = computeResilienceScoreByRegion(ops, corridors);
    assert.ok(scores.NSW >= 40);
  });
});
