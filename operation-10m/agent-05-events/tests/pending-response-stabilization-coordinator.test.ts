import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_PENDING_BACKLOG_FLAG,
  OP10M_PENDING_QUEUE_CLEARED_FLAG,
  OP10M_PENDING_STABILIZATION_WAVE_FLAG,
  OP10M_POST_QUEUE_CALM_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluatePendingResponseStabilizationCoordination,
} from '../src/index.ts';

describe('Pending response stabilization coordination', () => {
  it('sets calm and stabilization when queue is empty without backlog', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 30 });
    simulation.flags[OP10M_PENDING_QUEUE_CLEARED_FLAG] = 28;
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.telemetry.pendingQueueClears = 1;

    const pass = evaluatePendingResponseStabilizationCoordination(simulation, narrative, 30);
    assert.equal(pass.simulation.flags[OP10M_POST_QUEUE_CALM_FLAG], 30);
    assert.equal(pass.simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG], 30);
    assert.equal(pass.narrative.telemetry.postQueueCalmPasses, 1);
    assert.equal(pass.narrative.telemetry.pendingStabilizationWaves, 1);
  });

  it('clears calm flags when backlog returns', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 40 });
    simulation.flags[OP10M_PENDING_BACKLOG_FLAG] = 5;
    simulation.flags[OP10M_POST_QUEUE_CALM_FLAG] = 39;
    simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG] = 39;
    const pass = evaluatePendingResponseStabilizationCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      40
    );
    assert.equal(pass.simulation.flags[OP10M_POST_QUEUE_CALM_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG], undefined);
  });
});
