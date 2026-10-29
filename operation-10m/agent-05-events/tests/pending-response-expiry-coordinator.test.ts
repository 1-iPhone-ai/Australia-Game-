import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_PENDING_BACKLOG_FLAG,
  OP10M_PENDING_EXPIRY_WAVE_FLAG,
  OP10M_PENDING_QUEUE_CLEARED_FLAG,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluatePendingResponseExpiryCoordination,
} from '../src/index.ts';

describe('Pending response expiry coordination', () => {
  it('drops expired dilemmas and sets expiry wave flag', () => {
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.pendingResponses.push({
      id: 'expired',
      chainId: 'c1',
      stagePhase: 'pressure',
      regionId: 'NSW',
      choiceIds: ['commit'],
      openedDay: 5,
      expiresDay: 10,
      snapshot: { day: 5, money: 1000, nationalStability: 70, activeCrisisCount: 1 },
    });
    const pass = evaluatePendingResponseExpiryCoordination(
      createDefaultOp10mSimulationSlice({ day: 12 }),
      narrative,
      12
    );
    assert.equal(pass.narrative.pendingResponses.length, 0);
    assert.equal(pass.simulation.flags[OP10M_PENDING_EXPIRY_WAVE_FLAG], 1);
    assert.equal(pass.narrative.telemetry.pendingResponsesExpired, 1);
    assert.equal(pass.narrative.telemetry.pendingQueueClears, 1);
    assert.equal(pass.simulation.flags[OP10M_PENDING_QUEUE_CLEARED_FLAG], 12);
  });

  it('clears backlog flag when queue drains after backlog', () => {
    let simulation = createDefaultOp10mSimulationSlice({ day: 20 });
    simulation.flags[OP10M_PENDING_BACKLOG_FLAG] = 4;
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.pendingResponses.push({
      id: 'soon',
      chainId: 'c2',
      stagePhase: 'signal',
      regionId: 'VIC',
      choiceIds: ['defer'],
      openedDay: 18,
      expiresDay: 19,
      snapshot: { day: 18, money: 1000, nationalStability: 70, activeCrisisCount: 0 },
    });
    const pass = evaluatePendingResponseExpiryCoordination(simulation, narrative, 20);
    assert.equal(pass.narrative.pendingResponses.length, 0);
    assert.equal(pass.simulation.flags[OP10M_PENDING_BACKLOG_FLAG], undefined);
    assert.ok(pass.log.some((l) => l.includes('backlog released')));
  });
});
