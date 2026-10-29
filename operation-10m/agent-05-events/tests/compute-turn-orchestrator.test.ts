import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  countActiveRuptureChains,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateComputeTurnDepth,
  OP10M_COMPUTE_PRESSURE_FLAG,
} from '../src/index.ts';

describe('Compute turn orchestrator', () => {
  it('queues deferred fallout when multiple ruptures active', () => {
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains.a = {
      chainId: 'a',
      phase: 'rupture',
      startedDay: 1,
      lastAdvancedDay: 5,
      stageCooldownUntilDay: 0,
    };
    narrative.activeChains.b = {
      chainId: 'b',
      phase: 'rupture',
      startedDay: 2,
      lastAdvancedDay: 5,
      stageCooldownUntilDay: 0,
    };
    assert.equal(countActiveRuptureChains(narrative), 2);
    const sim = createDefaultOp10mSimulationSlice({ day: 6 });
    const pass = evaluateComputeTurnDepth(sim, narrative, 4);
    assert.equal(pass.simulation.flags[OP10M_COMPUTE_PRESSURE_FLAG], 2);
    assert.equal(pass.narrative.turnCompute?.deferredMutations.length, 1);
  });
});
