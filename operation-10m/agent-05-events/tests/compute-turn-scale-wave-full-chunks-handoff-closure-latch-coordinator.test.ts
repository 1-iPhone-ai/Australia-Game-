import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure latch coordination', () => {
  it('latches closure when sync commit and seal align', () => {
    const sealed = 't20|d70|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 70 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG] = 69;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      70
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG], 70);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureWaveReadyPasses, 1);
  });

  it('clears closure latch when sync commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 74 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG] = 't19|d73|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG] = 73;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      74
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG], undefined);
  });
});
