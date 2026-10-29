import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure seal sync latch coordination', () => {
  it('latches closure seal sync when seal commit and seal align', () => {
    const sealed = 't26|d76|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 76 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG] = 75;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      76
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG], 76);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureSealSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureSealSyncWaveReadyPasses, 1);
  });

  it('clears closure seal sync latch when seal commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 80 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG] = 't25|d79|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG] = 79;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      80
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_READY_FLAG], undefined);
  });
});
