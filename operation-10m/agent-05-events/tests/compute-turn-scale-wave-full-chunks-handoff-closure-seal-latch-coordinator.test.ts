import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG,
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealLatchCoordination,
} from '../src/index.ts';

describe('Compute turn scale wave full-chunks handoff closure seal latch coordination', () => {
  it('latches closure seal when closure sync commit and seal align', () => {
    const sealed = 't24|d74|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 74 });
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG] = 73;
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG] = sealed;

    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      74
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG], 74);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG], sealed);
    assert.equal(pass.narrative.telemetry.scaleWaveFullChunksHandoffClosureSealLatches, 1);
    assert.equal(pass.narrative.telemetry.agent25FullChunksHandoffClosureSealWaveReadyPasses, 1);
  });

  it('clears closure seal latch when closure sync commit missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 78 });
    simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG] = 't23|d77|c0|q0';
    simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG] = 77;
    const pass = evaluateComputeTurnScaleWaveFullChunksHandoffClosureSealLatchCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      78
    );
    assert.equal(pass.simulation.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG], undefined);
  });
});
