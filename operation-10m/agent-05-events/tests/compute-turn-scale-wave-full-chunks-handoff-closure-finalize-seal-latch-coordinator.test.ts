import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_LATCH_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure finalize seal latch coordination', () => {
  it('latches closure finalize seal when sync commit and seal align', () => {
    const sealed = 't32|d82|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 82 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_COMMIT_FLAG] = 81;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      82
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_LATCH_FLAG], 82);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureFinalizeSealLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureFinalizeSealWaveReadyPasses, 1);
  });

  it('clears closure finalize seal latch when sync commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 86 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SYNC_WAVE_SEALED_FLAG] = 't31|d85|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_LATCH_FLAG] = 85;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureFinalizeSealLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      86
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_FINALIZE_SEAL_WAVE_READY_FLAG], undefined);
  });
});
