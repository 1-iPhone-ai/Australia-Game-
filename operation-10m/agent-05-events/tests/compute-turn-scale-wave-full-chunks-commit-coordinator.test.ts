import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks commit coordination', () => {
  it('commits full-chunks wave when latch and wave readiness align', () => {
    const ready = 't13|d63|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 63 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG] = 62;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      63
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG], 63);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksWaveSealedPasses, 1);
  });

  it('clears commit when full-chunks latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 67 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG] = 't12|d66|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG] = 66;
    const pass = evaluateComputeTurnScaleWaveFullChunksCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      67
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG], undefined);
  });
});
