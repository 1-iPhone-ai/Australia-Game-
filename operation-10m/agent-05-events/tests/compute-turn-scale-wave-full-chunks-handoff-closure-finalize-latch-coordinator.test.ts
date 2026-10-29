import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize latch coordination', () => {
  it('latches closure finalize when seal sync commit and seal align', () => {
    const sealed = 't28|d78|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 78 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_COMMIT_FLAG] = 77;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      78
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG], 78);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeWaveReadyPasses, 1);
  });

  it('clears closure finalize latch when seal sync commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 82 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_SYNC_WAVE_SEALED_FLAG] = 't27|d81|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG] = 81;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      82
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_WAVE_READY_FLAG], undefined);
  });
});
