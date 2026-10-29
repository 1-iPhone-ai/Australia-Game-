import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE10_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10,
  OP10M_DIGEST_CLOSURE_LATCH_FLAG,
  OP10M_STABILIZATION_CLOSURE_WAVE_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 10 closure-lattice catalog', () => {
  it('adds 320 closure-lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE10_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche10Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 18140);
  });

  it('uses op10m_t10 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 18140);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10) {
      assert.match(c.chainId, /^op10m_t10_/);
    }
  });

  it('closure-gated signal requires stabilization_closure_wave flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10.find((c) =>
      c.chainId.includes('closure_after_calm')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 75,
      sectorActivity: { governance: 34, finance: 32 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d75|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG] = 74;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('latch-gated signal requires digest_closure_latch flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10.find((c) =>
      c.chainId.includes('digest_latch_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 75,
      sectorActivity: { technology: 34, research: 32 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d75|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG] = 't1|d74|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
