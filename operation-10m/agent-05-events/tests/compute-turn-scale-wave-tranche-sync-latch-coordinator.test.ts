import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveTrancheSyncLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave tranche sync latch coordination', () => {
  it('latches tranche sync when post-closure commit and seal align', () => {
    const sealed = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveTrancheSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveTrancheSyncLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25TrancheSyncWaveReadyPasses, 1);
  });

  it('clears latch when post-closure commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveTrancheSyncLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG], undefined);
  });
});
