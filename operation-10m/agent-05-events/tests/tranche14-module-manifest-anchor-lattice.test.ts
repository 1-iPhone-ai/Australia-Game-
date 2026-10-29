import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE14_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE14,
  OP10M_CHUNK_INLINE_READY_FLAG,
  OP10M_MODULE_MANIFEST_ANCHOR_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 14 module-manifest-anchor lattice catalog', () => {
  it('adds 320 module-manifest-anchor lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE14_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche14Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 15560);
  });

  it('uses op10m_t14 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 15560);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE14) {
      assert.match(c.chainId, /^op10m_t14_/);
    }
  });

  it('anchor-gated signal requires module_manifest_anchor flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE14.find((c) =>
      c.chainId.includes('anchor_after_seal')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 95,
      sectorActivity: { governance: 42, finance: 40 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d95|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG] = 94;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('inline-gated signal requires chunk_inline_ready flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE14.find((c) =>
      c.chainId.includes('inline_ready_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 95,
      sectorActivity: { technology: 42, research: 40 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d95|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_CHUNK_INLINE_READY_FLAG] = 't1|d94|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
