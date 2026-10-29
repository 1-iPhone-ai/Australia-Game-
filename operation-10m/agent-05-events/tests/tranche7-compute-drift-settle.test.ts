import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE7_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7,
  OP10M_COMPUTE_DRIFT_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mSimulationSlice,
  evaluateRequirements,
} from '../src/index.ts';

describe('Tranche 7 compute drift-settle catalog', () => {
  it('adds 320 drift-settle-wave chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE7_STATS.chainCount, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche7Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 6600);
  });

  it('uses op10m_t7 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 6600);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7) {
      assert.match(c.chainId, /^op10m_t7_/);
    }
  });

  it('drift-gated signal requires compute_turn_drift flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7.find((c) =>
      c.chainId.includes('drift_remediation_wave')
    )!;
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sim = createDefaultOp10mSimulationSlice({
      day: 55,
      sectorActivity: { technology: 28, research: 24 },
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't1|d55|c0|q0' },
    });
    assert.equal(evaluateRequirements(signal.requires, sim, null).ok, false);
    sim.flags[OP10M_COMPUTE_DRIFT_FLAG] = true;
    assert.equal(evaluateRequirements(signal.requires, sim, null).ok, true);
  });
});
