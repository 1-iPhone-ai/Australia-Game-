import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE8_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8,
  OP10M_PENDING_BACKLOG_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 8 pending-lattice catalog', () => {
  it('adds 320 pending-lattice chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE8_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche8Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 8520);
  });

  it('uses op10m_t8 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 8520);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8) {
      assert.match(c.chainId, /^op10m_t8_/);
    }
  });

  it('backlog-gated signal requires pending_backlog flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8.find((c) =>
      c.chainId.includes('backlog_surge_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const narrative = createDefaultOp10mNarrativeEngineState();
    const sim = createDefaultOp10mSimulationSlice({
      day: 60,
      sectorActivity: { finance: 30, governance: 28 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't2|d60|c0|q0' },
    });
    assert.equal(
      evaluateRequirements(signal.requires, sim, null, { narrative }).ok,
      false
    );
    sim.flags[OP10M_PENDING_BACKLOG_FLAG] = 4;
    assert.equal(evaluateRequirements(signal.requires, sim, null, { narrative }).ok, true);
  });
});
