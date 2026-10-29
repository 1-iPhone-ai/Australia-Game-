import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure seal commit coordination', () => {
  it('commits closure seal when latch and seal readiness align', () => {
    const ready = 't25|d75|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 75 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG] = 74;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      75
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG], 75);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureSealCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureSealWaveSealedPasses, 1);
  });

  it('clears closure seal commit when seal latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 79 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG] = 't24|d78|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG] = 78;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      79
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_SEALED_FLAG], undefined);
  });
});
