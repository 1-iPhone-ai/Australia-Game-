import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_CHUNK_ASSEMBLY_SEAL_FLAG,
  OP10M_CHUNK_INLINE_READY_FLAG,
  OP10M_HANDOFF_MANIFEST_COMMIT_FLAG,
  OP10M_MODULE_MANIFEST_ANCHOR_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnModuleManifestAnchorCoordination,
} from '../src/index.ts';

describe('Compute turn module manifest anchor coordination', () => {
  it('anchors manifest when seal, commit, and digest align', () => {
    const digest = 't9|d50|c0|q0';
    const commit = 't8|d49|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 50 });
    simulation.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG] = 49;
    simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG] = commit;
    simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG] = digest;

    const pass = evaluateComputeTurnModuleManifestAnchorCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      50
    );
    assert.equal(pass.simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG], 50);
    assert.equal(pass.simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG], digest);
    assert.equal(pass.narrative.telemetry.moduleManifestAnchors, 1);
    assert.equal(pass.narrative.telemetry.chunkInlineReadyPasses, 1);
  });

  it('clears anchor when seal missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 55 });
    simulation.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG] = 't7|d54|c0|q0';
    simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG] = 't8|d55|c0|q0';
    simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG] = 54;
    const pass = evaluateComputeTurnModuleManifestAnchorCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      55
    );
    assert.equal(pass.simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG], undefined);
  });
});
