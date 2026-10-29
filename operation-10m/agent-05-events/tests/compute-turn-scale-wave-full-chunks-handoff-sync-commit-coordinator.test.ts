import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffSyncCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff sync commit coordination', () => {
  it('commits handoff sync when latch and sync readiness align', () => {
    const ready = 't19|d69|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 69 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG] = 68;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      69
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG], 69);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffSyncCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffSyncWaveSealedPasses, 1);
  });

  it('clears sync commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 73 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG] = 't18|d72|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG] = 72;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      73
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG], undefined);
  });
});
