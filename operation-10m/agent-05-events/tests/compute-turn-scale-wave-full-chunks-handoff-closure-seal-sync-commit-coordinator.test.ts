import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure seal sync commit coordination', () => {
  it('commits closure seal sync when latch and sync readiness align', () => {
    const ready = 't27|d77|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 77 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG] = 76;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      77
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG], 77);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureSealSyncCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureSealSyncWaveSealedPasses, 1);
  });

  it('clears closure seal sync commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 81 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG] = 't26|d80|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG] = 80;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      81
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG], undefined);
  });
});
