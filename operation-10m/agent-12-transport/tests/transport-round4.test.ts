import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import { computeFreightLatencyByRegion } from '../network/freight-latency-index.ts';
import { computeDisruptionRecovery } from '../operations/disruption-recovery.ts';
import { computeSupplyChainResilienceIndex } from '../productivity/supply-chain-resilience.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';
import type { AuRegionCode } from '../types.ts';
import { AU_REGION_CODES } from '../types.ts';

describe('Agent 12 round 4 catalog', () => {
  it('meets 80+ assets, 26+ corridors, 38+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 80);
    assert.ok(TRANSPORT_CORRIDORS.length >= 26);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 38);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 4 systems', () => {
  it('returns agent12/36 with latency, SCRI, and recovery', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(20), {
      seasonalDemandBand: 'normal',
    });
    assert.equal(state.schemaVersion, 'agent12/36');
    assert.ok(state.nationalFreightLatencyMedian > 0 && state.nationalFreightLatencyMedian < 40);
    assert.ok(state.supplyChainResilienceIndex >= 0.2);
    assert.ok(state.disruptionRecoveryFactor >= 0.15);
    assert.ok(AU_REGION_CODES.includes(state.weakestSupplyChainRegion));
  });

  it('activates Blue Mountains intercapital corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(21));
    const pass = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_blue_mountains_pass');
    assert.ok(pass?.active);
  });

  it('raises freight latency under peak seasonal demand', () => {
    const normal = computeTransportInfrastructureState(defaultInfrastructureInputs(22), {
      seasonalDemandBand: 'normal',
    });
    const peak = computeTransportInfrastructureState(defaultInfrastructureInputs(22), {
      seasonalDemandBand: 'peak',
    });
    assert.ok(peak.nationalFreightLatencyMedian >= normal.nationalFreightLatencyMedian);
  });

  it('computes disruption recovery from logistics hubs', () => {
    const inputs = defaultInfrastructureInputs(1);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const resilience = {} as Record<AuRegionCode, number>;
    for (const r of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as AuRegionCode[]) {
      resilience[r] = 0.4;
    }
    const recovery = computeDisruptionRecovery(ops, resilience, 2);
    assert.ok(recovery.logisticsHubCount >= 5);
    assert.ok(recovery.nationalRecoveryFactor > 0.4);
  });

  it('scores supply chain resilience with latency penalty', () => {
    const inputs = defaultInfrastructureInputs(1);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const latency = computeFreightLatencyByRegion(ops, 0.85);
    const resilience = {} as Record<AuRegionCode, number>;
    for (const r of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as AuRegionCode[]) {
      resilience[r] = 0.55;
    }
    const scri = computeSupplyChainResilienceIndex({
      resilienceScoreByRegion: resilience,
      freightLatencyByRegion: latency,
      recoveryFactor: 0.6,
      corridorSynergyPoints: 40,
    });
    assert.ok(scri.nationalIndex > 0.35);
    assert.ok(scri.byRegion[scri.weakestRegion] <= scri.byRegion.NSW);
  });

  it('registers round-4 Onslow LNG scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_onslow_cyclone_hold');
    assert.ok(scenario);
    assert.ok(scenario!.targetRegions.includes('WA'));
  });
});
