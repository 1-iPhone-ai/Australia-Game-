import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import { TRANSPORT_INVESTMENT_PIPELINE, computePipelineUnlocks } from '../operations/investment-pipeline.ts';
import { applyClimateBandToInputs } from '../climate/apply-climate-band.ts';
import type { AuRegionCode } from '../types.ts';
import { computeSpilloverBonusByRegion } from '../network/cross-region-spillover.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 3 catalog', () => {
  it('meets 71+ assets, 21+ corridors, 32+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 71);
    assert.ok(TRANSPORT_CORRIDORS.length >= 21);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 32);
    assert.ok(TRANSPORT_INVESTMENT_PIPELINE.length >= 5);
  });
});

describe('Agent 12 round 3 systems', () => {
  it('applies investment pipeline unlocks', () => {
    const unlock = computePipelineUnlocks(new Set(['pipe_qld_inland_rail_stage', 'pipe_nsw_botany_rail']));
    assert.ok(unlock.productivityPoints > 10);
    assert.ok(unlock.logisticsRelief > 0.04);
  });

  it('reduces productivity under hot climate band', () => {
    const mild = computeTransportInfrastructureState(defaultInfrastructureInputs(10), { climateBand: 'mild' });
    const hot = computeTransportInfrastructureState(defaultInfrastructureInputs(10), { climateBand: 'hot' });
    assert.ok(hot.productivity.nationalProductivityIndexBonus < mild.productivity.nationalProductivityIndexBonus);
    assert.ok(hot.climateModifierFactor < 1);
  });

  it('returns agent12/4 with fleet capacity and spillover', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(11), {
      fundedPipelineStageIds: new Set(['pipe_vic_inland_port_shuttle']),
    });
    assert.equal(state.schemaVersion, 'agent12/19');
    assert.ok(state.fleetCapacity.nationalComposite > 5);
    assert.ok(state.spilloverBonusByRegion.NSW > 0);
    assert.ok(state.pipelineUnlockPoints > 0);
  });

  it('computes spillover from neighbouring regions', () => {
    const inputs = defaultInfrastructureInputs(1);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const bonus = {} as Record<AuRegionCode, number>;
    for (const r of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as AuRegionCode[]) {
      bonus[r] = 50;
    }
    const spill = computeSpilloverBonusByRegion(ops, bonus);
    assert.ok(spill.VIC > 0);
  });

  it('activates Sydney freight ring corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(12));
    const ring = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_sydney_freight_ring');
    assert.ok(ring?.active);
  });

  it('climate band adjusts inputs utilization', () => {
    const base = defaultInfrastructureInputs(1);
    const applied = applyClimateBandToInputs(base, 'extreme');
    assert.ok((applied.inputs.networkUtilization?.freight ?? 0) >= 0.15);
  });
});
