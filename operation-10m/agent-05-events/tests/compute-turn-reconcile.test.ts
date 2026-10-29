import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_COMPUTE_DRIFT_FLAG,
  OP10M_COMPUTE_DRIFT_SETTLED_FLAG,
  OP10M_COMPUTE_ELIGIBILITY_PRIMED_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  executeOp10mNarrativeComputeTurnHook,
  primeComputeTurnNarrativeEligibility,
  reconcileOp10mTurnComputeLedger,
} from '../src/index.ts';

describe('Compute turn reconcile', () => {
  it('detects digest drift between simulation flag and ledger', () => {
    const sim = createDefaultOp10mSimulationSlice({
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 't1|d1|c0|q0' },
    });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 1,
        lastDay: 1,
        computePassCount: 1,
        turnComputeDigest: 't2|d2|c0|q0',
        deferredMutations: [],
        lastStages: [],
      },
    };
    const result = reconcileOp10mTurnComputeLedger(sim, narrative, 3, 10);
    assert.equal(result.simulation.flags[OP10M_COMPUTE_DRIFT_FLAG], true);
    assert.match(result.log.join(' '), /drift/);
  });

  it('primes eligibility after sustained compute passes', () => {
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 2,
        lastDay: 10,
        computePassCount: 2,
        turnComputeDigest: 'x',
        deferredMutations: [],
        lastStages: [],
      },
    };
    const sim = createDefaultOp10mSimulationSlice({ day: 10 });
    const primed = primeComputeTurnNarrativeEligibility(sim, narrative);
    assert.equal(primed.simulation.flags[OP10M_COMPUTE_ELIGIBILITY_PRIMED_FLAG], true);
  });

  it('runs reconcile before deferred drain in compute hook', () => {
    const sim = createDefaultOp10mSimulationSlice({
      day: 20,
      flags: { [OP10M_TURN_COMPUTE_DIGEST_FLAG]: 'stale' },
    });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 0,
        lastDay: 0,
        computePassCount: 0,
        turnComputeDigest: 'fresh',
        deferredMutations: [],
        lastStages: [],
      },
    };
    const result = executeOp10mNarrativeComputeTurnHook({
      turn: 1,
      day: 20,
      simulation: sim,
      narrative,
      catalog: [],
    });
    assert.equal(result.simulation.flags[OP10M_COMPUTE_DRIFT_FLAG], undefined);
    assert.equal(result.simulation.flags[OP10M_COMPUTE_DRIFT_SETTLED_FLAG], true);
    assert.match(result.log.join(' '), /drift/);
  });
});
