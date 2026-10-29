import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE6_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6,
  OP10M_COMPUTE_ELIGIBILITY_PRIMED_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 6 compute-reconcile catalog', () => {
  it('adds 320 reconcile-wave chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE6_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche6Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 17480);
  });

  it('uses op10m_t6 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 17480);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6) {
      assert.match(c.chainId, /^op10m_t6_/);
    }
  });

  it('signal requires turn compute digest flag on simulation', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6[0];
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 50,
      sectorActivity: { technology: 25, research: 22 },
    });
    assert.equal(evaluateRequirements(signal.requires, sim, null).ok, false);
    sim.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG] = 't1|d50|c0|q0';
    assert.equal(evaluateRequirements(signal.requires, sim, null).ok, true);
  });

  it('pressure requires eligibility primed and compute turn ledger', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6.find((c) =>
      c.chainId.includes('digest_lag_wave')
    )!;
    const pressure = chain.phases.find((p) => p.phase === 'pressure')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'pressure' as const,
      startedDay: 45,
      lastAdvancedDay: 50,
      stageCooldownUntilDay: 0,
    };
    const sim = createDefaultOp10mSimulationSlice({
      day: 55,
      flags: { [OP10M_COMPUTE_ELIGIBILITY_PRIMED_FLAG]: true },
    });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 0,
        lastDay: 55,
        computePassCount: 3,
        turnComputeDigest: 'x',
        deferredMutations: [],
        lastStages: [],
      },
    };
    assert.equal(
      evaluateRequirements(pressure.requires, sim, runtime, { narrative }).ok,
      false
    );
    narrative = {
      ...narrative,
      turnCompute: { ...narrative.turnCompute!, lastTurn: 2 },
    };
    assert.equal(
      evaluateRequirements(pressure.requires, sim, runtime, { narrative }).ok,
      true
    );
  });
});
