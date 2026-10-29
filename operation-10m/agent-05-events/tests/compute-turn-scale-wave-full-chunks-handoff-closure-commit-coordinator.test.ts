import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure commit coordination', () => {
  it('commits closure when latch and closure readiness align', () => {
    const ready = 't21|d71|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 71 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG] = 70;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      71
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG], 71);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureWaveSealedPasses, 1);
  });

  it('clears closure commit when closure latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 75 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG] = 't20|d74|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG] = 74;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      75
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG], undefined);
  });
});
