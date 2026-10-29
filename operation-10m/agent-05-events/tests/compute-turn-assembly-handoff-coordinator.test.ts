import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG,
  OP10M_CLOSURE_SEAL_READY_FLAG,
  OP10M_INTEGRATION_SYNC_GATE_FLAG,
  OP10M_SYNC_MANIFEST_LATCH_FLAG,
  OP10M_TURN_COMPUTE_DIGEST_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnAssemblyHandoffCoordination,
} from '../src/index.ts';

describe('Compute turn assembly handoff coordination', () => {
  it('latches handoff when sync gate and seal align with digest', () => {
    const digest = 't7|d40|c0|q0';
    const seal = 't6|d39|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 40 });
    simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG] = 39;
    simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG] = seal;
    simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG] = digest;

    const pass = evaluateComputeTurnAssemblyHandoffCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      40
    );
    assert.equal(pass.simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG], 40);
    assert.equal(pass.simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG], digest);
    assert.equal(pass.narrative.telemetry.assemblyHandoffWaves, 1);
    assert.equal(pass.narrative.telemetry.syncManifestLatches, 1);
  });

  it('clears handoff when sync gate missing', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 45 });
    simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG] = 't5|d44|c0|q0';
    simulation.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG] = 't6|d45|c0|q0';
    simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG] = 44;
    const pass = evaluateComputeTurnAssemblyHandoffCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      45
    );
    assert.equal(pass.simulation.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG], undefined);
  });
});
