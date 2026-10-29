import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG,
  OP10M_CHUNK_ASSEMBLY_SEAL_FLAG,
  OP10M_HANDOFF_MANIFEST_COMMIT_FLAG,
  OP10M_SYNC_MANIFEST_LATCH_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnChunkAssemblySealCoordination,
} from '../src/index.ts';

describe('Compute turn chunk assembly seal coordination', () => {
  it('seals assembly when handoff wave and manifest latch align', () => {
    const latch = 't8|d45|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 45 });
    simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG] = 44;
    simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG] = latch;

    const pass = evaluateComputeTurnChunkAssemblySealCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      45
    );
    assert.equal(pass.simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG], 45);
    assert.equal(pass.simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG], latch);
    assert.equal(pass.narrative.telemetry.chunkAssemblySeals, 1);
    assert.equal(pass.narrative.telemetry.handoffManifestCommits, 1);
  });

  it('clears seal when manifest latch missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 50 });
    simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG] = 49;
    simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG] = 49;
    const pass = evaluateComputeTurnChunkAssemblySealCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      50
    );
    assert.equal(pass.simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG], undefined);
  });
});
