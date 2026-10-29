import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE32_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE32,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 32 scale-wave-full-chunks-handoff-sync-latch lattice catalog', () => {
  it('adds 320 handoff-sync-latch chains at 21660 total', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE32_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche32Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 21660);
  });

  it('uses op10m_t32 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 21660);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE32) {
      assert.match(c.chainId, /^op10m_t32_/);
    }
  });

  it('handoff-sync-latch requires scale_wave_full_chunks_handoff_sync_latch flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE32.find((c) =>
      c.chainId.includes('latch_after_seal')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 105,
      sectorActivity: { governance: 46, finance: 44 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d105|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG] = 104;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('handoff-sync-ready requires agent25_full_chunks_handoff_sync_wave_ready flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE32.find((c) =>
      c.chainId.includes('assembly_wave_ready')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 105,
      sectorActivity: { technology: 46, research: 44 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d105|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG] = 't1|d104|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
