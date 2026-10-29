import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG,
  OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG,
  OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWavePostClosureCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave post-closure commit coordination', () => {
  it('commits post-closure when gate closure latch and wave readiness align', () => {
    const ready = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWavePostClosureCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWavePostClosureCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25PostClosureWaveSealedPasses, 1);
  });

  it('clears commit when gate closure latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWavePostClosureCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG], undefined);
  });
});
