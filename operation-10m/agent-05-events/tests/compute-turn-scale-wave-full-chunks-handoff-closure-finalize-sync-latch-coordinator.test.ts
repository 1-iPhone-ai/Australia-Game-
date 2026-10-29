import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize sync latch coordination', () => {
  it('latches closure finalize sync when finalize commit and seal align', () => {
    const sealed = 't30|d80|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 80 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_COMMIT_FLAG] = 79;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      80
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_LATCH_FLAG], 80);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSyncWaveReadyPasses, 1);
  });

  it('clears closure finalize sync latch when finalize commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 84 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_SEALED_FLAG] = 't29|d83|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_LATCH_FLAG] = 83;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      84
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_READY_FLAG], undefined);
  });
});
