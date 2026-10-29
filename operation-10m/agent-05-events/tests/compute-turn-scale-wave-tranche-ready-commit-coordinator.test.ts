import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG,
  OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveTrancheReadyCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave tranche ready commit coordination', () => {
  it('commits tranche ready when sync latch and wave readiness align', () => {
    const ready = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveTrancheReadyCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveTrancheReadyCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25TrancheReadyWaveSealedPasses, 1);
  });

  it('clears commit when sync latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveTrancheReadyCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG], undefined);
  });
});
