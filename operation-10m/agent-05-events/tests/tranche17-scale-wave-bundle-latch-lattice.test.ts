import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE17_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE17,
  OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 17 scale-wave-bundle-latch lattice catalog', () => {
  it('adds 320 scale-wave-bundle-latch lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE17_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche17Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 21880);
  });

  it('uses op10m_t17 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 21880);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE17) {
      assert.match(c.chainId, /^op10m_t17_/);
    }
  });

  it('latch-gated signal requires scale_wave_bundle_latch flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE17.find((c) =>
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
    sim.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG] = 104;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('wave-gated signal requires agent25_assembly_wave_ready flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE17.find((c) =>
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
    sim.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG] = 't1|d104|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
