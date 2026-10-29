import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_CLOSURE_SEAL_READY_FLAG,
  OP10M_COMPUTE_DRIFT_SETTLED_FLAG,
  OP10M_DIGEST_CLOSURE_LATCH_FLAG,
  OP10M_INTEGRATION_SYNC_GATE_FLAG,
  OP10M_STABILIZATION_CLOSURE_WAVE_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnIntegrationSyncCoordination,
} from '../src/index.ts';

describe('Compute turn integration sync coordination', () => {
  it('opens sync gate when closure latch and drift settled', () => {
    const digest = 't6|d35|c0|q0';
    let simulation = createDefaultOp10mSimulationSlice({ day: 35 });
    simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG] = 34;
    simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG] = digest;
    simulation.flags[OP10M_COMPUTE_DRIFT_SETTLED_FLAG] = 33;

    const pass = evaluateComputeTurnIntegrationSyncCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      35
    );
    assert.equal(pass.simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG], 35);
    assert.equal(pass.simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG], digest);
    assert.equal(pass.narrative.telemetry.integrationSyncGates, 1);
    assert.equal(pass.narrative.telemetry.closureSealReadyPasses, 1);
  });

  it('clears sync gate when drift not settled', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 40 });
    simulation.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG] = 39;
    simulation.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG] = 't5|d39|c0|q0';
    simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG] = 39;
    const pass = evaluateComputeTurnIntegrationSyncCoordination(
      simulation,
      createDefaultOp10mNarrativeEngineState(),
      40
    );
    assert.equal(pass.simulation.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG], undefined);
    assert.equal(pass.simulation.flags[OP10M_CLOSURE_SEAL_READY_FLAG], undefined);
  });
});
