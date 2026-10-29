import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure sync commit coordination', () => {
  it('commits closure sync when latch and sync readiness align', () => {
    const ready = 't23|d73|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 73 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG] = 72;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      73
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG], 73);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureSyncCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureSyncWaveSealedPasses, 1);
  });

  it('clears closure sync commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 77 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG] = 't22|d76|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG] = 76;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      77
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG], undefined);
  });
});
