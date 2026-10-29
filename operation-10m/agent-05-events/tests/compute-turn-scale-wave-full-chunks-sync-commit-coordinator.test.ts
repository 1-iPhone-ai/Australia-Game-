import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksSyncCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks sync commit coordination', () => {
  it('commits full-chunks sync when latch and sync readiness align', () => {
    const ready = 't15|d65|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG] = 64;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG], 65);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksSyncCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksSyncWaveSealedPasses, 1);
  });

  it('clears sync commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 69 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG] = 't14|d68|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG] = 68;
    const pass = evaluateComputeTurnScaleWaveFullChunksSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      69
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG], undefined);
  });
});
