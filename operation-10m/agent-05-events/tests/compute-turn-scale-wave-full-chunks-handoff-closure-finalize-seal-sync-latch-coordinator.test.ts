import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize seal sync latch coordination', () => {
  it('latches closure finalize seal sync when seal commit and seal align', () => {
    const sealed = 't33|d83|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 83 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_COMMIT_FLAG] = 82;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      83
    );
    assert.equal(
      pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_FLAG],
      83
    );
    assert.equal(
      pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_READY_FLAG],
      sealed
    );
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSealSyncWaveReadyPasses, 1);
  });

  it('clears closure finalize seal sync latch when seal commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 87 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_WAVE_SEALED_FLAG] =
      't32|d86|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_FLAG] = 86;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      87
    );
    assert.equal(
      pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_LATCH_FLAG],
      undefined
    );
    assert.equal(
      pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_SYNC_WAVE_READY_FLAG],
      undefined
    );
  });
});
