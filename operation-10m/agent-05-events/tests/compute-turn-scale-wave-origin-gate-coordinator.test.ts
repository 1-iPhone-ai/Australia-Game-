import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG,
  OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG,
  OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG,
  OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveOriginGateCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave origin gate coordination', () => {
  it('opens origin gate when catalog commit and bundle catalog seal align', () => {
    const sealed = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveOriginGateCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveOriginGates, 1);
    assert.equal(pass.narrative.telemetry.agent25OriginWaveAttestedPasses, 1);
  });

  it('clears origin gate when catalog commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveOriginGateCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG], undefined);
  });
});
