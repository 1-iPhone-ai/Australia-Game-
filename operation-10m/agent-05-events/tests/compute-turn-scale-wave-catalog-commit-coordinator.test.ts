import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG,
  OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG,
  OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG,
  OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveCatalogCommitCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave catalog commit coordination', () => {
  it('commits catalog when bundle latch and assembly wave align', () => {
    const wave = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG] = wave;

    const pass = evaluateComputeTurnScaleWaveCatalogCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG], wave);
    assert.equal(pass.narrative.telemetry.scaleWaveCatalogCommits, 1);
    assert.equal(pass.narrative.telemetry.agent25BundleCatalogSealedPasses, 1);
  });

  it('clears commit when bundle latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG] = 64;
    const pass = evaluateComputeTurnScaleWaveCatalogCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG], undefined);
  });
});
