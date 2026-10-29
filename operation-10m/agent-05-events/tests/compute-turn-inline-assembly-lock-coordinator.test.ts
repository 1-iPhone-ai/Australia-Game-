import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_SLOT_READY_FLAG,
  OP10M_CHUNK_INLINE_READY_FLAG,
  OP10M_INLINE_ASSEMBLY_LOCK_FLAG,
  OP10M_MODULE_MANIFEST_ANCHOR_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnInlineAssemblyLockCoordination,
} from '../src/index.ts';

describe('Compute turn inline assembly lock coordination', () => {
  it('locks inline assembly when anchor and inline ready align', () => {
    const inline = 't10|d55|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 55 });
    simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG] = 54;
    simulation.flags[OP10M_CHUNK_INLINE_READY_FLAG] = inline;

    const pass = evaluateComputeTurnInlineAssemblyLockCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      55
    );
    assert.equal(pass.simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG], 55);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG], inline);
    assert.equal(pass.narrative.telemetry.inlineAssemblyLocks, 1);
    assert.equal(pass.narrative.telemetry.agent25SlotReadyPasses, 1);
  });

  it('clears lock when inline ready missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 60 });
    simulation.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG] = 59;
    simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG] = 59;
    const pass = evaluateComputeTurnInlineAssemblyLockCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      60
    );
    assert.equal(pass.simulation.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_SLOT_READY_FLAG], undefined);
  });
});
