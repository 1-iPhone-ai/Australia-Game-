import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks sync latch coordination', () => {
  it('latches full-chunks sync when commit and wave seal align', () => {
    const sealed = 't14|d64|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 64 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG] = 63;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      64
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG], 64);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksSyncWaveReadyPasses, 1);
  });

  it('clears sync latch when full-chunks commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 68 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG] = 't13|d67|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG] = 67;
    const pass = evaluateComputeTurnScaleWaveFullChunksSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      68
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG], undefined);
  });
});
