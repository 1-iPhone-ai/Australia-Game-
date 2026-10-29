import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff commit coordination', () => {
  it('commits handoff when latch and handoff readiness align', () => {
    const ready = 't17|d67|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 67 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG] = 66;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      67
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG], 67);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffWaveSealedPasses, 1);
  });

  it('clears handoff commit when latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 71 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG] = 't16|d70|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG] = 70;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      71
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG], undefined);
  });
});
