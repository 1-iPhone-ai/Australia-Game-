import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE13_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE13,
  OP10M_CHUNK_ASSEMBLY_SEAL_FLAG,
  OP10M_HANDOFF_MANIFEST_COMMIT_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 13 chunk-assembly-seal lattice catalog', () => {
  it('adds 320 chunk-assembly-seal lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE13_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche13Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 8200);
  });

  it('uses op10m_t13 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 8200);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE13) {
      assert.match(c.chainId, /^op10m_t13_/);
    }
  });

  it('seal-gated signal requires chunk_assembly_seal flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE13.find((c) =>
      c.chainId.includes('seal_after_handoff')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 90,
      sectorActivity: { governance: 40, finance: 38 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d90|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG] = 89;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('commit-gated signal requires handoff_manifest_commit flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE13.find((c) =>
      c.chainId.includes('manifest_commit_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 90,
      sectorActivity: { technology: 40, research: 38 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d90|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG] = 't1|d89|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
