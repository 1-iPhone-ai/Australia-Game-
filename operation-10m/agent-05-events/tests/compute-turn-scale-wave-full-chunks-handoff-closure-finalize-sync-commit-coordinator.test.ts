import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSyncCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize sync commit coordination', () => {
  it('commits closure finalize sync when latch and sync readiness align', () => {
    const ready = 't31|d81|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 81 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_LATCH_FLAG] = 80;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      81
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_COMMIT_FLAG], 81);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSyncCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSyncWaveSealedPasses, 1);
  });

  it('clears closure finalize sync commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 85 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_READY_FLAG] = 't30|d84|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_COMMIT_FLAG] = 84;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      85
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_SEALED_FLAG], undefined);
  });
});
