import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff latch coordination', () => {
  it('latches handoff when sync commit and seal align', () => {
    const sealed = 't16|d66|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 66 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG] = 65;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      66
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG], 66);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffWaveReadyPasses, 1);
  });

  it('clears handoff latch when sync commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 70 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG] = 't15|d69|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG] = 69;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      70
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG], undefined);
  });
});
