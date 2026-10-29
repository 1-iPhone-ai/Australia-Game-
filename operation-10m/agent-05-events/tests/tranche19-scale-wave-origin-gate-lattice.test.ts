import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE19_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE19,
  OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG,
  OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 19 scale-wave-origin-gate lattice catalog', () => {
  it('adds 320 scale-wave-origin-gate lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE19_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche19Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 9480);
  });

  it('uses op10m_t19 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 9480);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE19) {
      assert.match(c.chainId, /^op10m_t19_/);
    }
  });

  it('origin-gate-gated signal requires scale_wave_origin_gate flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE19.find((c) =>
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
    sim.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG] = 104;
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });

  it('origin-attested-gated signal requires agent25_origin_wave_attested flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE19.find((c) =>
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
    sim.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG] = 't1|d104|c0|q0';
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, {
        narrative: createDefaultOp10mNarrativeEngineState(),
      }).ok,
      true
    );
  });
});
