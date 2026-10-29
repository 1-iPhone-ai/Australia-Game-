import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize seal sync commit coordination', () => {
  it('commits closure finalize seal sync latch when sync latch and readiness align', () => {
    const ready = 't33|d83|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 83 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_FLAG] = 82;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      83
    );
    assert.equal(
      pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_COMMIT_FLAG],
      83
    );
    assert.equal(
      pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_SEALED_FLAG],
      ready
    );
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSealSyncWaveSealedPasses, 1);
  });

  it('clears closure finalize seal sync latch commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 87 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_READY_FLAG] =
      't32|d86|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_COMMIT_FLAG] = 86;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      87
    );
    assert.equal(
      pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_COMMIT_FLAG],
      undefined
    );
    assert.equal(
      pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_SEALED_FLAG],
      undefined
    );
  });
});
