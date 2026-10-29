import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE15_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE15,
  OP10M_AGENT25_SLOT_READY_FLAG,
  OP10M_INLINE_ASSEMBLY_LOCK_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 15 inline-assembly-lock lattice catalog', () => {
  it('adds 320 inline-assembly-lock lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE15_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche15Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 10440);
  });

  it('uses op10m_t15 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 10440);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE15) {
      assert.match(c.chainId, /^op10m_t15_/);
    }
  });

  it('lock-gated signal requires inline_assembly_lock flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE15.find((c) =>
      c.chainId.includes('lock_after_anchor')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 100,
      sectorActivity: { governance: 44, finance: 42 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d100|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG] = 99;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('slot-gated signal requires agent25_slot_ready flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE15.find((c) =>
      c.chainId.includes('slot_ready_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 100,
      sectorActivity: { technology: 44, research: 42 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d100|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_AGENT25_SLOT_READY_FLAG] = 't1|d99|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
