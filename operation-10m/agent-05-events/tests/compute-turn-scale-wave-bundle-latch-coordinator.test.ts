import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG,
  OP10M_CHUNK_MANIFEST_SEALED_FLAG,
  OP10M_POST_CRISIS_SLOT_COMMIT_FLAG,
  OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveBundleLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave bundle latch coordination', () => {
  it('latches bundle when slot commit and manifest seal align', () => {
    const sealed = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG] = 59;
    simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveBundleLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveBundleLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25AssemblyWaveReadyPasses, 1);
  });

  it('clears latch when slot commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveBundleLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG], undefined);
  });
});
