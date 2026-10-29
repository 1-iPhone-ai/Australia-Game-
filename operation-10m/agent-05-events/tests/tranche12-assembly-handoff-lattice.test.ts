import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE12_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE12,
  OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG,
  OP10M_SYNC_MANIFEST_LATCH_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 12 assembly-handoff-lattice catalog', () => {
  it('adds 320 assembly-handoff-lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE12_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche12Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 13000);
  });

  it('uses op10m_t12 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 13000);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE12) {
      assert.match(c.chainId, /^op10m_t12_/);
    }
  });

  it('handoff-gated signal requires assembly_handoff_wave flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE12.find((c) =>
      c.chainId.includes('handoff_after_sync')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 85,
      sectorActivity: { governance: 38, finance: 36 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d85|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG] = 84;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('manifest-gated signal requires sync_manifest_latch flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE12.find((c) =>
      c.chainId.includes('manifest_latch_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 85,
      sectorActivity: { technology: 38, research: 36 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d85|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      false
    );
    sim.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG] = 't1|d84|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
