import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure sync latch coordination', () => {
  it('latches closure sync when closure commit and seal align', () => {
    const sealed = 't22|d72|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 72 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG] = 71;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      72
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG], 72);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureSyncWaveReadyPasses, 1);
  });

  it('clears closure sync latch when closure commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 76 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG] = 't21|d75|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG] = 75;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      76
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG], undefined);
  });
});
