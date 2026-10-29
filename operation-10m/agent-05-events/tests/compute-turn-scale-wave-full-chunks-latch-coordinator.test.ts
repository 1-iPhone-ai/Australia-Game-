import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks latch coordination', () => {
  it('latches full-chunks wave when tranche ready commit and seal align', () => {
    const sealed = 't12|d62|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 62 });
    simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG] = 61;
    simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      62
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG], 62);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksWaveReadyPasses, 1);
  });

  it('clears latch when tranche ready commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 66 });
    simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG] = 't11|d65|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG] = 65;
    const pass = evaluateComputeTurnScaleWaveFullChunksLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      66
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG], undefined);
  });
});
