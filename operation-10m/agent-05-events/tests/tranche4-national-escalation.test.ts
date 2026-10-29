import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE4_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4,
  OP10M_MULTI_REGION_CONTAGION_COUNT_FLAG,
  OP10M_NATIONAL_ESCALATION_TIER_FLAG,
  computeNationalEscalationScore,
  countRegionsWithContagionAtLeast,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateNationalEscalationLattice,
  evaluateOp10mNarrativeTick,
  evaluateRequirements,
  getNationalEscalationTier,
  contagionFlagKey,
} from '../src/index.ts';

describe('Tranche 4 national lattice catalog', () => {
  it('adds 320 lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE4_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche4Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 20120);
  });

  it('uses op10m_t4 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 20120);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4) {
      assert.match(c.chainId, /^op10m_t4_/);
    }
  });

  it('pressure requires national escalation tier', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4.find((c) =>
      c.chainId.includes('grid_cascade')
    )!;
    const pressure = chain.phases.find((p) => p.phase === 'pressure')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'pressure' as const,
      startedDay: 40,
      lastAdvancedDay: 45,
      stageCooldownUntilDay: 0,
    };
    const sim = createDefaultOp10mSimulationSlice({ day: 50 });
    assert.equal(evaluateRequirements(pressure.requires, sim, runtime).ok, false);
    sim.flags[OP10M_NATIONAL_ESCALATION_TIER_FLAG] = 2;
    assert.equal(evaluateRequirements(pressure.requires, sim, runtime).ok, true);
  });

  it('rupture requires multi-region contagion and resolved chains', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4[0];
    const rupture = chain.phases.find((p) => p.phase === 'rupture')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'rupture' as const,
      startedDay: 50,
      lastAdvancedDay: 55,
      stageCooldownUntilDay: 0,
    };
    const sim = createDefaultOp10mSimulationSlice({ day: 60, money: 50000 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    assert.equal(
      evaluateRequirements(rupture.requires, sim, runtime, { narrative }).ok,
      false
    );
    sim.flags[contagionFlagKey('NSW', chain.theme)] = 2;
    sim.flags[contagionFlagKey('VIC', chain.theme)] = 1;
    narrative.resolvedChainIds = ['a', 'b'];
    assert.equal(
      evaluateRequirements(rupture.requires, sim, runtime, { narrative, catalog: OP10M_AGENT05_CHAIN_CATALOG }).ok,
      true
    );
  });
});

describe('National escalation orchestrator', () => {
  it('computes score from crises and stability', () => {
    const sim = createDefaultOp10mSimulationSlice({
      day: 40,
      activeCrisisCount: 6,
      nationalStability: 28,
    });
    const narrative = createDefaultOp10mNarrativeEngineState();
    narrative.resolvedChainIds = ['x', 'y', 'z'];
    assert.ok(computeNationalEscalationScore(sim, narrative) >= 3);
  });

  it('steps escalation tier and mutates simulation', () => {
    const sim = createDefaultOp10mSimulationSlice({
      day: 45,
      activeCrisisCount: 8,
      nationalStability: 25,
    });
    sim.flags[OP10M_NATIONAL_ESCALATION_TIER_FLAG] = 0;
    const narrative = createDefaultOp10mNarrativeEngineState();
    narrative.resolvedChainIds = ['r1', 'r2', 'r3', 'r4'];
    const beforeStability = sim.nationalStability;
    const out = evaluateNationalEscalationLattice(sim, narrative);
    assert.ok(getNationalEscalationTier(out.simulation) >= 1);
    assert.ok(out.simulation.nationalStability < beforeStability);
    assert.ok(out.narrative.telemetry.nationalEscalationSteps >= 1);
  });

  it('tracks multi-region contagion count flag', () => {
    const sim = createDefaultOp10mSimulationSlice({ day: 10 });
    sim.flags[contagionFlagKey('NSW', 'mining')] = 1;
    sim.flags[contagionFlagKey('QLD', 'energy')] = 2;
    assert.equal(countRegionsWithContagionAtLeast(sim, 1), 2);
    const out = evaluateNationalEscalationLattice(sim, createDefaultOp10mNarrativeEngineState());
    assert.equal(out.simulation.flags[OP10M_MULTI_REGION_CONTAGION_COUNT_FLAG], 2);
  });

  it('runs on narrative tick after cross-system pass', () => {
    const tick = evaluateOp10mNarrativeTick(
      createDefaultOp10mSimulationSlice({
        day: 50,
        activeCrisisCount: 10,
        nationalStability: 20,
      }),
      createDefaultOp10mNarrativeEngineState(),
      [],
      { nationalEscalation: true, crossSystemCouplings: false }
    );
    assert.ok(tick.narrative.telemetry.nationalEscalationSteps >= 1);
  });
});
