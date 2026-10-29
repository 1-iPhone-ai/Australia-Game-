import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG,
  OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG,
  OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveGateClosureLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave gate closure latch coordination', () => {
  it('latches gate closure when dry-run gate and attestation align', () => {
    const attested = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG] = attested;

    const pass = evaluateComputeTurnScaleWaveGateClosureLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG], attested);
    assert.equal(pass.narrative.telemetry.scaleWaveGateClosureLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25GateClosureWaveReadyPasses, 1);
  });

  it('clears latch when dry-run gate missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveGateClosureLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG], undefined);
  });
});
