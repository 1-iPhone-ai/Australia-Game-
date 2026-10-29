import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG,
  OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG,
  OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveProjectionLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave projection latch coordination', () => {
  it('latches projection when origin gate and attestation align', () => {
    const attested = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG] = attested;

    const pass = evaluateComputeTurnScaleWaveProjectionLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG], attested);
    assert.equal(pass.narrative.telemetry.scaleWaveProjectionLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25ProjectionWaveReadyPasses, 1);
  });

  it('clears latch when origin gate missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveProjectionLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG], undefined);
  });
});
