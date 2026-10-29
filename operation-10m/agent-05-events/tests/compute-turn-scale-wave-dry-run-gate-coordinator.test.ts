import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG,
  OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG,
  OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveDryRunGateCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave dry-run gate coordination', () => {
  it('opens dry-run gate when projection latch and wave readiness align', () => {
    const ready = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG] = ready;

    const pass = evaluateComputeTurnScaleWaveDryRunGateCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG], ready);
    assert.equal(pass.narrative.telemetry.scaleWaveDryRunGates, 1);
    assert.equal(pass.narrative.telemetry.agent25DryRunWaveAttestedPasses, 1);
  });

  it('clears dry-run gate when projection latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveDryRunGateCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG], undefined);
  });
});
