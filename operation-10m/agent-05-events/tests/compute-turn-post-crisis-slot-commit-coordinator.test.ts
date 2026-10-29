import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_SLOT_READY_FLAG,
  OP10M_CHUNK_MANIFEST_SEALED_FLAG,
  OP10M_INLINE_ASSEMBLY_LOCK_FLAG,
  OP10M_POST_CRISIS_SLOT_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnPostCrisisSlotCommitCoordination,
} from '../src/index.ts';

describe('Compute turn post-crisis slot commit coordination', () => {
  it('commits slot when inline lock and agent25 slot ready align', () => {
    const slot = 't11|d60|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG] = 59;
    simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG] = slot;

    const pass = evaluateComputeTurnPostCrisisSlotCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG], 60);
    assert.equal(pass.simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG], slot);
    assert.equal(pass.narrative.telemetry.postCrisisSlotCommits, 1);
    assert.equal(pass.narrative.telemetry.chunkManifestSealedPasses, 1);
  });

  it('clears commit when inline lock missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 65 });
    simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG] = 't10|d64|c0|q0';
    simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG] = 64;
    const pass = evaluateComputeTurnPostCrisisSlotCommitCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      65
    );
    assert.equal(pass.simulation.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG], undefined);
  });
});
