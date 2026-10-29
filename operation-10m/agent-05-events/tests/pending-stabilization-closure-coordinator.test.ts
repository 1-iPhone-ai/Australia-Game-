import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_DIGEST_CLOSURE_LATCH_FLAG,
  OP10M_PENDING_BACKLOG_FLAG,
  OP10M_PENDING_QUEUE_CLEARED_FLAG,
  OP10M_PENDING_STABILIZATION_WAVE_FLAG,
  OP10M_POST_QUEUE_CALM_FLAG,
  OP10M_STABILIZATION_CLOSURE_WAVE_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluatePendingStabilizationClosureCoordination,
} from '../src/index.ts';

describe('Pending stabilization closure coordination', () => {
  it('latches closure when calm, stabilization, and digest align', () => {
    const digest = 't5|d30|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 30 });
    simulation.flags[OP10M_POST_QUEUE_CALM_FLAG] = 29;
    simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG] = 28;
    simulation.flags[OP10M_PENDING_QUEUE_CLEARED_FLAG] = 27;
    simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG] = digest;

    const pass = evaluatePendingStabilizationClosureCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      30
    );
    assert.equal(pass.simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG], 30);
    assert.equal(pass.simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG], digest);
    assert.equal(pass.narrative.telemetry.stabilizationClosureWaves, 1);
    assert.equal(pass.narrative.telemetry.digestClosureLatches, 1);
  });

  it('clears closure flags when backlog returns', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 40 });
    simulation.flags[OP10M_PENDING_BACKLOG_FLAG] = 5;
    simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG] = 39;
    simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG] = 't4|d39|c0|q0';
    const pass = evaluatePendingStabilizationClosureCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      40
    );
    assert.equal(pass.simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG], undefined);
  });
});
