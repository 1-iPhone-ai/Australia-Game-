import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff sync latch coordination', () => {
  it('latches handoff sync when commit and seal align', () => {
    const sealed = 't18|d68|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 68 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG] = 67;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      68
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG], 68);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffSyncWaveReadyPasses, 1);
  });

  it('clears sync latch when handoff commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 72 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG] = 't17|d71|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG] = 71;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      72
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG], undefined);
  });
});
