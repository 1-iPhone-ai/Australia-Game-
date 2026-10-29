import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_COMPUTE_DRIFT_FLAG,
  OP10M_COMPUTE_DRIFT_SETTLED_FLAG,
  OP10M_COMPUTE_TURN_GAP_ACK_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  executeOp10mNarrativeComputeTurnHook,
  reconcileOp10mTurnComputeLedger,
  settleOp10mComputeTurnDriftAfterReconcile,
} from '../src/index.ts';

describe('Compute turn drift settle', () => {
  it('sets gap ack when turn gap detected during reconcile', () => {
    const sim = createDefaultOp10mSimulationSlice({ day: 30 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 2,
        lastDay: 20,
        computePassCount: 2,
        turnComputeDigest: 't2|d20|c0|q0',
        deferredMutations: [],
        lastStages: [],
      },
    };
    const result = reconcileOp10mTurnComputeLedger(sim, narrative, 5, 30);
    assert.equal(result.simulation.flags[OP10M_COMPUTE_TURN_GAP_ACK_FLAG], true);
  });

  it('settles drift when digests align after reconcile', () => {
    const digest = 't3|d10|c0|q0';
    const sim = createDefaultOp10mSimulationSlice({
      flags: {
        [OP10M_TURN_COMPUTE_DIGEST_FLAG]: digest,
        [OP10M_COMPUTE_DRIFT_FLAG]: true,
      },
    });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 3,
        lastDay: 10,
        computePassCount: 3,
        turnComputeDigest: digest,
        deferredMutations: [],
        lastStages: [],
      },
    };
    const result = settleOp10mComputeTurnDriftAfterReconcile(sim, narrative);
    assert.equal(result.simulation.flags[OP10M_COMPUTE_DRIFT_FLAG], undefined);
    assert.equal(result.simulation.flags[OP10M_COMPUTE_DRIFT_SETTLED_FLAG], true);
  });

  it('clears drift and marks settled after compute hook completes', () => {
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
