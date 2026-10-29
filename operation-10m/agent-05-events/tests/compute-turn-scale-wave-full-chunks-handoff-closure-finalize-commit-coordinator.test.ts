import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize commit coordination', () => {
  it('commits closure finalize when latch and finalize readiness align', () => {
    const ready = 't29|d79|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 79 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG] = 78;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      79
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_COMMIT_FLAG], 79);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeWaveSealedPasses, 1);
  });

  it('clears closure finalize commit when finalize latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 83 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG] = 't28|d82|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_COMMIT_FLAG] = 82;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      83
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_SEALED_FLAG], undefined);
  });
});
